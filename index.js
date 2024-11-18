const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Allowed priorities
const allowedPriorities = ["high", "medium", "low"];

// Sample data
let todos = [
    { id: 1, task: "Learn Node.js", completed: false, priority: "medium" },
    { id: 2, task: "Build a REST API", completed: false, priority: "medium" }
];

// GET /todos - Retrieve all to-do items or filter by completion status
app.get('/todos', (req, res) => {
    if (req.query.completed === undefined) {
        return res.json(todos); // Return all if no query parameter
    }
    const completed = req.query.completed.toLowerCase() === 'true';
    const filteredTodos = todos.filter(todo => todo.completed === completed);
    res.json(filteredTodos);
});

// POST /todos - Add a new to-do item
app.post('/todos', (req, res) => {
    const { task, priority } = req.body;

    if (!task) {
        return res.status(400).send("Task is required.");
    }

    if (priority && !allowedPriorities.includes(priority)) {
        return res.status(400).send("Invalid priority value.");
    }

    const newTodo = {
        id: todos.length + 1,
        task,
        priority: priority || "medium", // Default to "medium"
        completed: false
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// PUT /todos/:id - Update an existing to-do item
app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);

    if (!todo) {
        return res.status(404).send("To-Do item not found");
    }

    const { task, priority, completed } = req.body;

    if (priority && !allowedPriorities.includes(priority)) {
        return res.status(400).send("Invalid priority value.");
    }

    if (task !== undefined) todo.task = task;
    if (priority !== undefined) todo.priority = priority;
    if (completed !== undefined) {
        todo.completed = completed === true || completed === 'true';
    }

    res.json(todo);
});

// PUT /todos/complete-all - Mark all to-do items as completed
app.put('/todos/complete-all', (req, res) => {
    todos.forEach(todo => {
        todo.completed = true;
    });
    res.json({ message: "All to-do items marked as completed." });
});

// DELETE /todos/:id - Delete a to-do item
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) {
        return res.status(404).send("To-Do item not found");
    }
    todos.splice(index, 1);
    res.status(204).send();
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
