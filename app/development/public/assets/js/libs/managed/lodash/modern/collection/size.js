define(['../internal/isLength', '../object/keys'], function(isLength, keys) {

  /**
   * Gets the size of `collection` by returning `collection.length` for
   * array-like values or the number of own enumerable properties for objects.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to inspect.
   * @returns {number} Returns the size of `collection`.
   * @example
   *
   * _.size([1, 2, 3]);
   * // => 3
   *
   * _.size({ 'a': 1, 'b': 2 });
   * // => 2
   *
   * _.size('pebbles');
   * // => 7
   */
  function size(collection) {
    var length = collection ? collection.length : 0;
    return isLength(length) ? length : keys(collection).length;
  }

  return size;
});
