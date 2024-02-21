function arrayRemove(arr, value) {
  return arr.filter(function (ele) {
    return ele !== value
  })
}

function fillFinishLessonForm() {
    console.log('Подготовка формы завершения урока')
    document.getElementById('lesson-finish-form-lesson-id').value = lessonId
}

class LessonController {
    constructor(wsConnection, lessonId) {
        this.wsConnection = wsConnection

        this.studentReadyButton = document.getElementById('student-ready-button')
        this.studentReadyStatus = document.getElementById('student-ready-status')
        this.tutorReadyButton = document.getElementById('tutor-ready-button')
        this.tutorReadyStatus = document.getElementById('tutor-ready-status')
        this.startLessonStatus = document.getElementById('start-status')

        this.lessonId = lessonId
        this.lessonStarted = false
        this.menuCardCounter = 0;
        this.practiceAnswer = ''
        this.currentPracticeCardAnswer = ''
        this.currentPracticeCardId = 0
        this.studentAnswers = {
        }

        this.theoryIcon = '<i class="fa-solid fa-book"></i>'
        this.practiceIcon = '<i class="fa-solid fa-keyboard"></i>'

        this.menu = document.getElementById('lesson-list')
        this.examField = document.getElementById('lesson-exam-btn')
        this.examItemIdField = document.getElementById('lesson-exam-task-id')
        this.titleField = document.getElementById('lesson-title')

        this.startField = document.getElementById('start-content')

        this.theoryField = document.getElementById('theory-content')
        this.theoryTitle = document.getElementById('theory-title')
        this.theoryImage = document.getElementById('theory-image')
        this.theoryDescr = document.getElementById('theory-descr')

        this.practiceField = document.getElementById('practice-content')
        this.practiceTitle = document.getElementById('practice-title')
        this.practiceImage = document.getElementById('practice-image')
        this.practiceDescr = document.getElementById('practice-descr-field')
        this.practiceAnswerField = document.getElementById('practice-answer')
        this.practiceAnswerButton = document.getElementById('practice-answer-button')
        this.practiceTipButton = document.getElementById('practice-tip-button')
        this.practiceTipField = document.getElementById('practice-tip-field')
        this.practiceTipImage = document.getElementById('practice-tip-image')
        this.practiceTipDescr = document.getElementById('practice-tip-descr')
    }

    studentReady(wsMessage = false) {
        if (wsMessage == false) {
            this.wsConnection.send('studentReady')
        }

        this.studentReadyButton.innerText = 'Готов'
        this.studentReadyButton.disabled = true
        this.studentReadyButton.classList.remove('ready-button-waiting');
        this.studentReadyButton.classList.add('ready-button-ready')
        this.studentReadyStatus.innerHTML = '<i class="fa-solid fa-check"></i>'
        this.studentReadyStatus.classList.remove('ready-status-not-ready');
        this.studentReadyStatus.classList.add('ready-status-ready')

        this.tutorReadyButton.classList.remove('ready-button-not-ready');
        this.tutorReadyButton.classList.add('ready-button-waiting')

        this.startLessonStatus.innerText = 'Ожидание преподавателя'
        this.startLessonStatus.classList.remove('start-status-waiting-student');
        this.startLessonStatus.classList.add('start-status-waiting-tutor')

        if (userRole == "Преподаватель") {
            this.tutorReadyButton.disabled = false
        }
    }

    isStudentReady() {
        if (this.studentReadyButton.innerText == 'Готов') {
            this.wsConnection.send('studentReady')
        }
    }

    tutorReady(wsMessage = false) {
        if (wsMessage == false) {
            this.wsConnection.send('tutorReady')
        }

        this.tutorReadyButton.innerText = 'Готов'
        this.tutorReadyButton.disabled = true
        this.tutorReadyButton.classList.remove('ready-button-waiting');
        this.tutorReadyButton.classList.add('ready-button-ready')
        this.tutorReadyStatus.innerHTML = '<i class="fa-solid fa-check"></i>'
        this.tutorReadyStatus.classList.remove('ready-status-not-ready');
        this.tutorReadyStatus.classList.add('ready-status-ready')

        this.startLessonStatus.innerText = 'Загрузка материала урока...'
        this.startLessonStatus.classList.remove('start-status-waiting-tutor');
        this.startLessonStatus.classList.add('start-status-get-material')

        this.requestToStartLesson()
        .then((is_started) => {
            if (is_started) {
                setTimeout(() => {
                    this.loadLesson();
                }, 3000);
            }
        })
    }

    requestToStartLesson() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            console.error('Токен не найден');
            return Promise.reject('Токен не найден');
        }

        return fetch(`/api/lessons/${this.lessonId}/start/`, {
            method: 'PUT',
            headers: {
                'My-Tutor-Auth-Token': token
            }
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
                return response.is_started
            })
            .catch(error => {
                console.log(error)
        })
    }

    getLessonStatus() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            console.error('Токен не найден');
            return Promise.reject('Токен не найден');
        }

        return fetch(`/api/lessons/${this.lessonId}/status/`, {
            method: 'GET',
            headers: {
                'My-Tutor-Auth-Token': token
            }
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
                return response.status
            })
            .catch(error => {
                console.log(error)
        })
    }

    loadLesson() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            console.error('Токен не найден');
            return Promise.reject('Токен не найден');
        }

        console.log('Запрос данных урока с сервера')

        return fetch(`/api/themes/${this.lessonId}/`, {
            method: 'GET',
            headers: {
            'My-tutor-Auth-Token': token
            }
        })
        .then(response => response.json())
        .then(theme => {
            console.log('Данные урока с сервера получены')
            this.startField.style.display = 'none'
            this.fillThemeMenu(theme)
        })
        .catch(error => {
            console.error(error)
            return Promise.reject(error);
        })
    }

    fillThemeMenu(theme) {
        this.examField.innerText = theme.exam
        this.titleField.innerText = theme.title
        this.examItemIdField.innerText = `Задание № ${theme.exam_task_number}`
        this.menu.innerHTML = ''
        let theoryCardId = 0
        let practiceCardId = 0
        theme.material.forEach(card => {
            if (card.type === 'theory') {
                theoryCardId++
                let cardName = `Теория № ${theoryCardId}`
                this.addThemeCard(card, cardName)
            } else {
                practiceCardId++
                let cardName = `Практика № ${practiceCardId}`
                this.addThemeCard(card, cardName)
            }
        })
    }

    addThemeCard(card, cardName) {
        let newLiItem = document.createElement('li')

        let liButton = document.createElement('button')
        liButton.className = 'lesson-button'
        let liButtonId = `li-button-${++this.menuCardCounter}`
        liButton.id = liButtonId
        liButton.onclick = () => {
            this.fillContent(card, liButtonId)
        }

        if (card.type === 'theory') {
            liButton.innerHTML = `${this.theoryIcon} ${cardName}`
        } else {
            liButton.innerHTML = `${this.practiceIcon} ${cardName}`
        }
        newLiItem.appendChild(liButton)
        this.menu.appendChild(newLiItem);
    }

    setActiveMenuItem(menuItemId) {
        document.querySelectorAll('.lesson-button.active-lesson-menu-item').forEach(button => {
            button.classList.remove('active-lesson-menu-item')
        })
        const menuItem = document.getElementById(menuItemId)
        menuItem.classList.add('active-lesson-menu-item')
    }

    fillContent(card, menuCardId, wsMessage=false) {

        if (wsMessage == false) {
            let data = {
                    data: card,
                    menuCardId: menuCardId
                }
            this.wsConnection.send('fillContent', data)
        }

        this.setActiveMenuItem(menuCardId)
        this.practiceTipField.style.display = 'none';
        this.practiceTipButton.innerText = 'Показать решение'

        if (card.type === 'theory') {
            this.practiceField.style.display = 'none';
            this.theoryTitle.innerText = card.title
            this.theoryImage.src = card.image_path
            this.theoryDescr.innerText = card.descr
            this.theoryField.style.display = 'block';
        } else {
            this.theoryField.style.display = 'none';
            this.currentPracticeCardId = card.id
            this.practiceTitle.innerText = card.title
            this.practiceImage.src = card.image_path
            this.practiceDescr.innerText = card.descr
            this.currentPracticeCardAnswer = card.answer
            this.practiceAnswerButton.onclick = () => {
                this.checkAnswer()
            }
            this.practiceAnswerField.classList.remove('input-answer-wrong', 'input-answer-success');
            this.practiceAnswerField.disabled = false;
            this.practiceAnswerButton.disabled = false;
            this.practiceAnswerButton.innerHTML = 'Проверить'

            if (card.tip != null) {
                this.practiceTipButton.onclick = () => {
                    this.switchTip(card.tip)
                }
            }

            if (this.studentAnswers[this.currentPracticeCardId] != undefined) {
                this.practiceAnswerField.value = this.studentAnswers[this.currentPracticeCardId]
                this.checkAnswer()
            } else {
                this.practiceAnswerField.value = ''
            }

            this.practiceField.style.display = 'block';
        }
    }

    checkAnswer(wsMessage=false) {

        if (wsMessage == false) {
            this.wsConnection.send('checkAnswer')
        }

        let studentAnswer = this.practiceAnswerField.value
        this.studentAnswers[this.currentPracticeCardId] = studentAnswer

        if (studentAnswer != this.currentPracticeCardAnswer) {
            this.practiceAnswerField.classList.remove('input-answer-success');
            this.practiceAnswerField.classList.add('input-answer-wrong');
            document.querySelectorAll('.lesson-button.active-lesson-menu-item').forEach(button => {
                button.classList.add('lesson-button-wrong');
            })
        } else {
            document.querySelectorAll('.lesson-button.active-lesson-menu-item').forEach(button => {
                button.classList.remove('lesson-button-wrong');
                button.classList.add('lesson-button-success');
            })
            this.practiceAnswerField.classList.remove('input-answer-wrong');
            this.practiceAnswerField.classList.add('input-answer-success');
            this.practiceAnswerButton.innerHTML = '<i class="fa-solid fa-check"></i>'
            this.practiceAnswerField.disabled = true;
            this.practiceAnswerButton.disabled = true;
        }


    }

    switchTip(tip, wsMessage=false) {

        if (wsMessage == false) {
            this.wsConnection.send('switchTip', tip)
        }

        let displayStyle = window.getComputedStyle(this.practiceTipField).display;

        if (displayStyle === 'none') {
            this.practiceTipImage.src = tip.image_path
            this.practiceTipDescr.innerText = tip.descr
            this.practiceTipField.style.display = 'block';
            this.practiceTipButton.innerText = 'Скрыть решение'
        } else {
            this.practiceTipImage.src = ""
            this.practiceTipDescr.innerText = ""
            this.practiceTipField.style.display = 'none';
            this.practiceTipButton.innerText = 'Показать решение'
        }
    }

    processAction(action, data) {
        switch (action) {
            case 'studentReady':
                this.studentReady(true)
                break
            case 'isStudentReady':
                this.isStudentReady()
                break
            case 'tutorReady':
                this.tutorReady(true)
                break
            case 'fillContent':
                this.fillContent(data.data, data.menuCardId, true)
                break
            case 'changeAnswerField':
                this.practiceAnswerField.value = data
                break
            case 'checkAnswer':
                this.checkAnswer(true)
                break
            case 'switchTip':
                this.switchTip(data, true)
                break
            default:
                console.error('unexpected action:', action)
                break
        }
    }
}

class FinishLessonForm {
    constructor() {
        this.lessonId = lessonId

        this.inputLessonId = document.getElementById('lesson-finish-form-lesson-id')
        this.inputNote = document.getElementById('lesson-finish-form-note')

        this.btnFinishLesson = document.getElementById('lesson-finish-form-button')
        this.btnFinishLesson.onclick = () => {
            this.finishLesson()
        }
    }

    finishLesson() {
        const lessonData = {
            lessonId: this.inputLessonId.value,
            note: this.inputNote,
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/lessons/${this.lessonId}/`, {
            method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'My-Tutor-Auth-Token': token
                },
                body: JSON.stringify(lessonData),
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
            if (response.hasOwnProperty('date')) {
                console.log(response.message)
            } else {
                console.log(response.message)
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}


class WSConnection {
    constructor(url) {
        this.url = url
        this.socket = null
        this.lastUpd = new Date()
        this.connectionList = []

        this.controller = null
    }

    setController(controller) {
        this.controller = controller;
    }

    run() {
        return new Promise((resolve, reject) => {
            this.connectToServer(this, this.controller, resolve, reject);
            setInterval(this.connectToServer, 3000, this, this.controller, resolve, reject);
        });
    }

    connectToServer(self, controller, resolve, reject) {
        if (self.socket !== null && self.socket.readyState === WebSocket.OPEN) {
            resolve();
            return;
        }

        self.socket = new WebSocket(self.url)

        self.socket.onopen = () => {
            console.info('WebSocket: connected');
            self.connectionList.push(self.socket);
            if (self.connectionList.length > 1) {
                window.location.reload();
            }
            resolve(); // Resolve the promise when the WebSocket is connected
        };

        self.socket.onerror = () => {
            self.socket.close();
            reject(new Error('WebSocket: error'));
        };

        self.socket.onclose = () => {
            self.connectionList = arrayRemove(self.connectionList, self.socket)
            self.socket = null
        }

        self.socket.onmessage = event => {
            self.lastUpd = new Date()

            const command = JSON.parse(event.data)['action']
            const data = JSON.parse(event.data)['data']

            console.info(`WS message "${command}":`, data)
            this.controller.processAction(command, data)
        }
    }

    send(action, data = null) {
        if (this.socket !== null && this.socket.readyState === WebSocket.OPEN) {
            this.lastUpd = new Date()
            this.socket.send(JSON.stringify({ action: action, data: data }))
        }
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    const startField = document.getElementById('start-content');
    const practiceTipButton = document.getElementById('practice-tip-button');
    const studentReadyButton = document.getElementById('student-ready-button')
    const tutorReadyButton = document.getElementById('tutor-ready-button')

    if (userRole == "Студент") {
        practiceTipButton.style.display = 'none';
    }

    if (userRole == "Преподаватель") {
        studentReadyButton.disabled = true
    }

    studentReadyButton.onclick = () => {
        lessonController.studentReady()
    }
    tutorReadyButton.onclick = () => {
        lessonController.tutorReady()
    }

    const urlSegments = window.location.href.split('/');
    const lessonId = urlSegments[urlSegments.length - 1];
    const url = `ws://${window.location.host}/api/lessons/ws/${lessonId}/`

    const wsConnection = new WSConnection(url)
    const lessonController = new LessonController(wsConnection, lessonId)
    lessonController.getLessonStatus()
    .then((status) => {
        console.log(status)
        if (status == 'STARTED') {
            let lessonStar = true
            lessonController.lessonStarted = true
            lessonController.loadLesson()
        } else {
            startField.style.display = 'block'
        }
    })

    wsConnection.setController(lessonController)
    wsConnection.run()
    .then(() => {
        if (lessonController.lessonStarted == false && userRole == "Преподаватель") {
            wsConnection.send('isStudentReady')
        }
    })

    const practiceAnswerInput = document.getElementById('practice-answer')
    practiceAnswerInput.addEventListener('input', () => {
        const currentAnswer = practiceAnswerInput.value;
        wsConnection.send('changeAnswerField', currentAnswer)
    })
})
