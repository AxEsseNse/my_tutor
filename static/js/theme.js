function arrayRemove(arr, value) {
  return arr.filter(function (ele) {
    return ele !== value
  })
}


class ThemeController {
    constructor(themeId) {
        this.correctAnswerSound = document.getElementById('correctAnswerSound')
        this.incorrectAnswerSound = document.getElementById('incorrectAnswerSound')

        this.studentReadyButton = document.getElementById('student-ready-button')
        this.studentReadyStatus = document.getElementById('student-ready-status')
        this.tutorReadyButton = document.getElementById('tutor-ready-button')
        this.tutorReadyStatus = document.getElementById('tutor-ready-status')
        this.startLessonStatus = document.getElementById('start-status')

        this.themeId = themeId
        this.menuCardCounter = 0
        this.currentPracticeCardAnswer = ''
        this.currentPracticeCardId = 0
        this.studentAnswers = {}

        this.practiceIcon = '<i class="fa-solid fa-keyboard"></i>'

        this.menu = document.getElementById('lesson-list')
        this.examField = document.getElementById('lesson-exam')
        this.examFieldButton = document.getElementById('lesson-exam-btn')
        this.examItemIdField = document.getElementById('lesson-exam-task-id')
        this.titleField = document.getElementById('lesson-title')

        this.startField = document.getElementById('start-content')
        this.cardTitle = document.getElementById('card-title')

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

    loadTheme() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            console.error('Токен не найден');
            Promise.reject('Токен не найден');
        }

        console.log('Запрос данных темы с сервера')

        fetch(`/api/themes/${this.themeId}/${userId}/`, {
            method: 'GET',
            headers: {
            'My-tutor-Auth-Token': token
            }
        })
        .then(response => response.json())
        .then(theme => {
            console.log('Данные темы с сервера получены')

            console.log(theme)
            this.studentAnswers = theme.progress_cards
            this.fillThemeMenu(theme.theme)
        })
        .catch(error => {
            console.error(error)
            Promise.reject(error);
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

        liButton.onclick = () => {
            this.fillContent(card, liButtonId)
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

    fillContent(card, menuCardId) {
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
            if (userRole == 'Студент') {
                if (!(this.currentPracticeCardId in this.studentAnswers)) {
                    this.hideField('practiceField')
                    this.hideField('theoryField')
                    this.cardTitle.innerText = 'Вы еще не изучали данную задачу'
                    return
                }
            }

            this.hideField('theoryField')
            this.cardTitle.innerText = card.title
            this.practiceImage.src = card.image_path
            this.practiceDescr.innerText = card.descr

            if (card.file_name && card.file_path) {
                this.practiceDownloadFileField.classList.remove('hidden-field')
                const lastDotIndex = card.file_name.lastIndexOf('.')
                this.practiceDownloadFileName.innerText = card.file_name.substring(0, lastDotIndex)
                this.practiceDownloadFile.href = card.file_path
                this.practiceDownloadFile.download = card.file_name
            } else {
                this.hideField('downloadFile')
            }

            this.currentPracticeCardAnswer = card.answer
            this.practiceAnswerButton.onclick = () => {
                this.checkAnswer()
            }
            this.practiceAnswerField.classList.remove('input-answer-wrong', 'input-answer-success');
            this.practiceAnswerField.disabled = false;
            this.practiceAnswerField.setAttribute('data-tooltip', card.answer)
            this.practiceAnswerButton.disabled = false;
            this.practiceAnswerButton.innerHTML = 'Проверить'

            if (this.practiceAnswerButton.classList.contains('practice-answer-button-success')) {
                this.practiceAnswerButton.classList.remove('practice-answer-button-success')
                this.practiceAnswerButton.classList.add('practice-answer-button')
            }

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

            this.practiceField.classList.remove('hidden-field')
        }
    }

    setCardAnswerTitleEventListener() {
        let tooltipTimeout

        this.practiceAnswerField.addEventListener('mouseover', function() {
            const inputElement = this

            if (!inputElement.getAttribute('data-tooltip').trim()) {
                return
            }

            tooltipTimeout = setTimeout(function() {
                let tooltip = document.createElement('div')
                tooltip.className = 'answer-tooltip'
                tooltip.textContent = inputElement.getAttribute('data-tooltip')
                document.body.appendChild(tooltip)

                tooltip.style.position = 'absolute'
                tooltip.style.left = inputElement.getBoundingClientRect().left + 'px'
                tooltip.style.top = (inputElement.getBoundingClientRect().top - tooltip.offsetHeight - 5) + 'px'
            }, 1000)
        })

        this.practiceAnswerField.addEventListener('mouseout', function() {
            clearTimeout(tooltipTimeout)
            const tooltip = document.querySelector('.answer-tooltip')
            if (tooltip) {
                tooltip.remove()
            }
        })
    }

    checkAnswer() {
        let studentAnswer = this.practiceAnswerField.value
        this.studentAnswers[this.currentPracticeCardId] = studentAnswer

        if (studentAnswer != this.currentPracticeCardAnswer) {
            this.practiceAnswerField.classList.remove('input-answer-success')
            this.practiceAnswerField.classList.add('input-answer-wrong')
            document.querySelectorAll('.lesson-menu-button.active-lesson-menu-item').forEach(button => {
                button.classList.add('lesson-button-wrong')
            })
            playSound(this.incorrectAnswerSound)
        } else {
            document.querySelectorAll('.lesson-menu-button.active-lesson-menu-item').forEach(button => {
                button.classList.remove('lesson-button-wrong')
                button.classList.add('lesson-button-success')
            })
            this.practiceAnswerField.classList.remove('input-answer-wrong')
            this.practiceAnswerField.classList.add('input-answer-success')
            this.practiceAnswerButton.innerHTML = '<i class="fa-solid fa-check"></i>'
            this.practiceAnswerField.disabled = true
            this.practiceAnswerButton.disabled = true
            this.practiceAnswerButton.classList.remove('practice-answer-button')
            this.practiceAnswerButton.classList.add('practice-answer-button-success')
            playSound(this.correctAnswerSound)
        }
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
}

document.addEventListener('DOMContentLoaded', function (event) {
    const startField = document.getElementById('start-content');
    const practiceTipButton = document.getElementById('practice-tip-button');
    const practiceTipStudentButton = document.getElementById('practice-tip-student-button');
    const studentReadyButton = document.getElementById('student-ready-button')
    const tutorReadyButton = document.getElementById('tutor-ready-button')

    const urlSegments = window.location.href.split('/');
    const themeId = urlSegments[urlSegments.length - 1];
    const themeController = new ThemeController(themeId)
    themeController.loadTheme()
    themeController.setCardAnswerTitleEventListener()

    const practiceAnswerInput = document.getElementById('practice-answer')
    practiceAnswerInput.addEventListener('input', () => {
        practiceAnswerInput.classList.remove('input-answer-wrong')
    })
})
