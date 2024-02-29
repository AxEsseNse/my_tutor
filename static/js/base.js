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

function logIn() {
    window.location.href = '/login';
}

function logOut() {
    deleteCookie('My-Tutor-Auth-Token')
    window.location.reload()
}

function checkPasswords(psw, pswRe) {
    if (psw.length < 3) {
        return 'Длина пароля должна быть не менее 10 символов'
    }
    if (!(psw === pswRe)) {
        return 'Введенные пароли не совпадают'
    }
    return NaN
}

function flashMsg(flashMsg, flashMsgDiv, flashMsgType, flashMsgTime = NaN) {
    flashMsgDiv.innerHTML = ''
    switch (flashMsgType) {
        case 'success':
            if (!flashMsgDiv.classList.contains('axe-flash-msg-success')) {
                flashMsgDiv.classList.add('axe-flash-msg-success')
            }
            if (flashMsgDiv.classList.contains('axe-flash-msg-wrong')) {
                flashMsgDiv.classList.remove('axe-flash-msg-wrong')
            }
            flashMsgDiv.innerHTML = flashMsg
            break
        case 'wrong':
            if (!flashMsgDiv.classList.contains('axe-flash-msg-wrong')) {
                flashMsgDiv.classList.add('axe-flash-msg-wrong')
            }
            if (flashMsgDiv.classList.contains('axe-flash-msg-success')) {
                flashMsgDiv.classList.remove('axe-flash-msg-success')
            }
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
    document.getElementById('lesson-add-form-date').value = today;
}
