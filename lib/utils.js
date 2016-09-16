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
    if (!opt.required && newValue.required) newValue = packValueToNonNull(newValue);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJmaWx0ZXJBcmdzIiwidG9Nb25nb29zZUFyZ3MiLCJkZWZhdWx0QXJncyIsIm9wdCIsInBhY2tWYWx1ZVRvTm9uTnVsbCIsInZhbHVlIiwidHlwZSIsImZpbHRlciIsImFyZyIsIm9ubHlJZCIsImlkIiwicGx1cmFsIiwib25seVBsdXJhbCIsIm1hcCIsIm5ld1ZhbHVlIiwiaWRSZXF1aXJlZCIsInJlcXVpcmVkIiwicmVkdWNlIiwiYXJncyIsImtleURlcHRoIiwia2V5Iiwic3BsaXQiLCJsZW5ndGgiLCJkZXB0aCIsImluZGV4Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBU2dCQSxVLEdBQUFBLFU7UUF5QkFDLGMsR0FBQUEsYzs7QUFsQ2hCOztBQUNBOzs7Ozs7QUFFQTs7Ozs7O0FBTU8sU0FBU0QsVUFBVCxDQUFxQkUsV0FBckIsRUFBa0NDLEdBQWxDLEVBQXVDO0FBQzVDQSxRQUFNQSxPQUFPLEVBQWI7QUFDQSxNQUFNQyxxQkFBcUIsU0FBckJBLGtCQUFxQixDQUFDQyxLQUFEO0FBQUEsV0FBWSxzQkFBYyxFQUFkLEVBQWtCQSxLQUFsQixFQUF5QixFQUFDQyxNQUFNLDRCQUFtQkQsTUFBTUMsSUFBekIsQ0FBUCxFQUF6QixDQUFaO0FBQUEsR0FBM0I7QUFDQSxTQUFPLHVCQUFlSixXQUFmLEVBQ0pLLE1BREksQ0FDRyxnQkFBa0I7QUFBQTs7QUFBQSxRQUFoQkMsR0FBZ0I7QUFBQSxRQUFYSCxLQUFXOztBQUN4QixRQUFJRixJQUFJTSxNQUFKLElBQWNELFFBQVEsSUFBdEIsSUFBOEJBLFFBQVEsS0FBMUMsRUFBaUQsT0FBTyxLQUFQO0FBQ2pELFFBQUlMLElBQUlPLEVBQUosS0FBV0YsUUFBUSxJQUFSLElBQWdCQSxRQUFRLEtBQW5DLENBQUosRUFBK0MsT0FBTyxLQUFQO0FBQy9DLFFBQUlMLElBQUlRLE1BQUosSUFBYyxDQUFDTixNQUFNTyxVQUFyQixJQUFtQyxvQkFBVUQsTUFBVixDQUFpQkgsR0FBakIsTUFBMEJBLEdBQWpFLEVBQXNFLE9BQU8sS0FBUDtBQUN0RSxXQUFPLElBQVA7QUFDRCxHQU5JLEVBT0pLLEdBUEksQ0FPQSxpQkFBa0I7QUFBQTs7QUFBQSxRQUFoQkwsR0FBZ0I7QUFBQSxRQUFYSCxLQUFXOztBQUNyQixRQUFJUyxXQUFXLHNCQUFjLEVBQWQsRUFBa0JULEtBQWxCLENBQWY7QUFDQSxRQUFJLENBQUNHLFFBQVEsSUFBUixJQUFnQkEsUUFBUSxLQUF6QixLQUFtQ0wsSUFBSVksVUFBM0MsRUFBdURELFdBQVdWLG1CQUFtQlUsUUFBbkIsQ0FBWDtBQUN2RCxRQUFJLENBQUNYLElBQUlhLFFBQUwsSUFBaUJGLFNBQVNFLFFBQTlCLEVBQXdDRixXQUFXVixtQkFBbUJVLFFBQW5CLENBQVg7QUFDeEMsV0FBTyxDQUFDTixHQUFELEVBQU1NLFFBQU4sQ0FBUDtBQUNELEdBWkksRUFhSkcsTUFiSSxDQWFHLFVBQUNDLElBQUQsU0FBd0I7QUFBQTs7QUFBQSxRQUFoQlYsR0FBZ0I7QUFBQSxRQUFYSCxLQUFXOztBQUM5QixXQUFPLHNCQUFjYSxJQUFkLG9DQUFzQlYsR0FBdEIsRUFBNEJILEtBQTVCLEVBQVA7QUFDRCxHQWZJLEVBZUYsRUFmRSxDQUFQO0FBZ0JEOztBQUVEOzs7O0FBSU8sU0FBU0osY0FBVCxDQUF5QmlCLElBQXpCLEVBQStCO0FBQ3BDO0FBQ0EsTUFBSUMsV0FBVyxFQUFmO0FBQ0EsU0FBTyx1QkFBZUQsSUFBZixFQUFxQkQsTUFBckIsQ0FBNEIsVUFBQ0MsSUFBRCxTQUF3QjtBQUFBOztBQUFBLFFBQWhCRSxHQUFnQjtBQUFBLFFBQVhmLEtBQVc7O0FBQ3pEYyxlQUFXQyxJQUFJQyxLQUFKLENBQVUsR0FBVixDQUFYO0FBQ0EsUUFBSUYsU0FBU0csTUFBVCxLQUFvQixDQUF4QixFQUEyQixPQUFPLHNCQUFjSixJQUFkLG9DQUFzQkUsR0FBdEIsRUFBNEJmLEtBQTVCLEVBQVA7QUFDM0JjLGFBQVNGLE1BQVQsQ0FBZ0IsVUFBQ0MsSUFBRCxFQUFPSyxLQUFQLEVBQWNDLEtBQWQsRUFBd0I7QUFDdEMsVUFBSUEsVUFBVUwsU0FBU0csTUFBVCxHQUFrQixDQUFoQyxFQUFtQztBQUNqQ0osYUFBS0ssS0FBTCxJQUFjbEIsS0FBZDtBQUNBO0FBQ0Q7QUFDRGEsV0FBS0ssS0FBTCxJQUFjTCxLQUFLSyxLQUFMLEtBQWUsRUFBN0I7QUFDQSxhQUFPTCxLQUFLSyxLQUFMLENBQVA7QUFDRCxLQVBELEVBT0dMLElBUEg7QUFRQSxXQUFPQSxJQUFQO0FBQ0QsR0FaTSxFQVlKLEVBWkksQ0FBUDtBQWFEIiwiZmlsZSI6InV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtHcmFwaFFMTm9uTnVsbH0gZnJvbSAnZ3JhcGhxbCdcbmltcG9ydCBwbHVyYWxpemUgZnJvbSAncGx1cmFsaXplJ1xuXG4vKipcbiAqIEZpbHRlciBhcmd1bWVudHMgd2hlbiBkb2luZyBDUlVEXG4gKiBAcGFyYW1zXG4gKiAgLSBkZWZhdWx0QXJncyB7T2JqZWN0fSB0aGUgcmVzdWx0IG9mIGJ1aWxkQXJnc1xuICogIC0gb3B0IHtPYmplY3Qge2ZpbHRlcjoge0Jvb2x9fSBvcHRpb25zOiBpZCwgcGx1cmFsLCByZXF1aXJlZCwgaWRSZXF1aXJlZCwgb25seUlkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJBcmdzIChkZWZhdWx0QXJncywgb3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fVxuICBjb25zdCBwYWNrVmFsdWVUb05vbk51bGwgPSAodmFsdWUpID0+IChPYmplY3QuYXNzaWduKHt9LCB2YWx1ZSwge3R5cGU6IG5ldyBHcmFwaFFMTm9uTnVsbCh2YWx1ZS50eXBlKX0pKVxuICByZXR1cm4gT2JqZWN0LmVudHJpZXMoZGVmYXVsdEFyZ3MpXG4gICAgLmZpbHRlcigoW2FyZywgdmFsdWVdKSA9PiB7XG4gICAgICBpZiAob3B0Lm9ubHlJZCAmJiBhcmcgIT09ICdpZCcgJiYgYXJnICE9PSAnaWRzJykgcmV0dXJuIGZhbHNlXG4gICAgICBpZiAob3B0LmlkICYmIChhcmcgPT09ICdpZCcgfHwgYXJnID09PSAnaWRzJykpIHJldHVybiBmYWxzZVxuICAgICAgaWYgKG9wdC5wbHVyYWwgJiYgIXZhbHVlLm9ubHlQbHVyYWwgJiYgcGx1cmFsaXplLnBsdXJhbChhcmcpID09PSBhcmcpIHJldHVybiBmYWxzZVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9KVxuICAgIC5tYXAoKFthcmcsIHZhbHVlXSkgPT4ge1xuICAgICAgbGV0IG5ld1ZhbHVlID0gT2JqZWN0LmFzc2lnbih7fSwgdmFsdWUpXG4gICAgICBpZiAoKGFyZyA9PT0gJ2lkJyB8fCBhcmcgPT09ICdpZHMnKSAmJiBvcHQuaWRSZXF1aXJlZCkgbmV3VmFsdWUgPSBwYWNrVmFsdWVUb05vbk51bGwobmV3VmFsdWUpXG4gICAgICBpZiAoIW9wdC5yZXF1aXJlZCAmJiBuZXdWYWx1ZS5yZXF1aXJlZCkgbmV3VmFsdWUgPSBwYWNrVmFsdWVUb05vbk51bGwobmV3VmFsdWUpXG4gICAgICByZXR1cm4gW2FyZywgbmV3VmFsdWVdXG4gICAgfSlcbiAgICAucmVkdWNlKChhcmdzLCBbYXJnLCB2YWx1ZV0pID0+IHtcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKGFyZ3MsIHtbYXJnXTogdmFsdWV9KVxuICAgIH0sIHt9KVxufVxuXG4vKipcbiAqIENvbnZlcnQgYXJncyB0aGF0IGdyYXBocWwga25vdyB0byB0aGUgYXJncyB0aGF0IG1vbmdvb3NlIGtub3dcbiAqIHNvIHRoYXQgdGhlIGFyZ3MgY2FuIGJlIHVzZWQgYnkgbW9uZ29vc2UgdG8gZmluZCBvciBjcmVhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvTW9uZ29vc2VBcmdzIChhcmdzKSB7XG4gIC8vIENvdmVydCBuYW1lX2ZpcnN0IHRvIG5hbWU6IHtmaXJzdH1cbiAgbGV0IGtleURlcHRoID0gW11cbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKGFyZ3MpLnJlZHVjZSgoYXJncywgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAga2V5RGVwdGggPSBrZXkuc3BsaXQoJ18nKVxuICAgIGlmIChrZXlEZXB0aC5sZW5ndGggPT09IDEpIHJldHVybiBPYmplY3QuYXNzaWduKGFyZ3MsIHtba2V5XTogdmFsdWV9KVxuICAgIGtleURlcHRoLnJlZHVjZSgoYXJncywgZGVwdGgsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoaW5kZXggPT09IGtleURlcHRoLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgYXJnc1tkZXB0aF0gPSB2YWx1ZVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGFyZ3NbZGVwdGhdID0gYXJnc1tkZXB0aF0gfHwge31cbiAgICAgIHJldHVybiBhcmdzW2RlcHRoXVxuICAgIH0sIGFyZ3MpXG4gICAgcmV0dXJuIGFyZ3NcbiAgfSwge30pXG59XG4iXX0=