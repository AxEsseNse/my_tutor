function getCookie(name) {
    const matches = document.cookie.match(
        new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'),
    )
    return matches ? decodeURIComponent(matches[1]) : undefined
}

function setCookie(name, value) {
    options = '; path=/; max-age=604800'
    const updatedCookie = `${name}=${value}${options}`
    document.cookie = updatedCookie
}

function deleteCookie(name) {
    options = '=x; path=/; max-age=-1'
    const deletedCookie = name + options
    document.cookie = deletedCookie
}

function logOut() {
    deleteCookie('My-Tutor-Auth-Token')
    window.location.reload()
}

function checkPasswords(psw, pswRe) {
    if (psw.length < 10) {
        return 'Длина пароля должна быть не менее 10 символов'
    }
    if (!(psw === pswRe)) {
        return 'Введенные пароли не совпадают'
    }
    return NaN
}

function flashMsg(flashMsg, flashMsgDiv, flashMsgType, flashMsgTime = null) {
    flashMsgDiv.innerHTML = ''
    switch (flashMsgType) {
        case 'success':
            if (!flashMsgDiv.classList.contains('flash-msg-success')) {
                flashMsgDiv.classList.add('flash-msg-success')
            }
            flashMsgDiv.classList.remove('flash-msg-wrong')
            flashMsgDiv.innerHTML = flashMsg
            break
        case 'wrong':
            if (!flashMsgDiv.classList.contains('flash-msg-wrong')) {
                flashMsgDiv.classList.add('flash-msg-wrong')
            }
            flashMsgDiv.classList.remove('flash-msg-success')
            flashMsgDiv.innerHTML = flashMsg
            if (flashMsgTime) {
                setTimeout(function () {
                    flashMsgDiv.innerHTML = ''
                }, flashMsgTime * 1000)
            }
            break
    }
}

function setTodayDate() {
    var today = moment().format('YYYY-MM-DD')
    document.getElementById('lesson-add-form-date').value = today
}

class PasswordFormUpdate {
    constructor() {
        this.inputCurrentPassword = document.getElementById('user-update-password-form-current-password')
        this.inputNewPassword = document.getElementById('user-update-password-form-new-password')
        this.inputNewPasswordRe = document.getElementById('user-update-password-form-new-password-re')

        this.flashMsg = document.getElementById('user-update-password-form-flash-msg')

        this.btnUpdatePassword = document.getElementById('user-update-password-form-button')
        this.btnUpdatePassword.onclick = () => {
            this.updatePassword()
        }
    }

    clearUpdateForm() {
        this.inputCurrentPassword.value = ''
        this.inputNewPassword.value = ''
        this.inputNewPasswordRe.value = ''
        this.flashMsg.innerHTML = ''
    }

    updatePassword() {
        const checkPsw = checkPasswords(this.inputNewPassword.value, this.inputNewPasswordRe.value)

        if (checkPsw) {
            flashMsg(checkPsw, this.flashMsg, 'wrong')
            return
        }

        const updatedPassword = {
            userId: userId,
            currentPassword: this.inputCurrentPassword.value,
            newPassword: this.inputNewPassword.value
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/users/${userId}/password/`, {
            method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'My-Tutor-Auth-Token': token
                },
                body: JSON.stringify(updatedPassword),
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
                flashMsg(`Пароль пользователя "${response.login}" успешно изменен`, this.flashMsg, 'success')
                this.inputCurrentPassword.value = response.new_password
                this.inputNewPassword.value = ''
                this.inputNewPasswordRe.value = ''
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

document.addEventListener('DOMContentLoaded', function (event) {

    if (!userRole) {
        return
    }

    passwordFormUpdate = new PasswordFormUpdate()
    const updatePasswordButton = document.getElementById('user-update-password-button')
    updatePasswordButton.onclick = () => {
        passwordFormUpdate.clearUpdateForm()
    }
})
