const router = require('express-promise-router')();
const { user } = require('../controllers');
const { body } = require('express-validator');
const authMiddleware = require("../middlewares/auth.middleware");

router.post('/registration',
  body('email').isEmail().withMessage("Некоректный e-mail"),
  body('password').isLength({ min: 4, max: 32 }).withMessage('Пароль должен содержать от 4 до 32 знаков'),
  user.registration
);
router.post('/login', user.login);
router.post('/logout', user.logout);

router.get('/activate/:link', user.activate);
router.get('/refresh', user.refresh);
router.get('/users', authMiddleware, user.getUsers);

router.delete('/user/delete', user.delete);


module.exports = router;