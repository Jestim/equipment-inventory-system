const async = require('async');
const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');
const Maker = require('../models/Maker');
const Category = require('../models/Category');
const ItemInstance = require('../models/ItemInstance');

// Display all items
exports.itemList = function(req, res, next) {
    Item.find({})
        .populate('maker')
        .populate('category')
        .exec((err, result) => {
            if (err) {
                return next(err);
            }

            result.sort((a, b) => {
                const makerA = a.maker.name.toLowerCase();
                const makerB = b.maker.name.toLowerCase();

                if (makerA < makerB) return -1;
                if (makerA > makerB) return 1;
                return 0;
            });

            res.render('itemList', { title: 'Equipment', items: result });
        });
};

// Display item deatils
exports.itemDetail = function(req, res, next) {
    async.parallel({
            item: (callback) => {
                Item.findById(req.params.id)
                    .populate('maker')
                    .sort({ serialNumber: 1 })
                    .exec(callback);
            },
            itemInstances: (callback) => {
                ItemInstance.find({ item: req.params.id }).exec(callback);
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

exports.itemCreateGet = function(req, res, next) {
    async.parallel({
            makers: (callback) => {
                Maker.find({}).sort({ name: 1 }).exec(callback);
            },
            categories: (callback) => {
                Category.find({}).sort({ name: 1 }).exec(callback);
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
        console.log(errors);

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
                        Maker.find({}).sort({ name: 1 }).exec(callback);
                    },
                    categories: (callback) => {
                        Category.find({}).sort({ name: 1 }).exec(callback);
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

exports.itemDeleteGet = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: Item delete GET');
};
exports.itemDeletePost = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: Item delete POST');
};
exports.itemUpdateGet = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: Item update GET');
};
exports.itemUpdatePost = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: Item update POST');
};