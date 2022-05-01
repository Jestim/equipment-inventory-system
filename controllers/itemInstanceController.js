const Item = require('../models/Item');
const ItemInstance = require('../models/ItemInstance');
const Maker = require('../models/Maker');
const Category = require('../models/Category');

exports.itemInstanceList = function(req, res, next) {
    ItemInstance.find({})
        .populate({ path: 'item', populate: { path: 'maker' } })
        .populate({ path: 'item', populate: { path: 'category' } })
        .exec((err, result) => {
            if (err) {
                return next(err);
            }

            result.sort((a, b) => {
                const makerA = a.item.maker.name.toLowerCase();
                const makerB = b.item.maker.name.toLowerCase();

                if (makerA < makerB) return -1;
                if (makerA > makerB) return 1;
                return 0;
            });

            res.render('itemInstanceList', {
                title: 'Item instances',
                itemInstances: result
            });
        });
};
exports.itemInstanceDetail = function(req, res, next) {
    ItemInstance.findById(req.params.id)
        .populate({ path: 'item', populate: { path: 'maker' } })
        .populate({ path: 'item', populate: { path: 'category' } })
        .populate({ path: 'item', populate: { path: 'description' } })
        .exec((err, result) => {
            if (err) {
                return next(err);
            }

            if (result === null) {
                const err = new Error('Item instance not found');
                err.status = 404;
                return next(err);
            }

            res.render('itemInstanceDetail', {
                title: `${result.item.maker.name} ${result.item.model}`,
                itemInstance: result
            });
        });
};
exports.itemInstanceCreateGet = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: item instance create GET');
};
exports.itemInstanceCreatePost = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: item instance create POST');
};
exports.itemInstanceDeleteGet = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: item instance delete GET');
};
exports.itemInstanceDeletePost = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: item instance delete POST');
};
exports.itemInstanceUpdateGet = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: item instance update GET');
};
exports.itemInstanceUpdatePost = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: item instance update POST');
};