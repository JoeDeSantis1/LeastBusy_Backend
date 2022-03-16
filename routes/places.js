const express = require('express');

const { viewPlace, addPlace, removePlace, fillDB, checkCode, popularTimesDB, photo, addRes, deletePlaces, findTimeToPlace, trafficExample, restaurantDataExample } = require('../controllers/places.js');

const router = express.Router();

router.post('/viewPlace', viewPlace);
router.post('/addPlace', addPlace);
router.post('/removePlace', removePlace);
router.post('/deletePlaces', deletePlaces);
router.post('/findTimeToPlace', findTimeToPlace);
router.post('/addRes', addRes);

router.get('/fillDB', fillDB);
router.get('/checkCode', checkCode);
router.get('/popularTimesDB', popularTimesDB);
router.get('/photo', photo);
router.get('/trafficExample', trafficExample);
router.get('/restaurantDataExample', restaurantDataExample);

module.exports = router;