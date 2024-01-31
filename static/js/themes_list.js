const exams = {
    ЕГЭ: 1,
    ОГЭ: 2
}

function clearAddThemeForm() {
    console.log('Очистка формы добавления темы')
    document.getElementById('theme-add-form-exam').value = '1'
    document.getElementById('theme-add-form-title').value = ''
    document.getElementById('theme-add-form-descr').value = ''
    document.getElementById('theme-add-form-flash-msg').innerHTML = ''
}

class AddThemeForm {
    constructor(themeTable) {
        this.themeTable = themeTable

        this.inputExam = document.getElementById('theme-add-form-exam')
        this.inputTitle = document.getElementById('theme-add-form-title')
        this.inputDescr = document.getElementById('theme-add-form-descr')

        this.flashMsg = document.getElementById('theme-add-form-flash-msg')

        this.btnAddTheme = document.getElementById('theme-add-form-button')
        this.btnAddTheme.onclick = () => {
            this.addTheme()
        }
    }

    addTheme() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        const newTheme = {
            examId: this.inputExam.value,
            title: this.inputTitle.value,
            descr: this.inputDescr.value
        }

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
                    `Для профиля "${theme.exam}" создана новая тема "${theme.title}"`,
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
        this.themeTitle = updateRow.childNodes[2].innerText
        this.themeDescr = updateRow.childNodes[3].innerText

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

        fetch(`/api/lessons/${this.themeId}/`, {
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
    new AddThemeForm(themeTable)
})