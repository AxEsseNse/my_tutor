class AddLessonForm {
    constructor() {
        this.tutors = []
        this.students = []
        this.themes = []
        this.lessonDate = ''

        this.tutorsSelect = document.getElementById('lesson-add-form-tutor')
        this.studentsSelect = document.getElementById('lesson-add-form-student')
        this.themesSelect = document.getElementById('lesson-add-form-theme')

        this.inputDate = document.getElementById('lesson-add-form-date')
        this.inputHour = document.getElementById('lesson-add-form-hour')
        this.inputMinute = document.getElementById('lesson-add-form-minute')

        this.flashMsg = document.getElementById('lesson-add-form-flash-msg')

        this.btnAddLesson = document.getElementById('lesson-add-form-button')
        this.btnAddLesson.onclick = () => {
            this.addLesson()
        }
    }

    loadInfo() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        return fetch('/api/lessons/info/', {
        method: 'GET',
        headers: {
            'My-Tutor-Auth-Token': token
            },
        })
        .then(response => response.json())
        .then(info => {
            this.tutors = info.tutor
            this.students = info.student
            this.themes = info.theme
        })
        .catch(error => {
            console.error(error)
        })
    }

    setFormSelectOptions() {
        this.loadInfo()
        .then(() => {
            this.setSelectOptions(this.tutors,  this.tutorsSelect)
            this.setSelectOptions(this.students,  this.studentsSelect)
            this.setSelectOptions(this.themes,  this.themesSelect)
        })
    }

    setSelectOptions(data, selectDiv) {
        for (const item of data) {
            const option = document.createElement('option')
            option.value = item.id
            option.innerText = item.name
            selectDiv.append(option)
        }
        selectDiv.options[0].selected = true
    }

    composeDateTimeString() {
        const date = this.inputDate.value
        const dateParts = date.split('-')

        const hour = this.inputHour.value.padStart(2, '0')
        const minute = this.inputMinute.value.padStart(2, '0')

        const dateTimeString = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]} ${hour}:${minute}`;
        return dateTimeString
    }

    addLesson() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        if (this.tutorsSelect.value == '') {
            return
        }
        if (this.studentsSelect.value == '') {
            return
        }
        if (this.themesSelect.value == '') {
            return
        }

        const newLesson = {
            lessonTutorId: this.tutorsSelect.value,
            lessonStudentId: this.studentsSelect.value,
            lessonThemeId: this.themesSelect.value,
            lessonDate: this.composeDateTimeString()
        }

        fetch('/api/lessons/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'My-Tutor-Auth-Token': token
            },
            body: JSON.stringify(newLesson),
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
            if (lesson.hasOwnProperty('tutor')) {
                console.log(lesson.message)

                flashMsg(
                    `Урок "${lesson.tutor}" с "${lesson.student}" по теме "${lesson.theme_title}" создан на "${lesson.date}"`,
                    this.flashMsg,
                    'success',
                )
            } else {
                flashMsg(lesson.message, this.flashMsg, 'wrong')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    const addLesson = new AddLessonForm()
    addLesson.setFormSelectOptions()
})
