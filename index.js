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

// move the mouse insied the box to make the lil calendar appear
document.getElementById('dateChanger');
const calendarContainer = document.querySelector('.calendar-container');
dateChanger.onmousemove = () => {
  calendarContainer.style.display = 'block';
}

// move mouse outside of the container to make it disappear
document.onmouseover = (event) => {
  // check if the click is outside the calendarContainer and dateChanger
  if (!calendarContainer.contains(event.target) &&
    !dateChanger.contains(event.target)) {
    calendarContainer.style.display = 'none';
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
// related to displaying task card
function displayTaskCard() {
  document.querySelector('.task-card').classList.add('clicked');
  document.querySelector('.overlay').classList.add('active');
}
function cancelTaskCard() {
  clearInput();
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
  let more = document.getElementById('task-card-more').value;
  const id = generateUniqueId();

  if (title && date) {
    tasks.push({
      id,
      color,
      title,
      date,
      time,
      more,
      status
    });
    return true;
  } else {
    alert('Please enter both title and date!');
    return false;
  }
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
let color = 'red';
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

  adjustTaskHeight();
  popupTask();
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

function adjustTaskHeight() {
  document.querySelectorAll('span.task').forEach(taskBox => {
    const baseHeight = 35;
    const id = taskBox.dataset.id;
    const matchingTask = tasks.find(task => task.id === id)
    const hours = matchingTask.time;

    taskBox.style.height = `${baseHeight * hours}px`
  })
}

function popupTask() {
  document.querySelectorAll('span.task').forEach(taskBox => {
    const taskPopup = taskBox.nextElementSibling;
    let isEditing = false;

    // hover to see details
    taskBox.onmouseenter = () => {
      if (!isEditing) {
        const { id } = taskBox.dataset;
        let matchingTask = tasks.find(task => task.id === id);
        // let matchingTask;

        // tasks.forEach(task => {
        //   if (task.id === id) {
        //     matchingTask = task;
        //   }
        // });

        taskPopup.style.display = 'block';  // 讓popup呈現
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
              <input type="number" value="${matchingTask.time}">
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
        const more = inputs[3].value;

        // check which status
        const isDone = doneIcon.style.display !== 'none';

        matchingTask.status = isDone ? 'done' : '';

        matchingTask.title = title;
        matchingTask.date = date;
        matchingTask.time = time;
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
          taskPopup.style.display = 'none';
        }
      });
    }

    taskBox.onmouseleave = () => {
      if (!isEditing) {
        taskPopup.style.display = 'none';
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
// console.log(tasks);
// localStorage.clear();