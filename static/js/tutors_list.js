function clearAddTutorForm() {
    console.log('Очистка формы добавления профиля преподавателя')
    document.getElementById('tutor-add-form-login').value = ''
    document.getElementById('tutor-add-form-first-name').value = ''
    document.getElementById('tutor-add-form-second-name').value = ''
    document.getElementById('tutor-add-form-gender').value = 'парень'
    document.getElementById('tutor-add-form-birthday').value = '2013-09-13'
    document.getElementById('tutor-add-form-discord').value = ''
    document.getElementById('tutor-add-form-phone').value = ''
    document.getElementById('tutor-add-form-telegram').value = ''
    document.getElementById('tutor-add-form-whatsapp').value = ''
    document.getElementById('tutor-add-form-flash-msg').innerHTML = ''
}

class AddTutorForm {
    constructor(tutorTable) {
        this.tutorTable = tutorTable
        this.users = []
        this.usersSelect = document.getElementById('tutor-add-form-login')

        this.inputLogin = document.getElementById('tutor-add-form-login')
        this.inputFirstName = document.getElementById('tutor-add-form-first-name')
        this.inputSecondName = document.getElementById('tutor-add-form-second-name')
        this.inputGender = document.getElementById('tutor-add-form-gender')
        this.inputBirthday = document.getElementById('tutor-add-form-birthday')
        this.inputDiscord = document.getElementById('tutor-add-form-discord')
        this.inputPhone = document.getElementById('tutor-add-form-phone')
        this.inputTelegram = document.getElementById('tutor-add-form-telegram')
        this.inputWhatsApp = document.getElementById('tutor-add-form-whatsapp')

        this.flashMsg = document.getElementById('tutor-add-form-flash-msg')

        this.btnAddTutor = document.getElementById('tutor-add-form-button')
        this.btnAddTutor.onclick = () => {
            this.addTutor()
        }
    }

    loadUsers() {
        return fetch('/api/admin/users/tutors_without_profile/', {
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

    addTutor() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        if (this.inputLogin.value == '') {
            return
        }

        const newTutor = {
            tutorLogin: this.inputLogin.value,
            firstName: this.inputFirstName.value,
            secondName: this.inputSecondName.value,
            gender: this.inputGender.value,
            birthday: this.inputBirthday.value,
            discord: this.inputDiscord.value,
            phone: this.inputPhone.value,
            telegram: this.inputTelegram.value,
            whatsApp: this.inputWhatsApp.value,
        }

        fetch('/api/admin/tutors/', {
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
        .then(tutor => {
            if (tutor.hasOwnProperty('first_name')) {
                console.log(tutor.message)
                const body = this.tutorTable.table.tBodies[0]
                const row = body.insertRow()
                this.tutorTable.fillRow(row, tutor)

                flashMsg(
                    `Для пользователя "${tutor.tutor_login}" создан профиль преподавателя`,
                    this.flashMsg,
                    'success',
                )
            } else {
                flashMsg(tutor.message, this.flashMsg, 'wrong')
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
        this.phone = delRow.childNodes[6].innerText

        this.inputSecondName = document.getElementById('tutor-delete-form-second-name')
        this.inputFirstName = document.getElementById('tutor-delete-form-first-name')
        this.inputPhone = document.getElementById('tutor-delete-form-phone')

        this.flashMsg = document.getElementById('tutor-delete-form-flash-msg')

        this.btnDeleteTutor = document.getElementById('tutor-delete-form-button')
        this.btnDeleteTutor.onclick = () => {
            this.deleteTutor()
        }
    }

    fillDeleteForm() {
        this.inputSecondName.value = this.secondName
        this.inputFirstName.value = this.firstName
        this.inputPhone.value = this.phone
        this.flashMsg.innerHTML = ''
        this.btnDeleteTutor.disabled = false
    }

    deleteStudent(delRow) {
        const deleteTutor = {
            phone: this.phone,
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/admin/tutors/${this.phone}/`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            'My-Tutor-Auth-Token': token
            },
            body: JSON.stringify(deleteTutor),
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
        .then(deleteTutor => {
            if (deleteTutor.hasOwnProperty('name')) {
                console.log(deleteTutor.message)
                this.delRow.parentElement.removeChild(this.delRow)
                flashMsg(`Профиль преподавателя "${deleteTutor.name}"  удалён`, this.flashMsg, 'success')
                this.btnDeleteTutor.disabled = true
            } else {
                flashMsg(deleteTutor.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class TutorTable {
    constructor() {
        this.table = document.getElementById('tutors-table')
    }

    loadTutors() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch('/api/admin/tutors/', {
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

    fillTable(tutors) {
        const body = this.table.tBodies[0]
        body.innerHTML = ''

        tutors.forEach(tutor => {
            const row = body.insertRow()
            this.fillRow(row, tutor)
        })
    }

    fillRow(row, tutor) {
        const tutorImage = document.createElement('img')
        tutorImage.src = tutor.img_path
        tutorImage.style.display = 'block'
        tutorImage.classList.add('rounded-circle')
        tutorImage.width = 50
        tutorImage.height = 50
        this.addCell(row, tutorImage)

        this.addCell(row, tutor.second_name)
        this.addCell(row, tutor.first_name)
        this.addCell(row, tutor.gender)
        this.addCell(row, tutor.age)
        this.addCell(row, tutor.discord)
        this.addCell(row, tutor.phone)
        this.addCell(row, tutor.telegram)
        this.addCell(row, tutor.whatsapp)

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
        btn.setAttribute('title', 'Удалить профиль преподавателя')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-tutor-delete')
        btn.innerHTML = '<i class="fa-solid fa-trash text-dark"></i>'
        btn.onclick = () => {
            const form = new TutorFormDelete(row)
            form.fillDeleteForm()
        }

        return btn
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    const tutorTable = new TutorTable()
    tutorTable.loadTutors()
    const AddTutor = new AddTutorForm(tutorTable)
    AddTutor.setUsersSelectOptions()
})