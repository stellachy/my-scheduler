// get today's date when the page first loads.
const today = new Date();
let displayToday = new Date();

document.getElementById('todayBtn');
todayBtn.onclick = () => {
  changeDate(today);
  renderCalendar(currentMonth, currentYear);
  calendarChange();  // making the btn for each date interactive

  // 再displayToday也改設為今天！
  displayToday = new Date();
};

document.getElementById('prevBtn');
prevBtn.onclick = () => {
  const day = new Date(displayToday);
  if (viewSelected === 'day-view') {
    displayToday = new Date(day.setDate(displayToday.getDate() - 1));
  } else if (viewSelected === 'week-view') {
    displayToday = new Date(day.setDate(displayToday.getDate() - 7));
  } else if (viewSelected === 'month-view') {
    displayToday = new Date(displayToday.getFullYear(), displayToday.getMonth() - 1, 1);
  } else if (viewSelected === 'year-view') {
    displayToday = new Date(displayToday.getFullYear() - 1, 0, 1);
  }

  changeDate(displayToday);
};

document.getElementById('nextBtn');
nextBtn.onclick = () => {
  const day = new Date(displayToday);
  if (viewSelected === 'day-view') {
    displayToday = new Date(day.setDate(displayToday.getDate() + 1));
  } else if (viewSelected === 'week-view') {
    displayToday = new Date(day.setDate(displayToday.getDate() + 7));
  } else if (viewSelected === 'month-view') {
    displayToday = new Date(displayToday.getFullYear(), displayToday.getMonth() + 1, 1);
  } else if (viewSelected === 'year-view') {
    displayToday = new Date(displayToday.getFullYear() + 1, 0, 1);
  }

  changeDate(displayToday);
};

// move the mouse inside the box to make the lil calendar appear
document.getElementById('dateChanger');
const calendarContainer = document.getElementById('calendarContainer');
dateChanger.onmousemove = () => {
  calendarContainer.classList.add('visible');
}

// move mouse outside of the container to make it disappear
document.onmouseover = (event) => {
  // check if the click is outside the calendarContainer and dateChanger
  if (!calendarContainer.contains(event.target) &&
    !dateChanger.contains(event.target)) {
    calendarContainer.classList.remove('visible');
    isClicked = true;
  }
}

function changeDate(day) {
  addDate(day);
  generateWeek(day);
  generateMonth(day, getDaysInMonth(day), getFirstDayOfMonth(day));
  generateYear(day);
  displayHeader(day);
  renderTask(viewSelected);
}

// generate a lil calendar
const calendarBody = document.getElementById('calendarBody');
const monthYear = document.getElementById('monthYear');

let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

function renderCalendar(currentMonth, currentYear) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // prevMonth btn
  document.getElementById('prevMonth').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
    calendarChange();
  })

  // nextMonth btn
  document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }

    renderCalendar(currentMonth, currentYear);
    calendarChange();
  })

  calendarBody.innerHTML = '';  // clear previous days

  monthYear.innerHTML = `${months[currentMonth]}, ${currentYear}`; // set month, year display

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();  // get the day of the first date in the current month
  const numDays = new Date(currentYear, currentMonth + 1, 0).getDate();  // get number of days

  // generate the calendar rows
  let date = 1;
  for (let i = 0; i < 6; i++) {
    let row = document.createElement('tr');

    for (let j = 1; j < 8; j++) {
      let cell = document.createElement('td');
      if (i === 0 && j < firstDay) {
        // empty cell before the first day
        cell.innerHTML = '';
      } else if (date > numDays) {
        // stop filling after the last day of the month
        cell.innerHTML = '';
      } else {
        cell.innerHTML = date;
        cell.classList.add('displayed');
        cell.classList.add('notToday');

        // highlight today's date!
        if (date === today.getDate() &&
          currentMonth === today.getMonth() &&
          currentYear === today.getFullYear()) {
          cell.style.backgroundColor = 'var(--tag-red)'
          cell.style.borderRadius = '50%'
          cell.classList.remove('notToday');
        }
        cell.setAttribute('data-date', `${currentYear}-${currentMonth + 1}-${date}`)

        date++;
      }
      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
  }
}
renderCalendar(currentMonth, currentYear);

// after the date is clicked, change the date accordingly.
function calendarChange() {
  const cellElem = document.querySelectorAll('td.displayed');
  cellElem.forEach(td => {
    td.onclick = () => {
      const { date } = td.dataset;
      let day = new Date(date)

      displayToday = day;
      changeDate(displayToday);

      // for marking the specifically selected day
      cellElem.forEach(cell => cell.style.boxShadow = 'none');
      td.style.boxShadow = '0 0 5px var(--text-light)';
      td.style.transition = 'box-shadow 0.3s ease';
    }
  });
}
calendarChange();

// ------------- Related to Grid (day/week/month/year with dates) -------------
// add date to the done-content in the day-view
function addDate(today) {
  // setting different time for each block
  document.querySelectorAll('.day-view .done-content')[0]
    .setAttribute('data-date', `${new Date(today.setHours(4, 0, 0))}`)

  document.querySelectorAll('.day-view .done-content')[1]
    .setAttribute('data-date', `${new Date(today.setHours(12, 0, 0))}`)

  document.querySelectorAll('.day-view .done-content')[2]
    .setAttribute('data-date', `${new Date(today.setHours(18, 0, 0))}`)

  // setting three blocks having the same date attibute
  // document.querySelectorAll('.day-view .done-content').forEach((doneContentElem) => {
  //   doneContentElem.setAttribute('data-date', `${today}`)
  // });
}
addDate(today);

// this generate the week-view
function generateWeek(today) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let weekViewHTML = '';
  const currentMonday = getMonday(today);
  const weekDates = getWeekDates(currentMonday).map((date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  })  // get日期的objects的array之後，map出一個array裡面放我想要的值就好（e.g. 2024-9-23）

  days.forEach((day, index) => {
    weekViewHTML += `
      <div class="done-grid-item">
        <div class="done-header">
          <span>${day}</span>
        </div>
        <div class="done-content" data-date="${weekDates[index]}">
        </div>
      </div>    
    `;
  })

  document.querySelector('.week-view .done-grid')
    .innerHTML = weekViewHTML;
}
generateWeek(today);

function getWeekDates(currentMonday) {
  const weekDates = [];

  // loop through the week & create the date data for Mon to Sun
  for (i = 0; i < 7; i++) {
    const day = new Date(currentMonday);
    day.setDate(currentMonday.getDate() + i);
    weekDates.push(day);
  }

  return weekDates;
}

// this generate the month-grid!
function generateMonth(today, daysInMonth, firstDayOfMonth) {
  const month = document.getElementById('month');

  // 將拿到的日期做格式轉換
  const monthDates = getMonthDates(today, daysInMonth).map((date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  })

  month.innerHTML = `
    <tr>
          <th>Monday</th>
          <th>Tuesday</th>
          <th>Wednesday</th>
          <th>Thursday</th>
          <th>Friday</th>
          <th>Saturday</th>
          <th>Sunday</th>
    </tr>
  `;
  let newRow = month.insertRow();

  let weekDayOfMonth = firstDayOfMonth ? firstDayOfMonth : 7;

  for (let day = 1; day < weekDayOfMonth; day++) {
    newRow.insertCell();
  }

  for (let day = 1; day <= daysInMonth; day++) {
    if (weekDayOfMonth === 8) {
      newRow = month.insertRow();
      weekDayOfMonth = 1;
    }
    const newCell = newRow.insertCell();
    newCell.innerHTML = `
            <div class="month-view-day">
              <div class="month-view-day-header">${day}</div>
              <div class="done-content" data-date="${monthDates[day - 1]}">
              </div>
            </div>
          `;
    if (day === new Date().getDate()) {
      newCell.querySelector('.month-view-day-header').style.backgroundColor = 'var(--tag-red)';
      newCell.querySelector('.month-view-day-header').style.boxShadow = '0 0 5px var(--text-light)';
    }

    weekDayOfMonth++;
  }
}
generateMonth(today, getDaysInMonth(today), getFirstDayOfMonth(today));

// 拿到today當月每一天的日期
function getMonthDates(today, daysInMonth) {
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthDates = [];

  // loop through the week & create the date data for Mon to Sun
  for (i = 0; i < daysInMonth; i++) {
    const day = new Date(firstDayOfMonth);
    day.setDate(firstDayOfMonth.getDate() + i);
    monthDates.push(day);
  }

  return monthDates;
}

// 拿到當月的第一天的星期
function getFirstDayOfMonth(today) {
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  return firstDayOfMonth;
}

// 拿到當月有幾天
function getDaysInMonth(today) {
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  return daysInMonth;
}

// this generate year-view grid!
function generateYear(today) {
  const months = [];

  const monthsFull = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  for (i = 1; i < 13; i++) {
    const daysOfMonth = new Date(today.getFullYear(), i, 0).getDate();
    months.push({
      name: monthsFull[i - 1],
      days: daysOfMonth
    });
  }

  const yearDates = [];
  getYearDates(today).forEach((month) => {
    const monthDates =
      month.monthDates.map((date) => {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      })
    yearDates.push(monthDates);
  });

  let yearViewHTML = '';
  let eachDay = '';

  function generateEachDay(index, daysInMonth) {
    for (day = 1; day <= daysInMonth; day++) {
      eachDay += `
              <li class="done-content" data-date="${yearDates[index][day - 1]}">
              </li>
            `;
    }
    return eachDay;
  }

  months.forEach((month, index) => {
    eachDay = generateEachDay(index, month.days);
    yearViewHTML += `
            <div class="done-grid-item">
              <div class="done-header">${month.name}</div>
              <div>
                <ol>
                  ${eachDay}
                </ol>
              </div>
            </div>
          `;

    eachDay = '';
  });

  document.getElementById('year-view-grid')
    .innerHTML = yearViewHTML;
}
generateYear(today);

function getYearDates(today) {
  const yearDates = [];
  for (i = 0; i < 12; i++) {
    const daysOfMonths = new Date(today.getFullYear(), i + 1, 0).getDate()
    const firstDayOfMonth = new Date(today.getFullYear(), i, 1)
    const monthDates = []
    for (j = 0; j < daysOfMonths; j++) {
      const day = new Date(firstDayOfMonth)
      day.setDate(firstDayOfMonth.getDate() + j)
      monthDates.push(day)
    }

    yearDates.push(
      { monthDates }
    );
  }
  return yearDates;
}

// button functions
// related to log-in card
function displaySideBar() {
  menuIcon.style.display = 'none';
  document.querySelector('header').style.paddingLeft = '230px';
  document.querySelector('main').style.paddingLeft = '230px';
  document.querySelector('.calendar-container').style.left = '550px';
  document.querySelector('.btn-container').style.right = '240px';
  document.querySelector('.side-container').style.left = '0';
}

function cancelSideBar() {
  menuIcon.style.display = 'block';
  document.querySelector('header').style.paddingLeft = '0';
  document.querySelector('main').style.paddingLeft = '0';
  document.querySelector('.calendar-container').style.left = '320px';
  document.querySelector('.btn-container').style.right = '10px';
  document.querySelector('.side-container').style.left = '-230px';
}

document.getElementById('menuIcon');
menuIcon.onclick = () => {
  displaySideBar();
};

document.onclick = (event) => {
  const sideBarElem = document.querySelector('.side-container')

  if (!sideBarElem.contains(event.target) && !menuIcon.contains(event.target)) {
    cancelSideBar();
  }
}

function popupLogIn() {
  document.getElementById('logInOverlay').classList.add('active');
  document.querySelector('.side-login-container').classList.add('visible');
}
function cancelLogIn() {
  document.getElementById('logInOverlay').classList.remove('active');
  document.querySelector('.side-login-container').classList.remove('visible');
}

document.querySelector('.side-header').onclick = () => {
  popupLogIn();
};

document.getElementById('loginCancel').onclick = () => {
  cancelLogIn();
}

// ------------- Related to Task Card (add task, sort task, etc.)-------------
function displayTaskCard() {
  document.querySelector('.task-card').classList.add('visible');
  document.getElementById('overlay').classList.add('active');
}
function cancelTaskCard() {
  clearInput();
  
  // 讓它隱藏
  document.querySelector('.task-card').classList.remove('visible');
  document.getElementById('overlay').classList.remove('active');

  // reset color to red if the task-card is clicked off
  document.querySelectorAll('.tag').forEach(tag => tag.style.boxShadow = 'none');
  color = 'red';
  document.querySelector('.tag-red').style.boxShadow = '0 0 0 2px var(--text-light)';
}

// 打開task card的時機
document.getElementById('displayText');
displayText.onclick = () => {
  displayTaskCard();
};
document.getElementById('displayIcon');
displayIcon.onclick = () => {
  displayTaskCard();
};

// 關掉task card的時機
document.getElementById('overlay');
overlay.onclick = () => {
  cancelTaskCard();
}
document.getElementById('cancelBtn');
cancelBtn.onclick = () => {
  cancelTaskCard();
}

// 取得使用者在Task Card裡輸入的內容 get the user's input
// here之後可串接api寫入DB！
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function getInput(status, color) {
  // here則還需要處理使用者輸入不當時的錯誤處理！
  let title = document.getElementById('task-card-title').value;
  let date = document.getElementById('task-card-date').value;
  let time = document.getElementById('task-card-time').value;
  let hour = document.getElementById('task-card-hour').value;
  let more = document.getElementById('task-card-more').value;
  const id = generateUniqueId();

  if (title && date) {
    tasks.push({
      id,
      color,
      title,
      date,
      time,
      hour,
      more,
      status
    });
    return true;
  } else {
    alert('Please enter both title and date!');
    return false;
  }
}

function sortTasks() {
  tasks.sort((a, b) => {
    const [hourA, minuteA] = a.time.split(':').map(Number);
    const [hourB, minuteB] = b.time.split(':').map(Number);

    const dateTimeA = new Date(a.date);
    dateTimeA.setHours(hourA, minuteA);

    const dateTimeB = new Date(b.date);
    dateTimeB.setHours(hourB, minuteB);

    // comparing date & time together
    return dateTimeA - dateTimeB;
  })
}

// 取得隨機編號 => 讓每個task有自己的unique id
function generateUniqueId() {
  return crypto.randomUUID();
}

// 清除Task Card裡面的input
function clearInput() {
  document.getElementById('taskCard');
  taskCard.reset();
}

function saveToStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Task Card中標籤的顏色 (更改data 及 外觀) get color after tags being clicked
let color = 'red';
document.querySelector('.tag-red').style.boxShadow = '0 0 0 2px var(--text-light)';
document.querySelectorAll('.tag').forEach((tag) => {
  tag.onclick = () => {
    document.querySelectorAll('.tag').forEach(tag => tag.style.boxShadow = 'none');
    color = tag.dataset.color;
    tag.style.boxShadow = '0 0 0 2px var(--text-light)';
  }
});

// 把任save到localStorage的時機(已完成的任務)
document.getElementById('doneBtn');
doneBtn.onclick = () => {
  const status = 'done';

  if (getInput(status, color)) {
    saveToStorage();

    // display在畫面上
    renderTask(viewSelected);

    // 儲存在tasks之後，把畫面上的value刪掉！
    clearInput();
  }
}

// 把任save到localStorage的時機(未完成的任務)
document.getElementById('addBtn');
addBtn.onclick = () => {
  const status = '';
  if (getInput(status, color)) {
    saveToStorage();
    renderTask(viewSelected);
    clearInput();
  }
}

// 根據不同的viewSelected去render task呈現在畫面上
function renderTask(viewSelected) {
  function isSameDate(taskDate, contentDate) {
    return taskDate.getFullYear() === contentDate.getFullYear() &&
      taskDate.getMonth() === contentDate.getMonth() &&
      taskDate.getDate() === contentDate.getDate();
  }
  // everytime before render, let's sort the current tasks to make sure they would be in the correct order.
  sortTasks();

  document.querySelectorAll(`.${viewSelected} .done-content`).forEach((done) => {
    done.setAttribute('data-status', 'done');
    done.innerHTML = ''; // Clear the content, cuz i'll use "+=" for the following
  });
  document.getElementById('toDoContent').innerHTML = '';
  document.getElementById('toDoContent').setAttribute('data-status', '');

  if (viewSelected === 'day-view') {
    // get the doneContentDate for today
    const dayDates = [];
    document.querySelectorAll('.day-view .done-content')
      .forEach((done) => {
        const { date } = done.dataset;
        dayDates.push(new Date(date));
      });

    tasks.forEach((task) => {
      const taskDate = new Date(task.date);

      if (isSameDate(taskDate, dayDates[0])) {
        // 是的話再做下面這些事情
        if (task.status) {
          // checking time matches the box
          let i = 0;
          if (task.time.split(':').map(Number)[0] >= dayDates[2].getHours()) {
            i = 2;
          } else if (task.time.split(':').map(Number)[0] >= dayDates[1].getHours()) {
            i = 1;
          }
          document.querySelectorAll('.day-view .done-content')[i]
            .innerHTML += `<span 
                  class="task ${task.color} ${task.status}"
                  data-id="${task.id}"
                  >${task.title}</span>
                  <div class="task-popup"></div>
                `;
        } else {
          document.getElementById('toDoContent')
            .innerHTML += `<span      
                class="task ${task.color}"
                data-id="${task.id}"
                >${task.title}</span>
                <div class="task-popup"></div>
              `;
        }
      }
    });
  } else if (viewSelected === 'week-view') {
    const weekDates = [];
    document.querySelectorAll('.week-view .done-content').forEach((done) => {
      const { date } = done.dataset
      weekDates.push(new Date(date))
    }); // get an array from .done-content's data-attribute

    tasks.forEach((task) => {
      const taskDate = new Date(task.date);

      weekDates.forEach((weekDate, index) => {
        if (isSameDate(taskDate, weekDate)) {
          if (task.status) {
            document.querySelectorAll('.week-view .done-content')[index]
              .innerHTML += `<span 
                class="task ${task.color} ${task.status}"
                data-id="${task.id}"
                >${task.title}</span>
                <div class="task-popup"></div>
              `;
          } else {
            document.getElementById('toDoContent')
              .innerHTML += `<span  
                class="task ${task.color}"
                data-id="${task.id}"
                >${task.title}</span>
                <div class="task-popup"></div>
              `;
          }
        }
      })
    });
  } else if (viewSelected === 'month-view') {
    const monthDates = [];
    document.querySelectorAll('.month-view .done-content').forEach((done) => {
      const { date } = done.dataset
      monthDates.push(new Date(date))
    }); // get an array from .done-content's data-attribute

    tasks.forEach((task) => {
      const taskDate = new Date(task.date);

      monthDates.forEach((monthDate, index) => {
        if (isSameDate(taskDate, monthDate)) {
          if (task.status) {
            document.querySelectorAll('.month-view .done-content')[index]
              .innerHTML += `<span 
                class="task ${task.color} ${task.status}"
                data-id="${task.id}"
                >${task.title}</span>
                <div class="task-popup"></div>
              `;
          } else {
            document.getElementById('toDoContent')
              .innerHTML += `<span 
                class="task ${task.color}"
                data-id="${task.id}"
                >${task.title}</span>
                <div class="task-popup"></div>
              `;
          }
        }
      })
    });
  } else if (viewSelected === 'year-view') {
    const yearDates = [];
    document.querySelectorAll('.year-view .done-content').forEach((done) => {
      const { date } = done.dataset;
      yearDates.push(new Date(date));
    }); // get an array from .done-content's data-attribute

    tasks.forEach((task) => {
      const taskDate = new Date(task.date);

      yearDates.forEach((yearDate, index) => {
        if (isSameDate(taskDate, yearDate)) {
          if (task.status) {
            document.querySelectorAll('.year-view .done-content')[index]
              .innerHTML += `<span 
                class="task ${task.color} ${task.status}"
                data-id="${task.id}"
                >${task.title}</span>
                <div class="task-popup"></div>
              `;
          } else {
            document.getElementById('toDoContent')
              .innerHTML += `<span 
                class="task ${task.color}"
                data-id="${task.id}"
                >${task.title}</span>
                <div class="task-popup"></div>
              `;
          }
        }
      })
    });
  }

  if (viewSelected === 'day-view' || viewSelected === 'week-view') {
    adjustTaskHeight();
  }

  dragTask();

  popupTask();
}

// 根據不同日期/grid view去display header
function displayHeader(today) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsFull = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayName = days[today.getDay()];
  const monthName = months[today.getMonth()];
  const day = today.getDate();
  const year = today.getFullYear();
  const currentMonday = getMonday(today).getDate();
  const currentSunday = getSunday(today).getDate();
  // this helps display the month name of the next-month (when there are two different months)
  const prevMonth = months[getMonday(today).getMonth()];
  const nextMonth = getMonday(today).getMonth() == getSunday(today).getMonth() ? '' : months[getSunday(today).getMonth()];
  const monthFullName = monthsFull[today.getMonth()];

  // display different titles depending on views~
  if (viewSelected === 'day-view') {
    document.querySelector('.header-view-day').innerText = `${dayName}  |`;
    document.querySelector('.header-view-date').innerText = `${monthName} ${day}, ${year}`;
  } else if (viewSelected === 'week-view') {
    document.querySelector('.header-view-day').innerText = `${prevMonth} ${currentMonday} - ${nextMonth} ${currentSunday}, ${year}`;
    document.querySelector('.header-view-date').innerText = '';
  } else if (viewSelected === 'month-view') {
    document.querySelector('.header-view-day').innerText = `${monthFullName}, ${year}`;
    document.querySelector('.header-view-date').innerText = '';
  } else if (viewSelected === 'year-view') {
    document.querySelector('.header-view-day').innerText = `${year}`;
    document.querySelector('.header-view-date').innerText = '';
  }
}

function getMonday(today) {
  const theDay = new Date(today);
  const day = theDay.getDay() || 7; // 會得到0-6，如果是0=>就把它變成預設值7
  // if (day !== 1) { // check if it's monday

  theDay.setHours(-24 * (day - 1));
  // }

  return new Date(theDay.toDateString());
}

function getSunday(today) {
  const theDay = new Date(today);

  const day = theDay.getDay() || 7; // 會得到0-6，如果是0=>就把它變成預設值7

  theDay.setHours(24 * (7 - day));

  return new Date(theDay.toDateString());
}

// 拖曳Task Box（可以改變status及date，time目前沒做到）
function dragTask() {
  document.querySelectorAll('span.task').forEach(taskBox => {
    taskBox.setAttribute('draggable', 'true');
    taskBox.ondragstart = (event) => {
      event.dataTransfer.setData('text/plain', taskBox.dataset.id);

      // Create a custom image for the drag
      const dragImage = document.createElement('div');
      dragImage.style.width = '100px';
      dragImage.style.height = '50px';
      dragImage.style.background = 'transparent';
      document.body.appendChild(dragImage);

      event.dataTransfer.setDragImage(dragImage, 0, 0);
    };
  });

  document.querySelectorAll(`.${viewSelected} .done-content`).forEach(container => {
    container.ondragover = (event) => event.preventDefault(); // Allow dropping
    container.ondrop = (event) => {
      event.preventDefault();
      let taskId = event.dataTransfer.getData('text/plain');
      // let taskElement = document.querySelector(`[data-id="${taskId}"]`);

      // make sure the new date conform to the <input> element!
      const containerDate = new Date(container.dataset.date);
      const year = containerDate.getFullYear();
      const month = ('0' + (containerDate.getMonth() + 1)).slice(-2);
      const date = ('0' + containerDate.getDate()).slice(-2);
      const dateString = `${year}-${month}-${date}`;

      // Update task's properties (status, date, etc.) depending on the container
      updateTask(taskId, container.dataset.status, dateString);
    };
  });

  const toDoContainer = document.getElementById('toDoContent');
  toDoContainer.ondragover = (event) => event.preventDefault();
  toDoContainer.ondrop = (event) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');

    updateTask(taskId, toDoContainer.dataset.status, 0)
  }

  function updateTask(taskId, newStatus, newDate) {
    let task = tasks.find(task => task.id === taskId);
    task.status = newStatus;
    task.date = newDate ? newDate : task.date;

    saveToStorage();
    renderTask(viewSelected);
  }
}

// 根據花了多少時間 => 調整Task Box的高度（在renderTask之中，當是day或week-view時才會使用這個function）
function adjustTaskHeight() {
  document.querySelectorAll('.done-content span.task').forEach(taskBox => {
    const baseHeight = 35;
    const id = taskBox.dataset.id;
    const matchingTask = tasks.find(task => task.id === id)
    const hours = matchingTask.hour;

    taskBox.style.height = `${baseHeight * hours}px`
  })
}

// 在已經render之後，對Task Box可查看更多info、更改task內容
function popupTask() {
  document.querySelectorAll('span.task').forEach(taskBox => {
    const taskPopup = taskBox.nextElementSibling;
    let isEditing = false;

    // hover to see details
    taskBox.onmouseenter = () => {
      if (isEditing) {
        return;
      }
      const { id } = taskBox.dataset;
      let matchingTask = tasks.find(task => task.id === id);
      // let matchingTask;

      // tasks.forEach(task => {
      //   if (task.id === id) {
      //     matchingTask = task;
      //   }
      // });

      taskPopup.style.left = '0px';  // 讓popup呈現
      taskPopup.innerHTML = `
        <div class="task-card-grid">
          <label class="title">Title</label>
          <span class="details">
            <span class="text">${matchingTask.title}</span>
            <input value="${matchingTask.title}">
          </span>

          <label>Date</label>
          <span class="details">
            <span class="text">${matchingTask.date}</span>
            <input type="date" value="${matchingTask.date}">
          </span>

          <label>Time</label>
          <span class="details">
            <span class="text">${matchingTask.time}</span>
            <input type="time" value="${matchingTask.time}">
          </span>
          
          <label>Hour</label>
          <span class="details">
            <span class="text">${matchingTask.hour}</span>
            <input type="number" value="${matchingTask.hour}">
          </span>

          <label class="more">More</label>
          <span class="details">
            <span class="text">${matchingTask.more}</span>
            <input value="${matchingTask.more}">
          </span>
        </div>

        <div class="task-popup-config">
          <span class="material-symbols-outlined delete-task">close</span>
          <span class="material-symbols-outlined to-do">radio_button_unchecked</span>
          <span class="material-symbols-outlined done">check_circle</span>
          <span class="material-symbols-outlined save-task">task</span>
        </div>
      `
      if (matchingTask.status === 'done') {
        taskPopup.querySelector('.to-do').style.display = 'none';
      } else {
        taskPopup.querySelector('.done').style.display = 'none';
      }
    }

    // click to edit
    taskBox.onclick = () => {
      isEditing = true;

      // display the input & show the edited value on screen
      taskPopup.querySelectorAll('.details').forEach(detail => {
        // changing the color to indicate users that they are allowed to edit the task popup now!
        detail.style.color = 'var(--text-light)';

        detail.onclick = () => {
          const textElement = detail.querySelector('.text');
          const inputField = detail.querySelector('input');

          // Toggle visibility of text and input
          textElement.style.display = 'none';
          inputField.style.display = 'block';

          // Automatically focus the input field
          inputField.focus();

          // handle when the user presses Enter to save the changes
          inputField.onblur = () => {
            textElement.textContent = inputField.value;
            textElement.style.display = 'block';
            inputField.style.display = 'none';

            // isEditing = false;
          };
        }
      })

      // check if the "status" symbol is clicked, & show the change
      const doneIcon = taskPopup.querySelector('.done');
      const toDoIcon = taskPopup.querySelector('.to-do');
      doneIcon.onclick = () => {
        doneIcon.style.display = 'none';
        toDoIcon.style.display = 'block';
      };
      toDoIcon.onclick = () => {
        toDoIcon.style.display = 'none';
        doneIcon.style.display = 'block';
      }

      // save new values to tasks array when the save icon is clicked
      taskPopup.querySelector('.save-task').onclick = () => {
        const { id } = taskBox.dataset;
        let matchingTask = tasks.find(task => task.id === id);

        const inputs = taskPopup.querySelectorAll('input');
        const title = inputs[0].value;
        const date = inputs[1].value;
        const time = inputs[2].value;
        const hour = inputs[3].value;
        const more = inputs[4].value;

        // check which status
        const isDone = doneIcon.style.display !== 'none';

        matchingTask.status = isDone ? 'done' : '';

        matchingTask.title = title;
        matchingTask.date = date;
        matchingTask.time = time;
        matchingTask.hour = hour;
        matchingTask.more = more;

        saveToStorage();
        renderTask(viewSelected);
      }

      // click close icon to delete tasks
      taskPopup.querySelector('.delete-task').onclick = () => {
        if (confirm('Sure to delete?')) {
          const { id } = taskBox.dataset;
          // filter gets the tasks array w/out the specific id!
          tasks = tasks.filter(task => task.id !== id);

          // let matchingIndex;
          // tasks.forEach((task, index) => {
          //   if (task.id === id) {
          //     matchingIndex = index;
          //   }
          // })
          // tasks.splice(matchingIndex, 1)

          saveToStorage();
          renderTask(viewSelected);
        }
      }

      // click outside to close the popup WITHOUT changing the tasks array
      document.addEventListener('click', (event) => {
        //!!remember to use theField.contains(event.target)~
        if (!taskPopup.contains(event.target) &&
          !taskBox.contains(event.target)) {
          isEditing = false;
          taskPopup.style.left = '-300px';
        }
      });
    }

    taskBox.onmouseleave = () => {
      if (!isEditing) {
        taskPopup.style.left = '-300px';
      }
    };
  });
}

// make changing view possible by showing / hiding different section!
let viewSelected = 'day-view';
function handleViewChange(today) {
  document.getElementById('view-selector').addEventListener('change', (event) => {
    viewSelected = event.target.value;

    document.querySelectorAll('.done-section').forEach((section) => {
      section.classList.remove('active');
    });

    document.querySelector(`.${viewSelected}`)
      .classList.add('active');

    changeDate(today);
    renderCalendar(currentMonth, currentYear);
    calendarChange();  // making the btn for each date interactive

    displayHeader(today);

    // after changing the view, the date goes back to today.
    displayToday = new Date();

    // this helps change the size of "to-do-section" depending on the view (here is for the month-&year- view!)
    if (viewSelected === 'month-view' || viewSelected === 'year-view') {
      document.querySelector('.to-do-section').
        classList.add('smaller-size');
    } else {
      document.querySelector('.to-do-section').
        classList.remove('smaller-size');
    }
  });
}
handleViewChange(today);

// display tasks when the page first loads.
renderTask(viewSelected);

displayHeader(today);

// the following is for testing.
console.log(tasks);
// localStorage.clear();