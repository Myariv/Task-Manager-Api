const express = require('express')
// require the Task Model 
const Task = require('../models/task')

const auth = require('../middleware/auth')

const router = express.Router()


// Create Task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user.id
    })

    try {
        await task.save()
        res.status(201).send(task)

    } catch (e) {
        res.status(400).send(e)
    }
})



router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    
    if (req.query.sortBy) {
         const parts = req.query.sortBy.split(':')
         sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }


    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }


    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)

    } catch (e) {
        res.status(500).send(e)
    }
})


// Read My Task
router.get('/tasks/:id', auth, async (req, res) => {
    const { id } = req.params

    try {
        const task = await Task.findOne({ _id: id, owner: req.user.id })
        if (!task) return res.status(404).send('This Task Not Found')
        res.send(task)

    } catch (e) {
        res.status(500).send(e)
    }
})


// Update One Task
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedToUpdate = ['description', 'completed']
    const isValidOperation = updates.every(update => allowedToUpdate.includes(update))

    if (!isValidOperation) return res.status(400).send({ error: 'Invalid Updates' })

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user.id })

        if (!task) return res.status(404).send('This Task Not Fount')

        updates.forEach(update => task[update] = req.body[update])

        await task.save()

        res.send(task)

    } catch (e) {
        res.status(500).send(e)
    }
})


// Delete One Task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id })
        if (!task) return res.status(404).send('This Task Not Found')
        res.send(task)

    } catch (e) {
        res.status(500).send(e)
    }
})



module.exports = router