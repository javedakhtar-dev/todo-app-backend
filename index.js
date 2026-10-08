const express = require('express');
const { Todo, User } = require('./model');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('./middleware');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is up, you are good to go"
    })
})

app.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const isExist = await User.findOne({username});

    if(isExist) {
        res.status(411).json({
            success: false,
            message: "Username already exists"
        })
        return;
    }

    User.create({
        username,
        password
    })
    res.status(200).json({
        success: true,
        message: "User created successfully"
    })
    return;
})

app.post('/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({username, password});

    if(!user) {
        res.status(411).json({
            success: false,
            message: "Username or password are incorrect"
        })
        return;
    }

    const token = jwt.sign({
        userId: user._id
    }, "my-super-secret-key");
    
    res.status(200).json({
        success: true,
        message: "User signedin successfully",
        token
    })
    return;
})

app.use(authMiddleware);
app.post('/todo', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const userId = req.userId;

    Todo.create({
        userId,
        title,
        description
    })

    res.status(200).json({
        success: true,
        message: "Todo created successfully"
    })
    
    return;
})

app.put('/todo-update', async (req, res) => {
    const todoId = req.body.todoId;

    await Todo.updateOne({
        _id: todoId
    }, {
        isDone: false
    })
    
    res.status(200).json({
        success: true,
        message: "Todo marked as done"
    })
    return;
})

app.delete('/todo-delete', async (req, res) => {
    const todoId = req.body.todoId;

    await Todo.deleteOne({
        _id: todoId
    })

    res.status(200).json({
        success: true,
        message: "Todo deleted successfully"
    })
    return;
})

app.get('/todos', async (req, res) => {
    const userId = req.userId;

    const todos = await Todo.find({
        userId
    });

    res.status(200).json({
        success: true,
        message: "Todo fetched successfully",
        todos
    })
    return;
})

app.get('/todo/:id', async (req, res) => {
    const todoId = req.params.todoId
    const todo = await Todo.findOne({
        todoId
    });

    res.status(200).json({
        success: true,
        message: "Todo fetched successfully",
        todo
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})