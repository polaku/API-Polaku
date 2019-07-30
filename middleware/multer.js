const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    let mimetype = file.mimetype.split('/')

    cb(null, file.fieldname + '-' + Date.now())
    path.extname(file.originalname)
    req.body[file.fieldname] = `/public/uploads/${file.fieldname}-` + Date.now() + '.' + mimetype[1]
  }
})

const upload = multer({
  storage: storage
})

module.exports = { upload }
