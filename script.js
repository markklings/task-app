// Helper Show Calendar
const monthYear = document.getElementById("monthYear")
const calendarDays = document.getElementById("calendarDays")
const prevBtn = document.getElementById("prev")
const nextBtn = document.getElementById("next")

let currentDate = new Date()

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday = 0, Monday = 1, ...
  const lastDate = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  calendarDays.innerHTML = "";
  monthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

  // Add empty slots for days before the 1st of the month
  for (let i = 0; i < firstDayIndex; i++) {
    const emptySlot = document.createElement("div");
    emptySlot.classList.add("empty");
    calendarDays.appendChild(emptySlot);
  }

  // Render the actual days of the month
  for (let i = 1; i <= lastDate; i++) {
    const day = document.createElement("div");
    day.textContent = i;

    // Highlight The Day Today
    if (
      i === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      day.classList.add("today");
    }

    calendarDays.appendChild(day);
  }
}

prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1)
  renderCalendar(currentDate)
})

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1)
  renderCalendar(currentDate)
})

// Initialize Render
renderCalendar(currentDate)

// Helper: Toggle Theme
const themeToggle = document.getElementById("toggleTheme")

function updateThemeLabel() {
  const isDark = document.body.classList.contains("dark")
  themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode"
}

// Load Saved Theme
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.setAttribute("data-theme", "dark")
}
else {
  document.documentElement.setAttribute("data-theme", "light")
}
updateThemeLabel()

// Toggle Theme On Click
themeToggle.addEventListener("click", (e) => {
  e.preventDefault()
  document.body.classList.toggle("dark")

  const current = document.documentElement.getAttribute("data-theme")
  const next = current === "dark" ? "light" : "dark"
  document.documentElement.setAttribute("data-theme", next)
  localStorage.setItem("theme", next)
  updateThemeLabel()
})

// Helper: Get The Current Time
function updateTime() {
  const now = new Date()

  let hours = now.getHours()
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  hours = hours ? hours : 12

  const timeString = `${hours}:${minutes}:${seconds} ${ampm}`

  document.getElementById("time").textContent = timeString
}

// Helper: Update Every Second (Current Time)
setInterval(updateTime, 1000)
updateTime()

// Helper: Popup And Add Task
const addNewBtn = document.getElementById('addNew');
const taskPopup = document.getElementById('taskPopup');
const closePopup = document.getElementById('closePopup');
const saveTask = document.getElementById('saveTask');
const boxContent = document.getElementById('boxContent');

// Show popup
addNewBtn.addEventListener('click', (e) => {
  e.preventDefault();
  taskPopup.style.display = 'flex';
});

// Close popup
closePopup.addEventListener('click', () => {
  taskPopup.style.display = 'none';
});

// Save task
saveTask.addEventListener('click', () => {
  const title = document.getElementById('taskTitle').value.trim();
  const desc = document.getElementById('taskDescription').value.trim();

  if (!title) return alert("Enter a task title.");

  // Find next id
  let id = 1;
  while (localStorage.getItem(`id${id}`)) id++;

  // Save to localStorage
  localStorage.setItem(`id${id}`, JSON.stringify({ title, desc }));

  // Add to UI
  boxContent.innerHTML += `
    <div class="box-task" id="task-${id}">
        <div class="head-task">
          <h2>${title}</h2>
          <button onclick="deleteTask('${id}')">&times</button>
        </div>
        <p>${desc}</p>
    </div>
  `;

  // Reset
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDescription').value = '';
  taskPopup.style.display = 'none';
});

// Load tasks on page load
window.addEventListener('DOMContentLoaded', () => {
  for (let key in localStorage) {
    if (key.startsWith('id')) {
      const { title, desc } = JSON.parse(localStorage.getItem(key));
      boxContent.innerHTML += `
        <div class="box-task" id="task-${key}">
            <div class="head-task">
                <h2>${title}</h2>
                <button onclick="deleteTask('${key}')">&times</button>
            </div>
            <p>${desc}</p>
        </div>
      `;
    }
  }
});

// Helper: Delete Task
function deleteTask(id) {
  localStorage.removeItem(id)

  const taskCard = document.getElementById(`task-${id}`)
  if (taskCard) taskCard.remove()
}