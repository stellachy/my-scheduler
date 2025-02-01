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
const calendarContainer = document.querySelector('.calendar-container');
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
calendarChange();

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
function generateWeek() {
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

function getFirstDayOfMonth(today) {
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  return firstDayOfMonth;
}

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

// related to displaying task card
function displayTaskCard() {
  document.querySelector('.task-card').classList.add('visible');
  document.getElementById('overlay').classList.add('active');
}
function cancelTaskCard() {
  clearInput();
  document.querySelector('.task-card').classList.remove('visible');
  document.getElementById('overlay').classList.remove('active');
}

// 整個to-do-header被點到都可以打開task-card哦！
document.getElementById('displayText');
displayText.onclick = () => {
  displayTaskCard();
};
document.getElementById('displayIcon');
displayIcon.onclick = () => {
  displayTaskCard();
};

document.getElementById('overlay');
overlay.onclick = () => {
  cancelTaskCard();

  // reset color to red if the task-card is clicked off
  document.querySelectorAll('.tag').forEach(tag => tag.style.boxShadow = 'none');
  color = 'red';
  document.querySelector('.tag-red').style.boxShadow = '0 0 0 2px var(--text-light)';
}
document.getElementById('cancelBtn');
cancelBtn.onclick = () => {
  cancelTaskCard();

  // reset color to red if the task-card is clicked off
  document.querySelectorAll('.tag').forEach(tag => tag.style.boxShadow = 'none');
  color = 'red';
  document.querySelector('.tag-red').style.boxShadow = '0 0 0 2px var(--text-light)';
}

// get the user's input
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

function generateUniqueId() {
  return crypto.randomUUID();
}

function clearInput() {
  document.getElementById('taskCard');
  taskCard.reset();
}

function saveToStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


// get color after tags being clicked
document.querySelector('.tag-red').style.boxShadow = '0 0 0 2px var(--text-light)';
document.querySelectorAll('.tag').forEach((tag) => {
  tag.onclick = () => {
    document.querySelectorAll('.tag').forEach(tag => tag.style.boxShadow = 'none');
    color = tag.dataset.color;
    tag.style.boxShadow = '0 0 0 2px var(--text-light)';
  }
});

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

document.getElementById('addBtn');
addBtn.onclick = () => {
  const status = '';
  if (getInput(status, color)) {
    saveToStorage();
    renderTask(viewSelected);
    clearInput();
  }
}

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
              .innerHTML += `<span class="task ${task.color} ${task.status}">${task.title}</span>`;
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

function getFormattedDate(today) {
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

console.log(tasks);

function getMonday(today) {
  const theDay = new Date(today);
  const day = theDay.getDay() || 7; // 會得到0-6，如果是0=>就把它變成預設值7
  // if (day !== 1) { // check if it's monday

  theDay.setHours(-24 * (day - 1));
  // }

  return new Date(today.toDateString());
}

function getSunday(today) {
  today = new Date(today)
  const day = today.getDay() || 7; // 會得到0-6，如果是0=>就把它變成預設值7

  today.setHours(24 * (7 - day));

  return new Date(today.toDateString());
}
// localStorage.clear();