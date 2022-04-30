const { model, Schema } = require('mongoose');

const ItemSchema = new Schema({
    maker: { type: Schema.Types.ObjectId, ref: 'Maker', required: true },
    model: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
});

ItemSchema.virtual('name').get(function() {
    let name = '';
    if (this.maker && this.model) {
        name = `${this.maker}, ${this.model}`;
    }
    if (!this.maker || !this.model) {
        name = '';
    }
    return name;
});

ItemSchema.virtual('url').get(function() {
    return `/equipment/item/${this._id}`;
});

module.exports = model('Item', ItemSchema);