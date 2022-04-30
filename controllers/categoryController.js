const Category = require('../models/Category');

exports.categoryList = function(req, res, next) {
    Category.find({}).exec((err, result) => {
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
    res.send('NOT IMPLEMENTED YET: category detail GET');
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