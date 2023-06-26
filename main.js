const studentsAPI = "https://6499635779fbe9bcf83f2553.mockapi.io/api/v1/students";

function start() {
    getStudent((students) => {
        renderStudents(students);
    });

    handlePostForm();
}

start();

function getStudent(callback) {
    fetch(studentsAPI)
        .then((response) => response.json())
        .then(callback);
}

function renderStudents(students) {
    var studentTableBody = document.querySelector("#student-table tbody");
    var count = 1;
    var htmls = students.map(
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
        .then(() =>
            getStudent((students) => {
                renderStudents(students);
            })
        );
}

function handleDeleteStudent(id) {
    fetch(studentsAPI + "/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then(() =>
            getStudent((students) => {
                renderStudents(students);
            })
        );
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
        .then(() =>
            getStudent((students) => {
                renderStudents(students);
            })
        );
}

function handlePostForm() {
    var postForm = document.querySelector("#post-form");
    var postBtn = postForm.querySelector("#post-btn");

    postForm.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    postBtn.onclick = function () {
        var name = postForm.querySelector('input[name="name"]').value;
        var genderRadios = postForm.querySelectorAll('input[name="gender"]');
        var dateOfBirth = postForm.querySelector('input[name="dateOfBirth"]').value;
        var address = postForm.querySelector('input[name="address"]').value;
        var phoneNumberInput = postForm.querySelector('input[name="phoneNumber"]');
        var phoneNumber = phoneNumberInput.value;
        var emailInput = postForm.querySelector('input[name="email"]');
        var email = emailInput.value;

        if (name && genderRadios && dateOfBirth) {
            var phoneNumberPattern = /^0\d{9}$/;
            if (phoneNumber === "" || phoneNumberPattern.test(phoneNumber)) {
                phoneNumberInput.setCustomValidity("");
                if (email === "" || emailInput.checkValidity()) {
                    var newStudent = {
                        name: name,
                        gender: getSelectedGender(genderRadios),
                        dateOfBirth: dateOfBirth,
                        address: address,
                        phoneNumber: phoneNumber,
                        email: email,
                    };
                    handlePostStudent(newStudent);
                    alert("Thêm thành công");
                }
            } else {
                phoneNumberInput.setCustomValidity("Số điện thoại không hợp lệ");
            }
        }
    };
}

function handlePutForm(id) {
    var overlay = document.querySelector(".overlay");
    var putForm = document.querySelector("#put-form");

    overlay.classList.add("active");
    putForm.classList.add("active");

    overlay.onclick = () => {
        overlay.classList.remove("active");
        putForm.classList.remove("active");
    };

    putForm.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    var confirmPutBtn = putForm.querySelector("#confirm-put-btn");

    confirmPutBtn.onclick = function () {
        var name = putForm.querySelector('input[name="name"]').value;
        var genderRadios = putForm.querySelectorAll('input[name="gender"]');
        var dateOfBirth = putForm.querySelector('input[name="dateOfBirth"]').value;
        var address = putForm.querySelector('input[name="address"]').value;
        var phoneNumberInput = putForm.querySelector('input[name="phoneNumber"]');
        var phoneNumber = phoneNumberInput.value;
        var emailInput = putForm.querySelector('input[name="email"]');
        var email = emailInput.value;

        if (name && genderRadios && dateOfBirth) {
            var phoneNumberPattern = /^0\d{9}$/;
            if (phoneNumber === "" || phoneNumberPattern.test(phoneNumber)) {
                phoneNumberInput.setCustomValidity("");
                if (email === "" || emailInput.checkValidity()) {
                    var newStudent = {
                        name: name,
                        gender: getSelectedGender(genderRadios),
                        dateOfBirth: dateOfBirth,
                        address: address,
                        phoneNumber: phoneNumber,
                        email: email,
                    };
                    handlePutStudent(id, newStudent);
                    overlay.classList.remove("active");
                    putForm.classList.remove("active");
                }
            } else {
                phoneNumberInput.setCustomValidity("Số điện thoại không hợp lệ");
            }
        }
    };

    fillPutForm(id);
}

function fillPutForm(id) {
    // Lấy dữ liệu sinh viên từ bảng
    var student = getStudentById(id);
    // Gán giá trị vào các trường nhập liệu trong form
    var putForm = document.querySelector("#put-form");
    putForm.querySelector('input[name="name"]').value = student.name;
    putForm.querySelector('input[value="' + student.gender + '"]').checked = true;
    putForm.querySelector('input[name="dateOfBirth"]').value = formatDateForInput(student.dateOfBirth);
    putForm.querySelector('input[name="address"]').value = student.address;
    putForm.querySelector('input[name="phoneNumber"]').value = student.phoneNumber;
    putForm.querySelector('input[name="email"]').value = student.email;
}

function getStudentById(id) {
    // Lấy danh sách sinh viên từ bảng
    var studentTableBody = document.querySelector("#student-table tbody");
    var studentRows = studentTableBody.querySelectorAll("tr");

    // Tìm sinh viên theo id
    for (var i = 0; i < studentRows.length; i++) {
        var studentId = studentRows[i].querySelector("td:nth-child(2)").textContent;
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

function getSelectedGender(genderRadios) {
    var selectedGender = "";

    for (var i = 0; i < genderRadios.length; i++) {
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
    var parts = date.split("/");

    var day = parts[0];
    var month = parts[1];
    var year = parts[2];

    var formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}
