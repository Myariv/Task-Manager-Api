const mongoose = require('mongoose');
const Task = require('./task')
const validator = require('validator');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(val) {
            if (val.includes('password')) {
                throw new Error('Password Canot Contain: password')
            }
        },
    },
    email: {
        type: String,
        lowerCase: true,
        required: true,
        unique: true,
        trim: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error('Invalid Email')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(val) {
            if (val < 0) {
                throw new Error('Age Must Be Greater 0')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})


// To Ignore Password and Token to the client
userSchema.methods.toJSON = function() {
    const user = this 
    const userObject = user.toObject()
    
    // to delete importent data and save efforts like big response
    delete userObject.password 
    delete userObject.tokens
    delete userObject.avatar


    return userObject
}


//.viruals = Create Virual realation with other models/ideneties 
userSchema.virtual('tasks' ,{
    // wich identity
    ref: 'Task',
    // what field contion the data relation localy
    localField: '_id',
    // what field contaon the data relation in the other identity
    foreignField: 'owner'
})




// .methods == object of the user document functions // regular funtion there is no binding
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_CODE)

    user.tokens = user.tokens.concat({token})
    await user.save()


    return token
}


// .statics == object of the User Model functions / arrow function there is binding
userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email })

    if (!user) throw new Error('No User Found')

    const isMatch = await bcryptjs.compare(password, user.password)

    if (!isMatch) throw new Error('Unable To Login')

    return user
}


// hash password / regular function for binding
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {

        user.password = await bcryptjs.hash(user.password, 8)
    }

    next()
})

// Delete All Tasks of user that delete himself (middleware)
userSchema.pre('remove', async function(next) {
    const user = this

    //Deleting from Task Model
    await Task.deleteMany({owner: user._id})

    next()
})


const User = mongoose.model('User', userSchema);


module.exports = User