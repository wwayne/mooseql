'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.buildSchema = buildSchema;

var _buildQuery = require('./buildQuery');

var _buildQuery2 = _interopRequireDefault(_buildQuery);

var _buildMutation = require('./buildMutation');

var _buildMutation2 = _interopRequireDefault(_buildMutation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Build graphql CRUD schema based on models and types
 * @params
 *  - models {Array} mongoose models
 *  - typeMap {Object} map of model and corresponding graphql type
 * @return
 *  - grapqhl schema which has query and mutation
 */
function buildSchema(models, typeMap) {
  var type = void 0;

  var _models$map$reduce = models.map(function (model) {
    type = typeMap[model.modelName];
    return {
      query: (0, _buildQuery2.default)(model, type),
      mutation: (0, _buildMutation2.default)(model, type)
    };
  }).reduce(function (fields, modelField) {
    fields.query = (0, _assign2.default)({}, fields.query, modelField.query);
    fields.mutation = (0, _assign2.default)({}, fields.mutation, modelField.mutation);
    return fields;
  }, { query: {}, mutation: {} });

  var query = _models$map$reduce.query;
  var mutation = _models$map$reduce.mutation;


  return {
    query: query,
    mutation: mutation
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWEvaW5kZXguanMiXSwibmFtZXMiOlsiYnVpbGRTY2hlbWEiLCJtb2RlbHMiLCJ0eXBlTWFwIiwidHlwZSIsIm1hcCIsIm1vZGVsIiwibW9kZWxOYW1lIiwicXVlcnkiLCJtdXRhdGlvbiIsInJlZHVjZSIsImZpZWxkcyIsIm1vZGVsRmllbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7UUFXZ0JBLFcsR0FBQUEsVzs7QUFYaEI7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7O0FBUU8sU0FBU0EsV0FBVCxDQUFzQkMsTUFBdEIsRUFBOEJDLE9BQTlCLEVBQXVDO0FBQzVDLE1BQUlDLGFBQUo7O0FBRDRDLDJCQUVsQkYsT0FBT0csR0FBUCxDQUFXLGlCQUFTO0FBQzVDRCxXQUFPRCxRQUFRRyxNQUFNQyxTQUFkLENBQVA7QUFDQSxXQUFPO0FBQ0xDLGFBQU8sMEJBQVdGLEtBQVgsRUFBa0JGLElBQWxCLENBREY7QUFFTEssZ0JBQVUsNkJBQWNILEtBQWQsRUFBcUJGLElBQXJCO0FBRkwsS0FBUDtBQUlELEdBTnlCLEVBTXZCTSxNQU51QixDQU1oQixVQUFDQyxNQUFELEVBQVNDLFVBQVQsRUFBd0I7QUFDaENELFdBQU9ILEtBQVAsR0FBZSxzQkFBYyxFQUFkLEVBQWtCRyxPQUFPSCxLQUF6QixFQUFnQ0ksV0FBV0osS0FBM0MsQ0FBZjtBQUNBRyxXQUFPRixRQUFQLEdBQWtCLHNCQUFjLEVBQWQsRUFBa0JFLE9BQU9GLFFBQXpCLEVBQW1DRyxXQUFXSCxRQUE5QyxDQUFsQjtBQUNBLFdBQU9FLE1BQVA7QUFDRCxHQVZ5QixFQVV2QixFQUFFSCxPQUFPLEVBQVQsRUFBYUMsVUFBVSxFQUF2QixFQVZ1QixDQUZrQjs7QUFBQSxNQUVyQ0QsS0FGcUMsc0JBRXJDQSxLQUZxQztBQUFBLE1BRTlCQyxRQUY4QixzQkFFOUJBLFFBRjhCOzs7QUFjNUMsU0FBTztBQUNMRCxnQkFESztBQUVMQztBQUZLLEdBQVA7QUFJRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBidWlsZFF1ZXJ5IGZyb20gJy4vYnVpbGRRdWVyeSdcbmltcG9ydCBidWlsZE11dGF0aW9uIGZyb20gJy4vYnVpbGRNdXRhdGlvbidcblxuLyoqXG4gKiBCdWlsZCBncmFwaHFsIENSVUQgc2NoZW1hIGJhc2VkIG9uIG1vZGVscyBhbmQgdHlwZXNcbiAqIEBwYXJhbXNcbiAqICAtIG1vZGVscyB7QXJyYXl9IG1vbmdvb3NlIG1vZGVsc1xuICogIC0gdHlwZU1hcCB7T2JqZWN0fSBtYXAgb2YgbW9kZWwgYW5kIGNvcnJlc3BvbmRpbmcgZ3JhcGhxbCB0eXBlXG4gKiBAcmV0dXJuXG4gKiAgLSBncmFwcWhsIHNjaGVtYSB3aGljaCBoYXMgcXVlcnkgYW5kIG11dGF0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFNjaGVtYSAobW9kZWxzLCB0eXBlTWFwKSB7XG4gIGxldCB0eXBlXG4gIGNvbnN0IHtxdWVyeSwgbXV0YXRpb259ID0gbW9kZWxzLm1hcChtb2RlbCA9PiB7XG4gICAgdHlwZSA9IHR5cGVNYXBbbW9kZWwubW9kZWxOYW1lXVxuICAgIHJldHVybiB7XG4gICAgICBxdWVyeTogYnVpbGRRdWVyeShtb2RlbCwgdHlwZSksXG4gICAgICBtdXRhdGlvbjogYnVpbGRNdXRhdGlvbihtb2RlbCwgdHlwZSlcbiAgICB9XG4gIH0pLnJlZHVjZSgoZmllbGRzLCBtb2RlbEZpZWxkKSA9PiB7XG4gICAgZmllbGRzLnF1ZXJ5ID0gT2JqZWN0LmFzc2lnbih7fSwgZmllbGRzLnF1ZXJ5LCBtb2RlbEZpZWxkLnF1ZXJ5KVxuICAgIGZpZWxkcy5tdXRhdGlvbiA9IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkcy5tdXRhdGlvbiwgbW9kZWxGaWVsZC5tdXRhdGlvbilcbiAgICByZXR1cm4gZmllbGRzXG4gIH0sIHsgcXVlcnk6IHt9LCBtdXRhdGlvbjoge30gfSlcblxuICByZXR1cm4ge1xuICAgIHF1ZXJ5LFxuICAgIG11dGF0aW9uXG4gIH1cbn1cbiJdfQ==