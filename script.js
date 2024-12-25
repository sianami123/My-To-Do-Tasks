// import { getLocalStorage, setLocalStorage } from "./localstorage.js";
// import { getTasksAPI, addTaskAPI, deleteTaskAPI, editTaskAPI } from "./api.js";
const tableData = document.querySelector(".table-data");
const modalOverlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-container");

const baseUrl = "https://67618d7346efb37323722400.mockapi.io/api/v1";

let tasksVar = [];

initialize();

async function initialize() {
  try {
    tasksVar = getLocalStorage("tasks");
    console.log("tasksVar in initialize:", tasksVar);

    const apiTasks = await getTasksAPI();
    if (apiTasks && apiTasks.length > 0) {
      tasksVar = apiTasks;
      try {
        localStorage.setItem("tasks", JSON.stringify(tasksVar));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }

    renderTasks(tasksVar);
  } catch (error) {
    console.error("Error initializing tasks:", error);
    renderTasks([]);
  }
}

async function searchTasks(event) {
  const searchValue = event.target.value;
  const searchedTasks = tasksVar.filter((task) =>
    task.taskName.includes(searchValue)
  );
  renderTasks(searchedTasks);
}

function openFilterModal() {
  modalOverlay.classList.remove("hidden");
  modalContainer.classList.remove("hidden");
  // const selectedStatus = document.getElementById("status").value;
  // const selectedPriority = document.getElementById("priority").value;
  modalContainer.innerHTML = `
  <div>
    <label for="status" class="block mb-2 font-medium">status:</label>
    <select id="status" class="w-full p-2 rounded-lg border border-gray-300 mb-4">
      <option value="todo">Todo</option>
      <option value="doing">Doing</option>
      <option value="done">Done</option>
     </select>
  </div>
  <div>
    <label for="priority" class="block mb-2 font-medium">priority:</label>
    <select id="priority" class="w-full p-2 rounded-lg border border-gray-300 mb-4">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
     </select>
  </div>
  <button onclick="applyFilters()" class="bg-[#7000E3] text-white p-2 rounded-lg">Filter</button>
  `;
}

function applyFilters() {
  const status = document.getElementById("status").value;
  const priority = document.getElementById("priority").value;
  console.log("status in applyFilters:", status);
  console.log("priority in applyFilters:", priority);
  const filteredTasks = tasksVar.filter((task) => {
    return task.status === status && task.priority === priority;
  });
  renderTasks(filteredTasks);
  // closeModal();
}

function renderTasks(tasks = []) {
  if (!Array.isArray(tasks)) {
    console.error("Invalid tasks data:", tasks);
    tasks = [];
  }

  tableData.innerHTML = "";
  tasks.forEach((task) => {
    // console.log("task in renderTasks:", task);
    const taskStatusStyle =
      task.status === "todo"
        ? "bg-red-400 text-white"
        : task.status === "doing"
        ? "bg-yellow-400 text-black"
        : task.status === "done"
        ? "bg-green-400 text-white"
        : "";
    const taskPriorityStyle =
      task.priority === "low"
        ? "bg-gray-400 text-black"
        : task.priority === "medium"
        ? "bg-yellow-400 text-black"
        : task.priority === "high"
        ? "bg-red-400 text-white"
        : "";
    tableData.innerHTML += `<tr class="border hover:bg-gray-50">
                <td class="p-4 border text-left ">${task.taskName}</td>
                <td class="p-4 border text-center">
                  <span class="px-3 py-1 rounded-full ${taskPriorityStyle}">${task.priority}</span>
                </td>
                <td class="p-4 border text-center">
                  <span class="px-3 py-1 rounded-full ${taskStatusStyle}">${task.status}</span>
                </td>
                <td class="p-4 border text-center">
                  <span class="px-3 py-1 rounded-full border">${task.deadLine}</span>
                </td>
                <td class="p-4 border flex justify-center">
                  <div class="flex gap-2">
                    <button onclick="deleteTask(${task.id})" class="p-2 text-white bg-red-400 rounded-lg">
                      <svg
                        class="size-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
                        />
                        <path
                          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
                        />
                      </svg>
                    </button>
                    <button onclick="openEditTaskModal(${task.id})" class="p-2 text-white bg-blue-400 rounded-lg">
                      <svg
                        class="size-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"
                        />
                      </svg>
                    </button>
                    <button onclick="viewTask(${task.id})" class="p-2 text-white bg-gray-400 rounded-lg">
                      <svg
                        class="size-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                        <path
                          d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>`;
  });
}

function openAddTaskModal() {
  modalOverlay.classList.remove("hidden");
  modalContainer.classList.remove("hidden");
  const today = new Date().toISOString().split("T")[0];
  modalContainer.innerHTML = `
  <label for="taskName" class="block mb-2 font-medium">Task Name:</label>
  <span class="task-name-error text-red-500 text-sm hidden">*required</span>
  <input type="text" id="taskName" placeholder="Task Name" class="w-full p-2 rounded-lg border border-gray-300 mb-4">
  
  <div class="mb-4">
    <label class="block mb-2 font-medium">Priority:</label>
    <span class=" priority-error text-red-500 text-sm hidden">*required</span>
    <div class="flex gap-4">
      <label class="flex items-center">
        <input type="radio" name="priority" value="low" class="mr-2">
        <span>Low</span>
      </label>
      <label class="flex items-center">
        <input type="radio" name="priority" value="medium" class="mr-2">
        <span>Medium</span>
      </label>
      <label class="flex items-center">
        <input type="radio" name="priority" value="high" class="mr-2">
        <span>High</span>
      </label>
    </div>
  </div>
  <label for="deadLine" class="block mb-2 font-medium">DeadLine:</label>
  <span class="deadline-error text-red-500 text-sm hidden">*required</span>
  <input type="text" 
         id="deadLine" 
         data-jdp
         data-jdp-min-date="today"  
         data-jdp-format="YYYY/MM/DD"
         value="${today}"
         class="w-full p-2 rounded-lg border border-gray-300 mb-4">
  <label for="taskDetails" class="block mb-2 font-medium">Task Details:</label>
  <span class="task-details-error text-red-500 text-sm hidden">*required</span>
  <textarea name="Text1" cols="40" rows="5" class="w-full p-2 rounded-lg border border-gray-300 mb-4"></textarea>
  <button onclick="addTask()" class="bg-[#7000E3] text-white p-2 rounded-lg">Add Task</button>`;
  jalaliDatepicker.startWatch({
    separatorChar: "/",
    minDate: "today",
    format: "YYYY/MM/DD",
    days: ["ش", "ی", "د", "س", "چ", "پ", "ج"],
    months: [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ],
  });
}

async function addTask() {
  const taskName = document.getElementById("taskName").value;
  const priority = document.querySelector(
    'input[name="priority"]:checked'
  )?.value;
  const deadLine = document.getElementById("deadLine").value;
  const taskDetails = document.querySelector('textarea[name="Text1"]').value;

  if (validateAddTask(taskName, priority, deadLine, taskDetails)) {
    try {
      const newTask = {
        taskName: taskName,
        priority: priority,
        status: "todo",
        deadLine: deadLine,
        taskDetails: taskDetails,
      };

      // Try to add to API first
      await addTaskAPI(newTask);

      // If API succeeds, update local state
      tasksVar.push(newTask);

      // Try to update localStorage, but continue if it fails
      try {
        localStorage.setItem("tasks", JSON.stringify(tasksVar));
      } catch (storageError) {
        console.error("Error saving to localStorage:", storageError);
      }

      renderTasks(tasksVar);
      closeModal();
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Error adding task. Please try again.");
    }
  }
}

async function deleteTask(taskId) {
  console.log("taskId in deleteTask:", taskId);
  const task = tasksVar.find((task) => Number(task.id) === Number(taskId));
  if (confirm(`Are you sure you want to delete this task ${task.taskName}?`)) {
    try {
      await deleteTaskAPI(taskId);
      tasksVar = tasksVar.filter((task) => Number(task.id) !== Number(taskId));
      localStorage.setItem("tasks", JSON.stringify(tasksVar));
      renderTasks(tasksVar);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
}

function openEditTaskModal(taskId) {
  // console.log("taskId in openEditTaskModal:", taskId);
  const task = tasksVar.find((task) => Number(task.id) === Number(taskId));
  // console.log("task in openEditTaskModal:", task);
  modalOverlay.classList.remove("hidden");
  modalContainer.classList.remove("hidden");
  modalContainer.innerHTML = `
  <label for="taskName" class="block mb-2 font-medium">Task Name:</label>
  <span class="task-name-error text-red-500 text-sm hidden">*required</span>
  <input type="text" id="taskName" value="${
    task.taskName
  }" class="w-full p-2 rounded-lg border border-gray-300 mb-4">
  
  <div class="mb-4">
    <label class="block mb-2 font-medium">Priority:</label>
    <span class=" priority-error text-red-500 text-sm hidden ">*required</span>
    <div class="flex gap-4">
      <label class="flex items-center">
        <input type="radio" name="priority" value="low" class="mr-2" ${
          task.priority === "low" ? "checked" : ""
        }>
        <span>Low</span>
      </label>
      <label class="flex items-center">
        <input type="radio" name="priority" value="medium" class="mr-2" ${
          task.priority === "medium" ? "checked" : ""
        }>
        <span>Medium</span>
      </label>
      <label class="flex items-center">
        <input type="radio" name="priority" value="high" class="mr-2" ${
          task.priority === "high" ? "checked" : ""
        }>
        <span>High</span>
      </label>
    </div>
    
    <label class="block mb-2 font-medium">Status:</label>
    <span class="status-error text-red-500 text-sm hidden">*required</span>
    <div class="flex gap-4">
      <label class="flex items-center">
        <input type="radio" name="status" value="todo" class="mr-2" ${
          task.status === "todo" ? "checked" : ""
        }>
        <span>Todo</span>
      </label>
      <label class="flex items-center">
        <input type="radio" name="status" value="doing" class="mr-2" ${
          task.status === "doing" ? "checked" : ""
        }>
        <span>Doing</span>
      </label>
      <label class="flex items-center">
        <input type="radio" name="status" value="done" class="mr-2" ${
          task.status === "done" ? "checked" : ""
        }>
        <span>Done</span>
      </label>
    </div>
  </div>
  <label for="deadLine" class="block mb-2 font-medium">DeadLine:</label>
  <span class="deadline-error text-red-500 text-sm hidden">*required</span>
  <input type="text" 
         id="deadLine" 
         data-jdp
         data-jdp-min-date="today"  
         data-jdp-format="YYYY/MM/DD"
         value="${task.deadLine}"
         class="w-full p-2 rounded-lg border border-gray-300 mb-4">
  <label for="taskDetails" class="block mb-2 font-medium">Task Details:</label>
  <span class="task-details-error text-red-500 text-sm hidden">*required</span>
  <textarea name="Text1" cols="40" rows="5"  class="w-full p-2 rounded-lg border border-gray-300 mb-4">${
    task.taskDetails
  }</textarea>
  <button onclick="editTask(${
    task.id
  })" class="bg-[#7000E3] text-white p-2 rounded-lg">Edit Task</button>`;
  // console.log("task.id in openEditTaskModal:", task.id);
  jalaliDatepicker.startWatch({
    separatorChar: "/",
    minDate: "today",
    format: "YYYY/MM/DD",
    days: ["ش", "ی", "د", "س", "چ", "پ", "ج"],
    months: [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ],
  });
}

function editTask(taskId) {
  // console.log("taskId in editTask:", taskId);
  const task = tasksVar.find((task) => Number(task.id) === Number(taskId));
  // console.log("task in editTask:", task);
  const taskName = document.getElementById("taskName").value;
  const priority = document.querySelector(
    'input[name="priority"]:checked'
  ).value;
  const deadLine = document.getElementById("deadLine").value;
  const taskDetails = document.querySelector('textarea[name="Text1"]').value;
  const status = document.querySelector('input[name="status"]:checked').value;
  if (validateAddTask(taskName, priority, deadLine, taskDetails)) {
    try {
      editTaskAPI(taskId, {
        taskName: taskName,
        priority: priority,
        deadLine: deadLine,
        taskDetails: taskDetails,
        status: status,
      });
      task.taskName = taskName;
      task.priority = priority;
      task.deadLine = deadLine;
      task.taskDetails = taskDetails;
      task.status = status;
      console.log("task in edit", task);
      console.log("tasks in edit", tasksVar);
      localStorage.setItem("tasks", JSON.stringify(tasksVar));
      renderTasks(tasksVar);
      closeModal();
    } catch (error) {
      console.error("Error editing task:", error);
    }
  }
}

function viewTask(taskId) {
  const task = tasksVar.find((task) => task.taskId === taskId);
  modalOverlay.classList.remove("hidden");
  modalContainer.classList.remove("hidden");
  const taskStatusStyle =
    task.status === "todo"
      ? "bg-red-400 text-white"
      : task.status === "doing"
      ? "bg-yellow-400 text-black"
      : "bg-green-400 text-white";
  const taskPriorityStyle =
    task.priority === "low"
      ? "bg-gray-400 text-black"
      : task.priority === "medium"
      ? "bg-yellow-400 text-black"
      : "bg-red-400 text-white";
  modalContainer.innerHTML = `
  <label for="taskName" class="block mb-2 font-medium">Task Name:</label>
  <input type="text" id="taskName" disabled value="${task.taskName}" class="w-full p-2 rounded-lg border border-gray-300 mb-4">
  <label for="taskDetails" class="block mb-2 font-medium">Task Details:</label>
  <textarea name="Text1" cols="40" rows="5" disabled class="w-full p-2 rounded-lg border border-gray-300 mb-4">${task.taskDetails}</textarea>
  <label for="deadLine" class="block mb-2 font-medium">DeadLine:</label>
  <input type="date" id="deadLine" disabled value="${task.deadLine}" class="w-full p-2 rounded-lg border border-gray-300 mb-4">
  <label for="priority" class="block mb-2 font-medium">Priority:</label>
  <input type="text" id="priority" disabled value="${task.priority}" class="w-full p-2 rounded-lg border border-gray-300 mb-4 ${taskPriorityStyle}">
  <label for="status" class="block mb-2 font-medium">Status:</label>
  <input type="text" id="status" disabled value="${task.status}" class="w-full p-2 rounded-lg border border-gray-300 mb-4 ${taskStatusStyle}">
  `;
}

function validateAddTask(taskName, priority, deadLine, taskDetails) {
  if (taskName === "") {
    document.querySelector(".task-name-error").classList.remove("hidden");
    return false;
  }
  if (priority === "") {
    document.querySelector(".priority-error").classList.remove("hidden");
    return false;
  }
  if (deadLine === "") {
    document.querySelector(".deadline-error").classList.remove("hidden");
    return false;
  }
  if (taskDetails === "") {
    document.querySelector(".task-details-error").classList.remove("hidden");
    return false;
  }
  return true;
}

function openModal(taskId) {
  modalOverlay.classList.remove("hidden");
  modalContainer.classList.remove("hidden");
}

function closeModal() {
  modalOverlay.classList.add("hidden");
  modalContainer.classList.add("hidden");
}

modalOverlay.addEventListener("click", closeModal);

// **********************
// **********************

async function getTasksAPI() {
  try {
    const response = await fetch(`${baseUrl}/tasks`);
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

async function deleteTaskAPI(taskId) {
  try {
    // console.log("taskId in deleteTaskAPI:", taskId);
    // await fetch(`${baseUrl}/tasks/${taskId}`, { method: "DELETE" });
    console.log(`${baseUrl}/tasks/${taskId}`);
    const response = await fetch(`${baseUrl}/tasks/${taskId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

async function editTaskAPI(taskId, task) {
  try {
    // await fetch(`${baseUrl}/tasks/${taskId}`, {
    //   method: "PUT",
    //   body: JSON.stringify(task),
    // });
    const response = await fetch(`${baseUrl}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error("Failed to edit task");
    }
    return await response.json();
  } catch (error) {
    console.error("Error editing task:", error);
  }
}

async function addTaskAPI(task) {
  try {
    const response = await fetch(`${baseUrl}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error("Failed to add task");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding task to API:", error);
    throw error;
  }
}

function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
}

function getLocalStorage(key) {
  try {
    const tasks = localStorage.getItem(key);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
}
