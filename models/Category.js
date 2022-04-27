const { model, Schema } = require('mongoose');

const CategorySchema = new Schema({
    name: { type: String, required: true, min: 1 }
});

CategorySchema.virtual('url').get(function() {
    return `/category/${this._id}`;
});

module.exports = model('Category', CategorySchema);