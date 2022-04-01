require('rootpath')();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./_middleware/error-handler');

const multer = require('multer')
//const upload = multer({ dest: 'images/' })
var fileExtension = require('file-extension')

//app.use(express.static(__dirname+'/uploaded-files'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// allow cors requests from any origin and with credentials
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

// api routes
app.use('/accounts', require('./accounts/accounts.controller'));
app.use('/lab-swaps', require('./lab-swaps/lab-swaps.controller')); // was causing server crash on boot

// swagger docs route
app.use('/api-docs', require('./_helpers/swagger'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));

// Basic Get Route
app.get('/', function (req, res) {
    res.json({ message: 'Server Started!' });
});


// (Multer & S3 Method) allow POST requests and send response. Middleware function to accept a file called 'image'. Multer will check for an 'image' binary data, in the data being sent to my 'server' and store it in the './images' folder.
// app.post('/images', upload.single('image'), (req, res) => {
//     const file = req.file // file data.
//     console.log(file) // see what info we get from this in the console.
//     //const info = req.body // any other info sent up to the server, is stored in req.body and can pull that out later on front-end.
//     res.send("all okay")
// })


var storage = multer.diskStorage({

    // Setting directory on disk to save uploaded files
    destination: function (req, file, cb) {
        cb(null, 'uploaded-files')
    },

    // Setting name of file saved
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname))
    }
})

var upload = multer({
    storage: storage,
    limits: {
        // Setting Image Size Limit to 2MBs
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            //Error 
            cb(new Error('Please upload JPG and PNG images only!'))
        }
        //Success 
        cb(undefined, true)
    }
})

app.post('/uploadedImages', upload.single('uploadedImage'), (req, res, next) => {
    const file = req.file
    console.log(req);
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.status(200).send({
        statusCode: 200,
        status: 'success',
        uploadedFile: file
    })

}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})