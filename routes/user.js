const express = require('express');

const { signIn, signUp, userPlaces, userProfileInfo, userProfileInfoExample, addAddress, editAddress, deleteAddress, changePassword } = require('../controllers/user.js');

const router = express.Router();

router.get('/userProfileInfoExample', userProfileInfoExample)

router.post('/signIn', signIn);
router.post('/signUp', signUp);
router.post('/userPlaces', userPlaces);
router.post('/userProfileInfo', userProfileInfo);
router.post('/addAddress', addAddress);
router.post('/editAddress', editAddress);
router.post('/deleteAddress', deleteAddress);
router.post('/changePassword', changePassword)

module.exports = router;