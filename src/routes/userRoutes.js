const express = require('express');
const router = express.Router();
const validateUUID = require('../middlewares/validateUUID');
const userController = require('../controllers/userController');

router.get('/:id', validateUUID('id'), userController.getUserById);
router.delete('/:id', validateUUID('id'), userController.deleteUserById);

module.exports = router;
