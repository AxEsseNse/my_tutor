class StudentFormAdd {
    constructor(studentTable) {
        this.showStudentFormAddButton = document.getElementById('btn-add-student')
        this.studentTable = studentTable
        this.users = []
        this.usersSelect = document.getElementById('student-add-form-login')

        this.inputField = document.getElementById('student-add-form-input-field')
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

    clearStudentFormAdd() {
        console.log('Очистка формы добавления профиля студента')
        this.inputLogin.value = ''
        this.inputFirstName.value = ''
        this.inputSecondName.value = ''
        this.inputGender.value = 'парень'
        this.inputLessonPrice.value = ''
        this.inputBirthday.value = '2013-09-13'
        this.inputDiscord.value = ''
        this.inputPhone.value = ''
        this.inputTelegram.value = ''
        this.inputWhatsApp.value = ''
        this.flashMsg.innerHTML = ''

        if (!this.inputField.classList.contains('hidden-field')) {
            this.inputField.classList.add('hidden-field')
        }
    }

    loadUsers() {
        return fetch('/api/admin/users/students_without_profile/', {
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

            if (this.users.length == 0) {
                this.showStudentFormAddButton.classList.add('hidden-field')
                return
            } else {
                this.showStudentFormAddButton.onclick = () => {
                    this.clearStudentFormAdd()
                }
            }

            const emptyOption = document.createElement('option')
            emptyOption.value = ""
            emptyOption.hidden = true
            emptyOption.disabled = true
            emptyOption.selected = true
            emptyOption.innerText = "Выберите ученика"
            this.usersSelect.append(emptyOption)

            for (const user of this.users) {
                const option = document.createElement('option')
                option.value = user.login
                option.innerText = user.login
                this.usersSelect.append(option)
            }
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



        this.inputStudentId = document.getElementById('student-delete-form-student-id')
        this.inputSecondName = document.getElementById('student-delete-form-second-name')
        this.inputFirstName = document.getElementById('student-delete-form-first-name')

        this.flashMsg = document.getElementById('student-delete-form-flash-msg')

        this.btnDeleteStudent = document.getElementById('student-delete-form-button')
        this.btnDeleteStudent.onclick = () => {
            this.deleteStudent()
        }
    }

    fillDeleteForm() {
        this.inputStudentId.value = this.delRow.childNodes[1].innerText
        this.inputSecondName.value = this.delRow.childNodes[2].innerText
        this.inputFirstName.value = this.delRow.childNodes[3].innerText
        this.flashMsg.innerHTML = ''
        this.btnDeleteStudent.disabled = false
    }

    deleteStudent() {
        const deleteStudent = {
            studentId: this.inputStudentId.value,
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/admin/student/${this.inputStudentId.value}/`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            'My-Tutor-Auth-Token': token
            },
            body: JSON.stringify(deleteStudent),
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
        .then(deletedStudent => {
            if (deletedStudent.hasOwnProperty('name')) {
                console.log(deletedStudent.message)
                this.delRow.parentElement.removeChild(this.delRow)
                flashMsg(`Профиль студента "${deletedStudent.name}"  удалён`, this.flashMsg, 'success')
                this.btnDeleteStudent.disabled = true
            } else {
                flashMsg(deletedStudent.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class StudentFormUpdate {
    constructor(updateRow, studentTable) {
        this.studentTable = studentTable
        this.updateRow = updateRow

        this.inputStudentId = document.getElementById('student-update-form-student-id')
        this.inputFirstName = document.getElementById('student-update-form-first-name')
        this.inputSecondName = document.getElementById('student-update-form-second-name')
        this.inputGender = document.getElementById('student-update-form-gender')
        this.inputLessonPrice = document.getElementById('student-update-form-lesson-price')
        this.inputBirthday = document.getElementById('student-update-form-birthday')
        this.inputDiscord = document.getElementById('student-update-form-discord')
        this.inputPhone = document.getElementById('student-update-form-phone')
        this.inputTelegram = document.getElementById('student-update-form-telegram')
        this.inputWhatsApp = document.getElementById('student-update-form-whatsapp')

        this.flashMsg = document.getElementById('student-update-form-flash-msg')

        this.btnUpdateStudent = document.getElementById('student-update-form-button')
        this.btnUpdateStudent.onclick = () => {
            this.updateStudent()
        }
        this.fillUpdateForm()
    }

    fillUpdateForm() {
        this.inputStudentId.value = this.updateRow.childNodes[1].innerText
        this.inputFirstName.value = this.updateRow.childNodes[3].innerText
        this.inputSecondName.value = this.updateRow.childNodes[2].innerText
        this.inputGender.value = this.updateRow.childNodes[4].innerText
        this.inputLessonPrice.value = this.updateRow.childNodes[6].innerText
        this.inputBirthday.value = this.convertDateToInputValue(this.updateRow.childNodes[5].innerText)
        this.inputDiscord.value = this.updateRow.childNodes[7].innerText
        this.inputPhone.value = this.updateRow.childNodes[8].innerText
        this.inputTelegram.value = this.updateRow.childNodes[9].innerText
        this.inputWhatsApp.value = this.updateRow.childNodes[10].innerText

        this.flashMsg.innerHTML = ''
    }

    convertDateToInputValue(notFormattedDateStr) {
        notFormattedDateStr = notFormattedDateStr.split(' ')[0]
        const parts = notFormattedDateStr.split(".")
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
    }

    updateStudent() {
        const updateUser = {
            studentId: this.inputStudentId.value,
            firstName: this.inputFirstName.value,
            secondName: this.inputSecondName.value,
            gender: this.inputGender.value,
            lessonPrice: this.inputLessonPrice.value,
            birthday: this.inputBirthday.value,
            discord: this.inputDiscord.value,
            phone: this.inputPhone.value,
            telegram: this.inputTelegram.value,
            whatsapp: this.inputWhatsApp.value
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/admin/student/${this.inputStudentId.value}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'My-Tutor-Auth-Token': token
            },
            body: JSON.stringify(updateUser),
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
        .then(updatedUser => {
            if (updatedUser.hasOwnProperty('first_name')) {
                console.log(updatedUser.message)
                this.updateRow.innerHTML = ''
                this.studentTable.fillRow(this.updateRow, updatedUser)
                flashMsg(updatedUser.message, this.flashMsg, 'success')
            } else {
                flashMsg(updatedUser.message, this.flashMsg, 'wrong')
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
            console.log(data)
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
        studentImage.style.objectFit = 'cover'
        studentImage.classList.add('rounded-circle')
        studentImage.width = 50
        studentImage.height = 50
        this.addCell(row, studentImage)

        this.addCell(row, student.student_id)
        this.addCell(row, student.second_name)
        this.addCell(row, student.first_name)
        this.addCell(row, student.gender)
        this.addCell(row, this.formatBirthdayWithAge(student.birthday))
        this.addCell(row, student.lesson_price)
        this.addCell(row, student.discord)
        this.addCell(row, student.phone)
        this.addCell(row, student.telegram)
        this.addCell(row, student.whatsapp)

        const controllers = document.createElement('div')
        controllers.classList.add('text-end')
        controllers.style.right = '0px'
        controllers.appendChild(this.createUpdateButton(row))
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

    formatBirthdayWithAge(birthdayStr) {
        const birthday = new Date(birthdayStr);
        const ageDifMs = Date.now() - birthday.getTime();
        const ageDate = new Date(ageDifMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        return `${birthdayStr.split('-').reverse().join('.')} (${age})`;
    }

    createUpdateButton(row) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'btn-sm', 'btn-warning')
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Изменить данные студента')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-student-update')
        btn.innerHTML = '<i class="fa-solid fa-pen text-dark"></i>'
        btn.onclick = () => {
            const form = new StudentFormUpdate(row, this)
            form.fillUpdateForm()
        }

        return btn
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
    const studentFormAdd = new StudentFormAdd(studentTable)
    studentFormAdd.setUsersSelectOptions()

    studentFormAdd.inputLogin.addEventListener('change', () => {
        studentFormAdd.inputField.classList.remove('hidden-field')
    });
})