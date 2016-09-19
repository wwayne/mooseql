'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

exports.default = function (type) {
  const fields = type._typeConfig.fields();
  return (0, _entries2.default)(fields).reduce((args, _ref) => {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

    let key = _ref2[0];
    let field = _ref2[1];

    return (0, _assign2.default)(args, fieldToArg(key, field));
  }, {});
};

var _graphql = require('graphql');

var _customType = require('../type/customType');

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fieldToArg = (key, field) => {
  const typeName = field.type.name || field.type.constructor.name;
  const required = field.required;
  const ref = field.ref;
  const context = field.context;

  let graphqlType;
  if (typeName !== 'GraphQLList') {
    graphqlType = nameToType(typeName, field);
    // Custom type for Object attribute in mongoose model. e.g. {name: {first, last}}
    if (!graphqlType) return buildObjectArgs(key, field);
    return buildArgs(key, graphqlType, { required: required, ref: ref, context: context });
  } else {
    // Deal with List type
    graphqlType = nameToType(field.type.ofType.name, field);
    return { [key]: { type: new _graphql.GraphQLList(graphqlType), onlyPlural: true, required: required, ref: ref, context: context } };
  }
};

/**
 * Generate args based on type's fields
 * @parmas
 *  - type {Object} built graphql type
 * @return
 *  - defaultArgs {Object} argus based on type's fields, including singular and plural
 * @notice
 *  - response has `id` and `ids` instead of _id
 *    mongoose query should convert id to _id or mongoose won't support it
 *  - name.first in Mongoose model will have args 'name_first' and 'name_firsts'
 *    because graphql name convention only support _a-zA-Z0-9
 */


const buildArgs = (key, graphqlType, _ref3) => {
  let required = _ref3.required;
  let ref = _ref3.ref;
  let context = _ref3.context;

  if ((0, _keys2.default)(graphqlType).length === 0) return {};
  const plural = _pluralize2.default.plural(key);
  const isPlural = plural === key;
  return isPlural ? { [key]: { type: new _graphql.GraphQLList(graphqlType), onlyPlural: true, required: required, ref: ref, context: context } } : { [key]: { type: graphqlType, required: required, ref: ref, context: context }, [plural]: { type: new _graphql.GraphQLList(graphqlType) } };
};

const nameToType = (typeName, field) => {
  const hasResolve = !!field.resolve;
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
const buildObjectArgs = (parentKey, field) => {
  const fields = field.type._typeConfig.fields();
  return (0, _entries2.default)(fields).map(_ref4 => {
    var _ref5 = (0, _slicedToArray3.default)(_ref4, 2);

    let key = _ref5[0];
    let value = _ref5[1];

    return fieldToArg(`${ parentKey }_${ key }`, value);
  }).reduce((args, myArg) => (0, _assign2.default)(args, myArg), {});
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWEvYnVpbGRBcmdzLmpzIl0sIm5hbWVzIjpbInR5cGUiLCJmaWVsZHMiLCJfdHlwZUNvbmZpZyIsInJlZHVjZSIsImFyZ3MiLCJrZXkiLCJmaWVsZCIsImZpZWxkVG9BcmciLCJ0eXBlTmFtZSIsIm5hbWUiLCJjb25zdHJ1Y3RvciIsInJlcXVpcmVkIiwicmVmIiwiY29udGV4dCIsImdyYXBocWxUeXBlIiwibmFtZVRvVHlwZSIsImJ1aWxkT2JqZWN0QXJncyIsImJ1aWxkQXJncyIsIm9mVHlwZSIsIm9ubHlQbHVyYWwiLCJsZW5ndGgiLCJwbHVyYWwiLCJpc1BsdXJhbCIsImhhc1Jlc29sdmUiLCJyZXNvbHZlIiwicGFyZW50S2V5IiwibWFwIiwidmFsdWUiLCJteUFyZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQkF5QmUsVUFBVUEsSUFBVixFQUFnQjtBQUM3QixRQUFNQyxTQUFTRCxLQUFLRSxXQUFMLENBQWlCRCxNQUFqQixFQUFmO0FBQ0EsU0FBTyx1QkFBZUEsTUFBZixFQUNKRSxNQURJLENBQ0csQ0FBQ0MsSUFBRCxXQUF3QjtBQUFBOztBQUFBLFFBQWhCQyxHQUFnQjtBQUFBLFFBQVhDLEtBQVc7O0FBQzlCLFdBQU8sc0JBQWNGLElBQWQsRUFBb0JHLFdBQVdGLEdBQVgsRUFBZ0JDLEtBQWhCLENBQXBCLENBQVA7QUFDRCxHQUhJLEVBR0YsRUFIRSxDQUFQO0FBSUQsQzs7QUEvQkQ7O0FBT0E7O0FBSUE7Ozs7OztBQXNCQSxNQUFNQyxhQUFhLENBQUNGLEdBQUQsRUFBTUMsS0FBTixLQUFnQjtBQUNqQyxRQUFNRSxXQUFXRixNQUFNTixJQUFOLENBQVdTLElBQVgsSUFBbUJILE1BQU1OLElBQU4sQ0FBV1UsV0FBWCxDQUF1QkQsSUFBM0Q7QUFEaUMsUUFFekJFLFFBRnlCLEdBRUVMLEtBRkYsQ0FFekJLLFFBRnlCO0FBQUEsUUFFZkMsR0FGZSxHQUVFTixLQUZGLENBRWZNLEdBRmU7QUFBQSxR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d0IsS0FBcEIsQ0FGckIsRUFFa0QsRUFGbEQsQ0FBUDtBQUdELENBTEQiLCJmaWxlIjoiYnVpbGRBcmdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgR3JhcGhRTElELFxuICBHcmFwaFFMU3RyaW5nLFxuICBHcmFwaFFMRmxvYXQsXG4gIEdyYXBoUUxCb29sZWFuLFxuICBHcmFwaFFMTGlzdFxufSBmcm9tICdncmFwaHFsJ1xuaW1wb3J0IHtcbiAgR3JhcGhRTEJ1ZmZlcixcbiAgR3JhcGhRTERhdGVcbn0gZnJvbSAnLi4vdHlwZS9jdXN0b21UeXBlJ1xuaW1wb3J0IHBsdXJhbGl6ZSBmcm9tICdwbHVyYWxpemUnXG5cbi8qKlxuICogR2VuZXJhdGUgYXJncyBiYXNlZCBvbiB0eXBlJ3MgZmllbGRzXG4gKiBAcGFybWFzXG4gKiAgLSB0eXBlIHtPYmplY3R9IGJ1aWx0IGdyYXBocWwgdHlwZVxuICogQHJldHVyblxuICogIC0gZGVmYXVsdEFyZ3Mge09iamVjdH0gYXJndXMgYmFzZWQgb24gdHlwZSdzIGZpZWxkcywgaW5jbHVkaW5nIHNpbmd1bGFyIGFuZCBwbHVyYWxcbiAqIEBub3RpY2VcbiAqICAtIHJlc3BvbnNlIGhhcyBgaWRgIGFuZCBgaWRzYCBpbnN0ZWFkIG9mIF9pZFxuICogICAgbW9uZ29vc2UgcXVlcnkgc2hvdWxkIGNvbnZlcnQgaWQgdG8gX2lkIG9yIG1vbmdvb3NlIHdvbid0IHN1cHBvcnQgaXRcbiAqICAtIG5hbWUuZmlyc3QgaW4gTW9uZ29vc2UgbW9kZWwgd2lsbCBoYXZlIGFyZ3MgJ25hbWVfZmlyc3QnIGFuZCAnbmFtZV9maXJzdHMnXG4gKiAgICBiZWNhdXNlIGdyYXBocWwgbmFtZSBjb252ZW50aW9uIG9ubHkgc3VwcG9ydCBfYS16QS1aMC05XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh0eXBlKSB7XG4gIGNvbnN0IGZpZWxkcyA9IHR5cGUuX3R5cGVDb25maWcuZmllbGRzKClcbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKGZpZWxkcylcbiAgICAucmVkdWNlKChhcmdzLCBba2V5LCBmaWVsZF0pID0+IHtcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKGFyZ3MsIGZpZWxkVG9Bcmcoa2V5LCBmaWVsZCkpXG4gICAgfSwge30pXG59XG5cbmNvbnN0IGZpZWxkVG9BcmcgPSAoa2V5LCBmaWVsZCkgPT4ge1xuICBjb25zdCB0eXBlTmFtZSA9IGZpZWxkLnR5cGUubmFtZSB8fCBmaWVsZC50eXBlLmNvbnN0cnVjdG9yLm5hbWVcbiAgY29uc3QgeyByZXF1aXJlZCwgcmVmLCBjb250ZXh0IH0gPSBmaWVsZFxuICBsZXQgZ3JhcGhxbFR5cGVcbiAgaWYgKHR5cGVOYW1lICE9PSAnR3JhcGhRTExpc3QnKSB7XG4gICAgZ3JhcGhxbFR5cGUgPSBuYW1lVG9UeXBlKHR5cGVOYW1lLCBmaWVsZClcbiAgICAvLyBDdXN0b20gdHlwZSBmb3IgT2JqZWN0IGF0dHJpYnV0ZSBpbiBtb25nb29zZSBtb2RlbC4gZS5nLiB7bmFtZToge2ZpcnN0LCBsYXN0fX1cbiAgICBpZiAoIWdyYXBocWxUeXBlKSByZXR1cm4gYnVpbGRPYmplY3RBcmdzKGtleSwgZmllbGQpXG4gICAgcmV0dXJuIGJ1aWxkQXJncyhrZXksIGdyYXBocWxUeXBlLCB7IHJlcXVpcmVkLCByZWYsIGNvbnRleHQgfSlcbiAgfSBlbHNlIHtcbiAgICAvLyBEZWFsIHdpdGggTGlzdCB0eXBlXG4gICAgZ3JhcGhxbFR5cGUgPSBuYW1lVG9UeXBlKGZpZWxkLnR5cGUub2ZUeXBlLm5hbWUsIGZpZWxkKVxuICAgIHJldHVybiB7W2tleV06IHsgdHlwZTogbmV3IEdyYXBoUUxMaXN0KGdyYXBocWxUeXBlKSwgb25seVBsdXJhbDogdHJ1ZSwgcmVxdWlyZWQsIHJlZiwgY29udGV4dCB9fVxuICB9XG59XG5cbmNvbnN0IGJ1aWxkQXJncyA9IChrZXksIGdyYXBocWxUeXBlLCB7IHJlcXVpcmVkLCByZWYsIGNvbnRleHQgfSkgPT4ge1xuICBpZiAoT2JqZWN0LmtleXMoZ3JhcGhxbFR5cGUpLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHt9XG4gIGNvbnN0IHBsdXJhbCA9IHBsdXJhbGl6ZS5wbHVyYWwoa2V5KVxuICBjb25zdCBpc1BsdXJhbCA9IHBsdXJhbCA9PT0ga2V5XG4gIHJldHVybiBpc1BsdXJhbFxuICAgID8ge1trZXldOiB7IHR5cGU6IG5ldyBHcmFwaFFMTGlzdChncmFwaHFsVHlwZSksIG9ubHlQbHVyYWw6IHRydWUsIHJlcXVpcmVkLCByZWYsIGNvbnRleHQgfX1cbiAgICA6IHtba2V5XTogeyB0eXBlOiBncmFwaHFsVHlwZSwgcmVxdWlyZWQsIHJlZiwgY29udGV4dCB9LCBbcGx1cmFsXTogeyB0eXBlOiBuZXcgR3JhcGhRTExpc3QoZ3JhcGhxbFR5cGUpIH19XG59XG5cbmNvbnN0IG5hbWVUb1R5cGUgPSAodHlwZU5hbWUsIGZpZWxkKSA9PiB7XG4gIGNvbnN0IGhhc1Jlc29sdmUgPSAhIWZpZWxkLnJlc29sdmVcbiAgc3dpdGNoICh0eXBlTmFtZSkge1xuICAgIGNhc2UgJ0lEJzogcmV0dXJuIEdyYXBoUUxJRFxuICAgIGNhc2UgJ1N0cmluZyc6IHJldHVybiBHcmFwaFFMU3RyaW5nXG4gICAgY2FzZSAnRmxvYXQnOiByZXR1cm4gR3JhcGhRTEZsb2F0XG4gICAgY2FzZSAnQm9vbGVhbic6IHJldHVybiBHcmFwaFFMQm9vbGVhblxuICAgIGNhc2UgJ0J1ZmZlcic6IHJldHVybiBHcmFwaFFMQnVmZmVyXG4gICAgY2FzZSAnRGF0ZSc6IHJldHVybiBHcmFwaFFMRGF0ZVxuICAgIGNhc2UgJ01peGVkJzogcmV0dXJuIHt9XG4gICAgZGVmYXVsdDpcbiAgICAgIGlmIChoYXNSZXNvbHZlKSByZXR1cm4gR3JhcGhRTElEIC8vIG90aGVyIG1vZGVscywgdXNlIElEIGFzIHJlZmVyZW5jZVxuICAgICAgcmV0dXJuIG51bGwgLy8gT2JqZWN0IGF0dHJpYnV0ZSBpbiBtb25nb29zZSBtb2RlbFxuICB9XG59XG5cbi8vIEJ1aWxkIGFyZ3MgZm9yIE9iamVjdCBhdHRyaWJ1dGUgb2YgdGhlIG1vbmdvb3NlIG1vZGVsXG5jb25zdCBidWlsZE9iamVjdEFyZ3MgPSAocGFyZW50S2V5LCBmaWVsZCkgPT4ge1xuICBjb25zdCBmaWVsZHMgPSBmaWVsZC50eXBlLl90eXBlQ29uZmlnLmZpZWxkcygpXG4gIHJldHVybiBPYmplY3QuZW50cmllcyhmaWVsZHMpLm1hcCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgcmV0dXJuIGZpZWxkVG9BcmcoYCR7cGFyZW50S2V5fV8ke2tleX1gLCB2YWx1ZSlcbiAgfSkucmVkdWNlKChhcmdzLCBteUFyZykgPT4gKE9iamVjdC5hc3NpZ24oYXJncywgbXlBcmcpKSwge30pXG59XG4iXX0=