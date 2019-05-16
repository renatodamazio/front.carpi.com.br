const express = require('express');
const router = express.Router();

router.use('/panel', require('./routes/panel/redis'));
router.use(require('./routes/site/pages'));
router.use(require('./routes/site/errors'));

module.exports = router;
