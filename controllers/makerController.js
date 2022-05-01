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
    res.send('NOT IMPLEMENTED YET: maker delete GET');
};
exports.makerDeletePost = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: maker delete POST');
};
exports.makerUpdateGet = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: maker update GET');
};
exports.makerUpdatePost = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: maker update POST');
};