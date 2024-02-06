const iconLib = {
    login: "fa-solid fa-user",
    firstName: "fa-solid fa-user",
    secondName: "fa-solid fa-user",
    gender: "fa-solid fa-venus-mars",
    birthday: "fa-solid fa-calendar-days",
    discord: "fa-brands fa-discord",
    phone: "fa-solid fa-phone",
    telegram: "fa-brands fa-telegram",
    whatsapp: "fa-brands fa-whatsapp"
}
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
  };

function convertDate(dateString) {
  const parts = dateString.replace(' года', '').split(' ');
  const day = parts[0].padStart(2, '0');
  const month = monthNumber[parts[1]];
  const year = parts[2];

  return `${year}-${month}-${day}`;
}

function fillUpdateImageForm() {
    console.log('Заполнение формы для изменения аватара преподавателя')
    document.getElementById('tutor-update-image-form-login').value = document.getElementById('tutor-login').textContent.trim()

    document.getElementById('tutor-modal-image-descr').innerHTML = "Ваше текущее изображение"
    let tutorImage = document.getElementById('tutor-img');
    let tutorImagePath = tutorImage.getAttribute('src');
    let previewImage = document.getElementById('preview-image');
    previewImage.src = tutorImagePath;
    previewImage.style.display = 'block';
    document.getElementById('tutor-update-image-form-flash-msg').innerHTML = ''
}

function fillUpdatePrimaryInfoForm() {
    console.log('Заполнение формы для изменения личной информации преподавателя')
    document.getElementById('tutor-update-primary-info-form-login').value = document.getElementById('tutor-login').textContent.trim()

    document.getElementById('tutor-update-primary-info-form-first-name').value = document.getElementById('tutor-first-name').textContent.trim()
    document.getElementById('tutor-update-primary-info-form-second-name').value = document.getElementById('tutor-second-name').textContent.trim()
    document.getElementById('tutor-update-primary-info-form-gender').value = document.getElementById('tutor-gender').textContent.trim()
    document.getElementById('tutor-update-primary-info-form-birthday').value = convertDate(document.getElementById('tutor-birthday').textContent.trim())
    document.getElementById('tutor-update-primary-info-form-flash-msg').innerHTML = ''
}

function fillUpdateContactInfoForm() {
    console.log('Заполнение формы для изменения контактных данных преподавателя')
    document.getElementById('tutor-update-contact-info-form-login').value = document.getElementById('tutor-login').textContent.trim()

    document.getElementById('tutor-update-contact-info-form-discord').value = document.getElementById('tutor-discord').textContent.trim()
    document.getElementById('tutor-update-contact-info-form-phone').value = document.getElementById('tutor-phone').textContent.trim()
    document.getElementById('tutor-update-contact-info-form-telegram').value = document.getElementById('tutor-telegram').textContent.trim()
    document.getElementById('tutor-update-contact-info-form-whatsapp').value = document.getElementById('tutor-whatsapp').textContent.trim()
    document.getElementById('tutor-update-contact-info-form-flash-msg').innerHTML = ''
}

function fillTutorDataDiv(divId, data, iconTag=null) {
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

class UpdateTutorImageForm {
    constructor() {
        this.login = document.getElementById('tutor-login').textContent.trim()
        this.tutorImage = document.getElementById('tutor-img')
        this.userImage = document.getElementById('user-image')

        this.inputLogin = document.getElementById('tutor-update-primary-info-form-login')
        this.inputImage = document.getElementById('image-input')
        this.previewImage = document.getElementById('preview-image');
        this.descriptionImage = document.getElementById('tutor-modal-image-descr')

        this.flashMsg = document.getElementById('tutor-update-image-form-flash-msg')

        this.btnUpdateImage = document.getElementById('tutor-update-image-form-button')
        this.btnUpdateImage.onclick = () => {
            this.updateImage()
        }
    }

    updateImage() {
        const imgData = new FormData();
        imgData.append('image_data', this.inputImage.files[0]);

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/tutors/tutor/image/${this.login}/`, {
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
        .then(tutor => {
            if (tutor.hasOwnProperty('img_path')) {
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
    constructor() {
        this.login = document.getElementById('tutor-login').textContent.trim()

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

    updatePrimaryInfo() {
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

        fetch(`/api/tutors/tutor/${this.login}/`, {
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
                fillTutorDataDiv("tutor-first-name", ` ${tutor.first_name}`);
                fillTutorDataDiv("tutor-second-name", ` ${tutor.second_name}`);
                fillTutorDataDiv("tutor-gender", ` ${tutor.gender}`, "gender");
                fillTutorDataDiv("tutor-birthday", ` ${tutor.birthday}`, "birthday");

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
    constructor() {
        this.login = document.getElementById('tutor-login').textContent.trim()

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

    updateContactInfo() {
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

        fetch(`/api/tutors/tutor/${this.login}/`, {
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
                fillTutorDataDiv("tutor-discord", ` ${tutor.discord}`, "discord");
                fillTutorDataDiv("tutor-phone", ` ${tutor.phone}`, "phone");
                fillTutorDataDiv("tutor-telegram", ` ${tutor.telegram}`, "telegram");
                fillTutorDataDiv("tutor-whatsapp", ` ${tutor.whatsapp}`, "whatsapp");

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
    constructor() {
        this.login = 'axessense'
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
            new UpdateTutorPrimaryInfoForm()
            new UpdateTutorContactInfoForm()
            new UpdateTutorImageForm()
        })
        .catch(error => {
            console.error(error)
        })
    }

    fillInfo(tutor) {
        console.log("Заполнение личной информации преподавателя полученными данными")
        const tutorImage = document.getElementById('tutor-img');
        tutorImage.src = tutor.img_path;

        fillTutorDataDiv("tutor-login", ` ${tutor.login}`, "login");
        fillTutorDataDiv("tutor-first-name", ` ${tutor.first_name}`);
        fillTutorDataDiv("tutor-second-name", ` ${tutor.second_name}`);
        fillTutorDataDiv("tutor-gender", ` ${tutor.gender}`, "gender");
        fillTutorDataDiv("tutor-birthday", ` ${tutor.birthday}`, "birthday");
        fillTutorDataDiv("tutor-discord", ` ${tutor.discord}`, "discord");
        fillTutorDataDiv("tutor-phone", ` ${tutor.phone}`, "phone");
        fillTutorDataDiv("tutor-telegram", ` ${tutor.telegram}`, "telegram");
        fillTutorDataDiv("tutor-whatsapp", ` ${tutor.whatsapp}`, "whatsapp");
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

document.addEventListener('DOMContentLoaded', function (event) {
    const tutorInfo = new TutorInfo()
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
