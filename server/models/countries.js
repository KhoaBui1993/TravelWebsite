const mongoose = require('mongoose');

const countriesSchema = new mongoose.Schema({
  countries: {
    type: String,
    required: 'This field is required.'
  },
  information: {
    type: String,
    required: 'This field is required.'
  },
  author: {
    type: String,
    required: 'This field is required.'
  },
  thingtodo: {
    type: Array,
    required: 'This field is required.'
  },
  continent: {
    type: String,
    enum: ['Asia', 'NorthAmerica', 'SouthAmerica', 'Europe', 'Australia','Africa'],
    required: 'This field is required.'
  },
  image: {
    type: String,
    required: 'This field is required.'
  },
});

countriesSchema.index({ countries: 'text', author: 'text' });
// WildCard Indexing
//recipeSchema.index({ "$**" : 'text' });

module.exports = mongoose.model('countries', countriesSchema);