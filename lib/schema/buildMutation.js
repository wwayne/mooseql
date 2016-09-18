'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

exports.default = function (model, type) {
  var _ref;

  var modelName = model.modelName;
  var defaultArgs = (0, _buildArgs2.default)(type);
  return _ref = {}, (0, _defineProperty3.default)(_ref, 'create' + modelName, buildCreate(model, type, defaultArgs)), (0, _defineProperty3.default)(_ref, 'update' + modelName, buildUpdate(model, type, defaultArgs)), (0, _defineProperty3.default)(_ref, 'delete' + modelName, buildDelete(model, type, defaultArgs)), _ref;
};

var _graphql = require('graphql');

var _buildArgs = require('./buildArgs');

var _buildArgs2 = _interopRequireDefault(_buildArgs);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildCreate = function buildCreate(Model, type, defaultArgs) {
  var createArgs = (0, _utils.filterArgs)(defaultArgs, { id: true, plural: true });
  var lazyRequiredCheck = (0, _entries2.default)(createArgs).filter(function (_ref2) {
    var _ref3 = (0, _slicedToArray3.default)(_ref2, 2);

    var key = _ref3[0];
    var value = _ref3[1];

    return value.required && value.context;
  });
  return {
    type: type,
    args: createArgs,
    resolve: function () {
      var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(root, args, context) {
        var instance;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // Check if an arg is required and has context
                // because it won't be marked as GraphqlNonNull
                lazyRequiredCheck.forEach(function (_ref5) {
                  var _ref6 = (0, _slicedToArray3.default)(_ref5, 2);

                  var key = _ref6[0];
                  var value = _ref6[1];

                  var ctx = value.context.split('.')[0]; // user.id -> user
                  if (context[ctx] === undefined) throw new Error(key + ' is required');
                  args[key] = (0, _utils.pickoutValue)(context, value.context);
                });

                instance = new Model((0, _utils.toMongooseArgs)(args));
                _context.next = 4;
                return instance.save();

              case 4:
                return _context.abrupt('return', _context.sent);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function resolve(_x, _x2, _x3) {
        return _ref4.apply(this, arguments);
      };
    }()
  };
};

/**
 * Build mutation for single model
 * @params
 *  - model a mongoose model
 *  - type a corresponding converted graphql type
 * @return
 *  - {Object} e.g. { createUser: {type: userType, args, resolve}, updateUser, removeUser }
 */


var buildUpdate = function buildUpdate(Model, type, defaultArgs) {
  return {
    type: type,
    args: (0, _utils.filterArgs)(defaultArgs, { plural: true, required: true, idRequired: true }),
    resolve: function () {
      var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_, args) {
        var updateData;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                updateData = (0, _entries2.default)(args).filter(function (_ref8) {
                  var _ref9 = (0, _slicedToArray3.default)(_ref8, 2);

                  var key = _ref9[0];
                  var _ = _ref9[1];

                  if (key === 'id' || key === 'ids') return false;
                  return true;
                }).map(function (_ref10) {
                  var _ref11 = (0, _slicedToArray3.default)(_ref10, 2);

                  var key = _ref11[0];
                  var value = _ref11[1];

                  return [key.replace('_', '.'), value];
                }).reduce(function (args, _ref12) {
                  var _ref13 = (0, _slicedToArray3.default)(_ref12, 2);

                  var key = _ref13[0];
                  var value = _ref13[1];
                  return (0, _assign2.default)(args, (0, _defineProperty3.default)({}, key, value));
                }, {});
                _context2.next = 3;
                return Model.update({ _id: args.id }, { $set: updateData });

              case 3:
                _context2.next = 5;
                return Model.findById(args.id);

              case 5:
                return _context2.abrupt('return', _context2.sent);

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      return function resolve(_x4, _x5) {
        return _ref7.apply(this, arguments);
      };
    }()
  };
};

var buildDelete = function buildDelete(Model, type, defaultArgs) {
  var returnType = new _graphql.GraphQLObjectType({
    name: Model.modelName + 'deleteMutationReturn',
    fields: function fields() {
      return {
        success: { type: _graphql.GraphQLBoolean },
        msg: { type: _graphql.GraphQLString }
      };
    }
  });
  return {
    type: returnType,
    args: (0, _utils.filterArgs)(defaultArgs, { plural: true, idRequired: true, onlyId: true }),
    resolve: function () {
      var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_, args) {
        var res;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                res = { success: true, msg: null };
                _context3.prev = 1;
                _context3.next = 4;
                return Model.findById(args.id).remove();

              case 4:
                _context3.next = 9;
                break;

              case 6:
                _context3.prev = 6;
                _context3.t0 = _context3['catch'](1);

                res = { success: false, msg: _context3.t0.message };

              case 9:
                return _context3.abrupt('return', res);

              case 10:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined, [[1, 6]]);
      }));

      return function resolve(_x6, _x7) {
        return _ref14.apply(this, arguments);
      };
    }()
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWEvYnVpbGRNdXRhdGlvbi5qcyJdLCJuYW1lcyI6WyJtb2RlbCIsInR5cGUiLCJtb2RlbE5hbWUiLCJkZWZhdWx0QXJncyIsImJ1aWxkQ3JlYXRlIiwiYnVpbGRVcGRhdGUiLCJidWlsZERlbGV0ZSIsIk1vZGVsIiwiY3JlYXRlQXJncyIsImlkIiwicGx1cmFsIiwibGF6eVJlcXVpcmVkQ2hlY2siLCJmaWx0ZXIiLCJrZXkiLCJ2YWx1ZSIsInJlcXVpcmVkIiwiY29udGV4dCIsImFyZ3MiLCJyZXNvbHZlIiwicm9vdCIsImZvckVhY2giLCJjdHgiLCJzcGxpdCIsInVuZGVmaW5lZCIsIkVycm9yIiwiaW5zdGFuY2UiLCJzYXZlIiwiaWRSZXF1aXJlZCIsIl8iLCJ1cGRhdGVEYXRhIiwibWFwIiwicmVwbGFjZSIsInJlZHVjZSIsInVwZGF0ZSIsIl9pZCIsIiRzZXQiLCJmaW5kQnlJZCIsInJldHVyblR5cGUiLCJuYW1lIiwiZmllbGRzIiwic3VjY2VzcyIsIm1zZyIsIm9ubHlJZCIsInJlcyIsInJlbW92ZSIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQkFnQmUsVUFBVUEsS0FBVixFQUFpQkMsSUFBakIsRUFBdUI7QUFBQTs7QUFDcEMsTUFBTUMsWUFBWUYsTUFBTUUsU0FBeEI7QUFDQSxNQUFNQyxjQUFjLHlCQUFVRixJQUFWLENBQXBCO0FBQ0EsbUVBQ1lDLFNBRFosRUFDMEJFLFlBQVlKLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCRSxXQUF6QixDQUQxQixrREFFWUQsU0FGWixFQUUwQkcsWUFBWUwsS0FBWixFQUFtQkMsSUFBbkIsRUFBeUJFLFdBQXpCLENBRjFCLGtEQUdZRCxTQUhaLEVBRzBCSSxZQUFZTixLQUFaLEVBQW1CQyxJQUFuQixFQUF5QkUsV0FBekIsQ0FIMUI7QUFLRCxDOztBQXhCRDs7QUFLQTs7OztBQUNBOzs7O0FBb0JBLElBQU1DLGNBQWMsU0FBZEEs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WyJpbXBvcnQge1xuICBHcmFwaFFMT2JqZWN0VHlwZSxcbiAgR3JhcGhRTEJvb2xlYW4sXG4gIEdyYXBoUUxTdHJpbmdcbn0gZnJvbSAnZ3JhcGhxbCdcbmltcG9ydCBidWlsZEFyZ3MgZnJvbSAnLi9idWlsZEFyZ3MnXG5pbXBvcnQgeyBmaWx0ZXJBcmdzLCB0b01vbmdvb3NlQXJncywgcGlja291dFZhbHVlIH0gZnJvbSAnLi4vdXRpbHMnXG5cbi8qKlxuICogQnVpbGQgbXV0YXRpb24gZm9yIHNpbmdsZSBtb2RlbFxuICogQHBhcmFtc1xuICogIC0gbW9kZWwgYSBtb25nb29zZSBtb2RlbFxuICogIC0gdHlwZSBhIGNvcnJlc3BvbmRpbmcgY29udmVydGVkIGdyYXBocWwgdHlwZVxuICogQHJldHVyblxuICogIC0ge09iamVjdH0gZS5nLiB7IGNyZWF0ZVVzZXI6IHt0eXBlOiB1c2VyVHlwZSwgYXJncywgcmVzb2x2ZX0sIHVwZGF0ZVVzZXIsIHJlbW92ZVVzZXIgfVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAobW9kZWwsIHR5cGUpIHtcbiAgY29uc3QgbW9kZWxOYW1lID0gbW9kZWwubW9kZWxOYW1lXG4gIGNvbnN0IGRlZmF1bHRBcmdzID0gYnVpbGRBcmdzKHR5cGUpXG4gIHJldHVybiB7XG4gICAgW2BjcmVhdGUke21vZGVsTmFtZX1gXTogYnVpbGRDcmVhdGUobW9kZWwsIHR5cGUsIGRlZmF1bHRBcmdzKSxcbiAgICBbYHVwZGF0ZSR7bW9kZWxOYW1lfWBdOiBidWlsZFVwZGF0ZShtb2RlbCwgdHlwZSwgZGVmYXVsdEFyZ3MpLFxuICAgIFtgZGVsZXRlJHttb2RlbE5hbWV9YF06IGJ1aWxkRGVsZXRlKG1vZGVsLCB0eXBlLCBkZWZhdWx0QXJncylcbiAgfVxufVxuXG5jb25zdCBidWlsZENyZWF0ZSA9IChNb2RlbCwgdHlwZSwgZGVmYXVsdEFyZ3MpID0+IHtcbiAgY29uc3QgY3JlYXRlQXJncyA9IGZpbHRlckFyZ3MoZGVmYXVsdEFyZ3MsIHsgaWQ6IHRydWUsIHBsdXJhbDogdHJ1ZSB9KVxuICBjb25zdCBsYXp5UmVxdWlyZWRDaGVjayA9IE9iamVjdC5lbnRyaWVzKGNyZWF0ZUFyZ3MpLmZpbHRlcigoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgcmV0dXJuIHZhbHVlLnJlcXVpcmVkICYmIHZhbHVlLmNvbnRleHRcbiAgfSlcbiAgcmV0dXJuIHtcbiAgICB0eXBlLFxuICAgIGFyZ3M6IGNyZWF0ZUFyZ3MsXG4gICAgcmVzb2x2ZTogYXN5bmMgKHJvb3QsIGFyZ3MsIGNvbnRleHQpID0+IHtcbiAgICAgIC8vIENoZWNrIGlmIGFuIGFyZyBpcyByZXF1aXJlZCBhbmQgaGFzIGNvbnRleHRcbiAgICAgIC8vIGJlY2F1c2UgaXQgd29uJ3QgYmUgbWFya2VkIGFzIEdyYXBocWxOb25OdWxsXG4gICAgICBsYXp5UmVxdWlyZWRDaGVjay5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgY29uc3QgY3R4ID0gdmFsdWUuY29udGV4dC5zcGxpdCgnLicpWzBdICAvLyB1c2VyLmlkIC0+IHVzZXJcbiAgICAgICAgaWYgKGNvbnRleHRbY3R4XSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBuZXcgRXJyb3IoYCR7a2V5fSBpcyByZXF1aXJlZGApXG4gICAgICAgIGFyZ3Nba2V5XSA9IHBpY2tvdXRWYWx1ZShjb250ZXh0LCB2YWx1ZS5jb250ZXh0KVxuICAgICAgfSlcblxuICAgICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgTW9kZWwodG9Nb25nb29zZUFyZ3MoYXJncykpXG4gICAgICByZXR1cm4gYXdhaXQgaW5zdGFuY2Uuc2F2ZSgpXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGJ1aWxkVXBkYXRlID0gKE1vZGVsLCB0eXBlLCBkZWZhdWx0QXJncykgPT4ge1xuICByZXR1cm4ge1xuICAgIHR5cGUsXG4gICAgYXJnczogZmlsdGVyQXJncyhkZWZhdWx0QXJncywgeyBwbHVyYWw6IHRydWUsIHJlcXVpcmVkOiB0cnVlLCBpZFJlcXVpcmVkOiB0cnVlIH0pLFxuICAgIHJlc29sdmU6IGFzeW5jIChfLCBhcmdzKSA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVEYXRhID0gT2JqZWN0LmVudHJpZXMoYXJncylcbiAgICAgICAgLmZpbHRlcigoW2tleSwgX10pID0+IHtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnaWQnIHx8IGtleSA9PT0gJ2lkcycpIHJldHVybiBmYWxzZVxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIC5tYXAoKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIHJldHVybiBba2V5LnJlcGxhY2UoJ18nLCAnLicpLCB2YWx1ZV1cbiAgICAgICAgfSlcbiAgICAgICAgLnJlZHVjZSgoYXJncywgW2tleSwgdmFsdWVdKSA9PiAoT2JqZWN0LmFzc2lnbihhcmdzLCB7W2tleV06IHZhbHVlfSkpLCB7fSlcblxuICAgICAgYXdhaXQgTW9kZWwudXBkYXRlKHsgX2lkOiBhcmdzLmlkIH0sIHsgJHNldDogdXBkYXRlRGF0YSB9KVxuICAgICAgcmV0dXJuIGF3YWl0IE1vZGVsLmZpbmRCeUlkKGFyZ3MuaWQpXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGJ1aWxkRGVsZXRlID0gKE1vZGVsLCB0eXBlLCBkZWZhdWx0QXJncykgPT4ge1xuICBjb25zdCByZXR1cm5UeXBlID0gbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcbiAgICBuYW1lOiBgJHtNb2RlbC5tb2RlbE5hbWV9ZGVsZXRlTXV0YXRpb25SZXR1cm5gLFxuICAgIGZpZWxkczogKCkgPT4gKHtcbiAgICAgIHN1Y2Nlc3M6IHsgdHlwZTogR3JhcGhRTEJvb2xlYW4gfSxcbiAgICAgIG1zZzogeyB0eXBlOiBHcmFwaFFMU3RyaW5nIH1cbiAgICB9KVxuICB9KVxuICByZXR1cm4ge1xuICAgIHR5cGU6IHJldHVyblR5cGUsXG4gICAgYXJnczogZmlsdGVyQXJncyhkZWZhdWx0QXJncywgeyBwbHVyYWw6IHRydWUsIGlkUmVxdWlyZWQ6IHRydWUsIG9ubHlJZDogdHJ1ZSB9KSxcbiAgICByZXNvbHZlOiBhc3luYyAoXywgYXJncykgPT4ge1xuICAgICAgbGV0IHJlcyA9IHsgc3VjY2VzczogdHJ1ZSwgbXNnOiBudWxsIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IE1vZGVsLmZpbmRCeUlkKGFyZ3MuaWQpLnJlbW92ZSgpXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmVzID0geyBzdWNjZXNzOiBmYWxzZSwgbXNnOiBlcnIubWVzc2FnZSB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzXG4gICAgfVxuICB9XG59XG4iXX0=