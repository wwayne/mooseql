'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.modelsToTypes = modelsToTypes;

var _graphql = require('graphql');

var _customType = require('./customType');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _typeMap = {};
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
  var _this = this;

  var typeMap = models.filter(function (model) {
    if (_typeMap[model.modelName]) return false;
    return true;
  }).reduce(function (map, model) {
    return (0, _assign2.default)(map, (0, _defineProperty3.default)({}, model.modelName, toType(model)));
  }, {});
  _typeMap = (0, _assign2.default)(_typeMap, typeMap);

  // Deal with ref after all types are defined
  (0, _entries2.default)(typeMap).forEach(function (_ref) {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

    var modelName = _ref2[0];
    var type = _ref2[1];

    var originFileds = type._typeConfig.fields();
    var newTypeFileds = (0, _entries2.default)(originFileds).map(function (_ref3) {
      var _ref4 = (0, _slicedToArray3.default)(_ref3, 2);

      var path = _ref4[0];
      var pathValue = _ref4[1];

      var newPathValue = (0, _assign2.default)({}, pathValue);
      if (newPathValue.ref) {
        (function () {
          var ref = newPathValue.ref;
          if (!_typeMap[ref]) throw TypeError(ref + ' is not a model');
          var model = models.find(function (m) {
            return m.modelName === ref;
          });
          var refModelType = _typeMap[ref];
          if (newPathValue.type instanceof _graphql.GraphQLList) {
            newPathValue = (0, _assign2.default)({}, newPathValue, {
              type: new _graphql.GraphQLList(refModelType),
              resolve: function () {
                var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(instance) {
                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return model.find({ _id: { $in: instance[path] } });

                        case 2:
                          return _context.abrupt('return', _context.sent);

                        case 3:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                return function resolve(_x) {
                  return _ref5.apply(this, arguments);
                };
              }()
            });
          } else {
            newPathValue = (0, _assign2.default)({}, newPathValue, {
              type: refModelType,
              resolve: function () {
                var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(instance) {
                  return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return model.findById(instance[path]);

                        case 2:
                          return _context2.abrupt('return', _context2.sent);

                        case 3:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _callee2, _this);
                }));

                return function resolve(_x2) {
                  return _ref6.apply(this, arguments);
                };
              }()
            });
          }
        })();
      }
      return (0, _defineProperty3.default)({}, path, newPathValue);
    }).reduce(function (typeField, path) {
      return (0, _assign2.default)(typeField, path);
    }, {});

    typeMap[modelName]._typeConfig.fields = function () {
      return newTypeFileds;
    };
  });

  _typeMap = (0, _assign2.default)(_typeMap, typeMap);
  return _typeMap;
}

/* Convert a mongoose model to corresponding type */
var toType = function toType(model) {
  var exceptPath = ['_id', '__v'];
  var inheritOpts = ['ref', 'context'];
  var paths = model.schema.paths;
  var _fields = (0, _keys2.default)(paths).filter(function (path) {
    return exceptPath.indexOf(path) === -1;
  }).map(function (path) {
    var attr = paths[path];
    var field = { type: pathToType(attr) };
    // Find out special opt on mongoose model's path, use subPath's opt if path is an Array
    inheritOpts.forEach(function (opt) {
      if (attr.options[opt] || attr.instance === 'Array' && attr.caster.options[opt]) {
        field[opt] = attr.options[opt] || attr.caster.options[opt];
      }
    });
    // Mark required path
    var required = attr.options.required;
    if (Array.isArray(required) && required[0] || required) field.required = true;
    return (0, _defineProperty3.default)({}, path, field);
  }).reduce(function (fields, path) {
    // make up object tpe, e.g { name: { first: {type: GraphQLString...}, last: {type: GraphQLString...} } }
    var pathKey = (0, _keys2.default)(path)[0];
    var pathKeySplit = pathKey.split('.');
    var pathKeyLength = pathKeySplit.length;
    if (pathKeyLength.length === 1) return (0, _assign2.default)(fields, path);
    pathKeySplit.reduce(function (fieldPostion, depth, index) {
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
  _fields = (0, _entries2.default)(_fields).map(function (_ref9) {
    var _ref10 = (0, _slicedToArray3.default)(_ref9, 2);

    var key = _ref10[0];
    var attr = _ref10[1];

    return (0, _defineProperty3.default)({}, key, convertObject(attr, '' + model.modelName + key));
  }).reduce(function (fields, path) {
    return (0, _assign2.default)(fields, path);
  }, {});
  return new _graphql.GraphQLObjectType({
    name: model.modelName,
    fields: function fields() {
      return _fields;
    }
  });
};

// Convert single path of mongoose to type
var pathToType = function pathToType(path) {
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
      var subType = pathToType(path.caster);
      return new _graphql.GraphQLList(subType);
    default:
      return _customType.GraphQLMixed;
  }
};

// Convert model's object attribute
var convertObject = function convertObject(attr, parentName) {
  if (attr.type && (attr.type instanceof _graphql.GraphQLScalarType || attr.type instanceof _graphql.GraphQLList)) return attr;
  var _fields2 = (0, _entries2.default)(attr).map(function (_ref12) {
    var _ref13 = (0, _slicedToArray3.default)(_ref12, 2);

    var key = _ref13[0];
    var vakue = _ref13[1];

    return (0, _defineProperty3.default)({}, key, convertObject(attr[key], '' + parentName + key));
  }).reduce(function (fields, path) {
    // console.log(path)
    return (0, _assign2.default)(fields, path);
  }, {});
  // console.log(fields)
  return {
    type: new _graphql.GraphQLObjectType({
      name: '' + parentName,
      fields: function fields() {
        return _fields2;
      }
    })
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90eXBlL2luZGV4LmpzIl0sIm5hbWVzIjpbIm1vZGVsc1RvVHlwZXMiLCJfdHlwZU1hcCIsIm1vZGVscyIsInR5cGVNYXAiLCJmaWx0ZXIiLCJtb2RlbCIsIm1vZGVsTmFtZSIsInJlZHVjZSIsIm1hcCIsInRvVHlwZSIsImZvckVhY2giLCJ0eXBlIiwib3JpZ2luRmlsZWRzIiwiX3R5cGVDb25maWciLCJmaWVsZHMiLCJuZXdUeXBlRmlsZWRzIiwicGF0aCIsInBhdGhWYWx1ZSIsIm5ld1BhdGhWYWx1ZSIsInJlZiIsIlR5cGVFcnJvciIsImZpbmQiLCJtIiwicmVmTW9kZWxUeXBlIiwicmVzb2x2ZSIsImluc3RhbmNlIiwiX2lkIiwiJGluIiwiZmluZEJ5SWQiLCJ0eXBlRmllbGQiLCJleGNlcHRQYXRoIiwiaW5oZXJpdE9wdHMiLCJwYXRocyIsInNjaGVtYSIsImluZGV4T2YiLCJhdHRyIiwiZmllbGQiLCJwYXRoVG9UeXBlIiwib3B0aW9ucyIsIm9wdCIsImNhc3RlciIsInJlcXVpcmVkIiwiQXJyYXkiLCJpc0FycmF5IiwicGF0aEtleSIsInBhdGhLZXlTcGxpdCIsInNwbGl0IiwicGF0aEtleUxlbmd0aCIsImxlbmd0aCIsImZpZWxkUG9zdGlvbiIsImRlcHRoIiwiaW5kZXgiLCJpZCIsImtleSIsImNvbnZlcnRPYmplY3QiLCJuYW1lIiwic3ViVHlwZSIsInBhcmVudE5hbWUiLCJ2YWt1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQXlCZ0JBLGEsR0FBQUEsYTs7QUF6QmhCOztBQVNBOzs7O0FBTUEsSUFBSUMsV0FBVyxFQUFmO0FBQ0E7Ozs7Ozs7OztBQVNPLFNBQVNELGFBQVQsQ0FBd0JFLE1BQXhCLEVBQWdDO0FBQUE7O0FBQ3JDLE1BQUlDLFVBQVVELE9BQU9FLE1BQVAsQ0FBYyxpQkFBUztBQUNuQyxRQUFJSCxTQUFTSSxNQUFNQyxTQUFmLENBQUosRUFBK0IsT0FBTyxLQUFQ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XG4gIEdyYXBoUUxJRCxcbiAgR3JhcGhRTE9iamVjdFR5cGUsXG4gIEdyYXBoUUxTdHJpbmcsXG4gIEdyYXBoUUxGbG9hdCxcbiAgR3JhcGhRTEJvb2xlYW4sXG4gIEdyYXBoUUxMaXN0LFxuICBHcmFwaFFMU2NhbGFyVHlwZVxufSBmcm9tICdncmFwaHFsJ1xuaW1wb3J0IHtcbiAgR3JhcGhRTEJ1ZmZlcixcbiAgR3JhcGhRTERhdGUsXG4gIEdyYXBoUUxNaXhlZFxufSBmcm9tICcuL2N1c3RvbVR5cGUnXG5cbmxldCBfdHlwZU1hcCA9IHt9XG4vKipcbiAqIENvbnZlcnQgYnVuZGNoIG9mIG1vbmdvb3NlIG1vZGVsIHRvIGdyYXBocWwgdHlwZXNcbiAqIGJ1aWxkIHRoaXMgYXMgc2luZ2xldG9uIHNvIHRoYXQgaXQgd29uJ3QgY3JlYXRlIGdyYXBoUUxUeXBlIHR3aWNlXG4gKlxuICogQHBhcmFtc1xuICogIC0gbW9kZWxzIHtBcnJheX0gbGlzdCBvZiBtb25nb29zZSBtb2RlbHNcbiAqIEByZXR1cm5cbiAqICAtIHR5cGVNYXAge09iamVjdH0ga2V5OiBtb2RlbE5hbWUsIHZhbHVlOiB0eXBlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtb2RlbHNUb1R5cGVzIChtb2RlbHMpIHtcbiAgbGV0IHR5cGVNYXAgPSBtb2RlbHMuZmlsdGVyKG1vZGVsID0+IHtcbiAgICBpZiAoX3R5cGVNYXBbbW9kZWwubW9kZWxOYW1lXSkgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIHRydWVcbiAgfSkucmVkdWNlKChtYXAsIG1vZGVsKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obWFwLCB7IFttb2RlbC5tb2RlbE5hbWVdOiB0b1R5cGUobW9kZWwpIH0pXG4gIH0sIHt9KVxuICBfdHlwZU1hcCA9IE9iamVjdC5hc3NpZ24oX3R5cGVNYXAsIHR5cGVNYXApXG5cbiAgLy8gRGVhbCB3aXRoIHJlZiBhZnRlciBhbGwgdHlwZXMgYXJlIGRlZmluZWRcbiAgT2JqZWN0LmVudHJpZXModHlwZU1hcCkuZm9yRWFjaCgoW21vZGVsTmFtZSwgdHlwZV0pID0+IHtcbiAgICBjb25zdCBvcmlnaW5GaWxlZHMgPSB0eXBlLl90eXBlQ29uZmlnLmZpZWxkcygpXG4gICAgY29uc3QgbmV3VHlwZUZpbGVkcyA9IE9iamVjdC5lbnRyaWVzKG9yaWdpbkZpbGVkcylcbiAgICAgIC5tYXAoKFtwYXRoLCBwYXRoVmFsdWVdKSA9PiB7XG4gICAgICAgIGxldCBuZXdQYXRoVmFsdWUgPSBPYmplY3QuYXNzaWduKHt9LCBwYXRoVmFsdWUpXG4gICAgICAgIGlmIChuZXdQYXRoVmFsdWUucmVmKSB7XG4gICAgICAgICAgY29uc3QgcmVmID0gbmV3UGF0aFZhbHVlLnJlZlxuICAgICAgICAgIGlmICghX3R5cGVNYXBbcmVmXSkgdGhyb3cgVHlwZUVycm9yKGAke3JlZn0gaXMgbm90IGEgbW9kZWxgKVxuICAgICAgICAgIGNvbnN0IG1vZGVsID0gbW9kZWxzLmZpbmQobSA9PiBtLm1vZGVsTmFtZSA9PT0gcmVmKVxuICAgICAgICAgIGNvbnN0IHJlZk1vZGVsVHlwZSA9IF90eXBlTWFwW3JlZl1cbiAgICAgICAgICBpZiAobmV3UGF0aFZhbHVlLnR5cGUgaW5zdGFuY2VvZiBHcmFwaFFMTGlzdCkge1xuICAgICAgICAgICAgbmV3UGF0aFZhbHVlID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3UGF0aFZhbHVlLCB7XG4gICAgICAgICAgICAgIHR5cGU6IG5ldyBHcmFwaFFMTGlzdChyZWZNb2RlbFR5cGUpLFxuICAgICAgICAgICAgICByZXNvbHZlOiBhc3luYyAoaW5zdGFuY2UpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBhcmdzIGZpbHRlclxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBtb2RlbC5maW5kKHsgX2lkOiB7ICRpbjogaW5zdGFuY2VbcGF0aF0gfSB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdQYXRoVmFsdWUgPSBPYmplY3QuYXNzaWduKHt9LCBuZXdQYXRoVmFsdWUsIHtcbiAgICAgICAgICAgICAgdHlwZTogcmVmTW9kZWxUeXBlLFxuICAgICAgICAgICAgICByZXNvbHZlOiBhc3luYyAoaW5zdGFuY2UpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgbW9kZWwuZmluZEJ5SWQoaW5zdGFuY2VbcGF0aF0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IFtwYXRoXTogbmV3UGF0aFZhbHVlIH1cbiAgICAgIH0pXG4gICAgICAucmVkdWNlKCh0eXBlRmllbGQsIHBhdGgpID0+IChPYmplY3QuYXNzaWduKHR5cGVGaWVsZCwgcGF0aCkpLCB7fSlcblxuICAgIHR5cGVNYXBbbW9kZWxOYW1lXS5fdHlwZUNvbmZpZy5maWVsZHMgPSAoKSA9PiAobmV3VHlwZUZpbGVkcylcbiAgfSlcblxuICBfdHlwZU1hcCA9IE9iamVjdC5hc3NpZ24oX3R5cGVNYXAsIHR5cGVNYXApXG4gIHJldHVybiBfdHlwZU1hcFxufVxuXG4vKiBDb252ZXJ0IGEgbW9uZ29vc2UgbW9kZWwgdG8gY29ycmVzcG9uZGluZyB0eXBlICovXG5jb25zdCB0b1R5cGUgPSAobW9kZWwpID0+IHtcbiAgY29uc3QgZXhjZXB0UGF0aCA9IFsnX2lkJywgJ19fdiddXG4gIGNvbnN0IGluaGVyaXRPcHRzID0gWydyZWYnLCAnY29udGV4dCddXG4gIGNvbnN0IHBhdGhzID0gbW9kZWwuc2NoZW1hLnBhdGhzXG4gIGxldCBmaWVsZHMgPSBPYmplY3Qua2V5cyhwYXRocylcbiAgICAuZmlsdGVyKHBhdGggPT4gZXhjZXB0UGF0aC5pbmRleE9mKHBhdGgpID09PSAtMSlcbiAgICAubWFwKHBhdGggPT4ge1xuICAgICAgY29uc3QgYXR0ciA9IHBhdGhzW3BhdGhdXG4gICAgICBsZXQgZmllbGQgPSB7IHR5cGU6IHBhdGhUb1R5cGUoYXR0cikgfVxuICAgICAgLy8gRmluZCBvdXQgc3BlY2lhbCBvcHQgb24gbW9uZ29vc2UgbW9kZWwncyBwYXRoLCB1c2Ugc3ViUGF0aCdzIG9wdCBpZiBwYXRoIGlzIGFuIEFycmF5XG4gICAgICBpbmhlcml0T3B0cy5mb3JFYWNoKG9wdCA9PiB7XG4gICAgICAgIGlmIChhdHRyLm9wdGlvbnNbb3B0XSB8fCAoYXR0ci5pbnN0YW5jZSA9PT0gJ0FycmF5JyAmJiBhdHRyLmNhc3Rlci5vcHRpb25zW29wdF0pKSB7XG4gICAgICAgICAgZmllbGRbb3B0XSA9IGF0dHIub3B0aW9uc1tvcHRdIHx8IGF0dHIuY2FzdGVyLm9wdGlvbnNbb3B0XVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLy8gTWFyayByZXF1aXJlZCBwYXRoXG4gICAgICBjb25zdCByZXF1aXJlZCA9IGF0dHIub3B0aW9ucy5yZXF1aXJlZFxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVxdWlyZWQpICYmIHJlcXVpcmVkWzBdIHx8IHJlcXVpcmVkKSBmaWVsZC5yZXF1aXJlZCA9IHRydWVcbiAgICAgIHJldHVybiB7IFtwYXRoXTogZmllbGQgfVxuICAgIH0pXG4gICAgLnJlZHVjZSgoZmllbGRzLCBwYXRoKSA9PiB7XG4gICAgICAvLyBtYWtlIHVwIG9iamVjdCB0cGUsIGUuZyB7IG5hbWU6IHsgZmlyc3Q6IHt0eXBlOiBHcmFwaFFMU3RyaW5nLi4ufSwgbGFzdDoge3R5cGU6IEdyYXBoUUxTdHJpbmcuLi59IH0gfVxuICAgICAgY29uc3QgcGF0aEtleSA9IE9iamVjdC5rZXlzKHBhdGgpWzBdXG4gICAgICBjb25zdCBwYXRoS2V5U3BsaXQgPSBwYXRoS2V5LnNwbGl0KCcuJylcbiAgICAgIGNvbnN0IHBhdGhLZXlMZW5ndGggPSBwYXRoS2V5U3BsaXQubGVuZ3RoXG4gICAgICBpZiAocGF0aEtleUxlbmd0aC5sZW5ndGggPT09IDEpIHJldHVybiBPYmplY3QuYXNzaWduKGZpZWxkcywgcGF0aClcbiAgICAgIHBhdGhLZXlTcGxpdC5yZWR1Y2UoKGZpZWxkUG9zdGlvbiwgZGVwdGgsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gcGF0aEtleUxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBmaWVsZFBvc3Rpb25bZGVwdGhdID0gcGF0aFtwYXRoS2V5XVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGZpZWxkUG9zdGlvbltkZXB0aF0gPSBmaWVsZFBvc3Rpb25bZGVwdGhdIHx8IHt9XG4gICAgICAgIHJldHVybiBmaWVsZFBvc3Rpb25bZGVwdGhdXG4gICAgICB9LCBmaWVsZHMpXG4gICAgICByZXR1cm4gZmllbGRzXG4gICAgfSwgeyBpZDogeyB0eXBlOiBHcmFwaFFMSUQgfSB9KVxuXG4gIC8vIERlYWwgd2l0aCBvYmplY3QgYXR0cmlidXRlIGluIG1vbmdvb3NlIG1vZGVsXG4gIC8vIGUuZy4ge25hbWU6IHtmaXJzdDogU3RyaW5nLCBsYXN0OiBTdHJpbmZ9fSAtPiB7bmFtZTogR3JhcGhRTFR5cGV7ZmllbGRzOiB7Zmlyc3Q6IEdyYXBoUUxTdHJpbmcsIHR3bzogR3JhcGhRTFN0cmluZ319fVxuICBmaWVsZHMgPSBPYmplY3QuZW50cmllcyhmaWVsZHMpLm1hcCgoW2tleSwgYXR0cl0pID0+IHtcbiAgICByZXR1cm4geyBba2V5XTogY29udmVydE9iamVjdChhdHRyLCBgJHttb2RlbC5tb2RlbE5hbWV9JHtrZXl9YCkgfVxuICB9KS5yZWR1Y2UoKGZpZWxkcywgcGF0aCkgPT4gKE9iamVjdC5hc3NpZ24oZmllbGRzLCBwYXRoKSksIHt9KVxuICByZXR1cm4gbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcbiAgICBuYW1lOiBtb2RlbC5tb2RlbE5hbWUsXG4gICAgZmllbGRzOiAoKSA9PiAoZmllbGRzKVxuICB9KVxufVxuXG4vLyBDb252ZXJ0IHNpbmdsZSBwYXRoIG9mIG1vbmdvb3NlIHRvIHR5cGVcbmNvbnN0IHBhdGhUb1R5cGUgPSAocGF0aCkgPT4ge1xuICBzd2l0Y2ggKHBhdGguaW5zdGFuY2UpIHtcbiAgICBjYXNlICdTdHJpbmcnOlxuICAgICAgcmV0dXJuIEdyYXBoUUxTdHJpbmdcbiAgICBjYXNlICdOdW1iZXInOlxuICAgICAgLy8gRmxvYXQgaW5jbHVkZXMgSW50XG4gICAgICAvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9ncmFwaHFsL2dyYXBocWwtanMvYmxvYi9tYXN0ZXIvc3JjL3R5cGUvc2NhbGFycy5qcyNMNjlcbiAgICAgIHJldHVybiBHcmFwaFFMRmxvYXRcbiAgICBjYXNlICdEYXRlJzpcbiAgICAgIHJldHVybiBHcmFwaFFMRGF0ZVxuICAgIGNhc2UgJ0J1ZmZlcic6XG4gICAgICByZXR1cm4gR3JhcGhRTEJ1ZmZlclxuICAgIGNhc2UgJ0Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIEdyYXBoUUxCb29sZWFuXG4gICAgY2FzZSAnTWl4ZWQnOlxuICAgICAgcmV0dXJuIEdyYXBoUUxNaXhlZFxuICAgIGNhc2UgJ09iamVjdElEJzpcbiAgICAgIHJldHVybiBHcmFwaFFMSURcbiAgICBjYXNlICdBcnJheSc6XG4gICAgICBjb25zdCBzdWJUeXBlID0gcGF0aFRvVHlwZShwYXRoLmNhc3RlcilcbiAgICAgIHJldHVybiBuZXcgR3JhcGhRTExpc3Qoc3ViVHlwZSlcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIEdyYXBoUUxNaXhlZFxuICB9XG59XG5cbi8vIENvbnZlcnQgbW9kZWwncyBvYmplY3QgYXR0cmlidXRlXG5jb25zdCBjb252ZXJ0T2JqZWN0ID0gKGF0dHIsIHBhcmVudE5hbWUpID0+IHtcbiAgaWYgKGF0dHIudHlwZSAmJiAoYXR0ci50eXBlIGluc3RhbmNlb2YgR3JhcGhRTFNjYWxhclR5cGUgfHwgYXR0ci50eXBlIGluc3RhbmNlb2YgR3JhcGhRTExpc3QpKSByZXR1cm4gYXR0clxuICBjb25zdCBmaWVsZHMgPSBPYmplY3QuZW50cmllcyhhdHRyKS5tYXAoKFtrZXksIHZha3VlXSkgPT4ge1xuICAgIHJldHVybiB7IFtrZXldOiBjb252ZXJ0T2JqZWN0KGF0dHJba2V5XSwgYCR7cGFyZW50TmFtZX0ke2tleX1gKSB9XG4gIH0pLnJlZHVjZSgoZmllbGRzLCBwYXRoKSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2cocGF0aClcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihmaWVsZHMsIHBhdGgpXG4gIH0sIHt9KVxuICAvLyBjb25zb2xlLmxvZyhmaWVsZHMpXG4gIHJldHVybiB7XG4gICAgdHlwZTogbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcbiAgICAgIG5hbWU6IGAke3BhcmVudE5hbWV9YCxcbiAgICAgIGZpZWxkczogKCkgPT4gKGZpZWxkcylcbiAgICB9KVxuICB9XG59XG4iXX0=