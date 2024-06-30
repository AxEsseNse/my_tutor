class Validator {
    checkValidTitle(data) {
        if (data.trim().length > 30) {
            return 'Длина названия пробника не может быть больше 30 символов. Основную информацию помещайте в описание'
        }
        if (data.trim().length < 5) {
            return 'Длина названия пробника не может менее 5 символов'
        }
        return false
    }

    checkValidDescr(data) {
        if (data.trim().length < 1) {
            return 'Описание пробника не может быть пустым или содержать только пробелы'
        }
        return false
    }
}

class AddDemoExamForm {
    constructor(themeTable, validator) {
        this.themeTable = themeTable
        this.validator = validator

        this.inputExam = document.getElementById('demo-exam-add-form-exam')
        this.inputField = document.getElementById('demo-exam-add-form-input-field')
        this.inputTitle = document.getElementById('demo-exam-add-form-title')
        this.inputDescr = document.getElementById('demo-exam-add-form-descr')

        this.flashMsg = document.getElementById('demo-exam-add-form-flash-msg')

        this.btnClearAddDemoExamForm = document.getElementById('demo-exam-add-form-button-clear-form')
        this.btnClearAddDemoExamForm.onclick = () => {
            this.clearAddDemoExamForm()
        }
        this.btnAddDemoExam = document.getElementById('demo-exam-add-form-button')
        this.btnAddDemoExam.onclick = () => {
            this.addDemoExam()
        }
    }

    clearAddDemoExamForm() {
        console.log('Очистка формы добавления пробника')
        this.inputExam.value = ''
        this.inputTitle.value = ''
        this.inputDescr.value = ''
        this.flashMsg.innerHTML = ''

        if (!this.inputField.classList.contains('hidden-field')) {
            this.inputField.classList.add('hidden-field')
        }
    }

    addDemoExam() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        let errorTitle = this.validator.checkValidTitle(this.inputTitle.value)
        let errorDescr = this.validator.checkValidDescr(this.inputDescr.value)
        let errors = [errorTitle, errorDescr]

        for (let error of errors) {
            if (error) {
                flashMsg(error, this.flashMsg, 'wrong')
                return
            }
        }
        this.flashMsg.innerHTML = ''

        const newDemoExam = {
            examId: this.inputExam.value,
            title: this.inputTitle.value,
            descr: this.inputDescr.value
        }
        return
        fetch('/api/demo-exams/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'My-Tutor-Auth-Token': token
            },
            body: JSON.stringify(newDemoExam),
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
        .then(demoExam => {
            if (demoExam.hasOwnProperty('title')) {
                console.log(demoExam.message)
                const body = this.themeTable.table.tBodies[0]
                const row = body.insertRow()
                this.themeTable.fillRow(row, demoExam)

                flashMsg(
                    `Создан новый шаблон пробника по профилю "${demoExam.exam}" под названием "${demoExam.title}"`,
                    this.flashMsg,
                    'success',
                )
            } else {
                flashMsg(demoExam.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class DemoExamFormDelete {
    constructor(delRow, demoExamId) {
        this.delRow = delRow
        this.demoExamId = demoExamId

        this.inputExam = document.getElementById('demo-exam-delete-form-exam')
        this.inputTitle = document.getElementById('demo-exam-delete-form-title')
        this.inputDescr = document.getElementById('demo-exam-delete-form-descr')

        this.flashMsg = document.getElementById('demo-exam-delete-form-flash-msg')

        this.btnDeleteDemoExam = document.getElementById('demo-exam-delete-form-button')
        this.btnDeleteDemoExam.onclick = () => {
            this.deleteDemoExam()
        }
    }

    fillDeleteForm() {
        this.inputExam.value = this.delRow.childNodes[0].innerText
        this.inputTitle.value = this.delRow.childNodes[1].innerText
        this.inputDescr.value = this.delRow.childNodes[2].innerText
        this.flashMsg.innerHTML = ''
        this.btnDeleteDemoExam.disabled = false
    }

    deleteDemoExam() {
        const deleteTheme = {
            themeId: this.themeId
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/demo-exams/${this.demoExamId}/`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            'My-Tutor-Auth-Token': token
            }
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
        .then(deletedDemoExam => {
            if (deletedDemoExam.hasOwnProperty('title')) {
                console.log(deletedDemoExam.message)
                this.delRow.parentElement.removeChild(this.delRow)
                this.btnDeleteDemoExam.disabled = true

                flashMsg(`По профилю ${deletedDemoExam.exam} успешно удален пробник "${deletedDemoExam.title}"`, this.flashMsg, 'success')
            } else {
                flashMsg(deletedDemoExam.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class DemoExamFormUpdate {
    constructor(updateRow, validator, demoExamId) {
        this.updateRow = updateRow
        this.validator = validator
        this.demoExamId = demoExamId
        this.exams = {
            "ЕГЭ": 1,
            "ОГЭ": 2
        }

        this.inputExam = document.getElementById('demo-exam-update-form-exam')
        this.inputTitle = document.getElementById('demo-exam-update-form-title')
        this.inputDescr = document.getElementById('demo-exam-update-form-descr')

        this.flashMsg = document.getElementById('demo-exam-update-form-flash-msg')

        this.btnUpdateDemoExam = document.getElementById('demo-exam-update-form-button')
        this.btnUpdateDemoExam.onclick = () => {
            this.updateDemoExam()
        }
    }

    fillUpdateForm() {
        this.inputExam.value = this.exams[this.updateRow.childNodes[0].innerText]
        this.inputTitle.value = this.updateRow.childNodes[1].innerText
        this.inputDescr.value = this.updateRow.childNodes[2].innerText
        this.flashMsg.innerHTML = ''
    }

    updateDemoExam() {
        const updatedDemoExam = {
            demoExamId: this.demoExamId,
            examId: this.inputExam.value,
            title: this.inputTitle.value,
            descr: this.inputDescr.value
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        let errorTitle = this.validator.checkValidTitle(this.inputTitle.value)
        let errorDescr = this.validator.checkValidDescr(this.inputDescr.value)
        let errors = [errorTitle, errorDescr]

        for (let error of errors) {
            if (error) {
                flashMsg(error, this.flashMsg, 'wrong')
                return
            }
        }
        this.flashMsg.innerHTML = ''

        fetch(`/api/demo-exams/${this.demoExamId}/`, {
            method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'My-Tutor-Auth-Token': token
                },
                body: JSON.stringify(updatedDemoExam),
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
        .then(demoExam => {
            if (demoExam.hasOwnProperty('title')) {
                this.updateRow.childNodes[0].innerText = demoExam.exam
                this.updateRow.childNodes[1].innerText = demoExam.title
                this.updateRow.childNodes[2].innerText = demoExam.descr

                flashMsg(`Успешно изменены данные пробника "${demoExam.title}" по профилю ${demoExam.exam}`, this.flashMsg, 'success')
                console.log(demoExam.message)
            } else {
                flashMsg(demoExam.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class DemoExamTable {
    constructor(validator) {
        this.table = document.getElementById('demo-exams-table')
        this.validator = validator
    }

    loadDemoExams() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch('/api/demo-exams/', {
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

    fillTable(demoExams) {
        console.log(demoExams)
        const body = this.table.tBodies[0]
        body.innerHTML = ''

        demoExams.forEach(demoExam => {
            const row = body.insertRow()
            this.fillRow(row, demoExam)
        })
    }

    fillRow(row, demoExam) {
        this.addCell(row, demoExam.exam)
        this.addCell(row, demoExam.title)
        this.addCell(row, demoExam.descr)

        const controllers = document.createElement('div')
        controllers.classList.add('text-end')
        controllers.style.right = '0px'
        controllers.appendChild(this.createUpdateContentButton(row, demoExam.demo_exam_id))
        controllers.appendChild(this.createUpdateButton(row, demoExam.demo_exam_id))
        controllers.appendChild(this.createDeleteButton(row, demoExam.demo_exam_id))
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
        return cell
    }

    createUpdateContentButton(row, demoExamId) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'btn-sm', 'ms-1', 'table-controller')
        btn.style.color = '#228B22'
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Изменить содержимое пробника')
        btn.innerHTML = '<i class="fa-solid fa-book-open-reader"></i>'
        btn.onclick = () => {
            window.location.href = `/demo-exams/${demoExamId}/update-content`
        }
        return btn
    }

    createUpdateButton(row, demoExamId) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'btn-sm', 'ms-1', 'table-controller')
        btn.style.color = '#228B22'
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Изменить пробник')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-demo-exam-update')
        btn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>'
        btn.onclick = () => {
            const form = new DemoExamFormUpdate(row, this.validator, demoExamId)
            form.fillUpdateForm()
        }
        return btn
    }

    createDeleteButton(row, demoExamId) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'btn-sm', 'ms-1', 'table-controller')
        btn.style.color = '#C41E3A'
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Удалить пробник')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-demo-exam-delete')
        btn.innerHTML = '<i class="fa-solid fa-trash"></i>'
        btn.onclick = () => {
            const form = new DemoExamFormDelete(row, demoExamId)
            form.fillDeleteForm()
        }

        return btn
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    const validator = new Validator()
    const demoExamTable = new DemoExamTable(validator)
    demoExamTable.loadDemoExams()
    addDemoExamForm = new AddDemoExamForm(demoExamTable, validator)

    const addDemoExamButton = document.getElementById('btn-add-demo-exam')
    addDemoExamButton.onclick = () => {
        addDemoExamForm.clearAddDemoExamForm()
    }

    addDemoExamForm.inputExam.addEventListener('change', () => {
        addDemoExamForm.inputField.classList.remove('hidden-field')
    })
})
