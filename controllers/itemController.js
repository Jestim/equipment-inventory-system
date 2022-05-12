const async = require('async');
const { body, validationResult } = require('express-validator');
const config = require('dotenv').config();
const Item = require('../models/Item');
const Maker = require('../models/Maker');
const Category = require('../models/Category');
const ItemInstance = require('../models/ItemInstance');

// Display all items
exports.itemList = function(req, res, next) {
    Item.find({})
        .collation({ locale: 'en' })
        .sort({ model: 1 })
        .populate('category')
        .populate('maker')
        .exec((err, result) => {
            result.sort((a, b) => {
                const makerA = a.maker.name.toLowerCase();
                const makerB = b.maker.name.toLowerCase();

                if (makerA < makerB) return -1;
                if (makerA > makerB) return 1;
                return 0;
            });

            if (err) {
                return next(err);
            }

            res.render('itemList', { title: 'Equipment', items: result });
        });
};

// Display item deatils
exports.itemDetail = function(req, res, next) {
    async.parallel({
            item: (callback) => {
                Item.findById(req.params.id).populate('maker').exec(callback);
            },
            itemInstances: (callback) => {
                ItemInstance.find({ item: req.params.id })
                    .sort({ serialNumber: 1 })
                    .exec(callback);
            }
        },
        (err, result) => {
            if (err) {
                next(err);
            }

            if (result.item === null) {
                const err = new Error('Item not found');
                err.status = 404;
                return next(err);
            }

            res.render('itemDetail', {
                title: `${result.item.maker.name} ${result.item.model}`,
                item: result.item,
                itemInstances: result.itemInstances
            });
        }
    );
};

// Create form served on Get request
exports.itemCreateGet = function(req, res, next) {
    async.parallel({
            makers: (callback) => {
                Maker.find({})
                    .collation({ locale: 'en' })
                    .sort({ name: 1 })
                    .exec(callback);
            },
            categories: (callback) => {
                Category.find({})
                    .collation({ locale: 'en' })
                    .sort({ name: 1 })
                    .exec(callback);
            }
        },
        (err, result) => {
            if (err) {
                next(err);
            }

            res.render('itemForm', {
                title: 'Add a new item',
                makers: result.makers,
                categories: result.categories
            });
        }
    );
};

// New item created on post request
exports.itemCreatePost = [
    body('maker').escape(),
    body('model', 'Model must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1 }),
    body('category').escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        const item = new Item({
            maker: req.body.maker,
            model: req.body.model,
            description: req.body.description,
            category: req.body.category
        });

        // If there are validation errors, render the form with accepted values prefilled
        if (!errors.isEmpty()) {
            async.parallel({
                    makers: (callback) => {
                        Maker.find({})
                            .collation({ locale: 'en' })
                            .sort({ name: 1 })
                            .exec(callback);
                    },
                    categories: (callback) => {
                        Category.find({})
                            .collation({ locale: 'en' })
                            .sort({ name: 1 })
                            .exec(callback);
                    }
                },
                (err, result) => {
                    if (err) {
                        next(err);
                    }

                    res.render('itemForm', {
                        title: 'Add a new item',
                        makers: result.makers,
                        categories: result.categories,
                        selectedCategory: item.category,
                        item: item,
                        errors: errors.array()
                    });
                }
            );
        } else {
            item.save((err) => {
                if (err) {
                    return next(err);
                }

                res.redirect(item.url);
            });
        }
    }
];

// Delete item page served on GET request
exports.itemDeleteGet = function(req, res, next) {
    async.parallel({
            item: (callback) => {
                Item.findById(req.params.id).populate('maker').exec(callback);
            },
            itemInstances: (callback) => {
                ItemInstance.find({ item: req.params.id }).exec(callback);
            }
        },
        (err, result) => {
            if (err) {
                return next(err);
            }

            res.render('itemDelete', {
                title: 'Delete item',
                item: result.item,
                itemInstances: result.itemInstances
            });
        }
    );
};
exports.itemDeletePost = [
    body('itemId').escape(),
    body('password', 'Please enter the correct password').equals(
        process.env.ADMIN_PASSWORD
    ),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            async.parallel({
                    item: (callback) => {
                        Item.findById(req.body.itemId)
                            .populate('maker')
                            .exec(callback);
                    },
                    itemInstances: (callback) => {
                        ItemInstance.find({ item: req.body.itemId }).exec(
                            callback
                        );
                    }
                },
                (err, result) => {
                    if (err) {
                        return next(err);
                    }

                    if (result.itemInstances.length > 0) {
                        res.render('itemDelete', {
                            title: 'Delete item',
                            item: result.item,
                            itemInstances: result.itemInstances,
                            errors: errors.array()
                        });
                    }

                    res.render('itemDelete', {
                        title: 'Delete item',
                        item: result.item,
                        itemInstances: result.itemInstances,
                        errors: errors.array()
                    });
                }
            );
        } else {
            Item.findByIdAndDelete(req.body.itemId, (err) => {
                if (err) {
                    return next(err);
                }

                res.redirect('/equipment/');
            });
        }
    }
];

exports.itemUpdateGet = function(req, res, next) {
    async.parallel({
            item: (callback) => {
                Item.findById(req.params.id)
                    .populate('maker')
                    .populate('category')
                    .exec(callback);
            },
            makers: (callback) => {
                Maker.find({})
                    .collation({ locale: 'en' })
                    .sort({ name: 1 })
                    .exec(callback);
            },
            categories: (callback) => {
                Category.find({})
                    .collation({ locale: 'en' })
                    .sort({ name: 1 })
                    .exec(callback);
            }
        },
        (err, result) => {
            if (err) {
                return next(err);
            }

            res.render('itemForm', {
                title: 'Update item',
                item: result.item,
                makers: result.makers,
                categories: result.categories,
                selectedCategory: result.item.category._id,
                updating: true
            });
        }
    );
};

exports.itemUpdatePost = [
    body('maker').escape(),
    body('model', 'Model must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body('category', 'Category must not be empty').escape(),
    body('itemId').escape(),
    body('password', 'Please enter the correct password').equals(
        process.env.ADMIN_PASSWORD
    ),

    (req, res, next) => {
        const errors = validationResult(req);

        const item = new Item({
            maker: req.body.maker,
            model: req.body.model,
            description: req.body.description,
            category: req.body.category,
            _id: req.body.itemId
        });

        if (!errors.isEmpty()) {
            async.parallel({
                    makers: (callback) => {
                        Maker.find({})
                            .collation({ locale: 'en' })
                            .sort({ name: 1 })
                            .exec(callback);
                    },
                    categories: (callback) => {
                        Category.find({})
                            .collation({ locale: 'en' })
                            .sort({ name: 1 })
                            .exec(callback);
                    }
                },
                (err, result) => {
                    if (err) {
                        return next(err);
                    }

                    res.render('itemForm', {
                        title: 'Update item',
                        item: item,
                        makers: result.makers,
                        categories: result.categories,
                        selectedCategory: item.category,
                        errors: errors.array()
                    });
                }
            );
        } else {
            Item.findByIdAndUpdate(
                req.body.itemId,
                item, {},
                (err, theItem) => {
                    if (err) {
                        return next(err);
                    }

                    res.redirect(theItem.url);
                }
            );
        }
    }
];