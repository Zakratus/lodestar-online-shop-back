const router = require('express-promise-router')();
const { product } = require('../controllers');


router.post('/', product.create);

router.get('/', product.getAll);
router.get('/filter', product.getFilteredProducts);
router.get('/search', product.getAllBySearch);
router.get('/:article', product.get);
router.get('/category/:category', product.getAllByCategory);

router.put('/:id', product.update);
router.delete('/:id', product.delete);

module.exports = router;