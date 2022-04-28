const express = require('express');
const itemController = require('../controllers/itemController');
const makerController = require('../controllers/makerController');
const categoryController = require('../controllers/categoryController');
const itemInstanceController = require('../controllers/itemInstanceController');

const router = express.Router();

// GET home page
router.get('/', (req, res) => {
    console.log('Home called');
    res.render('index', { title: 'Homepage' });
});

/// ITEM ROUTES ///
// Item create
router.get('/item/create', itemController.itemCreateGet);
router.post('/item/create', itemController.itemCreatePost);

// Item delete
router.get('/item/:id/delete', itemController.itemDeleteGet);
router.post('/item/:id/delete', itemController.itemDeletePost);

// Item update
router.get('/item/:id/update', itemController.itemUpdateGet);
router.post('/item/:id/update', itemController.itemUpdatePost);

// Get one item
router.get('/item/:id', itemController.itemDetail);

// Get all items
router.get('/items/', itemController.itemList);

/// MAKER ROUTES ///
// Maker create
router.get('/maker/create', makerController.makerCreateGet);
router.post('/maker/create', makerController.makerCreatePost);

// Maker delete
router.get('/maker/:id/delete', makerController.makerDeleteGet);
router.post('/maker/:id/delete', makerController.makerDeletePost);

// Maker update
router.get('/maker/:id/update', makerController.makerUpdateGet);
router.post('/maker/:id/update', makerController.makerUpdatePost);

// Get one Maker
router.get('/maker/:id', makerController.makerDetail);

// Get all Makers
router.get('/makers/', makerController.makerList);

/// CATEGORY ROUTES ///
// Category create
router.get('/category/create', categoryController.categoryCreateGet);
router.post('/category/create', categoryController.categoryCreatePost);

// Category delete
router.get('/category/:id/delete', categoryController.categoryDeleteGet);
router.post('/category/:id/delete', categoryController.categoryDeletePost);

// Category update
router.get('/category/:id/update', categoryController.categoryUpdateGet);
router.post('/category/:id/update', categoryController.categoryUpdatePost);

// Get one Category
router.get('/category/:id', categoryController.categoryDetail);

// Get all Categories
router.get('/category/', categoryController.categoryList);

/// ITEM INSTANCE ROUTES ///
// Item instance create
router.get(
    '/iteminstance/create',
    itemInstanceController.itemInstanceCreateGet
);
router.post(
    '/iteminstance/create',
    itemInstanceController.itemInstanceCreatePost
);

// Item instance delete
router.get(
    '/iteminstance/:id/delete',
    itemInstanceController.itemInstanceDeleteGet
);
router.post(
    '/iteminstance/:id/delete',
    itemInstanceController.itemInstanceDeletePost
);

// Item instance update
router.get(
    '/iteminstance/:id/update',
    itemInstanceController.itemInstanceUpdateGet
);
router.post(
    '/iteminstance/:id/update',
    itemInstanceController.itemInstanceUpdatePost
);

// Get one Item instance
router.get('/iteminstance/:id', itemInstanceController.itemInstanceDetail);

// Get all Item instances
router.get('/iteminstance/', itemInstanceController.itemInstanceList);

module.exports = router;