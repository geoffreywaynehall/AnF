var taskInput = document.getElementById("new-task");
var addButton = document.getElementsByTagName("button")[0];
var incompleteTasksHolder = document.getElementById("incomplete-tasks");
var completedTasksHolder = document.getElementById("completed-tasks");

var tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
var idCounter = Number(localStorage.getItem("idCounter") || (tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 0));

var createNewTaskElement = function (id, taskString, completed) {
    listItem = document.createElement("li");
    checkBox = document.createElement("input");
    label = document.createElement("label");
    editInput = document.createElement("input");
    editButton = document.createElement("button");
    deleteButton = document.createElement("button");

    listItem.id = id;

    checkBox.type = "checkbox";
    if (completed) {
        checkBox.checked = true;
    }

    editInput.type = "text";

    editButton.innerText = "Edit";
    editButton.className = "edit";

    deleteButton.innerText = "Delete";
    deleteButton.className = "delete";
    label.innerText = taskString;

    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(editInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    return listItem;
};

var renderLists = function () {
    tasks.forEach(item => {
        var taskElement = createNewTaskElement(item.id, item.name, item.complete)
        if (!item.complete) {
            incompleteTasksHolder.appendChild(taskElement);
        } else {
            completedTasksHolder.appendChild(taskElement);
        }
    });
};

renderLists();

var addTask = function () {
    var listItemName = taskInput.value;
    if (listItemName !== '') {
        var listItem = createNewTaskElement(idCounter, listItemName, false);
        tasks.push({ id: idCounter, name: listItemName, complete: false });
        idCounter++;
        incompleteTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskCompleted);
        taskInput.value = "";
        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem("idCounter", idCounter);
        taskInput.className = "";
    } else {
        taskInput.className = "empty";
    }
};

var editTask = function () {
    var listItem = this.parentNode;
    var editInput = listItem.querySelectorAll("input[type=text]")[0];
    var listItemName = editInput.value;
    console.log(listItemName);
    var label = listItem.querySelector("label");
    var button = listItem.getElementsByTagName("button")[0];

    
    var containsClass = listItem.classList.contains("editMode");
    if (containsClass) {
        if (listItemName !== '') {
            label.innerText = editInput.value;
            button.innerText = "Edit";

            const requiredIndex = tasks.findIndex(el => {
                return String(el.id) === String(listItem.id);
            });
            tasks[requiredIndex].name = editInput.value;
            localStorage.setItem("tasks", JSON.stringify(tasks));

            editInput.className = "";
            listItem.classList.toggle("editMode");
        } else {
            editInput.className = "empty";
        }
    } else {
        editInput.value = label.innerText;
        button.innerText = "Save";
        listItem.classList.toggle("editMode");
    }
};

var deleteTask = function (el) {
    var listItem = this.parentNode;
    var ul = listItem.parentNode;
    ul.removeChild(listItem);
    const requiredIndex = tasks.findIndex(el => {
        return String(el.id) === String(listItem.id);
    });
    if (requiredIndex !== -1) {
        tasks.splice(requiredIndex, 1);
    };
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var taskCompleted = function (el) {
    var listItem = this.parentNode;
    completedTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskIncomplete);
    const requiredIndex = tasks.findIndex(el => {
        return String(el.id) === String(listItem.id);
    });
    tasks[requiredIndex].complete = true;
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var taskIncomplete = function () {
    var listItem = this.parentNode;
    incompleteTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);
    const requiredIndex = tasks.findIndex(el => {
        return String(el.id) === String(listItem.id);
    });
    tasks[requiredIndex].complete = false;
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var bindTaskEvents = function (taskListItem, checkBoxEventHandler, cb) {
    var checkBox = taskListItem.querySelectorAll("input[type=checkbox]")[0];
    var editButton = taskListItem.querySelectorAll("button.edit")[0];
    var deleteButton = taskListItem.querySelectorAll("button.delete")[0];
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
    checkBox.onchange = checkBoxEventHandler;
};

addButton.addEventListener("click", addTask);

for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
    bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}

for (var i = 0; i < completedTasksHolder.children.length; i++) {
    bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}