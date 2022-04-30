const Maker = require('../models/Maker');

exports.makerList = function(req, res, next) {
    Maker.find({}).exec((err, result) => {
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
    res.send('NOT IMPLEMENTED YET: maker detail GET');
};
exports.makerCreateGet = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: maker create GET');
};
exports.makerCreatePost = function(req, res, next) {
    res.send('NOT IMPLEMENTED YET: maker create POST');
};
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