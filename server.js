const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Read tasks from JSON file
function getTasks() {
    const data = fs.readFileSync("tasks.json", "utf8");
    return JSON.parse(data);
}

// Save tasks to JSON file
function saveTasks(tasks) {
    fs.writeFileSync(
        "tasks.json",
        JSON.stringify(tasks, null, 2)
    );
}

// Home route
app.get("/", (req, res) => {
    res.send("Task Manager Backend is running!");
});

// GET all tasks
app.get("/api/tasks", (req, res) => {
    const tasks = getTasks();
    res.json(tasks);
});

// POST new task
app.post("/api/tasks", (req, res) => {

    const tasks = getTasks();

    const newTask = {
        id: Date.now(),
        title: req.body.title,
        completed: false
    };

    tasks.push(newTask);

    saveTasks(tasks);

    res.status(201).json(newTask);
});

// DELETE task
app.delete("/api/tasks/:id", (req, res) => {

    const tasks = getTasks();

    const id = Number(req.params.id);

    const updatedTasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks(updatedTasks);

    res.json({
        message: "Task deleted successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});