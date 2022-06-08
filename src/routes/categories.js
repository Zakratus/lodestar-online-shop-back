const router = require('express-promise-router')();
const { category } = require('../controllers');

router.post('/', category.create);
router.get('/', category.getAll);
router.get('/:id', category.get);
router.put('/:id', category.update);
// router.delete('/:id', category.delete);

module.exports = router;