const router = require('express-promise-router')();
const { specification } = require('../controllers');

router.post('/', specification.create);
router.get('/', specification.getAll);
router.get('/:id', specification.get);
router.put('/:id', specification.update);

// router.delete('/:id', specification.delete);


module.exports = router;