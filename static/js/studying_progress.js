const iconLib = {
    login: "fa-solid fa-user",
    firstName: "fa-solid fa-user",
    secondName: "fa-solid fa-user",
    gender: "fa-solid fa-venus-mars",
    birthday: "fa-solid fa-calendar-days",
    lessonPrice: "fa-solid fa-sack-dollar",
    discord: "fa-brands fa-discord",
    phone: "fa-solid fa-phone",
    telegram: "fa-brands fa-telegram",
    whatsapp: "fa-brands fa-whatsapp"
}
const monthNumber = {
    'января': '01',
    'февраля': '02',
    'марта': '03',
    'апреля': '04',
    'мая': '05',
    'июня': '06',
    'июля': '07',
    'августа': '08',
    'сентября': '09',
    'октября': '10',
    'ноября': '11',
    'декабря': '12'
  };

function convertDate(dateString) {
  const parts = dateString.replace(' года', '').split(' ');
  const day = parts[0].padStart(2, '0');
  const month = monthNumber[parts[1]];
  const year = parts[2];

  return `${year}-${month}-${day}`;
}

function fillAddParentForm() {
    console.log('Подготовка формы добавления родителя')
    document.getElementById('parent-add-form-login').value = document.getElementById('student-login').textContent.trim()
    document.getElementById('parent-add-form-status').value = "Мать"
    document.getElementById('parent-add-form-first-name').value = ''
    document.getElementById('parent-add-form-second-name').value = ''
    document.getElementById('parent-add-form-phone').value = ''
    document.getElementById('parent-add-form-telegram').value = ''
    document.getElementById('parent-add-form-whatsapp').value = ''
    document.getElementById('parent-add-form-flash-msg').innerHTML = ''
}

function fillEditImageForm() {
    console.log('Заполнение формы для изменения аватара студента')
    document.getElementById('student-edit-image-form-login').value = document.getElementById('student-login').textContent.trim()

    document.getElementById('student-modal-image-type').innerHTML = "Ваше текущее изображение"
    const studentImage = document.getElementById('student-img');
    const studentImagePath = studentImage.getAttribute('src');
    const previewImage = document.getElementById('preview-image');
    previewImage.src = studentImagePath;
    previewImage.style.display = 'block';
    document.getElementById('student-edit-image-form-flash-msg').innerHTML = ''
}

function fillEditPrimaryInfoForm() {
    console.log('Заполнение формы для изменения личной информации студента')
    document.getElementById('student-edit-primary-info-form-login').value = document.getElementById('student-login').textContent.trim()

    document.getElementById('student-edit-primary-info-form-first-name').value = document.getElementById('student-first-name').textContent.trim()
    document.getElementById('student-edit-primary-info-form-second-name').value = document.getElementById('student-second-name').textContent.trim()
    document.getElementById('student-edit-primary-info-form-gender').value = document.getElementById('student-gender').textContent.trim()
    document.getElementById('student-edit-primary-info-form-birthday').value = convertDate(document.getElementById('student-birthday').textContent.trim())
    document.getElementById('student-edit-primary-info-form-flash-msg').innerHTML = ''
}

function fillEditContactInfoForm() {
    console.log('Заполнение формы для изменения контактных данных студента')
    document.getElementById('student-edit-contact-info-form-login').value = document.getElementById('student-login').textContent.trim()

    document.getElementById('student-edit-contact-info-form-discord').value = document.getElementById('student-discord').textContent.trim()
    document.getElementById('student-edit-contact-info-form-phone').value = document.getElementById('student-phone').textContent.trim()
    document.getElementById('student-edit-contact-info-form-telegram').value = document.getElementById('student-telegram').textContent.trim()
    document.getElementById('student-edit-contact-info-form-whatsapp').value = document.getElementById('student-whatsapp').textContent.trim()
    document.getElementById('student-edit-contact-info-form-flash-msg').innerHTML = ''
}

function fillStudentDataDiv(divId, data, iconTag=null) {
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
studentId = 1

class ProgressTable {
    constructor() {
        this.table = document.getElementById('progress-table')
        this.examsTitles = {
            1: "ЕГЭ",
            2: "ОГЭ",
            3: "Программирование"
        }
        this.rusStatus = {
            "NOT STUDIED": 'Не изучалась',
            "COMPLETED": 'Изучена',
            "IN PROGRESS": 'В процессе'
        }
        this.statusIcon = {
            "COMPLETED": '<i class="fa-solid fa-star" style="color: #56FF3D;"></i>',
            "IN PROGRESS": '<i class="fa-regular fa-star" style="color: #56FF3D;"></i>'
        }
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
        console.log(themes)
        themes.forEach(theme => {
            const row = body.insertRow()
            this.fillRow(row, theme)
        })
    }

    fillRow(row, theme) {
        this.addCell(row, '', theme.theme_id)
        this.addCell(row, theme.exam_task_number)
        this.addCell(row, theme.title)
        this.addCell(row, theme.descr)
        this.addCell(row, 'НЕ ПРОЙДЕНА')
        this.addCell(row, '')
    }

    addCell(row, content, id = false) {
        let cell = row.insertCell()
        cell.classList.add('align-middle')
        if (id != false) {
            cell.id = `theme-id-${id}`
        }
        if (typeof content === 'object') cell.appendChild(content)
        else cell.innerHTML = content
    }

    loadStudentProgress(examId) {
        let token = getCookie('My-Tutor-Auth-Token')

        if (token == undefined) {
            return
        }

        console.log(`Запрос на сервер для получения списка пройденных учеником тем по профилю ${this.examsTitles[examId]}`)
        fetch(`/api/students/${studentId}/progress/${examId}/`, {
            method: 'GET',
            headers: {
                'My-Tutor-Auth-Token': token
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(`Заполнение в таблице прогресса пройденных тем по профилю ${this.examsTitles[examId]}`)
            console.log(data)
            this.fillStudentProgress(data)
        })
        .catch(error => {
            console.error(error)
        })
    }

    fillStudentProgress(themes) {
        console.log(themes)
        themes.forEach(theme => {
            console.log(theme)
            this.updateRow(theme)
        })
    }

    updateRow(theme) {
        const row = document.getElementById(`theme-id-${theme.theme_id}`).parentNode
        if (theme.status != 'NOT STUDIED') {
            row.cells[0].innerHTML = this.statusIcon[theme.status]
        }
        row.cells[4].textContent = this.rusStatus[theme.status]
        row.cells[5].textContent = theme.date
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    const progressTable = new ProgressTable()
    const welcome = document.getElementById('text-start')
    const title = document.getElementById('title')
    const table = document.getElementById('progress-table')
    const btnOge = document.getElementById('btn-show-oge')
    const btnEge = document.getElementById('btn-show-ege')
    const btnProgramming = document.getElementById('btn-show-programming')
    btnOge.onclick = () => {
        welcome.style.display = 'none'
        title.innerText = 'Мой прогресс - ОГЭ'
        document.querySelectorAll('.hidden-content').forEach(function(element) {
            element.style.display = 'block';
        });
        progressTable.loadThemes(2).then(() => {
            progressTable.loadStudentProgress(2);
        }).catch(error => {
            console.error("Ошибка при загрузке тем или прогресса студента", error);
        });
    };
    btnEge.onclick = () => {
        welcome.style.display = 'none'
        title.innerText = 'Мой прогресс - ЕГЭ'
        document.querySelectorAll('.hidden-content').forEach(function(element) {
            element.style.display = 'block';
        });
        progressTable.loadThemes(1).then(() => {
            progressTable.loadStudentProgress(1);
        }).catch(error => {
            console.error("Ошибка при загрузке тем или прогресса студента", error);
        });
    };
    btnProgramming.onclick = () => {
        return
        welcome.style.display = 'none'
        title.innerText = 'Мой прогресс - Программирование'
        document.querySelectorAll('.hidden-content').forEach(function(element) {
            element.style.display = 'block';
        });
        progressTable.loadThemes(3).then(() => {
            progressTable.loadStudentProgress(3);
        }).catch(error => {
            console.error("Ошибка при загрузке тем или прогресса студента", error);
        });
    };
})
