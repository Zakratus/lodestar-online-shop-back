const router = require('express-promise-router')();
const { image } = require('../controllers');

router.post('/', image.create);
router.get('/', image.getAll);
router.get('/:id', image.get);
router.put('/:id', image.update);
router.delete('/:id', image.delete);

module.exports = router;