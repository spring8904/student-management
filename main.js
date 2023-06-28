const studentsAPI = "https://6499635779fbe9bcf83f2553.mockapi.io/api/v1/students";

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
    const studentTableBody = document.querySelector("#student-table tbody");
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
            showNotice("Thêm thành công");
        });
}

function handleDeleteStudent(id) {
    fetch(studentsAPI + "/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then(() => {
            getStudents(renderStudents);
            showNotice("Xóa thành công");
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
            showNotice("Sửa thành công");
        });
}

function handlePostForm() {
    const postForm = document.querySelector("#post-form");
    const postBtn = postForm.querySelector("#post-btn");

    postForm.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    postBtn.onclick = function () {
        const name = postForm.querySelector('input[name="name"]').value;
        const genderRadios = postForm.querySelectorAll('input[name="gender"]');
        const selectedGender = getSelectedGender(genderRadios);
        const dateOfBirth = postForm.querySelector('input[name="dateOfBirth"]').value;
        const address = postForm.querySelector('input[name="address"]').value;
        const phoneNumber = postForm.querySelector('input[name="phoneNumber"]').value;
        const email = postForm.querySelector('input[name="email"]').value;

        if (!name) {
            showNotice("Bạn cần nhập họ tên!");
            return;
        }

        if (!selectedGender) {
            showNotice("Bạn cần chọn giới tính!");
            return;
        }

        if (!dateOfBirth) {
            showNotice("Bạn cần nhập ngày sinh!");
            return;
        }

        if (!(phoneNumber === "" || isPhoneNumber(phoneNumber))) {
            showNotice("Số điện thoại không hợp lệ!");
            return;
        }

        if (!(email === "" || isEmail(email))) {
            showNotice("Email không hợp lệ");
            return;
        }

        const newStudent = {
            name,
            gender: selectedGender,
            dateOfBirth,
            address,
            phoneNumber,
            email,
        };

        handlePostStudent(newStudent);
    };
}

function handlePutForm(id) {
    const overlay = document.querySelector(".overlay");
    const putForm = document.querySelector("#put-form");
    const confirmPutBtn = putForm.querySelector("#confirm-put-btn");

    putForm.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    overlay.classList.add("active");
    putForm.classList.add("active");

    overlay.onclick = () => {
        overlay.classList.remove("active");
        putForm.classList.remove("active");
    };

    fillPutForm(id);

    confirmPutBtn.onclick = function () {
        const name = putForm.querySelector('input[name="name"]').value;
        const genderRadios = putForm.querySelectorAll('input[name="gender"]');
        const selectedGender = getSelectedGender(genderRadios);
        const dateOfBirth = putForm.querySelector('input[name="dateOfBirth"]').value;
        const address = putForm.querySelector('input[name="address"]').value;
        const phoneNumber = putForm.querySelector('input[name="phoneNumber"]').value;
        const email = putForm.querySelector('input[name="email"]').value;

        if (!name) {
            return alert("Bạn cần nhập họ tên!");
        }

        if (!selectedGender) {
            return alert("Bạn cần chọn giới tính!");
        }

        if (!dateOfBirth) {
            return alert("Bạn cần nhập ngày sinh!");
        }

        if (!(phoneNumber === "" || isPhoneNumber(phoneNumber))) {
            return alert("Số điện thoại không hợp lệ!");
        }

        if (!(email === "" || isEmail(email))) {
            return alert("Email không hợp lệ!");
        }

        const newStudent = {
            name,
            gender: selectedGender,
            dateOfBirth,
            address,
            phoneNumber,
            email,
        };

        handlePutStudent(id, newStudent);
        putForm.classList.remove("active");
    };
}

function getSelectedGender(genderRadios) {
    let selectedGender = "";

    for (let i = 0; i < genderRadios.length; i++) {
        if (genderRadios[i].checked) {
            selectedGender = genderRadios[i].value;
            break;
        }
    }

    return selectedGender;
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

function isPhoneNumber(number) {
    const phoneNumberPattern = /^0\d{9}$/;
    return phoneNumberPattern.test(number);
}

function isEmail(string) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(string);
}

function showNotice(text) {
    const overlay = document.querySelector(".overlay");
    const notice = document.querySelector(".notice");
    const noticeContent = document.querySelector(".notice .content");
    const noticeBtn = document.querySelector(".notice-btn .btn");

    overlay.classList.add("active");
    notice.classList.add("active");
    noticeContent.innerText = text;

    overlay.onclick = () => {
        overlay.classList.remove("active");
        notice.classList.remove("active");
    };

    noticeBtn.onclick = () => {
        overlay.classList.remove("active");
        notice.classList.remove("active");
    };
}

function fillPutForm(id) {
    // Lấy dữ liệu sinh viên từ bảng
    const student = getStudentById(id);
    // Gán giá trị vào các trường nhập liệu trong form
    const putForm = document.querySelector("#put-form");
    putForm.querySelector('input[name="name"]').value = student.name;
    putForm.querySelector('input[value="' + student.gender + '"]').checked = true;
    putForm.querySelector('input[name="dateOfBirth"]').value = formatDateForInput(student.dateOfBirth);
    putForm.querySelector('input[name="address"]').value = student.address;
    putForm.querySelector('input[name="phoneNumber"]').value = student.phoneNumber;
    putForm.querySelector('input[name="email"]').value = student.email;
}

function getStudentById(id) {
    // Lấy danh sách sinh viên từ bảng
    const studentTableBody = document.querySelector("#student-table tbody");
    const studentRows = studentTableBody.querySelectorAll("tr");

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
