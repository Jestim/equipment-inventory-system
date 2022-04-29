const async = require('async');
const Item = require('../models/Item');
const Maker = require('../models/Maker');
const Category = require('../models/Category');

exports.itemList = function(req, res, next) {
    Item.find({})
        .populate('maker')
        .populate('category')
        .exec((err, result) => {
            if (err) {
                return next(err);
            }

            res.render('itemList', { title: 'Equipment', items: result });
        });
};
exports.itemCreateGet = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: Item create GET');
};
exports.itemCreatePost = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: Item create POST');
};
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
exports.itemDetail = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: Item detail GET');
};