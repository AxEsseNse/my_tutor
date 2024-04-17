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

class Validator {
    checkValidFirstName(data) {
        if (data.length > 15) {
            return 'Длина имени не может быть более 15 символов'
        }
        if (data.length < 3) {
            return 'Длина имени не может менее 3 символов'
        }
        return false
    }

    checkValidSecondName(data) {
        if (data.length > 25) {
            return 'Длина фамилии не может быть более 25 символов'
        }
        if (data.length < 3) {
            return 'Длина фамилии не может менее 3 символов'
        }
        return false
    }

    checkValidPhone(data) {
        if (data.length !== 11) {
            return 'Номер телефона должен состоять из 11 символов'
        }
        return false
    }

    checkValidTelegram(data) {
        if (data.length !== 11) {
            return 'Номер телеграма должен состоять из 11 символов'
        }
        return false
    }

    checkValidWhatsapp(data) {
        if (data.length !== 11) {
            return 'Номер whatsapp должен состоять из 11 символов'
        }
        return false
    }

    checkValidDiscord(data) {
        if (data.length > 25) {
            return 'Длина дискорда должна быть не более 25 символов'
        }
        if (data.length < 5) {
            return 'Длина дискорда должна быть не менее 5 символов'
        }
        return false
    }
}

class UpdateTutorImageForm {
    constructor() {
        this.tutorLogin = document.getElementById('tutor-login').textContent
        this.tutorImage = document.getElementById('tutor-img')
        this.userImage = document.getElementById('user-image')

        this.inputLogin = document.getElementById('tutor-update-image-form-login')
        this.inputImage = document.getElementById('image-input')
        this.previewImage = document.getElementById('preview-image');
        this.descriptionImage = document.getElementById('tutor-modal-image-descr')

        this.flashMsg = document.getElementById('tutor-update-image-form-flash-msg')

        this.btnUpdateImage = document.getElementById('tutor-update-image-form-button')
        this.btnUpdateImage.onclick = () => {
            this.updateImage()
        }
    }

    fillUpdateImageForm() {
        console.log('Заполнение формы для изменения аватара преподавателя')
        this.inputLogin.value = this.tutorLogin
        this.descriptionImage.innerHTML = "Ваше текущее изображение"
        this.previewImage.src = this.tutorImage.getAttribute('src');
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

        fetch(`/api/tutors/tutor/image/${this.tutorLogin}/`, {
            method: 'PUT',
            headers: {
                'My-Tutor-Auth-Token': token,
                'Login': this.tutorLogin
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
        .then(tutor => {
            if (tutor.hasOwnProperty('img_path')) {
                console.log(tutor.message)
                this.tutorImage.src = tutor.img_path + '?v=' + new Date().getTime();
                this.previewImage.src = tutor.img_path + '?v=' + new Date().getTime();
                this.userImage.src = tutor.img_path + '?v=' + new Date().getTime();
                this.descriptionImage.innerHTML = "Ваше новое изображение"
                flashMsg(`${tutor.message}`, this.flashMsg, 'success')
            } else {
                flashMsg(tutor.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class UpdateTutorPrimaryInfoForm {
    constructor(validator) {
        this.validator = validator

        this.userName = document.getElementById("header-user-name")
        this.tutorLogin = document.getElementById("tutor-login")
        this.tutorName = document.getElementById("tutor-name")
        this.tutorGender = document.getElementById("tutor-gender")
        this.tutorBirthday = document.getElementById("tutor-birthday")

        this.inputLogin = document.getElementById('tutor-update-primary-info-form-login')
        this.inputFirstName = document.getElementById('tutor-update-primary-info-form-first-name')
        this.inputSecondName = document.getElementById('tutor-update-primary-info-form-second-name')
        this.inputGender = document.getElementById('tutor-update-primary-info-form-gender')
        this.inputBirthday = document.getElementById('tutor-update-primary-info-form-birthday')

        this.flashMsg = document.getElementById('tutor-update-primary-info-form-flash-msg')

        this.btnUpdatePrimaryInfo = document.getElementById('tutor-update-primary-info-form-button')
        this.btnUpdatePrimaryInfo.onclick = () => {
            this.updatePrimaryInfo()
        }
    }

    fillUpdatePrimaryInfoForm() {
        console.log('Заполнение формы для изменения личной информации преподавателя')
        this.inputLogin.value = this.tutorLogin.textContent
        this.inputSecondName.value = this.tutorName.textContent.split(" ")[0]
        this.inputFirstName.value = this.tutorName.textContent.split(" ")[1]
        this.inputGender.value = this.tutorGender.textContent
        this.inputBirthday.value = convertDate(this.tutorBirthday.textContent)
        this.flashMsg.innerHTML = ''
    }

    updatePrimaryInfo() {
        const newPrimaryInfo = {
            login: this.tutorLogin.textContent,
            firstName: this.inputFirstName.value,
            secondName: this.inputSecondName.value,
            gender: this.inputGender.value,
            birthday: this.inputBirthday.value
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        let errorFirstName = this.validator.checkValidFirstName(this.inputFirstName.value)
        let errorSecondName = this.validator.checkValidSecondName(this.inputSecondName.value)
        let errors = [errorFirstName, errorSecondName]

        for (let error of errors) {
            if (error) {
                flashMsg(error, this.flashMsg, 'wrong')
                return
            }
        }

        this.flashMsg.innerHTML = ''

        fetch(`/api/tutors/tutor/${this.tutorLogin.textContent}/`, {
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
        .then(tutor => {
            if (tutor.hasOwnProperty('first_name')) {
                this.userName.innerText = `${tutor.second_name} ${tutor.first_name}`
                this.tutorName.innerText = `${tutor.second_name} ${tutor.first_name}`
                this.tutorGender.innerText = tutor.gender
                this.tutorBirthday.innerText = tutor.birthday

                flashMsg(`${tutor.message}`, this.flashMsg, 'success')
                console.log(tutor.message)
            } else {
                flashMsg(tutor.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class UpdateTutorContactInfoForm {
    constructor(validator) {
        this.validator = validator

        this.tutorLogin = document.getElementById("tutor-login")
        this.tutorDiscord = document.getElementById("tutor-discord")
        this.tutorPhone = document.getElementById("tutor-phone")
        this.tutorTelegram = document.getElementById("tutor-telegram")
        this.tutorWhatsapp = document.getElementById("tutor-whatsapp")

        this.inputLogin = document.getElementById('tutor-update-contact-info-form-login')
        this.inputDiscord = document.getElementById('tutor-update-contact-info-form-discord')
        this.inputPhone = document.getElementById('tutor-update-contact-info-form-phone')
        this.inputTelegram = document.getElementById('tutor-update-contact-info-form-telegram')
        this.inputWhatsapp = document.getElementById('tutor-update-contact-info-form-whatsapp')

        this.flashMsg = document.getElementById('tutor-update-contact-info-form-flash-msg')

        this.btnUpdateContactInfo = document.getElementById('tutor-update-contact-info-form-button')
        this.btnUpdateContactInfo.onclick = () => {
            this.updateContactInfo()
        }
    }

    fillUpdateContactInfoForm() {
        console.log('Заполнение формы для изменения контактной информации преподавателя')
        this.inputLogin.value = this.tutorLogin.textContent

        this.inputDiscord.value = this.tutorDiscord.textContent
        this.inputPhone.value = this.tutorPhone.textContent
        this.inputTelegram.value = this.tutorTelegram.textContent
        this.inputWhatsapp.value = this.tutorWhatsapp.textContent
        this.flashMsg.innerHTML = ''
    }

    updateContactInfo() {
        const newContactInfo = {
            login: this.tutorLogin.textContent,
            discord: this.inputDiscord.value,
            phone: this.inputPhone.value,
            telegram: this.inputTelegram.value,
            whatsapp: this.inputWhatsapp.value
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        let errorDiscord = this.validator.checkValidDiscord(this.inputDiscord.value)
        let errorPhone = this.validator.checkValidPhone(this.inputPhone.value)
        let errorTelegram = this.validator.checkValidTelegram(this.inputTelegram.value)
        let errorWhatsapp = this.validator.checkValidWhatsapp(this.inputWhatsapp.value)
        let errors = [errorDiscord, errorPhone, errorTelegram, errorWhatsapp]

        for (let error of errors) {
            if (error) {
                flashMsg(error, this.flashMsg, 'wrong')
                return
            }
        }

        this.flashMsg.innerHTML = ''

        fetch(`/api/tutors/tutor/${this.tutorLogin.textContent}/`, {
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
        .then(tutor => {
            if (tutor.hasOwnProperty('discord')) {
                this.tutorDiscord.innerText = tutor.discord
                this.tutorPhone.innerText = tutor.phone
                this.tutorTelegram.innerText = tutor.telegram
                this.tutorWhatsapp.innerText = tutor.whatsapp

                flashMsg(`${tutor.message}`, this.flashMsg, 'success')
                console.log(tutor.message)
            } else {
                flashMsg(tutor.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class TutorInfo {
    constructor(validator) {
        this.validator = validator
        this.login = userLogin

        this.tutorLogin = document.getElementById("tutor-login")
        this.tutorName = document.getElementById("tutor-name")
        this.tutorGender = document.getElementById("tutor-gender")
        this.tutorBirthday = document.getElementById("tutor-birthday")
        this.tutorDiscord = document.getElementById("tutor-discord")
        this.tutorPhone = document.getElementById("tutor-phone")
        this.tutorTelegram = document.getElementById("tutor-telegram")
        this.tutorWhatsapp = document.getElementById("tutor-whatsapp")

        this.updateImageButton = document.getElementById('btn-update-img')
        this.updatePrimaryInfoButton = document.getElementById('btn-update-primary')
        this.updateContactInfoButton = document.getElementById('btn-update-contact')
    }

    loadTutorInfo() {
        console.log("Запрос на сервер для получения данных преподавателя")

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/tutors/tutor/${this.login}/`, {
            method: 'GET',
            headers: {
                'My-Tutor-Auth-Token': token
            }
        })
        .then(response => response.json())
        .then(data => {
            this.fillInfo(data)

            const updatePrimaryInfoForm = new UpdateTutorPrimaryInfoForm(this.validator)
            this.updatePrimaryInfoButton.onclick = () => {
                updatePrimaryInfoForm.fillUpdatePrimaryInfoForm()
            }

            const updateContactInfoForm = new UpdateTutorContactInfoForm(this.validator)
            this.updateContactInfoButton.onclick = () => {
                updateContactInfoForm.fillUpdateContactInfoForm()
            }

            const updateImageForm = new UpdateTutorImageForm()
            this.updateImageButton.onclick = () => {
                updateImageForm.fillUpdateImageForm()
            }
        })
        .catch(error => {
            console.error(error)
        })
    }

    fillInfo(tutor) {
        console.log("Заполнение личной информации преподавателя полученными данными")
        const tutorImage = document.getElementById('tutor-img');
        tutorImage.src = tutor.img_path;

        this.tutorLogin.innerText = tutor.login
        this.tutorName.innerText = `${tutor.second_name} ${tutor.first_name}`
        this.tutorGender.innerText = tutor.gender
        this.tutorBirthday.innerText = tutor.birthday
        this.tutorDiscord.innerText = tutor.discord
        this.tutorPhone.innerText = tutor.phone
        this.tutorTelegram.innerText = tutor.telegram
        this.tutorWhatsapp.innerText = tutor.whatsapp
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    const currentTutorMenuItem = document.getElementById('menu-list-profile')
    currentTutorMenuItem.classList.add('list-menu-item')
    currentTutorMenuItem.classList.add('active-menu-item')

    const validator = new Validator()
    const tutorInfo = new TutorInfo(validator)
    tutorInfo.loadTutorInfo()
})

document.getElementById('image-input').addEventListener('change', function(event) {
    const imageDescription = document.getElementById('tutor-modal-image-descr')
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
        let tutorImage = document.getElementById('tutor-img');
        let tutorImagePath = tutorImage.getAttribute('src');

        imageDescription.innerHTML = "Ваше текущее изображение";
        previewImage.src = tutorImagePath;
    }
    previewImage.style.display = 'block';
});
