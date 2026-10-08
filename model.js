const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Javed:admin123@cluster0.iobmisv.mongodb.net/basicTodo-app');

const userSchema = mongoose.Schema({
    username: String,
    password: String
})

const todoSchema = mongoose.Schema({
    title: String,
    description: String,
    isDone: { type: Boolean, default: false},
    userId: {type: mongoose.Schema.Types.ObjectId,  ref: 'users'}
})

const User = mongoose.model('users', userSchema);
const Todo = mongoose.model('todos', todoSchema);

module.exports = {
    User, 
    Todo
}