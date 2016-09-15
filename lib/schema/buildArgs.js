'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

exports.default = function (type) {
  var fields = type._typeConfig.fields();
  return (0, _entries2.default)(fields).reduce(function (args, _ref) {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

    var key = _ref2[0];
    var field = _ref2[1];

    return (0, _assign2.default)(args, fieldToArg(key, field));
  }, {});
};

var _graphql = require('graphql');

var _customType = require('../type/customType');

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fieldToArg = function fieldToArg(key, field) {
  var typeName = field.type.name || field.type.constructor.name;
  var required = field.required;
  var graphqlType = void 0;
  if (typeName !== 'GraphQLList') {
    graphqlType = nameToType(typeName, field);
    // Custom type for Object attribute in mongoose model. e.g. {name: {first, last}}
    if (!graphqlType) return buildObjectArgs(key, field);
    return buildArgs(key, graphqlType, required);
  } else {
    // Deal with List type
    graphqlType = nameToType(field.type.ofType.name, field);
    return (0, _defineProperty3.default)({}, key, { type: new _graphql.GraphQLList(graphqlType), onlyPlural: true, required: required });
  }
};

/**
 * Generate args based on type's fields
 * @parmas
 *  - tyoe {Object} built graphql type
 * @return
 *  - defaultArgs {Object} argus based on type's fields, including singular and plural
 * @notice
 *  - response has `id` and `ids` instead of _id
 *    mongoose query should convert id to _id or mongoose won't support it
 *  - name.first in Mongoose model will have args 'name_first' and 'name_firsts'
 *    because graphql name convention only support _a-zA-Z0-9
 */


var buildArgs = function buildArgs(key, graphqlType, required) {
  var _ref5;

  if ((0, _keys2.default)(graphqlType).length === 0) return {};
  var plural = _pluralize2.default.plural(key);
  var isPlural = plural === key;
  return isPlural ? (0, _defineProperty3.default)({}, key, { type: new _graphql.GraphQLList(graphqlType), onlyPlural: true, required: required }) : (_ref5 = {}, (0, _defineProperty3.default)(_ref5, key, { type: graphqlType, required: required }), (0, _defineProperty3.default)(_ref5, plural, { type: new _graphql.GraphQLList(graphqlType) }), _ref5);
};

var nameToType = function nameToType(typeName, field) {
  var hasResolve = !!field.resolve;
  switch (typeName) {
    case 'ID':
      return _graphql.GraphQLID;
    case 'String':
      return _graphql.GraphQLString;
    case 'Float':
      return _graphql.GraphQLFloat;
    case 'Boolean':
      return _graphql.GraphQLBoolean;
    case 'Buffer':
      return _customType.GraphQLBuffer;
    case 'Date':
      return _customType.GraphQLDate;
    case 'Mixed':
      return {};
    default:
      if (hasResolve) return _graphql.GraphQLID; // other models, use ID as reference
      return null; // Object attribute in mongoose model
  }
};

// Build args for Object attribute of the mongoose model
var buildObjectArgs = function buildObjectArgs(parentKey, field) {
  var fields = field.type._typeConfig.fields();
  return (0, _entries2.default)(fields).map(function (_ref6) {
    var _ref7 = (0, _slicedToArray3.default)(_ref6, 2);

    var key = _ref7[0];
    var value = _ref7[1];

    return fieldToArg(parentKey + '_' + key, value);
  }).reduce(function (args, myArg) {
    return (0, _assign2.default)(args, myArg);
  }, {});
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWEvYnVpbGRBcmdzLmpzIl0sIm5hbWVzIjpbInR5cGUiLCJmaWVsZHMiLCJfdHlwZUNvbmZpZyIsInJlZHVjZSIsImFyZ3MiLCJrZXkiLCJmaWVsZCIsImZpZWxkVG9BcmciLCJ0eXBlTmFtZSIsIm5hbWUiLCJjb25zdHJ1Y3RvciIsInJlcXVpcmVkIiwiZ3JhcGhxbFR5cGUiLCJuYW1lVG9UeXBlIiwiYnVpbGRPYmplY3RBcmdzIiwiYnVpbGRBcmdzIiwib2ZUeXBlIiwib25seVBsdXJhbCIsImxlbmd0aCIsInBsdXJhbCIsImlzUGx1cmFsIiwiaGFzUmVzb2x2ZSIsInJlc29sdmUiLCJwYXJlbnRLZXkiLCJtYXAiLCJ2YWx1ZSIsIm15QXJnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQkF5QmUsVUFBVUEsSUFBVixFQUFnQjtBQUM3QixNQUFNQyxTQUFTRCxLQUFLRSxXQUFMLENBQWlCRCxNQUFqQixFQUFmO0FBQ0EsU0FBTyx1QkFBZUEsTUFBZixFQUNKRSxNQURJLENBQ0csVUFBQ0MsSUFBRCxRQUF3QjtBQUFBOztBQUFBLFFBQWhCQyxHQUFnQjtBQUFBLFFBQVhDLEtBQVc7O0FBQzlCLFdBQU8sc0JBQWNGLElBQWQsRUFBb0JHLFdBQVdGLEdBQVgsRUFBZ0JDLEtBQWhCLENBQXBCLENBQVA7QUFDRCxHQUhJLEVBR0YsRUFIRSxDQUFQO0FBSUQsQzs7QUEvQkQ7O0FBT0E7O0FBSUE7Ozs7OztBQXNCQSxJQUFNQyxhQUFhLFNBQWJBLFVBQWEsQ0FBQ0YsR0FBRCxFQUFNQyxLQUFOLEVBQWdCO0FBQ2pDLE1BQU1FLFdBQVdGLE1BQU1OLElBQU4sQ0FBV1MsSUFBWCxJQUFtQkgsTUFBTU4sSUFBTixDQUFXVSxXQUFYLENBQXVCRCxJQUEzRDtBQUNBLE1BQU1FLFdBQVdMLE1BQU1LLFFBQXZCO0FBQ0EsTUFBSUMsb0JBQUo7QUFDQSxNQUFJSixhQUFhLGFBQWpCLEVBQWdDO0FBQzlCSSxrQkFBY0MsV0FBV0wsUUFBWCxFQUFxQkYsS0FBckIsQ0FBZDtBQUNBO0FBQ0EsUUFBSSxDQUFDTSxXQUFMLEVBQWtCLE9BQU9FLGdCQUFnQlQsR0FBaEIsRUFBcUJDLEtBQXJCLENBQVA7QUFDbEIsV0FBT1MsVUFBVVYsR0FBVixFQUFlTyxXQUFmLEVBQTRCRCxRQUE1QixDQUFQO0FBQ0QsR0FMRCxNQUtPO0FBQ0w7QUFDQUMsa0JBQWNDLFdBQVdQLE1BQU1OLElBQU4sQ0FBV2dCLE1BQVgsQ0FBa0JQLElBQTdCLEVBQW1DSCxLQUFuQyxDQUFkO0FBQ0EsNkNBQVNELEdBQVQsRUFBZSxFQUFFTCxNQUFNLHlCQUFnQlksV0FBaEIsQ0FBUixFQUFzQ0ssWUFBWSxJQUFsRCxFQUF3RE4sa0JBQXhELEVBQWY7QUFDRDtBQUNGLENBZEQ7O0FBcEJBOzs7Ozs7Ozs7Ozs7OztBQW9DQSxJQUFNSSxZQUFZLFNBQVpBLFNBQVksQ0FBQ1YsR0FBRCxFQUFNTyxXQUFOLEVBQW1CRCxRQUFuQixFQUFnQztBQUFBOztBQUNoRCxNQUFJLG9CQUFZQyxXQUFaLEVBQXlCTSxNQUF6QixLQUFvQyxDQUF4QyxFQUEyQyxPQUFPLEVBQVA7QUFDM0MsTUFBTUMsU0FBUyxvQkFBVUEsTUFBVixDQUFpQmQsR0FBakIsQ0FBZjtBQUNBLE1BQU1lLFdBQVdELFdBQVdkLEdBQTVCO0FBQ0EsU0FBT2UsNkNBQ0RmLEdBREMsRUFDSyxFQUFFTCxNQUFNLHlCQUFnQlksV0FBaEIsQ0FBUixFQUFzQ0ssWUFBWSxJQUFsRCxFQUF3RE4sa0JBQXhELEVBREwsc0RBRUROLEdBRkMsRUFFSyxFQUFFTCxNQUFNWSxXQUFSLEVBQXFCRCxrQkFBckIsRUFGTCx3Q0FFdUNRLE1BRnZDLEVBRWdELEVBQUVuQixNQUFNLHlCQUFnQlksV0FBaEIsQ0FBUixFQUZoRCxTQUFQO0FBR0QsQ0FQRDs7QUFTQSxJQUFNQyxhQUFhLFNBQWJBLFVBQWEsQ0FBQ0wsUUFBRCxFQUFXRixLQUFYLEVBQXFCO0FBQ3RDLE1BQU1lLGFBQWEsQ0FBQyxDQUFDZixNQUFNZ0IsT0FBM0I7QUFDQSxVQUFRZCxRQUFSO0FBQ0UsU0FBSyxJQUFMO0FBQVc7QUFDWCxTQUFLLFFBQUw7QUFBZTtBQUNmLFNBQUssT0FBTDtBQUFjO0FBQ2QsU0FBSyxTQUFMO0FBQWdCO0FBQ2hCLFNBQUssUUFBTDtBQUFlO0FBQ2YsU0FBSyxNQUFMO0FBQWE7QUFDYixTQUFLLE9BQUw7QUFBYyxhQUFPLEVBQVA7QUFDZDtBQUNFLFVBQUlhLFVBQUosRUFBZ0IsMEJBRGxCLENBQ21DO0FBQ2pDLGFBQU8sSUFBUCxDQVZKLENBVWdCO0FBVmhCO0FBWUQsQ0FkRDs7QUFnQkE7QUFDQSxJQUFNUCxrQkFBa0IsU0FBbEJBLGVBQWtCLENBQUNTLFNBQUQsRUFBWWpCLEtBQVosRUFBc0I7QUFDNUMsTUFBTUwsU0FBU0ssTUFBTU4sSUFBTixDQUFXRSxXQUFYLENBQXVCRCxNQUF2QixFQUFmO0FBQ0EsU0FBTyx1QkFBZUEsTUFBZixFQUF1QnVCLEdBQXZCLENBQTJCLGlCQUFrQjtBQUFBOztBQUFBLFFBQWhCbkIsR0FBZ0I7QUFBQSxRQUFYb0IsS0FBVzs7QUFDbEQsV0FBT2xCLFdBQWNnQixTQUFkLFNBQTJCbEIsR0FBM0IsRUFBa0NvQixLQUFsQyxDQUFQO0FBQ0QsR0FGTSxFQUVKdEIsTUFGSSxDQUVHLFVBQUNDLElBQUQsRUFBT3NCLEtBQVA7QUFBQSxXQUFrQixzQkFBY3RCLElBQWQsRUFBb0JzQixLQUFwQixDQUFsQjtBQUFBLEdBRkgsRUFFa0QsRUFGbEQsQ0FBUDtBQUdELENBTEQiLCJmaWxlIjoiYnVpbGRBcmdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgR3JhcGhRTElELFxuICBHcmFwaFFMU3RyaW5nLFxuICBHcmFwaFFMRmxvYXQsXG4gIEdyYXBoUUxCb29sZWFuLFxuICBHcmFwaFFMTGlzdFxufSBmcm9tICdncmFwaHFsJ1xuaW1wb3J0IHtcbiAgR3JhcGhRTEJ1ZmZlcixcbiAgR3JhcGhRTERhdGVcbn0gZnJvbSAnLi4vdHlwZS9jdXN0b21UeXBlJ1xuaW1wb3J0IHBsdXJhbGl6ZSBmcm9tICdwbHVyYWxpemUnXG5cbi8qKlxuICogR2VuZXJhdGUgYXJncyBiYXNlZCBvbiB0eXBlJ3MgZmllbGRzXG4gKiBAcGFybWFzXG4gKiAgLSB0eW9lIHtPYmplY3R9IGJ1aWx0IGdyYXBocWwgdHlwZVxuICogQHJldHVyblxuICogIC0gZGVmYXVsdEFyZ3Mge09iamVjdH0gYXJndXMgYmFzZWQgb24gdHlwZSdzIGZpZWxkcywgaW5jbHVkaW5nIHNpbmd1bGFyIGFuZCBwbHVyYWxcbiAqIEBub3RpY2VcbiAqICAtIHJlc3BvbnNlIGhhcyBgaWRgIGFuZCBgaWRzYCBpbnN0ZWFkIG9mIF9pZFxuICogICAgbW9uZ29vc2UgcXVlcnkgc2hvdWxkIGNvbnZlcnQgaWQgdG8gX2lkIG9yIG1vbmdvb3NlIHdvbid0IHN1cHBvcnQgaXRcbiAqICAtIG5hbWUuZmlyc3QgaW4gTW9uZ29vc2UgbW9kZWwgd2lsbCBoYXZlIGFyZ3MgJ25hbWVfZmlyc3QnIGFuZCAnbmFtZV9maXJzdHMnXG4gKiAgICBiZWNhdXNlIGdyYXBocWwgbmFtZSBjb252ZW50aW9uIG9ubHkgc3VwcG9ydCBfYS16QS1aMC05XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh0eXBlKSB7XG4gIGNvbnN0IGZpZWxkcyA9IHR5cGUuX3R5cGVDb25maWcuZmllbGRzKClcbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKGZpZWxkcylcbiAgICAucmVkdWNlKChhcmdzLCBba2V5LCBmaWVsZF0pID0+IHtcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKGFyZ3MsIGZpZWxkVG9Bcmcoa2V5LCBmaWVsZCkpXG4gICAgfSwge30pXG59XG5cbmNvbnN0IGZpZWxkVG9BcmcgPSAoa2V5LCBmaWVsZCkgPT4ge1xuICBjb25zdCB0eXBlTmFtZSA9IGZpZWxkLnR5cGUubmFtZSB8fCBmaWVsZC50eXBlLmNvbnN0cnVjdG9yLm5hbWVcbiAgY29uc3QgcmVxdWlyZWQgPSBmaWVsZC5yZXF1aXJlZFxuICBsZXQgZ3JhcGhxbFR5cGVcbiAgaWYgKHR5cGVOYW1lICE9PSAnR3JhcGhRTExpc3QnKSB7XG4gICAgZ3JhcGhxbFR5cGUgPSBuYW1lVG9UeXBlKHR5cGVOYW1lLCBmaWVsZClcbiAgICAvLyBDdXN0b20gdHlwZSBmb3IgT2JqZWN0IGF0dHJpYnV0ZSBpbiBtb25nb29zZSBtb2RlbC4gZS5nLiB7bmFtZToge2ZpcnN0LCBsYXN0fX1cbiAgICBpZiAoIWdyYXBocWxUeXBlKSByZXR1cm4gYnVpbGRPYmplY3RBcmdzKGtleSwgZmllbGQpXG4gICAgcmV0dXJuIGJ1aWxkQXJncyhrZXksIGdyYXBocWxUeXBlLCByZXF1aXJlZClcbiAgfSBlbHNlIHtcbiAgICAvLyBEZWFsIHdpdGggTGlzdCB0eXBlXG4gICAgZ3JhcGhxbFR5cGUgPSBuYW1lVG9UeXBlKGZpZWxkLnR5cGUub2ZUeXBlLm5hbWUsIGZpZWxkKVxuICAgIHJldHVybiB7W2tleV06IHsgdHlwZTogbmV3IEdyYXBoUUxMaXN0KGdyYXBocWxUeXBlKSwgb25seVBsdXJhbDogdHJ1ZSwgcmVxdWlyZWQgfX1cbiAgfVxufVxuXG5jb25zdCBidWlsZEFyZ3MgPSAoa2V5LCBncmFwaHFsVHlwZSwgcmVxdWlyZWQpID0+IHtcbiAgaWYgKE9iamVjdC5rZXlzKGdyYXBocWxUeXBlKS5sZW5ndGggPT09IDApIHJldHVybiB7fVxuICBjb25zdCBwbHVyYWwgPSBwbHVyYWxpemUucGx1cmFsKGtleSlcbiAgY29uc3QgaXNQbHVyYWwgPSBwbHVyYWwgPT09IGtleVxuICByZXR1cm4gaXNQbHVyYWxcbiAgICA/IHtba2V5XTogeyB0eXBlOiBuZXcgR3JhcGhRTExpc3QoZ3JhcGhxbFR5cGUpLCBvbmx5UGx1cmFsOiB0cnVlLCByZXF1aXJlZCB9fVxuICAgIDoge1trZXldOiB7IHR5cGU6IGdyYXBocWxUeXBlLCByZXF1aXJlZCB9LCBbcGx1cmFsXTogeyB0eXBlOiBuZXcgR3JhcGhRTExpc3QoZ3JhcGhxbFR5cGUpIH19XG59XG5cbmNvbnN0IG5hbWVUb1R5cGUgPSAodHlwZU5hbWUsIGZpZWxkKSA9PiB7XG4gIGNvbnN0IGhhc1Jlc29sdmUgPSAhIWZpZWxkLnJlc29sdmVcbiAgc3dpdGNoICh0eXBlTmFtZSkge1xuICAgIGNhc2UgJ0lEJzogcmV0dXJuIEdyYXBoUUxJRFxuICAgIGNhc2UgJ1N0cmluZyc6IHJldHVybiBHcmFwaFFMU3RyaW5nXG4gICAgY2FzZSAnRmxvYXQnOiByZXR1cm4gR3JhcGhRTEZsb2F0XG4gICAgY2FzZSAnQm9vbGVhbic6IHJldHVybiBHcmFwaFFMQm9vbGVhblxuICAgIGNhc2UgJ0J1ZmZlcic6IHJldHVybiBHcmFwaFFMQnVmZmVyXG4gICAgY2FzZSAnRGF0ZSc6IHJldHVybiBHcmFwaFFMRGF0ZVxuICAgIGNhc2UgJ01peGVkJzogcmV0dXJuIHt9XG4gICAgZGVmYXVsdDpcbiAgICAgIGlmIChoYXNSZXNvbHZlKSByZXR1cm4gR3JhcGhRTElEIC8vIG90aGVyIG1vZGVscywgdXNlIElEIGFzIHJlZmVyZW5jZVxuICAgICAgcmV0dXJuIG51bGwgLy8gT2JqZWN0IGF0dHJpYnV0ZSBpbiBtb25nb29zZSBtb2RlbFxuICB9XG59XG5cbi8vIEJ1aWxkIGFyZ3MgZm9yIE9iamVjdCBhdHRyaWJ1dGUgb2YgdGhlIG1vbmdvb3NlIG1vZGVsXG5jb25zdCBidWlsZE9iamVjdEFyZ3MgPSAocGFyZW50S2V5LCBmaWVsZCkgPT4ge1xuICBjb25zdCBmaWVsZHMgPSBmaWVsZC50eXBlLl90eXBlQ29uZmlnLmZpZWxkcygpXG4gIHJldHVybiBPYmplY3QuZW50cmllcyhmaWVsZHMpLm1hcCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgcmV0dXJuIGZpZWxkVG9BcmcoYCR7cGFyZW50S2V5fV8ke2tleX1gLCB2YWx1ZSlcbiAgfSkucmVkdWNlKChhcmdzLCBteUFyZykgPT4gKE9iamVjdC5hc3NpZ24oYXJncywgbXlBcmcpKSwge30pXG59XG4iXX0=