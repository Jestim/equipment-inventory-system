const { model, Schema } = require('mongoose');

const MakerSchema = new Schema({
    name: { type: String, required: true, min: 1 }
});

MakerSchema.virtual('url').get(function() {
    return `/equipment/maker/${this._id}`;
});

module.exports = model('Maker', MakerSchema);