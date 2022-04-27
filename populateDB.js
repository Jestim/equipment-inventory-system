console.log(
    'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async');
const mongoose = require('mongoose');

const Item = require('./models/Item');
const Maker = require('./models/Maker');
const Category = require('./models/Category');
const ItemInstance = require('./models/ItemInstance');

// const Book = require('./models/book');
// const Author = require('./models/author');
// const Genre = require('./models/genre');
// const BookInstance = require('./models/bookinstance');

const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const items = [];
const makers = [];
const categories = [];
const itemInstances = [];

// const authors = [];
// const genres = [];
// const books = [];
// const bookinstances = [];

function makerCreate(name, cb) {
    const maker = new Maker({ name: name });

    maker.save((err) => {
        if (err) {
            cb(err, null);
            return;
        }

        console.log(`New Maker: ${maker}`);
        makers.push(maker);
        cb(null, maker);
    });
}

function categoryCreate(name, cb) {
    const category = new Category({ name: name });

    category.save((err) => {
        if (err) {
            cb(err, null);
            return;
        }

        console.log(`New Category: ${category}`);
        categories.push(category);
        cb(null, category);
    });
}

function itemCreate(maker, model, description, category, cb) {
    const item = new Item({
        maker: maker,
        model: model,
        description: description,
        category: category
    });

    item.save((err) => {
        if (err) {
            cb(err, null);
            return;
        }

        console.log(`New Item: ${item}`);
        items.push(item);
        cb(null, item);
    });
}

function itemInstanceCreate(item, serialNumber, status, dueBack, cb) {
    const itemInstanceDetail = {
        item: item,
        serialNumber: serialNumber,
        status: status
    };
    if (dueBack) {
        itemInstanceDetail.dueBack = dueBack;
    }

    const itemInstance = new ItemInstance(itemInstanceDetail);

    itemInstance.save((err) => {
        if (err) {
            cb(err, null);
            return;
        }

        console.log(`New ItemInstance: ${itemInstance}`);
        itemInstances.push(itemInstance);
        cb(null, itemInstance);
    });
}

function createMakers(cb) {
    async.series(
        [
            function(callback) {
                makerCreate('Sony', callback);
            },
            function(callback) {
                makerCreate('AKG', callback);
            },
            function(callback) {
                makerCreate('Neumann', callback);
            },
            function(callback) {
                makerCreate('Shure', callback);
            },
            function(callback) {
                makerCreate('Sennheiser', callback);
            },
            function(callback) {
                makerCreate('DPA', callback);
            },
            function(callback) {
                makerCreate('Beyerdynamic', callback);
            },
            function(callback) {
                makerCreate('Seem Audio', callback);
            }
        ],
        cb
    );
}

function createCategories(cb) {
    async.series(
        [
            function(callback) {
                categoryCreate('Microphones', callback);
            },
            function(callback) {
                categoryCreate('Headphones', callback);
            },
            function(callback) {
                categoryCreate('Mixing Consoles', callback);
            },
            function(callback) {
                categoryCreate('Cables', callback);
            },
            function(callback) {
                categoryCreate('Speakers', callback);
            }
        ],
        cb
    );
}

function createItems(cb) {
    async.parallel(
        [
            function(callback) {
                itemCreate(
                    makers[0],
                    'MDR-7506',
                    'Closed Headphones',
                    categories[1],
                    callback
                );
            },
            function(callback) {
                itemCreate(
                    makers[2],
                    'U87',
                    'Large diaphragm condenser microphone',
                    categories[0],
                    callback
                );
            },
            function(callback) {
                itemCreate(
                    makers[7],
                    'Seeport',
                    '8 Channels',
                    categories[2],
                    callback
                );
            }
        ],
        cb
    );
}

function createItemInstances(cb) {
    async.parallel(
        [
            function(callback) {
                itemInstanceCreate(
                    items[0],
                    '12345',
                    'Available',
                    null,
                    callback
                );
            },
            function(callback) {
                itemInstanceCreate(
                    items[0],
                    '23456',
                    'Available',
                    null,
                    callback
                );
            },
            function(callback) {
                itemInstanceCreate(
                    items[1],
                    'ABC123',
                    'Available',
                    null,
                    callback
                );
            },
            function(callback) {
                itemInstanceCreate(
                    items[1],
                    'BCD234',
                    'Available',
                    null,
                    callback
                );
            },
            function(callback) {
                itemInstanceCreate(
                    items[2],
                    '1AB2',
                    'Available',
                    null,
                    callback
                );
            },
            function(callback) {
                itemInstanceCreate(
                    items[2],
                    '2BC3',
                    'Available',
                    null,
                    callback
                );
            }
        ],
        cb
    );
}

async.series(
    [createMakers, createCategories, createItems, createItemInstances],
    // Optional callback
    (err) => {
        if (err) {
            console.log(`FINAL ERR: ${err}`);
        } else {
            console.log(`ItemInstances: ${itemInstances}`);
        }
        // All done, disconnect from database
        mongoose.connection.close();
    }
);