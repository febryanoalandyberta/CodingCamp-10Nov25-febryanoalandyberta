document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const dateInput = document.getElementById("date-input");
  const todoList = document.getElementById("todo-list");
  const filterBtn = document.getElementById("filter-btn");
  const deleteAllBtn = document.getElementById("delete-all-btn");

  // Store todos in array
  let todos = [];

  // Render the todo list
  function renderTodos(filteredTodos = null) {
    const list = filteredTodos || todos;

    todoList.innerHTML = "";
    if (list.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.setAttribute("colspan", "4");
      td.classList.add("no-task");
      td.textContent = "No task found";
      tr.appendChild(td);
      todoList.appendChild(tr);
      return;
    }

    list.forEach((todo, index) => {
      const tr = document.createElement("tr");

      // Task text
      const taskTd = document.createElement("td");
      taskTd.textContent = todo.task;
      tr.appendChild(taskTd);

      // Due date
      const dueDateTd = document.createElement("td");
      dueDateTd.textContent = todo.dueDate;
      tr.appendChild(dueDateTd);

      // Status dropdown
      const statusTd = document.createElement("td");
      const select = document.createElement("select");
      select.className = "status-select";

      ["Pending", "Done"].forEach((status) => {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        if (todo.status === status) option.selected = true;
        select.appendChild(option);
      });

      // Update status on change
      select.addEventListener("change", (e) => {
        todo.status = e.target.value;
      });

      statusTd.appendChild(select);
      tr.appendChild(statusTd);

      // Actions (Delete button)
      const actionsTd = document.createElement("td");
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "action-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.title = "Delete this task";

      deleteBtn.addEventListener("click", () => {
        todos.splice(index, 1);
        renderTodos();
      });

      actionsTd.appendChild(deleteBtn);
      tr.appendChild(actionsTd);

      todoList.appendChild(tr);
    });
  }

  // Validate input form
  function validateInput(task, dueDate) {
    if (!task.trim()) {
      alert("Please enter a valid task.");
      return false;
    }
    if (!dueDate) {
      alert("Please select a due date.");
      return false;
    }
    // Optional: Check if due date is valid and >= today
    const selectedDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      alert("Due date cannot be in the past.");
      return false;
    }
    return true;
  }

  // Add new todo
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const task = todoInput.value;
    const dueDate = dateInput.value;

    if (!validateInput(task, dueDate)) return;

    todos.push({
      task,
      dueDate,
      status: "Pending",
    });

    // Reset form
    todoInput.value = "";
    dateInput.value = "";

    renderTodos();
  });

  // Filter function: show only pending tasks
  filterBtn.addEventListener("click", () => {
    const filtered = todos.filter((todo) => todo.status === "Pending");
    renderTodos(filtered);
  });

  // Delete all button
  deleteAllBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all tasks?")) {
      todos = [];
      renderTodos();
    }
  });

  // Initial render
  renderTodos();
});