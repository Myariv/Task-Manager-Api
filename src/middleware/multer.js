const multer = require('multer')


// if we not coohse dest we can manage where we want to store the data 

const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return cb(new Error('Please Upload One Of This jpg,png,jpeg'))
        }

        // accept the uploading
        cb(null, true)

    }
})


module.exports = upload