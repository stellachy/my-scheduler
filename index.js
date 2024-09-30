// get today's date when the page first loads.
const today = new Date();
let displayToday = new Date();

document.getElementById('todayBtn');
todayBtn.onclick = () => {
  changeDate(today);

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

function changeDate(day) {
  addDate(day);
  generateWeek(day);
  generateMonth(day, getDaysInCurrentMonth(day), getFirstDayOfMonth(day));
  generateYear(day);
  displayHeader(day);
  renderTask(viewSelected);
}

// add date to the done-content in the day-view
function addDate(today) {
  const doneContentElem = document.querySelector('.day-view .done-content')
  doneContentElem.setAttribute('data-date', `${today}`)
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

    // newCell.onclick = function () {
    //   console.log(newCell);
    // };

    weekDayOfMonth++;
  }
}
generateMonth(today, getDaysInCurrentMonth(today), getFirstDayOfMonth(today));

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

function getDaysInCurrentMonth(today) {
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
// related to displaying task card
function displayTaskCard() {
  document.querySelector('.task-card').classList.add('clicked');
  document.querySelector('.overlay').classList.add('active');
}
function cancelTaskCard() {
  document.querySelector('.task-card').classList.remove('clicked');
  document.querySelector('.overlay').classList.remove('active');
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
}
document.getElementById('cancelBtn');
cancelBtn.onclick = () => {
  cancelTaskCard();
}

// get the user's input
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function getInput(status, color) {
  // here則還需要處理使用者輸入不當時的錯誤處理！
  let title = document.getElementById('task-card-title').value;
  let date = document.getElementById('task-card-date').value;
  let time = document.getElementById('task-card-time').value;
  let more = document.getElementById('task-card-more').value;
  const id = generateUniqueId();

  tasks.push({
    id,
    color,
    title,
    date,
    time,
    more,
    status
  });
}

function generateUniqueId() {
  return crypto.randomUUID();
}

function clearInput() {
  document.getElementById('task-card-title').value = '';
  document.getElementById('task-card-date').value = '';
  document.getElementById('task-card-time').value = '';
  document.getElementById('task-card-more').value = '';
}

function saveToStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


// get color after tags being clicked
let color = '';
document.querySelectorAll('.tag').forEach((tag) => {
  tag.onclick = () => {
    color = tag.dataset.color;
  }
});

document.getElementById('doneBtn');
doneBtn.onclick = () => {
  const status = 'done';

  getInput(status, color);

  saveToStorage();

  // display在畫面上
  renderTask(viewSelected);

  // 儲存在tasks之後，把畫面上的value刪掉！
  clearInput();
}

document.getElementById('addBtn');
addBtn.onclick = () => {
  const status = '';
  getInput(status, color);

  saveToStorage();

  renderTask(viewSelected);

  clearInput();
}

function renderTask(viewSelected) {
  function isSameDate(taskDate, contentDate) {
    return taskDate.getFullYear() === contentDate.getFullYear() &&
      taskDate.getMonth() === contentDate.getMonth() &&
      taskDate.getDate() === contentDate.getDate();
  }

  document.querySelectorAll(`.${viewSelected} .done-content`).forEach((done) => {
    done.innerHTML = ''; // Clear the content, cuz i'll use "+=" for the following
  });
  document.getElementById('toDoContent').innerHTML = '';

  if (viewSelected === 'day-view') {
    // get the doneContentDate for today
    const doneContentElem = document.querySelector('.day-view .done-content')
    const doneContentDate = new Date(doneContentElem.dataset.date)
    tasks.forEach((task) => {
      const taskDate = new Date(task.date);

      if (isSameDate(taskDate, doneContentDate)) {
        // 是的話再做下面這些事情
        if (task.status) {
          document.querySelectorAll('.day-view .done-content')[0]
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
  hoverToDisplay();
}

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
  const nextMonth = getMonday(today).getMonth() == getSunday(today).getMonth() ? '' : months[getSunday(today).getMonth()];
  const monthFullName = monthsFull[today.getMonth()];

  // display different titles depending on views~
  if (viewSelected === 'day-view') {
    document.querySelector('.header-view-day').innerText = `${dayName}  |`;
    document.querySelector('.header-view-date').innerText = `${monthName} ${day}, ${year}`;
  } else if (viewSelected === 'week-view') {
    document.querySelector('.header-view-day').innerText = `${monthName} ${currentMonday} - ${nextMonth} ${currentSunday}, ${year}`;
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

  return new Date(theDay.toDateString());
}

function getSunday(today) {
  const theDay = new Date(today);

  const day = theDay.getDay() || 7; // 會得到0-6，如果是0=>就把它變成預設值7

  theDay.setHours(24 * (7 - day));

  return new Date(theDay.toDateString());
}

function hoverToDisplay() {
  document.querySelectorAll('span.task').forEach(taskBox => {
    taskBox.onmouseover = () => {
      const { id } = taskBox.dataset;
      let matchingTask;

      tasks.forEach(task => {
        if (task.id === id) {
          matchingTask = task;
        }
      });

      const taskPopup = taskBox.nextElementSibling;
      taskPopup.innerHTML = `
        <div class="task-card-grid">
          <label for="task-card-title" class="title">Title</label>
          <span class="details">${matchingTask.title}</span>

          <label for="task-card-date">Date</label>
          <span class="details">${matchingTask.date}</span>

          <label for="task-card-time">Time</label>
          <span class="details">${matchingTask.time}</span>

          <label for="task-card-more" class="more">More</label>
          <span class="details">${matchingTask.more}</span>
        </div>
      </div>
      `
    }
  })
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

// localStorage.clear();