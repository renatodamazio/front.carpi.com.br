const express = require('express');
const render = require('../../services/render');
const router = express.Router();
const mail = require('../../utils/mail/nodemailer');

router.get('/404', (req, res) => {

  render(req, res, {
    page: '404',
    title: 'Página não encontrada!'
  });

});

router.get('/500', (req, res) => {

  render(req, res, {
    page: '500',
    title: 'Ocorreu um erro interno, por favor, tente novamente mais tarde!'
  });

});

router.use(function (req, res, next) {

  res.status(404).send(
    res.redirect('/404')
  );

});

router.use(function (err, req, res, next) {

  console.log('Error 500: ', err);

  if (process.env.NODE_ENV === 'production') {

    const mailParams = {
      uri: '500',
      req: req
    }

    const mailError = {
      url: 'URL não especificada',
      status: 500,
      data: err.stack
    }

    mail.send(mailParams, mailError);

  }

  res.status(500).send(
    res.redirect('/500')
  );

});

module.exports = router;
