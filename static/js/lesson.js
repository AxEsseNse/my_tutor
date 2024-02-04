class LessonController {
    constructor() {
        this.lessonId = 1
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

    loadLesson() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        console.log('Запрос данных урока с сервера')

        fetch(`/api/lessons/${this.lessonId}/`, {
            method: 'GET',
            headers: {
            'My-tutor-Auth-Token': token
            }
        })
        .then(response => response.json())
        .then(theme => {
            console.log('Данные урока с сервера получены')
            this.fillThemeMenu(theme)
        })
        .catch(error => {
            console.error(error)
        })
    }

    fillThemeMenu(theme) {
        console.log(theme)
        this.examField.innerText = theme.exam
        this.titleField.innerText = theme.title
        this.examItemIdField.innerText = `Задание № ${theme.exam_task_number}`
        this.menu.innerHTML = ''
        let theoryCardId = 0
        let practiceCardId = 0
        theme.material.forEach(card => {
            console.log(card)
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
        liButton.onclick = () => {
            document.querySelectorAll('.lesson-button.active-lesson-menu-item').forEach(button => {
                button.classList.remove('active-lesson-menu-item');
            })
            this.practiceTipField.style.display = 'none';
            this.practiceTipButton.innerText = 'Показать решение'
            liButton.classList.add('active-lesson-menu-item');
            this.fillContent(card)
        }

        if (card.type === 'theory') {
            liButton.innerHTML = `${this.theoryIcon} ${cardName}`
        } else {
            liButton.innerHTML = `${this.practiceIcon} ${cardName}`
        }
        newLiItem.appendChild(liButton)
        this.menu.appendChild(newLiItem);
    }

    fillContent(card) {

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

    checkAnswer() {
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

    switchTip(tip) {

        if (this.practiceTipField.style.display === 'none') {
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
}

document.addEventListener('DOMContentLoaded', function (event) {
    const lessonController = new LessonController()
    lessonController.loadLesson()
})