class Controller {
    constructor() {
        this.studentId = null

        this.table = document.getElementById('progress-table')
        this.selectStudent = document.getElementById('student-select')
        this.title = document.getElementById('title')
        this.hrTitle = document.getElementById('hr-title')
        this.buttonsField = document.getElementById('buttons-field')
        this.welcome = document.getElementById('text-start')

        this.examsTitles = {
            1: "ЕГЭ",
            2: "ОГЭ",
            3: "Программирование"
        }
    }

    hideField(field) {
        if (!field.classList.contains('hidden-field')) {
            field.classList.add('hidden-field')
        }
    }

    loadStudents() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch('/api/students/options/', {
            method: 'GET',
            headers: {
            'My-tutor-Auth-Token': token
            }
        })
        .then(response => response.json())
        .then(students => {
            this.setStudentsSelectOptions(students)
            const self = this
            this.selectStudent.addEventListener('change', function() {
                self.chooseStudent(this.value)
            })
        })
        .catch(error => {
            console.error(error)
        })
    }

    setStudentsSelectOptions(students) {
        this.selectStudent.innerHTML = ""

        const emptyOption = document.createElement('option')
        emptyOption.value = ""
        emptyOption.hidden = true
        emptyOption.disabled = true
        emptyOption.innerText = "Выберите студента"
        this.selectStudent.append(emptyOption)

        for (let student of students) {
            const option = document.createElement('option')
            option.value = student.id
            option.textContent = student.name
            this.selectStudent.appendChild(option)
        }
        this.selectStudent.options[0].selected = true
    }

    chooseStudent(studentId) {
        this.studentId = studentId
        this.buttonsField.classList.remove('hidden-field')
        this.welcome.classList.remove('hidden-field')

        if (!this.table.classList.contains('hidden-field')) {
            this.table.classList.add('hidden-field')
        }
        if (!this.title.classList.contains('hidden-field')) {
            this.title.classList.add('hidden-field')
        }
        if (!this.hrTitle.classList.contains('hidden-field')) {
            this.hrTitle.classList.add('hidden-field')
        }
    }

    getMyStudentId(userId) {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        console.log('Запрос на сервер для получения своего идентификатора студента')

        fetch(`/api/students/${userId}/student-id/`, {
            method: 'GET',
            headers: {
                'My-Tutor-Auth-Token': token
            }
        })
        .then(response => response.json())
        .then(response => {
            console.log(response.message)
            this.studentId = response.student_id
        })
        .catch(error => {
            console.error(error)
        })
    }

    loadThemes(examId) {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return Promise.reject(new Error("Token is undefined"))
        }

        console.log(`Запрос на сервер для получения списка тем по профилю ${this.examsTitles[examId]}`)
        return fetch(`/api/themes/exam/${examId}/`, {
            method: 'GET',
            headers: {
                'My-Tutor-Auth-Token': token
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(`Заполнение таблицы прогресса темами профиля ${this.examsTitles[examId]}`)
            this.fillTable(data)
        })
        .catch(error => {
            console.error(error)
            throw error
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
        this.addCell(row, "")
        this.addCell(row, theme.exam_task_number, theme.theme_id)
        this.addCell(row, theme.title)
        this.addCell(row, theme.descr)
        this.addCell(row, "")
        this.addStatusIcon(row, 'Не изучалось')
        this.addCell(row, '')

        if (userRole == "Преподаватель") {
            this.addShowThemeButton(row, theme.theme_id)

            const controllers = document.createElement('div')
            controllers.style.right = '0px'
            controllers.appendChild(this.createUpdateButton(row))
            this.addCell(row, controllers, false, 'text-center')
        }

    }

    addCell(row, content, id = false, position='text-start') {
        let cell = row.insertCell()
        cell.classList.add('align-middle')
        cell.classList.add(position)
        if (id != false) {
            cell.id = `theme-id-${id}`
        }
        if (typeof content === 'object') cell.appendChild(content)
        else cell.innerHTML = content
    }

    createUpdateButton(row) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'table-controller')
        btn.style.color = '#228B22'
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Обновить прогресс по теме')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-theme-progress-update')
        btn.innerHTML = '<i class="fa-solid fa-pen fa-lg"></i>'
        btn.onclick = () => {
            const form = new UpdateThemeProgressForm(this, row)
            form.fillUpdateThemeProgressForm()
        }

        return btn
    }

    loadStudentProgress(examId) {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        console.log(`Запрос на сервер для получения списка пройденных учеником тем по профилю ${this.examsTitles[examId]}`)

        fetch(`/api/students/${this.studentId}/progress/${examId}/`, {
            method: 'GET',
            headers: {
                'My-Tutor-Auth-Token': token
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(`Заполнение в таблице прогресса пройденных тем по профилю ${this.examsTitles[examId]}`)
            this.fillStudentProgress(data)
        })
        .catch(error => {
            console.error(error)
        })
    }

    fillStudentProgress(themes) {
        themes.forEach(theme => {
            this.updateRow(theme)
        })
    }

    updateRow(theme) {
        const row = document.getElementById(`theme-id-${theme.theme_id}`).parentNode
        this.addStatusIcon(row, theme.status, theme.theme_id)
        row.cells[5].textContent = theme.date
    }

    addStatusIcon(row, status, themeId) {
        row.cells[4].innerHTML = ""
        const button = document.createElement('button')
        if (status == "COMPLETED" | status == "Изучено") {
            button.classList.add('theme-status', 'theme-done')
            button.title = 'Тема изучена'
            button.innerHTML = '<i class="fa-solid fa-check"></i>'
            this.addShowThemeButton(row, themeId)
        }
        if (status == "IN PROGRESS" | status == "В процессе") {
            button.classList.add('theme-status', 'theme-process')
            button.title = 'Тема изучается'
            button.innerHTML = '<i class="fa-solid fa-hourglass"></i>'
            this.addShowThemeButton(row, themeId)
        }
        if (status == "PLANNED" | status == "Запланировано") {
            button.classList.add('theme-status', 'theme-planned')
            button.title = 'Запланирован первый урок по теме'
            button.innerHTML = '<i class="fa-regular fa-clock"></i>'
        }
        if (status == "NOT STUDIED" | status == "Не изучалось") {
            button.classList.add('theme-status', 'theme-undone')
            button.title = 'Тема не изучалась'
            button.innerHTML = '<i class="fa-solid fa-xmark"></i>'
        }
        row.cells[4].appendChild(button)
    }

    addShowThemeButton(row, themeId) {
        row.cells[0].innerHTML = ""
        const link = document.createElement('a')
        link.href = `/theme/${themeId}`

        const button = document.createElement('button')
        button.classList.add('theme-enter-button')
        button.title = 'Просмотреть тему'
        button.innerHTML = '<i class="fa-solid fa-eye"></i>'

        link.appendChild(button)
        row.cells[0].appendChild(link)
    }
}

class UpdateThemeProgressForm {
    constructor(controller, updateRow) {
        this.controller = controller
        this.updateRow = updateRow
        this.themeId = null

        this.inputStudentId = document.getElementById("theme-progress-update-form-student-id")
        this.inputStudentName = document.getElementById("theme-progress-update-form-name")
        this.inputTaskNumber = document.getElementById("theme-progress-update-form-task-number")
        this.inputThemeTitle = document.getElementById("theme-progress-update-form-title")
        this.inputThemeDescr = document.getElementById("theme-progress-update-form-descr")
        this.inputThemeStatus = document.getElementById("theme-progress-update-form-status")
        this.inputThemeDate = document.getElementById("theme-progress-update-form-date")

        this.flashMsg = document.getElementById('theme-progress-update-form-flash-msg')

        this.btnUpdateThemeProgress = document.getElementById('theme-progress-update-form-button')
        this.btnUpdateThemeProgress.onclick = () => {
            this.updateThemeProgress()
        }
    }

    fillUpdateThemeProgressForm() {
        console.log('Заполнение формы изменения прогресса студента по теме')
        this.inputStudentName.value = this.controller.selectStudent.options[this.controller.selectStudent.selectedIndex].text
        this.inputStudentId.value = this.controller.studentId
        this.inputTaskNumber.value = this.updateRow.childNodes[0].innerText
        this.inputThemeTitle.value = this.updateRow.childNodes[1].innerText
        this.inputThemeDescr.value = this.updateRow.childNodes[2].innerText
        const statusButton = this.updateRow.childNodes[3].childNodes[0]
        if (statusButton.classList.contains('theme-planned')) {
            this.inputThemeStatus.value = '1'
        }
        if (statusButton.classList.contains('theme-done')) {
            this.inputThemeStatus.value = '2'
        }
        if (statusButton.classList.contains('theme-process')) {
            this.inputThemeStatus.value = '3'
        }
        if (statusButton.classList.contains('theme-undone')) {
            this.inputThemeStatus.value = '0'
        }
        this.inputThemeDate.value = this.convertDate(this.updateRow.childNodes[4].innerText)
        this.flashMsg.innerHTML = ''
    }

    convertDate(dateStr) {
        let dateParts = dateStr.split(".")
        return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
    }

    updateThemeProgress() {
        const newThemeProgress = {
            themeId: this.updateRow.childNodes[0].id.split('-')[2],
            studentId: this.inputStudentId.value,
            status: this.inputThemeStatus.value === "0" ? null : this.inputThemeStatus.value,
            date: this.inputThemeDate.value || null
        }

        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        if (this.inputThemeDate.value) {
            let errorDate = this.checkValidDate(this.inputThemeDate.value)

            if (errorDate) {
                flashMsg(errorDate, this.flashMsg, 'wrong')
                return
            }
        }

        this.flashMsg.innerHTML = ''

        fetch(`/api/themes/${newThemeProgress.themeId}/student-progress/${newThemeProgress.studentId}/`, {
            method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'My-Tutor-Auth-Token': token
                },
                body: JSON.stringify(newThemeProgress),
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
        .then(themeProgress => {
            if (themeProgress.hasOwnProperty('status')) {
                console.log(themeProgress.message)
                this.updateRow.childNodes[4].innerText = themeProgress.date
                this.controller.addStatusIcon(this.updateRow, themeProgress.status)
                flashMsg(themeProgress.message, this.flashMsg, 'success')
            } else {
                flashMsg(themeProgress.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    checkValidDate(dateStr) {
        const inputDate = new Date(dateStr)
        const currentDate = new Date()

        if (inputDate > currentDate) {
            return "Дата не может быть из будущего"
        }

        return false
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    const currentTutorMenuItem = document.getElementById('menu-list-progress')
    currentTutorMenuItem.classList.add('list-menu-item')
    currentTutorMenuItem.classList.add('active-menu-item')

    const controller = new Controller()
    const studentSelectField = document.getElementById('student-select-field')
    const title = document.getElementById('title')
    const hrTitle = document.getElementById('hr-title')
    const buttonsField = document.getElementById('buttons-field')
    const welcome = document.getElementById('text-start')
    const progressTable = document.getElementById('progress-table')

    const btnOge = document.getElementById('btn-show-oge')
    const btnEge = document.getElementById('btn-show-ege')
    const btnProgramming = document.getElementById('btn-show-programming')

    if (userRole == "Студент") {
        controller.getMyStudentId(userId)
        welcome.classList.remove('hidden-field')
        buttonsField.classList.remove('hidden-field')
    }

    if (userRole == "Преподаватель") {
        studentSelectField.classList.remove('hidden-field')
        controller.loadStudents()
    }

    btnOge.onclick = () => {
        controller.hideField(welcome)

        if (userRole == "Студент") {
            title.innerText = 'Мой прогресс - ОГЭ'
        } else {
            title.innerText = 'Прогресс студента - ОГЭ'
        }

        title.classList.remove('hidden-field')
        hrTitle.classList.remove('hidden-field')
        progressTable.classList.remove('hidden-field')
        controller.loadThemes(2).then(() => {
            controller.loadStudentProgress(2);
        }).catch(error => {
            console.error("Ошибка при загрузке тем или прогресса студента", error);
        });
    };
    btnEge.onclick = () => {
        controller.hideField(welcome)

        if (userRole == "Студент") {
            title.innerText = 'Мой прогресс - ЕГЭ'
        } else {
            title.innerText = 'Прогресс студента - ЕГЭ'
        }

        title.classList.remove('hidden-field')
        hrTitle.classList.remove('hidden-field')
        progressTable.classList.remove('hidden-field')
        controller.loadThemes(1).then(() => {
            controller.loadStudentProgress(1);
        }).catch(error => {
            console.error("Ошибка при загрузке тем или прогресса студента", error);
        });
    };
    btnProgramming.onclick = () => {
        return
        controller.hideField(welcome)

        if (userRole == "Студент") {
            title.innerText = 'Мой прогресс - Программирование'
        } else {
            title.innerText = 'Прогресс студента - Программирование'
        }

        title.classList.remove('hidden-field')
        hrTitle.classList.remove('hidden-field')
        progressTable.classList.remove('hidden-field')
        controller.loadThemes(3).then(() => {
            controller.loadStudentProgress(3);
        }).catch(error => {
            console.error("Ошибка при загрузке тем или прогресса студента", error);
        });
    };
})
