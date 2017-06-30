'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.modelsToTypes = modelsToTypes;

var _graphql = require('graphql');

var _customType = require('./customType');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let _typeMap = {};
/**
 * Convert bundch of mongoose model to graphql types
 * build this as singleton so that it won't create graphQLType twice
 *
 * @params
 *  - models {Array} list of mongoose models
 * @return
 *  - typeMap {Object} key: modelName, value: type
 */
function modelsToTypes(models) {
  let typeMap = models.filter(model => {
    if (_typeMap[model.modelName]) return false;
    return true;
  }).reduce((map, model) => {
    return (0, _assign2.default)(map, { [model.modelName]: toType(model) });
  }, {});
  _typeMap = (0, _assign2.default)(_typeMap, typeMap);

  // Deal with ref after all types are defined
  (0, _entries2.default)(typeMap).forEach(_ref => {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

    let modelName = _ref2[0];
    let type = _ref2[1];

    const originFileds = type._typeConfig.fields();
    const newTypeFileds = (0, _entries2.default)(originFileds).map(_ref3 => {
      var _ref4 = (0, _slicedToArray3.default)(_ref3, 2);

      let path = _ref4[0];
      let pathValue = _ref4[1];

      let newPathValue = (0, _assign2.default)({}, pathValue);
      if (newPathValue.ref) {
        const ref = newPathValue.ref;
        if (!_typeMap[ref]) throw TypeError(`${ref} is not a model`);
        const model = models.find(m => m.modelName === ref);
        const refModelType = _typeMap[ref];
        if (newPathValue.type instanceof _graphql.GraphQLList) {
          newPathValue = (0, _assign2.default)({}, newPathValue, {
            type: new _graphql.GraphQLList(refModelType),
            resolve: (() => {
              var _ref5 = (0, _asyncToGenerator3.default)(function* (instance) {
                // TODO: args filter
                return yield model.find({ _id: { $in: instance[path] } });
              });

              return function resolve(_x) {
                return _ref5.apply(this, arguments);
              };
            })()
          });
        } else {
          newPathValue = (0, _assign2.default)({}, newPathValue, {
            type: refModelType,
            resolve: (() => {
              var _ref6 = (0, _asyncToGenerator3.default)(function* (instance) {
                return yield model.findById(instance[path]);
              });

              return function resolve(_x2) {
                return _ref6.apply(this, arguments);
              };
            })()
          });
        }
      }
      return { [path]: newPathValue };
    }).reduce((typeField, path) => (0, _assign2.default)(typeField, path), {});

    typeMap[modelName]._typeConfig.fields = () => newTypeFileds;
  });

  _typeMap = (0, _assign2.default)(_typeMap, typeMap);
  return _typeMap;
}

/* Convert a mongoose model to corresponding type */
const toType = model => {
  const exceptPath = ['_id', '__v'];
  const inheritOpts = ['ref', 'context'];
  const paths = model.schema.paths;
  let _fields = (0, _keys2.default)(paths).filter(path => exceptPath.indexOf(path) === -1).map(path => {
    const attr = paths[path];
    let field = { type: pathToType(attr) };
    // Find out special opt on mongoose model's path, use subPath's opt if path is an Array
    inheritOpts.forEach(opt => {
      if (attr.options[opt] || attr.instance === 'Array' && attr.caster.options && attr.caster.options[opt]) {
        field[opt] = attr.options[opt] || attr.caster.options[opt];
      }
    });
    // Mark required path
    const required = attr.options.required;
    if (Array.isArray(required) && required[0] || required) field.required = true;
    return { [path]: field };
  }).reduce((fields, path) => {
    // make up object tpe, e.g { name: { first: {type: GraphQLString...}, last: {type: GraphQLString...} } }
    const pathKey = (0, _keys2.default)(path)[0];
    const pathKeySplit = pathKey.split('.');
    const pathKeyLength = pathKeySplit.length;
    if (pathKeyLength.length === 1) return (0, _assign2.default)(fields, path);
    pathKeySplit.reduce((fieldPostion, depth, index) => {
      if (index === pathKeyLength - 1) {
        fieldPostion[depth] = path[pathKey];
        return;
      }
      fieldPostion[depth] = fieldPostion[depth] || {};
      return fieldPostion[depth];
    }, fields);
    return fields;
  }, { id: { type: _graphql.GraphQLID } });

  // Deal with object attribute in mongoose model
  // e.g. {name: {first: String, last: Strinf}} -> {name: GraphQLType{fields: {first: GraphQLString, two: GraphQLString}}}
  _fields = (0, _entries2.default)(_fields).map(_ref7 => {
    var _ref8 = (0, _slicedToArray3.default)(_ref7, 2);

    let key = _ref8[0];
    let attr = _ref8[1];

    return { [key]: convertObject(attr, `${model.modelName}${key}`) };
  }).reduce((fields, path) => (0, _assign2.default)(fields, path), {});
  return new _graphql.GraphQLObjectType({
    name: model.modelName,
    fields: () => _fields
  });
};

// Convert single path of mongoose to type
const pathToType = path => {
  switch (path.instance) {
    case 'String':
      return _graphql.GraphQLString;
    case 'Number':
      // Float includes Int
      // @see https://github.com/graphql/graphql-js/blob/master/src/type/scalars.js#L69
      return _graphql.GraphQLFloat;
    case 'Date':
      return _customType.GraphQLDate;
    case 'Buffer':
      return _customType.GraphQLBuffer;
    case 'Boolean':
      return _graphql.GraphQLBoolean;
    case 'Mixed':
      return _customType.GraphQLMixed;
    case 'ObjectID':
      return _graphql.GraphQLID;
    case 'Array':
      const subType = pathToType(path.caster);
      return new _graphql.GraphQLList(subType);
    default:
      return _customType.GraphQLMixed;
  }
};

// Convert model's object attribute
const convertObject = (attr, parentName) => {
  if (attr.type && (attr.type instanceof _graphql.GraphQLScalarType || attr.type instanceof _graphql.GraphQLList)) return attr;
  const _fields2 = (0, _entries2.default)(attr).map(_ref9 => {
    var _ref10 = (0, _slicedToArray3.default)(_ref9, 2);

    let key = _ref10[0];
    let vakue = _ref10[1];

    return { [key]: convertObject(attr[key], `${parentName}${key}`) };
  }).reduce((fields, path) => {
    // console.log(path)
    return (0, _assign2.default)(fields, path);
  }, {});
  // console.log(fields)
  return {
    type: new _graphql.GraphQLObjectType({
      name: `${parentName}`,
      fields: () => _fields2
    })
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90eXBlL2luZGV4LmpzIl0sIm5hbWVzIjpbIm1vZGVsc1RvVHlwZXMiLCJfdHlwZU1hcCIsIm1vZGVscyIsInR5cGVNYXAiLCJmaWx0ZXIiLCJtb2RlbCIsIm1vZGVsTmFtZSIsInJlZHVjZSIsIm1hcCIsInRvVHlwZSIsImZvckVhY2giLCJ0eXBlIiwib3JpZ2luRmlsZWRzIiwiX3R5cGVDb25maWciLCJmaWVsZHMiLCJuZXdUeXBlRmlsZWRzIiwicGF0aCIsInBhdGhWYWx1ZSIsIm5ld1BhdGhWYWx1ZSIsInJlZiIsIlR5cGVFcnJvciIsImZpbmQiLCJtIiwicmVmTW9kZWxUeXBlIiwicmVzb2x2ZSIsImluc3RhbmNlIiwiX2lkIiwiJGluIiwiZmluZEJ5SWQiLCJ0eXBlRmllbGQiLCJleGNlcHRQYXRoIiwiaW5oZXJpdE9wdHMiLCJwYXRocyIsInNjaGVtYSIsImluZGV4T2YiLCJhdHRyIiwiZmllbGQiLCJwYXRoVG9UeXBlIiwib3B0Iiwib3B0aW9ucyIsImNhc3RlciIsInJlcXVpcmVkIiwiQXJyYXkiLCJpc0FycmF5IiwicGF0aEtleSIsInBhdGhLZXlTcGxpdCIsInNwbGl0IiwicGF0aEtleUxlbmd0aCIsImxlbmd0aCIsImZpZWxkUG9zdGlvbiIsImRlcHRoIiwiaW5kZXgiLCJpZCIsImtleSIsImNvbnZlcnRPYmplY3QiLCJuYW1lIiwic3ViVHlwZSIsInBhcmVudE5hbWUiLCJ2YWt1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUF5QmdCQSxhLEdBQUFBLGE7O0FBekJoQjs7QUFTQTs7OztBQU1BLElBQUlDLFdBQVcsRUFBZjtBQUNBOzs7Ozs7Ozs7QUFTTyxTQUFTRCxhQUFULENBQXdCRSxNQUF4QixFQUFnQztBQUNyQyxNQUFJQyxVQUFVRCxPQUFPRSxNQUFQLENBQWNDLFNBQVM7QUFDbkMsUUFBSUosU0FBU0ksTUFBTUMsU0FBZixDQUFKLEVBQStCLE9BQU8sS0FBUDtBQUMvQixXQUFPLElB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TUFBaEIsQ0FBaEI7QUFDQSxhQUFPLHlCQUFnQmdCLE9BQWhCLENBQVA7QUFDRjtBQUNFO0FBckJKO0FBdUJELENBeEJEOztBQTBCQTtBQUNBLE1BQU1GLGdCQUFnQixDQUFDbkIsSUFBRCxFQUFPc0IsVUFBUCxLQUFzQjtBQUMxQyxNQUFJdEIsS0FBS3hCLElBQUwsS0FBY3dCLEtBQUt4QixJQUFMLDBDQUEwQ3dCLEtBQUt4QixJQUFMLGdDQUF4RCxDQUFKLEVBQStGLE9BQU93QixJQUFQO0FBQy9GLFFBQU1yQixXQUFTLHVCQUFlcUIsSUFBZixFQUFxQjNCLEdBQXJCLENBQXlCLFNBQWtCO0FBQUE7O0FBQUEsUUFBaEI2QyxHQUFnQjtBQUFBLFFBQVhLLEtBQVc7O0FBQ3hELFdBQU8sRUFBRSxDQUFDTCxHQUFELEdBQU9DLGNBQWNuQixLQUFLa0IsR0FBTCxDQUFkLEVBQTBCLElBQUVJLFVBQVcsS0FBRUosR0FBSSxHQUE3QyxDQUFULEVBQVA7QUFDRCxHQUZjLEVBRVo5QyxNQUZZLENBRUwsQ0FBQ08sTUFBRCxFQUFTRSxJQUFULEtBQWtCO0FBQzFCO0FBQ0EsV0FBTyxzQkFBY0YsTUFBZCxFQUFzQkUsSUFBdEIsQ0FBUDtBQUNELEdBTGMsRUFLWixFQUxZLENBQWY7QUFNQTtBQUNBLFNBQU87QUFDTEwsVUFBTSwrQkFBc0I7QUFDMUI0QyxZQUFPLElBQUVFLFVBQVcsR0FETTtBQUUxQjNDLGNBQVEsTUFBT0E7QUFGVyxLQUF0QjtBQURELEdBQVA7QUFNRCxDQWZEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgR3JhcGhRTElELFxuICBHcmFwaFFMT2JqZWN0VHlwZSxcbiAgR3JhcGhRTFN0cmluZyxcbiAgR3JhcGhRTEZsb2F0LFxuICBHcmFwaFFMQm9vbGVhbixcbiAgR3JhcGhRTExpc3QsXG4gIEdyYXBoUUxTY2FsYXJUeXBlXG59IGZyb20gJ2dyYXBocWwnXG5pbXBvcnQge1xuICBHcmFwaFFMQnVmZmVyLFxuICBHcmFwaFFMRGF0ZSxcbiAgR3JhcGhRTE1peGVkXG59IGZyb20gJy4vY3VzdG9tVHlwZSdcblxubGV0IF90eXBlTWFwID0ge31cbi8qKlxuICogQ29udmVydCBidW5kY2ggb2YgbW9uZ29vc2UgbW9kZWwgdG8gZ3JhcGhxbCB0eXBlc1xuICogYnVpbGQgdGhpcyBhcyBzaW5nbGV0b24gc28gdGhhdCBpdCB3b24ndCBjcmVhdGUgZ3JhcGhRTFR5cGUgdHdpY2VcbiAqXG4gKiBAcGFyYW1zXG4gKiAgLSBtb2RlbHMge0FycmF5fSBsaXN0IG9mIG1vbmdvb3NlIG1vZGVsc1xuICogQHJldHVyblxuICogIC0gdHlwZU1hcCB7T2JqZWN0fSBrZXk6IG1vZGVsTmFtZSwgdmFsdWU6IHR5cGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1vZGVsc1RvVHlwZXMgKG1vZGVscykge1xuICBsZXQgdHlwZU1hcCA9IG1vZGVscy5maWx0ZXIobW9kZWwgPT4ge1xuICAgIGlmIChfdHlwZU1hcFttb2RlbC5tb2RlbE5hbWVdKSByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gdHJ1ZVxuICB9KS5yZWR1Y2UoKG1hcCwgbW9kZWwpID0+IHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihtYXAsIHsgW21vZGVsLm1vZGVsTmFtZV06IHRvVHlwZShtb2RlbCkgfSlcbiAgfSwge30pXG4gIF90eXBlTWFwID0gT2JqZWN0LmFzc2lnbihfdHlwZU1hcCwgdHlwZU1hcClcblxuICAvLyBEZWFsIHdpdGggcmVmIGFmdGVyIGFsbCB0eXBlcyBhcmUgZGVmaW5lZFxuICBPYmplY3QuZW50cmllcyh0eXBlTWFwKS5mb3JFYWNoKChbbW9kZWxOYW1lLCB0eXBlXSkgPT4ge1xuICAgIGNvbnN0IG9yaWdpbkZpbGVkcyA9IHR5cGUuX3R5cGVDb25maWcuZmllbGRzKClcbiAgICBjb25zdCBuZXdUeXBlRmlsZWRzID0gT2JqZWN0LmVudHJpZXMob3JpZ2luRmlsZWRzKVxuICAgICAgLm1hcCgoW3BhdGgsIHBhdGhWYWx1ZV0pID0+IHtcbiAgICAgICAgbGV0IG5ld1BhdGhWYWx1ZSA9IE9iamVjdC5hc3NpZ24oe30sIHBhdGhWYWx1ZSlcbiAgICAgICAgaWYgKG5ld1BhdGhWYWx1ZS5yZWYpIHtcbiAgICAgICAgICBjb25zdCByZWYgPSBuZXdQYXRoVmFsdWUucmVmXG4gICAgICAgICAgaWYgKCFfdHlwZU1hcFtyZWZdKSB0aHJvdyBUeXBlRXJyb3IoYCR7cmVmfSBpcyBub3QgYSBtb2RlbGApXG4gICAgICAgICAgY29uc3QgbW9kZWwgPSBtb2RlbHMuZmluZChtID0+IG0ubW9kZWxOYW1lID09PSByZWYpXG4gICAgICAgICAgY29uc3QgcmVmTW9kZWxUeXBlID0gX3R5cGVNYXBbcmVmXVxuICAgICAgICAgIGlmIChuZXdQYXRoVmFsdWUudHlwZSBpbnN0YW5jZW9mIEdyYXBoUUxMaXN0KSB7XG4gICAgICAgICAgICBuZXdQYXRoVmFsdWUgPSBPYmplY3QuYXNzaWduKHt9LCBuZXdQYXRoVmFsdWUsIHtcbiAgICAgICAgICAgICAgdHlwZTogbmV3IEdyYXBoUUxMaXN0KHJlZk1vZGVsVHlwZSksXG4gICAgICAgICAgICAgIHJlc29sdmU6IGFzeW5jIChpbnN0YW5jZSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IGFyZ3MgZmlsdGVyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IG1vZGVsLmZpbmQoeyBfaWQ6IHsgJGluOiBpbnN0YW5jZVtwYXRoXSB9IH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1BhdGhWYWx1ZSA9IE9iamVjdC5hc3NpZ24oe30sIG5ld1BhdGhWYWx1ZSwge1xuICAgICAgICAgICAgICB0eXBlOiByZWZNb2RlbFR5cGUsXG4gICAgICAgICAgICAgIHJlc29sdmU6IGFzeW5jIChpbnN0YW5jZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBtb2RlbC5maW5kQnlJZChpbnN0YW5jZVtwYXRoXSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgW3BhdGhdOiBuZXdQYXRoVmFsdWUgfVxuICAgICAgfSlcbiAgICAgIC5yZWR1Y2UoKHR5cGVGaWVsZCwgcGF0aCkgPT4gKE9iamVjdC5hc3NpZ24odHlwZUZpZWxkLCBwYXRoKSksIHt9KVxuXG4gICAgdHlwZU1hcFttb2RlbE5hbWVdLl90eXBlQ29uZmlnLmZpZWxkcyA9ICgpID0+IChuZXdUeXBlRmlsZWRzKVxuICB9KVxuXG4gIF90eXBlTWFwID0gT2JqZWN0LmFzc2lnbihfdHlwZU1hcCwgdHlwZU1hcClcbiAgcmV0dXJuIF90eXBlTWFwXG59XG5cbi8qIENvbnZlcnQgYSBtb25nb29zZSBtb2RlbCB0byBjb3JyZXNwb25kaW5nIHR5cGUgKi9cbmNvbnN0IHRvVHlwZSA9IChtb2RlbCkgPT4ge1xuICBjb25zdCBleGNlcHRQYXRoID0gWydfaWQnLCAnX192J11cbiAgY29uc3QgaW5oZXJpdE9wdHMgPSBbJ3JlZicsICdjb250ZXh0J11cbiAgY29uc3QgcGF0aHMgPSBtb2RlbC5zY2hlbWEucGF0aHNcbiAgbGV0IGZpZWxkcyA9IE9iamVjdC5rZXlzKHBhdGhzKVxuICAgIC5maWx0ZXIocGF0aCA9PiBleGNlcHRQYXRoLmluZGV4T2YocGF0aCkgPT09IC0xKVxuICAgIC5tYXAocGF0aCA9PiB7XG4gICAgICBjb25zdCBhdHRyID0gcGF0aHNbcGF0aF1cbiAgICAgIGxldCBmaWVsZCA9IHsgdHlwZTogcGF0aFRvVHlwZShhdHRyKSB9XG4gICAgICAvLyBGaW5kIG91dCBzcGVjaWFsIG9wdCBvbiBtb25nb29zZSBtb2RlbCdzIHBhdGgsIHVzZSBzdWJQYXRoJ3Mgb3B0IGlmIHBhdGggaXMgYW4gQXJyYXlcbiAgICAgIGluaGVyaXRPcHRzLmZvckVhY2gob3B0ID0+IHtcbiAgICAgICAgaWYgKGF0dHIub3B0aW9uc1tvcHRdIHx8IChhdHRyLmluc3RhbmNlID09PSAnQXJyYXknICYmIGF0dHIuY2FzdGVyLm9wdGlvbnNbb3B0XSkpIHtcbiAgICAgICAgICBmaWVsZFtvcHRdID0gYXR0ci5vcHRpb25zW29wdF0gfHwgYXR0ci5jYXN0ZXIub3B0aW9uc1tvcHRdXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAvLyBNYXJrIHJlcXVpcmVkIHBhdGhcbiAgICAgIGNvbnN0IHJlcXVpcmVkID0gYXR0ci5vcHRpb25zLnJlcXVpcmVkXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXF1aXJlZCkgJiYgcmVxdWlyZWRbMF0gfHwgcmVxdWlyZWQpIGZpZWxkLnJlcXVpcmVkID0gdHJ1ZVxuICAgICAgcmV0dXJuIHsgW3BhdGhdOiBmaWVsZCB9XG4gICAgfSlcbiAgICAucmVkdWNlKChmaWVsZHMsIHBhdGgpID0+IHtcbiAgICAgIC8vIG1ha2UgdXAgb2JqZWN0IHRwZSwgZS5nIHsgbmFtZTogeyBmaXJzdDoge3R5cGU6IEdyYXBoUUxTdHJpbmcuLi59LCBsYXN0OiB7dHlwZTogR3JhcGhRTFN0cmluZy4uLn0gfSB9XG4gICAgICBjb25zdCBwYXRoS2V5ID0gT2JqZWN0LmtleXMocGF0aClbMF1cbiAgICAgIGNvbnN0IHBhdGhLZXlTcGxpdCA9IHBhdGhLZXkuc3BsaXQoJy4nKVxuICAgICAgY29uc3QgcGF0aEtleUxlbmd0aCA9IHBhdGhLZXlTcGxpdC5sZW5ndGhcbiAgICAgIGlmIChwYXRoS2V5TGVuZ3RoLmxlbmd0aCA9PT0gMSkgcmV0dXJuIE9iamVjdC5hc3NpZ24oZmllbGRzLCBwYXRoKVxuICAgICAgcGF0aEtleVNwbGl0LnJlZHVjZSgoZmllbGRQb3N0aW9uLCBkZXB0aCwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGluZGV4ID09PSBwYXRoS2V5TGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGZpZWxkUG9zdGlvbltkZXB0aF0gPSBwYXRoW3BhdGhLZXldXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgZmllbGRQb3N0aW9uW2RlcHRoXSA9IGZpZWxkUG9zdGlvbltkZXB0aF0gfHwge31cbiAgICAgICAgcmV0dXJuIGZpZWxkUG9zdGlvbltkZXB0aF1cbiAgICAgIH0sIGZpZWxkcylcbiAgICAgIHJldHVybiBmaWVsZHNcbiAgICB9LCB7IGlkOiB7IHR5cGU6IEdyYXBoUUxJRCB9IH0pXG5cbiAgLy8gRGVhbCB3aXRoIG9iamVjdCBhdHRyaWJ1dGUgaW4gbW9uZ29vc2UgbW9kZWxcbiAgLy8gZS5nLiB7bmFtZToge2ZpcnN0OiBTdHJpbmcsIGxhc3Q6IFN0cmluZn19IC0+IHtuYW1lOiBHcmFwaFFMVHlwZXtmaWVsZHM6IHtmaXJzdDogR3JhcGhRTFN0cmluZywgdHdvOiBHcmFwaFFMU3RyaW5nfX19XG4gIGZpZWxkcyA9IE9iamVjdC5lbnRyaWVzKGZpZWxkcykubWFwKChba2V5LCBhdHRyXSkgPT4ge1xuICAgIHJldHVybiB7IFtrZXldOiBjb252ZXJ0T2JqZWN0KGF0dHIsIGAke21vZGVsLm1vZGVsTmFtZX0ke2tleX1gKSB9XG4gIH0pLnJlZHVjZSgoZmllbGRzLCBwYXRoKSA9PiAoT2JqZWN0LmFzc2lnbihmaWVsZHMsIHBhdGgpKSwge30pXG4gIHJldHVybiBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xuICAgIG5hbWU6IG1vZGVsLm1vZGVsTmFtZSxcbiAgICBmaWVsZHM6ICgpID0+IChmaWVsZHMpXG4gIH0pXG59XG5cbi8vIENvbnZlcnQgc2luZ2xlIHBhdGggb2YgbW9uZ29vc2UgdG8gdHlwZVxuY29uc3QgcGF0aFRvVHlwZSA9IChwYXRoKSA9PiB7XG4gIHN3aXRjaCAocGF0aC5pbnN0YW5jZSkge1xuICAgIGNhc2UgJ1N0cmluZyc6XG4gICAgICByZXR1cm4gR3JhcGhRTFN0cmluZ1xuICAgIGNhc2UgJ051bWJlcic6XG4gICAgICAvLyBGbG9hdCBpbmNsdWRlcyBJbnRcbiAgICAgIC8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2dyYXBocWwvZ3JhcGhxbC1qcy9ibG9iL21hc3Rlci9zcmMvdHlwZS9zY2FsYXJzLmpzI0w2OVxuICAgICAgcmV0dXJuIEdyYXBoUUxGbG9hdFxuICAgIGNhc2UgJ0RhdGUnOlxuICAgICAgcmV0dXJuIEdyYXBoUUxEYXRlXG4gICAgY2FzZSAnQnVmZmVyJzpcbiAgICAgIHJldHVybiBHcmFwaFFMQnVmZmVyXG4gICAgY2FzZSAnQm9vbGVhbic6XG4gICAgICByZXR1cm4gR3JhcGhRTEJvb2xlYW5cbiAgICBjYXNlICdNaXhlZCc6XG4gICAgICByZXR1cm4gR3JhcGhRTE1peGVkXG4gICAgY2FzZSAnT2JqZWN0SUQnOlxuICAgICAgcmV0dXJuIEdyYXBoUUxJRFxuICAgIGNhc2UgJ0FycmF5JzpcbiAgICAgIGNvbnN0IHN1YlR5cGUgPSBwYXRoVG9UeXBlKHBhdGguY2FzdGVyKVxuICAgICAgcmV0dXJuIG5ldyBHcmFwaFFMTGlzdChzdWJUeXBlKVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gR3JhcGhRTE1peGVkXG4gIH1cbn1cblxuLy8gQ29udmVydCBtb2RlbCdzIG9iamVjdCBhdHRyaWJ1dGVcbmNvbnN0IGNvbnZlcnRPYmplY3QgPSAoYXR0ciwgcGFyZW50TmFtZSkgPT4ge1xuICBpZiAoYXR0ci50eXBlICYmIChhdHRyLnR5cGUgaW5zdGFuY2VvZiBHcmFwaFFMU2NhbGFyVHlwZSB8fCBhdHRyLnR5cGUgaW5zdGFuY2VvZiBHcmFwaFFMTGlzdCkpIHJldHVybiBhdHRyXG4gIGNvbnN0IGZpZWxkcyA9IE9iamVjdC5lbnRyaWVzKGF0dHIpLm1hcCgoW2tleSwgdmFrdWVdKSA9PiB7XG4gICAgcmV0dXJuIHsgW2tleV06IGNvbnZlcnRPYmplY3QoYXR0cltrZXldLCBgJHtwYXJlbnROYW1lfSR7a2V5fWApIH1cbiAgfSkucmVkdWNlKChmaWVsZHMsIHBhdGgpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZyhwYXRoKVxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGZpZWxkcywgcGF0aClcbiAgfSwge30pXG4gIC8vIGNvbnNvbGUubG9nKGZpZWxkcylcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xuICAgICAgbmFtZTogYCR7cGFyZW50TmFtZX1gLFxuICAgICAgZmllbGRzOiAoKSA9PiAoZmllbGRzKVxuICAgIH0pXG4gIH1cbn1cbiJdfQ==