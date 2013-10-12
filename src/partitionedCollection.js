var PartitionedCollection = (function(global, Backbone, _){
  'use strict';

  var PartitionedCollection;
  PartitionedCollection = Backbone.Collection.extend({
    groupBy: null,
    _collection: null,

    constructor: function(models, options) {
      this._reset();
      this.groupBy = options.groupBy;
      if (options.comparator !== void 0) { this.comparator = options.comparator; }
      this._collection = new Backbone.Collection();
      this._collection.on('add', this._addGroupModel, this);
      this._collection.on('remove', this._removeGroupModel, this);
    },

    add: function(item) {
      return this._collection.add(item);
    },

    remove: function(item) {
      return this._collection.remove(item);
    },

    set: function(items) {
      return this._collection.set(items);
    },

    _add: function(models, options) {
      return this._set(models, _.defaults(options || {}, {add: true, merge: false, remove: false}));
    },

    _remove: function() {
      Backbone.Collection.prototype.remove.apply(this, arguments);
    },

    _set: function() {
      Backbone.Collection.prototype.set.apply(this, arguments);
    },

    _addGroupModel: function(item) {
      var key = this.groupBy(item);
      var group = this._findOrCreateGroup(key);
      group.values.add(item);
    },

    _removeGroupModel: function(item) {
      var key = this.groupBy(item);
      var group = this._findGroup(key);
      group.values.remove(item);

      if(group.values.length === 0){
        this._remove(group);
      }
    },

    _findOrCreateGroup: function(key) {
      return this._findGroup(key) || this._createGroup(key);
    },

    _findGroup: function(key) {
      return _(this.models).find(function(item){ return item.get('key') === key; });
    },

    _createGroup: function(key) {
      var values = new Backbone.Collection();
      var group = new Backbone.Model({key: key});
      group.values = values;
      this._add(group);
      this._sortGroups();
      return group;
    },

    _sortGroups: function() {
      if (this.comparator) { this.sort({silent: true}); }
    }
  });
  Backbone.PartitionedCollection = PartitionedCollection;

  return PartitionedCollection;
})(this, Backbone, _);
