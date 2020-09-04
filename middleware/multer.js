const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    console.log(file.originalname)
    cb(null, Date.now() + '-' + file.originalname )
    // path.extname(file.originalname)
    // req.body[file.fieldname] = `public/uploads/${file.fieldname}-` + Date.now() + '.' + mimetype[1]
  }
})

const uploadAny = multer({
  storage: storage
})

const uploadSingle = multer({
  storage: storage
})

module.exports = { uploadAny, uploadSingle }
