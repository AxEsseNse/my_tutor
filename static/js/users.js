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
  document.getElementById('user-add-form-role').value = 'Персонал'
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

    fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Monas-Auth-Token': getCookie('X-Monas-Auth-Token') },
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





class UserTable {
  constructor() {
    this.table = document.getElementById('users-table')
  }
  // под method добавить строку headers: { 'My-tutor-Auth-Token': getCookie('My-tutor-Auth-Token') },
  loadUsers() {
    fetch('/api/admin/users', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
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
    this.addCell(row, user.login)
    this.addCell(row, user.role)

    const controllers = document.createElement('div')
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
    btn.setAttribute('data-toggle', 'modal')
    btn.setAttribute('data-target', '#modal-user-edit-primary')
    btn.innerHTML = '<i class="fa-solid fa-key" style="color: #000000;"></i>'
    btn.onclick = () => {
      const form = new ChangeUserPasswordForm(row)
      form.fillChangeUserPasswordForm()
      form.show()
    }
    return btn
  }

  createDeleteButton(row) {
    const btn = document.createElement('button')
    btn.classList.add('btn', 'btn-sm', 'btn-danger')
    btn.setAttribute('type', 'button')
    btn.setAttribute('title', 'Удалить пользователя')
    btn.setAttribute('data-toggle', 'modal')
    btn.setAttribute('data-target', '#modal-user-delete')
    btn.innerHTML = '<i class="fa-solid fa-trash"></i>'
    btn.onclick = () => {
      const form = new UserFormDelete(this, row)
      form.fillDeleteForm()
      form.show()
    }
    return btn
  }
}

document.addEventListener('DOMContentLoaded', function (event) {
  const userTable = new UserTable()
  userTable.loadUsers()
  new AddUserForm(userTable)
})