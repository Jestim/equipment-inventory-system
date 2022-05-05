const async = require('async');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const Item = require('../models/Item');
const Maker = require('../models/Maker');

// List all categories
exports.categoryList = function(req, res, next) {
    Category.find({})
        .sort({ name: 1 })
        .exec((err, result) => {
            if (err) {
                return next(err);
            }

            res.render('categoryList', {
                title: 'Categories',
                categories: result
            });
        });
};

// Show all items in the category
exports.categoryDetail = function(req, res, next) {
    async.parallel({
            category: (callback) => {
                Category.findById(req.params.id).exec(callback);
            },
            items: (callback) => {
                Item.find({ category: req.params.id })
                    .populate('maker')
                    .exec(callback);
            }
        },
        (err, result) => {
            if (err) {
                return next(err);
            }

            if (result.category === null) {
                const err = new Error('Category not found');
                err.status = 404;
                return next(err);
            }

            result.items.sort((a, b) => {
                const makerA = a.maker.name.toLowerCase();
                const makerB = b.maker.name.toLowerCase();

                if (makerA < makerB) return -1;
                if (makerA > makerB) return 1;
                return 0;
            });

            res.render('categoryDetail', {
                title: result.category.name,
                category: result.category,
                items: result.items
            });
        }
    );
};

// Send category create form
exports.categoryCreateGet = function(req, res, next) {
    res.render('categoryForm', {
        title: 'Add new category'
    });
};

// Handle category create POST request (validate and sanitize input and save new category to DB)
exports.categoryCreatePost = [
    body('name', 'Category must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name
        });

        if (!errors.isEmpty()) {
            res.render('categoryForm', {
                title: 'Add new category',
                category: category,
                errors: errors.array()
            });
        } else {
            category.save((err) => {
                if (err) {
                    return next(err);
                }

                res.redirect(category.url);
            });
        }
    }
];

// Send category delete view and check that the category is empty
exports.categoryDeleteGet = function(req, res, next) {
    async.parallel({
            category: (callback) => {
                Category.findById(req.params.id).exec(callback);
            },
            items: (callback) => {
                Item.find({ category: req.params.id })
                    .populate('maker')
                    .exec(callback);
            }
        },
        (err, result) => {
            if (err) {
                return next(err);
            }

            res.render('categoryDelete', {
                title: 'Delete category',
                category: result.category,
                items: result.items
            });
        }
    );
};

// Handle delete category POST req and delete object from DB
exports.categoryDeletePost = function(req, res, next) {
    async.parallel({
            category: (callback) => {
                Category.findById(req.params.id).exec(callback);
            },
            items: (callback) => {
                Item.find({ category: req.params.id })
                    .populate('maker')
                    .exec(callback);
            }
        },
        (err, result) => {
            if (err) {
                return next(err);
            }

            if (result.items.length > 0) {
                res.render('categoryDelete', {
                    title: 'Delete category',
                    category: result.category,
                    items: result.items
                });
            }

            Category.findByIdAndDelete(req.body.categoryId, (err) => {
                if (err) {
                    return next(err);
                }

                res.redirect('/equipment/categories');
            });
        }
    );
};
exports.categoryUpdateGet = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: category update GET');
};
exports.categoryUpdatePost = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: category update POST');
};