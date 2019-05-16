// Libraries
const express = require('express');

// Services
const sender = require('../../services/sender');
const authService = require('../../services/auth');

// Utils
const router = express.Router();
const API_URL = process.env.API_URL;

router.get('/users', (req, res) => {

  const auth = authService.authorizationToken(req, res);

  if (!auth) return res.redirect('/login');

  sender.request(req, res, {
    method: 'GET',
    uri: `${API_URL}/users`,
    auth,
  });

});

module.exports = router;
