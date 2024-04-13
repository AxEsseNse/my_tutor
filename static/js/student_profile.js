const monthNumber = {
    'января': '01',
    'февраля': '02',
    'марта': '03',
    'апреля': '04',
    'мая': '05',
    'июня': '06',
    'июля': '07',
    'августа': '08',
    'сентября': '09',
    'октября': '10',
    'ноября': '11',
    'декабря': '12'
}

function convertDate(dateString) {
  const parts = dateString.replace(' года', '').split(' ');
  const day = parts[0].padStart(2, '0');
  const month = monthNumber[parts[1]];
  const year = parts[2];

  return `${year}-${month}-${day}`;
}

class UpdateStudentImageForm {
    constructor() {
        this.studentLogin = document.getElementById("student-login").textContent
        this.studentImage = document.getElementById('student-img')
        this.userImage = document.getElementById('user-image')

        this.inputLogin = document.getElementById('student-update-image-form-login')
        this.inputImage = document.getElementById('image-input')
        this.previewImage = document.getElementById('preview-image');
        this.descriptionImage = document.getElementById('student-modal-image-descr')

        this.flashMsg = document.getElementById('student-update-image-form-flash-msg')

        this.btnUpdateImage = document.getElementById('student-update-image-form-button')
        this.btnUpdateImage.onclick = () => {
            this.updateImage()
        }
    }

    fillUpdateImageForm() {
        console.log('Заполнение формы для изменения аватара студента')
        this.inputLogin.value = this.studentLogin
        this.descriptionImage.innerHTML = "Ваше текущее изображение"
        this.previewImage.src = this.studentImage.getAttribute('src');
        this.previewImage.style.display = 'block';
        this.flashMsg.innerHTML = ''
    }

    updateImage() {
        const imgData = new FormData();
        imgData.append('image_data', this.inputImage.files[0]);

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/students/student/image/${this.studentLogin}/`, {
            method: 'PUT',
            headers: {
                'My-Tutor-Auth-Token': token,
                'Login': this.studentLogin
            },
            body: imgData,
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
            if (student.hasOwnProperty('img_path')) {
                console.log(student.message)
                this.studentImage.src = student.img_path + '?v=' + new Date().getTime();
                this.previewImage.src = student.img_path + '?v=' + new Date().getTime();
                this.userImage.src = student.img_path + '?v=' + new Date().getTime();
                this.descriptionImage.innerHTML = "Ваше новое изображение"
                flashMsg(`${student.message}`, this.flashMsg, 'success')
            } else {
                flashMsg(student.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class UpdateStudentPrimaryInfoForm {
    constructor() {
        this.studentLogin = document.getElementById("student-login")
        this.studentName = document.getElementById("student-name")
        this.studentGender = document.getElementById("student-gender")
        this.studentBirthday = document.getElementById("student-birthday")

        this.inputLogin = document.getElementById('student-update-primary-info-form-login')
        this.inputFirstName = document.getElementById('student-update-primary-info-form-first-name')
        this.inputSecondName = document.getElementById('student-update-primary-info-form-second-name')
        this.inputGender = document.getElementById('student-update-primary-info-form-gender')
        this.inputBirthday = document.getElementById('student-update-primary-info-form-birthday')

        this.flashMsg = document.getElementById('student-update-primary-info-form-flash-msg')

        this.btnUpdatePrimaryInfo = document.getElementById('student-update-primary-info-form-button')
        this.btnUpdatePrimaryInfo.onclick = () => {
            this.updatePrimaryInfo()
        }
    }

    fillUpdatePrimaryInfoForm() {
        console.log('Заполнение формы для изменения личной информации студента')
        this.inputLogin.value = this.studentLogin.textContent
        this.inputSecondName.value = this.studentName.textContent.split(" ")[0]
        this.inputFirstName.value = this.studentName.textContent.split(" ")[1]
        this.inputGender.value = this.studentGender.textContent
        this.inputBirthday.value = convertDate(this.studentBirthday.textContent)
        this.flashMsg.innerHTML = ''
    }

    updatePrimaryInfo() {
        const newPrimaryInfo = {
            login: this.studentLogin.textContent,
            firstName: this.inputFirstName.value,
            secondName: this.inputSecondName.value,
            gender: this.inputGender.value,
            birthday: this.inputBirthday.value
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/students/student/${this.studentLogin.textContent}/`, {
            method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'My-Tutor-Auth-Token': token
                },
                body: JSON.stringify(newPrimaryInfo),
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
                this.studentName.innerText = `${student.second_name} ${student.first_name}`
                this.studentGender.innerText = student.gender
                this.studentBirthday.innerText = student.birthday

                flashMsg(`${student.message}`, this.flashMsg, 'success')
                console.log(student.message)
            } else {
                flashMsg(student.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class UpdateStudentContactInfoForm {
    constructor() {
        this.studentLogin = document.getElementById("student-login")
        this.studentDiscord = document.getElementById("student-discord")
        this.studentPhone = document.getElementById("student-phone")
        this.studentTelegram = document.getElementById("student-telegram")
        this.studentWhatsapp = document.getElementById("student-whatsapp")

        this.inputLogin = document.getElementById('student-update-contact-info-form-login')
        this.inputDiscord = document.getElementById('student-update-contact-info-form-discord')
        this.inputPhone = document.getElementById('student-update-contact-info-form-phone')
        this.inputTelegram = document.getElementById('student-update-contact-info-form-telegram')
        this.inputWhatsapp = document.getElementById('student-update-contact-info-form-whatsapp')

        this.flashMsg = document.getElementById('student-update-contact-info-form-flash-msg')

        this.btnUpdateContactInfo = document.getElementById('student-update-contact-info-form-button')
        this.btnUpdateContactInfo.onclick = () => {
            this.updateContactInfo()
        }
    }

    fillUpdateContactInfoForm() {
        console.log('Заполнение формы для изменения контактной информации студента')
        this.inputLogin.value = this.studentLogin.textContent

        this.inputDiscord.value = this.studentDiscord.textContent
        this.inputPhone.value = this.studentPhone.textContent
        this.inputTelegram.value = this.studentTelegram.textContent
        this.inputWhatsapp.value = this.studentWhatsapp.textContent
        this.flashMsg.innerHTML = ''
    }

    updateContactInfo() {
        const newContactInfo = {
            login: this.studentLogin.textContent,
            discord: this.inputDiscord.value,
            phone: this.inputPhone.value,
            telegram: this.inputTelegram.value,
            whatsapp: this.inputWhatsapp.value
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/students/student/${this.studentLogin.textContent}/`, {
            method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'My-Tutor-Auth-Token': token
                },
                body: JSON.stringify(newContactInfo),
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
            if (student.hasOwnProperty('discord')) {
                this.studentDiscord.innerText = student.discord
                this.studentPhone.innerText = student.phone
                this.studentTelegram.innerText = student.telegram
                this.studentWhatsapp.innerText = student.whatsapp

                flashMsg(`${student.message}`, this.flashMsg, 'success')
                console.log(student.message)
            } else {
                flashMsg(student.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class AddParentForm {
    constructor(parentTable) {
        this.parentTable = parentTable

        this.studentLogin = document.getElementById('student-login').textContent

        this.inputLogin = document.getElementById('parent-add-form-login')
        this.inputStatus = document.getElementById('parent-add-form-status')
        this.inputFirstName = document.getElementById('parent-add-form-first-name')
        this.inputSecondName = document.getElementById('parent-add-form-second-name')
        this.inputPhone = document.getElementById('parent-add-form-phone')
        this.inputTelegram = document.getElementById('parent-add-form-telegram')
        this.inputWhatsapp = document.getElementById('parent-add-form-whatsapp')

        this.flashMsg = document.getElementById('parent-add-form-flash-msg')

        this.btnAddParent = document.getElementById('parent-add-form-button')
        this.btnAddParent.onclick = () => {
            this.addParent()
        }
    }

    fillAddParentForm() {
        console.log('Подготовка формы добавления родителя')
        this.inputLogin.value = this.studentLogin
        this.inputStatus.value = "Мать"
        this.inputFirstName.value = ''
        this.inputSecondName.value = ''
        this.inputPhone.value = ''
        this.inputTelegram.value = ''
        this.inputWhatsapp.value = ''
        this.flashMsg.innerHTML = ''
    }

    addParent() {
        const newParent = {
            studentLogin: this.studentLogin,
            status: this.inputStatus.value,
            firstName: this.inputFirstName.value,
            secondName: this.inputSecondName.value,
            phone: this.inputPhone.value,
            telegram: this.inputTelegram.value,
            whatsApp: this.inputWhatsapp.value,
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch('/api/students/parents', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'My-Tutor-Auth-Token': token,
            },
            body: JSON.stringify(newParent),
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
        .then(parent => {
            if (parent.hasOwnProperty('first_name')) {
                console.log(parent.message)
                const body = this.parentTable.table.tBodies[0]
                const row = body.insertRow()
                this.parentTable.fillRow(row, parent)

                flashMsg(
                    `Данные родителя "${parent.first_name} ${parent.second_name}" успешно добавлены`,
                    this.flashMsg,
                    'success',
                )
            } else {
                flashMsg(parent.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class UpdateParentForm {
    constructor(updateRow) {
        this.updateRow = updateRow

        this.studentLogin = document.getElementById('student-login').textContent
        this.phone = this.updateRow.childNodes[3].innerText

        this.inputLogin = document.getElementById('parent-update-form-login')
        this.inputStatus = document.getElementById('parent-update-form-status')
        this.inputFirstName = document.getElementById('parent-update-form-first-name')
        this.inputSecondName = document.getElementById('parent-update-form-second-name')
        this.inputPhone = document.getElementById('parent-update-form-phone')
        this.inputTelegram = document.getElementById('parent-update-form-telegram')
        this.inputWhatsApp = document.getElementById('parent-update-form-whatsapp')

        this.flashMsg = document.getElementById('parent-update-form-flash-msg')

        this.btnUpdateParent = document.getElementById('parent-update-form-button')
        this.btnUpdateParent.onclick = () => {
            this.updateParent()
        }
    }

    fillUpdateForm() {
        console.log('Заполнение формы для изменения данных родителя')
        this.inputLogin.value = this.studentLogin
        this.inputStatus.value = this.updateRow.childNodes[0].innerText
        this.inputFirstName.value = this.updateRow.childNodes[1].innerText
        this.inputSecondName.value = this.updateRow.childNodes[2].innerText
        this.inputPhone.value = this.updateRow.childNodes[3].innerText
        this.inputTelegram.value = this.updateRow.childNodes[4].innerText
        this.inputWhatsApp.value = this.updateRow.childNodes[5].innerText

        this.flashMsg.innerHTML = ''
    }

    updateParent() {
        const updateParentData = {
            studentLogin: this.studentLogin,
            status: this.inputStatus.value,
            firstName: this.inputFirstName.value,
            secondName: this.inputSecondName.value,
            phoneKey: this.phone,
            new_phone: this.inputPhone.value,
            telegram: this.inputTelegram.value,
            whatsApp: this.inputWhatsApp.value,
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/students/parents/${this.studentLogin}/`, {
            method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'My-Tutor-Auth-Token': token
                },
                body: JSON.stringify(updateParentData),
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
        .then(parent => {
            if (parent.hasOwnProperty('status')) {
                this.updateRow.childNodes[0].innerText = parent.status
                this.updateRow.childNodes[1].innerText = parent.first_name
                this.updateRow.childNodes[2].innerText = parent.second_name
                this.updateRow.childNodes[3].innerText = parent.phone
                this.updateRow.childNodes[4].innerText = parent.telegram
                this.updateRow.childNodes[5].innerText = parent.whatsapp

                flashMsg(parent.message, this.flashMsg, 'success')
                console.log(parent.message)
            } else {
                flashMsg(parent.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class DeleteParentForm {
    constructor(delRow) {
        this.delRow = delRow

        this.studentLogin = document.getElementById('student-login').textContent
        this.inputLogin = document.getElementById('parent-delete-form-login')
        this.inputStatus = document.getElementById('parent-delete-form-status')
        this.inputFirstName = document.getElementById('parent-delete-form-first-name')
        this.inputSecondName = document.getElementById('parent-delete-form-second-name')
        this.inputPhone = document.getElementById('parent-delete-form-phone')
        this.inputTelegram = document.getElementById('parent-delete-form-telegram')
        this.inputWhatsApp = document.getElementById('parent-delete-form-whatsapp')

        this.flashMsg = document.getElementById('parent-delete-form-flash-msg')

        this.btnDeleteParent = document.getElementById('parent-delete-form-button')
        this.btnDeleteParent.onclick = () => {
            this.deleteParent()
        }
    }

    fillDeleteForm() {
        this.inputLogin.value = this.studentLogin
        this.inputStatus.value = this.delRow.childNodes[0].innerText
        this.inputFirstName.value = this.delRow.childNodes[1].innerText
        this.inputSecondName.value = this.delRow.childNodes[2].innerText
        this.inputPhone.value = this.delRow.childNodes[3].innerText
        this.inputTelegram.value = this.delRow.childNodes[4].innerText
        this.inputWhatsApp.value = this.delRow.childNodes[5].innerText
        this.flashMsg.innerHTML = ''
        this.btnDeleteParent.disabled = false
    }

    deleteParent() {
        const deleteParent = {
            studentLogin: this.studentLogin,
            phone: this.inputPhone.value,
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/students/parents/${this.login}/`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            'My-Tutor-Auth-Token': token
            },
            body: JSON.stringify(deleteParent),
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
        .then(deletedParent => {
            if (deletedParent.hasOwnProperty('first_name')) {
                console.log(deletedParent.message)
                this.delRow.parentElement.removeChild(this.delRow)
                flashMsg(`Данные родителя "${deletedParent.first_name} ${deletedParent.second_name}" удалены`, this.flashMsg, 'success')
                this.btnDeleteParent.disabled = true
            } else {
                flashMsg(deletedParent.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class StudentInfo {
    constructor(parentTable) {
        this.parentTable = parentTable
        this.login = userLogin

        this.studentLogin = document.getElementById("student-login")
        this.studentName = document.getElementById("student-name")
        this.studentGender = document.getElementById("student-gender")
        this.studentBirthday = document.getElementById("student-birthday")
        this.studentLessonPrice = document.getElementById("student-lesson-price")
        this.studentDiscord = document.getElementById("student-discord")
        this.studentPhone = document.getElementById("student-phone")
        this.studentTelegram = document.getElementById("student-telegram")
        this.studentWhatsapp = document.getElementById("student-whatsapp")

        this.updateImageButton = document.getElementById('btn-update-img')
        this.updatePrimaryInfoButton = document.getElementById('btn-update-primary')
        this.updateContactInfoButton = document.getElementById('btn-update-contact')
        this.addParentButton = document.getElementById('btn-add-parent')
        this.clearParentFormButton = document.getElementById('parent-add-clean')
    }

    loadStudentInfo() {
        console.log("Запрос на сервер для получения данных студента")

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/students/student/${this.login}/`, {
            method: 'GET',
            headers: {
                'My-Tutor-Auth-Token': token
            }
        })
        .then(response => response.json())
        .then(data => {
            this.fillInfo(data)

            const updatePrimaryInfoForm = new UpdateStudentPrimaryInfoForm()
            this.updatePrimaryInfoButton.onclick = () => {
                updatePrimaryInfoForm.fillUpdatePrimaryInfoForm()
            }

            const updateContactInfoForm = new UpdateStudentContactInfoForm()
            this.updateContactInfoButton.onclick = () => {
                updateContactInfoForm.fillUpdateContactInfoForm()
            }

            const updateImageForm = new UpdateStudentImageForm()
            this.updateImageButton.onclick = () => {
                updateImageForm.fillUpdateImageForm()
            }

            const addParentForm = new AddParentForm(this.parentTable)
            this.addParentButton.onclick = () => {
                addParentForm.fillAddParentForm()
            }
            this.clearParentFormButton.onclick = () => {
                addParentForm.fillAddParentForm()
            }
        })
        .catch(error => {
            console.error(error)
        })
    }

    fillInfo(student) {
        console.log("Заполнение личной информации студента полученными данными")

        const studentImage = document.getElementById('student-img');
        studentImage.src = student.img_path;


        this.studentLogin.innerText = student.login
        this.studentName.innerText = `${student.second_name} ${student.first_name}`
        this.studentGender.innerText = student.gender
        this.studentBirthday.innerText = student.birthday
        this.studentLessonPrice.innerHTML = `Стоимость занятий: <strong>${student.lesson_price} рублей</strong>`
        this.studentDiscord.innerText = student.discord
        this.studentPhone.innerText = student.phone
        this.studentTelegram.innerText = student.telegram
        this.studentWhatsapp.innerText = student.whatsapp
    }
}

class ParentTable {
    constructor() {
        this.table = document.getElementById('parents-table')
    }

    loadParents() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        console.log("Запрос на сервер для получения данных родителей студента")
        fetch('/api/students/parents', {
            method: 'GET',
            headers: {
                'My-Tutor-Auth-Token': token
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log("Заполнение таблицы родителей студента полученными данными")
            this.fillTable(data)
        })
        .catch(error => {
            console.error(error)
        })
    }

    fillTable(parents) {
        const body = this.table.tBodies[0]
        body.innerHTML = ''

        parents.forEach(parent => {
            const row = body.insertRow()
            this.fillRow(row, parent)
        })
    }

    fillRow(row, parent) {
        this.addCell(row, parent.status, 'text-center')
        this.addCell(row, parent.first_name)
        this.addCell(row, parent.second_name)
        this.addCell(row, parent.phone)
        this.addCell(row, parent.telegram)
        this.addCell(row, parent.whatsapp)

        const controllers = document.createElement('div')
        controllers.style.right = '0px'
        controllers.appendChild(this.createUpdateButton(row))
        controllers.appendChild(this.createDeleteButton(row))
        this.addCell(row, controllers, 'text-center')
    }

    addCell(row, content, position='text-start') {
        let cell = row.insertCell()
        cell.classList.add('align-middle')
        cell.classList.add(position)
        if (typeof content === 'object') cell.appendChild(content)
        else cell.innerHTML = content
    }

    createUpdateButton(row) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'table-controller')
        btn.style.color = '#228B22'
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Обновить данные родителя')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-parent-update')
        btn.innerHTML = '<i class="fa-solid fa-pen fa-lg"></i>'
        btn.onclick = () => {
            const form = new UpdateParentForm(row)
            form.fillUpdateForm()
        }

        return btn
    }

    createDeleteButton(row) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'table-controller')
        btn.style.color = '#B22222'
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Удалить данные о родителе')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-parent-delete')
        btn.innerHTML = '<i class="fa-solid fa-trash fa-lg"></i>'
        btn.onclick = () => {
            const form = new DeleteParentForm(row)
            form.fillDeleteForm()
        }

        return btn
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    const parentTable = new ParentTable()
    parentTable.loadParents()

    const studentInfo = new StudentInfo(parentTable)
    studentInfo.loadStudentInfo()
})

document.getElementById('image-input').addEventListener('change', function(event) {
    const imageDescription = document.getElementById('student-modal-image-type')
    const previewImage = document.getElementById('preview-image');
    const fileInput = event.target;

    if (fileInput.files.length > 0) {
        const selectedFile = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            previewImage.src = e.target.result;
            imageDescription.innerHTML = "Предпросмотр изображения";
        };

        reader.readAsDataURL(selectedFile);
    } else {
        let studentImage = document.getElementById('student-img');
        let studentImagePath = studentImage.getAttribute('src');

        imageDescription.innerHTML = "Ваше текущее изображение";
        previewImage.src = studentImagePath;
    }
    previewImage.style.display = 'block';
});
