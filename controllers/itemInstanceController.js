const Item = require('../models/Item');
const ItemInstance = require('../models/ItemInstance');
const Maker = require('../models/Maker');

exports.itemInstanceList = function(req, res, next) {
    ItemInstance.find({})
        .populate({ path: 'item', populate: { path: 'maker' } })
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
    res.send('NOT IMPLEMENTED YET: item instance detail GET');
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