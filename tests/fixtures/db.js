const User = require('../../src/models/user')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Task = require('../../src/models/task')

const userOneID = new mongoose.Types.ObjectId()
const userTwoID = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneID,
    name: 'YarivOne',
    email: 'YarivOne@Example.com',
    password: 'YarivOne123',
    tokens: [{
        token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET_CODE)
    }]
}

const userTwo = {
    _id: userTwoID,
    name: 'YarivTwo',
    email: 'YarivTwo@Example.com',
    password: 'YarivTwo123',
    tokens: [{
        token: jwt.sign({ _id: userTwoID }, process.env.JWT_SECRET_CODE)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First Task',
    completed: 'false',
    owner: userOneID
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second Task',
    completed: 'true',
    owner: userOneID
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third Task',
    completed: 'false',
    owner: userTwoID
}


const setupDB = async () =>  {
    await User.deleteMany()
    await Task.deleteMany()

    await new User(userOne).save()
    await new User(userTwo).save()
    
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}


module.exports = {
    userOneID,
    userTwoID,
    userTwo,
    userOne,
    taskOne,
    setupDB
}