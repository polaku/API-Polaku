const {
  tbl_users,
  tbl_announcements,
  tbl_room_bookings,
  tbl_contacts,
  tbl_events,
  tbl_polanews } = require('../models')
const { verify } = require('../helpers/jwt')

function authentication(req, res, next) {

  let decoded = verify(req.headers.token);

  tbl_users.findByPk(Number(decoded.user_id), { where: { activated: 1 } })
    .then(userFound => {
      if (userFound) {
        req.user = userFound
        next()
      } else {
        res.status(401).json({ message: 'Unauthorized' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Unauthorized' })
    })

}

function authorizationAnnouncement(req, res, next) {
  tbl_announcements.findByPk(req.params.id)
    .then(data => {
      if (data) {
        if (String(data.user_id) === String(req.user.user_id)) {
          next()
        } else {
          res.status(401).json({ message: 'Unauthorized' })
        }
      } else {
        res.status(400).json({ message: 'Data not found' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Unauthorized' })
    })
}

function authorizationBookingRoom(req, res, next) {
  tbl_room_bookings.findByPk(req.params.id)
    .then(data => {
      if (data) {
        if (String(data.user_id) === String(req.user.user_id)) {
          next()
        } else {
          res.status(401).json({ message: 'Unauthorized' })
        }
      } else {
        res.status(400).json({ message: 'Data not found' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Unauthorized' })
    })
}

function authorizationContact(req, res, next) {
  tbl_contacts.findByPk(req.params.id)
    .then(data => {
      if (data) {
        if (String(data.user_id) === String(req.user.user_id)) {
          next()
        } else {
          res.status(401).json({ message: 'Unauthorized' })
        }
      } else {
        res.status(400).json({ message: 'Data not found' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Unauthorized' })
    })
}

function authorizationEvent(req, res, next) {
  tbl_events.findByPk(req.params.id)
    .then(data => {
      if (data) {
        if (String(data.user_id) === String(req.user.user_id)) {
          next()
        } else {
          res.status(401).json({ message: 'Unauthorized' })
        }
      } else {
        res.status(400).json({ message: 'Data not found' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Unauthorized' })
    })
}

function authorizationNews(req, res, next) {
  tbl_polanews.findByPk(req.params.id)
    .then(data => {
      if (data) {
        if (String(data.user_id) === String(req.user.user_id)) {
          next()
        } else {
          res.status(401).json({ message: 'Unauthorized' })
        }
      } else {
        res.status(400).json({ message: 'Data not found' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Unauthorized' })
    })
}

module.exports = {
  authentication,
  authorizationAnnouncement,
  authorizationBookingRoom,
  authorizationContact,
  authorizationEvent,
  authorizationNews
}
