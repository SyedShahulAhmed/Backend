const fs = require('fs');
const path = "Sample/sample.json";

// Load tasks from file
const load = () => {
    try {
        const bufferData = fs.readFileSync(path);
        const data = bufferData.toString();
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Save tasks to file
const save = (tasks) => {
    const dataJSON = JSON.stringify(tasks, null, 2); // Pretty print JSON
    fs.writeFileSync(path, dataJSON);
};

// Add a new task with an ID
const add = (task) => {
    if (!task) {
        console.log("Please provide a task description.");
        return;
    }
    const tasks = load();
    const newTask = { id: tasks.length + 1, task }; // Assign an ID
    tasks.push(newTask);
    save(tasks);
    console.log(`TASK ADDED: ${newTask.task}`);
};

// List all tasks
const list = () => {
    const tasks = load();
    if (tasks.length === 0) {
        console.log("No tasks found.");
        return;
    }
    tasks.forEach((task) => {
        console.log(`${task.id} :- ${task.task}`);
    });
};

// Remove a task by ID
const remove = (id) => {
    if (isNaN(id)) {
        console.log("Please provide a valid task ID.");
        return;
    }

    let tasks = load();
    const filteredTasks = tasks.filter(task => task.id !== id);

    if (tasks.length === filteredTasks.length) {
        console.log(`Task with ID ${id} not found.`);
        return;
    }

    // Reassign IDs to maintain sequential order
    filteredTasks.forEach((task, index) => {
        task.id = index + 1;
    });

    save(filteredTasks);
    console.log(`TASK ${id} REMOVED`);
};

// Command-line arguments handling
const command = process.argv[2];
const arg = process.argv[3];

if (command === 'add') {
    add(arg);
} else if (command === 'list') {
    list();
} else if (command === 'remove') {
    remove(parseInt(arg));
} else {
    console.log("Invalid command. Use 'add', 'list', or 'remove'.");
}