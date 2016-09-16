'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _graphql = require('graphql');

var _type = require('./type');

var _schema = require('./schema');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mooseql = function mooseql(models, customFields, opt) {
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

mooseql.buildTypes = _type.modelsToTypes;

module.exports = mooseql;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJtb29zZXFsIiwibW9kZWxzIiwiY3VzdG9tRmllbGRzIiwib3B0IiwidHlwZU1hcCIsInF1ZXJ5IiwibXV0YXRpb24iLCJjdXN0b21RdWVyeSIsImN1c3RvbU11dGF0aW9uIiwibmFtZSIsImZpZWxkcyIsImJ1aWxkVHlwZXMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7OztBQUVBLElBQU1BLFVBQVUsU0FBVkEsT0FBVSxDQUFDQyxNQUFELEVBQVNDLFlBQVQsRUFBdUJDLEdBQXZCLEVBQStCO0FBQzdDLE1BQU1DLFVBQVUseUJBQWNILE1BQWQsQ0FBaEI7O0FBRDZDLHFCQUVuQix5QkFBWUEsTUFBWixFQUFvQkcsT0FBcEIsQ0FGbUI7O0FBQUEsTUFFdENDLEtBRnNDLGdCQUV0Q0EsS0FGc0M7QUFBQSxNQUUvQkMsUUFGK0IsZ0JBRS9CQSxRQUYrQjs7QUFHN0MsTUFBTUMsY0FBY0wsZ0JBQWdCQSxhQUFhRyxLQUFqRDtBQUNBLE1BQU1HLGlCQUFpQk4sZ0JBQWdCQSxhQUFhSSxRQUFwRDtBQUNBLFNBQU8sMkJBQWtCO0FBQ3ZCRCxXQUFPLCtCQUFzQjtBQUMzQkksWUFBTSxPQURxQjtBQUUzQkMsY0FBUSxzQkFBYyxFQUFkLEVBQWtCTCxLQUFsQixFQUF5QkUsV0FBekI7QUFGbUIsS0FBdEIsQ0FEZ0I7QUFLdkJELGNBQVUsK0JBQXNCO0FBQzlCRyxZQUFNLFVBRHdCO0FBRTlCQyxjQUFRLHNCQUFjLEVBQWQsRUFBa0JKLFFBQWxCLEVBQTRCRSxjQUE1QjtBQUZzQixLQUF0QjtBQUxhLEdBQWxCLENBQVA7QUFVRCxDQWZEOztBQWlCQVIsUUFBUVcsVUFBUjs7QUFFQUMsT0FBT0MsT0FBUCxHQUFpQmIsT0FBakIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHcmFwaFFMU2NoZW1hLCBHcmFwaFFMT2JqZWN0VHlwZSB9IGZyb20gJ2dyYXBocWwnXG5pbXBvcnQgeyBtb2RlbHNUb1R5cGVzIH0gZnJvbSAnLi90eXBlJ1xuaW1wb3J0IHsgYnVpbGRTY2hlbWEgfSBmcm9tICcuL3NjaGVtYSdcblxuY29uc3QgbW9vc2VxbCA9IChtb2RlbHMsIGN1c3RvbUZpZWxkcywgb3B0KSA9PiB7XG4gIGNvbnN0IHR5cGVNYXAgPSBtb2RlbHNUb1R5cGVzKG1vZGVscylcbiAgY29uc3Qge3F1ZXJ5LCBtdXRhdGlvbn0gPSBidWlsZFNjaGVtYShtb2RlbHMsIHR5cGVNYXApXG4gIGNvbnN0IGN1c3RvbVF1ZXJ5ID0gY3VzdG9tRmllbGRzICYmIGN1c3RvbUZpZWxkcy5xdWVyeVxuICBjb25zdCBjdXN0b21NdXRhdGlvbiA9IGN1c3RvbUZpZWxkcyAmJiBjdXN0b21GaWVsZHMubXV0YXRpb25cbiAgcmV0dXJuIG5ldyBHcmFwaFFMU2NoZW1hKHtcbiAgICBxdWVyeTogbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcbiAgICAgIG5hbWU6ICdRdWVyeScsXG4gICAgICBmaWVsZHM6IE9iamVjdC5hc3NpZ24oe30sIHF1ZXJ5LCBjdXN0b21RdWVyeSlcbiAgICB9KSxcbiAgICBtdXRhdGlvbjogbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcbiAgICAgIG5hbWU6ICdNdXRhdGlvbicsXG4gICAgICBmaWVsZHM6IE9iamVjdC5hc3NpZ24oe30sIG11dGF0aW9uLCBjdXN0b21NdXRhdGlvbilcbiAgICB9KVxuICB9KVxufVxuXG5tb29zZXFsLmJ1aWxkVHlwZXMgPSBtb2RlbHNUb1R5cGVzXG5cbm1vZHVsZS5leHBvcnRzID0gbW9vc2VxbFxuIl19