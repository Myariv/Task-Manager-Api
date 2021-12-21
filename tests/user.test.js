const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOne, userOneID, setupDB} = require('./fixtures/db')


beforeEach(setupDB)

test('Should Create New Account', async () => {
    const response = await request(app).post('/users').send({
        name: 'Yariv Malca',
        email: 'Yariv@Example.com',
        password: 'Yariv123'
    }).expect(201)

    //Assertion that we can check afer we get the response
    // console.log(response.body)

    // 1. Assertion that our user is in the data base
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // 2. Assertion that response does is object that contain atleast this properties (can be more)
    expect(response.body).toMatchObject({
        user: {
            name: 'Yariv Malca',
            email: 'Yariv@Example.com',
        },
        token: user.tokens[0].token
    })

    // 3.Assertion that the password nor be what we insert anymore
    expect(user.password).not.toBe('Yariv123')

})


test('user Should Loging Correcly', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})


test('Should not login noneexisting user', async () => {
    await request(app).post('/users/login').send({
        email: 'ma@Example.com',
        password: 'me123456'
    }).expect(400)
})


test('should read user profile', async () => {
    await request(app).get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})


test('canot get user profile', async () => {
    await request(app).get('/users/me')
        .send()
        .expect(401)
})


test('Should Delete My User', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('Sould Not Be Able To Delete My User for unauthenticate user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneID) // === to response.body.user._id
    // toEqual used when we compare object or content reference types, expenct any simillar to 'typeOf' 
    expect(user.avatar).toEqual(expect.any(Buffer))
})


test('Sould Update Valid  user Fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ name: 'YarivThree' })
        .expect(200)

    const user = await User.findById(userOneID)
    expect(user.name).toBe('YarivThree')
})

test('Should Not Update Invalid Fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ phone: '0544345119' })
        .expect(400)
})


