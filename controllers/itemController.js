const async = require('async');
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