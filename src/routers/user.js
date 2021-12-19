// NPMS
const express = require('express')
const router = express.Router()
const sharp = require('sharp')

// require the User Model
const User = require('../models/user')

//require functions
const {sendingWelcomeEmail, sendingGoodByeEmail} = require('../emails/account')

//MiddleWares
const auth = require('../middleware/auth')
const upload = require('../middleware/multer')



// Create User ------------------
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendingWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    
    } catch (e) {
        res.status(400).send(e)
    }
})


// Read My User ----------- 
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})



// Update My User --------------
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)

    // not modulary - needs to get one user from the db and run on hes keys
    const allowedToUpdate = ['name', 'age', 'email', 'password']
    const isValidOpertaion = updates.every(update => allowedToUpdate.includes(update))


    if (!isValidOpertaion) return res.status(400).send({ error: 'Invalid Updates' })

    try {
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    
    } catch (e) {
        res.status(400).send(e)
    }
})


// Delete My User
router.delete('/users/me', auth, async (req, res) => {

    try {
        await req.user.remove()
        sendingGoodByeEmail(req.user.email, req.user.name)
        res.send(req.user)
    
    } catch (e) {
        res.status(500).send(e)
    }
})


// Upload Avatar Image With Multer
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // resize the img before send to the server with sharp package
    const buffer = await sharp(req.file.buffer).resize({height: 250, height: 250}).png().toBuffer()
        req.user.avatar = buffer
        await req.user.save()
        res.send(req.user)  

},(error, req, res, next) => {
    res.status(400).send({Error: error.message})
} )



// Delete Avatar Image With Multer
router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = null
        await req.user.save()
        res.send()
    
    }catch (e) {
        res.status(400).send()
    }
})


// Get the user Avatar Image
router.get('/users/:id/avatar', async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findById(id)

        if(!user || !user.avatar) {
            throw new Error()
        } 

        // set the header to browser know its jpeg
        res.set('Content-Type','image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send('Not Found')
    }
}) 


// Login User -----------------
router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })

    } catch (e) {
        res.status(400).send('Unable To Login ')
    }
})



// Logut User --------------
router.post('/users/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send(req.user)
    
    } catch (e) {
        res.status(500).send(e)
    }
})



// Logout All User / Remove All ----------------
router.post('/users/logoutAll', auth, async (req, res) => {

    try {
        //ALL 
        // req.user.tokens = []

        // ALL BESIDE MINE
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token === req.token
        })

        await req.user.save()
        res.send(req.user)

    } catch (e) {
        res.status(500).send(e)
    }
})



module.exports = router