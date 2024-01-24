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
    console.log('Очистка формы добавления юзера')
    document.getElementById('user-add-form-login').value = ''
    document.getElementById('user-add-form-password').value = ''
    document.getElementById('user-add-form-password-re').value = ''
    document.getElementById('user-add-form-role').value = 'student'
    document.getElementById('user-add-form-flash-msg').value = ''
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

        const newUser = {
            login: this.inputLogin.value,
            password: this.inputPsw.value,
            role: this.inputRole.value,
        }
        console.log(newUser)
        fetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'My-Tutor-Auth-Token': getCookie('My-Tutor-Auth-Token') },
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
                this.inputLogin.value = ''
                this.inputPsw.value = ''
                this.inputPswRe.value = ''
                const userTable = document.getElementById('users-table').tBodies[0]
                const userRow = userTable.insertRow()
                this.userTable.fillRow(userRow, user)
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

    hide() {
        $('#modal-user-add').modal('hide')
    }
}

class ChangeUserPasswordForm {
    constructor(updateRow) {
        this.row = updateRow

        this.login = updateRow.childNodes[1].innerText

        this.inputLogin = document.getElementById('user-change-password-form-login')
        this.inputPsw = document.getElementById('user-change-password-form-password')
        this.inputPswRe = document.getElementById('user-change-password-form-password-re')

        this.flashMsg = document.getElementById('user-change-password-form-flash-msg')

        this.btnChangePassword = document.getElementById('user-change-password-form-button')
        this.btnChangePassword.onclick = () => {
            this.changeUserPassword()
        }
    }

    fillChangeUserPasswordForm() {
        this.inputLogin.value = this.login
        this.inputPsw.value = ''
        this.inputPswRe.value = ''
        this.flashMsg.innerHTML = ''
    }

    changeUserPassword() {
        const checkPsw = checkPasswords(this.inputPsw.value, this.inputPswRe.value)

        if (checkPsw) {
            flashMsg(checkPsw, this.flashMsg, 'wrong')
        return
        }

        const newUserPassword = {
            login: this.login,
            password: this.inputPsw.value,
        }

        fetch(`/api/admin/users/${this.login}/`, {
            method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'My-Tutor-Auth-Token': getCookie('My-Tutor-Auth-Token') },
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
            if (response.hasOwnProperty('success')) {
                flashMsg(`Пароль пользователя "${this.login}" успешно изменен.`, this.flashMsg, 'success')
                console.log(response.success)
            } else {
                flashMsg(user.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    show() {
        $('#modal-user-change-password').modal('show')
    }

    hide() {
        $('#modal-user-change-password').modal('hide')
    }
}

class UserFormDelete {
    constructor(userTable, delRow) {
        this.userTable = userTable

        this.login = delRow.childNodes[1].innerText
        this.role = delRow.childNodes[3].innerText

        this.inputLogin = document.getElementById('user-delete-form-login')
        this.inputRole = document.getElementById('user-delete-form-role')

        this.flashMsg = document.getElementById('user-delete-form-flash-msg')

        this.btnDeleteUser = document.getElementById('user-delete-form-button')
        this.btnDeleteUser.onclick = () => {
            this.deleteUser(delRow)
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

        fetch(`/api/admin/users/${this.login}/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'My-Tutor-Auth-Token': getCookie('My-Tutor-Auth-Token') },
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
        .then(response => {
            if (response.hasOwnProperty('success')) {
                delRow.parentElement.removeChild(delRow)
                flashMsg(`Пользователь "${deleteUser.login}" с правами доступа "${this.role}" удалён`, this.flashMsg, 'success')
                this.btnDeleteUser.disabled = true
            } else {
                flashMsg(user.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    show() {
        $('#modal-user-delete').modal('show')
    }

    hide() {
        $('#modal-user-delete').modal('hide')
    }
}

class UserTable {
    constructor() {
        this.table = document.getElementById('users-table')
    }
    loadUsers() {
        fetch('/api/admin/users', {
            method: 'GET',
            headers: { 'My-tutor-Auth-Token': getCookie('My-tutor-Auth-Token') }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            this.fillTable(data)
        })
        .catch(error => {
            console.error(error)
            show_error('Ошибка загрузки списка пользователей')
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
        const userImage = document.createElement('img')
        userImage.src = user.img_path;
        userImage.alt = "Err";
        userImage.width = 50;
        userImage.height = 50;
        userImage.classList.add("rounded-circle");

        this.addCell(row, userImage)
        this.addCell(row, user.login)
        this.addCell(row, user.name)
        this.addCell(row, user.role)

        const controllers = document.createElement('div')
        controllers.classList.add('text-end')
        controllers.style.right = '0px'
        controllers.appendChild(this.createChangePasswordButton(row))
        controllers.appendChild(this.createDeleteButton(row))
        this.addCell(row, controllers)
    }

    addCell(row, content) {
        let cell = row.insertCell()
        cell.classList.add('align-middle')
        if (typeof content === 'object') cell.appendChild(content)
        else cell.innerHTML = content
    }

    createChangePasswordButton(row) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'btn-sm', 'btn-warning')
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Изменить пароль пользователя')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-user-change-password')
        btn.innerHTML = '<i class="fa-solid fa-key"></i>'
        btn.onclick = () => {
            const form = new ChangeUserPasswordForm(row)
            form.fillChangeUserPasswordForm()
            //form.show()
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
        btn.innerHTML = '<i class="fa-solid fa-trash"></i>'
        btn.onclick = () => {
            const form = new UserFormDelete(this, row)
            form.fillDeleteForm()
            //form.show()
        }

        return btn
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    const userTable = new UserTable()
    userTable.loadUsers()
    new AddUserForm(userTable)
})