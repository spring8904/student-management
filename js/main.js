const studentsAPI = "https://6499635779fbe9bcf83f2553.mockapi.io/api/v1/students";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function start() {
    getStudents(renderStudents);
    handlePostForm();
}

start();

//--- Functions
function getStudents(callback) {
    fetch(studentsAPI)
        .then((response) => response.json())
        .then(callback);
}

function renderStudents(students) {
    const studentTableBody = $("#student-table tbody");
    let count = 1;
    const htmls = students.map(
        (student) => `<tr>
        <td>${count++}</td>
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.gender}</td>
        <td>${formatDate(student.dateOfBirth)}</td>
        <td>${student.address}</td>
        <td>${student.phoneNumber}</td>
        <td>${student.email}</td>
        <td><button class="btn btn--yellow" onclick="handlePutForm(${student.id})">Sửa</button></td>
        <td><button class="btn btn--red" onclick="handleDeleteStudent(${student.id})">Xóa</button></td>
    </tr>`
    );
    studentTableBody.innerHTML = htmls.join("");
}

function handlePostStudent(data) {
    fetch(studentsAPI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then(() => {
            getStudents(renderStudents);
            showAlert("Thêm thành công");
        });
}

function handleDeleteStudent(id) {
    showConfirm("Xác nhận xóa thông tin", (result) => {
        if (result) {
            fetch(studentsAPI + "/" + id, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then(() => {
                    getStudents(renderStudents);
                    showAlert("Xóa thành công");
                });
        }
    });
}

function handlePutStudent(id, data) {
    fetch(studentsAPI + "/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then(() => {
            getStudents(renderStudents);
            showAlert("Sửa thành công");
        });
}

function handlePostForm() {
    validator({
        form: ".post-form__main",
        formGroupSelector: ".form-group",
        errorSelector: ".form-message",
        rules: [
            validator.isRequired("#name", "Vui lòng nhập tên đầy đủ của bạn"),
            validator.isRequired("#date-of-birth", "Vui lòng nhập ngày sinh của bạn"),
            validator.isSelected("input[name='gender']", "Vui lòng chọn giới tính phù hợp"),
            validator.isEmail("#email"),
            validator.isPhoneNumber("#phone-number"),
        ],
        onSubmit(data) {
            handlePostStudent(data);
        },
    });
}

function handlePutForm(id) {
    const overlay = $(".overlay");
    const putForm = $("#put-form");

    overlay.classList.add("active");
    putForm.classList.add("active");

    overlay.onclick = () => {
        overlay.classList.remove("active");
        putForm.classList.remove("active");
    };

    fillPutForm(id);

    validator({
        form: ".put-form__main",
        formGroupSelector: ".form-group",
        errorSelector: ".form-message",
        rules: [
            validator.isRequired("#name", "Vui lòng nhập tên đầy đủ của bạn"),
            validator.isRequired("#date-of-birth", "Vui lòng nhập ngày sinh của bạn"),
            validator.isSelected("input[name='gender']", "Vui lòng chọn giới tính phù hợp"),
            validator.isEmail("#email"),
            validator.isPhoneNumber("#phone-number"),
        ],
        onSubmit(data) {
            handlePutStudent(id, data);
            putForm.classList.remove("active");
        },
    });
}

function formatDate(date) {
    const selectedDate = new Date(date);

    const day = selectedDate.getDate().toString().padStart(2, "0");
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = selectedDate.getFullYear().toString().padStart(4, "0");

    return `${day}/${month}/${year}`;
}

function formatDateForInput(date) {
    const parts = date.split("/");

    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

function showAlert(text) {
    const overlay = $(".overlay");
    const alert = $(".alert");
    const alertContent = $(".alert .content");
    const alertBtn = $(".alert-btn .btn");

    overlay.classList.add("active");
    alert.classList.add("active");
    alertContent.innerText = text;

    overlay.onclick = () => {
        overlay.classList.remove("active");
        alert.classList.remove("active");
    };

    alertBtn.onclick = () => {
        overlay.classList.remove("active");
        alert.classList.remove("active");
    };
}

function showConfirm(text, callback) {
    const overlay = $(".overlay");
    const confirm = $(".confirm");
    const confirmContent = $(".confirm .content");
    const confirmBtn = $(".confirm-btn .btn--blue");
    const cancelBtn = $(".confirm-btn .btn--white");

    overlay.classList.add("active");
    confirm.classList.add("active");
    confirmContent.innerText = text;

    overlay.onclick = () => {
        overlay.classList.remove("active");
        confirm.classList.remove("active");
        callback(false);
    };

    cancelBtn.onclick = () => {
        overlay.classList.remove("active");
        confirm.classList.remove("active");
        callback(false);
    };

    confirmBtn.onclick = () => {
        confirm.classList.remove("active");
        callback(true);
    };
}

function fillPutForm(id) {
    // Lấy dữ liệu sinh viên từ bảng
    const student = getStudentById(id);
    // Gán giá trị vào các trường nhập liệu trong form
    $('#put-form input[name="name"]').value = student.name;
    $('#put-form input[value="' + student.gender + '"]').checked = true;
    $('#put-form input[name="dateOfBirth"]').value = formatDateForInput(student.dateOfBirth);
    $('#put-form input[name="address"]').value = student.address;
    $('#put-form input[name="phoneNumber"]').value = student.phoneNumber;
    $('#put-form input[name="email"]').value = student.email;
}

function getStudentById(id) {
    // Lấy danh sách sinh viên từ bảng
    const studentRows = $$("#student-table tbody tr");

    // Tìm sinh viên theo id
    for (let i = 0; i < studentRows.length; i++) {
        const studentId = studentRows[i].querySelector("td:nth-child(2)").textContent;
        if (studentId === id.toString()) {
            // Trả về dữ liệu sinh viên
            return {
                name: studentRows[i].querySelector("td:nth-child(3)").textContent,
                gender: studentRows[i].querySelector("td:nth-child(4)").textContent,
                dateOfBirth: studentRows[i].querySelector("td:nth-child(5)").textContent,
                address: studentRows[i].querySelector("td:nth-child(6)").textContent,
                phoneNumber: studentRows[i].querySelector("td:nth-child(7)").textContent,
                email: studentRows[i].querySelector("td:nth-child(8)").textContent,
            };
        }
    }

    return null;
}
