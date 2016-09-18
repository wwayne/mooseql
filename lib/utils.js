'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.filterArgs = filterArgs;
exports.toMongooseArgs = toMongooseArgs;
exports.pickoutValue = pickoutValue;

var _graphql = require('graphql');

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Filter arguments when doing CRUD
 * @params
 *  - defaultArgs {Object} the result of buildArgs
 *  - opt {Object {filter: {Bool}} options: id, plural, required, idRequired, onlyId
 */
function filterArgs(defaultArgs, opt) {
  opt = opt || {};
  var packValueToNonNull = function packValueToNonNull(value) {
    return (0, _assign2.default)({}, value, { type: new _graphql.GraphQLNonNull(value.type) });
  };
  return (0, _entries2.default)(defaultArgs).filter(function (_ref) {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

    var arg = _ref2[0];
    var value = _ref2[1];

    if (opt.onlyId && arg !== 'id' && arg !== 'ids') return false;
    if (opt.id && (arg === 'id' || arg === 'ids')) return false;
    if (opt.plural && !value.onlyPlural && _pluralize2.default.plural(arg) === arg) return false;
    return true;
  }).map(function (_ref3) {
    var _ref4 = (0, _slicedToArray3.default)(_ref3, 2);

    var arg = _ref4[0];
    var value = _ref4[1];

    var newValue = (0, _assign2.default)({}, value);
    if ((arg === 'id' || arg === 'ids') && opt.idRequired) newValue = packValueToNonNull(newValue);
    if (!opt.required && newValue.required && !newValue.context) newValue = packValueToNonNull(newValue);
    return [arg, newValue];
  }).reduce(function (args, _ref5) {
    var _ref6 = (0, _slicedToArray3.default)(_ref5, 2);

    var arg = _ref6[0];
    var value = _ref6[1];

    return (0, _assign2.default)(args, (0, _defineProperty3.default)({}, arg, value));
  }, {});
}

/**
 * Convert args that graphql know to the args that mongoose know
 * so that the args can be used by mongoose to find or create
 */
function toMongooseArgs(args) {
  // Covert name_first to name: {first}
  var keyDepth = [];
  return (0, _entries2.default)(args).reduce(function (args, _ref7) {
    var _ref8 = (0, _slicedToArray3.default)(_ref7, 2);

    var key = _ref8[0];
    var value = _ref8[1];

    keyDepth = key.split('_');
    if (keyDepth.length === 1) return (0, _assign2.default)(args, (0, _defineProperty3.default)({}, key, value));
    keyDepth.reduce(function (args, depth, index) {
      if (index === keyDepth.length - 1) {
        args[depth] = value;
        return;
      }
      args[depth] = args[depth] || {};
      return args[depth];
    }, args);
    return args;
  }, {});
}

/**
 * Giving an object and a string, pick out wanted data
 * e.g. user { id: 'test' } and user.id => 'test'
 */
function pickoutValue(target, str) {
  var strDepth = str.split('.');
  var newTarget = target[strDepth[0]];
  if (newTarget === undefined) throw new Error('Cannot find the value');
  if (strDepth.length === 1) return newTarget;
  return pickoutValue(newTarget, strDepth.splice(1).join('.'));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJmaWx0ZXJBcmdzIiwidG9Nb25nb29zZUFyZ3MiLCJwaWNrb3V0VmFsdWUiLCJkZWZhdWx0QXJncyIsIm9wdCIsInBhY2tWYWx1ZVRvTm9uTnVsbCIsInZhbHVlIiwidHlwZSIsImZpbHRlciIsImFyZyIsIm9ubHlJZCIsImlkIiwicGx1cmFsIiwib25seVBsdXJhbCIsIm1hcCIsIm5ld1ZhbHVlIiwiaWRSZXF1aXJlZCIsInJlcXVpcmVkIiwiY29udGV4dCIsInJlZHVjZSIsImFyZ3MiLCJrZXlEZXB0aCIsImtleSIsInNwbGl0IiwibGVuZ3RoIiwiZGVwdGgiLCJpbmRleCIsInRhcmdldCIsInN0ciIsInN0ckRlcHRoIiwibmV3VGFyZ2V0IiwidW5kZWZpbmVkIiwiRXJyb3IiLCJzcGxpY2UiLCJqb2luIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBU2dCQSxVLEdBQUFBLFU7UUF5QkFDLGMsR0FBQUEsYztRQXNCQUMsWSxHQUFBQSxZOztBQXhEaEI7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7QUFNTyxTQUFTRixVQUFULENBQXFCRyxXQUFyQixFQUFrQ0MsR0FBbEMsRUFBdUM7QUFDNUNBLFFBQU1BLE9BQU8sRUFBYjtBQUNBLE1BQU1DLHFCQUFxQixTQUFyQkEsa0JBQXFCLENBQUNDLEtBQUQ7QUFBQSxXQUFZLHNCQUFjLEVBQWQsRUFBa0JBLEtBQWxCLEVBQXlCLEVBQUNDLE1BQU0sNEJBQW1CRCxNQUFNQyxJQUF6QixDQUFQLEVBQXpCLENBQVo7QUFBQSxHQUEzQjtBQUNBLFNBQU8sdUJBQWVKLFdBQWYsRUFDSkssTUFESSxDQUNHLGdCQUFrQjtBQUFBOztBQUFBLFFBQWhCQyxHQUFnQjtBQUFBLFFBQVhILEtBQVc7O0FBQ3hCLFFBQUlGLElBQUlNLE1BQUosSUFBY0QsUUFBUSxJQUF0QixJQUE4QkEsUUFBUSxLQUExQyxFQUFpRCxPQUFPLEtBQVA7QUFDakQsUUFBSUwsSUFBSU8sRUFBSixLQUFXRixRQUFRLElBQVIsSUFBZ0JBLFFBQVEsS0FBbkMsQ0FBSixFQUErQyxPQUFPLEtBQVA7QUFDL0MsUUFBSUwsSUFBSVEsTUFBSixJQUFjLENBQUNOLE1BQU1PLFVBQXJCLElBQW1DLG9CQUFVRCxNQUFWLENBQWlCSCxHQUFqQixNQUEwQkEsR0FBakUsRUFBc0UsT0FBTyxLQUFQO0FBQ3RFLFdBQU8sSUFBUDtBQUNELEdBTkksRUFPSkssR0FQSSxDQU9BLGlCQUFrQjtBQUFBOztBQUFBLFFBQWhCTCxHQUFnQjtBQUFBLFFBQVhILEtBQVc7O0FBQ3JCLFFBQUlTLFdBQVcsc0JBQWMsRUFBZCxFQUFrQlQsS0FBbEIsQ0FBZjtBQUNBLFFBQUksQ0FBQ0csUUFBUSxJQUFSLElBQWdCQSxRQUFRLEtBQXpCLEtBQW1DTCxJQUFJWSxVQUEzQyxFQUF1REQsV0FBV1YsbUJBQW1CVSxRQUFuQixDQUFYO0FBQ3ZELFFBQUksQ0FBQ1gsSUFBSWEsUUFBTCxJQUFpQkYsU0FBU0UsUUFBMUIsSUFBc0MsQ0FBQ0YsU0FBU0csT0FBcEQsRUFBNkRILFdBQVdWLG1CQUFtQlUsUUFBbkIsQ0FBWDtBQUM3RCxXQUFPLENBQUNOLEdBQUQsRUFBTU0sUUFBTixDQUFQO0FBQ0QsR0FaSSxFQWFKSSxNQWJJLENBYUcsVUFBQ0MsSUFBRCxTQUF3QjtBQUFBOztBQUFBLFFBQWhCWCxHQUFnQjtBQUFBLFFBQVhILEtBQVc7O0FBQzlCLFdBQU8sc0JBQWNjLElBQWQsb0NBQXNCWCxHQUF0QixFQUE0QkgsS0FBNUIsRUFBUDtBQUNELEdBZkksRUFlRixFQWZFLENBQVA7QUFnQkQ7O0FBRUQ7Ozs7QUFJTyxTQUFTTCxjQUFULENBQXlCbUIsSUFBekIsRUFBK0I7QUFDcEM7QUFDQSxNQUFJQyxXQUFXLEVBQWY7QUFDQSxTQUFPLHVCQUFlRCxJQUFmLEVBQXFCRCxNQUFyQixDQUE0QixVQUFDQyxJQUFELFNBQXdCO0FBQUE7O0FBQUEsUUFBaEJFLEdBQWdCO0FBQUEsUUFBWGhCLEtBQVc7O0FBQ3pEZSxlQUFXQyxJQUFJQyxLQUFKLENBQVUsR0FBVixDQUFYO0FBQ0EsUUFBSUYsU0FBU0csTUFBVCxLQUFvQixDQUF4QixFQUEyQixPQUFPLHNCQUFjSixJQUFkLG9DQUFzQkUsR0FBdEIsRUFBNEJoQixLQUE1QixFQUFQO0FBQzNCZSxhQUFTRixNQUFULENBQWdCLFVBQUNDLElBQUQsRUFBT0ssS0FBUCxFQUFjQyxLQUFkLEVBQXdCO0FBQ3RDLFVBQUlBLFVBQVVMLFNBQVNHLE1BQVQsR0FBa0IsQ0FBaEMsRUFBbUM7QUFDakNKLGFBQUtLLEtBQUwsSUFBY25CLEtBQWQ7QUFDQTtBQUNEO0FBQ0RjLFdBQUtLLEtBQUwsSUFBY0wsS0FBS0ssS0FBTCxLQUFlLEVBQTdCO0FBQ0EsYUFBT0wsS0FBS0ssS0FBTCxDQUFQO0FBQ0QsS0FQRCxFQU9HTCxJQVBIO0FBUUEsV0FBT0EsSUFBUDtBQUNELEdBWk0sRUFZSixFQVpJLENBQVA7QUFhRDs7QUFFRDs7OztBQUlPLFNBQVNsQixZQUFULENBQXVCeUIsTUFBdkIsRUFBK0JDLEdBQS9CLEVBQW9DO0FBQ3pDLE1BQU1DLFdBQVdELElBQUlMLEtBQUosQ0FBVSxHQUFWLENBQWpCO0FBQ0EsTUFBTU8sWUFBWUgsT0FBT0UsU0FBUyxDQUFULENBQVAsQ0FBbEI7QUFDQSxNQUFJQyxjQUFjQyxTQUFsQixFQUE2QixNQUFNLElBQUlDLEtBQUosQ0FBVSx1QkFBVixDQUFOO0FBQzdCLE1BQUlILFNBQVNMLE1BQVQsS0FBb0IsQ0FBeEIsRUFBMkIsT0FBT00sU0FBUDtBQUMzQixTQUFPNUIsYUFBYTRCLFNBQWIsRUFBd0JELFNBQVNJLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFBbUJDLElBQW5CLENBQXdCLEdBQXhCLENBQXhCLENBQVA7QUFDRCIsImZpbGUiOiJ1dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7R3JhcGhRTE5vbk51bGx9IGZyb20gJ2dyYXBocWwnXG5pbXBvcnQgcGx1cmFsaXplIGZyb20gJ3BsdXJhbGl6ZSdcblxuLyoqXG4gKiBGaWx0ZXIgYXJndW1lbnRzIHdoZW4gZG9pbmcgQ1JVRFxuICogQHBhcmFtc1xuICogIC0gZGVmYXVsdEFyZ3Mge09iamVjdH0gdGhlIHJlc3VsdCBvZiBidWlsZEFyZ3NcbiAqICAtIG9wdCB7T2JqZWN0IHtmaWx0ZXI6IHtCb29sfX0gb3B0aW9uczogaWQsIHBsdXJhbCwgcmVxdWlyZWQsIGlkUmVxdWlyZWQsIG9ubHlJZFxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyQXJncyAoZGVmYXVsdEFyZ3MsIG9wdCkge1xuICBvcHQgPSBvcHQgfHwge31cbiAgY29uc3QgcGFja1ZhbHVlVG9Ob25OdWxsID0gKHZhbHVlKSA9PiAoT2JqZWN0LmFzc2lnbih7fSwgdmFsdWUsIHt0eXBlOiBuZXcgR3JhcGhRTE5vbk51bGwodmFsdWUudHlwZSl9KSlcbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKGRlZmF1bHRBcmdzKVxuICAgIC5maWx0ZXIoKFthcmcsIHZhbHVlXSkgPT4ge1xuICAgICAgaWYgKG9wdC5vbmx5SWQgJiYgYXJnICE9PSAnaWQnICYmIGFyZyAhPT0gJ2lkcycpIHJldHVybiBmYWxzZVxuICAgICAgaWYgKG9wdC5pZCAmJiAoYXJnID09PSAnaWQnIHx8IGFyZyA9PT0gJ2lkcycpKSByZXR1cm4gZmFsc2VcbiAgICAgIGlmIChvcHQucGx1cmFsICYmICF2YWx1ZS5vbmx5UGx1cmFsICYmIHBsdXJhbGl6ZS5wbHVyYWwoYXJnKSA9PT0gYXJnKSByZXR1cm4gZmFsc2VcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSlcbiAgICAubWFwKChbYXJnLCB2YWx1ZV0pID0+IHtcbiAgICAgIGxldCBuZXdWYWx1ZSA9IE9iamVjdC5hc3NpZ24oe30sIHZhbHVlKVxuICAgICAgaWYgKChhcmcgPT09ICdpZCcgfHwgYXJnID09PSAnaWRzJykgJiYgb3B0LmlkUmVxdWlyZWQpIG5ld1ZhbHVlID0gcGFja1ZhbHVlVG9Ob25OdWxsKG5ld1ZhbHVlKVxuICAgICAgaWYgKCFvcHQucmVxdWlyZWQgJiYgbmV3VmFsdWUucmVxdWlyZWQgJiYgIW5ld1ZhbHVlLmNvbnRleHQpIG5ld1ZhbHVlID0gcGFja1ZhbHVlVG9Ob25OdWxsKG5ld1ZhbHVlKVxuICAgICAgcmV0dXJuIFthcmcsIG5ld1ZhbHVlXVxuICAgIH0pXG4gICAgLnJlZHVjZSgoYXJncywgW2FyZywgdmFsdWVdKSA9PiB7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihhcmdzLCB7W2FyZ106IHZhbHVlfSlcbiAgICB9LCB7fSlcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGFyZ3MgdGhhdCBncmFwaHFsIGtub3cgdG8gdGhlIGFyZ3MgdGhhdCBtb25nb29zZSBrbm93XG4gKiBzbyB0aGF0IHRoZSBhcmdzIGNhbiBiZSB1c2VkIGJ5IG1vbmdvb3NlIHRvIGZpbmQgb3IgY3JlYXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b01vbmdvb3NlQXJncyAoYXJncykge1xuICAvLyBDb3ZlcnQgbmFtZV9maXJzdCB0byBuYW1lOiB7Zmlyc3R9XG4gIGxldCBrZXlEZXB0aCA9IFtdXG4gIHJldHVybiBPYmplY3QuZW50cmllcyhhcmdzKS5yZWR1Y2UoKGFyZ3MsIFtrZXksIHZhbHVlXSkgPT4ge1xuICAgIGtleURlcHRoID0ga2V5LnNwbGl0KCdfJylcbiAgICBpZiAoa2V5RGVwdGgubGVuZ3RoID09PSAxKSByZXR1cm4gT2JqZWN0LmFzc2lnbihhcmdzLCB7W2tleV06IHZhbHVlfSlcbiAgICBrZXlEZXB0aC5yZWR1Y2UoKGFyZ3MsIGRlcHRoLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGluZGV4ID09PSBrZXlEZXB0aC5sZW5ndGggLSAxKSB7XG4gICAgICAgIGFyZ3NbZGVwdGhdID0gdmFsdWVcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBhcmdzW2RlcHRoXSA9IGFyZ3NbZGVwdGhdIHx8IHt9XG4gICAgICByZXR1cm4gYXJnc1tkZXB0aF1cbiAgICB9LCBhcmdzKVxuICAgIHJldHVybiBhcmdzXG4gIH0sIHt9KVxufVxuXG4vKipcbiAqIEdpdmluZyBhbiBvYmplY3QgYW5kIGEgc3RyaW5nLCBwaWNrIG91dCB3YW50ZWQgZGF0YVxuICogZS5nLiB1c2VyIHsgaWQ6ICd0ZXN0JyB9IGFuZCB1c2VyLmlkID0+ICd0ZXN0J1xuICovXG5leHBvcnQgZnVuY3Rpb24gcGlja291dFZhbHVlICh0YXJnZXQsIHN0cikge1xuICBjb25zdCBzdHJEZXB0aCA9IHN0ci5zcGxpdCgnLicpXG4gIGNvbnN0IG5ld1RhcmdldCA9IHRhcmdldFtzdHJEZXB0aFswXV1cbiAgaWYgKG5ld1RhcmdldCA9PT0gdW5kZWZpbmVkKSB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBmaW5kIHRoZSB2YWx1ZScpXG4gIGlmIChzdHJEZXB0aC5sZW5ndGggPT09IDEpIHJldHVybiBuZXdUYXJnZXRcbiAgcmV0dXJuIHBpY2tvdXRWYWx1ZShuZXdUYXJnZXQsIHN0ckRlcHRoLnNwbGljZSgxKS5qb2luKCcuJykpXG59XG4iXX0=