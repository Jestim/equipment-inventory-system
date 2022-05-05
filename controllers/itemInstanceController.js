const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');
const ItemInstance = require('../models/ItemInstance');
const Maker = require('../models/Maker');
const Category = require('../models/Category');
const statusOptions = require('../helpers/statusOptions');

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
    Item.find({})
        .populate('maker')
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

            res.render('itemInstanceForm', {
                title: 'Add new item instance',
                statusOptions: statusOptions,
                items: result
            });
        });
};
exports.itemInstanceCreatePost = [
    body('item', 'Item must not be empty').escape(),
    body('serialNumber', 'Serial number must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body('status', 'Status must not be empty').escape(),
    body('dueBack').optional({ checkFalsy: true }).isISO8601().toDate(),

    (req, res, next) => {
        const errors = validationResult(req);

        const itemInstance = new ItemInstance({
            item: req.body.item,
            serialNumber: req.body.serialNumber,
            status: req.body.status,
            dueBack: req.body.dueBack
        });

        if (!errors.isEmpty()) {
            Item.find({})
                .populate('maker')
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

                    res.render('itemInstanceForm', {
                        title: 'Add new item instance',
                        statusOptions: statusOptions,
                        items: result,
                        itemInstance: itemInstance,
                        errors: errors.array()
                    });
                });
        } else {
            itemInstance.save((err) => {
                if (err) {
                    return next(err);
                }

                res.redirect(itemInstance.url);
            });
        }
    }
];
exports.itemInstanceDeleteGet = function(req, res, next) {
    ItemInstance.findById(req.params.id)
        .populate({ path: 'item', populate: { path: 'maker' } })
        .populate({ path: 'item', populate: { path: 'category' } })
        .populate({ path: 'item', populate: { path: 'description' } })
        .exec((err, result) => {
            if (err) {
                return next(err);
            }

            res.render('itemInstanceDelete', {
                title: 'Delete item instance',
                itemInstance: result
            });
        });
};
exports.itemInstanceDeletePost = function(req, res, next) {
    ItemInstance.findByIdAndDelete(req.body.itemInstanceId, (err) => {
        if (err) {
            return next(err);
        }

        res.redirect('/equipment/itemInstances');
    });
};
exports.itemInstanceUpdateGet = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: item instance update GET');
};
exports.itemInstanceUpdatePost = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: item instance update POST');
};