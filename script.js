// Elements
const dateNumber = document.getElementById('dateNumber');
const dateText = document.getElementById('dateText');
const dateMonth = document.getElementById('dateMonth');
const dateYear = document.getElementById('dateYear');
const tasksContainer = document.getElementById('tasksContainer');
const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
const errorMessageBody = document.getElementById('errorMessageBody');

// Set today's date
const setDate = () => {
  const date = new Date();
  dateNumber.textContent = date.getDate();
  dateText.textContent = date.toLocaleString('en', { weekday: 'long' });
  dateMonth.textContent = date.toLocaleString('en', { month: 'short' });
  dateYear.textContent = date.getFullYear();
};

// Add a new task
const addNewTask = (event) => {
  event.preventDefault();
  const taskText = event.target.taskText.value;
  const category = event.target.category.value;

  if (!taskText) {
    showError('Please enter a task.');
    return;
  }

  if (!category) {
    showError('Please select a category.');
    return;
  }

  const task = createTaskElement(taskText, category);
  tasksContainer.prepend(task);
  saveTasksToLocalStorage();
  event.target.reset();
};

// Create a task element with icons for editing, completing, and deleting
const createTaskElement = (text, category) => {
  const task = document.createElement('div');
  task.classList.add('list-group-item', category);

  const taskContent = document.createElement('span');
  taskContent.textContent = text;

  const taskIcons = document.createElement('div');
  taskIcons.classList.add('task-icons', 'd-flex', 'gap-2');

  // Complete task icon
  const completeButton = document.createElement('button');
  completeButton.innerHTML = '<i class="fas fa-check text-success"></i>';
  completeButton.onclick = () => {
    task.classList.toggle('done');
    saveTasksToLocalStorage();
  };
  taskIcons.appendChild(completeButton);

  // Edit task icon
  const editButton = document.createElement('button');
  editButton.innerHTML = '<i class="fas fa-edit text-warning"></i>';
  editButton.onclick = () => editTask(taskContent);
  taskIcons.appendChild(editButton);

  // Delete task icon
  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = '<i class="fas fa-trash text-danger"></i>';
  deleteButton.onclick = () => {
    task.remove();
    saveTasksToLocalStorage();
  };
  taskIcons.appendChild(deleteButton);

  task.append(taskContent, taskIcons);
  return task;
};

// Edit task functionality
const editTask = (taskContent) => {
  const newTaskText = prompt('Edit your task:', taskContent.textContent);
  if (newTaskText) {
    taskContent.textContent = newTaskText;
    saveTasksToLocalStorage();
  }
};

// Show error modal
const showError = (message) => {
  errorMessageBody.textContent = message;
  errorModal.show();
};

// Filter tasks by category
const filterTasks = (category) => {
  Array.from(tasksContainer.children).forEach((task) => {
    task.style.display =
      category === 'all' || task.classList.contains(category)
        ? 'flex'
        : 'none';
  });
};

// Save tasks to local storage
const saveTasksToLocalStorage = () => {
  const tasks = Array.from(tasksContainer.children).map((task) => ({
    text: task.querySelector('span').textContent,
    category: task.classList[1],
    done: task.classList.contains('done'),
  }));
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Load tasks from local storage
const loadTasksFromLocalStorage = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach((task) => {
    const taskElement = createTaskElement(task.text, task.category);
    if (task.done) taskElement.classList.add('done');
    tasksContainer.appendChild(taskElement);
  });
};

// Initialize the app
setDate();
loadTasksFromLocalStorage();
