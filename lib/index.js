'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildTypes = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.default = function (models, customFields, opt) {
  var typeMap = (0, _type.modelsToTypes)(models);

  var _buildSchema = (0, _schema.buildSchema)(models, typeMap);

  var query = _buildSchema.query;
  var mutation = _buildSchema.mutation;

  var customQuery = customFields && customFields.query;
  var customMutation = customFields && customFields.mutation;
  return new _graphql.GraphQLSchema({
    query: new _graphql.GraphQLObjectType({
      name: 'Query',
      fields: (0, _assign2.default)({}, query, customQuery)
    }),
    mutation: new _graphql.GraphQLObjectType({
      name: 'Mutation',
      fields: (0, _assign2.default)({}, mutation, customMutation)
    })
  });
};

var _graphql = require('graphql');

var _type = require('./type');

var _schema = require('./schema');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildTypes = exports.buildTypes = _type.modelsToTypes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJtb2RlbHMiLCJjdXN0b21GaWVsZHMiLCJvcHQiLCJ0eXBlTWFwIiwicXVlcnkiLCJtdXRhdGlvbiIsImN1c3RvbVF1ZXJ5IiwiY3VzdG9tTXV0YXRpb24iLCJuYW1lIiwiZmllbGRzIiwiYnVpbGRUeXBlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7a0JBTWUsVUFBVUEsTUFBVixFQUFrQkMsWUFBbEIsRUFBZ0NDLEdBQWhDLEVBQXFDO0FBQ2xELE1BQU1DLFVBQVUseUJBQWNILE1BQWQsQ0FBaEI7O0FBRGtELHFCQUV4Qix5QkFBWUEsTUFBWixFQUFvQkcsT0FBcEIsQ0FGd0I7O0FBQUEsTUFFM0NDLEtBRjJDLGdCQUUzQ0EsS0FGMkM7QUFBQSxNQUVwQ0MsUUFGb0MsZ0JBRXBDQSxRQUZvQzs7QUFHbEQsTUFBTUMsY0FBY0wsZ0JBQWdCQSxhQUFhRyxLQUFqRDtBQUNBLE1BQU1HLGlCQUFpQk4sZ0JBQWdCQSxhQUFhSSxRQUFwRDtBQUNBLFNBQU8sMkJBQWtCO0FBQ3ZCRCxXQUFPLCtCQUFzQjtBQUMzQkksWUFBTSxPQURxQjtBQUUzQkMsY0FBUSxzQkFBYyxFQUFkLEVBQWtCTCxLQUFsQixFQUF5QkUsV0FBekI7QUFGbUIsS0FBdEIsQ0FEZ0I7QUFLdkJELGNBQVUsK0JBQXNCO0FBQzlCRyxZQUFNLFVBRHdCO0FBRTlCQyxjQUFRLHNCQUFjLEVBQWQsRUFBa0JKLFFBQWxCLEVBQTRCRSxjQUE1QjtBQUZzQixLQUF0QjtBQUxhLEdBQWxCLENBQVA7QUFVRCxDOztBQXJCRDs7QUFDQTs7QUFDQTs7OztBQUVPLElBQU1HLHFEQUFOIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR3JhcGhRTFNjaGVtYSwgR3JhcGhRTE9iamVjdFR5cGUgfSBmcm9tICdncmFwaHFsJ1xuaW1wb3J0IHsgbW9kZWxzVG9UeXBlcyB9IGZyb20gJy4vdHlwZSdcbmltcG9ydCB7IGJ1aWxkU2NoZW1hIH0gZnJvbSAnLi9zY2hlbWEnXG5cbmV4cG9ydCBjb25zdCBidWlsZFR5cGVzID0gbW9kZWxzVG9UeXBlc1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAobW9kZWxzLCBjdXN0b21GaWVsZHMsIG9wdCkge1xuICBjb25zdCB0eXBlTWFwID0gbW9kZWxzVG9UeXBlcyhtb2RlbHMpXG4gIGNvbnN0IHtxdWVyeSwgbXV0YXRpb259ID0gYnVpbGRTY2hlbWEobW9kZWxzLCB0eXBlTWFwKVxuICBjb25zdCBjdXN0b21RdWVyeSA9IGN1c3RvbUZpZWxkcyAmJiBjdXN0b21GaWVsZHMucXVlcnlcbiAgY29uc3QgY3VzdG9tTXV0YXRpb24gPSBjdXN0b21GaWVsZHMgJiYgY3VzdG9tRmllbGRzLm11dGF0aW9uXG4gIHJldHVybiBuZXcgR3JhcGhRTFNjaGVtYSh7XG4gICAgcXVlcnk6IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XG4gICAgICBuYW1lOiAnUXVlcnknLFxuICAgICAgZmllbGRzOiBPYmplY3QuYXNzaWduKHt9LCBxdWVyeSwgY3VzdG9tUXVlcnkpXG4gICAgfSksXG4gICAgbXV0YXRpb246IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XG4gICAgICBuYW1lOiAnTXV0YXRpb24nLFxuICAgICAgZmllbGRzOiBPYmplY3QuYXNzaWduKHt9LCBtdXRhdGlvbiwgY3VzdG9tTXV0YXRpb24pXG4gICAgfSlcbiAgfSlcbn1cbiJdfQ==