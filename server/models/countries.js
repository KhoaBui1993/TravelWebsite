const mongoose = require('mongoose');

const countriesSchema = new mongoose.Schema({
  continent: {
    type: String,
    enum: ['Asia', 'NorthAmerica', 'SouthAmerica', 'Europe', 'Australia','Africa'],
    required: 'This field is required.'
  },
  countries: {
    type: String,
    required: 'This field is required.'
  },
  place: {
    type: String,
    required: 'This field is required.'
  },
  information: {
    type: String,
    required: 'This field is required.'
  },
  pros: {
    type: String,
  },
  cons: {
    type: String,
  },
  recommendedactivities: {
    type: String,
  },
  image: {
    type: String,
    required: 'This field is required.'
  },
  author: {
    type: String,
  },
  author_id: {
    type: String,
  },
  comment: [
    {
      User_id_comment:{
        type: String,
      },
      User_picture_comment:{
        type: String,
      },
      User_name_comment: {
        type: String,
      },
      User_comment: {
        type: String,
      },
      createAt: {
        type: Date,
      }
    },
  ],
});

countriesSchema.index({ countries: 'text' });
// WildCard Indexing
//recipeSchema.index({ "$**" : 'text' });

module.exports = mongoose.model('countries', countriesSchema);