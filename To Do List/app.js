$(document).ready(function () {
  const taskInput = $("#taskInput");
  const taskList = $("#taskList");

  // Cargar tareas desde localStorage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  renderTasks();

  // Agregar tarea
  $("#addTaskBtn").click(function () {
    const text = taskInput.val().trim();
    if (text === "") return;

    tasks.push({ text, completed: false });
    saveTasks();
    renderTasks();

    taskInput.val(""); // limpiar input
  });

  // Renderizar lista
  function renderTasks(filter = "all") {
    taskList.empty();

    tasks.forEach((task, index) => {
      if (filter === "completed" && !task.completed) return;
      if (filter === "pending" && task.completed) return;

      const li = $(`
        <li class="list-group-item ${task.completed ? "done" : ""}" style="display:none;">
          <span class="task-text">${task.text}</span>
          <div>
            <button class="btn btn-sm btn-warning edit-btn">✏️</button>
            <button class="btn btn-sm btn-danger delete-btn">🗑️</button>
          </div>
        </li>
      `);

      // Animación al aparecer
      li.fadeIn(300);

      // Marcar como completada
      li.find(".task-text").click(() => {
        task.completed = !task.completed;
        saveTasks();
        renderTasks(filter);
      });

      // Eliminar con animación
      li.find(".delete-btn").click(() => {
        li.fadeOut(300, function () {
          tasks.splice(index, 1);
          saveTasks();
          renderTasks(filter);
        });
      });

      // Editar
      li.find(".edit-btn").click(() => {
        const newText = prompt("Editar tarea:", task.text);
        if (newText !== null && newText.trim() !== "") {
          task.text = newText.trim();
          saveTasks();
          renderTasks(filter);
        }
      });

      taskList.append(li);
    });

    updateCounters();
  }

  // Guardar en localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Filtros
  $(".filter-btn").click(function () {
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");

    const filter = $(this).data("filter");
    renderTasks(filter);
  });

  // Contadores
  function updateCounters() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    $("#totalCount").text(`Total: ${total}`);
    $("#completedCount").text(`Completadas: ${completed}`);
    $("#pendingCount").text(`Pendientes: ${pending}`);
  }
});
