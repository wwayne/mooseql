'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

exports.default = function (model, type) {
  const modelName = model.modelName;
  const defaultArgs = (0, _buildArgs2.default)(type);
  return {
    [`create${ modelName }`]: buildCreate(model, type, defaultArgs),
    [`update${ modelName }`]: buildUpdate(model, type, defaultArgs),
    [`delete${ modelName }`]: buildDelete(model, type, defaultArgs)
  };
};

var _graphql = require('graphql');

var _buildArgs = require('./buildArgs');

var _buildArgs2 = _interopRequireDefault(_buildArgs);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const buildCreate = (Model, type, defaultArgs) => {
  const createArgs = (0, _utils.filterArgs)(defaultArgs, { id: true, plural: true });
  const contextArgs = (0, _entries2.default)(createArgs).filter(_ref => {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

    let key = _ref2[0];
    let value = _ref2[1];

    return value.context;
  });
  return {
    type: type,
    args: createArgs,
    resolve: (() => {
      var _ref3 = (0, _asyncToGenerator3.default)(function* (root, args, context) {
        // Set up args that marked as context
        contextArgs.forEach(function (_ref4) {
          var _ref5 = (0, _slicedToArray3.default)(_ref4, 2);

          let key = _ref5[0];
          let value = _ref5[1];

          if (value.required) {
            // Check if an arg is required and has context
            // because it won't be marked as GraphqlNonNull in args
            const ctx = value.context.split('.')[0]; // user.id -> user
            if (context[ctx] === undefined) throw new Error(`${ key } is required`);
          }
          args[key] = (0, _utils.pickoutValue)(context, value.context);
        });
        const instance = new Model((0, _utils.toMongooseArgs)(args));
        return yield instance.save();
      });

      return function resolve(_x, _x2, _x3) {
        return _ref3.apply(this, arguments);
      };
    })()
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


const buildUpdate = (Model, type, defaultArgs) => {
  return {
    type: type,
    args: (0, _utils.filterArgs)(defaultArgs, { plural: true, required: true, idRequired: true }),
    resolve: (() => {
      var _ref6 = (0, _asyncToGenerator3.default)(function* (_, args) {
        const updateData = (0, _entries2.default)(args).filter(function (_ref7) {
          var _ref8 = (0, _slicedToArray3.default)(_ref7, 2);

          let key = _ref8[0];
          let _ = _ref8[1];

          if (key === 'id' || key === 'ids') return false;
          return true;
        }).map(function (_ref9) {
          var _ref10 = (0, _slicedToArray3.default)(_ref9, 2);

          let key = _ref10[0];
          let value = _ref10[1];

          return [key.replace('_', '.'), value];
        }).reduce(function (args, _ref11) {
          var _ref12 = (0, _slicedToArray3.default)(_ref11, 2);

          let key = _ref12[0];
          let value = _ref12[1];
          return (0, _assign2.default)(args, { [key]: value });
        }, {});

        yield Model.update({ _id: args.id }, { $set: updateData });
        return yield Model.findById(args.id);
      });

      return function resolve(_x4, _x5) {
        return _ref6.apply(this, arguments);
      };
    })()
  };
};

const buildDelete = (Model, type, defaultArgs) => {
  const returnType = new _graphql.GraphQLObjectType({
    name: `${ Model.modelName }deleteMutationReturn`,
    fields: () => ({
      success: { type: _graphql.GraphQLBoolean },
      msg: { type: _graphql.GraphQLString }
    })
  });
  return {
    type: returnType,
    args: (0, _utils.filterArgs)(defaultArgs, { plural: true, idRequired: true, onlyId: true }),
    resolve: (() => {
      var _ref13 = (0, _asyncToGenerator3.default)(function* (_, args) {
        let res = { success: true, msg: null };
        try {
          yield Model.findById(args.id).remove();
        } catch (err) {
          res = { success: false, msg: err.message };
        }
        return res;
      });

      return function resolve(_x6, _x7) {
        return _ref13.apply(this, arguments);
      };
    })()
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWEvYnVpbGRNdXRhdGlvbi5qcyJdLCJuYW1lcyI6WyJtb2RlbCIsInR5cGUiLCJtb2RlbE5hbWUiLCJkZWZhdWx0QXJncyIsImJ1aWxkQ3JlYXRlIiwiYnVpbGRVcGRhdGUiLCJidWlsZERlbGV0ZSIsIk1vZGVsIiwiY3JlYXRlQXJncyIsImlkIiwicGx1cmFsIiwiY29udGV4dEFyZ3MiLCJmaWx0ZXIiLCJrZXkiLCJ2YWx1ZSIsImNvbnRleHQiLCJhcmdzIiwicmVzb2x2ZSIsInJvb3QiLCJmb3JFYWNoIiwicmVxdWlyZWQiLCJjdHgiLCJzcGxpdCIsInVuZGVmaW5lZCIsIkVycm9yIiwiaW5zdGFuY2UiLCJzYXZlIiwiaWRSZXF1aXJlZCIsIl8iLCJ1cGRhdGVEYXRhIiwibWFwIiwicmVwbGFjZSIsInJlZHVjZSIsInVwZGF0ZSIsIl9pZCIsIiRzZXQiLCJmaW5kQnlJZCIsInJldHVyblR5cGUiLCJuYW1lIiwiZmllbGRzIiwic3VjY2VzcyIsIm1zZyIsIm9ubHlJZCIsInJlcyIsInJlbW92ZSIsImVyciIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBZ0JlLFVBQVVBLEtBQVYsRUFBaUJDLElBQWpCLEVBQXVCO0FBQ3BDLFFBQU1DLFlBQVlGLE1BQU1FLFNBQXhCO0FBQ0EsUUFBTUMsY0FBYyx5QkFBVUYsSUFBVixDQUFwQjtBQUNBLFNBQU87QUFDTCxLQUFFLFVBQVFDLFNBQVUsR0FBcEIsR0FBd0JFLFlBQVlKLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCRSxXQUF6QixDQURuQjtBQUVMLEtBQUUsVUFBUUQsU0FBVSxHQUFwQixHQUF3QkcsWUFBWUwsS0FBWixFQUFtQkMsSUFBbkIsRUFBeUJFLFdBQXpCLENBRm5CO0FBR0wsS0FBRSxVQUFRRCxTQUFVLEdBQXBCLEdBQXdCSSxZQUFZTixLQUFaLEVBQW1CQyxJQUFuQixFQUF5QkUsV0FBekI7QUFIbkIsR0FBUDtBQUtELEM7O0FBeEJE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QUFrQkQsQ0FuQkQ7O0FBcUJBLE1BQU1ILGNBQWMsQ0FBQ0MsS0FBRCxFQUFRTixJQUFSLEVBQWNFLFdBQWQsS0FBOEI7QUFDaEQsUUFBTWtDLGFBQWEsK0JBQXNCO0FBQ3ZDQyxVQUFPLElBQUUvQixNQUFNTCxTQUFVLHVCQURjO0FBRXZDcUMsWUFBUSxPQUFPO0FBQ2JDLGVBQVMsRUFBRXZDLDZCQUFGLEVBREk7QUFFYndDLFdBQUssRUFBRXhDLDRCQUFGO0FBRlEsS0FBUDtBQUYrQixHQUF0QixDQUFuQjtBQU9BLFNBQU87QUFDTEEsVUFBTW9DLFVBREQ7QUFFTHJCLFVBQU0sdUJBQVdiLFdBQVgsRUFBd0IsRUFBRU8sUUFBUSxJQUFWLEVBQWdCaUIsWUFBWSxJQUE1QixFQUFrQ2UsUUFBUSxJQUExQyxFQUF4QixDQUZEO0FBR0x6QjtBQUFBLG1EQUFTLFdBQU9XLENBQVAsRUFBVVosSUFBVixFQUFtQjtBQUMxQixZQUFJMkIsTUFBTSxFQUFFSCxTQUFTLElBQVgsRUFBaUJDLEtBQUssSUFBdEIsRUFBVjtBQUNBLFlBQUk7QUFDRixnQkFBTWxDLE1BQU02QixRQUFOLENBQWVwQixLQUFLUCxFQUFwQixFQUF3Qm1DLE1BQXhCLEVBQU47QUFDRCxTQUZELENBRUUsT0FBT0MsR0FBUCxFQUFZO0FBQ1pGLGdCQUFNLEVBQUVILFNBQVMsS0FBWCxFQUFrQkMsS0FBS0ksSUFBSUMsT0FBM0IsRUFBTjtBQUNEO0FBQ0QsZUFBT0gsR0FBUDtBQUNELE9BUkQ7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFISyxHQUFQO0FBYUQsQ0FyQkQiLCJmaWxlIjoiYnVpbGRNdXRhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEdyYXBoUUxPYmplY3RUeXBlLFxuICBHcmFwaFFMQm9vbGVhbixcbiAgR3JhcGhRTFN0cmluZ1xufSBmcm9tICdncmFwaHFsJ1xuaW1wb3J0IGJ1aWxkQXJncyBmcm9tICcuL2J1aWxkQXJncydcbmltcG9ydCB7IGZpbHRlckFyZ3MsIHRvTW9uZ29vc2VBcmdzLCBwaWNrb3V0VmFsdWUgfSBmcm9tICcuLi91dGlscydcblxuLyoqXG4gKiBCdWlsZCBtdXRhdGlvbiBmb3Igc2luZ2xlIG1vZGVsXG4gKiBAcGFyYW1zXG4gKiAgLSBtb2RlbCBhIG1vbmdvb3NlIG1vZGVsXG4gKiAgLSB0eXBlIGEgY29ycmVzcG9uZGluZyBjb252ZXJ0ZWQgZ3JhcGhxbCB0eXBlXG4gKiBAcmV0dXJuXG4gKiAgLSB7T2JqZWN0fSBlLmcuIHsgY3JlYXRlVXNlcjoge3R5cGU6IHVzZXJUeXBlLCBhcmdzLCByZXNvbHZlfSwgdXBkYXRlVXNlciwgcmVtb3ZlVXNlciB9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChtb2RlbCwgdHlwZSkge1xuICBjb25zdCBtb2RlbE5hbWUgPSBtb2RlbC5tb2RlbE5hbWVcbiAgY29uc3QgZGVmYXVsdEFyZ3MgPSBidWlsZEFyZ3ModHlwZSlcbiAgcmV0dXJuIHtcbiAgICBbYGNyZWF0ZSR7bW9kZWxOYW1lfWBdOiBidWlsZENyZWF0ZShtb2RlbCwgdHlwZSwgZGVmYXVsdEFyZ3MpLFxuICAgIFtgdXBkYXRlJHttb2RlbE5hbWV9YF06IGJ1aWxkVXBkYXRlKG1vZGVsLCB0eXBlLCBkZWZhdWx0QXJncyksXG4gICAgW2BkZWxldGUke21vZGVsTmFtZX1gXTogYnVpbGREZWxldGUobW9kZWwsIHR5cGUsIGRlZmF1bHRBcmdzKVxuICB9XG59XG5cbmNvbnN0IGJ1aWxkQ3JlYXRlID0gKE1vZGVsLCB0eXBlLCBkZWZhdWx0QXJncykgPT4ge1xuICBjb25zdCBjcmVhdGVBcmdzID0gZmlsdGVyQXJncyhkZWZhdWx0QXJncywgeyBpZDogdHJ1ZSwgcGx1cmFsOiB0cnVlIH0pXG4gIGNvbnN0IGNvbnRleHRBcmdzID0gT2JqZWN0LmVudHJpZXMoY3JlYXRlQXJncykuZmlsdGVyKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICByZXR1cm4gdmFsdWUuY29udGV4dFxuICB9KVxuICByZXR1cm4ge1xuICAgIHR5cGUsXG4gICAgYXJnczogY3JlYXRlQXJncyxcbiAgICByZXNvbHZlOiBhc3luYyAocm9vdCwgYXJncywgY29udGV4dCkgPT4ge1xuICAgICAgLy8gU2V0IHVwIGFyZ3MgdGhhdCBtYXJrZWQgYXMgY29udGV4dFxuICAgICAgY29udGV4dEFyZ3MuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZS5yZXF1aXJlZCkge1xuICAgICAgICAgIC8vIENoZWNrIGlmIGFuIGFyZyBpcyByZXF1aXJlZCBhbmQgaGFzIGNvbnRleHRcbiAgICAgICAgICAvLyBiZWNhdXNlIGl0IHdvbid0IGJlIG1hcmtlZCBhcyBHcmFwaHFsTm9uTnVsbCBpbiBhcmdzXG4gICAgICAgICAgY29uc3QgY3R4ID0gdmFsdWUuY29udGV4dC5zcGxpdCgnLicpWzBdICAvLyB1c2VyLmlkIC0+IHVzZXJcbiAgICAgICAgICBpZiAoY29udGV4dFtjdHhdID09PSB1bmRlZmluZWQpIHRocm93IG5ldyBFcnJvcihgJHtrZXl9IGlzIHJlcXVpcmVkYClcbiAgICAgICAgfVxuICAgICAgICBhcmdzW2tleV0gPSBwaWNrb3V0VmFsdWUoY29udGV4dCwgdmFsdWUuY29udGV4dClcbiAgICAgIH0pXG4gICAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyBNb2RlbCh0b01vbmdvb3NlQXJncyhhcmdzKSlcbiAgICAgIHJldHVybiBhd2FpdCBpbnN0YW5jZS5zYXZlKClcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgYnVpbGRVcGRhdGUgPSAoTW9kZWwsIHR5cGUsIGRlZmF1bHRBcmdzKSA9PiB7XG4gIHJldHVybiB7XG4gICAgdHlwZSxcbiAgICBhcmdzOiBmaWx0ZXJBcmdzKGRlZmF1bHRBcmdzLCB7IHBsdXJhbDogdHJ1ZSwgcmVxdWlyZWQ6IHRydWUsIGlkUmVxdWlyZWQ6IHRydWUgfSksXG4gICAgcmVzb2x2ZTogYXN5bmMgKF8sIGFyZ3MpID0+IHtcbiAgICAgIGNvbnN0IHVwZGF0ZURhdGEgPSBPYmplY3QuZW50cmllcyhhcmdzKVxuICAgICAgICAuZmlsdGVyKChba2V5LCBfXSkgPT4ge1xuICAgICAgICAgIGlmIChrZXkgPT09ICdpZCcgfHwga2V5ID09PSAnaWRzJykgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgLm1hcCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIFtrZXkucmVwbGFjZSgnXycsICcuJyksIHZhbHVlXVxuICAgICAgICB9KVxuICAgICAgICAucmVkdWNlKChhcmdzLCBba2V5LCB2YWx1ZV0pID0+IChPYmplY3QuYXNzaWduKGFyZ3MsIHtba2V5XTogdmFsdWV9KSksIHt9KVxuXG4gICAgICBhd2FpdCBNb2RlbC51cGRhdGUoeyBfaWQ6IGFyZ3MuaWQgfSwgeyAkc2V0OiB1cGRhdGVEYXRhIH0pXG4gICAgICByZXR1cm4gYXdhaXQgTW9kZWwuZmluZEJ5SWQoYXJncy5pZClcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgYnVpbGREZWxldGUgPSAoTW9kZWwsIHR5cGUsIGRlZmF1bHRBcmdzKSA9PiB7XG4gIGNvbnN0IHJldHVyblR5cGUgPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xuICAgIG5hbWU6IGAke01vZGVsLm1vZGVsTmFtZX1kZWxldGVNdXRhdGlvblJldHVybmAsXG4gICAgZmllbGRzOiAoKSA9PiAoe1xuICAgICAgc3VjY2VzczogeyB0eXBlOiBHcmFwaFFMQm9vbGVhbiB9LFxuICAgICAgbXNnOiB7IHR5cGU6IEdyYXBoUUxTdHJpbmcgfVxuICAgIH0pXG4gIH0pXG4gIHJldHVybiB7XG4gICAgdHlwZTogcmV0dXJuVHlwZSxcbiAgICBhcmdzOiBmaWx0ZXJBcmdzKGRlZmF1bHRBcmdzLCB7IHBsdXJhbDogdHJ1ZSwgaWRSZXF1aXJlZDogdHJ1ZSwgb25seUlkOiB0cnVlIH0pLFxuICAgIHJlc29sdmU6IGFzeW5jIChfLCBhcmdzKSA9PiB7XG4gICAgICBsZXQgcmVzID0geyBzdWNjZXNzOiB0cnVlLCBtc2c6IG51bGwgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgTW9kZWwuZmluZEJ5SWQoYXJncy5pZCkucmVtb3ZlKClcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXMgPSB7IHN1Y2Nlc3M6IGZhbHNlLCBtc2c6IGVyci5tZXNzYWdlIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNcbiAgICB9XG4gIH1cbn1cbiJdfQ==