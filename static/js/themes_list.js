const exams = {
    ЕГЭ: 1,
    ОГЭ: 2
}
const egeOptions = [
    { value: '1', text: '1'},
    { value: '2', text: '2'},
    { value: '3', text: '3'},
    { value: '4', text: '4'},
    { value: '5', text: '5'},
    { value: '6', text: '6'},
    { value: '7', text: '7'},
    { value: '8', text: '8'},
    { value: '9', text: '9'},
    { value: '10', text: '10'},
    { value: '11', text: '11'},
    { value: '12', text: '12'},
    { value: '13', text: '13'},
    { value: '14', text: '14'},
    { value: '15', text: '15'},
    { value: '16', text: '16'},
    { value: '17', text: '17'},
    { value: '18', text: '18'},
    { value: '19', text: '19'},
    { value: '20', text: '20'},
    { value: '21', text: '21'},
    { value: '22', text: '22'},
    { value: '23', text: '23'},
    { value: '24', text: '24'},
    { value: '25', text: '25'},
    { value: '26', text: '26'},
    { value: '27', text: '27'}
]

const ogeOptions = [
    { value: '1', text: '1'},
    { value: '2', text: '2'},
    { value: '3', text: '3'},
    { value: '4', text: '4'},
    { value: '5', text: '5'},
    { value: '6', text: '6'},
    { value: '7', text: '7'},
    { value: '8', text: '8'},
    { value: '9', text: '9'},
    { value: '10', text: '10'},
    { value: '11', text: '11'},
    { value: '12', text: '12'},
    { value: '13', text: '13'},
    { value: '14', text: '14'},
    { value: '15', text: '15'}
]

class AddThemeForm {
    constructor(themeTable) {
        this.themeTable = themeTable

        this.inputField = document.getElementById('theme-add-form-input-field')
        this.inputExam = document.getElementById('theme-add-form-exam')
        this.inputExamTaskNumberField = document.getElementById('theme-add-form-exam-task-number-field')
        this.inputExamTaskNumber = document.getElementById('theme-add-form-exam-task-number')
        this.inputTitle = document.getElementById('theme-add-form-title')
        this.inputDescr = document.getElementById('theme-add-form-descr')

        this.flashMsg = document.getElementById('theme-add-form-flash-msg')

        this.btnAddTheme = document.getElementById('theme-add-form-button')
        this.btnAddTheme.onclick = () => {
            this.addTheme()
        }
    }

    hideField(field) {
        switch (field) {
            case 'taskNumber':
                if (!this.inputExamTaskNumberField.classList.contains('hidden-field')) {
                        this.inputExamTaskNumberField.classList.add('hidden-field')
                    }
                break
            case 'inputField':
                if (!this.inputField.classList.contains('hidden-field')) {
                    this.inputField.classList.add('hidden-field')
                }
                break
        }
    }

    clearAddThemeForm() {
        console.log('Очистка формы добавления темы')
        this.inputExam.value = ''
        this.inputTitle.value = ''
        this.inputDescr.value = ''
        this.flashMsg.innerHTML = ''

        this.hideField('taskNumber')
        this.hideField('inputField')
    }

    addExamTaskNumberOptions(options) {
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            this.inputExamTaskNumber.appendChild(optionElement);
        });
    }

    fillExamTaskNumberOptions() {
        this.inputExamTaskNumber.innerHTML = '';

        const emptyOption = document.createElement('option')
        emptyOption.value = ""
        emptyOption.hidden = true
        emptyOption.disabled = true
        emptyOption.selected = true
        emptyOption.innerText = "Выберите номер задания"
        this.inputExamTaskNumber.append(emptyOption)

        if (this.inputExam.value === '1') {
            this.addExamTaskNumberOptions(egeOptions);
        } else if (this.inputExam.value === '2') {
            this.addExamTaskNumberOptions(ogeOptions);
        }
    }

    addTheme() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        const newTheme = {
            examId: parseInt(this.inputExam.value, 10),
            examTaskNumber: parseInt(this.inputExamTaskNumber.value, 10),
            title: this.inputTitle.value,
            descr: this.inputDescr.value
        }

        console.log(newTheme)

        fetch('/api/admin/themes/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'My-Tutor-Auth-Token': token
            },
            body: JSON.stringify(newTheme),
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
        .then(theme => {
            if (theme.hasOwnProperty('title')) {
                console.log(theme.message)
                const body = this.themeTable.table.tBodies[0]
                const row = body.insertRow()
                this.themeTable.fillRow(row, theme)

                flashMsg(
                    `В профиле "${theme.exam}" для задания № ${theme.exam_task_number} создана новая тема "${theme.title}"`,
                    this.flashMsg,
                    'success',
                )
            } else {
                flashMsg(theme.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class ThemeFormDelete {
    constructor(delRow) {
        this.delRow = delRow
        this.themeId = delRow.childNodes[0].innerText
        this.themeExam = delRow.childNodes[1].innerText
        this.themeTitle = delRow.childNodes[2].innerText



        this.inputId = document.getElementById('theme-delete-form-id')
        this.inputExam = document.getElementById('theme-delete-form-exam')
        this.inputTitle = document.getElementById('theme-delete-form-title')

        this.flashMsg = document.getElementById('theme-delete-form-flash-msg')

        this.btnDeleteTheme = document.getElementById('theme-delete-form-button')
        this.btnDeleteTheme.onclick = () => {
            this.deleteTheme()
        }
    }

    fillDeleteForm() {
        this.inputId.value = this.themeId
        this.inputExam.value = this.themeExam
        this.inputTitle.value = this.themeTitle
        this.flashMsg.innerHTML = ''
        this.btnDeleteTheme.disabled = false
    }

    deleteTheme() {
        const deleteTheme = {
            themeId: this.themeId
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/admin/themes/${this.themeId}/`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            'My-Tutor-Auth-Token': token
            },
            body: JSON.stringify(deleteTheme),
        })
        .then(response => {
            if (!response.ok) {
                if (!(response.status == 404)) {
                    return Promise.reject(response.text())
                }
            }
            return Promise.resolve(response.text())
        })
        .then(text => {
            return JSON.parse(text)
        })
        .then(deleteTheme => {
            if (deleteTheme.hasOwnProperty('title')) {
                console.log(deleteTheme.message)
                this.delRow.parentElement.removeChild(this.delRow)
                flashMsg(`Из профиля "${deleteTheme.exam}" удалена тема "${deleteTheme.title}"`, this.flashMsg, 'success')
                this.btnDeleteTheme.disabled = true
            } else {
                flashMsg(deleteTheme.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class ThemeFormUpdate {
    constructor(updateRow) {
        this.updateRow = updateRow
        this.themeId = updateRow.childNodes[0].innerText
        this.themeExam = updateRow.childNodes[1].innerText
        this.themeTitle = updateRow.childNodes[3].innerText
        this.themeDescr = updateRow.childNodes[4].innerText

        this.inputId = document.getElementById('theme-update-form-id')
        this.inputExam = document.getElementById('theme-update-form-exam')
        this.inputTitle = document.getElementById('theme-update-form-title')
        this.inputDescr = document.getElementById('theme-update-form-descr')

        this.flashMsg = document.getElementById('theme-update-form-flash-msg')

        this.btnUpdateTheme = document.getElementById('theme-update-form-button')
        this.btnUpdateTheme.onclick = () => {
            this.updateTheme()
        }
    }

    fillUpdateForm() {
        this.inputId.value = this.themeId
        this.inputExam.value = exams[this.themeExam]
        this.inputTitle.value = this.themeTitle
        this.inputDescr.value = this.themeDescr
        this.flashMsg.innerHTML = ''
    }

    updateTheme() {
        const updatedTheme = {
            themeId: this.themeId,
            examId: this.inputExam.value,
            title: this.inputTitle.value,
            descr: this.inputDescr.value
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/admin/themes/${this.themeId}/`, {
            method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'My-Tutor-Auth-Token': token
                },
                body: JSON.stringify(updatedTheme),
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
        .then(theme => {
            if (theme.hasOwnProperty('title')) {
                this.updateRow.childNodes[0].innerText = theme.theme_id
                this.updateRow.childNodes[1].innerText = theme.exam
                this.updateRow.childNodes[2].innerText = theme.title
                this.updateRow.childNodes[3].innerText = theme.descr

                flashMsg(`В профиле "${theme.exam}" успешно изменена тема "${theme.title}"`, this.flashMsg, 'success')
                console.log(theme.message)
            } else {
                flashMsg(theme.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class ThemeTable {
    constructor() {
        this.table = document.getElementById('themes-table')
    }
    loadThemes() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch('/api/admin/themes/', {
            method: 'GET',
            headers: {
            'My-tutor-Auth-Token': token
            }
        })
        .then(response => response.json())
        .then(data => {
            this.fillTable(data)
        })
        .catch(error => {
            console.error(error)
        })
    }

    fillTable(themes) {
        const body = this.table.tBodies[0]
        body.innerHTML = ''

        themes.forEach(theme => {
            const row = body.insertRow()
            this.fillRow(row, theme)
        })
    }

    fillRow(row, theme) {
        this.addCell(row, theme.theme_id)
        this.addCell(row, theme.exam)
        this.addCell(row, `Задание № ${theme.exam_task_number}`)
        this.addCell(row, theme.title)
        this.addCell(row, theme.descr)

        const controllers = document.createElement('div')
        controllers.classList.add('text-end')
        controllers.style.right = '0px'
        controllers.appendChild(this.createUpdateButton(row))
        controllers.appendChild(this.createDeleteButton(row))
        this.addCell(row, controllers)
    }

    addCell(row, content) {
        let cell = row.insertCell()
        cell.classList.add('align-middle')
        if (typeof content === 'object') {
            cell.appendChild(content)
        } else {
            cell.innerHTML = content
            cell.classList.add('small')
        }
    }

    createUpdateButton(row) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'btn-sm', 'btn-warning')
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Изменить тему')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-theme-update')
        btn.innerHTML = '<i class="fa-solid fa-pen-to-square text-dark"></i>'
        btn.onclick = () => {
            const form = new ThemeFormUpdate(row)
            form.fillUpdateForm()
        }
        return btn
    }

    createDeleteButton(row) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'btn-sm', 'btn-danger')
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Удалить тему')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-theme-delete')
        btn.innerHTML = '<i class="fa-solid fa-trash text-dark"></i>'
        btn.onclick = () => {
            const form = new ThemeFormDelete(row)
            form.fillDeleteForm()
        }

        return btn
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    const themeTable = new ThemeTable()
    themeTable.loadThemes()
    addThemeForm = new AddThemeForm(themeTable)

    const addThemeButton = document.getElementById('btn-add-theme')
    addThemeButton.onclick = () => {
        addThemeForm.clearAddThemeForm()
    }

    addThemeForm.inputExam.addEventListener('change', () => {
        addThemeForm.fillExamTaskNumberOptions()
        addThemeForm.inputExamTaskNumberField.classList.remove('hidden-field')
    });
    addThemeForm.inputExamTaskNumber.addEventListener('change', () => {
        addThemeForm.inputField.classList.remove('hidden-field')
    });
})
