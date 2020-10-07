const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    fname: req.user.fname,
    lname: req.user.lname,
    age: req.user.age,
    ph: req.user.ph,
    address: req.user.address,
    occupation: req.user.occupation,
    email: req.user.email
  })
);

module.exports = router;