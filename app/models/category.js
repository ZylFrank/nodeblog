/**
 * Created by Administrator on 2017/2/11.
 */
// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: { type:String, require:true},
  slug: { type:String, require:true},
  created: { type:Date}

});

/*CategorySchema.virtual('date')
 .get(function(){
 return this._id.getTimestamp();
 });*/

mongoose.model('Category', CategorySchema);

