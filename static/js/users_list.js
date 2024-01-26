function checkLogin(login) {
  if (login.length < 5) {
    return 'Логин не должен быть меньше 5 символов'
  }
  if (login.length > 15) {
    return 'Логин не должен быть больше 15 символов'
  }
  return NaN
}

function clearAddUserForm() {
    console.log('Очистка формы добавления пользователя')
    document.getElementById('user-add-form-login').value = ''
    document.getElementById('user-add-form-role').value = 'student'
    document.getElementById('user-add-form-password').value = ''
    document.getElementById('user-add-form-password-re').value = ''
    document.getElementById('user-add-form-flash-msg').innerHTML = ''
}

class AddUserForm {
    constructor(userTable) {
        this.userTable = userTable

        this.inputLogin = document.getElementById('user-add-form-login')
        this.inputPsw = document.getElementById('user-add-form-password')
        this.inputPswRe = document.getElementById('user-add-form-password-re')
        this.inputRole = document.getElementById('user-add-form-role')

        this.flashMsg = document.getElementById('user-add-form-flash-msg')

        this.btnAddUser = document.getElementById('user-add-form-button')
        this.btnAddUser.onclick = () => {
            this.addUser()
        }
    }

    addUser() {
        const checkLog = checkLogin(this.inputLogin.value)
        if (checkLog) {
            flashMsg(checkLog, this.flashMsg, 'wrong')
        return
        }

        const checkPsw = checkPasswords(this.inputPsw.value, this.inputPswRe.value)
        if (checkPsw) {
            flashMsg(checkPsw, this.flashMsg, 'wrong')
        return
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        const newUser = {
            login: this.inputLogin.value,
            password: this.inputPsw.value,
            role: this.inputRole.value,
        }

        fetch('/api/admin/users', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'My-Tutor-Auth-Token': token
            },
            body: JSON.stringify(newUser),
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
        .then(user => {
            if (user.hasOwnProperty('login')) {
                console.log(user.message)
                const body = this.userTable.table.tBodies[0]
                const row = body.insertRow()
                this.userTable.fillRow(row, user)

                flashMsg(
                    `Пользователь "${user.login}" зарегистрирован. Права доступа: "${user.role}"`,
                    this.flashMsg,
                    'success',
                )
            } else {
                flashMsg(user.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class UpdateUserPasswordForm {
    constructor(login) {
        this.login = login

        this.inputLogin = document.getElementById('user-change-password-form-login')
        this.inputPsw = document.getElementById('user-change-password-form-password')
        this.inputPswRe = document.getElementById('user-change-password-form-password-re')

        this.flashMsg = document.getElementById('user-change-password-form-flash-msg')

        this.btnUpdatePassword = document.getElementById('user-change-password-form-button')
        this.btnUpdatePassword.onclick = () => {
            this.updateUserPassword()
        }
    }

    fillUpdateUserPasswordForm() {
        this.inputLogin.value = this.login
        this.inputPsw.value = ''
        this.inputPswRe.value = ''
        this.flashMsg.innerHTML = ''
    }

    updateUserPassword() {
        const checkPsw = checkPasswords(this.inputPsw.value, this.inputPswRe.value)

        if (checkPsw) {
            flashMsg(checkPsw, this.flashMsg, 'wrong')
            return
        }

        const newUserPassword = {
            login: this.login,
            password: this.inputPsw.value,
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/admin/users/${this.login}/`, {
            method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'My-Tutor-Auth-Token': token
                },
                body: JSON.stringify(newUserPassword),
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
        .then(response => {
            if (response.hasOwnProperty('login')) {
                flashMsg(`Пароль пользователя "${this.login}" успешно изменен`, this.flashMsg, 'success')
                console.log(response.message)
            } else {
                flashMsg(response.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class UserFormDelete {
    constructor(delRow) {
        this.delRow = delRow

        this.login = delRow.childNodes[1].innerText
        this.role = delRow.childNodes[2].innerText

        this.inputLogin = document.getElementById('user-delete-form-login')
        this.inputRole = document.getElementById('user-delete-form-role')

        this.flashMsg = document.getElementById('user-delete-form-flash-msg')

        this.btnDeleteUser = document.getElementById('user-delete-form-button')
        this.btnDeleteUser.onclick = () => {
            this.deleteUser()
        }
    }

    fillDeleteForm() {
        this.inputLogin.value = this.login
        this.inputRole.value = this.role
        this.flashMsg.innerHTML = ''
        this.btnDeleteUser.disabled = false
    }

    deleteUser(delRow) {
        const deleteUser = {
            login: this.login,
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/admin/users/${this.login}/`, {
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
            if (deleteUser.hasOwnProperty('login')) {
                console.log(deleteUser.message)
                this.delRow.parentElement.removeChild(this.delRow)
                flashMsg(`Пользователь "${deleteUser.login}" с правами доступа "${deleteUser.role}" удалён`, this.flashMsg, 'success')
                this.btnDeleteUser.disabled = true
            } else {
                flashMsg(deleteUser.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class AddStudentProfileForm {
    constructor(login, updateRow, addStudentController) {
        this.login = login
        this.updateRow = updateRow
        this.addStudentController = addStudentController

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

    fillAddStudentProfileForm() {
        console.log('Подготовка формы добавления профиля студента')
        document.getElementById('student-add-form-login').value = this.login
        document.getElementById('student-add-form-first-name').value = ''
        document.getElementById('student-add-form-second-name').value = ''
        document.getElementById('student-add-form-gender').value = 'парень'
        document.getElementById('student-add-form-lesson-price').value = ''
        document.getElementById('student-add-form-birthday').value = '2013-09-13'
        document.getElementById('student-add-form-discord').value = ''
        document.getElementById('student-add-form-phone').value = ''
        document.getElementById('student-add-form-telegram').value = ''
        document.getElementById('student-add-form-whatsapp').value = ''
        document.getElementById('student-add-form-flash-msg').innerHTML = ''
    }

    addStudent() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
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
                const controllers = this.updateRow.querySelector('.text-end');
                controllers.removeChild(this.addStudentController);
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

class UserTable {
    constructor() {
        this.table = document.getElementById('users-table')
    }
    loadUsers() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch('/api/admin/users/', {
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

    fillTable(users) {
        const body = this.table.tBodies[0]
        body.innerHTML = ''

        users.forEach(user => {
            const row = body.insertRow()
            this.fillRow(row, user)
        })
    }

    fillRow(row, user) {
        this.addCell(row, "")
        this.addCell(row, user.login)
        this.addCell(row, user.role)

        const controllers = document.createElement('div')
        controllers.classList.add('text-end')
        controllers.style.right = '0px'

        if (user.have_profile == false && user.role == 'Студент') {
            controllers.appendChild(this.createAddStudentProfileButton(row))
        }

        controllers.appendChild(this.createChangePasswordButton(row))
        controllers.appendChild(this.createDeleteButton(row))
        this.addCell(row, controllers)
        this.addCell(row, "")
    }

    addCell(row, content) {
        let cell = row.insertCell()
        cell.classList.add('align-middle')
        if (typeof content === 'object') cell.appendChild(content)
        else cell.innerHTML = content
    }

    createAddStudentProfileButton(row) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'btn-sm', 'btn-success')
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Создать профиль студента')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-student-add')
        btn.innerHTML = '<i class="fa-solid fa-user-plus text-dark"></i>'
        btn.onclick = () => {
            const form = new AddStudentProfileForm(row.childNodes[1].innerText, row, this)
            form.fillAddStudentProfileForm()
        }
        return btn
    }

    createChangePasswordButton(row) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'btn-sm', 'btn-warning')
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Изменить пароль пользователя')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-user-change-password')
        btn.innerHTML = '<i class="fa-solid fa-key text-dark"></i>'
        btn.onclick = () => {
            const form = new ChangeUserPasswordForm(row.childNodes[1].innerText)
            form.fillChangeUserPasswordForm()
        }
        return btn
    }

    createDeleteButton(row) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'btn-sm', 'btn-danger')
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Удалить пользователя')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-user-delete')
        btn.innerHTML = '<i class="fa-solid fa-trash text-dark"></i>'
        btn.onclick = () => {
            const form = new UserFormDelete(row)
            form.fillDeleteForm()
        }

        return btn
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    const userTable = new UserTable()
    userTable.loadUsers()
    new AddUserForm(userTable)
})