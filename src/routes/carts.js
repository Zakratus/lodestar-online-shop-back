const router = require('express-promise-router')();
const { cart } = require('../controllers');

router.post('/', cart.create);
router.get('/:id', cart.get);

router.put("/increment", cart.incrementProduct);
router.put("/decrement", cart.decrementProduct);
router.put('/delete', cart.deleteProduct);
router.put('/add', cart.addProduct);
router.put('/deleteAll', cart.deleteAllProducts);


router.put('/:id', cart.update);


module.exports = router