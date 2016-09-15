'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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
  return {
    type: type,
    args: (0, _utils.filterArgs)(defaultArgs, { id: true, plural: true }),
    resolve: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_, args) {
        var instance;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                instance = new Model((0, _utils.toMongooseArgs)(args));
                _context.next = 3;
                return instance.save();

              case 3:
                return _context.abrupt('return', _context.sent);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function resolve(_x, _x2) {
        return _ref2.apply(this, arguments);
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
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_, args) {
        var updateData;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                updateData = (0, _entries2.default)(args).filter(function (_ref4) {
                  var _ref5 = (0, _slicedToArray3.default)(_ref4, 2);

                  var key = _ref5[0];
                  var _ = _ref5[1];

                  if (key === 'id' || key === 'ids') return false;
                  return true;
                }).map(function (_ref6) {
                  var _ref7 = (0, _slicedToArray3.default)(_ref6, 2);

                  var key = _ref7[0];
                  var value = _ref7[1];

                  return [key.replace('_', '.'), value];
                }).reduce(function (args, _ref8) {
                  var _ref9 = (0, _slicedToArray3.default)(_ref8, 2);

                  var key = _ref9[0];
                  var value = _ref9[1];
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

      return function resolve(_x3, _x4) {
        return _ref3.apply(this, arguments);
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
      var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_, args) {
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

      return function resolve(_x5, _x6) {
        return _ref10.apply(this, arguments);
      };
    }()
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWEvYnVpbGRNdXRhdGlvbi5qcyJdLCJuYW1lcyI6WyJtb2RlbCIsInR5cGUiLCJtb2RlbE5hbWUiLCJkZWZhdWx0QXJncyIsImJ1aWxkQ3JlYXRlIiwiYnVpbGRVcGRhdGUiLCJidWlsZERlbGV0ZSIsIk1vZGVsIiwiYXJncyIsImlkIiwicGx1cmFsIiwicmVzb2x2ZSIsIl8iLCJpbnN0YW5jZSIsInNhdmUiLCJyZXF1aXJlZCIsImlkUmVxdWlyZWQiLCJ1cGRhdGVEYXRhIiwiZmlsdGVyIiwia2V5IiwibWFwIiwidmFsdWUiLCJyZXBsYWNlIiwicmVkdWNlIiwidXBkYXRlIiwiX2lkIiwiJHNldCIsImZpbmRCeUlkIiwicmV0dXJuVHlwZSIsIm5hbWUiLCJmaWVsZHMiLCJzdWNjZXNzIiwibXNnIiwib25seUlkIiwicmVzIiwicmVtb3ZlIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQWdCZSxVQUFVQSxLQUFWLEVBQWlCQyxJQUFqQixFQUF1QjtBQUFBOztBQUNwQyxNQUFNQyxZQUFZRixNQUFNRSxTQUF4QjtBQUNBLE1BQU1DLGNBQWMseUJBQVVGLElBQVYsQ0FBcEI7QUFDQSxtRUFDWUMsU0FEWixFQUMwQkUsWUFBWUosS0FBWixFQUFtQkMsSUFBbkIsRUFBeUJFLFdBQXpCLENBRDFCLGtEQUVZRCxTQUZaLEVBRTBCRyxZQUFZTCxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QkUsV0FBekIsQ0FGMUIsa0RBR1lELFNBSFosRUFHMEJJLFlBQVlOLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCRSxXQUF6QixDQUgxQjtBQUtELEM7O0FBeEJEOztBQUtBOzs7O0FBQ0E7Ozs7QUFvQkEsSUFBTUMsY0FBYyxTQUFkQSxXQUFjLENBQUNHLEtBQUQsRUFBUU4sSUFBUixFQUFjRSxXQUFkLEVBQThCO0FBQ2hELFNBQU87QUFDTEYsY0FESztBQUVMTyxVQUFNLHVCQUFXTCxXQUFYLEVBQXdC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TW9CLFFBQU4sQ0FBZW5CLEtBQUtDLEVBQXBCLEVBQXdCMEIsTUFBeEIsRUFIRDs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUtMRCxzQkFBTSxFQUFFSCxTQUFTLEtBQVgsRUFBa0JDLEtBQUssYUFBSUksT0FBM0IsRUFBTjs7QUFMSztBQUFBLGtEQU9BRixHQVBBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQVQ7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFISyxHQUFQO0FBYUQsQ0FyQkQiLCJmaWxlIjoiYnVpbGRNdXRhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEdyYXBoUUxPYmplY3RUeXBlLFxuICBHcmFwaFFMQm9vbGVhbixcbiAgR3JhcGhRTFN0cmluZ1xufSBmcm9tICdncmFwaHFsJ1xuaW1wb3J0IGJ1aWxkQXJncyBmcm9tICcuL2J1aWxkQXJncydcbmltcG9ydCB7IGZpbHRlckFyZ3MsIHRvTW9uZ29vc2VBcmdzIH0gZnJvbSAnLi4vdXRpbHMnXG5cbi8qKlxuICogQnVpbGQgbXV0YXRpb24gZm9yIHNpbmdsZSBtb2RlbFxuICogQHBhcmFtc1xuICogIC0gbW9kZWwgYSBtb25nb29zZSBtb2RlbFxuICogIC0gdHlwZSBhIGNvcnJlc3BvbmRpbmcgY29udmVydGVkIGdyYXBocWwgdHlwZVxuICogQHJldHVyblxuICogIC0ge09iamVjdH0gZS5nLiB7IGNyZWF0ZVVzZXI6IHt0eXBlOiB1c2VyVHlwZSwgYXJncywgcmVzb2x2ZX0sIHVwZGF0ZVVzZXIsIHJlbW92ZVVzZXIgfVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAobW9kZWwsIHR5cGUpIHtcbiAgY29uc3QgbW9kZWxOYW1lID0gbW9kZWwubW9kZWxOYW1lXG4gIGNvbnN0IGRlZmF1bHRBcmdzID0gYnVpbGRBcmdzKHR5cGUpXG4gIHJldHVybiB7XG4gICAgW2BjcmVhdGUke21vZGVsTmFtZX1gXTogYnVpbGRDcmVhdGUobW9kZWwsIHR5cGUsIGRlZmF1bHRBcmdzKSxcbiAgICBbYHVwZGF0ZSR7bW9kZWxOYW1lfWBdOiBidWlsZFVwZGF0ZShtb2RlbCwgdHlwZSwgZGVmYXVsdEFyZ3MpLFxuICAgIFtgZGVsZXRlJHttb2RlbE5hbWV9YF06IGJ1aWxkRGVsZXRlKG1vZGVsLCB0eXBlLCBkZWZhdWx0QXJncylcbiAgfVxufVxuXG5jb25zdCBidWlsZENyZWF0ZSA9IChNb2RlbCwgdHlwZSwgZGVmYXVsdEFyZ3MpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlLFxuICAgIGFyZ3M6IGZpbHRlckFyZ3MoZGVmYXVsdEFyZ3MsIHsgaWQ6IHRydWUsIHBsdXJhbDogdHJ1ZSB9KSxcbiAgICByZXNvbHZlOiBhc3luYyAoXywgYXJncykgPT4ge1xuICAgICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgTW9kZWwodG9Nb25nb29zZUFyZ3MoYXJncykpXG4gICAgICByZXR1cm4gYXdhaXQgaW5zdGFuY2Uuc2F2ZSgpXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGJ1aWxkVXBkYXRlID0gKE1vZGVsLCB0eXBlLCBkZWZhdWx0QXJncykgPT4ge1xuICByZXR1cm4ge1xuICAgIHR5cGUsXG4gICAgYXJnczogZmlsdGVyQXJncyhkZWZhdWx0QXJncywgeyBwbHVyYWw6IHRydWUsIHJlcXVpcmVkOiB0cnVlLCBpZFJlcXVpcmVkOiB0cnVlIH0pLFxuICAgIHJlc29sdmU6IGFzeW5jIChfLCBhcmdzKSA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVEYXRhID0gT2JqZWN0LmVudHJpZXMoYXJncylcbiAgICAgICAgLmZpbHRlcigoW2tleSwgX10pID0+IHtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnaWQnIHx8IGtleSA9PT0gJ2lkcycpIHJldHVybiBmYWxzZVxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIC5tYXAoKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIHJldHVybiBba2V5LnJlcGxhY2UoJ18nLCAnLicpLCB2YWx1ZV1cbiAgICAgICAgfSlcbiAgICAgICAgLnJlZHVjZSgoYXJncywgW2tleSwgdmFsdWVdKSA9PiAoT2JqZWN0LmFzc2lnbihhcmdzLCB7W2tleV06IHZhbHVlfSkpLCB7fSlcbiAgICAgIGF3YWl0IE1vZGVsLnVwZGF0ZSh7IF9pZDogYXJncy5pZCB9LCB7ICRzZXQ6IHVwZGF0ZURhdGEgfSlcbiAgICAgIHJldHVybiBhd2FpdCBNb2RlbC5maW5kQnlJZChhcmdzLmlkKVxuICAgIH1cbiAgfVxufVxuXG5jb25zdCBidWlsZERlbGV0ZSA9IChNb2RlbCwgdHlwZSwgZGVmYXVsdEFyZ3MpID0+IHtcbiAgY29uc3QgcmV0dXJuVHlwZSA9IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XG4gICAgbmFtZTogYCR7TW9kZWwubW9kZWxOYW1lfWRlbGV0ZU11dGF0aW9uUmV0dXJuYCxcbiAgICBmaWVsZHM6ICgpID0+ICh7XG4gICAgICBzdWNjZXNzOiB7IHR5cGU6IEdyYXBoUUxCb29sZWFuIH0sXG4gICAgICBtc2c6IHsgdHlwZTogR3JhcGhRTFN0cmluZyB9XG4gICAgfSlcbiAgfSlcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiByZXR1cm5UeXBlLFxuICAgIGFyZ3M6IGZpbHRlckFyZ3MoZGVmYXVsdEFyZ3MsIHsgcGx1cmFsOiB0cnVlLCBpZFJlcXVpcmVkOiB0cnVlLCBvbmx5SWQ6IHRydWUgfSksXG4gICAgcmVzb2x2ZTogYXN5bmMgKF8sIGFyZ3MpID0+IHtcbiAgICAgIGxldCByZXMgPSB7IHN1Y2Nlc3M6IHRydWUsIG1zZzogbnVsbCB9XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBNb2RlbC5maW5kQnlJZChhcmdzLmlkKS5yZW1vdmUoKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJlcyA9IHsgc3VjY2VzczogZmFsc2UsIG1zZzogZXJyLm1lc3NhZ2UgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc1xuICAgIH1cbiAgfVxufVxuIl19