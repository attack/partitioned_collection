describe('PartitionedCollection', function () {
  'use strict';

  var partitionedCollection, item;
  var firstLetterAsUpperCase, alphaOrder;
  var mapGroupKeys, findGroupByKey;

  beforeEach(function() {
    firstLetterAsUpperCase = function(item) {
      return item.get('name').slice(0,1).toUpperCase();
    };

    alphaOrder = function(item) {
      return item.get('key');
    };
  });

  mapGroupKeys = function(collection) {
    return collection.map(function(item){ return item.get('key'); });
  };

  findGroupByKey = function(collection, key) {
    return collection.find(function(item){ return item.get('key') === key; });
  };

  describe('#add', function() {
    describe('when no groups exist', function() {
      beforeEach(function() {
        item = new Backbone.Model({name: 'foo'});
        partitionedCollection = new Backbone.PartitionedCollection([], {
          groupBy: firstLetterAsUpperCase
        });
      });

      it('creates the group', function() {
        partitionedCollection.add(item);
        expect(partitionedCollection.models.length).toEqual(1);
        expect(mapGroupKeys(partitionedCollection)).toEqual(['F']);
      });

      it('adds the item to the group', function() {
        partitionedCollection.add(item);
        var group = findGroupByKey(partitionedCollection, 'F');
        expect(group.values.models).toContain(item);
      });
    });

    describe('when the correct group exists', function() {
      beforeEach(function() {
        item = new Backbone.Model({name: 'bar'});

        var exisitingItem = new Backbone.Model({name: 'baz'});
        partitionedCollection = new Backbone.PartitionedCollection([], {
          groupBy: firstLetterAsUpperCase
        });
        partitionedCollection.add(exisitingItem);
      });

      it('does not create a new group', function() {
        partitionedCollection.add(item);
        expect(partitionedCollection.models.length).toEqual(1);
        expect(mapGroupKeys(partitionedCollection)).toEqual(['B']);
      });

      it('adds the item to the group', function() {
        partitionedCollection.add(item);
        var group = findGroupByKey(partitionedCollection, 'B');
        expect(group.values.length).toEqual(2);
        expect(group.values.models).toContain(item);
      });
    });

    describe('when the wrong group exists', function() {
      beforeEach(function() {
        item = new Backbone.Model({name: 'bar'});

        var exisitingItem = new Backbone.Model({name: 'foo'});
        partitionedCollection = new Backbone.PartitionedCollection([], {
          groupBy: firstLetterAsUpperCase,
          comparator: alphaOrder
        });
        partitionedCollection.add(exisitingItem);
      });

      it('creates the group', function() {
        partitionedCollection.add(item);
        expect(partitionedCollection.models.length).toEqual(2);
      });

      it('keeps the groups ordered using the comparator', function() {
        partitionedCollection.add(item);
        expect(mapGroupKeys(partitionedCollection)).toEqual(['B', 'F']);
      });
    });
  });

  describe('#remove', function() {
    describe('when the group has multiple items', function() {
      beforeEach(function() {
        item = new Backbone.Model({name: 'bar'});

        var exisitingItem = new Backbone.Model({name: 'baz'});
        partitionedCollection = new Backbone.PartitionedCollection([], {
          groupBy: firstLetterAsUpperCase
        });
        partitionedCollection.add(exisitingItem);
        partitionedCollection.add(item);
      });

      it('removes the item', function() {
        partitionedCollection.remove(item);

        var group = findGroupByKey(partitionedCollection, 'B');
        expect(group.values.models.length).toEqual(1);
        expect(group.values.models).not.toContain(item);
      });
    });

    describe('when the group has one item', function() {
      beforeEach(function() {
        item = new Backbone.Model({name: 'bar'});

        partitionedCollection = new Backbone.PartitionedCollection([], {
          groupBy: firstLetterAsUpperCase
        });
        partitionedCollection.add(item);
      });

      it('removes the group', function() {
        partitionedCollection.remove(item);
        var group = findGroupByKey(partitionedCollection, 'B');
        expect(group).toEqual(null);
      });
    });
  });

  describe('#reset', function() {
    beforeEach(function() {
      item = new Backbone.Model({name: 'foo'});

      var exisitingItem = new Backbone.Model({name: 'bar'});
      partitionedCollection = new Backbone.PartitionedCollection([], {
        groupBy: firstLetterAsUpperCase
      });
      partitionedCollection.add(exisitingItem);
    });

    it('replaces the groups', function() {
      partitionedCollection.reset([item]);
      expect(mapGroupKeys(partitionedCollection)).toEqual(['F']);
    });

    it('adds the item to the new group', function() {
      partitionedCollection.reset([item]);
      var group = findGroupByKey(partitionedCollection, 'F');
      expect(group.values.length).toEqual(1);
      expect(group.values.models).toContain(item);
    });
  });
});
