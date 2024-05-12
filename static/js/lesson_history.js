class LessonsTable {
    constructor() {
        this.lessons = null

        this.table = document.getElementById('lessons-table')
        this.selectStudent = document.getElementById('select-student')
    }

    loadLessons() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch('/api/lessons/', {
            method: 'GET',
            headers: {
            'My-tutor-Auth-Token': token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (userRole == "Преподаватель") {
                this.setStudentsSelectOptions(data)
                const self = this
                this.selectStudent.addEventListener('change', function() {
                    self.chooseStudent(this.value)
                })
            }
            this.lessons = data
            this.fillTable('Все студенты')
            console.log(this.lessons)
        })
        .catch(error => {
            console.error(error)
        })
    }

    setStudentsSelectOptions(lessons) {
        const students = lessons.map(student => student.student).sort()
        this.selectStudent.innerHTML = ""

        const optionAllStudents = document.createElement('option')
        optionAllStudents.value = 'Все студенты'
        optionAllStudents.selected = true
        optionAllStudents.innerText = 'Все студенты'
        this.selectStudent.append(optionAllStudents)

        const addedStudents = new Set()
        students.forEach(student => {
            if (!addedStudents.has(student)) {
                addedStudents.add(student)
                const option = document.createElement('option')
                option.value = student
                option.textContent = student
                this.selectStudent.appendChild(option)
            }
        })
    }

    chooseStudent(name) {
        console.log(name)
        this.fillTable(name)
    }

    fillTable(student) {
        const body = this.table.tBodies[0]
        body.innerHTML = ''

        if (student == 'Все студенты') {
            this.lessons.forEach(lesson => {
                const row = body.insertRow()
                this.fillRow(row, lesson)
            })
        } else {
            this.lessons.forEach(lesson => {
                if (lesson.student == student) {
                    const row = body.insertRow()
                    this.fillRow(row, lesson)
                }
            })
        }
    }

    fillRow(row, lesson) {
        if (lesson.hasOwnProperty('tutor')) {
            this.addJoinLessonCell(row, lesson.status, lesson.lesson_id)
            this.addCell(row, lesson.date, 'text-center')
            this.addCell(row, lesson.tutor)
            this.addCell(row, lesson.exam)
            this.addCell(row, lesson.exam_task_number)
            this.addCell(row, lesson.theme_title)

            if (lesson.status !== 'CANCELED') {
                this.addPayStatus(row, lesson.pay_status, lesson.lesson_id, 'student')
            } else {
                this.addCell(row, '')
            }
        } else {
            this.addJoinLessonCell(row, lesson.status, lesson.lesson_id)
            this.addCell(row, lesson.date, 'text-center')
            this.addCell(row, lesson.student)
            this.addCell(row, lesson.exam)
            this.addCell(row, lesson.exam_task_number)
            this.addCell(row, lesson.theme_title)
            this.addCell(row, lesson.note)

            if (lesson.status !== 'CANCELED') {
                this.addPayStatus(row, lesson.pay_status, lesson.lesson_id, 'tutor')
            } else {
                this.addCell(row, '')
            }

            const controllers = document.createElement('div')
            controllers.classList.add('text-center')
            controllers.style.right = '0px'
            controllers.appendChild(this.createUpdateNoteLessonButton(row))

            if (lesson.status !== 'FINISHED' && lesson.status !== 'CANCELED') {
                controllers.appendChild(this.createRescheduleLessonButton(row))
                controllers.appendChild(this.createCancelLessonButton(row))
            }

            this.addControllers(row, controllers)
        }
    }

    addCell(row, content, textPosition='text-start') {
        let cell = row.insertCell()
        cell.classList.add('align-middle')
        cell.classList.add(textPosition)
        cell.innerHTML = content
    }

    addJoinLessonCell(row, status, lessonId) {
        let cell = row.insertCell()
        cell.classList.add('align-middle')
        cell.classList.add('text-center')
        cell.setAttribute('lessonId', lessonId)

        if (status == 'FINISHED' | status == 'CANCELED') {
            cell.innerText = ''
            return
        }

        const link = document.createElement('a')
        link.classList.add('join-lesson-link')
        const button = document.createElement('button')
        button.classList.add('lesson-enter-mini-button', 'lesson-enter-available')

//        if (status !== 'FINISHED' && status !== 'CANCELED') {
        //button.classList.add('lesson-enter-available')
        button.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i>'
        button.title = 'Присоединиться'
        link.href = `/lesson/${lessonId}`
//        } else {
//            button.classList.add('lesson-enter-not-available')
//            button.title = 'Урок не доступен'
//            button.innerHTML = '<i class="fa-solid fa-ban"></i>'
//            button.disabled = true
//        }

        link.appendChild(button)
        cell.appendChild(link)
    }

    addPayStatus(row, isPaid, lessonId, role) {
        let cell = row.insertCell()
        cell.classList.add('align-middle')
        cell.classList.add('text-center')
        const button = document.createElement('button')
        button.classList.add('paid-status-button')

        if (role == 'tutor') {
            button.title = 'Изменить статус оплаты'
        }

        if (isPaid) {
            button.innerHTML = '<i class="fa-solid fa-check"></i>'
            button.classList.add('lesson-paid')
            if (role == 'student') {
                button.title = 'Занятие оплачено'
            }
        } else {
            button.innerHTML = '<i class="fa-solid fa-xmark"></i>'
            button.classList.add('lesson-not-paid')
            if (role == 'student') {
                button.title = 'Занятие не оплачено'
            }
        }

        if (userRole == "Преподаватель") {
            button.onclick = () => {
                this.changePaidStatus(row, lessonId, button)
            }
        }
        cell.appendChild(button)
    }

    addControllers(row, controllers) {
        let cell = row.insertCell()
        cell.classList.add('align-middle')
        cell.classList.add('text-start')
        cell.appendChild(controllers)
    }

    changePaidStatus(row, lessonId, button) {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        const ChangePaidStatusData = {
            lessonId: lessonId,
            paidRequest: true
        }

        fetch(`/api/lessons/${lessonId}/`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'My-tutor-Auth-Token': token,
            },
            body: JSON.stringify(ChangePaidStatusData)
        })
        .then(response => response.json())
        .then(data => {
            button.innerHTML = ''
            const currentLesson = this.lessons.find(obj => obj.lesson_id == row.childNodes[0].getAttribute('lessonId'))
            currentLesson.pay_status = data.pay_status

            if (data.pay_status) {
                button.innerHTML = '<i class="fa-solid fa-check"></i>'
                button.classList.remove('lesson-not-paid')
                button.classList.add('lesson-paid')
            } else {
                button.innerHTML = '<i class="fa-solid fa-xmark"></i>'
                button.classList.add('lesson-paid')
                button.classList.remove('lesson-paid')
                button.classList.add('lesson-not-paid')
            }
            console.log(data.message)
        })
        .catch(error => {
            console.error(error)
        })
    }

    createUpdateNoteLessonButton(row) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'btn-sm', 'btn-success')
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Изменить заметку')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-lesson-update-note')
        btn.innerHTML = '<i class="fa-regular fa-note-sticky"></i>'
        btn.onclick = () => {
            const form = new UpdateNoteLessonForm(row)
            form.fillUpdateNoteForm()
        }

        return btn
    }

    createRescheduleLessonButton(row) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'btn-sm', 'btn-info')
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Перенести занятие')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-lesson-reschedule')
        btn.innerHTML = '<i class="fa-regular fa-calendar"></i>'
        btn.onclick = () => {
            const form = new RescheduleLessonForm(row)
            form.fillRescheduleForm()
        }

        return btn
    }

    createCancelLessonButton(row) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'btn-sm', 'btn-danger')
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Отменить занятие')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-lesson-cancel')
        btn.innerHTML = '<i class="fa-solid fa-ban"></i>'
        btn.onclick = () => {
            const form = new CancelLessonForm(row)
            form.fillCancelForm()
        }

        return btn
    }
}

class UpdateNoteLessonForm {
    constructor(updateRow) {
        this.updateRow = updateRow
        this.setDatetimeConsts(this.updateRow.childNodes[1].innerText)
        this.tutor = document.getElementById('header-user-name').innerText

        this.inputLessonId = document.getElementById('lesson-update-note-form-lesson-id')
        this.inputTutor = document.getElementById('lesson-update-note-form-tutor')
        this.inputStudent = document.getElementById('lesson-update-note-form-student')
        this.inputDate = document.getElementById('lesson-update-note-form-date')
        this.inputHour = document.getElementById('lesson-update-note-form-hour')
        this.inputMinute = document.getElementById('lesson-update-note-form-minute')
        this.inputNote = document.getElementById('lesson-update-note-form-note')

        this.flashMsg = document.getElementById('lesson-update-note-form-flash-msg')

        this.btnUpdateNoteLesson = document.getElementById('lesson-update-note-form-button')
        this.btnUpdateNoteLesson.onclick = () => {
            this.updateNoteLesson()
        }
    }

    setDatetimeConsts(dateTimeStr) {
        const dateTimeParts = dateTimeStr.split(' ')
        const dateParts = dateTimeParts[0].split('.')
        const timeParts = dateTimeParts[1].split(':')
        this.formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
        this.hours = timeParts[0]
        this.minutes = timeParts[1]
    }

    fillUpdateNoteForm() {
        this.inputLessonId.value = this.updateRow.childNodes[0].getAttribute('lessonId')
        this.inputTutor.value = this.tutor
        this.inputStudent.value = this.updateRow.childNodes[2].innerText
        this.inputDate.value = this.formattedDate
        this.inputHour.value = this.hours
        this.inputMinute.value = this.minutes
        this.inputNote.value = this.updateRow.childNodes[6].innerText
        this.flashMsg.innerText = ''
    }

    updateNoteLesson() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        const lessonData = {
            lessonId: this.inputLessonId.value,
            note: this.inputNote.value
        }

        console.log(lessonData)

        fetch(`/api/lessons/${this.inputLessonId.value}/`, {
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
        .then(lesson => {
            console.log(lesson)
            if (lesson.hasOwnProperty('note')) {
                this.updateRow.childNodes[6].innerText = lesson.note
                console.log(lesson.message)
                flashMsg(lesson.message, this.flashMsg, 'success')
            } else {
                flashMsg(lesson.detail, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class RescheduleLessonForm {
    constructor(updateRow) {
        this.updateRow = updateRow
        this.setDatetimeConsts(this.updateRow.childNodes[1].innerText)
        this.tutor = document.getElementById('header-user-name').innerText

        this.inputLessonId = document.getElementById('lesson-reschedule-form-lesson-id')
        this.inputTutor = document.getElementById('lesson-reschedule-form-tutor')
        this.inputStudent = document.getElementById('lesson-reschedule-form-student')
        this.inputDate = document.getElementById('lesson-reschedule-form-date')
        this.inputHour = document.getElementById('lesson-reschedule-form-hour')
        this.inputMinute = document.getElementById('lesson-reschedule-form-minute')

        this.flashMsg = document.getElementById('lesson-reschedule-form-flash-msg')

        this.btnRescheduleLesson = document.getElementById('lesson-reschedule-form-button')
        this.btnRescheduleLesson.onclick = () => {
            this.rescheduleLesson()
        }
    }

    setDatetimeConsts(dateTimeStr) {
        const dateTimeParts = dateTimeStr.split(' ')
        const dateParts = dateTimeParts[0].split('.')
        const timeParts = dateTimeParts[1].split(':')
        this.formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
        this.hours = timeParts[0]
        this.minutes = timeParts[1]
    }

    fillRescheduleForm() {
        this.inputLessonId.value = this.updateRow.childNodes[0].getAttribute('lessonId')
        this.inputTutor.value = this.tutor
        this.inputStudent.value = this.updateRow.childNodes[2].innerText
        this.inputDate.value = this.formattedDate
        this.inputHour.value = this.hours
        this.inputMinute.value = this.minutes
        this.flashMsg.innerText = ''
    }

    createMoscowDate(year, month, day, hour, minute) {

        return moment.tz([year, month - 1, day, hour, minute], "Europe/Moscow");
    }

    isFutureDateEnough(dateTimeMoscow) {
        const nowMoscow = moment.tz("Europe/Moscow");
        const tenMinutesLater = nowMoscow.clone().add(9, 'minutes');

        return dateTimeMoscow.isAfter(tenMinutesLater);
    }

    rescheduleLesson() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        const dateTime = new Date(this.inputDate.value)
        const year = dateTime.getFullYear()
        const month = dateTime.getMonth() + 1
        const day = dateTime.getDate()
        const hour = this.inputHour.value
        const minute = this.inputMinute.value

        const dateTimeMoscow = this.createMoscowDate(year, month, day, hour, minute)

        if (this.isFutureDateEnough(dateTimeMoscow)) {
            this.flashMsg.innerText = ''
            console.log("Дата урока установлена корректно")
        } else {
            flashMsg('Дата урока должна быть больше текущей минимум на 10 минут', this.flashMsg, 'wrong')
            console.log('Дата урока должна быть больше текущей минимум на 10 минут')
            return
        }

        const lessonData = {
            lessonId: this.inputLessonId.value,
            newDate: dateTimeMoscow.format('DD.MM.YYYY HH:mm')
        }

        console.log(lessonData)

        fetch(`/api/lessons/${this.inputLessonId.value}/`, {
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
        .then(lesson => {
            console.log(lesson)
            if (lesson.hasOwnProperty('date')) {
                this.updateRow.childNodes[1].innerText = lesson.date
                console.log(lesson.message)
                flashMsg(lesson.message, this.flashMsg, 'success')
            } else {
                flashMsg(lesson.detail, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

class CancelLessonForm {
    constructor(updateRow) {
        this.updateRow = updateRow
        this.setDatetimeConsts(this.updateRow.childNodes[1].innerText)
        this.tutor = document.getElementById('header-user-name').innerText

        this.inputLessonId = document.getElementById('lesson-cancel-form-lesson-id')
        this.inputTutor = document.getElementById('lesson-cancel-form-tutor')
        this.inputStudent = document.getElementById('lesson-cancel-form-student')
        this.inputDate = document.getElementById('lesson-cancel-form-date')
        this.inputHour = document.getElementById('lesson-cancel-form-hour')
        this.inputMinute = document.getElementById('lesson-cancel-form-minute')

        this.flashMsg = document.getElementById('lesson-cancel-form-flash-msg')

        this.btnCancelLesson = document.getElementById('lesson-cancel-form-button')
        this.btnCancelLesson.onclick = () => {
            this.cancelLesson()
        }
    }

    setDatetimeConsts(dateTimeStr) {
        const dateTimeParts = dateTimeStr.split(' ')
        const dateParts = dateTimeParts[0].split('.')
        const timeParts = dateTimeParts[1].split(':')
        this.formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
        this.hours = timeParts[0]
        this.minutes = timeParts[1]
    }

    fillCancelForm() {
        this.inputLessonId.value = this.updateRow.childNodes[0].getAttribute('lessonId')
        this.inputTutor.value = this.tutor
        this.inputStudent.value = this.updateRow.childNodes[2].innerText
        this.inputDate.value = this.formattedDate
        this.inputHour.value = this.hours
        this.inputMinute.value = this.minutes
        this.flashMsg.innerText = ''
    }

    cancelLesson() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        const lessonData = {
            lessonId: this.inputLessonId.value,
            cancel: true
        }

        console.log(lessonData)

        fetch(`/api/lessons/${this.inputLessonId.value}/`, {
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
        .then(lesson => {
            console.log(lesson)
            if (lesson.hasOwnProperty('status')) {
                const controllers = this.updateRow.childNodes[8].children[0].children
                controllers[2].parentNode.removeChild(controllers[2])
                controllers[1].parentNode.removeChild(controllers[1])
                this.updateRow.childNodes[7].innerText = ''
                console.log(lesson.message)
                flashMsg(lesson.message, this.flashMsg, 'success')
            } else {
                flashMsg(lesson.detail, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    const currentTutorMenuItem = document.getElementById('menu-list-lesson-history')
    currentTutorMenuItem.classList.add('list-menu-item')
    currentTutorMenuItem.classList.add('active-menu-item')

    const lessonsTable = new LessonsTable()
    lessonsTable.loadLessons()
})
