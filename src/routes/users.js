const router = require('express-promise-router')();
const { user } = require('../controllers');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');
const userUpdateMiddleware = require('../middlewares/user.update.middleware');

router.put("/update",
  authMiddleware,
  userUpdateMiddleware,
  user.updateUser
);

router.delete('/delete', authMiddleware, user.deleteUser);

module.exports = router;