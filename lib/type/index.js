'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

      if (pathValue.ref) {
        var _ret = function () {
          var ref = pathValue.ref;
          if (!_typeMap[ref]) throw TypeError(ref + ' is not a model');
          var model = models.find(function (m) {
            return m.modelName === ref;
          });
          var refModelType = _typeMap[ref];
          if (pathValue.type instanceof _graphql.GraphQLList) {
            return {
              v: (0, _defineProperty3.default)({}, path, {
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
              })
            };
          } else {
            return {
              v: (0, _defineProperty3.default)({}, path, {
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
              })
            };
          }
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
      }
      return (0, _defineProperty3.default)({}, path, pathValue);
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
  var paths = model.schema.paths;
  var _fields = (0, _keys2.default)(paths).filter(function (path) {
    return exceptPath.indexOf(path) === -1;
  }).map(function (path) {
    var attr = paths[path];
    var field = { type: pathToType(attr) };
    // Find out ref on mongoose model's path, use subPath's ref if path is an Array
    if (attr.options.ref || attr.instance === 'Array' && attr.caster.options.ref) {
      field.ref = attr.options.ref || attr.caster.options.ref;
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90eXBlL2luZGV4LmpzIl0sIm5hbWVzIjpbIm1vZGVsc1RvVHlwZXMiLCJfdHlwZU1hcCIsIm1vZGVscyIsInR5cGVNYXAiLCJmaWx0ZXIiLCJtb2RlbCIsIm1vZGVsTmFtZSIsInJlZHVjZSIsIm1hcCIsInRvVHlwZSIsImZvckVhY2giLCJ0eXBlIiwib3JpZ2luRmlsZWRzIiwiX3R5cGVDb25maWciLCJmaWVsZHMiLCJuZXdUeXBlRmlsZWRzIiwicGF0aCIsInBhdGhWYWx1ZSIsInJlZiIsIlR5cGVFcnJvciIsImZpbmQiLCJtIiwicmVmTW9kZWxUeXBlIiwicmVzb2x2ZSIsImluc3RhbmNlIiwiX2lkIiwiJGluIiwiZmluZEJ5SWQiLCJ0eXBlRmllbGQiLCJleGNlcHRQYXRoIiwicGF0aHMiLCJzY2hlbWEiLCJpbmRleE9mIiwiYXR0ciIsImZpZWxkIiwicGF0aFRvVHlwZSIsIm9wdGlvbnMiLCJjYXN0ZXIiLCJyZXF1aXJlZCIsIkFycmF5IiwiaXNBcnJheSIsInBhdGhLZXkiLCJwYXRoS2V5U3BsaXQiLCJzcGxpdCIsInBhdGhLZXlMZW5ndGgiLCJsZW5ndGgiLCJmaWVsZFBvc3Rpb24iLCJkZXB0aCIsImluZGV4IiwiaWQiLCJrZXkiLCJjb252ZXJ0T2JqZWN0IiwibmFtZSIsInN1YlR5cGUiLCJwYXJlbnROYW1lIiwidmFrdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBeUJnQkEsYSxHQUFBQSxhOztBQXpCaEI7O0FBU0E7Ozs7QUFNQSxJQUFJQyxXQUFXLEVBQWY7QUFDQTs7Ozs7Ozs7O0FBU08sU0FBU0QsYUFBVCxDQUF3QkUsTUFBeEIsRUFBZ0M7QUFBQTs7QUFDckMsTUFBSUMsVUFBVUQsT0FBT0UsTUFBUCxDQUFjLGlCQUFTO0FBQ25DLFFBQUlILFNBQVNJLE1BQU1DLFNBQWYsQ0FBSixFQUErQixPQUFPLEtBQVA7QUFDL0IsV0FBTyxJQUFQO0FBQ0QsR0FIYSxFQUdY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aEI7QUFDQSxhQUFPLHlCQUFnQmdCLE9BQWhCLENBQVA7QUFDRjtBQUNFO0FBckJKO0FBdUJELENBeEJEOztBQTBCQTtBQUNBLElBQU1GLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBQ2xCLElBQUQsRUFBT3FCLFVBQVAsRUFBc0I7QUFDMUMsTUFBSXJCLEtBQUt0QixJQUFMLEtBQWNzQixLQUFLdEIsSUFBTCwwQ0FBMENzQixLQUFLdEIsSUFBTCxnQ0FBeEQsQ0FBSixFQUErRixPQUFPc0IsSUFBUDtBQUMvRixNQUFNbkIsV0FBUyx1QkFBZW1CLElBQWYsRUFBcUJ6QixHQUFyQixDQUF5QixrQkFBa0I7QUFBQTs7QUFBQSxRQUFoQjBDLEdBQWdCO0FBQUEsUUFBWEssS0FBVzs7QUFDeEQsNkNBQVVMLEdBQVYsRUFBZ0JDLGNBQWNsQixLQUFLaUIsR0FBTCxDQUFkLE9BQTRCSSxVQUE1QixHQUF5Q0osR0FBekMsQ0FBaEI7QUFDRCxHQUZjLEVBRVozQyxNQUZZLENBRUwsVUFBQ08sTUFBRCxFQUFTRSxJQUFULEVBQWtCO0FBQzFCO0FBQ0EsV0FBTyxzQkFBY0YsTUFBZCxFQUFzQkUsSUFBdEIsQ0FBUDtBQUNELEdBTGMsRUFLWixFQUxZLENBQWY7QUFNQTtBQUNBLFNBQU87QUFDTEwsVUFBTSwrQkFBc0I7QUFDMUJ5QyxpQkFBU0UsVUFEaUI7QUFFMUJ4QyxjQUFRO0FBQUEsZUFBT0EsUUFBUDtBQUFBO0FBRmtCLEtBQXRCO0FBREQsR0FBUDtBQU1ELENBZkQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBHcmFwaFFMSUQsXG4gIEdyYXBoUUxPYmplY3RUeXBlLFxuICBHcmFwaFFMU3RyaW5nLFxuICBHcmFwaFFMRmxvYXQsXG4gIEdyYXBoUUxCb29sZWFuLFxuICBHcmFwaFFMTGlzdCxcbiAgR3JhcGhRTFNjYWxhclR5cGVcbn0gZnJvbSAnZ3JhcGhxbCdcbmltcG9ydCB7XG4gIEdyYXBoUUxCdWZmZXIsXG4gIEdyYXBoUUxEYXRlLFxuICBHcmFwaFFMTWl4ZWRcbn0gZnJvbSAnLi9jdXN0b21UeXBlJ1xuXG5sZXQgX3R5cGVNYXAgPSB7fVxuLyoqXG4gKiBDb252ZXJ0IGJ1bmRjaCBvZiBtb25nb29zZSBtb2RlbCB0byBncmFwaHFsIHR5cGVzXG4gKiBidWlsZCB0aGlzIGFzIHNpbmdsZXRvbiBzbyB0aGF0IGl0IHdvbid0IGNyZWF0ZSBncmFwaFFMVHlwZSB0d2ljZVxuICpcbiAqIEBwYXJhbXNcbiAqICAtIG1vZGVscyB7QXJyYXl9IGxpc3Qgb2YgbW9uZ29vc2UgbW9kZWxzXG4gKiBAcmV0dXJuXG4gKiAgLSB0eXBlTWFwIHtPYmplY3R9IGtleTogbW9kZWxOYW1lLCB2YWx1ZTogdHlwZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbW9kZWxzVG9UeXBlcyAobW9kZWxzKSB7XG4gIGxldCB0eXBlTWFwID0gbW9kZWxzLmZpbHRlcihtb2RlbCA9PiB7XG4gICAgaWYgKF90eXBlTWFwW21vZGVsLm1vZGVsTmFtZV0pIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG4gIH0pLnJlZHVjZSgobWFwLCBtb2RlbCkgPT4ge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKG1hcCwgeyBbbW9kZWwubW9kZWxOYW1lXTogdG9UeXBlKG1vZGVsKSB9KVxuICB9LCB7fSlcbiAgX3R5cGVNYXAgPSBPYmplY3QuYXNzaWduKF90eXBlTWFwLCB0eXBlTWFwKVxuXG4gIC8vIERlYWwgd2l0aCByZWYgYWZ0ZXIgYWxsIHR5cGVzIGFyZSBkZWZpbmVkXG4gIE9iamVjdC5lbnRyaWVzKHR5cGVNYXApLmZvckVhY2goKFttb2RlbE5hbWUsIHR5cGVdKSA9PiB7XG4gICAgY29uc3Qgb3JpZ2luRmlsZWRzID0gdHlwZS5fdHlwZUNvbmZpZy5maWVsZHMoKVxuICAgIGNvbnN0IG5ld1R5cGVGaWxlZHMgPSBPYmplY3QuZW50cmllcyhvcmlnaW5GaWxlZHMpXG4gICAgICAubWFwKChbcGF0aCwgcGF0aFZhbHVlXSkgPT4ge1xuICAgICAgICBpZiAocGF0aFZhbHVlLnJlZikge1xuICAgICAgICAgIGNvbnN0IHJlZiA9IHBhdGhWYWx1ZS5yZWZcbiAgICAgICAgICBpZiAoIV90eXBlTWFwW3JlZl0pIHRocm93IFR5cGVFcnJvcihgJHtyZWZ9IGlzIG5vdCBhIG1vZGVsYClcbiAgICAgICAgICBjb25zdCBtb2RlbCA9IG1vZGVscy5maW5kKG0gPT4gbS5tb2RlbE5hbWUgPT09IHJlZilcbiAgICAgICAgICBjb25zdCByZWZNb2RlbFR5cGUgPSBfdHlwZU1hcFtyZWZdXG4gICAgICAgICAgaWYgKHBhdGhWYWx1ZS50eXBlIGluc3RhbmNlb2YgR3JhcGhRTExpc3QpIHtcbiAgICAgICAgICAgIHJldHVybiB7W3BhdGhdOiB7XG4gICAgICAgICAgICAgIHR5cGU6IG5ldyBHcmFwaFFMTGlzdChyZWZNb2RlbFR5cGUpLFxuICAgICAgICAgICAgICByZXNvbHZlOiBhc3luYyAoaW5zdGFuY2UpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBhcmdzIGZpbHRlclxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBtb2RlbC5maW5kKHsgX2lkOiB7ICRpbjogaW5zdGFuY2VbcGF0aF0gfSB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9fVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1twYXRoXToge1xuICAgICAgICAgICAgICB0eXBlOiByZWZNb2RlbFR5cGUsXG4gICAgICAgICAgICAgIHJlc29sdmU6IGFzeW5jIChpbnN0YW5jZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBtb2RlbC5maW5kQnlJZChpbnN0YW5jZVtwYXRoXSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgW3BhdGhdOiBwYXRoVmFsdWUgfVxuICAgICAgfSlcbiAgICAgIC5yZWR1Y2UoKHR5cGVGaWVsZCwgcGF0aCkgPT4gKE9iamVjdC5hc3NpZ24odHlwZUZpZWxkLCBwYXRoKSksIHt9KVxuXG4gICAgdHlwZU1hcFttb2RlbE5hbWVdLl90eXBlQ29uZmlnLmZpZWxkcyA9ICgpID0+IChuZXdUeXBlRmlsZWRzKVxuICB9KVxuXG4gIF90eXBlTWFwID0gT2JqZWN0LmFzc2lnbihfdHlwZU1hcCwgdHlwZU1hcClcbiAgcmV0dXJuIF90eXBlTWFwXG59XG5cbi8qIENvbnZlcnQgYSBtb25nb29zZSBtb2RlbCB0byBjb3JyZXNwb25kaW5nIHR5cGUgKi9cbmNvbnN0IHRvVHlwZSA9IChtb2RlbCkgPT4ge1xuICBjb25zdCBleGNlcHRQYXRoID0gWydfaWQnLCAnX192J11cbiAgY29uc3QgcGF0aHMgPSBtb2RlbC5zY2hlbWEucGF0aHNcbiAgbGV0IGZpZWxkcyA9IE9iamVjdC5rZXlzKHBhdGhzKVxuICAgIC5maWx0ZXIocGF0aCA9PiBleGNlcHRQYXRoLmluZGV4T2YocGF0aCkgPT09IC0xKVxuICAgIC5tYXAocGF0aCA9PiB7XG4gICAgICBjb25zdCBhdHRyID0gcGF0aHNbcGF0aF1cbiAgICAgIGNvbnN0IGZpZWxkID0geyB0eXBlOiBwYXRoVG9UeXBlKGF0dHIpIH1cbiAgICAgIC8vIEZpbmQgb3V0IHJlZiBvbiBtb25nb29zZSBtb2RlbCdzIHBhdGgsIHVzZSBzdWJQYXRoJ3MgcmVmIGlmIHBhdGggaXMgYW4gQXJyYXlcbiAgICAgIGlmIChhdHRyLm9wdGlvbnMucmVmIHx8IChhdHRyLmluc3RhbmNlID09PSAnQXJyYXknICYmIGF0dHIuY2FzdGVyLm9wdGlvbnMucmVmKSkge1xuICAgICAgICBmaWVsZC5yZWYgPSBhdHRyLm9wdGlvbnMucmVmIHx8IGF0dHIuY2FzdGVyLm9wdGlvbnMucmVmXG4gICAgICB9XG4gICAgICAvLyBNYXJrIHJlcXVpcmVkIHBhdGhcbiAgICAgIGNvbnN0IHJlcXVpcmVkID0gYXR0ci5vcHRpb25zLnJlcXVpcmVkXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXF1aXJlZCkgJiYgcmVxdWlyZWRbMF0gfHwgcmVxdWlyZWQpIGZpZWxkLnJlcXVpcmVkID0gdHJ1ZVxuICAgICAgcmV0dXJuIHsgW3BhdGhdOiBmaWVsZCB9XG4gICAgfSlcbiAgICAucmVkdWNlKChmaWVsZHMsIHBhdGgpID0+IHtcbiAgICAgIC8vIG1ha2UgdXAgb2JqZWN0IHRwZSwgZS5nIHsgbmFtZTogeyBmaXJzdDoge3R5cGU6IEdyYXBoUUxTdHJpbmcuLi59LCBsYXN0OiB7dHlwZTogR3JhcGhRTFN0cmluZy4uLn0gfSB9XG4gICAgICBjb25zdCBwYXRoS2V5ID0gT2JqZWN0LmtleXMocGF0aClbMF1cbiAgICAgIGNvbnN0IHBhdGhLZXlTcGxpdCA9IHBhdGhLZXkuc3BsaXQoJy4nKVxuICAgICAgY29uc3QgcGF0aEtleUxlbmd0aCA9IHBhdGhLZXlTcGxpdC5sZW5ndGhcbiAgICAgIGlmIChwYXRoS2V5TGVuZ3RoLmxlbmd0aCA9PT0gMSkgcmV0dXJuIE9iamVjdC5hc3NpZ24oZmllbGRzLCBwYXRoKVxuICAgICAgcGF0aEtleVNwbGl0LnJlZHVjZSgoZmllbGRQb3N0aW9uLCBkZXB0aCwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGluZGV4ID09PSBwYXRoS2V5TGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGZpZWxkUG9zdGlvbltkZXB0aF0gPSBwYXRoW3BhdGhLZXldXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgZmllbGRQb3N0aW9uW2RlcHRoXSA9IGZpZWxkUG9zdGlvbltkZXB0aF0gfHwge31cbiAgICAgICAgcmV0dXJuIGZpZWxkUG9zdGlvbltkZXB0aF1cbiAgICAgIH0sIGZpZWxkcylcbiAgICAgIHJldHVybiBmaWVsZHNcbiAgICB9LCB7IGlkOiB7IHR5cGU6IEdyYXBoUUxJRCB9IH0pXG5cbiAgLy8gRGVhbCB3aXRoIG9iamVjdCBhdHRyaWJ1dGUgaW4gbW9uZ29vc2UgbW9kZWxcbiAgLy8gZS5nLiB7bmFtZToge2ZpcnN0OiBTdHJpbmcsIGxhc3Q6IFN0cmluZn19IC0+IHtuYW1lOiBHcmFwaFFMVHlwZXtmaWVsZHM6IHtmaXJzdDogR3JhcGhRTFN0cmluZywgdHdvOiBHcmFwaFFMU3RyaW5nfX19XG4gIGZpZWxkcyA9IE9iamVjdC5lbnRyaWVzKGZpZWxkcykubWFwKChba2V5LCBhdHRyXSkgPT4ge1xuICAgIHJldHVybiB7IFtrZXldOiBjb252ZXJ0T2JqZWN0KGF0dHIsIGAke21vZGVsLm1vZGVsTmFtZX0ke2tleX1gKSB9XG4gIH0pLnJlZHVjZSgoZmllbGRzLCBwYXRoKSA9PiAoT2JqZWN0LmFzc2lnbihmaWVsZHMsIHBhdGgpKSwge30pXG4gIHJldHVybiBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xuICAgIG5hbWU6IG1vZGVsLm1vZGVsTmFtZSxcbiAgICBmaWVsZHM6ICgpID0+IChmaWVsZHMpXG4gIH0pXG59XG5cbi8vIENvbnZlcnQgc2luZ2xlIHBhdGggb2YgbW9uZ29vc2UgdG8gdHlwZVxuY29uc3QgcGF0aFRvVHlwZSA9IChwYXRoKSA9PiB7XG4gIHN3aXRjaCAocGF0aC5pbnN0YW5jZSkge1xuICAgIGNhc2UgJ1N0cmluZyc6XG4gICAgICByZXR1cm4gR3JhcGhRTFN0cmluZ1xuICAgIGNhc2UgJ051bWJlcic6XG4gICAgICAvLyBGbG9hdCBpbmNsdWRlcyBJbnRcbiAgICAgIC8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2dyYXBocWwvZ3JhcGhxbC1qcy9ibG9iL21hc3Rlci9zcmMvdHlwZS9zY2FsYXJzLmpzI0w2OVxuICAgICAgcmV0dXJuIEdyYXBoUUxGbG9hdFxuICAgIGNhc2UgJ0RhdGUnOlxuICAgICAgcmV0dXJuIEdyYXBoUUxEYXRlXG4gICAgY2FzZSAnQnVmZmVyJzpcbiAgICAgIHJldHVybiBHcmFwaFFMQnVmZmVyXG4gICAgY2FzZSAnQm9vbGVhbic6XG4gICAgICByZXR1cm4gR3JhcGhRTEJvb2xlYW5cbiAgICBjYXNlICdNaXhlZCc6XG4gICAgICByZXR1cm4gR3JhcGhRTE1peGVkXG4gICAgY2FzZSAnT2JqZWN0SUQnOlxuICAgICAgcmV0dXJuIEdyYXBoUUxJRFxuICAgIGNhc2UgJ0FycmF5JzpcbiAgICAgIGNvbnN0IHN1YlR5cGUgPSBwYXRoVG9UeXBlKHBhdGguY2FzdGVyKVxuICAgICAgcmV0dXJuIG5ldyBHcmFwaFFMTGlzdChzdWJUeXBlKVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gR3JhcGhRTE1peGVkXG4gIH1cbn1cblxuLy8gQ29udmVydCBtb2RlbCdzIG9iamVjdCBhdHRyaWJ1dGVcbmNvbnN0IGNvbnZlcnRPYmplY3QgPSAoYXR0ciwgcGFyZW50TmFtZSkgPT4ge1xuICBpZiAoYXR0ci50eXBlICYmIChhdHRyLnR5cGUgaW5zdGFuY2VvZiBHcmFwaFFMU2NhbGFyVHlwZSB8fCBhdHRyLnR5cGUgaW5zdGFuY2VvZiBHcmFwaFFMTGlzdCkpIHJldHVybiBhdHRyXG4gIGNvbnN0IGZpZWxkcyA9IE9iamVjdC5lbnRyaWVzKGF0dHIpLm1hcCgoW2tleSwgdmFrdWVdKSA9PiB7XG4gICAgcmV0dXJuIHsgW2tleV06IGNvbnZlcnRPYmplY3QoYXR0cltrZXldLCBgJHtwYXJlbnROYW1lfSR7a2V5fWApIH1cbiAgfSkucmVkdWNlKChmaWVsZHMsIHBhdGgpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZyhwYXRoKVxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGZpZWxkcywgcGF0aClcbiAgfSwge30pXG4gIC8vIGNvbnNvbGUubG9nKGZpZWxkcylcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xuICAgICAgbmFtZTogYCR7cGFyZW50TmFtZX1gLFxuICAgICAgZmllbGRzOiAoKSA9PiAoZmllbGRzKVxuICAgIH0pXG4gIH1cbn1cbiJdfQ==