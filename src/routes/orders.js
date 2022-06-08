const router = require('express-promise-router')();
const { order } = require('../controllers');


router.get('/byuser/:userId', order.getAllByUser)

router.post('/create', order.createOrder);

// router.delete('/delete/:userId/:orderId', order.deleteOrder);


module.exports = router;