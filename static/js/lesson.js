function arrayRemove(arr, value) {
  return arr.filter(function (ele) {
    return ele !== value
  })
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
        this.themeId = null
        this.studentId = null
        this.lessonStarted = false
        this.menuCardCounter = 0;
        this.practiceAnswer = ''
        this.currentPracticeCardAnswer = ''
        this.currentPracticeCardId = 0
        this.studentAnswers = {
        }

        //this.theoryIcon = '<i class="fa-solid fa-book"></i>'
        this.practiceIcon = '<i class="fa-solid fa-keyboard"></i>'

        this.lessonTimer = document.getElementById('lesson-timer')
        this.menu = document.getElementById('lesson-list')
        this.examField = document.getElementById('lesson-exam')
        this.examFieldButton = document.getElementById('lesson-exam-btn')
        this.examItemIdField = document.getElementById('lesson-exam-task-id')
        this.titleField = document.getElementById('lesson-title')

        this.startField = document.getElementById('start-content')
        this.cardTitle = document.getElementById('card-title')
        this.currentCard = null
        this.currentMenuItem = null

        this.theoryField = document.getElementById('theory-content')
        this.theoryImage = document.getElementById('theory-image')
        this.theoryDescr = document.getElementById('theory-descr')

        this.practiceField = document.getElementById('practice-content')
        this.practiceImage = document.getElementById('practice-image')
        this.practiceDescr = document.getElementById('practice-descr-field')
        this.practiceDownloadFileField = document.getElementById('practice-download-file-field')
        this.practiceDownloadFileName = document.getElementById('practice-download-file-name')
        this.practiceDownloadFile = document.getElementById('practice-download-file')
        this.practiceAnswerField = document.getElementById('practice-answer')
        this.practiceAnswerButton = document.getElementById('practice-answer-button')
        this.practiceTipButton = document.getElementById('practice-tip-button')
        this.practiceTipStudentButton = document.getElementById('practice-tip-student-button')
        this.practiceTipField = document.getElementById('practice-tip-field')
        this.practiceTipImage = document.getElementById('practice-tip-image')
        this.practiceTipDescr = document.getElementById('practice-tip-descr')
    }

    hideField(field) {
        switch (field) {
            case 'startField':
                if (!this.startField.classList.contains('hidden-field')) {
                        this.startField.classList.add('hidden-field')
                    }
                break
            case 'theoryField':
                if (!this.theoryField.classList.contains('hidden-field')) {
                        this.theoryField.classList.add('hidden-field')
                    }
                break
            case 'practiceField':
                if (!this.practiceField.classList.contains('hidden-field')) {
                        this.practiceField.classList.add('hidden-field')
                    }
                break
            case 'practiceTipField':
                if (!this.practiceTipField.classList.contains('hidden-field')) {
                        this.practiceTipField.classList.add('hidden-field')
                    }
                break
            case 'downloadFile':
                if (!this.practiceDownloadFileField.classList.contains('hidden-field')) {
                        this.practiceDownloadFileField.classList.add('hidden-field')
                    }
                break
        }
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

        if (userRole == 'Преподаватель') {
            this.startLesson()
            .then((is_started) => {
                if (is_started) {
                    this.wsConnection.send('startStudentLesson')
                    setTimeout(() => {
                        this.loadLesson();
                        this.cardTitle.innerText = "Добро пожаловать на урок"
                        this.startLessonTimer(60*55)
                    }, 3000);

                }
            })
        }
    }

    startStudentLesson() {
        setTimeout(() => {
            this.loadLesson();
            this.cardTitle.innerText = "Добро пожаловать на урок"
            this.startLessonTimer(60*55)
        }, 3000);
    }

    startLesson() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            console.error('Токен не найден');
            return Promise.reject('Токен не найден');
        }

        if (userRole == 'Студент') {
            return Promise.rejects()
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
                return response
            })
            .catch(error => {
                console.log(error)
        })
    }

    startLessonTimer(duration) {
        let timer = duration, minutes, seconds;
        const lessonTimer = this.lessonTimer
        const flashDuration = 500
        let flashStatus = false

        function updateTimerDisplay(mins, secs) {
            minutes = parseInt(mins, 10)
            seconds = parseInt(secs, 10)

            minutes = minutes < 10 ? "0" + minutes : minutes
            seconds = seconds < 10 ? "0" + seconds : seconds

            lessonTimer.textContent = minutes + " : " + seconds
        }

        updateTimerDisplay(timer / 60, timer % 60);
        lessonTimer.classList.remove('hidden-field')

        var interval = setInterval(function () {
            updateTimerDisplay(timer / 60, timer % 60)

            if (--timer < 0) {
                clearInterval(interval)
                lessonTimer.textContent = "00 : 00"
                lessonTimer.style.color = '#F6E6AE'

                const flashInterval = setInterval(function () {
                    lessonTimer.style.visibility = flashStatus ? 'visible' : 'hidden'
                    flashStatus = !flashStatus
                }, flashDuration);
                setTimeout(function () {
                    clearInterval(flashInterval)
                    window.location.href = '/'
                }, 300000)
            }
        }, 1000)
    }

    loadLesson() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            console.error('Токен не найден');
            return Promise.reject('Токен не найден');
        }

        console.log('Запрос данных урока с сервера')

        return fetch(`/api/lessons/${this.lessonId}/material/`, {
            method: 'GET',
            headers: {
            'My-tutor-Auth-Token': token
            }
        })
        .then(response => response.json())
        .then(lesson => {
            console.log('Данные урока с сервера получены')

            if (userRole == "Преподаватель") {
                new FinishLessonForm(this.wsConnection, this, lesson.student_id, lesson.theme.theme_id, lesson.theme.title)
            }
            console.log(lesson)
            this.hideField('startField')
            this.studentAnswers = lesson.progress_cards
            this.themeId = lesson.theme.theme_id
            this.studentId = lesson.student_id
            this.fillThemeMenu(lesson.theme)
        })
        .catch(error => {
            console.error(error)
            return Promise.reject(error);
        })
    }

    fillThemeMenu(theme) {
        this.examFieldButton.innerText = theme.exam
        this.examField.classList.remove('hidden-field')
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
        liButton.className = 'lesson-menu-button'

        if (card.type == 'practice' && card.card_id in this.studentAnswers) {

            if (card.answer == this.studentAnswers[card.card_id]) {
                liButton.classList.add('lesson-button-success');
            } else {
                liButton.classList.add('lesson-button-wrong');
            }

        }

        let liButtonId = `li-button-${++this.menuCardCounter}`
        liButton.id = liButtonId

        if (userRole == "Преподаватель") {
            liButton.onclick = () => {
                this.fillContent(card, liButtonId)
            }
        }

        if (card.type === 'theory') {
            liButton.innerHTML = cardName
        } else {
            liButton.innerHTML = `${this.practiceIcon} ${cardName}`
        }
        newLiItem.appendChild(liButton)
        this.menu.appendChild(newLiItem);
    }

    setActiveMenuItem(menuItemId) {
        document.querySelectorAll('.lesson-menu-button.active-lesson-menu-item').forEach(button => {
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
            this.currentCard = card
            this.currentMenuItem = menuCardId
        }

        this.setActiveMenuItem(menuCardId)
        this.hideField('practiceTipField')
        this.practiceTipButton.innerText = 'Показать решение'
        this.currentPracticeCardId = card.card_id

        if (card.type === 'theory') {
            this.hideField('practiceField')
            this.cardTitle.innerText = card.title
            this.theoryImage.src = card.image_path
            this.theoryDescr.innerText = card.descr
            this.theoryField.classList.remove('hidden-field')
        } else {
            this.hideField('theoryField')
            this.cardTitle.innerText = card.title
            this.practiceImage.src = card.image_path
            this.practiceDescr.innerText = card.descr

            if (card.file_name && card.file_path) {
                this.practiceDownloadFileField.classList.remove('hidden-field')
                const indexLastPoint = card.file_name.lastIndexOf('.')
                this.practiceDownloadFileName.innerText = card.file_name.substring(0, indexLastPoint)
                this.practiceDownloadFile.href = card.file_path
                this.practiceDownloadFile.download = card.file_name
            } else {
                this.hideField('downloadFile')
            }

            this.currentPracticeCardAnswer = card.answer
            this.practiceAnswerButton.onclick = () => {
                this.checkAnswer(false, true)
            }
            this.practiceAnswerField.classList.remove('input-answer-wrong', 'input-answer-success');
            this.practiceAnswerField.disabled = false;
            this.practiceAnswerButton.disabled = false;
            this.practiceAnswerButton.innerHTML = 'Проверить'

            if (this.practiceAnswerButton.classList.contains('practice-answer-button-success')) {
                this.practiceAnswerButton.classList.remove('practice-answer-button-success')
                this.practiceAnswerButton.classList.add('practice-answer-button')
            }

            if (card.tip != null && userRole == 'Преподаватель') {
                this.practiceTipButton.onclick = () => {
                    this.switchTip(card.tip)
                }
            }

            this.practiceTipStudentButton.title = "Показать решение студенту"

            if (this.practiceTipStudentButton.classList.contains('show-tip-student')) {
                this.practiceTipStudentButton.classList.remove('show-tip-student')
                this.practiceTipStudentButton.classList.add('hide-tip-student')
            }

            if (card.tip != null && userRole == 'Преподаватель') {
                this.practiceTipStudentButton.onclick = () => {
                    this.switchStudentTip(card.tip)
                }
            }

            if (this.studentAnswers[this.currentPracticeCardId] != undefined) {
                this.practiceAnswerField.value = this.studentAnswers[this.currentPracticeCardId]
                this.checkAnswer(false, false)
            } else {
                this.practiceAnswerField.value = ''
            }

            this.practiceField.classList.remove('hidden-field')
        }
    }

    getCurrentCard() {
        if (this.currentCard != null && this.currentMenuItem != null) {
            let data = {
                    data: this.currentCard,
                    menuCardId: this.currentMenuItem
                }
            this.wsConnection.send('fillContent', data)
        }
    }

    checkAnswer(wsMessage=false, needUpdate=false) {

        if (wsMessage == false) {
            this.wsConnection.send('checkAnswer')
        }

        let studentAnswer = this.practiceAnswerField.value
        this.studentAnswers[this.currentPracticeCardId] = studentAnswer

        if (studentAnswer != this.currentPracticeCardAnswer) {
            this.practiceAnswerField.classList.remove('input-answer-success');
            this.practiceAnswerField.classList.add('input-answer-wrong');
            document.querySelectorAll('.lesson-menu-button.active-lesson-menu-item').forEach(button => {
                button.classList.add('lesson-button-wrong');
            })
        } else {
            document.querySelectorAll('.lesson-menu-button.active-lesson-menu-item').forEach(button => {
                button.classList.remove('lesson-button-wrong');
                button.classList.add('lesson-button-success');
            })
            this.practiceAnswerField.classList.remove('input-answer-wrong');
            this.practiceAnswerField.classList.add('input-answer-success');
            this.practiceAnswerButton.innerHTML = '<i class="fa-solid fa-check"></i>'
            this.practiceAnswerField.disabled = true;
            this.practiceAnswerButton.disabled = true;
            this.practiceAnswerButton.classList.remove('practice-answer-button')
            this.practiceAnswerButton.classList.add('practice-answer-button-success')
        }

        if (needUpdate == true && userRole == "Студент") {
            this.updateStudentAnswers()
        }
    }

    updateStudentAnswers() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        const lessonData = {
            lessonId: this.lessonId,
            themeId: this.themeId,
            studentId: this.studentId,
            studentAnswers: this.studentAnswers
        }

        console.log(lessonData)

        fetch(`/api/themes/${this.themeId}/student-answers/${this.studentId}/`, {
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
            console.log(response.message)
        })
        .catch(error => {
            console.log(error)
        })
    }

    switchTip(tip) {
        let displayStyle = window.getComputedStyle(this.practiceTipField).display;

        if (displayStyle === 'none') {
            this.practiceTipImage.src = tip.image_path
            this.practiceTipDescr.innerText = tip.descr
            this.practiceTipField.classList.remove('hidden-field')
            this.practiceTipButton.innerText = 'Скрыть решение'
        } else {
            this.practiceTipImage.src = ""
            this.practiceTipDescr.innerText = ""
            this.hideField('practiceTipField')
            this.practiceTipButton.innerText = 'Показать решение'
        }
    }

    switchStudentTip(tip, status) {

        if (userRole == "Преподаватель") {

            if (this.practiceTipStudentButton.classList.contains('hide-tip-student')) {
                let data = {
                    tip: tip,
                    status: 'show'
                }
                this.wsConnection.send('switchStudentTip', data)
                this.practiceTipStudentButton.classList.remove('hide-tip-student')
                this.practiceTipStudentButton.classList.add('show-tip-student')
                this.practiceTipStudentButton.title = "Скрыть решение у студента"
                this.practiceTipStudentButton.innerHTML = '<i class="fa-solid fa-eye"></i>'
                return
            } else {
                let data = {
                    tip: tip,
                    status: 'hide'
                }
                this.wsConnection.send('switchStudentTip', data)
                this.practiceTipStudentButton.classList.remove('show-tip-student')
                this.practiceTipStudentButton.classList.add('hide-tip-student')
                this.practiceTipStudentButton.title = "Показать решение студенту"
                this.practiceTipStudentButton.innerHTML = '<i class="fa-solid fa-eye-slash"></i>'
                return
            }
        }

        let displayStyle = window.getComputedStyle(this.practiceTipField).display;

        if (status == 'show') {
            this.practiceTipImage.src = tip.image_path
            this.practiceTipDescr.innerText = tip.descr
            this.practiceTipField.classList.remove('hidden-field')
        } else {
            this.practiceTipImage.src = ""
            this.practiceTipDescr.innerText = ""
            this.hideField('practiceTipField')
        }
    }

    finishLesson() {
        (async () => {
            await this.updateStudentAnswers()
            window.location.href = '/'
        })()
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
            case 'startStudentLesson':
                this.startStudentLesson()
                break
            case 'fillContent':
                this.fillContent(data.data, data.menuCardId, true)
                break
            case 'getCurrentCard':
                this.getCurrentCard()
                break
            case 'changeAnswerField':
                this.practiceAnswerField.value = data
                break
            case 'checkAnswer':
                this.checkAnswer(true, false)
                break
            case 'switchStudentTip':
                this.switchStudentTip(data.tip, data.status)
                break
            case 'finishLesson':
                this.finishLesson()
                break
            default:
                console.error('unexpected action:', action)
                break
        }
    }
}


class FinishLessonForm {
    constructor(wsConnection, lessonController, studentId, themeId, themeTitle) {
        this.lessonId = lessonId

        this.wsConnection = wsConnection
        this.lessonController = lessonController
        this.studentId = studentId
        this.themeId = themeId
        this.themeTitle = themeTitle

        this.inputTheme = document.getElementById('lesson-finish-form-theme')
        this.inputLessonStatus = document.getElementById('lesson-finish-form-lesson-status')
        this.inputThemeStatus = document.getElementById('lesson-finish-form-theme-status')
        this.inputNote = document.getElementById('lesson-finish-form-note')

        this.btnFinishLesson = document.getElementById('lesson-finish-form-button')
        this.btnFinishLesson.onclick = () => {
            this.finishLesson()
        }

        this.fillFinishLessonForm()
    }

    fillFinishLessonForm() {
        console.log('Подготовка формы завершения урока')
        this.inputTheme.value = this.themeTitle
    }

    finishLesson() {
        const lessonData = {
            lessonId: this.lessonId,
            studentId: this.studentId,
            themeId: this.themeId,
            themeStatus: this.inputThemeStatus.value,
            progressCards: this.lessonController.studentAnswers,
            lessonStatus: this.inputLessonStatus.value,
            note: this.inputNote.value
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
                this.wsConnection.send('finishLesson')
                window.location.href = '/';
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
    const practiceTipStudentButton = document.getElementById('practice-tip-student-button');
    const studentReadyButton = document.getElementById('student-ready-button')
    const tutorReadyButton = document.getElementById('tutor-ready-button')

    if (userRole == "Студент") {
        practiceTipButton.style.display = 'none'
        practiceTipStudentButton.style.display = 'none'
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
    .then(async (response) => {
        console.log(status)

        if (response.status == 'STARTED') {
            lessonController.lessonStarted = true
            lessonController.cardTitle.innerText = 'Добро пожаловать на урок'
            await lessonController.loadLesson()
            lessonController.startLessonTimer(response.time_left)
        } else {
            startField.classList.remove('hidden-field')
            lessonController.cardTitle.innerText = 'Подтвердите готовность к уроку'
        }
    })
    .then(async () => {
        wsConnection.setController(lessonController);
        await wsConnection.run();
    })
    .then(() => {
        if (lessonController.lessonStarted == false && userRole == "Преподаватель") {
            wsConnection.send('isStudentReady');
        }
        if (lessonController.lessonStarted == true && userRole == "Студент") {
            wsConnection.send('getCurrentCard');
        }
    })
    .catch(error => {
        console.error('Произошла ошибка:', error);
    });

    const practiceAnswerInput = document.getElementById('practice-answer')
    practiceAnswerInput.addEventListener('input', () => {
        practiceAnswerInput.classList.remove('input-answer-wrong')
        wsConnection.send('changeAnswerField', practiceAnswerInput.value)
    })
})
