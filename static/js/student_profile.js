const iconLib = {
    login: "fa-solid fa-user",
    firstName: "fa-solid fa-user",
    secondName: "fa-solid fa-user",
    gender: "fa-solid fa-venus-mars",
    birthday: "fa-solid fa-calendar-days",
    lessonPrice: "fa-solid fa-sack-dollar",
    discord: "fa-brands fa-discord",
    phone: "fa-solid fa-phone",
    telegram: "fa-brands fa-telegram",
    whatsapp: "fa-brands fa-whatsapp"
}

function fillAddParentForm() {
    console.log('Подготовка формы добавления родителя')
    document.getElementById('parent-add-form-login').value = document.getElementById('student-login').textContent.trim()
    document.getElementById('parent-add-form-status').value = "Мать"
    document.getElementById('parent-add-form-first-name').value = ''
    document.getElementById('parent-add-form-second-name').value = ''
    document.getElementById('parent-add-form-phone').value = ''
    document.getElementById('parent-add-form-telegram').value = ''
    document.getElementById('parent-add-form-whatsapp').value = ''
    document.getElementById('parent-add-form-flash-msg').innerHTML = ''
}

function fillEditImageForm() {
    console.log('Заполнение формы для изменения аватара студента')
    document.getElementById('student-edit-image-form-login').value = document.getElementById('student-login').textContent.trim()

    document.getElementById('student-modal-image-type').innerHTML = "Ваше текущее изображение"
    const studentImage = document.getElementById('student-img');
    const studentImagePath = studentImage.getAttribute('src');
    const previewImage = document.getElementById('preview-image');
    previewImage.src = studentImagePath;
    previewImage.style.display = 'block';
    document.getElementById('student-edit-image-form-flash-msg').innerHTML = ''
}

function fillEditPrimaryInfoForm() {
    console.log('Заполнение формы для изменения личной информации студента')
    document.getElementById('student-edit-primary-info-form-login').value = document.getElementById('student-login').textContent.trim()

    document.getElementById('student-edit-primary-info-form-first-name').value = document.getElementById('student-first-name').textContent.trim()
    document.getElementById('student-edit-primary-info-form-second-name').value = document.getElementById('student-second-name').textContent.trim()
    document.getElementById('student-edit-primary-info-form-gender').value = document.getElementById('student-gender').textContent.trim()
    document.getElementById('student-edit-primary-info-form-birthday').value = document.getElementById('student-birthday').textContent.trim()
    document.getElementById('student-edit-primary-info-form-flash-msg').innerHTML = ''
}

function fillEditContactInfoForm() {
    console.log('Заполнение формы для изменения контактных данных студента')
    document.getElementById('student-edit-contact-info-form-login').value = document.getElementById('student-login').textContent.trim()

    document.getElementById('student-edit-contact-info-form-discord').value = document.getElementById('student-discord').textContent.trim()
    document.getElementById('student-edit-contact-info-form-phone').value = document.getElementById('student-phone').textContent.trim()
    document.getElementById('student-edit-contact-info-form-telegram').value = document.getElementById('student-telegram').textContent.trim()
    document.getElementById('student-edit-contact-info-form-whatsapp').value = document.getElementById('student-whatsapp').textContent.trim()
    document.getElementById('student-edit-contact-info-form-flash-msg').innerHTML = ''
}

function fillStudentDataDiv(divId, data, iconTag=null) {
    let fillDiv = document.getElementById(divId)
    fillDiv.innerHTML = "";

    if (iconTag!==null) {
        let iconElement = document.createElement("i")
        iconElement.className = iconLib[iconTag]

        fillDiv.appendChild(iconElement)
        fillDiv.innerHTML += data;
    } else {
        fillDiv.innerHTML += data;
    }
}

class EditStudentImageForm {

    constructor() {
        this.login = document.getElementById('student-login').textContent.trim()
        this.studentImage = document.getElementById('student-img')
        this.userImage = document.getElementById('user-image')

        this.inputLogin = document.getElementById('student-edit-primary-info-form-login')
        this.inputImage = document.getElementById('image-input')
        this.previewImage = document.getElementById('preview-image');
        this.descriptionImage = document.getElementById('student-modal-image-type')

        this.flashMsg = document.getElementById('student-edit-image-form-flash-msg')

        this.btnEditImage = document.getElementById('student-edit-image-form-button')
        this.btnEditImage.onclick = () => {
            this.editImage()
        }
    }

    editImage() {
        const imgData = new FormData();
        imgData.append('student_data', this.inputImage.files[0]);

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/students/student/${this.login}/image`, {
            method: 'PUT',
            headers: {
                'My-Tutor-Auth-Token': token,
                'Login': this.login
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
                console.log(student)
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

class EditStudentPrimaryInfoForm {

    constructor() {
        this.login = document.getElementById('student-login').textContent.trim()

        this.inputLogin = document.getElementById('student-edit-primary-info-form-login')
        this.inputFirstName = document.getElementById('student-edit-primary-info-form-first-name')
        this.inputSecondName = document.getElementById('student-edit-primary-info-form-second-name')
        this.inputGender = document.getElementById('student-edit-primary-info-form-gender')
        this.inputBirthday = document.getElementById('student-edit-primary-info-form-birthday')

        this.flashMsg = document.getElementById('student-edit-primary-info-form-flash-msg')

        this.btnEditPrimaryInfo = document.getElementById('student-edit-primary-info-form-button')
        this.btnEditPrimaryInfo.onclick = () => {
            this.editPrimaryInfo()
        }
    }

    editPrimaryInfo() {
        const newPrimaryInfo = {
            login: this.login,
            firstName: this.inputFirstName.value,
            secondName: this.inputSecondName.value,
            gender: this.inputGender.value,
            birthday: this.inputBirthday.value
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/students/student/${this.login}/`, {
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
                fillStudentDataDiv("student-first-name", ` ${student.first_name}`);
                fillStudentDataDiv("student-second-name", ` ${student.second_name}`);
                fillStudentDataDiv("student-gender", ` ${student.gender}`, "gender");
                fillStudentDataDiv("student-birthday", ` ${student.birthday}`, "birthday");

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

class EditStudentContactInfoForm {

    constructor() {
        this.login = document.getElementById('student-login').textContent.trim()

        this.inputLogin = document.getElementById('student-edit-contact-info-form-login')
        this.inputDiscord = document.getElementById('student-edit-contact-info-form-discord')
        this.inputPhone = document.getElementById('student-edit-contact-info-form-phone')
        this.inputTelegram = document.getElementById('student-edit-contact-info-form-telegram')
        this.inputWhatsapp = document.getElementById('student-edit-contact-info-form-whatsapp')

        this.flashMsg = document.getElementById('student-edit-contact-info-form-flash-msg')

        this.btnEditPrimaryInfo = document.getElementById('student-edit-contact-info-form-button')
        this.btnEditPrimaryInfo.onclick = () => {
            this.editContactInfo()
        }
    }

    editContactInfo() {
        const newContactInfo = {
            login: this.login,
            discord: this.inputDiscord.value,
            phone: this.inputPhone.value,
            telegram: this.inputTelegram.value,
            whatsapp: this.inputWhatsapp.value
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/students/student/${this.login}/`, {
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
                fillStudentDataDiv("student-discord", ` ${student.discord}`, "discord");
                fillStudentDataDiv("student-phone", ` ${student.phone}`, "phone");
                fillStudentDataDiv("student-telegram", ` ${student.telegram}`, "telegram");
                fillStudentDataDiv("student-whatsapp", ` ${student.whatsapp}`, "whatsapp");

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

        this.studentLogin = document.getElementById('student-login').textContent.trim()

        this.inputStatus = document.getElementById('parent-add-form-status')
        this.inputFirstName = document.getElementById('parent-add-form-first-name')
        this.inputSecondName = document.getElementById('parent-add-form-second-name')
        this.inputPhone = document.getElementById('parent-add-form-phone')
        this.inputTelegram = document.getElementById('parent-add-form-telegram')
        this.inputWhatsApp = document.getElementById('parent-add-form-whatsapp')

        this.flashMsg = document.getElementById('parent-add-form-flash-msg')

        this.btnAddParent = document.getElementById('parent-add-form-button')
        this.btnAddParent.onclick = () => {
            this.addParent()
        }
    }

    addParent() {
        const newParent = {
            studentLogin: this.studentLogin,
            status: this.inputStatus.value,
            firstName: this.inputFirstName.value,
            secondName: this.inputSecondName.value,
            phone: this.inputPhone.value,
            telegram: this.inputTelegram.value,
            whatsApp: this.inputWhatsApp.value,
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
                console.log(parent)

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

        this.studentLogin = document.getElementById('student-login').textContent.trim()
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

        this.studentLogin = document.getElementById('student-login').textContent.trim()

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
        console.log(deleteParent)
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
        this.login = 'kira'
        this.iconLib = {
            login: "fa-solid fa-user",
            firstName: "fa-solid fa-user",
            secondName: "fa-solid fa-user",
            gender: "fa-solid fa-venus-mars",
            birthday: "fa-solid fa-calendar-days",
            lessonPrice: "fa-solid fa-sack-dollar",
            discord: "fa-brands fa-discord",
            phone: "fa-solid fa-phone",
            telegram: "fa-brands fa-telegram",
            whatsapp: "fa-brands fa-whatsapp"
        }
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
            new EditStudentPrimaryInfoForm()
            new EditStudentContactInfoForm()
            new EditStudentImageForm()
            new AddParentForm(this.parentTable)
        })
        .catch(error => {
            console.error(error)
        })
    }

    fillInfo(student) {
        console.log("Заполнение личной информации студента полученными данными")

        const studentImage = document.getElementById('student-img');
        studentImage.src = student.img_path;

        fillStudentDataDiv("student-login", ` ${student.login}`, "login");
        fillStudentDataDiv("student-first-name", ` ${student.first_name}`);
        fillStudentDataDiv("student-second-name", ` ${student.second_name}`);
        fillStudentDataDiv("student-gender", ` ${student.gender}`, "gender");
        fillStudentDataDiv("student-birthday", ` ${student.birthday}`, "birthday");
        fillStudentDataDiv("student-lesson-price", `Стоимость занятий: <strong>${student.lesson_price}</strong> рублей`, "lessonPrice");
        fillStudentDataDiv("student-discord", ` ${student.discord}`, "discord");
        fillStudentDataDiv("student-phone", ` ${student.phone}`, "phone");
        fillStudentDataDiv("student-telegram", ` ${student.telegram}`, "telegram");
        fillStudentDataDiv("student-whatsapp", ` ${student.whatsapp}`, "whatsapp");
    }

    fillInfoDiv(divId, data, iconTag) {
        let fillDiv = document.getElementById(divId)
        fillDiv.innerHTML = "";

        let iconElement = document.createElement("i")
        iconElement.className = this.iconLib[iconTag]
        let textElement = document.createTextNode(data)

        fillDiv.appendChild(iconElement)
        fillDiv.appendChild(textElement)
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
        this.addCell(row, parent.status)
        this.addCell(row, parent.first_name)
        this.addCell(row, parent.second_name)
        this.addCell(row, parent.phone)
        this.addCell(row, parent.telegram)
        this.addCell(row, parent.whatsapp)

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
        if (typeof content === 'object') cell.appendChild(content)
        else cell.innerHTML = content
    }

    createUpdateButton(row) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'btn-sm', 'btn-info')
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Обновить данные родителя')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-parent-update')
        btn.innerHTML = '<i class="fa-solid fa-pen"></i>'
        btn.onclick = () => {
            const form = new UpdateParentForm(row)
            form.fillUpdateForm()
        }

        return btn
    }

    createDeleteButton(row) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'btn-sm', 'btn-danger')
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Удалить родителя')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-parent-delete')
        btn.innerHTML = '<i class="fa-solid fa-trash"></i>'
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
