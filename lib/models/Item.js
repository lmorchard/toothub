var _ = require('lodash');
var async = require('async');

module.exports = function (models, baseClass, baseProto) {

  var Item = function () {
    this.init.apply(this, arguments);
  };

  _.extend(Item, baseClass, {
    collection: 'items',
    defaults: {
    },
    id: function (obj) {
      return models.md5(obj.link, obj.guid, obj.title, obj.description);
    }
  });

  _.extend(Item.prototype, baseProto(Item), {
  });

  return Item;
};
