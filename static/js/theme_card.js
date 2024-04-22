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
        this.currentCardFilePath = null
        this.currentCardImagePath = null
        this.currentCardTipImagePath = null
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
        this.PreviewCardPracticeFileField = document.getElementById('practice-download-file-field')
        this.PreviewCardPracticeFileDownloadButton = document.getElementById('practice-download-file-button')
        this.PreviewCardPracticeFileDownload = document.getElementById('practice-download-file')
        this.PreviewCardPracticeFileName = document.getElementById('practice-download-file-name')
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

        this.theoryImageButtonAddField = document.getElementById('card-theory-image-button-add-field')
        this.theoryImageButtonAdd = document.getElementById('card-theory-image-button-add')
        this.theoryImageButtonDeleteField = document.getElementById('card-theory-image-button-delete-field')
        this.theoryImageButtonDelete = document.getElementById('card-theory-image-button-delete')
        this.theoryImageField = document.getElementById('card-theory-image-field')

        this.theoryImagePreview = document.getElementById('card-theory-image-preview')
        this.theoryImage = document.getElementById('card-theory-image')

        this.practiceField = document.getElementById('card-practice-field')
        this.practiceTitle = document.getElementById('card-practice-title')
        this.practiceDescr = document.getElementById('card-practice-descr')
        this.practiceAnswer = document.getElementById('card-practice-answer')

        this.practiceFileButtonAddField = document.getElementById('card-practice-file-button-add-field')
        this.practiceFileButtonAdd = document.getElementById('card-practice-file-button-add')
        this.practiceFileButtonDeleteField = document.getElementById('card-practice-file-button-delete-field')
        this.practiceFileButtonDelete = document.getElementById('card-practice-file-button-delete')
        this.practiceFileField = document.getElementById('card-practice-file-field')

        this.practiceFileDownloadButton = document.getElementById('card-practice-file-button')
        this.practiceFileDownload = document.getElementById('card-practice-file-download')
        this.practiceFileNameLink = document.getElementById('card-practice-download-file-name')
        this.practiceFileName = document.getElementById('card-practice-file-name')
        this.practiceFile = document.getElementById('card-practice-file')

        this.practiceImageButtonAddField = document.getElementById('card-practice-image-button-add-field')
        this.practiceImageButtonAdd = document.getElementById('card-practice-image-button-add')
        this.practiceImageButtonDeleteField = document.getElementById('card-practice-image-button-delete-field')
        this.practiceImageButtonDelete = document.getElementById('card-practice-image-button-delete')
        this.practiceImageField = document.getElementById('card-practice-image-field')

        this.practiceImagePreview = document.getElementById('card-practice-image-preview')
        this.practiceImage = document.getElementById('card-practice-image')

        this.practiceTipField = document.getElementById('card-practice-tip-field')
        this.practiceTipButtonAddField = document.getElementById('card-practice-tip-button-add-field')
        this.practiceTipButtonAdd = document.getElementById('card-practice-tip-button-add')
        this.practiceTipButtonDeleteField = document.getElementById('card-practice-tip-button-delete-field')
        this.practiceTipButtonDelete = document.getElementById('card-practice-tip-button-delete')
        this.practiceTipDescr = document.getElementById('card-practice-tip-descr')

        this.practiceTipImageButtonAddField = document.getElementById('card-practice-tip-image-button-add-field')
        this.practiceTipImageButtonAdd = document.getElementById('card-practice-tip-image-button-add')
        this.practiceTipImageButtonDeleteField = document.getElementById('card-practice-tip-image-button-delete-field')
        this.practiceTipImageButtonDelete = document.getElementById('card-practice-tip-image-button-delete')
        this.practiceTipImageField = document.getElementById('card-practice-tip-image-field')

        this.practiceTipImagePreview = document.getElementById('card-practice-tip-image-preview')
        this.practiceTipImage = document.getElementById('card-practice-tip-image')

        //общие кнопки для редактирования и создания карточек
        this.cardPositionSelectField = document.getElementById('card-position-field')
        this.cardPositionSelect = document.getElementById('card-position')
        this.sendCardDataButtonField = document.getElementById('send-card-data-to-server-button-field')
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
            case 'practiceCardInput':
                if (!this.practiceField.classList.contains('hidden-field')) {
                    this.practiceField.classList.add('hidden-field')
                }
                break
            // Кнопки изображения теории
            case 'theoryCardImageButtonAddField':
                if (!this.theoryImageButtonAddField.classList.contains('hidden-field')) {
                    this.theoryImageButtonAddField.classList.add('hidden-field')
                }
                break
            case 'theoryCardImageButtonDeleteField':
                if (!this.theoryImageButtonDeleteField.classList.contains('hidden-field')) {
                    this.theoryImageButtonDeleteField.classList.add('hidden-field')
                }
                break
            case 'theoryCardImageField':
                if (!this.theoryImageField.classList.contains('hidden-field')) {
                    this.theoryImageField.classList.add('hidden-field')
                }
                break
            case 'theoryCardInputImage':
                if (!this.theoryImagePreview.classList.contains('hidden-field')) {
                    this.theoryImagePreview.classList.add('hidden-field')
                }
                break
            // Кнопки изображения практики
            case 'practiceCardImageButtonAddField':
                if (!this.practiceImageButtonAddField.classList.contains('hidden-field')) {
                    this.practiceImageButtonAddField.classList.add('hidden-field')
                }
                break
            case 'practiceCardImageButtonDeleteField':
                if (!this.practiceImageButtonDeleteField.classList.contains('hidden-field')) {
                    this.practiceImageButtonDeleteField.classList.add('hidden-field')
                }
                break
            case 'practiceCardImageField':
                if (!this.practiceImageField.classList.contains('hidden-field')) {
                    this.practiceImageField.classList.add('hidden-field')
                }
                break
            case 'practiceCardInputImage':
                if (!this.practiceImagePreview.classList.contains('hidden-field')) {
                    this.practiceImagePreview.classList.add('hidden-field')
                }
                break
            // Кнопки загружаемого файла
            case 'practiceCardFileButtonAddField':
                if (!this.practiceFileButtonAddField.classList.contains('hidden-field')) {
                    this.practiceFileButtonAddField.classList.add('hidden-field')
                }
                break
            case 'practiceCardFileButtonDeleteField':
                if (!this.practiceFileButtonDeleteField.classList.contains('hidden-field')) {
                    this.practiceFileButtonDeleteField.classList.add('hidden-field')
                }
                break
            case 'practiceCardFileField':
                if (!this.practiceFileField.classList.contains('hidden-field')) {
                    this.practiceFileField.classList.add('hidden-field')
                }
                break
            // Кнопки изображения решения
            case 'practiceCardTipImageButtonAddField':
                if (!this.practiceTipImageButtonAddField.classList.contains('hidden-field')) {
                    this.practiceTipImageButtonAddField.classList.add('hidden-field')
                }
                break
            case 'practiceCardTipImageButtonDeleteField':
                if (!this.practiceTipImageButtonDeleteField.classList.contains('hidden-field')) {
                    this.practiceTipImageButtonDeleteField.classList.add('hidden-field')
                }
                break
            case 'practiceCardTipImageField':
                if (!this.practiceTipImageField.classList.contains('hidden-field')) {
                    this.practiceTipImageField.classList.add('hidden-field')
                }
                break
            case 'practiceCardInputTipImage':
                if (!this.practiceTipImagePreview.classList.contains('hidden-field')) {
                    this.practiceTipImagePreview.classList.add('hidden-field')
                }
                break
            // Кнопки решения
            case 'practiceCardTipButtonAddField':
                if (!this.practiceTipButtonAddField.classList.contains('hidden-field')) {
                    this.practiceTipButtonAddField.classList.add('hidden-field')
                }
                break
            case 'practiceCardTipButtonDeleteField':
                console.log('4')
                if (!this.practiceTipButtonDeleteField.classList.contains('hidden-field')) {
                    this.practiceTipButtonDeleteField.classList.add('hidden-field')
                }
                break
            case 'practiceCardTipInput':
                if (!this.practiceTipField.classList.contains('hidden-field')) {
                    this.practiceTipField.classList.add('hidden-field')
                }
                break
            // Общие кнопки + поля предпросмотра карточки
            case 'cardDataButtons':
                if (!this.cardPositionSelectField.classList.contains('hidden-field')) {
                    this.cardPositionSelectField.classList.add('hidden-field')
                }
                if (!this.sendCardDataButtonField.classList.contains('hidden-field')) {
                    this.sendCardDataButtonField.classList.add('hidden-field')
                }
                break
            case 'previewCardTheory':
                if (!this.PreviewCardTheoryField.classList.contains('hidden-field')) {
                    this.PreviewCardTheoryField.classList.add('hidden-field')
                }
                break
            case 'previewCardPractice':
                if (!this.PreviewCardPracticeField.classList.contains('hidden-field')) {
                    this.PreviewCardPracticeField.classList.add('hidden-field')
                }
                break
            case 'previewCardPracticeFile':
                if (!this.PreviewCardPracticeFileField.classList.contains('hidden-field')) {
                    this.PreviewCardPracticeFileField.classList.add('hidden-field')
                }
                break
            case 'previewCardPracticeTip':
                if (!this.PreviewCardPracticeTipField.classList.contains('hidden-field')) {
                    this.PreviewCardPracticeTipField.classList.add('hidden-field')
                }
                break
            // Изображения в предпросмотре
            case 'previewCardTheoryImage':
                if (!this.PreviewCardTheoryImage.classList.contains('hidden-field')) {
                        this.PreviewCardTheoryImage.classList.add('hidden-field')
                    }
            case 'previewCardPracticeImage':
                if (!this.PreviewCardPracticeImage.classList.contains('hidden-field')) {
                        this.PreviewCardPracticeImage.classList.add('hidden-field')
                    }
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
        this.hideField('theoryCardInput')
        this.hideField('practiceCardInput')
        this.hideField('cardDataButtons')
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
                lastOption.value = 0
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
        this.currentCardFilePath = null
        this.currentCardImagePath = null
        this.currentCardTipImagePath = null

        this.clearInputFields(cardType)
        this.clearPreviewCard(cardType)
        this.showInputFields(cardType, 'create')
        this.showPreviewCard(cardType)
        this.flashMsg.innerText = ''
    }

    clearInputFields(cardType) {

        if (cardType == 'theory') {
            this.theoryTitle.value = ''
            this.theoryDescr.value = ''
            this.sendCardDataButton.onclick = () => {
                this.createTheoryCard()
            }
        } else {
            this.practiceTitle.value = ''
            this.practiceDescr.value = ''
            this.practiceAnswer.value = ''
            this.practiceTipDescr.value = ''
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
        } else {
            this.PreviewCardPracticeDescr.innerText = ''
            this.PreviewCardPracticeAnswerField.value = ''
            this.PreviewCardPracticeTipDescr.innerText = ''
        }
    }

    showPreviewCard(cardType) {
        this.cardAction.innerText = 'Предпросмотр создаваемой карточки'
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
        this.currentCardFilePath = this.currentCard['file_path'] ? this.currentCard['file_path'] : null;
        this.currentCardImagePath = this.currentCard['image_path']
        this.currentCardTipImagePath = this.currentCard['tip'] ? this.currentCard['tip']['image_path'] : null;

        this.cardPositionSelect.value = cardPosition;
        this.currentCardPosition = cardPosition
        this.cardAction.innerText = 'Предпросмотр изменяемой карточки'
        this.fillCardContent(this.currentCard)
        this.fillInputFields(this.currentCard)
        this.showInputFields(this.currentCard.type, 'update')

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

            if (card.file_name && card.file_path) {
                this.PreviewCardPracticeFileField.classList.remove('hidden-field')
                this.PreviewCardPracticeFileName.innerText = card.file_name
                this.PreviewCardPracticeFileDownload.href = card.file_path
                this.PreviewCardPracticeFileDownload.download = card.file_name

                if (!this.PreviewCardPracticeFileDownloadButton.classList.contains('file-download-enable')) {
                    this.PreviewCardPracticeFileDownloadButton.classList.add('file-download-enable')
                }
                this.PreviewCardPracticeFileDownloadButton.classList.remove('file-download-disable')
            } else {
                this.PreviewCardPracticeFileName.innerText =''
                this.PreviewCardPracticeFileDownload.removeAttribute('href')
                this.PreviewCardPracticeFileDownload.removeAttribute('download')
                this.hideField('previewCardPracticeFile')
                if (!this.PreviewCardPracticeFileDownloadButton.classList.contains('file-download-disable')) {
                    this.PreviewCardPracticeFileDownloadButton.classList.add('file-download-disable')
                }
                this.PreviewCardPracticeFileDownloadButton.classList.remove('file-download-enable')
            }

            this.PreviewCardPracticeAnswerField.classList.remove('input-answer-success')
            this.PreviewCardPracticeAnswerField.classList.remove('input-answer-wrong')
            this.PreviewCardPracticeAnswerButton.innerText = 'Проверить'
            this.currentPracticeCardAnswer = card.answer
            this.PreviewCardPracticeAnswerButton.onclick = () => {
                this.checkAnswer()
            }

            this.PreviewCardPracticeTipButton.onclick = () => {
                this.switchTip()
            }

            this.PreviewCardPracticeTipDescr.innerText = card.tip.descr
            this.PreviewCardPracticeTipImage.src = card.tip.image_path

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
            this.sendCardDataButton.onclick = () => {
                this.updateTheoryCard()
            }
        } else {
            this.practiceTitle.value = card.title
            this.practiceDescr.value = card.descr
            this.practiceImagePreview.src = card.image_path
            this.practiceImage.value = ''
            this.practiceAnswer.value = card.answer

            if (card.file_name && card.file_path) {
                this.practiceFileName.value = card.file_name
                this.practiceFileNameLink.innerText = card.file_name
                this.practiceFileDownload.href = card.file_path
                this.practiceFileDownload.download = card.file_name

                if (!this.practiceFileDownloadButton.classList.contains('file-download-enable')) {
                    this.practiceFileDownloadButton.classList.add('file-download-enable')
                }
                this.practiceFileDownloadButton.classList.remove('file-download-disable')
            } else {
                this.practiceFileDownload.removeAttribute('href')
                this.practiceFileDownload.removeAttribute('download')
                this.practiceFileNameLink.innerText = ''
                this.practiceFileName.value = ''
                this.practiceFile.value = ''
                if (!this.practiceFileDownloadButton.classList.contains('file-download-disable')) {
                    this.practiceFileDownloadButton.classList.add('file-download-disable')
                }
                this.practiceFileDownloadButton.classList.remove('file-download-enable')
            }

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

    showInputFields(cardType, action) {

        if (cardType == 'theory') {
            this.hideField('practiceCardInput')
            this.hideField('practiceCardTipInput')

            if (action == 'create') {
                this.deleteTheoryCardImage()
            } else {
                this.showTheoryCardImageField()
            }

            this.theoryField.classList.remove('hidden-field')
        } else {
            this.hideField('theoryCardInput')

            if (action == 'create') {
                this.deletePracticeCardFile()
                this.deletePracticeCardImage()
                this.deletePracticeCardTip()
            } else {
                this.showPracticeCardImageField()
                this.showPracticeCardTipField()

                if (this.currentCard.file_name && this.currentCard.file_path) {
                    this.showPracticeCardFileField()
                } else {
                    this.hideField('practiceCardFileField')
                    this.hideField('practiceCardFileButtonDeleteField')
                    this.practiceFileButtonAddField.classList.remove('hidden-field')
                }
            }

            this.practiceField.classList.remove('hidden-field')
        }

        this.cardPositionSelectField.classList.remove('hidden-field')
        this.sendCardDataButtonField.classList.remove('hidden-field')
    }

    showTheoryCardImageField() {
        this.hideField('theoryCardImageButtonAddField')
        this.theoryImageButtonDeleteField.classList.remove('hidden-field')
        this.theoryImageField.classList.remove('hidden-field')
    }

    deleteTheoryCardImage() {
        this.hideField('theoryCardImageField')
        this.hideField('theoryCardImageButtonDeleteField')
        this.theoryImageButtonAddField.classList.remove('hidden-field')

        this.hideField('theoryCardInputImage')
        this.hideField('previewCardTheoryImage')
        this.theoryImage.value = ''
        this.currentCardImagePath = null
    }

    showPracticeCardFileField() {
        this.hideField('practiceCardFileButtonAddField')
        this.practiceFileButtonDeleteField.classList.remove('hidden-field')
        this.practiceFileField.classList.remove('hidden-field')
        this.PreviewCardPracticeFileField.classList.remove('hidden-field')
    }

    deletePracticeCardFile() {
        this.hideField('practiceCardFileField')
        this.hideField('practiceCardFileButtonDeleteField')
        this.practiceFileButtonAddField.classList.remove('hidden-field')

        this.practiceFileDownload.removeAttribute('href')
        this.practiceFileDownload.download = ''
        this.practiceFileNameLink.innerText = ''
        this.practiceFileName.value = ''
        this.practiceFile.value = ''

        this.hideField('previewCardPracticeFile')
        this.PreviewCardPracticeFileDownload.removeAttribute('href')
        this.PreviewCardPracticeFileDownload.download = ''
        this.PreviewCardPracticeFileName.innerText = ''
        this.currentCardFilePath = null
    }

    showPracticeCardImageField() {
        this.hideField('practiceCardImageButtonAddField')
        this.practiceImageButtonDeleteField.classList.remove('hidden-field')
        this.practiceImageField.classList.remove('hidden-field')
    }

    deletePracticeCardImage() {
        this.hideField('practiceCardImageField')
        this.hideField('practiceCardImageButtonDeleteField')
        this.practiceImageButtonAddField.classList.remove('hidden-field')

        this.hideField('practiceCardInputImage')
        this.hideField('previewCardPracticeImage')
        this.practiceImage.value = ''
        this.currentCardImagePath = null
    }

    showPracticeCardTipImageField() {
        this.hideField('practiceCardTipImageButtonAddField')
        this.practiceTipImageButtonDeleteField.classList.remove('hidden-field')
        this.practiceTipImageField.classList.remove('hidden-field')
    }

    deletePracticeCardTipImage() {
        this.hideField('practiceCardTipImageField')
        this.hideField('practiceCardTipImageButtonDeleteField')
        this.practiceTipImageButtonAddField.classList.remove('hidden-field')

        this.hideField('practiceCardInputTipImage')
        this.hideField('previewCardPracticeTipImage')
        this.practiceTipImage.value = ''
        this.currentCardTipImagePath = null
    }

    showPracticeCardTipField() {
        this.hideField('practiceCardTipButtonAddField')
        this.hideField('practiceCardTipImageButtonAddField')
//        this.hideField('practiceCardTipImageButtonDeleteField')
//        this.practiceTipImageButtonAddField.classList.remove('hidden-field')
//        this.hideField('practiceCardTipImageField')
        this.practiceTipButtonDeleteField.classList.remove('hidden-field')
        this.practiceTipImageButtonDeleteField.classList.remove('hidden-field')
        this.practiceTipField.classList.remove('hidden-field')
        this.practiceTipImageField.classList.remove('hidden-field')
    }

    deletePracticeCardTip() {
        this.hideField('practiceCardTipButtonDeleteField')
        this.practiceTipButtonAddField.classList.remove('hidden-field')
        this.hideField('practiceCardTipInput')
        this.hideField('practiceCardInputTipImage')
        this.hideField('previewCardPracticeTipImage')

        this.practiceTipDescr.value = ''
        this.practiceTipImage.value = ''
        this.PreviewCardPracticeTipDescr.innerText = ''
        this.currentCardTipImagePath = null
    }

    uploadFile(file, path) {
        const imgData = new FormData()
        imgData.append('file_data', file)

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        return fetch('/api/themes/file/upload/', {
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
        .then(fileResponse => {
            if (fileResponse.hasOwnProperty('file_path')) {
                return fileResponse['file_path']
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

        if (this.theoryImage.files.length > 0) {
            const path = `${this.exams[this.currentExamId]}/${this.themes[this.currentThemeId].exam_task_number}/`
            this.currentCardImagePath = await this.uploadFile(this.theoryImage.files[0], path)

            if (!this.currentCardImagePath) {
                flashMsg('Не удалось загрузить изображение на сервер. Попробуй еще раз, либо внесите изменения в карточку, не изменяя изображение', this.flashMsg, 'wrong')
                return
            }
        }

        const updateTheoryCardData = {
            themeId: this.currentThemeId,
            cardId: this.currentCardId,
            title: this.theoryTitle.value,
            descr: this.theoryDescr.value,
            ...(this.currentCardImagePath && { imagePath: this.currentCardImagePath}),
            currentPosition: this.currentCardPosition,
            newPosition: this.cardPositionSelect.value
        }

        fetch(`/api/themes/${this.currentThemeId}/cards/`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'My-Tutor-Auth-Token': token
            },
            body: JSON.stringify(updateTheoryCardData)
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

        let tipDescr = null

        if (this.practiceFile.files.length > 0) {
            const path = `${this.exams[this.currentExamId]}/${this.themes[this.currentThemeId].exam_task_number}/`
            this.currentCardFilePath = await this.uploadFile(this.practiceFile.files[0], path)

            if (!this.currentCardFilePath) {
                flashMsg('Не удалось загрузить файл на сервер. Попробуйте еще раз, либо внесите изменения в карточку, не изменяя файл', this.flashMsg, 'wrong')
                return
            }
        }

        if (this.practiceImage.files.length > 0) {
            const path = `${this.exams[this.currentExamId]}/${this.themes[this.currentThemeId].exam_task_number}/`
            this.currentCardImagePath = await this.uploadFile(this.practiceImage.files[0], path)

            if (!this.currentCardImagePath) {
                flashMsg('Не удалось загрузить изображение карточки на сервер. Попробуй еще раз, либо внесите изменения в карточку, не изменяя изображение', this.flashMsg, 'wrong')
                return
            }
        }

        if (this.practiceTipImage.files.length > 0) {
            const path = `${this.exams[this.currentExamId]}/${this.themes[this.currentThemeId].exam_task_number}/`
            this.currentCardTipImagePath = await this.uploadFile(this.practiceTipImage.files[0], path)

            if (!this.currentCardTipImagePath) {
                flashMsg('Не удалось загрузить изображение решения на сервер. Попробуй еще раз, либо внесите изменения в карточку, не изменяя изображение', this.flashMsg, 'wrong')
                return
            }
        }

        if (!this.practiceTipDescr.value == "") {
            tipDescr = this.practiceTipDescr.value
        }

        const updatePracticeCardData = {
            themeId: this.currentThemeId,
            cardId: this.currentCardId,
            title: this.practiceTitle.value,
            descr: this.practiceDescr.value,
            ...(this.currentCardImagePath && { imagePath: this.currentCardImagePath}),
            answer: this.practiceAnswer.value,
            ...(this.currentCardFilePath && { filePath: this.currentCardFilePath, fileName: this.practiceFileName.value}),
            ...(tipDescr && { tipDescr: tipDescr }),
            ...(this.currentCardTipImagePath && { tipImagePath: this.currentCardTipImagePath }),
            currentPosition: this.currentCardPosition,
            newPosition: this.cardPositionSelect.value
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

        if (this.theoryImage.files.length > 0) {
            const path = `${this.exams[this.currentExamId]}/${this.themes[this.currentThemeId].exam_task_number}/`
            this.currentCardImagePath = await this.uploadFile(this.theoryImage.files[0], path)

            if (!this.currentCardImagePath) {
                flashMsg('Не удалось загрузить изображение на сервер. Попробуй еще раз, либо внесите изменения в карточку, не изменяя изображение', this.flashMsg, 'wrong')
                return
            }
        }

        const createTheoryCardData = {
            themeId: this.currentThemeId,
            title: this.theoryTitle.value,
            descr: this.theoryDescr.value,
            ...(this.currentCardImagePath && { imagePath: this.currentCardImagePath}),
            cardPosition: this.cardPositionSelect.value
        }

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
            this.chooseTheme(this.currentThemeId, true)
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

        let tipDescr = null

        if (this.practiceFile.files.length > 0) {
            const path = `${this.exams[this.currentExamId]}/${this.themes[this.currentThemeId].exam_task_number}/`
            this.currentCardFilePath = await this.uploadFile(this.practiceFile.files[0], path)

            if (!this.currentCardFilePath) {
                flashMsg('Не удалось загрузить файл на сервер. Попробуйте еще раз, либо внесите изменения в карточку, не изменяя файл', this.flashMsg, 'wrong')
                return
            }
        }

        if (this.practiceImage.files.length > 0) {
            const path = `${this.exams[this.currentExamId]}/${this.themes[this.currentThemeId].exam_task_number}/`
            this.currentCardImagePath = await this.uploadFile(this.practiceImage.files[0], path)

            if (!this.currentCardImagePath) {
                flashMsg('Не удалось загрузить изображение на сервер. Попробуй еще раз, либо внесите изменения в карточку, не изменяя изображение', this.flashMsg, 'wrong')
                return
            }
        }

        if (this.practiceTipImage.files.length > 0) {
            const path = `${this.exams[this.currentExamId]}/${this.themes[this.currentThemeId].exam_task_number}/`
            this.currentCardTipImagePath = await this.uploadFile(this.practiceTipImage.files[0], path)

            if (!this.currentCardTipImagePath) {
                flashMsg('Не удалось загрузить изображение решения на сервер. Попробуй еще раз, либо внесите изменения в карточку, не изменяя изображение', this.flashMsg, 'wrong')
                return
            }
        }

        if (!this.practiceTipDescr.value == "") {
            tipDescr = this.practiceTipDescr.value
        }

        const createPracticeCardData = {
            themeId: this.currentThemeId,
            title: this.practiceTitle.value,
            descr: this.practiceDescr.value,
            ...(this.currentCardImagePath && { imagePath: this.currentCardImagePath}),
            answer: this.practiceAnswer.value,
            ...(this.currentCardFilePath && {filePath: this.currentCardFilePath, fileName: this.practiceFileName.value}),
            ...(tipDescr && { tipDescr: tipDescr }),
            ...(this.currentCardTipImagePath && { tipImagePath: this.currentCardTipImagePath }),
            cardPosition: this.cardPositionSelect.value
        }

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
            this.chooseTheme(this.currentThemeId, true)
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
                            self.hideField('practiceCardInputTipImage')
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

//    handleDownloadClick(controller) {
//        console.log('click ebana')
//        let file = controller.practiceFile.files[0];
//
//        if (file) {
//            controller.practiceFileDownload.removeAttribute('href')
//            controller.PreviewCardPracticeFileDownload.removeAttribute('href')
//            let url = URL.createObjectURL(file);
//            let a = document.createElement('a');
//            a.href = url;
//            a.download = controller.practiceFileName.value;
//            document.body.appendChild(a);
//            a.click();
//            document.body.removeChild(a);
//            URL.revokeObjectURL(url);
//        }
//    }
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

    chooseExam.addEventListener('change', function() {
        controller.chooseExam(this.value)
    })
    chooseTheme.addEventListener('change', function() {
        controller.chooseTheme(this.value)
    })
    chooseAction.addEventListener('change', function() {
        controller.chooseAction(this.value)
    })

    // Выбор вида создаваемой карточки
    controller.createTheoryCardButton.onclick = () => {
        if (!controller.createTheoryCardButton.classList.contains('active-type-button')) {
            controller.createTheoryCardButton.classList.add('active-type-button')
        }
        controller.createPracticeCardButton.classList.remove('active-type-button')
        controller.chooseCreateCard('theory')
    }
    controller.createPracticeCardButton.onclick = () => {
        if (!controller.createPracticeCardButton.classList.contains('active-type-button')) {
            controller.createPracticeCardButton.classList.add('active-type-button')
        }
        controller.createTheoryCardButton.classList.remove('active-type-button')
        controller.chooseCreateCard('practice')
    }
    // Кнопки изображения теории
    controller.theoryImageButtonAdd.onclick = () => {
        controller.showTheoryCardImageField()
    }
    controller.theoryImageButtonDelete.onclick = () => {
        controller.deleteTheoryCardImage()
    }
    // Кнопки файла практики
    controller.practiceFileButtonAdd.onclick = () => {
        controller.showPracticeCardFileField()
    }
    controller.practiceFileButtonDelete.onclick = () => {
        controller.deletePracticeCardFile()
    }
    // Кнопки изображения практики
    controller.practiceImageButtonAdd.onclick = () => {
        controller.showPracticeCardImageField()
    }
    controller.practiceImageButtonDelete.onclick = () => {
        controller.deletePracticeCardImage()
    }
    // Кнопки изображения решения
    controller.practiceTipImageButtonAdd.onclick = () => {
        controller.showPracticeCardTipImageField()
    }
    controller.practiceTipImageButtonDelete.onclick = () => {
        controller.deletePracticeCardTipImage()
    }
    // Кнопки решения
    controller.practiceTipButtonAdd.onclick = () => {
        controller.showPracticeCardTipField()
    }
    controller.practiceTipButtonDelete.onclick = () => {
        controller.deletePracticeCardTip()
    }

    chooseUpdateCard.addEventListener('change', function() {
        controller.chooseUpdateCard(this.value)
    })
    chooseDeleteCard.addEventListener('change', function() {
        controller.chooseDeleteCard(this.value)
    })
    controller.deleteCardButton.onclick = () => {
        controller.deleteCard()
    }

    controller.PreviewCardPracticeAnswerField.addEventListener('input', () => {
        controller.PreviewCardPracticeAnswerField.classList.remove('input-answer-success')
        controller.PreviewCardPracticeAnswerField.classList.remove('input-answer-wrong')
        controller.PreviewCardPracticeAnswerButton.innerText = 'Проверить'
    })

    // Слушатели файла и его названия
    controller.practiceFile.addEventListener('change', function() {
        let file = this.files[0]
        if (file) {
            let url = URL.createObjectURL(file)
            controller.practiceFileDownload.href = url
            controller.practiceFileDownload.download = controller.practiceFileNameLink.innerText
            controller.PreviewCardPracticeFileDownload.href = url
            controller.PreviewCardPracticeFileDownload.download = controller.practiceFileNameLink.innerText

            if (!controller.practiceFileDownloadButton.classList.contains('file-download-enable')) {
                controller.practiceFileDownloadButton.classList.add('file-download-enable')
            }
            controller.practiceFileDownloadButton.classList.remove('file-download-disable')
            if (!controller.PreviewCardPracticeFileDownloadButton.classList.contains('file-download-enable')) {
                controller.PreviewCardPracticeFileDownloadButton.classList.add('file-download-enable')
            }
            controller.PreviewCardPracticeFileDownloadButton.classList.remove('file-download-disable')
        } else {
            controller.practiceFileDownload.removeAttribute('href')
            controller.practiceFileDownload.removeAttribute('download')
            controller.PreviewCardPracticeFileDownload.removeAttribute('href')
            controller.PreviewCardPracticeFileDownload.removeAttribute('download')

            if (!controller.practiceFileDownloadButton.classList.contains('file-download-disable')) {
                controller.practiceFileDownloadButton.classList.add('file-download-disable')
            }
            controller.practiceFileDownloadButton.classList.remove('file-download-enable')
            if (!controller.PreviewCardPracticeFileDownloadButton.classList.contains('file-download-disable')) {
                controller.PreviewCardPracticeFileDownloadButton.classList.add('file-download-disable')
            }
            controller.PreviewCardPracticeFileDownloadButton.classList.remove('file-download-enable')
        }
    })
    controller.practiceFileName.addEventListener('input', function() {
        controller.practiceFileDownload.download = this.value
        controller.PreviewCardPracticeFileDownload.download = this.value
        controller.practiceFileNameLink.innerText = this.value
        controller.PreviewCardPracticeFileName.innerText = this.value
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
