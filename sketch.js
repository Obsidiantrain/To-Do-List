// Variables
let clickTimer = null;

// Function to add a new task
function newElement() {
  // Get the input value and trim any extra spaces
  const inputValue = document.getElementById("myInput").value.trim();
  if (inputValue === "") return;

  // Get the selected category (daily or standard)
  const category = document.getElementById("category").value;
  const taskList = document.createElement("li");

  // Create a checkbox for the task
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("click", toggleTaskCompletion);

  // Create a span to display the task text
  const taskText = document.createElement("span");
  taskText.textContent = inputValue;
  taskText.className = "task-text";

  // Add event listeners for edit functionality
  taskText.addEventListener("mousedown", () => {
    clickTimer = setTimeout(() => {
      taskText.contentEditable = true;
      taskText.focus();
    }, 500);
  });

  taskText.addEventListener("mouseup", () => {
    clearTimeout(clickTimer);
  });

  taskText.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      taskText.blur();
    }
  });

  taskText.addEventListener("blur", () => {
    taskText.contentEditable = false;
    task.textContent = taskText.textContent;
    saveTasksToLocalStorage();
  });

  // Add event listener to remove the task when double-clicked
  taskText.addEventListener("dblclick", removeTask);

  // Append the checkbox and task text to the task list item
  taskList.appendChild(checkbox);
  taskList.appendChild(taskText);

  // Add a class to style tasks based on their category
  if (category === "daily") {
    taskList.classList.add("daily-task");
  } else {
    taskList.classList.add("standard-task");
  }

  // Append the task list item to the task list
  document.getElementById("taskList").appendChild(taskList);

  // Clear the input field after adding the task
  document.getElementById("myInput").value = "";

  // Save the tasks to local storage
  saveTasksToLocalStorage();
}

// Function to handle Enter key press in the input field
function handleKeyPress(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    newElement();
  }
}

// Function to toggle task completion status
function toggleTaskCompletion() {
  const taskText = this.nextSibling;
  if (this.checked) {
    taskText.style.textDecoration = "line-through";
  } else {
    taskText.style.textDecoration = "none";
  }

  // Save the tasks to local storage
  saveTasksToLocalStorage();
}

// Function to remove a task
function removeTask(event) {
  const taskText = event.target;
  if (taskText.classList.contains("task-text")) {
    const taskItem = taskText.parentElement;
    taskItem.remove();

    // Save the tasks to local storage
    saveTasksToLocalStorage();
  }
}

// Function to delete all tasks
function deleteAllTasks() {
  const taskList = document.getElementById("taskList");
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  // Remove tasks from local storage
  localStorage.removeItem("tasks");
}


// Function to save tasks to local storage
function saveTasksToLocalStorage() {
  const taskItems = document.querySelectorAll(".task-text");
  const tasks = [];

  taskItems.forEach((task) => {
    const taskItem = task.parentElement;
    const category = taskItem.classList.contains("daily-task") ? "daily" : "standard";
    tasks.push({
      text: task.textContent,
      completed: task.style.textDecoration === "line-through",
      category: category,
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from local storage on page load
function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskList = document.getElementById("taskList");

  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("click", toggleTaskCompletion);
    checkbox.checked = task.completed;

    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    taskText.className = "task-text";

    if (task.completed) {
      taskText.style.textDecoration = "line-through";
    } else {
      taskText.style.textDecoration = "none";
    }

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);

    const category = task.category;
    taskItem.style.backgroundColor = category === "daily" ? "#c90000" : "#d8d503";

    taskList.appendChild(taskItem);

    taskList.addEventListener("dblclick", removeTask);
  });

  // Check and apply dark mode if set
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  const body = document.body;
  if (isDarkMode) {
    body.classList.add("dark-mode");
  } else {
    body.classList.remove("dark-mode");
  }
}

// Function to toggle dark mode
function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");

  const isDarkMode = body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDarkMode);
}

// Event listeners
window.addEventListener("load", loadTasksFromLocalStorage);