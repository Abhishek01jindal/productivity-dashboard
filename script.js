function openFeatures() {
    var allElems = document.querySelectorAll('.elem')
    var fullElemPage = document.querySelectorAll('.fullElem')
    var fullElemPageBackBtn = document.querySelectorAll('.fullElem .back')

    allElems.forEach(function (elem) {
        elem.addEventListener('click', function () {
            fullElemPage[elem.id].style.display = 'block'
        })
    })
    fullElemPageBackBtn.forEach(function (back) {
        back.addEventListener('click', function () {
            fullElemPage[back.id].style.display = 'none'
        })
    })
}
openFeatures();

function todoList() {
    let form = document.querySelector(" .addTask form");
    let taskInput = document.querySelector(".addTask form #task-input");
    let taskDetailsInput = document.querySelector(".addTask form textarea");
    let taskCheckbox = document.querySelector(".addTask form #check");


    var currentTask = []
    var abc = localStorage.getItem('currentTask')
    if (localStorage.getItem('currentTask')) {
        currentTask = JSON.parse(localStorage.getItem('currentTask'))
    } else {
        console.log('no data found');
    }

    function renderTask() {
        let allTask = document.querySelector('.allTask')

        let sum = ''

        currentTask.forEach(function (elem, idx) {
            sum += `<div class="task ${elem.imp ? 'important' : ''}">
 <div class="task-text"><h5> ${elem.task} <span class="${elem.imp}">imp</span></h5>
        <p class="details">${elem.details}</p>
</div>
    <button id="${idx}">Mark as completed</button>
 </div>
`

        })
        allTask.innerHTML = sum;
        localStorage.setItem('currentTask', JSON.stringify(currentTask))

        document.querySelectorAll('.task button').forEach(function (btn) {
            btn.addEventListener('click', function () {
                currentTask.splice(btn.id, 1)
                renderTask()
            })
        })
    }
    renderTask();

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        currentTask.push(
            {
                task: taskInput.value,
                details: taskDetailsInput.value,
                imp: taskCheckbox.checked
            }
        )
        renderTask()

        taskCheckbox.checked = false;
        taskInput.value = ''
        taskDetailsInput.value = ''

    })


}
todoList();

function dailyPlanner() {

    var dayPlanData = JSON.parse(localStorage.getItem('dayPlanData')) || {}
    var dayPlanner = document.querySelector('.day-planner')

    var hours = Array.from({ length: 18 }, (_, idx) => `${6 + idx}:00 - ${7 + idx}:00`)

    var wholeDaySum = ''
    hours.forEach(function (elem, idx) {
        var savedData = dayPlanData[idx] || ''
        wholeDaySum = wholeDaySum + `<div class="day-planner-time">
                    <p>${elem}</p>
                    <input id="${idx}" type="text" placeholder="......" value=${savedData}>
                </div>`
    })
    dayPlanner.innerHTML = wholeDaySum

    var dayPlannerInput = document.querySelectorAll('.day-planner input')
    dayPlannerInput.forEach(function (elem) {
        elem.addEventListener('input', function () {
            dayPlanData[elem.id] = elem.value
            localStorage.setItem('dayPlanData', JSON.stringify(dayPlanData))
        })
    })
}
dailyPlanner();

function motivation() {
    var motivationQuote = document.querySelector('.motivation-2 h1')
    var motivationAuthor = document.querySelector('.motivation-3 h2')
    async function fetchQuote() {
        let response = await fetch('https://dummyjson.com/quotes')
        let data = await response.json()
        let randomIndex = Math.floor(Math.random() * data.quotes.length)
        motivationQuote.innerHTML = data.quotes[randomIndex].quote
        motivationAuthor.innerHTML = data.quotes[randomIndex].author
    }

    fetchQuote()
}
motivation();

function pomodoroTimer() {


    let timer = document.querySelector('.pomo-timer h1')
    var startBtn = document.querySelector('.pomo-timer .start-timer')
    var pauseBtn = document.querySelector('.pomo-timer .pause-timer')
    var resetBtn = document.querySelector('.pomo-timer .Reset-timer')
    var session = document.querySelector('.pomodoro-fullpage .session')
    var isWorkSession = true

    let totalSeconds = 30 * 60
    let timerInterval = null

    function updateTimer() {
        let minutes = Math.floor(totalSeconds / 60)
        let seconds = totalSeconds % 60

        timer.innerHTML = `${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')}`
    }

    function startTimer() {
        clearInterval(timerInterval)

        if (isWorkSession) {

            timerInterval = setInterval(function () {
                if (totalSeconds > 0) {
                    totalSeconds--
                    updateTimer()
                } else {
                    isWorkSession = false
                    clearInterval(timerInterval)
                    timer.innerHTML = '05:00'
                    session.innerHTML = 'Take a Break'
                    session.style.backgroundColor = 'var(--blue)'
                    totalSeconds = 10 * 60
                }
            }, 1000)
        } else {


            timerInterval = setInterval(function () {
                if (totalSeconds > 0) {
                    totalSeconds--
                    updateTimer()
                } else {
                    isWorkSession = true
                    clearInterval(timerInterval)
                    timer.innerHTML = '25:00'
                    session.innerHTML = 'Work Session'
                    session.style.backgroundColor = 'var(--green)'
                    totalSeconds = 30 * 60
                }
            }, 1000)
        }

    }

    function pauseTimer() {
        clearInterval(timerInterval)
    }
    function resetTimer() {
        totalSeconds = 30 * 60
        clearInterval(timerInterval)
        updateTimer()

    }
    startBtn.addEventListener('click', startTimer)
    pauseBtn.addEventListener('click', pauseTimer)
    resetBtn.addEventListener('click', resetTimer)



}
pomodoroTimer()

function dailygoals(){
 const checkboxes = document.querySelectorAll('.goal-item input');
const resetBtn = document.querySelector('.reset-goals');

checkboxes.forEach((box, index) => {
    box.checked = JSON.parse(localStorage.getItem('dailyGoal-' + index)) || false;

    box.addEventListener('change', () => {
        localStorage.setItem('dailyGoal-' + index, box.checked);
    });
});

resetBtn.addEventListener('click', () => {
    checkboxes.forEach((box, index) => {
        box.checked = false;
        localStorage.removeItem('dailyGoal-' + index);
    });
});


}
dailygoals()

function weatherFunctionality() {


    var  apiKey = 'c88487a2493746c9a9680138252812';
    var city = 'Bathinda'



    var header1Time = document.querySelector('.header1 h1')
    var header1Date = document.querySelector('.header1 h2')
    var header2Temp = document.querySelector('.header2 h2')
    var header2Condition = document.querySelector('.header2 h4')
    var precipitation = document.querySelector('.header2 .precipitation')
    var humidity = document.querySelector('.header2 .humidity')
    var wind = document.querySelector('.header2 .wind')

    var data = null

    async function weatherAPICall() {
        var response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
        data = await response.json()

        header2Temp.innerHTML = `${data.current.temp_c}°C`
        header2Condition.innerHTML = `${data.current.condition.text}`
        wind.innerHTML = `Wind: ${data.current.wind_kph} km/h`
        humidity.innerHTML = `Humidity: ${data.current.humidity}%`
        precipitation.innerHTML = `Heat Index : ${data.current.heatindex_c}%`
    }

    weatherAPICall()


    function timeDate() {
        const totalDaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var date = new Date()
        var dayOfWeek = totalDaysOfWeek[date.getDay()]
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()
        var tarik = date.getDate()
        var month = monthNames[date.getMonth()]
        var year = date.getFullYear()

        header1Date.innerHTML = `${tarik} ${month}, ${year}`

        if (hours > 12) {
            header1Time.innerHTML = `${dayOfWeek}, ${String(hours - 12).padStart('2', '0')}:${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')} PM`

        } else {
            header1Time.innerHTML = `${dayOfWeek}, ${String(hours).padStart('2', '0')}:${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')} AM`
        }
    }

    setInterval(() => {
        timeDate()
    }, 1000);

}
weatherFunctionality()

function changeTheme() {

    var theme = document.querySelector('.theme')
    var rootElement = document.documentElement

    var flag = 0
    theme.addEventListener('click', function () {

        if (flag == 0) {
            rootElement.style.setProperty('--pri', '#F8F4E1')
            rootElement.style.setProperty('--sec', '#222831')
            rootElement.style.setProperty('--tri1', '#948979')
            rootElement.style.setProperty('--tri2', '#393E46')
            flag = 1
        } else if (flag == 1) {
            rootElement.style.setProperty('--pri', '#F1EFEC')
            rootElement.style.setProperty('--sec', '#030303')
            rootElement.style.setProperty('--tri1', '#D4C9BE')
            rootElement.style.setProperty('--tri2', '#123458')
            flag = 2
        } else if (flag == 2) {
            rootElement.style.setProperty('--pri', '#F8F4E1')
            rootElement.style.setProperty('--sec', '#381c0a')
            rootElement.style.setProperty('--tri1', '#FEBA17')
            rootElement.style.setProperty('--tri2', '#74512D')
            flag = 3
        }else if (flag == 3) {
        rootElement.style.setProperty('--pri', '#EAEAEA')
        rootElement.style.setProperty('--sec', '#1C1F26')
        rootElement.style.setProperty('--tri1', '#4ECCA3')
        rootElement.style.setProperty('--tri2', '#232931')
        flag = 4
    }
    else if (flag == 4) {
        rootElement.style.setProperty('--pri', '#2B2B2B')
        rootElement.style.setProperty('--sec', '#FAFAFA')
        rootElement.style.setProperty('--tri1', '#3F72AF')
        rootElement.style.setProperty('--tri2', '#DBE2EF')
        flag = 5
    }
    else if (flag == 5) {
        rootElement.style.setProperty('--pri', '#FFF8E7')
        rootElement.style.setProperty('--sec', '#3A1F04')
        rootElement.style.setProperty('--tri1', '#F4A261')
        rootElement.style.setProperty('--tri2', '#6A3E2B')
        flag = 6
    }
    else if (flag == 6) {
        rootElement.style.setProperty('--pri', '#F8F4E1')
        rootElement.style.setProperty('--sec', '#381c0a')
        rootElement.style.setProperty('--tri1', '#FEBA17')
        rootElement.style.setProperty('--tri2', '#74512D')
        flag = 0
    }

    })


}

changeTheme()
