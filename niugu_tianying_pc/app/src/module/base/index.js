var BaseView = require('./instance/baseView');
var BaseModel = require('./instance/baseModel');
var BaseRouter = require('./instance/baseRouter');
var storage = require('./store/storage');
module.exports = {
  'BaseView': BaseView,
  'Model': BaseModel,
  'Router': BaseRouter,
  'storage': storage
};
