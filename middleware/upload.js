const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: 'public/uploads/', // location to save
    filename: (req, file, cb) => { // name of file 
        cb(null, Date.now() + path.extname(file.originalname)); // time stamp + extension name => help to avoid duplicate names
    }
});

module.exports = multer({ storage });