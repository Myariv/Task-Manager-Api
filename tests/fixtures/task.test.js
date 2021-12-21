const Task = require('../../src/models/task')
const request = require('supertest')
const app = require('../../src/app')
const { userTwo, userTwoID, userOne, userOneID, taskOne ,setupDB } = require('../fixtures/db')


beforeEach(setupDB)


test('Should Create Task For User', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `${userOne.tokens[0].token}`)
        .send({ description: 'First Task' })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})


test('Sould get All my Task', async () => {
    await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const tasks = await Task.find({ owner: userOneID })
    expect(tasks.length).toBe(2)
})

test('Should not delete other users tasks', async () => {
    await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})