const createTaskForm = document.getElementById('createTaskForm');

createTaskForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const deadline = document.getElementById('taskDeadline').value;
    const priority = document.getElementById('taskPriority').value;

    const task = { title, description, deadline, priority };

    const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your_token_here'
        },
        body: JSON.stringify(task)
    });

    if (response.ok) {
        alert('Task created successfully');
        loadTasks(); // Reload tasks
    } else {
        alert('Error creating task');
    }
});

// Fetch and display tasks
async function loadTasks() {
    const response = await fetch('https://backend-lively-thunder-8227.fly.dev/tasks', {
        headers: {
            'Authorization': 'Bearer your_token_here'
        }
    });
    const tasks = await response.json();
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = tasks.map(task => `
        <div>
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Priority: ${task.priority} | Deadline: ${task.deadline}</p>
        </div>
    `).join('');
}

loadTasks();
