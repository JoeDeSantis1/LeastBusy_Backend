const express = require('express');

const { getEthPrice, getGasFees, getAmpPrice, ampStakeExample } = require('../controllers/ampStake.js');

const router = express.Router();

router.get('/getEthPrice', getEthPrice);
router.get('/getGasFees', getGasFees);
router.get('/getAmpPrice', getAmpPrice);
router.get('/ampStakeExample', ampStakeExample);

module.exports = router;