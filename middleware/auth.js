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

  tbl_users.findByPk(Number(decoded.user_id))
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
  tbl_announcements.findByPk(Number(req.params.id))
    .then(data => {
      if (String(data.user_id) === String(req.user.user_id)) {
        next()
      } else {
        res.status(401).json({ message: 'Unauthorized' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Unauthorized' })
    })
}

function authorizationBookingRoom(req, res, next) {
  tbl_room_bookings.findByPk(Number(req.params.id))
    .then(data => {
      if (String(data.user_id) === String(req.user.user_id)) {
        next()
      } else {
        res.status(401).json({ message: 'Unauthorized' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Unauthorized' })
    })
}

function authorizationContact(req, res, next) {
  tbl_contacts.findByPk(Number(req.params.id))
    .then(data => {
      if (String(data.user_id) === String(req.user.user_id)) {
        next()
      } else {
        res.status(401).json({ message: 'Unauthorized' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Unauthorized' })
    })
}

function authorizationEvent(req, res, next) {
  tbl_events.findByPk(Number(req.params.id))
    .then(data => {
      if (String(data.user_id) === String(req.user.user_id)) {
        next()
      } else {
        res.status(401).json({ message: 'Unauthorized' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Unauthorized' })
    })
}

function authorizationNews(req, res, next) {
  tbl_polanews.findByPk(Number(req.params.id))
    .then(data => {
      if (String(data.user_id) === String(req.user.user_id)) {
        next()
      } else {
        res.status(401).json({ message: 'Unauthorized' })
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
