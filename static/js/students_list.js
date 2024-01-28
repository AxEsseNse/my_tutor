function clearAddStudentForm() {
    console.log('Очистка формы добавления профиля студента')
    document.getElementById('student-add-form-login').value = ''
    document.getElementById('student-add-form-first-name').value = ''
    document.getElementById('student-add-form-second-name').value = ''
    document.getElementById('student-add-form-gender').value = 'парень'
    document.getElementById('student-add-form-lesson-price').value = ''
    document.getElementById('student-add-form-birthday') = '2013-09-13'
    document.getElementById('student-add-form-discord').value = ''
    document.getElementById('student-add-form-phone').value = ''
    document.getElementById('student-add-form-telegram').value = ''
    document.getElementById('student-add-form-whatsapp').value = ''
    document.getElementById('student-add-form-flash-msg').innerHTML = ''
}

class AddStudentForm {
    constructor(studentTable) {
        this.studentTable = studentTable
        this.users = []
        this.usersSelect = document.getElementById('student-add-form-login')

        this.inputLogin = document.getElementById('student-add-form-login')
        this.inputFirstName = document.getElementById('student-add-form-first-name')
        this.inputSecondName = document.getElementById('student-add-form-second-name')
        this.inputGender = document.getElementById('student-add-form-gender')
        this.inputLessonPrice = document.getElementById('student-add-form-lesson-price')
        this.inputBirthday = document.getElementById('student-add-form-birthday')
        this.inputDiscord = document.getElementById('student-add-form-discord')
        this.inputPhone = document.getElementById('student-add-form-phone')
        this.inputTelegram = document.getElementById('student-add-form-telegram')
        this.inputWhatsApp = document.getElementById('student-add-form-whatsapp')

        this.flashMsg = document.getElementById('student-add-form-flash-msg')

        this.btnAddStudent = document.getElementById('student-add-form-button')
        this.btnAddStudent.onclick = () => {
            this.addStudent()
        }
    }

    loadUsers() {
        return fetch('/api/admin/users/no_profile/', {
        method: 'GET',
        })
        .then(response => response.json())
        .then(users => {
            this.users = users
        })
        .catch(error => {
        console.error(error)
        })
    }

    setUsersSelectOptions() {
        this.loadUsers()
        .then(() => {
            for (const user of this.users) {
                const option = document.createElement('option')
                option.value = user.login
                option.innerText = user.login

                this.usersSelect.append(option)
            }

            this.usersSelect.options[0].selected = true
        })
    }

    addStudent() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        if (this.inputLogin.value == '') {
            return
        }

        const newStudent = {
            studentLogin: this.inputLogin.value,
            firstName: this.inputFirstName.value,
            secondName: this.inputSecondName.value,
            gender: this.inputGender.value,
            lessonPrice: this.inputLessonPrice.value,
            birthday: this.inputBirthday.value,
            discord: this.inputDiscord.value,
            phone: this.inputPhone.value,
            telegram: this.inputTelegram.value,
            whatsApp: this.inputWhatsApp.value,
        }

        fetch('/api/admin/students/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'My-Tutor-Auth-Token': token
            },
            body: JSON.stringify(newStudent),
        })
        .then(response => {
            if (!response.ok) {
                if (!(response.status == 400)) {
                    return Promise.reject(response.text())
                }
            }
            return Promise.resolve(response.text())
        })
        .then(text => {
            return JSON.parse(text)
        })
        .then(student => {
            if (student.hasOwnProperty('first_name')) {
                console.log(student.message)
                const body = this.studentTable.table.tBodies[0]
                const row = body.insertRow()
                this.studentTable.fillRow(row, student)

                flashMsg(
                    `Для пользователя "${student.student_login}" создан профиль студента`,
                    this.flashMsg,
                    'success',
                )
            } else {
                flashMsg(student.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class StudentFormDelete {
    constructor(delRow) {
        this.delRow = delRow

        this.secondName = delRow.childNodes[1].innerText
        this.firstName = delRow.childNodes[2].innerText
        this.phone = delRow.childNodes[7].innerText

        this.inputSecondName = document.getElementById('student-delete-form-second-name')
        this.inputFirstName = document.getElementById('student-delete-form-first-name')
        this.inputPhone = document.getElementById('student-delete-form-phone')

        this.flashMsg = document.getElementById('student-delete-form-flash-msg')

        this.btnDeleteStudent = document.getElementById('student-delete-form-button')
        this.btnDeleteStudent.onclick = () => {
            this.deleteStudent()
        }
    }

    fillDeleteForm() {
        this.inputSecondName.value = this.secondName
        this.inputFirstName.value = this.firstName
        this.inputPhone.value = this.phone
        this.flashMsg.innerHTML = ''
        this.btnDeleteStudent.disabled = false
    }

    deleteStudent(delRow) {
        const deleteUser = {
            phone: this.phone,
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/admin/students/${this.phone}/`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            'My-Tutor-Auth-Token': token
            },
            body: JSON.stringify(deleteUser),
        })
        .then(response => {
            if (!response.ok) {
                if (!(response.status == 404)) {
                    return Promise.reject(response.text())
                }
            }
            return Promise.resolve(response.text())
        })
        .then(text => {
            return JSON.parse(text)
        })
        .then(deleteUser => {
            if (deleteUser.hasOwnProperty('name')) {
                console.log(deleteUser.message)
                this.delRow.parentElement.removeChild(this.delRow)
                flashMsg(`Профиль студента "${deleteUser.name}"  удалён`, this.flashMsg, 'success')
                this.btnDeleteStudent.disabled = true
            } else {
                flashMsg(deleteUser.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class StudentTable {
    constructor() {
        this.table = document.getElementById('students-table')
    }
    loadStudents() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch('/api/admin/students/', {
            method: 'GET',
            headers: {
            'My-tutor-Auth-Token': token
            }
        })
        .then(response => response.json())
        .then(data => {
            this.fillTable(data)
        })
        .catch(error => {
            console.error(error)
        })
    }

    fillTable(students) {
        const body = this.table.tBodies[0]
        body.innerHTML = ''

        students.forEach(student => {
            const row = body.insertRow()
            this.fillRow(row, student)
        })
    }

    fillRow(row, student) {
        const studentImage = document.createElement('img')
        studentImage.src = student.img_path
        studentImage.style.display = 'block'
        studentImage.classList.add('rounded-circle')
        studentImage.width = 50
        studentImage.height = 50
        this.addCell(row, studentImage)

        this.addCell(row, student.second_name)
        this.addCell(row, student.first_name)
        this.addCell(row, student.gender)
        this.addCell(row, student.age)
        this.addCell(row, student.lesson_price)
        this.addCell(row, student.discord)
        this.addCell(row, student.phone)
        this.addCell(row, student.telegram)
        this.addCell(row, student.whatsapp)

        const controllers = document.createElement('div')
        controllers.classList.add('text-end')
        controllers.style.right = '0px'
        controllers.appendChild(this.createDeleteButton(row))
        this.addCell(row, controllers)
    }

    addCell(row, content) {
        let cell = row.insertCell()
        cell.classList.add('align-middle')
        if (typeof content === 'object') {
            cell.appendChild(content)
        } else {
            cell.innerHTML = content
            cell.classList.add('small')
        }
    }

    createDeleteButton(row) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'btn-sm', 'btn-danger')
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Удалить профиль студента')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-student-delete')
        btn.innerHTML = '<i class="fa-solid fa-trash text-dark"></i>'
        btn.onclick = () => {
            const form = new StudentFormDelete(row)
            form.fillDeleteForm()
        }

        return btn
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    const studentTable = new StudentTable()
    studentTable.loadStudents()
    const AddStudent = new AddStudentForm(studentTable)
    AddStudent.setUsersSelectOptions()
})