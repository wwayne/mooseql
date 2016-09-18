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
  var ref = field.ref;
  var context = field.context;

  var graphqlType = void 0;
  if (typeName !== 'GraphQLList') {
    graphqlType = nameToType(typeName, field);
    // Custom type for Object attribute in mongoose model. e.g. {name: {first, last}}
    if (!graphqlType) return buildObjectArgs(key, field);
    return buildArgs(key, graphqlType, { required: required, ref: ref, context: context });
  } else {
    // Deal with List type
    graphqlType = nameToType(field.type.ofType.name, field);
    return (0, _defineProperty3.default)({}, key, { type: new _graphql.GraphQLList(graphqlType), onlyPlural: true, required: required, ref: ref, context: context });
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


var buildArgs = function buildArgs(key, graphqlType, _ref4) {
  var _ref6;

  var required = _ref4.required;
  var ref = _ref4.ref;
  var context = _ref4.context;

  if ((0, _keys2.default)(graphqlType).length === 0) return {};
  var plural = _pluralize2.default.plural(key);
  var isPlural = plural === key;
  return isPlural ? (0, _defineProperty3.default)({}, key, { type: new _graphql.GraphQLList(graphqlType), onlyPlural: true, required: required, ref: ref, context: context }) : (_ref6 = {}, (0, _defineProperty3.default)(_ref6, key, { type: graphqlType, required: required, ref: ref, context: context }), (0, _defineProperty3.default)(_ref6, plural, { type: new _graphql.GraphQLList(graphqlType) }), _ref6);
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
  return (0, _entries2.default)(fields).map(function (_ref7) {
    var _ref8 = (0, _slicedToArray3.default)(_ref7, 2);

    var key = _ref8[0];
    var value = _ref8[1];

    return fieldToArg(parentKey + '_' + key, value);
  }).reduce(function (args, myArg) {
    return (0, _assign2.default)(args, myArg);
  }, {});
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWEvYnVpbGRBcmdzLmpzIl0sIm5hbWVzIjpbInR5cGUiLCJmaWVsZHMiLCJfdHlwZUNvbmZpZyIsInJlZHVjZSIsImFyZ3MiLCJrZXkiLCJmaWVsZCIsImZpZWxkVG9BcmciLCJ0eXBlTmFtZSIsIm5hbWUiLCJjb25zdHJ1Y3RvciIsInJlcXVpcmVkIiwicmVmIiwiY29udGV4dCIsImdyYXBocWxUeXBlIiwibmFtZVRvVHlwZSIsImJ1aWxkT2JqZWN0QXJncyIsImJ1aWxkQXJncyIsIm9mVHlwZSIsIm9ubHlQbHVyYWwiLCJsZW5ndGgiLCJwbHVyYWwiLCJpc1BsdXJhbCIsImhhc1Jlc29sdmUiLCJyZXNvbHZlIiwicGFyZW50S2V5IiwibWFwIiwidmFsdWUiLCJteUFyZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBeUJlLFVBQVVBLElBQVYsRUFBZ0I7QUFDN0IsTUFBTUMsU0FBU0QsS0FBS0UsV0FBTCxDQUFpQkQsTUFBakIsRUFBZjtBQUNBLFNBQU8sdUJBQWVBLE1BQWYsRUFDSkUsTUFESSxDQUNHLFVBQUNDLElBQUQsUUFBd0I7QUFBQTs7QUFBQSxRQUFoQkMsR0FBZ0I7QUFBQSxRQUFYQyxLQUFXOztBQUM5QixXQUFPLHNCQUFjRixJQUFkLEVBQW9CRyxXQUFXRixHQUFYLEVBQWdCQyxLQUFoQixDQUFwQixDQUFQO0FBQ0QsR0FISSxFQUdGLEVBSEUsQ0FBUDtBQUlELEM7O0FBL0JEOztBQU9BOztBQUlBOzs7Ozs7QUFzQkEsSUFBTUMsYUFBYSxTQUFiQSxVQUFhLENBQUNGLEdBQUQsRUFBTUMsS0FBTixFQUFnQjtBQUNqQyxNQUFNRSxXQUFXRixNQUFNTixJQUFOLENBQVdTLElBQVgsSUFBbUJILE1BQU1OLElBQU4sQ0FBV1UsV0FBWCxDQUF1QkQsSUFBM0Q7QUFEaUMsTUFFekJFLFFBRnlCLEdBRUVMLEtBRkYsQ0FFekJLLFFBRnlCO0FBQUEsTUFFZkMsR0FGZSxHQUVFTixLQUZGLENB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QWN4QixJQUFkLEVBQW9Cd0IsS0FBcEIsQ0FBbEI7QUFBQSxHQUZILEVBRWtELEVBRmxELENBQVA7QUFHRCxDQUxEIiwiZmlsZSI6ImJ1aWxkQXJncy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEdyYXBoUUxJRCxcbiAgR3JhcGhRTFN0cmluZyxcbiAgR3JhcGhRTEZsb2F0LFxuICBHcmFwaFFMQm9vbGVhbixcbiAgR3JhcGhRTExpc3Rcbn0gZnJvbSAnZ3JhcGhxbCdcbmltcG9ydCB7XG4gIEdyYXBoUUxCdWZmZXIsXG4gIEdyYXBoUUxEYXRlXG59IGZyb20gJy4uL3R5cGUvY3VzdG9tVHlwZSdcbmltcG9ydCBwbHVyYWxpemUgZnJvbSAncGx1cmFsaXplJ1xuXG4vKipcbiAqIEdlbmVyYXRlIGFyZ3MgYmFzZWQgb24gdHlwZSdzIGZpZWxkc1xuICogQHBhcm1hc1xuICogIC0gdHlwZSB7T2JqZWN0fSBidWlsdCBncmFwaHFsIHR5cGVcbiAqIEByZXR1cm5cbiAqICAtIGRlZmF1bHRBcmdzIHtPYmplY3R9IGFyZ3VzIGJhc2VkIG9uIHR5cGUncyBmaWVsZHMsIGluY2x1ZGluZyBzaW5ndWxhciBhbmQgcGx1cmFsXG4gKiBAbm90aWNlXG4gKiAgLSByZXNwb25zZSBoYXMgYGlkYCBhbmQgYGlkc2AgaW5zdGVhZCBvZiBfaWRcbiAqICAgIG1vbmdvb3NlIHF1ZXJ5IHNob3VsZCBjb252ZXJ0IGlkIHRvIF9pZCBvciBtb25nb29zZSB3b24ndCBzdXBwb3J0IGl0XG4gKiAgLSBuYW1lLmZpcnN0IGluIE1vbmdvb3NlIG1vZGVsIHdpbGwgaGF2ZSBhcmdzICduYW1lX2ZpcnN0JyBhbmQgJ25hbWVfZmlyc3RzJ1xuICogICAgYmVjYXVzZSBncmFwaHFsIG5hbWUgY29udmVudGlvbiBvbmx5IHN1cHBvcnQgX2EtekEtWjAtOVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAodHlwZSkge1xuICBjb25zdCBmaWVsZHMgPSB0eXBlLl90eXBlQ29uZmlnLmZpZWxkcygpXG4gIHJldHVybiBPYmplY3QuZW50cmllcyhmaWVsZHMpXG4gICAgLnJlZHVjZSgoYXJncywgW2tleSwgZmllbGRdKSA9PiB7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihhcmdzLCBmaWVsZFRvQXJnKGtleSwgZmllbGQpKVxuICAgIH0sIHt9KVxufVxuXG5jb25zdCBmaWVsZFRvQXJnID0gKGtleSwgZmllbGQpID0+IHtcbiAgY29uc3QgdHlwZU5hbWUgPSBmaWVsZC50eXBlLm5hbWUgfHwgZmllbGQudHlwZS5jb25zdHJ1Y3Rvci5uYW1lXG4gIGNvbnN0IHsgcmVxdWlyZWQsIHJlZiwgY29udGV4dCB9ID0gZmllbGRcbiAgbGV0IGdyYXBocWxUeXBlXG4gIGlmICh0eXBlTmFtZSAhPT0gJ0dyYXBoUUxMaXN0Jykge1xuICAgIGdyYXBocWxUeXBlID0gbmFtZVRvVHlwZSh0eXBlTmFtZSwgZmllbGQpXG4gICAgLy8gQ3VzdG9tIHR5cGUgZm9yIE9iamVjdCBhdHRyaWJ1dGUgaW4gbW9uZ29vc2UgbW9kZWwuIGUuZy4ge25hbWU6IHtmaXJzdCwgbGFzdH19XG4gICAgaWYgKCFncmFwaHFsVHlwZSkgcmV0dXJuIGJ1aWxkT2JqZWN0QXJncyhrZXksIGZpZWxkKVxuICAgIHJldHVybiBidWlsZEFyZ3Moa2V5LCBncmFwaHFsVHlwZSwgeyByZXF1aXJlZCwgcmVmLCBjb250ZXh0IH0pXG4gIH0gZWxzZSB7XG4gICAgLy8gRGVhbCB3aXRoIExpc3QgdHlwZVxuICAgIGdyYXBocWxUeXBlID0gbmFtZVRvVHlwZShmaWVsZC50eXBlLm9mVHlwZS5uYW1lLCBmaWVsZClcbiAgICByZXR1cm4ge1trZXldOiB7IHR5cGU6IG5ldyBHcmFwaFFMTGlzdChncmFwaHFsVHlwZSksIG9ubHlQbHVyYWw6IHRydWUsIHJlcXVpcmVkLCByZWYsIGNvbnRleHQgfX1cbiAgfVxufVxuXG5jb25zdCBidWlsZEFyZ3MgPSAoa2V5LCBncmFwaHFsVHlwZSwgeyByZXF1aXJlZCwgcmVmLCBjb250ZXh0IH0pID0+IHtcbiAgaWYgKE9iamVjdC5rZXlzKGdyYXBocWxUeXBlKS5sZW5ndGggPT09IDApIHJldHVybiB7fVxuICBjb25zdCBwbHVyYWwgPSBwbHVyYWxpemUucGx1cmFsKGtleSlcbiAgY29uc3QgaXNQbHVyYWwgPSBwbHVyYWwgPT09IGtleVxuICByZXR1cm4gaXNQbHVyYWxcbiAgICA/IHtba2V5XTogeyB0eXBlOiBuZXcgR3JhcGhRTExpc3QoZ3JhcGhxbFR5cGUpLCBvbmx5UGx1cmFsOiB0cnVlLCByZXF1aXJlZCwgcmVmLCBjb250ZXh0IH19XG4gICAgOiB7W2tleV06IHsgdHlwZTogZ3JhcGhxbFR5cGUsIHJlcXVpcmVkLCByZWYsIGNvbnRleHQgfSwgW3BsdXJhbF06IHsgdHlwZTogbmV3IEdyYXBoUUxMaXN0KGdyYXBocWxUeXBlKSB9fVxufVxuXG5jb25zdCBuYW1lVG9UeXBlID0gKHR5cGVOYW1lLCBmaWVsZCkgPT4ge1xuICBjb25zdCBoYXNSZXNvbHZlID0gISFmaWVsZC5yZXNvbHZlXG4gIHN3aXRjaCAodHlwZU5hbWUpIHtcbiAgICBjYXNlICdJRCc6IHJldHVybiBHcmFwaFFMSURcbiAgICBjYXNlICdTdHJpbmcnOiByZXR1cm4gR3JhcGhRTFN0cmluZ1xuICAgIGNhc2UgJ0Zsb2F0JzogcmV0dXJuIEdyYXBoUUxGbG9hdFxuICAgIGNhc2UgJ0Jvb2xlYW4nOiByZXR1cm4gR3JhcGhRTEJvb2xlYW5cbiAgICBjYXNlICdCdWZmZXInOiByZXR1cm4gR3JhcGhRTEJ1ZmZlclxuICAgIGNhc2UgJ0RhdGUnOiByZXR1cm4gR3JhcGhRTERhdGVcbiAgICBjYXNlICdNaXhlZCc6IHJldHVybiB7fVxuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAoaGFzUmVzb2x2ZSkgcmV0dXJuIEdyYXBoUUxJRCAvLyBvdGhlciBtb2RlbHMsIHVzZSBJRCBhcyByZWZlcmVuY2VcbiAgICAgIHJldHVybiBudWxsIC8vIE9iamVjdCBhdHRyaWJ1dGUgaW4gbW9uZ29vc2UgbW9kZWxcbiAgfVxufVxuXG4vLyBCdWlsZCBhcmdzIGZvciBPYmplY3QgYXR0cmlidXRlIG9mIHRoZSBtb25nb29zZSBtb2RlbFxuY29uc3QgYnVpbGRPYmplY3RBcmdzID0gKHBhcmVudEtleSwgZmllbGQpID0+IHtcbiAgY29uc3QgZmllbGRzID0gZmllbGQudHlwZS5fdHlwZUNvbmZpZy5maWVsZHMoKVxuICByZXR1cm4gT2JqZWN0LmVudHJpZXMoZmllbGRzKS5tYXAoKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgIHJldHVybiBmaWVsZFRvQXJnKGAke3BhcmVudEtleX1fJHtrZXl9YCwgdmFsdWUpXG4gIH0pLnJlZHVjZSgoYXJncywgbXlBcmcpID0+IChPYmplY3QuYXNzaWduKGFyZ3MsIG15QXJnKSksIHt9KVxufVxuIl19