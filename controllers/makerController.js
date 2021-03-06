const async = require('async');
const { body, validationResult } = require('express-validator');
const config = require('dotenv').config();
const Maker = require('../models/Maker');
const Item = require('../models/Item');

exports.makerList = function(req, res, next) {
    Maker.find({})
        .collation({ locale: 'en' })
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
                    .collation({ locale: 'en' })
                    .sort({ model: 1 })
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
                    .collation({ locale: 'en' })
                    .sort({ model: 1 })
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

exports.makerDeletePost = [
    body('makerId').escape(),
    body('password', 'Please enter the correct password').equals(
        process.env.ADMIN_PASSWORD
    ),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            async.parallel({
                    maker: (callback) => {
                        Maker.findById(req.body.makerId).exec(callback);
                    },
                    items: (callback) => {
                        Item.find({ maker: req.body.makerId })
                            .populate('maker')
                            .collation({ locale: 'en' })
                            .sort({ model: 1 })
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

                    res.render('makerDelete', {
                        title: 'Delete maker',
                        maker: result.maker,
                        items: result.items,
                        errors: errors.array()
                    });
                }
            );
        } else {
            Maker.findByIdAndDelete(req.body.makerId, (err) => {
                if (err) {
                    return next(err);
                }

                res.redirect('/equipment/makers');
            });
        }
    }
];

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
    body('password', 'Please enter the correct password').equals(
        process.env.ADMIN_PASSWORD
    ),

    (req, res, next) => {
        const errors = validationResult(req);

        const maker = new Maker({
            name: req.body.name,
            _id: req.body.makerId
        });

        if (!errors.isEmpty()) {
            res.render('makerForm', {
                title: 'Update Maker',
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