define(['../internal/arrayEach', '../internal/baseCallback', '../internal/baseCreate', '../internal/baseForOwn', '../lang/isArray', '../lang/isFunction', '../lang/isObject', '../lang/isTypedArray'], function(arrayEach, baseCallback, baseCreate, baseForOwn, isArray, isFunction, isObject, isTypedArray) {

  /**
   * An alternative to `_.reduce`; this method transforms `object` to a new
   * `accumulator` object which is the result of running each of its own enumerable
   * properties through `iteratee`, with each invocation potentially mutating
   * the `accumulator` object. The `iteratee` is bound to `thisArg` and invoked
   * with four arguments; (accumulator, value, key, object). Iterator functions
   * may exit iteration early by explicitly returning `false`.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Array|Object} object The object to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @param {*} [accumulator] The custom accumulator value.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {*} Returns the accumulated value.
   * @example
   *
   * _.transform([2, 3, 4], function(result, n) {
   *   result.push(n *= n);
   *   return n % 2 == 0;
   * });
   * // => [4, 9]
   *
   * _.transform({ 'a': 1, 'b': 2 }, function(result, n, key) {
   *   result[key] = n * 3;
   * });
   * // => { 'a': 3, 'b': 6 }
   */
  function transform(object, iteratee, accumulator, thisArg) {
    var isArr = isArray(object) || isTypedArray(object);
    iteratee = baseCallback(iteratee, thisArg, 4);

    if (accumulator == null) {
      if (isArr || isObject(object)) {
        var Ctor = object.constructor;
        if (isArr) {
          accumulator = isArray(object) ? new Ctor : [];
        } else {
          accumulator = baseCreate(isFunction(Ctor) && Ctor.prototype);
        }
      } else {
        accumulator = {};
      }
    }
    (isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
      return iteratee(accumulator, value, index, object);
    });
    return accumulator;
  }

  return transform;
});
