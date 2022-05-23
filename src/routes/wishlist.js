const router = require('express-promise-router')();
const { wishlist } = require('../controllers');



router.get('/:id', wishlist.getList);

router.put('/add', wishlist.addItemToList);
router.put('/remove', wishlist.removeItemFromWishlist);
router.put('/removeAll', wishlist.removeAllItemsFromWishlist);

router.delete('/:id', wishlist.delete);

module.exports = router;