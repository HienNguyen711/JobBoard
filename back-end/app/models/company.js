'use strict';
const mongoose = require('mongoose');
const commonHelper = require('../helpers/common');
const Countries = require('../../config/variables/countries');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const cntEnum = Countries.map(item => item.code);

let CompanySchema = new Schema({

    name: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    owner: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    members: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }




});



CompanySchema.pre('save', (next) => {
    this.slug = commonHelper.createSlug(this.name);
    next();
});



module.exports = mongoose.model('Company', CompanySchema);