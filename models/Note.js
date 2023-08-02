const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

//const autoIncrement = require('mongoose-plugin-autoinc');

const noteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true,
            unique:true
        },
        text: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticket_Nums',
    start_seq:500
})

/* noteSchema.plugin(autoIncrement.plugin, {
    model: 'Note',
    field: 'ticket',
    startAt: 500,
    incrementBy: 1
  }); */

module.exports = mongoose.model('Note', noteSchema)