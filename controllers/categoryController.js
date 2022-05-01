const async = require('async');
const Category = require('../models/Category');
const Item = require('../models/Item');
const Maker = require('../models/Maker');

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
                items: result.items
            });
        }
    );
};

exports.categoryCreateGet = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: category create GET');
};
exports.categoryCreatePost = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: category create POST');
};
exports.categoryDeleteGet = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: category delete GET');
};
exports.categoryDeletePost = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: category delete POST');
};
exports.categoryUpdateGet = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: category update GET');
};
exports.categoryUpdatePost = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: category update POST');
};