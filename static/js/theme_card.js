class Controller {
    constructor() {
        this.exams = {
            1: "ege",
            2: "oge"
        }

        this.currentExamId = null
        this.currentThemeId = null
        this.currentExamTaskNumber = null
        this.currentCard = null
        this.currentCardId = null
        this.currentCardPosition = null
        this.currentCardAnswer = null
        this.themes = []
        this.themesSelectField = document.getElementById('theme-select')
        this.themesSelect = document.getElementById('theme-card-theme')
        this.actionSelectField = document.getElementById('action-select')
        this.actionSelect = document.getElementById('theme-card-action')

        this.cards = {}
        this.createCardField = document.getElementById('create-content')
        this.updateCardSelectField = document.getElementById('update-content')
        this.updateCardSelect = document.getElementById('theme-card-update')
        this.deleteCardSelectField = document.getElementById('delete-content')
        this.deleteCardSelect = document.getElementById('theme-card-delete')
        this.deleteCardButton = document.getElementById('delete-card-button')

        this.flashMsg = document.getElementById('card-flash-msg')
        this.cardAction = document.getElementById('card-action')
        this.PreviewCardTitle = document.getElementById('card-title')
        this.cardContent = document.getElementById('card-content')

        this.PreviewCardTheoryField = document.getElementById('theory-content')
        this.PreviewCardTheoryImage = document.getElementById('theory-image')
        this.PreviewCardTheoryDescr = document.getElementById('theory-descr')

        this.PreviewCardPracticeField = document.getElementById('practice-content')
        this.PreviewCardPracticeImage = document.getElementById('practice-image')
        this.PreviewCardPracticeDescr = document.getElementById('practice-descr-field')
        this.PreviewCardPracticeAnswerField = document.getElementById('practice-answer')
        this.PreviewCardPracticeAnswerButton = document.getElementById('practice-answer-button')

        this.PreviewCardPracticeTipField = document.getElementById('practice-tip-field')
        this.PreviewCardPracticeTipButton = document.getElementById('practice-tip-button')
        this.PreviewCardPracticeTipImage = document.getElementById('practice-tip-image')
        this.PreviewCardPracticeTipDescr = document.getElementById('practice-tip-descr')


        //инпут поля для редактирования и создания
        this.createTheoryCardButton = document.getElementById('create-theory-card-button')
        this.createPracticeCardButton = document.getElementById('create-practice-card-button')

        this.theoryField = document.getElementById('card-theory-field')
        this.theoryTitle = document.getElementById('card-theory-title')
        this.theoryDescr = document.getElementById('card-theory-descr')
        this.theoryImagePreview = document.getElementById('card-theory-image-preview')
        this.theoryImage = document.getElementById('card-theory-image')

        this.practiceField = document.getElementById('card-practice-field')
        this.practiceTitle = document.getElementById('card-practice-title')
        this.practiceDescr = document.getElementById('card-practice-descr')
        this.practiceAnswer = document.getElementById('card-practice-answer')
        this.practiceImagePreview = document.getElementById('card-practice-image-preview')
        this.practiceImage = document.getElementById('card-practice-image')

        this.practiceTipField = document.getElementById('card-practice-tip-field')
        this.practiceTipButton = document.getElementById('card-practice-tip-button')
        this.practiceTipDescr = document.getElementById('card-practice-tip-descr')
        this.practiceTipImagePreview = document.getElementById('card-practice-tip-image-preview')
        this.practiceTipImage = document.getElementById('card-practice-tip-image')
        //общие кнопки для редактирования и создания карточек
        this.cardPositionSelectField = document.getElementById('card-position-field')
        this.cardPositionSelect = document.getElementById('card-position')
        this.sendCardDataButton = document.getElementById('send-card-data-to-server-button')
    }

    hideField(field) {
        switch (field) {
            case 'chooseAction':
                if (!this.actionSelectField.classList.contains('hidden-field')) {
                        this.actionSelectField.classList.add('hidden-field')
                    }
                break
            case 'createCard':
                if (!this.createCardField.classList.contains('hidden-field')) {
                    this.createCardField.classList.add('hidden-field')
                }
                break
            case 'updateCard':
                if (!this.updateCardSelectField.classList.contains('hidden-field')) {
                    this.updateCardSelectField.classList.add('hidden-field')
                }
                break
            case 'deleteCard':
                if (!this.deleteCardSelectField.classList.contains('hidden-field')) {
                    this.deleteCardSelectField.classList.add('hidden-field')
                }
                break
            case 'cardContent':
                if (!this.cardContent.classList.contains('hidden-field')) {
                    this.cardContent.classList.add('hidden-field')
                }
                break
            case 'theoryCardInput':
                if (!this.theoryField.classList.contains('hidden-field')) {
                    this.theoryField.classList.add('hidden-field')
                }
                break
            case 'theoryCardInputImage':
                if (!this.theoryImagePreview.classList.contains('hidden-field')) {
                    this.theoryImagePreview.classList.add('hidden-field')
                }
                break
            case 'practiceCardInput':
                if (!this.practiceField.classList.contains('hidden-field')) {
                    this.practiceField.classList.add('hidden-field')
                }
                break
            case 'practiceCardInputImage':
                if (!this.practiceImagePreview.classList.contains('hidden-field')) {
                    this.practiceImagePreview.classList.add('hidden-field')
                }
                break
            case 'practiceCardTipInput':
                if (!this.practiceTipField.classList.contains('hidden-field')) {
                    this.practiceTipField.classList.add('hidden-field')
                }
                break
            case 'practiceCardTipInputImage':
                if (!this.practiceTipImagePreview.classList.contains('hidden-field')) {
                    this.practiceTipImagePreview.classList.add('hidden-field')
                }
                break
            case 'showTipButton':
                if (!this.practiceTipButton.classList.contains('hidden-field')) {
                    this.practiceTipButton.classList.add('hidden-field')
                }
                break
            case 'cardDataButtons':
                if (!this.cardPositionSelectField.classList.contains('hidden-field')) {
                    this.cardPositionSelectField.classList.add('hidden-field')
                }
                if (!this.sendCardDataButton.classList.contains('hidden-field')) {
                    this.sendCardDataButton.classList.add('hidden-field')
                }
                break
            case 'previewCardTheory':
                if (!this.PreviewCardTheoryField.classList.contains('hidden-field')) {
                    this.PreviewCardTheoryField.classList.add('hidden-field')
                }
                break
            case 'previewCardTheoryImage':
                if (!this.PreviewCardTheoryImage.classList.contains('hidden-field')) {
                        this.PreviewCardTheoryImage.classList.add('hidden-field')
                    }
            case 'previewCardPractice':
                if (!this.PreviewCardPracticeField.classList.contains('hidden-field')) {
                    this.PreviewCardPracticeField.classList.add('hidden-field')
                }
                break
            case 'previewCardPracticeImage':
                if (!this.PreviewCardPracticeImage.classList.contains('hidden-field')) {
                        this.PreviewCardPracticeImage.classList.add('hidden-field')
                    }
            case 'previewCardPracticeTip':
                if (!this.PreviewCardPracticeTipField.classList.contains('hidden-field')) {
                    this.PreviewCardPracticeTipField.classList.add('hidden-field')
                }
                break
            case 'previewCardPracticeTipImage':
                if (!this.PreviewCardPracticeTipImage.classList.contains('hidden-field')) {
                        this.PreviewCardPracticeTipImage.classList.add('hidden-field')
                    }
                break
        }
    }

    prepareThemesSelect(examId) {
        this.currentExamId = examId

        this.loadThemes(examId)
        .then(() => {
            this.setThemesSelectOptions(this.themes, this.themesSelect)
            this.themesSelectField.classList.remove('hidden-field')
        })
    }

    loadThemes(examId) {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        return fetch(`/api/themes/exam/${examId}/options/`, {
        method: 'GET',
        headers: {
            'My-Tutor-Auth-Token': token
            },
        })
        .then(response => response.json())
        .then(themes => {
            this.themes = themes
        })
        .catch(error => {
            console.error(error)
        })
    }

    setThemesSelectOptions(themes, selectDiv) {
        selectDiv.innerHTML = ""

        const emptyOption = document.createElement('option')
        emptyOption.value = ""
        emptyOption.hidden = true
        emptyOption.disabled = true
        emptyOption.innerText = "Выберите тему"
        selectDiv.append(emptyOption)

        for (const theme of Object.values(themes)) {
            const option = document.createElement('option')
            option.value = theme.id
            option.innerText = `${theme.exam_task_number}. ${theme.title}`
            selectDiv.append(option)
        }
        selectDiv.options[0].selected = true
    }

    prepareActionSelect() {
        this.actionSelect.innerHTML = ""
        this.addActionOption("", "Выберите действие", true)
        this.addActionOption("1", "Добавить карточку")
        this.addActionOption("2", "Изменить карточку")
        this.addActionOption("3", "Удалить карточку")
    }

    addActionOption(value, text, isPrimary = false) {
        const option = document.createElement('option')
        option.value = value
        option.innerText = text

        if (isPrimary) {
            option.hidden = true
            option.disabled = true
            option.selected = true
        }

        this.actionSelect.append(option)
    }

    loadCards(themeId) {
        this.currentThemeId = themeId
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        return fetch(`/api/themes/${themeId}/cards/`, {
        method: 'GET',
        headers: {
            'My-Tutor-Auth-Token': token
            },
        })
        .then(response => response.json())
        .then(cards => {
            this.cards = cards
        })
        .catch(error => {
            console.error(error)
        })
    }

    prepareCardsSelect(themeId) {
        this.loadCards(themeId)
        .then(() => {
            this.setCardsSelectOptions(this.cards, this.deleteCardSelect)
            this.setCardsSelectOptions(this.cards, this.updateCardSelect)
            this.setCardPositionSelectOptions(Object.keys(this.cards).length, this.cardPositionSelect)
            this.actionSelectField.classList.remove('hidden-field')
            this.prepareActionSelect()
        })
    }

    setCardsSelectOptions(cards, selectDiv) {
        selectDiv.innerHTML = ""

        const emptyOption = document.createElement('option')
        emptyOption.value = ""
        emptyOption.hidden = true
        emptyOption.disabled = true
        emptyOption.innerText = "Выберите карточку"
        selectDiv.append(emptyOption)
        let cardPosition = 1
        for (const card of Object.values(cards)) {
            const option = document.createElement('option')
            option.value = card.card_id
            option.innerText = `${cardPosition++}. ${card.title}`
            selectDiv.append(option)
        }

        selectDiv.options[0].selected = true
    }

    setCardPositionSelectOptions(amountCards, selectDiv) {
        selectDiv.innerHTML = ""

        for (let cardPosition = 1; cardPosition <= amountCards; cardPosition++) {
            const option = document.createElement('option');
            option.value = cardPosition;
            option.innerText = cardPosition;
            selectDiv.appendChild(option);
        }

        selectDiv.options[selectDiv.options.length - 1].selected = true
    }

    chooseExam(examId) {
        this.flashMsg.innerText = ''
        this.hideField('chooseAction')
        this.hideField('createCard')
        this.hideField('updateCard')
        this.hideField('deleteCard')
        this.hideField('cardContent')
        this.prepareThemesSelect(examId)
    }

    chooseTheme(themeId, themeChanged = false) {
        this.hideField('createCard')
        this.hideField('updateCard')
        this.hideField('deleteCard')
        this.hideField('theoryCardInput')
        this.hideField('practiceCardInput')
        this.hideField('cardDataButtons')

        if (themeChanged == false) {
            this.flashMsg.innerText = ''
            this.hideField('cardContent')
        }

        this.prepareCardsSelect(themeId)
    }

    chooseAction(actionId) {
        this.hideField('cardContent')
        this.flashMsg.innerText = ''
        this.currentCardAnswer = null
        switch (actionId) {
            case '1':
                this.hideField('updateCard')
                this.hideField('deleteCard')
                this.hideField('theoryCardInput')
                this.hideField('practiceCardInput')
                this.hideField('cardDataButtons')
                this.createCardField.classList.remove('hidden-field')

                const lastOption = document.createElement('option')
                lastOption.value = this.cards.length + 1
                lastOption.innerText = 'В конец темы'
                this.cardPositionSelect.append(lastOption)
                lastOption.selected = true
                break
            case '2':
                this.hideField('createCard')
                this.hideField('deleteCard')
                this.hideField('theoryCardInput')
                this.hideField('practiceCardInput')
                this.hideField('cardDataButtons')
                this.hideField('cardContent')
                this.theoryImagePreview.classList.remove('hidden-field')
                this.practiceImagePreview.classList.remove('hidden-field')
                this.practiceTipImagePreview.classList.remove('hidden-field')
                this.updateCardSelectField.classList.remove('hidden-field')
                this.updateCardSelect.selectedIndex = 0

                this.PreviewCardTheoryImage.classList.remove('hidden-field')
                this.PreviewCardPracticeImage.classList.remove('hidden-field')
                this.PreviewCardPracticeTipImage.classList.remove('hidden-field')

                Array.from(this.cardPositionSelect.options).forEach((option) => {
                    if (option.text === 'В конец темы') {
                        option.remove();
                    }
                });
                break
            case '3':
                this.hideField('createCard')
                this.hideField('updateCard')
                this.hideField('theoryCardInput')
                this.hideField('practiceCardInput')
                this.hideField('cardDataButtons')
                this.hideField('cardContent')
                this.deleteCardSelectField.classList.remove('hidden-field')
                this.deleteCardSelect.selectedIndex = 0

                this.PreviewCardTheoryImage.classList.remove('hidden-field')
                this.PreviewCardPracticeImage.classList.remove('hidden-field')
                this.PreviewCardPracticeTipImage.classList.remove('hidden-field')

                Array.from(this.cardPositionSelect.options).forEach((option) => {
                    if (option.text === 'В конец темы') {
                        option.remove();
                    }
                });
                break
        }
    }

    chooseCreateCard(cardType) {
        this.clearInputFields(cardType)
        this.clearPreviewCard(cardType)
        this.showInputFields(cardType)
        this.showPreviewCard(cardType)
        this.flashMsg.innerText = ''
    }

    clearInputFields(cardType) {
        if (cardType == 'theory') {
            this.theoryTitle.value = ''
            this.theoryDescr.value = ''
            this.hideField('theoryCardInputImage')
            this.theoryImage.value = ''
            this.hideField('previewCardTheoryImage')

            this.sendCardDataButton.onclick = () => {
                this.createTheoryCard()
            }
        } else {
            this.practiceTitle.value = ''
            this.practiceDescr.value = ''
            this.hideField('practiceCardInputImage')
            this.practiceImage.value = ''
            this.practiceAnswer.value = ''

            this.practiceTipButton.classList.remove('hidden-field')
            this.practiceTipButton.innerHTML = 'Добавить решение'
            this.practiceTipDescr.value = ''
            this.hideField('practiceCardTipInputImage')
            this.practiceTipImage.value = ''
            this.hideField('previewCardPracticeImage')
            this.hideField('previewCardPracticeTipImage')

            this.sendCardDataButton.onclick = () => {
                this.createPracticeCard()
            }
        }
        this.sendCardDataButton.innerHTML = "Создать карточку"
    }

    clearPreviewCard(cardType) {
        this.PreviewCardTitle.innerText = ''
        if (cardType == 'theory') {
            this.PreviewCardTheoryDescr.innerText = ''
            this.hideField('previewCardTheoryImage')
        } else {
            this.PreviewCardPracticeDescr.innerText = ''
            this.hideField('previewCardPracticeImage')
            this.PreviewCardPracticeAnswerField.value = ''
            this.PreviewCardPracticeTipDescr.innerText = ''
            this.hideField('previewCardPracticeTipImage')
        }
    }

    showPreviewCard(cardType) {
        this.cardAction.innerText = 'Предпросмотр создаваемой карточки'
        this.PreviewCardTitle.innerText = ''
        this.cardContent.classList.remove('hidden-field')

        if (cardType == 'theory') {
            this.hideField('previewCardPractice')
            this.PreviewCardTheoryField.classList.remove('hidden-field')
        } else {
            this.hideField('previewCardTheory')
            this.PreviewCardPracticeAnswerField.classList.remove('input-answer-success')
            this.PreviewCardPracticeAnswerField.classList.remove('input-answer-wrong')
            this.PreviewCardPracticeAnswerButton.innerText = 'Проверить'
            this.PreviewCardPracticeAnswerButton.onclick = () => {
                this.checkAnswer()
            }
            this.PreviewCardPracticeTipButton.onclick = () => {
                this.switchTip()
            }
            this.PreviewCardPracticeField.classList.remove('hidden-field')
        }
    }

    chooseUpdateCard(cardId) {
        this.currentCardId = cardId
        let cardPosition = this.cards.findIndex(card => card.card_id == cardId) + 1;
        this.currentCard = this.cards[cardPosition - 1]
        this.currentCardAnswer = this.currentCard['answer']
        this.cardPositionSelect.value = cardPosition;
        this.currentCardPosition = cardPosition
        this.practiceTipButton.classList.remove('hidden-field')
        this.practiceTipButton.innerHTML = 'Изменить решение'
        this.cardAction.innerText = 'Предпросмотр изменяемой карточки'
        this.fillCardContent(this.currentCard)
        this.fillInputFields(this.currentCard)
        this.showInputFields(this.currentCard.type)

        this.flashMsg.innerText = ''
        this.cardContent.classList.remove('hidden-field')
    }

    chooseDeleteCard(cardId) {
        this.currentCardId = cardId
        let cardPosition = this.cards.findIndex(card => card.card_id == cardId) + 1;
        this.currentCard = this.cards[cardPosition - 1]
        this.currentCardAnswer = this.currentCard['answer']
        this.cardPositionSelect.value = cardPosition;
        this.currentCardPosition = cardPosition
        this.cardAction.innerText = 'Предпросмотр удаляемой карточки'
        this.fillCardContent(this.currentCard)

        this.flashMsg.innerText = ''
        this.cardContent.classList.remove('hidden-field')
    }

    fillCardContent(card) {
        this.PreviewCardPracticeTipButton.innerText = 'Показать решение'
        this.hideField('previewCardPracticeTip')
        if (card.type === 'theory') {
            this.hideField('previewCardPractice')
            this.PreviewCardTitle.innerText = card.title
            this.PreviewCardTheoryImage.src = card.image_path
            this.PreviewCardTheoryDescr.innerText = card.descr
            this.PreviewCardTheoryField.classList.remove('hidden-field')
        } else {
            this.hideField('previewCardTheory')
            this.PreviewCardTitle.innerText = card.title
            this.PreviewCardPracticeImage.src = card.image_path
            this.PreviewCardPracticeDescr.innerText = card.descr
            this.PreviewCardPracticeAnswerField.classList.remove('input-answer-success')
            this.PreviewCardPracticeAnswerField.classList.remove('input-answer-wrong')
            this.PreviewCardPracticeAnswerButton.innerText = 'Проверить'
            this.currentPracticeCardAnswer = card.answer
            this.PreviewCardPracticeAnswerButton.onclick = () => {
                this.checkAnswer()
            }

            if (card.tip != null) {
                this.PreviewCardPracticeTipButton.onclick = () => {
                    this.switchTip(card.tip)
                }
            }

            this.PreviewCardPracticeAnswerField.value = ''
            this.PreviewCardPracticeField.classList.remove('hidden-field')
        }
    }

    switchTip() {
        let displayStyle = window.getComputedStyle(this.practiceTipField).display;

        if (!this.PreviewCardPracticeTipField.classList.contains('hidden-field')) {
            this.PreviewCardPracticeTipButton.innerText = 'Показать решение'
            this.PreviewCardPracticeTipField.classList.add('hidden-field')
        } else {
            this.PreviewCardPracticeTipButton.innerText = 'Скрыть решение'
            this.PreviewCardPracticeTipField.classList.remove('hidden-field')
        }
    }

    checkAnswer() {
        console.log(this.currentCardAnswer)

        if (this.PreviewCardPracticeAnswerField.value != this.currentCardAnswer) {
            this.PreviewCardPracticeAnswerField.classList.remove('input-answer-success')
            if (!this.PreviewCardPracticeAnswerField.classList.contains('input-answer-wrong')) {
                this.PreviewCardPracticeAnswerField.classList.add('input-answer-wrong')
            }
            this.PreviewCardPracticeAnswerButton.innerText = 'Ответ неверный'
        } else {
            this.PreviewCardPracticeAnswerField.classList.remove('input-answer-wrong')
            if (!this.PreviewCardPracticeAnswerField.classList.contains('input-answer-success')) {
                this.PreviewCardPracticeAnswerField.classList.add('input-answer-success')
            }
            this.PreviewCardPracticeAnswerButton.innerText = 'Ответ верный'
        }
    }

    fillInputFields(card) {
        if (card.type == 'theory') {
            this.theoryTitle.value = card.title
            this.theoryDescr.value = card.descr
            this.theoryImagePreview.src = card.image_path
            this.theoryImage.value = ''
            this.sendCardDataButton.onclick = () => {
                this.updateTheoryCard()
            }
        } else {
            this.practiceTitle.value = card.title
            this.practiceDescr.value = card.descr
            this.practiceImagePreview.src = card.image_path
            this.practiceImage.value = ''
            this.practiceAnswer.value = card.answer

            if (card.tip) {
                this.practiceTipDescr.value = card.tip.descr
                this.practiceTipImagePreview.src = card.tip.image_path
                this.practiceTipImage.value = ''
            }

            this.sendCardDataButton.onclick = () => {
                this.updatePracticeCard()
            }
        }
        this.sendCardDataButton.innerHTML = "Применить изменения"
    }

    showInputFields(cardType) {
        if (cardType == 'theory') {
            this.hideField('practiceCardTipInput')
            this.hideField('practiceCardInput')
            this.theoryField.classList.remove('hidden-field')
        } else {
            this.hideField('theoryCardInput')
            this.hideField('practiceCardTipInput')
            this.practiceField.classList.remove('hidden-field')
        }
        this.cardPositionSelectField.classList.remove('hidden-field')
        this.sendCardDataButton.classList.remove('hidden-field')
    }

    showTipField() {
        this.practiceTipField.classList.remove('hidden-field')
        this.hideField('showTipButton')
    }

    uploadImage(image, path) {
        const imgData = new FormData()
        imgData.append('image_data', image)

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        return fetch('/api/themes/image/upload/', {
            method: 'POST',
            headers: {
                'My-Tutor-Auth-Token': token,
                'Path': path
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
        .then(imageResponse => {
            if (imageResponse.hasOwnProperty('image_path')) {
                return imageResponse['image_path']
            } else {
                return false
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    async updateTheoryCard() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        const validateTitle = this.validateField('theoryTitle')

        if (validateTitle) {
            flashMsg(validateTitle, this.flashMsg, 'wrong')
            return
        }

        const validateDescr = this.validateField('theoryDescr')

        if (validateDescr) {
            flashMsg(validateDescr, this.flashMsg, 'wrong')
            return
        }

        let imagePath = this.currentCard.image_path

        if (this.theoryImage.files.length > 0) {
            const path = `${this.exams[this.currentExamId]}/${this.themes[this.currentThemeId].exam_task_number}/`
            imagePath = await this.uploadImage(this.theoryImage.files[0], path)

            if (!imagePath) {
                flashMsg('Не удалось загрузить изображение на сервер. Попробуй еще раз, либо внесите изменения в карточку, не изменяя изображение', this.flashMsg, 'wrong')
                return
            }
        }

        const updateTheoryCardData = {
            themeId: this.currentThemeId,
            cardId: this.currentCardId,
            currentPosition: this.currentCardPosition,
            newPosition: this.cardPositionSelect.value,
            title: this.theoryTitle.value,
            descr: this.theoryDescr.value,
            imagePath: imagePath
        }
        console.log(updateTheoryCardData)
        fetch(`/api/themes/${this.currentThemeId}/cards/`, {
            method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'My-Tutor-Auth-Token': token
                },
                body: JSON.stringify(updateTheoryCardData),
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
            flashMsg(response.message, this.flashMsg, 'success')
            this.cardAction.innerText = 'Измененная карточка'
            this.chooseTheme(this.currentThemeId, true)
        })
        .catch(error => {
            console.log(error)
        })
    }

    async updatePracticeCard() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        const validateTitle = this.validateField('practiceTitle')

        if (validateTitle) {
            flashMsg(validateTitle, this.flashMsg, 'wrong')
            return
        }

        const validateDescr = this.validateField('practiceDescr')

        if (validateDescr) {
            flashMsg(validateDescr, this.flashMsg, 'wrong')
            return
        }

        const validateAnswer = this.validateField('practiceAnswer')

        if (validateAnswer) {
            flashMsg(validateAnswer, this.flashMsg, 'wrong')
            return
        }

        let imagePath = this.currentCard.image_path
        let tipFilled = false
        let tipDescr = null
        let tipImagePath = this.currentCard.tip && this.currentCard.tip.image_path ? this.currentCard.tip.image_path : null;

        if (this.practiceImage.files.length > 0) {
            const path = `${this.exams[this.currentExamId]}/${this.themes[this.currentThemeId].exam_task_number}/`
            imagePath = await this.uploadImage(this.practiceImage.files[0], path)

            if (!imagePath) {
                flashMsg('Не удалось загрузить изображение карточки на сервер. Попробуй еще раз, либо внесите изменения в карточку, не изменяя изображение', this.flashMsg, 'wrong')
                return
            }
        }

        if (this.practiceTipImage.files.length > 0) {
            const path = `${this.exams[this.currentExamId]}/${this.themes[this.currentThemeId].exam_task_number}/`
            tipImagePath = await this.uploadImage(this.practiceTipImage.files[0], path)

            if (!tipImagePath) {
                flashMsg('Не удалось загрузить изображение решения на сервер. Попробуй еще раз, либо внесите изменения в карточку, не изменяя изображение', this.flashMsg, 'wrong')
                return
            }
        }

        if (!this.practiceTipDescr.value == "") {
            tipDescr = this.practiceTipDescr.value
        }

        if (!(tipDescr == null && tipImagePath == null)) {
            tipFilled = true
        }

        const updatePracticeCardData = {
            themeId: this.currentThemeId,
            cardId: this.currentCardId,
            currentPosition: this.currentCardPosition,
            newPosition: this.cardPositionSelect.value,
            title: this.practiceTitle.value,
            descr: this.practiceDescr.value,
            imagePath: imagePath,
            answer: this.practiceAnswer.value,
            tip: tipFilled,
            ...(tipDescr && { tipDescr: tipDescr }),
            ...(tipImagePath && { tipImagePath: tipImagePath })
        }

        fetch(`/api/themes/${this.currentThemeId}/cards/`, {
            method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'My-Tutor-Auth-Token': token
                },
                body: JSON.stringify(updatePracticeCardData),
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
            flashMsg(response.message, this.flashMsg, 'success')
            this.cardAction.innerText = 'Измененная карточка'
            this.chooseTheme(this.currentThemeId, true)
        })
        .catch(error => {
            console.log(error)
        })
    }

    deleteCard() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        const deleteCardData = {
            themeId: this.currentThemeId,
            cardId: this.currentCardId,
            cardPosition: this.currentCardPosition
        }

        fetch(`/api/themes/${this.currentThemeId}/cards/`, {
            method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                'My-Tutor-Auth-Token': token
                },
                body: JSON.stringify(deleteCardData),
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
            flashMsg(response.message, this.flashMsg, 'success')
            this.cardAction.innerText = 'Удаленная карточка'
            this.chooseTheme(this.currentThemeId, true)
        })
        .catch(error => {
            console.log(error)
        })
    }

    validateField(field) {
        switch (field) {
            case 'theoryTitle':
                if (this.theoryTitle.value == '') {
                    return 'Необходимо заполнить поле с названием карточки'
                }
                break
            case 'theoryDescr':
                if (this.theoryDescr.value == '') {
                    return 'Необходимо заполнить поле с содержимым карточки'
                }
                break
            case 'practiceTitle':
                if (this.practiceTitle.value == '') {
                    return 'Необходимо заполнить поле с названием карточки'
                }
                break
            case 'practiceDescr':
                if (this.practiceDescr.value == '') {
                    return 'Необходимо заполнить поле с содержимым карточки'
                }
                break
            case 'practiceAnswer':
                if (this.practiceAnswer.value == '') {
                    return 'Необходимо заполнить поле с ответом на задачу'
                }
                break
        }
        return null
    }

    async createTheoryCard() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        const validateTitle = this.validateField('theoryTitle')

        if (validateTitle) {
            flashMsg(validateTitle, this.flashMsg, 'wrong')
            return
        }

        const validateDescr = this.validateField('theoryDescr')

        if (validateDescr) {
            flashMsg(validateDescr, this.flashMsg, 'wrong')
            return
        }

        let imagePath = null

        if (this.theoryImage.files.length > 0) {
            const path = `${this.exams[this.currentExamId]}/${this.themes[this.currentThemeId].exam_task_number}/`
            imagePath = await this.uploadImage(this.theoryImage.files[0], path)

            if (!imagePath) {
                flashMsg('Не удалось загрузить изображение на сервер. Попробуй еще раз, либо внесите изменения в карточку, не изменяя изображение', this.flashMsg, 'wrong')
                return
            }
        }

        const createTheoryCardData = {
            themeId: this.currentThemeId,
            title: this.theoryTitle.value,
            descr: this.theoryDescr.value,
            ...(imagePath && { imagePath: imagePath }),
            cardPosition: this.cardPositionSelect.value
        }

        console.log(createTheoryCardData)

        fetch(`/api/themes/${this.currentThemeId}/cards/`, {
            method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'My-Tutor-Auth-Token': token
                },
                body: JSON.stringify(createTheoryCardData),
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
            flashMsg(response.message, this.flashMsg, 'success')
            this.hideField('theoryCardInput')
            this.hideField('cardDataButtons')
            this.cardAction.innerText = 'Созданная карточка'
        })
        .catch(error => {
            console.log(error)
        })
    }

    async createPracticeCard() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        const validateTitle = this.validateField('practiceTitle')

        if (validateTitle) {
            flashMsg(validateTitle, this.flashMsg, 'wrong')
            return
        }

        const validateDescr = this.validateField('practiceDescr')

        if (validateDescr) {
            flashMsg(validateDescr, this.flashMsg, 'wrong')
            return
        }

        const validateAnswer = this.validateField('practiceAnswer')

        if (validateAnswer) {
            flashMsg(validateAnswer, this.flashMsg, 'wrong')
            return
        }

        let imagePath = null
        let tipFilled = false
        let tipDescr = null
        let tipImagePath = null;

        if (this.practiceImage.files.length > 0) {
            const path = `${this.exams[this.currentExamId]}/${this.themes[this.currentThemeId].exam_task_number}/`
            imagePath = await this.uploadImage(this.practiceImage.files[0], path)

            if (!imagePath) {
                flashMsg('Не удалось загрузить изображение на сервер. Попробуй еще раз, либо внесите изменения в карточку, не изменяя изображение', this.flashMsg, 'wrong')
                return
            }
        }

        if (this.practiceTipImage.files.length > 0) {
            const path = `${this.exams[this.currentExamId]}/${this.themes[this.currentThemeId].exam_task_number}/`
            tipImagePath = await this.uploadImage(this.practiceTipImage.files[0], path)

            if (!tipImagePath) {
                flashMsg('Не удалось загрузить изображение решения на сервер. Попробуй еще раз, либо внесите изменения в карточку, не изменяя изображение', this.flashMsg, 'wrong')
                return
            }
        }

        if (!this.practiceTipDescr.value == "") {
            tipDescr = this.practiceTipDescr.value
        }

        if (!(tipDescr == null && tipImagePath == null)) {
            tipFilled = true
        }

        const createPracticeCardData = {
            themeId: this.currentThemeId,
            title: this.practiceTitle.value,
            descr: this.practiceDescr.value,
            ...(imagePath && { imagePath: imagePath }),
            answer: this.practiceAnswer.value,
            tip: tipFilled,
            ...(tipDescr && { tipDescr: tipDescr }),
            ...(tipImagePath && { tipImagePath: tipImagePath }),
            cardPosition: this.cardPositionSelect.value
        }

        console.log(createPracticeCardData)
        return
        fetch(`/api/themes/${this.currentThemeId}/cards/`, {
            method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'My-Tutor-Auth-Token': token
                },
                body: JSON.stringify(createPracticeCardData),
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
            flashMsg(response.message, this.flashMsg, 'success')
            this.hideField('theoryCardInput')
            this.hideField('cardDataButtons')
            this.cardAction.innerText = 'Созданная карточка'
        })
        .catch(error => {
            console.log(error)
        })
    }

    setImageEventListener(inputElement, previewElement, previewCardImageField, imageType) {
        const self = this

        inputElement.addEventListener('change', function(event) {
            const fileInput = event.target

            if (fileInput.files.length > 0) {
                const selectedFile = fileInput.files[0]
                const reader = new FileReader()

                reader.onload = function(e) {
                    previewElement.src = e.target.result
                    previewElement.classList.remove('hidden-field')
                    previewCardImageField.classList.remove('hidden-field')
                    previewCardImageField.src = e.target.result
                }

                reader.readAsDataURL(selectedFile)
            } else {
                switch (imageType) {
                    case 'main':
                        if (!self.currentCardId == null) {
                            previewElement.src = self.cards[self.currentCardId]['image_path']
                            previewCardImageField.src = self.cards[self.currentCardId]['image_path']
                        } else {
                            self.hideField('theoryCardInputImage')
                            self.hideField('previewCardTheoryImage')
                            self.hideField('practiceCardInputImage')
                            self.hideField('previewCardPracticeImage')
                        }
                        break
                    case 'tip':
                        if (!self.currentCardId == null) {
                            previewElement.src = self.cards[self.currentCardId]['tip']['image_path']
                        previewCardImageField.src = self.cards[self.currentCardId]['tip']['image_path']
                        } else {
                            self.hideField('practiceCardTipInputImage')
                            self.hideField('previewCardPracticeTipImage')
                        }
                        break
                }
            }
        })
    }

    setInputTextEventListener(inputElement, previewElement) {
        inputElement.addEventListener('input', () => {
            previewElement.innerText = event.target.value;
        })
    }

    setCardAnswerEventListener() {
        const self = this

        this.practiceAnswer.addEventListener('input', () => {
            self.currentCardAnswer = event.target.value
            self.PreviewCardPracticeAnswerField.value = ''
            self.PreviewCardPracticeAnswerField.classList.remove('input-answer-success')
            self.PreviewCardPracticeAnswerField.classList.remove('input-answer-wrong')
            self.PreviewCardPracticeAnswerButton.innerText = 'Проверить'
        })
    }
}


document.addEventListener('DOMContentLoaded', function (event) {
    const controller = new Controller()
    const chooseExam = document.getElementById('theme-card-profile')
    const chooseTheme = document.getElementById('theme-card-theme')
    const chooseAction = document.getElementById('theme-card-action')
    const chooseUpdateCard = document.getElementById('theme-card-update')
    const chooseDeleteCard = document.getElementById('theme-card-delete')

    const createCardField = document.getElementById('create-content')
    const updateCardField = document.getElementById('update-content')
    const deleteCardField = document.getElementById('delete-content')

    controller.createTheoryCardButton.onclick = () => {
        controller.chooseCreateCard('theory')
    }
    controller.createPracticeCardButton.onclick = () => {
        controller.chooseCreateCard('practice')
    }

    controller.practiceTipButton.onclick = () => {
        controller.showTipField()
    }
    controller.deleteCardButton.onclick = () => {
        controller.deleteCard()
    }

    chooseExam.addEventListener('change', function() {
        controller.chooseExam(this.value)
    })
    chooseTheme.addEventListener('change', function() {
        controller.chooseTheme(this.value)
    })
    chooseAction.addEventListener('change', function() {
        controller.chooseAction(this.value)
    })

    chooseUpdateCard.addEventListener('change', function() {
        controller.chooseUpdateCard(this.value)
    })
    chooseDeleteCard.addEventListener('change', function() {
        controller.chooseDeleteCard(this.value)
    })

    controller.PreviewCardPracticeAnswerField.addEventListener('input', () => {
        controller.PreviewCardPracticeAnswerField.classList.remove('input-answer-success')
        controller.PreviewCardPracticeAnswerField.classList.remove('input-answer-wrong')
        controller.PreviewCardPracticeAnswerButton.innerText = 'Проверить'
    })

    controller.PreviewCardPracticeAnswerField.addEventListener('input', () => {
        controller.PreviewCardPracticeAnswerField.classList.remove('input-answer-success')
        controller.PreviewCardPracticeAnswerField.classList.remove('input-answer-wrong')
        controller.PreviewCardPracticeAnswerButton.innerText = 'Проверить'
    })

    controller.setImageEventListener(controller.theoryImage, controller.theoryImagePreview, controller.PreviewCardTheoryImage, 'main')
    controller.setImageEventListener(controller.practiceImage, controller.practiceImagePreview, controller.PreviewCardPracticeImage, 'main')
    controller.setImageEventListener(controller.practiceTipImage, controller.practiceTipImagePreview, controller.PreviewCardPracticeTipImage, 'tip')

    controller.setInputTextEventListener(controller.theoryTitle, controller.PreviewCardTitle)
    controller.setInputTextEventListener(controller.theoryDescr, controller.PreviewCardTheoryDescr)

    controller.setInputTextEventListener(controller.practiceTitle, controller.PreviewCardTitle)
    controller.setInputTextEventListener(controller.practiceDescr, controller.PreviewCardPracticeDescr)
    controller.setInputTextEventListener(controller.practiceTipDescr, controller.PreviewCardPracticeTipDescr)

    controller.setCardAnswerEventListener()
})
