'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
  const packValueToNonNull = value => (0, _assign2.default)({}, value, { type: new _graphql.GraphQLNonNull(value.type) });
  return (0, _entries2.default)(defaultArgs).filter(_ref => {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

    let arg = _ref2[0];
    let value = _ref2[1];

    if (opt.onlyId && arg !== 'id' && arg !== 'ids') return false;
    if (opt.id && (arg === 'id' || arg === 'ids')) return false;
    if (opt.plural && !value.onlyPlural && _pluralize2.default.plural(arg) === arg) return false;
    return true;
  }).map(_ref3 => {
    var _ref4 = (0, _slicedToArray3.default)(_ref3, 2);

    let arg = _ref4[0];
    let value = _ref4[1];

    let newValue = (0, _assign2.default)({}, value);
    if ((arg === 'id' || arg === 'ids') && opt.idRequired) newValue = packValueToNonNull(newValue);
    if (!opt.required && newValue.required && !newValue.context) newValue = packValueToNonNull(newValue);
    return [arg, newValue];
  }).reduce((args, _ref5) => {
    var _ref6 = (0, _slicedToArray3.default)(_ref5, 2);

    let arg = _ref6[0];
    let value = _ref6[1];

    return (0, _assign2.default)(args, { [arg]: value });
  }, {});
}

/**
 * Convert args that graphql know to the args that mongoose know
 * so that the args can be used by mongoose to find or create
 */
function toMongooseArgs(args) {
  // Covert name_first to name: {first}
  let keyDepth = [];
  return (0, _entries2.default)(args).reduce((args, _ref7) => {
    var _ref8 = (0, _slicedToArray3.default)(_ref7, 2);

    let key = _ref8[0];
    let value = _ref8[1];

    keyDepth = key.split('_');
    if (keyDepth.length === 1) return (0, _assign2.default)(args, { [key]: value });
    keyDepth.reduce((args, depth, index) => {
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
  const strDepth = str.split('.');
  const newTarget = target[strDepth[0]];
  if (newTarget === undefined) throw new Error('Cannot find the value');
  if (strDepth.length === 1) return newTarget;
  return pickoutValue(newTarget, strDepth.splice(1).join('.'));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJmaWx0ZXJBcmdzIiwidG9Nb25nb29zZUFyZ3MiLCJwaWNrb3V0VmFsdWUiLCJkZWZhdWx0QXJncyIsIm9wdCIsInBhY2tWYWx1ZVRvTm9uTnVsbCIsInZhbHVlIiwidHlwZSIsImZpbHRlciIsImFyZyIsIm9ubHlJZCIsImlkIiwicGx1cmFsIiwib25seVBsdXJhbCIsIm1hcCIsIm5ld1ZhbHVlIiwiaWRSZXF1aXJlZCIsInJlcXVpcmVkIiwiY29udGV4dCIsInJlZHVjZSIsImFyZ3MiLCJrZXlEZXB0aCIsImtleSIsInNwbGl0IiwibGVuZ3RoIiwiZGVwdGgiLCJpbmRleCIsInRhcmdldCIsInN0ciIsInN0ckRlcHRoIiwibmV3VGFyZ2V0IiwidW5kZWZpbmVkIiwiRXJyb3IiLCJzcGxpY2UiLCJqb2luIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFTZ0JBLFUsR0FBQUEsVTtRQXlCQUMsYyxHQUFBQSxjO1FBc0JBQyxZLEdBQUFBLFk7O0FBeERoQjs7QUFDQTs7Ozs7O0FBRUE7Ozs7OztBQU1PLFNBQVNGLFVBQVQsQ0FBcUJHLFdBQXJCLEVBQWtDQyxHQUFsQyxFQUF1QztBQUM1Q0EsUUFBTUEsT0FBTyxFQUFiO0FBQ0EsUUFBTUMscUJBQXNCQyxLQUFELElBQVksc0JBQWMsRUFBZCxFQUFrQkEsS0FBbEIsRUFBeUIsRUFBQ0MsTUFBTSw0QkFBbUJELE1BQU1DLElBQXpCLENBQVAsRUFBekIsQ0FBdkM7QUFDQSxTQUFPLHVCQUFlSixXQUFmLEVBQ0pLLE1BREksQ0FDRyxRQUFrQjtBQUFBOztBQUFBLFFBQWhCQyxHQUFnQjtBQUFBLFFBQVhILEtBQVc7O0FBQ3hCLFFBQUlGLElBQUlNLE1BQUosSUFBY0QsUUFBUSxJQUF0QixJQUE4QkEsUUFBUSxLQUExQyxFQUFpRCxPQUFPLEtBQVA7QUFDakQsUUFBSUwsSUFBSU8sRUFBSixLQUFXRixRQUFRLElBQVIsSUFBZ0JBLFFBQVEsS0FBbkMsQ0FBSixFQUErQyxPQUFPLEtBQVA7QUFDL0MsUUFBSUwsSUFBSVEsTUFBSixJQUFjLENBQUNOLE1BQU1PLFVBQXJCLElBQW1DLG9CQUFVRCxNQUFWLENBQWlCSCxHQUFqQixNQUEwQkEsR0FBakUsRUFBc0UsT0FBTyxLQUFQO0FBQ3RFLFdBQU8sSUFBUDtBQUNELEdBTkksRUFPSkssR0FQSSxDQU9BLFNBQWtCO0FBQUE7O0FBQUEsUUFBaEJMLEdBQWdCO0FBQUEsUUFBWEgsS0FBVzs7QUFDckIsUUFBSVMsV0FBVyxzQkFBYyxFQUFkLEVBQWtCVCxLQUFsQixDQUFmO0FBQ0EsUUFBSSxDQUFDRyxRQUFRLElBQVIsSUFBZ0JBLFFBQVEsS0FBekIsS0FBbUNMLElBQUlZLFVBQTNDLEVBQXVERCxXQUFXVixtQkFBbUJVLFFBQW5CLENBQVg7QUFDdkQsUUFBSSxDQUFDWCxJQUFJYSxRQUFMLElBQWlCRixTQUFTRSxRQUExQixJQUFzQyxDQUFDRixTQUFTRyxPQUFwRCxFQUE2REgsV0FBV1YsbUJBQW1CVSxRQUFuQixDQUFYO0FBQzdELFdBQU8sQ0FBQ04sR0FBRCxFQUFNTSxRQUFOLENBQVA7QUFDRCxHQVpJLEVBYUpJLE1BYkksQ0FhRyxDQUFDQyxJQUFELFlBQXdCO0FBQUE7O0FBQUEsUUFBaEJYLEdBQWdCO0FBQUEsUUFBWEgsS0FBVzs7QUFDOUIsV0FBTyxzQkFBY2MsSUFBZCxFQUFvQixFQUFDLENBQUNYLEdBQUQsR0FBT0gsS0FBUixFQUFwQixDQUFQO0FBQ0QsR0FmSSxFQWVGLEVBZkUsQ0FBUDtBQWdCRDs7QUFFRDs7OztBQUlPLFNBQVNMLGNBQVQsQ0FBeUJtQixJQUF6QixFQUErQjtBQUNwQztBQUNBLE1BQUlDLFdBQVcsRUFBZjtBQUNBLFNBQU8sdUJBQWVELElBQWYsRUFBcUJELE1BQXJCLENBQTRCLENBQUNDLElBQUQsWUFBd0I7QUFBQTs7QUFBQSxRQUFoQkUsR0FBZ0I7QUFBQSxRQUFYaEIsS0FBVzs7QUFDekRlLGVBQVdDLElBQUlDLEtBQUosQ0FBVSxHQUFWLENBQVg7QUFDQSxRQUFJRixTQUFTRyxNQUFULEtBQW9CLENBQXhCLEVBQTJCLE9BQU8sc0JBQWNKLElBQWQsRUFBb0IsRUFBQyxDQUFDRSxHQUFELEdBQU9oQixLQUFSLEVBQXBCLENBQVA7QUFDM0JlLGFBQVNGLE1BQVQsQ0FBZ0IsQ0FBQ0MsSUFBRCxFQUFPSyxLQUFQLEVBQWNDLEtBQWQsS0FBd0I7QUFDdEMsVUFBSUEsVUFBVUwsU0FBU0csTUFBVCxHQUFrQixDQUFoQyxFQUFtQztBQUNqQ0osYUFBS0ssS0FBTCxJQUFjbkIsS0FBZDtBQUNBO0FBQ0Q7QUFDRGMsV0FBS0ssS0FBTCxJQUFjTCxLQUFLSyxLQUFMLEtBQWUsRUFBN0I7QUFDQSxhQUFPTCxLQUFLSyxLQUFMLENBQVA7QUFDRCxLQVBELEVBT0dMLElBUEg7QUFRQSxXQUFPQSxJQUFQO0FBQ0QsR0FaTSxFQVlKLEVBWkksQ0FBUDtBQWFEOztBQUVEOzs7O0FBSU8sU0FBU2xCLFlBQVQsQ0FBdUJ5QixNQUF2QixFQUErQkMsR0FBL0IsRUFBb0M7QUFDekMsUUFBTUMsV0FBV0QsSUFBSUwsS0FBSixDQUFVLEdBQVYsQ0FBakI7QUFDQSxRQUFNTyxZQUFZSCxPQUFPRSxTQUFTLENBQVQsQ0FBUCxDQUFsQjtBQUNBLE1BQUlDLGNBQWNDLFNBQWxCLEVBQTZCLE1BQU0sSUFBSUMsS0FBSixDQUFVLHVCQUFWLENBQU47QUFDN0IsTUFBSUgsU0FBU0wsTUFBVCxLQUFvQixDQUF4QixFQUEyQixPQUFPTSxTQUFQO0FBQzNCLFNBQU81QixhQUFhNEIsU0FBYixFQUF3QkQsU0FBU0ksTUFBVCxDQUFnQixDQUFoQixFQUFtQkMsSUFBbkIsQ0FBd0IsR0FBeEIsQ0FBeEIsQ0FBUDtBQUNEIiwiZmlsZSI6InV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtHcmFwaFFMTm9uTnVsbH0gZnJvbSAnZ3JhcGhxbCdcbmltcG9ydCBwbHVyYWxpemUgZnJvbSAncGx1cmFsaXplJ1xuXG4vKipcbiAqIEZpbHRlciBhcmd1bWVudHMgd2hlbiBkb2luZyBDUlVEXG4gKiBAcGFyYW1zXG4gKiAgLSBkZWZhdWx0QXJncyB7T2JqZWN0fSB0aGUgcmVzdWx0IG9mIGJ1aWxkQXJnc1xuICogIC0gb3B0IHtPYmplY3Qge2ZpbHRlcjoge0Jvb2x9fSBvcHRpb25zOiBpZCwgcGx1cmFsLCByZXF1aXJlZCwgaWRSZXF1aXJlZCwgb25seUlkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJBcmdzIChkZWZhdWx0QXJncywgb3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fVxuICBjb25zdCBwYWNrVmFsdWVUb05vbk51bGwgPSAodmFsdWUpID0+IChPYmplY3QuYXNzaWduKHt9LCB2YWx1ZSwge3R5cGU6IG5ldyBHcmFwaFFMTm9uTnVsbCh2YWx1ZS50eXBlKX0pKVxuICByZXR1cm4gT2JqZWN0LmVudHJpZXMoZGVmYXVsdEFyZ3MpXG4gICAgLmZpbHRlcigoW2FyZywgdmFsdWVdKSA9PiB7XG4gICAgICBpZiAob3B0Lm9ubHlJZCAmJiBhcmcgIT09ICdpZCcgJiYgYXJnICE9PSAnaWRzJykgcmV0dXJuIGZhbHNlXG4gICAgICBpZiAob3B0LmlkICYmIChhcmcgPT09ICdpZCcgfHwgYXJnID09PSAnaWRzJykpIHJldHVybiBmYWxzZVxuICAgICAgaWYgKG9wdC5wbHVyYWwgJiYgIXZhbHVlLm9ubHlQbHVyYWwgJiYgcGx1cmFsaXplLnBsdXJhbChhcmcpID09PSBhcmcpIHJldHVybiBmYWxzZVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9KVxuICAgIC5tYXAoKFthcmcsIHZhbHVlXSkgPT4ge1xuICAgICAgbGV0IG5ld1ZhbHVlID0gT2JqZWN0LmFzc2lnbih7fSwgdmFsdWUpXG4gICAgICBpZiAoKGFyZyA9PT0gJ2lkJyB8fCBhcmcgPT09ICdpZHMnKSAmJiBvcHQuaWRSZXF1aXJlZCkgbmV3VmFsdWUgPSBwYWNrVmFsdWVUb05vbk51bGwobmV3VmFsdWUpXG4gICAgICBpZiAoIW9wdC5yZXF1aXJlZCAmJiBuZXdWYWx1ZS5yZXF1aXJlZCAmJiAhbmV3VmFsdWUuY29udGV4dCkgbmV3VmFsdWUgPSBwYWNrVmFsdWVUb05vbk51bGwobmV3VmFsdWUpXG4gICAgICByZXR1cm4gW2FyZywgbmV3VmFsdWVdXG4gICAgfSlcbiAgICAucmVkdWNlKChhcmdzLCBbYXJnLCB2YWx1ZV0pID0+IHtcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKGFyZ3MsIHtbYXJnXTogdmFsdWV9KVxuICAgIH0sIHt9KVxufVxuXG4vKipcbiAqIENvbnZlcnQgYXJncyB0aGF0IGdyYXBocWwga25vdyB0byB0aGUgYXJncyB0aGF0IG1vbmdvb3NlIGtub3dcbiAqIHNvIHRoYXQgdGhlIGFyZ3MgY2FuIGJlIHVzZWQgYnkgbW9uZ29vc2UgdG8gZmluZCBvciBjcmVhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvTW9uZ29vc2VBcmdzIChhcmdzKSB7XG4gIC8vIENvdmVydCBuYW1lX2ZpcnN0IHRvIG5hbWU6IHtmaXJzdH1cbiAgbGV0IGtleURlcHRoID0gW11cbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKGFyZ3MpLnJlZHVjZSgoYXJncywgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAga2V5RGVwdGggPSBrZXkuc3BsaXQoJ18nKVxuICAgIGlmIChrZXlEZXB0aC5sZW5ndGggPT09IDEpIHJldHVybiBPYmplY3QuYXNzaWduKGFyZ3MsIHtba2V5XTogdmFsdWV9KVxuICAgIGtleURlcHRoLnJlZHVjZSgoYXJncywgZGVwdGgsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoaW5kZXggPT09IGtleURlcHRoLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgYXJnc1tkZXB0aF0gPSB2YWx1ZVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGFyZ3NbZGVwdGhdID0gYXJnc1tkZXB0aF0gfHwge31cbiAgICAgIHJldHVybiBhcmdzW2RlcHRoXVxuICAgIH0sIGFyZ3MpXG4gICAgcmV0dXJuIGFyZ3NcbiAgfSwge30pXG59XG5cbi8qKlxuICogR2l2aW5nIGFuIG9iamVjdCBhbmQgYSBzdHJpbmcsIHBpY2sgb3V0IHdhbnRlZCBkYXRhXG4gKiBlLmcuIHVzZXIgeyBpZDogJ3Rlc3QnIH0gYW5kIHVzZXIuaWQgPT4gJ3Rlc3QnXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwaWNrb3V0VmFsdWUgKHRhcmdldCwgc3RyKSB7XG4gIGNvbnN0IHN0ckRlcHRoID0gc3RyLnNwbGl0KCcuJylcbiAgY29uc3QgbmV3VGFyZ2V0ID0gdGFyZ2V0W3N0ckRlcHRoWzBdXVxuICBpZiAobmV3VGFyZ2V0ID09PSB1bmRlZmluZWQpIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGZpbmQgdGhlIHZhbHVlJylcbiAgaWYgKHN0ckRlcHRoLmxlbmd0aCA9PT0gMSkgcmV0dXJuIG5ld1RhcmdldFxuICByZXR1cm4gcGlja291dFZhbHVlKG5ld1RhcmdldCwgc3RyRGVwdGguc3BsaWNlKDEpLmpvaW4oJy4nKSlcbn1cbiJdfQ==