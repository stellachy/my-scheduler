// make changing view possible by showing / hiding different section!
let viewSelected = 'day-view';
function handleViewChange() {
  document.getElementById('view-selector').addEventListener('change', (event) => {
    viewSelected = event.target.value;

    document.querySelectorAll('.done-section').forEach((section) => {
      section.classList.remove('active');
    });

    document.querySelector(`.${viewSelected}`)
      .classList.add('active');

    renderTask(viewSelected);

    // this helps change the title
    getFormattedDate(today);

    // this helps change the size of "to-do-section" depending on the view (here is for the month-&year- view!)
    if (viewSelected === 'month' || viewSelected === 'year') {
      document.querySelector('.to-do-section').
        classList.add('smaller-size');
    } else {
      document.querySelector('.to-do-section').
        classList.remove('smaller-size');
    }
  });
}
handleViewChange();

// console.log(viewSelected);

// this generate the week-view
function generateWeek() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let weekViewHTML = '';
  const today = new Date();
  const currenttMonday = getMonday(today);
  const weekDates = getWeekDates(currenttMonday).map((date) => {
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
generateWeek();

function getWeekDates(currenttMonday) {
  const weekDates = [];

  // loop through the week & create the date data for Mon to Sun
  for (i = 0; i < 7; i++) {
    const day = new Date(currenttMonday);
    day.setDate(currenttMonday.getDate() + i);
    weekDates.push(day);
  }

  return weekDates;
}

// this generate the month-grid!
function generateMonth(daysInMonth) {
  const month = document.getElementById('month');
  let newRow = month.insertRow();
  for (let day = 1; day <= daysInMonth; day++) {
    if (day % 7 === 1 && day !== 1) {
      newRow = month.insertRow();
    }
    const newCell = newRow.insertCell();
    newCell.innerHTML = `
            <div class="month-view-day">
              <div class="month-view-day-header">${day}</div>
              <div class="done-content">
                <div class="task yellow">hotpot</div>
                <div class="task">huhh</div>
              </div>
            </div>
          `;
    // newCell.className = 'month-view-day';
    newCell.onclick = function () {
      console.log(newCell);
    };
  }
}
generateMonth(30);

// this generate year-view grid!
function generateYear() {
  const months = [{
    name: 'January',
    days: 31
  }, {
    name: 'Febuary',
    days: 28
  }, {
    name: 'March',
    days: 31
  }, {
    name: 'April',
    days: 30
  }, {
    name: 'May',
    days: 31
  }, {
    name: 'June',
    days: 30
  }, {
    name: 'July',
    days: 31
  }, {
    name: 'August',
    days: 31
  }, {
    name: 'September',
    days: 30
  }, {
    name: 'October',
    days: 31
  }, {
    name: 'November',
    days: 30
  }, {
    name: 'December',
    days: 31
  }];

  let yearViewHTML = '';
  let eachDay = '';

  function generateEachDay(daysInMonth) {
    for (day = 1; day <= daysInMonth; day++) {
      eachDay += `
              <li>
                <div class="task yellow done">eat dinner</div>
                <div class="task">change a bit</div>
                <div class="task purple">do nothing</div>
              </li>
            `;
    }
    return eachDay;
  }

  months.forEach((month) => {
    eachDay = generateEachDay(month.days);
    yearViewHTML += `
            <div class="done-grid-item">
              <div class="done-header">${month.name}</div>
              <div class="done-content">
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
generateYear();

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

  tasks.push({
    color,
    title,
    date,
    time,
    more,
    status
  });
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

// add date to the done-content in the day-view
const doneContentElem = document.querySelector('.day-view .done-content')
doneContentElem.setAttribute('data-date', `${new Date()}`)

function renderTask(viewSelected) {
  function isSameDate(taskDate, contentDate) {
    return taskDate.getFullYear() === contentDate.getFullYear() &&
      taskDate.getMonth() === contentDate.getMonth() &&
      taskDate.getDate() === contentDate.getDate();
  }

  if (viewSelected === 'day-view') {
    document.querySelectorAll('.day-view .done-content').forEach((done) => {
      done.innerHTML = ''; // Clear the content
    });
    document.getElementById('toDoContent').innerHTML = '';

    tasks.forEach((task) => {
      const taskDate = new Date(task.date);

      // get the doneContentDate for today
      const doneContentDate = new Date(doneContentElem.dataset.date)

      if (isSameDate(taskDate, doneContentDate)) {
        // 是的話再做下面這些事情
        if (task.status) {
          document.querySelectorAll('.day-view .done-content')[0]
            .innerHTML += `<span class="task ${task.color} ${task.status}">${task.title}</span>`;
        } else {
          document.getElementById('toDoContent').innerHTML += `<span class="task ${task.color}">${task.title}</span>`;
        }
      }
    });
  }
  else if (viewSelected === 'week-view') {
    const weekDates = [];
    document.querySelectorAll('.week-view .done-content').forEach((done) => {
      const { date } = done.dataset
      weekDates.push(new Date(date))
    }); // get an array from .done-content's data-attribute

    // Clear all .done-content before rendering new tasks
    document.querySelectorAll('.week-view .done-content').forEach((done) => {
      done.innerHTML = ''; // Clear the content
    });
    document.getElementById('toDoContent').innerHTML = '';

    tasks.forEach((task) => {
      const taskDate = new Date(task.date);

      weekDates.forEach((weekDate, index) => {
        if (isSameDate(taskDate, weekDate)) {
          if (task.status) {
            document.querySelectorAll('.week-view .done-content')[index]
              .innerHTML += `<span class="task ${task.color} ${task.status}">${task.title}</span>`;
          } else {
            document.getElementById('toDoContent').innerHTML += `<span class="task ${task.color}">${task.title}</span>`;
          }
        }
      })
    });
  }
}

// get today's date when the page first loads.
const today = new Date();

// display tasks when the page first loads.
renderTask(viewSelected);

getFormattedDate(today);

function getFormattedDate(today) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsFull = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayName = days[today.getDay()];
  const monthName = months[today.getMonth()];
  const day = today.getDate();
  const year = today.getFullYear();
  const currenttMonday = getMonday(today).getDate();
  const currentSunday = getSunday(today).getDate();
  const monthFullName = monthsFull[today.getMonth()];

  // display different titles depending on views~
  if (viewSelected === 'day-view') {
    document.querySelector('.header-view-day').innerText = dayName;
    document.querySelector('.header-view-date').innerText = `${monthName} ${day}, ${year}`;
  } else if (viewSelected === 'week-view') {
    document.querySelector('.header-view-day').innerText = `${monthName} ${currenttMonday} - ${currentSunday}, ${year}`;
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
  today = new Date(today)
  const day = today.getDay() || 7; // 會得到0-6，如果是0=>就把它變成預設值7
  // if (day !== 1) { // check if it's monday

  today.setHours(-24 * (day - 1));
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