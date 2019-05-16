// Libraries
const express = require('express');
const multiparty = require('connect-multiparty')();
const fs = require('fs');
const axios = require('axios');
const formData = require('form-data');

const router = express.Router();

router.post('/upload', multiparty, (req, res) => {

  const files = req.files.file;
  const form = new formData();

  if (Array.isArray(files)) {

    files
      .map(file => form.append('file', fs.createReadStream(file.path)));

  } else {

    form.append('file', fs.createReadStream(files.path));

  }

  axios
    .post('/api', form, {
      headers: form.getHeaders()
    })
    .then((response) => {
      // Success. Deal with this!
      res.sendStatus(200);
    })
    .catch((error) => {
      // Error. Deal with this!
      res.sendStatus(500);
    });

});

module.exports = router;
