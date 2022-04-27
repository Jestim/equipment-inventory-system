const { model, Schema } = require('mongoose');
const { DateTime } = require('luxon');

const ItemInstanceSchema = new Schema({
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    serialNumber: { type: String },
    status: {
        type: String,
        required: true,
        enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
        default: 'Maintenance'
    },
    dueBack: { type: Date, default: Date.now }
});

ItemInstanceSchema.virtual('url').get(function() {
    return `/iteminstance/${this._id}`;
});

ItemInstanceSchema.virtual('dueBackFormatted').get(function() {
    return DateTime.fromJSDate(this.dueBack).toLocaleString(
        DateTime.DATE_MED_WITH_WEEKDAY
    );
});

ItemInstanceSchema.virtual('dueBackHTMLFormatted').get(function() {
    return this.dueBack ? this.dueBack.toLocaleDateString('en-CA') : '';
});

module.exports = model('ItemInstance', ItemInstanceSchema);