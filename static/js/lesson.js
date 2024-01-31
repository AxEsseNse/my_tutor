function fillLessonMenuItem(divId, data, iconTag=null) {
    let fillDiv = document.getElementById(divId)
    fillDiv.innerHTML = "";

    if (iconTag!==null) {
        let iconElement = document.createElement("i")
        iconElement.className = iconLib[iconTag]

        fillDiv.appendChild(iconElement)
        fillDiv.innerHTML += data;
    } else {
        fillDiv.innerHTML += data;
    }
}

class LessonMenu {
    constructor() {
        this.menu = document.getElementById('lesson-list')
        this.lessonId = 6
    }

    loadLesson() {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        fetch(`/api/lesson/${this.lessonId}/`, {
            method: 'GET',
            headers: {
            'My-tutor-Auth-Token': token
            }
        })
        .then(response => response.json())
        .then(material => {
            this.fillLessonMenu(material)
        })
        .catch(error => {
            console.error(error)
        })
    }

    fillLessonMenu(material) {
        console.log(material)

        students.forEach(student => {
            const row = body.insertRow()
            this.fillRow(row, student)
        })
    }

    fillRow(row, student) {
        const studentImage = document.createElement('img')
        studentImage.src = student.img_path
        studentImage.style.display = 'block'
        studentImage.classList.add('rounded-circle')
        studentImage.width = 50
        studentImage.height = 50
        this.addCell(row, studentImage)

        this.addCell(row, student.second_name)
        this.addCell(row, student.first_name)
        this.addCell(row, student.gender)
        this.addCell(row, student.age)
        this.addCell(row, student.lesson_price)
        this.addCell(row, student.discord)
        this.addCell(row, student.phone)
        this.addCell(row, student.telegram)
        this.addCell(row, student.whatsapp)

        const controllers = document.createElement('div')
        controllers.classList.add('text-end')
        controllers.style.right = '0px'
        controllers.appendChild(this.createDeleteButton(row))
        this.addCell(row, controllers)
    }

    addCell(row, content) {
        this.menu
        let card = document.createElement('li')
        card.innerHTML = content



        let cell = row.insertCell()
        cell.classList.add('align-middle')
        if (typeof content === 'object') {
            cell.appendChild(content)
        } else {
            cell.innerHTML = content
            cell.classList.add('small')
        }
    }

    createDeleteButton(row) {
        const btn = document.createElement('button')
        btn.classList.add('btn', 'btn-sm', 'btn-danger')
        btn.setAttribute('type', 'button')
        btn.setAttribute('title', 'Удалить профиль студента')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#modal-student-delete')
        btn.innerHTML = '<i class="fa-solid fa-trash text-dark"></i>'
        btn.onclick = () => {
            const form = new StudentFormDelete(row)
            form.fillDeleteForm()
        }

        return btn
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    const studentTable = new StudentTable()
    studentTable.loadStudents()
    const AddStudent = new AddStudentForm(studentTable)
    AddStudent.setUsersSelectOptions()
})