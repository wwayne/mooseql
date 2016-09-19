'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _graphql = require('graphql');

var _type = require('./type');

var _schema = require('./schema');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mooseql = (models, customFields, opt) => {
  const typeMap = (0, _type.modelsToTypes)(models);

  var _buildSchema = (0, _schema.buildSchema)(models, typeMap);

  const query = _buildSchema.query;
  const mutation = _buildSchema.mutation;

  const customQuery = customFields && customFields.query;
  const customMutation = customFields && customFields.mutation;
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

mooseql.buildTypes = _type.modelsToTypes;

module.exports = mooseql;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJtb29zZXFsIiwibW9kZWxzIiwiY3VzdG9tRmllbGRzIiwib3B0IiwidHlwZU1hcCIsInF1ZXJ5IiwibXV0YXRpb24iLCJjdXN0b21RdWVyeSIsImN1c3RvbU11dGF0aW9uIiwibmFtZSIsImZpZWxkcyIsImJ1aWxkVHlwZXMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7OztBQUVBLE1BQU1BLFVBQVUsQ0FBQ0MsTUFBRCxFQUFTQyxZQUFULEVBQXVCQyxHQUF2QixLQUErQjtBQUM3QyxRQUFNQyxVQUFVLHlCQUFjSCxNQUFkLENBQWhCOztBQUQ2QyxxQkFFbkIseUJBQVlBLE1BQVosRUFBb0JHLE9BQXBCLENBRm1COztBQUFBLFFBRXRDQyxLQUZzQyxnQkFFdENBLEtBRnNDO0FBQUEsUUFFL0JDLFFBRitCLGdCQUUvQkEsUUFGK0I7O0FBRzdDLFFBQU1DLGNBQWNMLGdCQUFnQkEsYUFBYUcsS0FBakQ7QUFDQSxRQUFNRyxpQkFBaUJOLGdCQUFnQkEsYUFBYUksUUFBcEQ7QUFDQSxTQUFPLDJCQUFrQjtBQUN2QkQsV0FBTywrQkFBc0I7QUFDM0JJLFlBQU0sT0FEcUI7QUFFM0JDLGNBQVEsc0JBQWMsRUFBZCxFQUFrQkwsS0FBbEIsRUFBeUJFLFdBQXpCO0FBRm1CLEtBQXRCLENBRGdCO0FBS3ZCRCxjQUFVLCtCQUFzQjtBQUM5QkcsWUFBTSxVQUR3QjtBQUU5QkMsY0FBUSxzQkFBYyxFQUFkLEVBQWtCSixRQUFsQixFQUE0QkUsY0FBNUI7QUFGc0IsS0FBdEI7QUFMYSxHQUFsQixDQUFQO0FBVUQsQ0FmRDs7QUFpQkFSLFFBQVFXLFVBQVI7O0FBRUFDLE9BQU9DLE9BQVAsR0FBaUJiLE9BQWpCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR3JhcGhRTFNjaGVtYSwgR3JhcGhRTE9iamVjdFR5cGUgfSBmcm9tICdncmFwaHFsJ1xuaW1wb3J0IHsgbW9kZWxzVG9UeXBlcyB9IGZyb20gJy4vdHlwZSdcbmltcG9ydCB7IGJ1aWxkU2NoZW1hIH0gZnJvbSAnLi9zY2hlbWEnXG5cbmNvbnN0IG1vb3NlcWwgPSAobW9kZWxzLCBjdXN0b21GaWVsZHMsIG9wdCkgPT4ge1xuICBjb25zdCB0eXBlTWFwID0gbW9kZWxzVG9UeXBlcyhtb2RlbHMpXG4gIGNvbnN0IHtxdWVyeSwgbXV0YXRpb259ID0gYnVpbGRTY2hlbWEobW9kZWxzLCB0eXBlTWFwKVxuICBjb25zdCBjdXN0b21RdWVyeSA9IGN1c3RvbUZpZWxkcyAmJiBjdXN0b21GaWVsZHMucXVlcnlcbiAgY29uc3QgY3VzdG9tTXV0YXRpb24gPSBjdXN0b21GaWVsZHMgJiYgY3VzdG9tRmllbGRzLm11dGF0aW9uXG4gIHJldHVybiBuZXcgR3JhcGhRTFNjaGVtYSh7XG4gICAgcXVlcnk6IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XG4gICAgICBuYW1lOiAnUXVlcnknLFxuICAgICAgZmllbGRzOiBPYmplY3QuYXNzaWduKHt9LCBxdWVyeSwgY3VzdG9tUXVlcnkpXG4gICAgfSksXG4gICAgbXV0YXRpb246IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XG4gICAgICBuYW1lOiAnTXV0YXRpb24nLFxuICAgICAgZmllbGRzOiBPYmplY3QuYXNzaWduKHt9LCBtdXRhdGlvbiwgY3VzdG9tTXV0YXRpb24pXG4gICAgfSlcbiAgfSlcbn1cblxubW9vc2VxbC5idWlsZFR5cGVzID0gbW9kZWxzVG9UeXBlc1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1vb3NlcWxcbiJdfQ==