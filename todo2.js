const input = document.querySelector("#ipbox");
const ul = document.querySelector("ul");
const btn = document.querySelector(".btn");
console.log("Huehue")

// Function to move cursor to the end of contentEditable element
function moveCursorToEnd(el) {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false); // Collapse to the end
    selection.removeAllRanges();
    selection.addRange(range);
    el.focus();
}

// Function to handle setting edit mode for tasks
function setEditMode(taskContent, editBtn, deleteBtn, originalContent) {
    taskContent.contentEditable = true;
    taskContent.focus();
    moveCursorToEnd(taskContent);
    editBtn.innerHTML = "<i class='fa-solid fa-check'></i>"; // Tick icon
    deleteBtn.innerHTML = "<i class='fa-solid fa-times'></i>"; // Cross icon

    // Save changes
    editBtn.onclick = function() {
        taskContent.contentEditable = false;
        editBtn.innerHTML = "<i class='fa-solid fa-pen-to-square'></i>"; // Restore edit icon
        deleteBtn.innerHTML = "<i class='fa-solid fa-trash'></i>"; // Restore delete icon
        saveTasks(); // Save the updated task
    };

    // Discard changes
    deleteBtn.onclick = function() {
        taskContent.innerText = originalContent; // Revert to original content
        taskContent.contentEditable = false;
        editBtn.innerHTML = "<i class='fa-solid fa-pen-to-square'></i>"; // Restore edit icon
        deleteBtn.innerHTML = "<i class='fa-solid fa-trash'></i>"; // Restore delete icon
        saveTasks(); // Save the reverted task
    };
}

// Function to add a new task
function addTask() {
    if (input.value.trim() === '') {
        alert("Add a valid Task");
        return;
    }

    const task = document.createElement('li');
    const taskContent = document.createElement('span');
    taskContent.innerText = input.value;
    taskContent.contentEditable = false;

    taskContent.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });

    const editBtn = document.createElement('button');
    editBtn.innerHTML = "<i class='fa-solid fa-pen-to-square'></i>";
    editBtn.classList.add("edit", "btn");

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = "<i class='fa-solid fa-trash'></i>";
    deleteBtn.classList.add("delete", "btn");

    editBtn.addEventListener('click', function() {
        setEditMode(taskContent, editBtn, deleteBtn, taskContent.innerText);
    });

    deleteBtn.addEventListener('click', function() {
        task.remove();
        saveTasks();
    });

    task.appendChild(taskContent);
    task.appendChild(editBtn);
    task.appendChild(deleteBtn);
    ul.appendChild(task);

    saveTasks();
    input.value = "";
}

// Function to handle key press for adding tasks
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

// Function to save tasks to local storage
function saveTasks() {
    const tasks = [];
    ul.querySelectorAll('li').forEach((task, index) => {
        tasks.push({
            id: index,
            content: task.querySelector('span').innerText
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const li = document.createElement('li');
        const taskContent = document.createElement('span');
        taskContent.innerText = task.content;
        taskContent.contentEditable = false;

        taskContent.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
            }
        });

        const editBtn = document.createElement('button');
        editBtn.innerHTML = "<i class='fa-solid fa-pen-to-square'></i>";
        editBtn.classList.add("edit", "btn");

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = "<i class='fa-solid fa-trash'></i>";
        deleteBtn.classList.add("delete", "btn");

        editBtn.addEventListener('click', function() {
            setEditMode(taskContent, editBtn, deleteBtn, task.content);
        });

        deleteBtn.addEventListener('click', function() {
            li.remove();
            saveTasks();
        });

        li.appendChild(taskContent);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        ul.appendChild(li);
    });
}

// Event listeners
btn.addEventListener('click', addTask);
input.addEventListener('keypress', handleKeyPress);
ul.addEventListener('click', function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
    }
});

// Load tasks when the page is loaded
window.addEventListener('load', loadTasks);
