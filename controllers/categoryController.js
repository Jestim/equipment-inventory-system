const async = require('async');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const Item = require('../models/Item');
const Maker = require('../models/Maker');

// List all categories
exports.categoryList = function(req, res, next) {
    Category.find({})
        .collation({ locale: 'en' })
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
                    .collation({ locale: 'en' })
                    .sort({ maker: 1, model: 1 })
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
                    .collation({ locale: 'en' })
                    .sort({ maker: 1, model: 1 })
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
                    .collation({ locale: 'en' })
                    .sort({ maker: 1, model: 1 })
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

            Category.findByIdAndDelete(req.params.id, (err) => {
                if (err) {
                    return next(err);
                }

                res.redirect('/equipment/categories');
            });
        }
    );
};

exports.categoryUpdateGet = function(req, res, next) {
    Category.findById(req.params.id).exec((err, result) => {
        if (err) {
            return next(err);
        }

        res.render('categoryForm', {
            title: 'Update category',
            category: result
        });
    });
};

exports.categoryUpdatePost = [
    body('name', 'Category must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body('categoryId').escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name,
            _id: req.body.categoryId
        });

        if (!errors.isEmpty()) {
            res.render('categoryForm', {
                title: 'Update category',
                category: category,
                errors: errors.array()
            });
        } else {
            Category.findByIdAndUpdate(
                req.body.categoryId,
                category, {},
                (err, theCategory) => {
                    if (err) {
                        return next(err);
                    }

                    res.redirect(theCategory.url);
                }
            );
        }
    }
];