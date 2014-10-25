module.exports = function (models, baseClass) {
  var Toot = baseClass();
  Toot.collection = 'toots';

  Toot.defaults = {
    feedId: null,
    url: null,
    published: null,
    author: null,
    content: null
  };

  Toot.id = function (obj) {
    return models.md5(obj.url);
  };

  return Toot;
};
