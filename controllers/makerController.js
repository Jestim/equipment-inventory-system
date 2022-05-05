const async = require('async');
const { body, validationResult } = require('express-validator');
const Maker = require('../models/Maker');
const Item = require('../models/Item');

exports.makerList = function(req, res, next) {
    Maker.find({})
        .sort({ name: 1 })
        .exec((err, result) => {
            if (err) {
                return next(err);
            }

            res.render('makerList', {
                title: 'Makers',
                makers: result
            });
        });
};
exports.makerDetail = function(req, res, next) {
    async.parallel({
            maker: (callback) => {
                Maker.findById(req.params.id).exec(callback);
            },
            items: (callback) => {
                Item.find({ maker: req.params.id })
                    .populate('maker')
                    .exec(callback);
            }
        },
        (err, result) => {
            if (err) {
                next(err);
            }

            if (result.maker === null) {
                const err = new Error('Maker not found');
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

            res.render('makerDetail', {
                title: result.maker.name,
                maker: result.maker,
                items: result.items
            });
        }
    );
};

exports.makerCreateGet = function(req, res, next) {
    res.render('makerForm', {
        title: 'Add new maker'
    });
};
exports.makerCreatePost = [
    body('name', 'Maker must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        console.log(errors);

        const maker = new Maker({
            name: req.body.name
        });

        if (!errors.isEmpty()) {
            res.render('makerForm', {
                title: 'Add new maker',
                maker: maker,
                errors: errors.array()
            });
        } else {
            maker.save((err) => {
                if (err) {
                    return next(err);
                }

                res.redirect(maker.url);
            });
        }
    }
];

exports.makerDeleteGet = function(req, res, next) {
    async.parallel({
            maker: (callback) => {
                Maker.findById(req.params.id).exec(callback);
            },
            items: (callback) => {
                Item.find({ maker: req.params.id })
                    .populate('maker')
                    .exec(callback);
            }
        },
        (err, result) => {
            if (err) {
                return next(err);
            }

            res.render('makerDelete', {
                title: 'Delete maker',
                maker: result.maker,
                items: result.items
            });
        }
    );
};

exports.makerDeletePost = function(req, res, next) {
    async.parallel({
            maker: (callback) => {
                Maker.findById(req.body.makerId).exec(callback);
            },
            items: (callback) => {
                Item.find({ maker: req.body.makerId })
                    .populate('maker')
                    .exec(callback);
            }
        },
        (err, result) => {
            if (err) {
                return next(err);
            }

            if (result.items.length > 0) {
                res.render('makerDelete', {
                    title: 'Delete maker',
                    maker: result.maker,
                    items: result.items
                });
            }

            Maker.findByIdAndDelete(req.body.makerId, (err) => {
                if (err) {
                    return next(err);
                }

                res.redirect('/equipment/makers');
            });
        }
    );
};
exports.makerUpdateGet = function(req, res, next) {
    Maker.findById(req.params.id).exec((err, result) => {
        if (err) {
            return next(err);
        }

        res.render('makerForm', {
            title: 'Update Maker',
            maker: result
        });
    });
};
exports.makerUpdatePost = [
    body('name').trim().isLength({ min: 1 }).escape(),
    body('makerId').escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        const maker = new Maker({
            name: req.body.name,
            _id: req.body.makerId
        });

        if (!errors.isEmpty()) {
            res.render('makerForm', {
                maker: maker,
                errors: errors.array()
            });
        } else {
            Maker.findByIdAndUpdate(
                req.body.makerId,
                maker, {},
                (err, theMaker) => {
                    if (err) {
                        return next(err);
                    }

                    res.redirect(theMaker.url);
                }
            );
        }
    }
];