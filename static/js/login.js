function sendForm() {
  const isCookieEnabled = navigator.cookieEnabled
  if (!isCookieEnabled) {
    setCookie('My-Tutor-Test-Enable_Cookie', 'test')
    const testCookie = getCookie('My-Tutor-Test-Enable_Cookie')
    if (!testCookie) {
      alert('Для работы сайта необходимы куки. Включите их и перезагрузите страницу.')
      return
    }
    deleteCookie('My-Tutor-Test-Enable_Cookie')
  }

  const login = document.getElementById('login').value
  const passwordInput = document.getElementById('password')
  const password = passwordInput.value

  const UserForm = {
    login: login,
    password: password,
  }

  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(UserForm),
  })
    .then(response => response.json())
    .then(data => {
      if (typeof data !== 'string') {
        console.log(data.detail)
        passwordInput.value = ''
        alert(data.detail)
        return
      }
      deleteCookie('My-Tutor-Auth-Token')
      setCookie('My-Tutor-Auth-Token', data)
      window.location.reload()
    })
    .catch(error => {
      console.error(error)
    })
}

function enableEnterListener() {
  const login_input = document.getElementById('login')
  const password_input = document.getElementById('password')
  login_input.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      sendForm()
    }
  })

  password_input.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      sendForm()
    }
  })
}

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


window.addEventListener('load', function() {
    console.log('xuy')
    document.body.style.display = "block"
})