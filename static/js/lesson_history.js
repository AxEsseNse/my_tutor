class LessonsTable {
    constructor() {
        this.table = document.getElementById('lessons-table')
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
            this.fillTable(data)
        })
        .catch(error => {
            console.error(error)
        })
    }

    fillTable(lessons) {
        const body = this.table.tBodies[0]
        body.innerHTML = ''

        lessons.forEach(lesson => {
            const row = body.insertRow()
            this.fillRow(row, lesson)
        })
    }

    fillRow(row, lesson) {
        if (lesson.hasOwnProperty('tutor')) {
            this.addCell(row, lesson.date, true)
            this.addCell(row, lesson.tutor)
            this.addCell(row, lesson.exam)
            this.addCell(row, lesson.exam_task_number)
            this.addCell(row, lesson.theme_title)
            this.addCell(row, lesson.pay_status)
        } else {
            this.addCell(row, lesson.date, true)
            this.addCell(row, lesson.student)
            this.addCell(row, lesson.exam)
            this.addCell(row, lesson.exam_task_number)
            this.addCell(row, lesson.theme_title)
            this.addCell(row, lesson.note)
        }
    }

    addCell(row, content, textСenter=false) {
        let cell = row.insertCell()
        cell.classList.add('align-middle')
        if (textСenter) {
            cell.classList.add('text-center')
        }
        cell.innerHTML = content
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    const lessonsTable = new LessonsTable()
    lessonsTable.loadLessons()
})
