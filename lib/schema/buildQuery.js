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

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.default = function (model, type) {
  const modelName = model.modelName;
  const defaultArgs = (0, _buildArgs2.default)(type);
  return {
    [modelName.toLowerCase()]: {
      type: new _graphql.GraphQLList(type),
      args: defaultArgs,
      resolve: (() => {
        var _ref = (0, _asyncToGenerator3.default)(function* (_, args) {
          if (hasRepeateArgs((0, _keys2.default)(args))) {
            throw new Error('Can not use singular and plural of an argument in same time');
          }
          let onlyPlural;
          const query = (0, _entries2.default)(args).map(function (_ref2) {
            var _ref3 = (0, _slicedToArray3.default)(_ref2, 2);

            let arg = _ref3[0];
            let value = _ref3[1];

            onlyPlural = defaultArgs[arg]['onlyPlural'];
            arg = arg.replace('_', '.');
            arg = arg === 'id' && '_id' || arg === 'ids' && '_ids' || arg;
            if (_pluralize2.default.singular(arg) === arg || onlyPlural) {
              return { [arg]: value };
            } else {
              return { [_pluralize2.default.singular(arg)]: { $in: value } };
            }
          }).reduce(function (query, item) {
            return (0, _assign2.default)(query, item);
          }, {});

          return yield model.find(query);
        });

        return function resolve(_x, _x2) {
          return _ref.apply(this, arguments);
        };
      })()
    }
  };
};

var _graphql = require('graphql');

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _buildArgs = require('./buildArgs');

var _buildArgs2 = _interopRequireDefault(_buildArgs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Valid if both singular and plural of a argument were provided
let elem;

/**
 * Build query for a sigle model
 * @params
 *  - model a mongoose model
 *  - type a corresponding converted graphql type
 * @return
 *  - {Object} e.g. { user: {type: userType, args: {id, ids, userName, userNames...}, resolve} }
 */

const hasRepeateArgs = args => {
  if (args.length === 0) return false;
  elem = args.pop();
  if (args.find(arg => arg === _pluralize2.default.plural(elem) || arg === _pluralize2.default.singular(elem))) return true;
  return hasRepeateArgs(args);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWEvYnVpbGRRdWVyeS5qcyJdLCJuYW1lcyI6WyJtb2RlbCIsInR5cGUiLCJtb2RlbE5hbWUiLCJkZWZhdWx0QXJncyIsInRvTG93ZXJDYXNlIiwiYXJncyIsInJlc29sdmUiLCJfIiwiaGFzUmVwZWF0ZUFyZ3MiLCJFcnJvciIsIm9ubHlQbHVyYWwiLCJxdWVyeSIsIm1hcCIsImFyZyIsInZhbHVlIiwicmVwbGFjZSIsInNpbmd1bGFyIiwiJGluIiwicmVkdWNlIiwiaXRlbSIsImZpbmQiLCJlbGVtIiwibGVuZ3RoIiwicG9wIiwicGx1cmFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQkFZZSxVQUFVQSxLQUFWLEVBQWlCQyxJQUFqQixFQUF1QjtBQUNwQyxRQUFNQyxZQUFZRixNQUFNRSxTQUF4QjtBQUNBLFFBQU1DLGNBQWMseUJBQVVGLElBQVYsQ0FBcEI7QUFDQSxTQUFPO0FBQ0wsS0FBQ0MsVUFBVUUsV0FBVixFQUFELEdBQTJCO0FBQ3pCSCxZQUFNLHlCQUFnQkEsSUFBaEIsQ0FEbUI7QUFFekJJLFlBQU1GLFdBRm1CO0FBR3pCRztBQUFBLG1EQUFTLFdBQU9DLENBQVAsRUFBVUYsSUFBVixFQUFtQjtBQUMxQixjQUFJRyxlQUFlLG9CQUFZSCxJQUFaLENBQWYsQ0FBSixFQUF1QztBQUNyQyxrQkFBTSxJQUFJSSxLQUFKLENBQVUsNkRBQVYsQ0FBTjtBQUNEO0FBQ0QsY0FBSUMsVUFBSjtBQUNBLGdCQUFNQyxRQUFRLHVCQUFlTixJQUFmLEVBQXFCTyxHQUFyQixDQUF5QixpQkFBa0I7QUFBQTs7QUFBQSxnQkFBaEJDLEdBQWdCO0FBQUEsZ0JBQVhDLEtBQVc7O0FBQ3ZESix5QkFBYVAsWUFBWVUsR0FBWixFQUFpQixZQUFqQixDQUFiO0FBQ0FBLGtCQUFNQSxJQUFJRSxPQUFKLENBQVksR0FBWixFQUFpQixHQUFqQixDQUFOO0FBQ0FGLGtCQUFPQSxRQUFRLElBQVIsSUFBZ0IsS0FBakIsSUFBNEJBLFFBQVEsS0FBUixJQUFpQixNQUE3QyxJQUF3REEsR0FBOUQ7QUFDQSxnQkFBSSxvQkFBVUcsUUFBVixDQUFtQkgsR0FBbkIsTUFBNEJBLEdBQTVCLElBQW1DSCxVQUF2QyxFQUFtRDtBQUNqRCxxQkFBTyxFQUFFLENBQUNHLEdBQUQsR0FBT0MsS0FBVCxFQUFQO0FBQ0QsYUFGRCxNQUVPO0FBQ0wscUJBQU8sRUFBRSxDQUFDLG9CQUFVRSxRQUFWLENBQW1CSCxHQUFuQixDQUFELEdBQTJCLEVBQUVJLEtBQUtILEtBQVAsRUFBN0IsRUFBUDtBQUNEO0FBQ0YsV0FUYSxFQVNYSSxNQVRXLENBU0osVUFBQ1AsS0FBRCxFQUFRUSxJQUFSO0FBQUEsbUJBQWtCLHNCQUFjUixLQUFkLEVBQXFCUSxJQUFyQixDQUFsQjtBQUFBLFdBVEksRUFTMkMsRUFUM0MsQ0FBZDs7QUFXQSxpQkFBTyxNQUFNbkIsTUFBTW9CLElBQU4sQ0FBV1QsS0FBWCxDQUFiO0FBQ0QsU0FqQkQ7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFIeUI7QUFEdEIsR0FBUDtBQXdCRCxDOztBQXZDRDs7QUFDQTs7OztBQUNBOzs7Ozs7QUF1Q0E7QUFDQSxJQUFJVSxJQUFKOztBQXRDQTs7Ozs7Ozs7O0FBdUNBLE1BQU1iLGlCQUFrQkgsSUFBRCxJQUFVO0FBQy9CLE1BQUlBLEtBQUtpQixNQUFMLEtBQWdCLENBQXBCLEVBQXVCLE9BQU8sS0FBUDtBQUN2QkQsU0FBT2hCLEtBQUtrQixHQUFMLEVBQVA7QUFDQSxNQUFJbEIsS0FBS2UsSUFBTCxDQUFVUCxPQUFPQSxRQUFRLG9CQUFVVyxNQUFWLENBQWlCSCxJQUFqQixDQUFSLElBQWtDUixRQUFRLG9CQUFVRyxRQUFWLENBQW1CSyxJQUFuQixDQUEzRCxDQUFKLEVBQTBGLE9BQU8sSUFBUDtBQUMxRixTQUFPYixlQUFlSCxJQUFmLENBQVA7QUFDRCxDQUxEIiwiZmlsZSI6ImJ1aWxkUXVlcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHcmFwaFFMTGlzdCB9IGZyb20gJ2dyYXBocWwnXG5pbXBvcnQgcGx1cmFsaXplIGZyb20gJ3BsdXJhbGl6ZSdcbmltcG9ydCBidWlsZEFyZ3MgZnJvbSAnLi9idWlsZEFyZ3MnXG5cbi8qKlxuICogQnVpbGQgcXVlcnkgZm9yIGEgc2lnbGUgbW9kZWxcbiAqIEBwYXJhbXNcbiAqICAtIG1vZGVsIGEgbW9uZ29vc2UgbW9kZWxcbiAqICAtIHR5cGUgYSBjb3JyZXNwb25kaW5nIGNvbnZlcnRlZCBncmFwaHFsIHR5cGVcbiAqIEByZXR1cm5cbiAqICAtIHtPYmplY3R9IGUuZy4geyB1c2VyOiB7dHlwZTogdXNlclR5cGUsIGFyZ3M6IHtpZCwgaWRzLCB1c2VyTmFtZSwgdXNlck5hbWVzLi4ufSwgcmVzb2x2ZX0gfVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAobW9kZWwsIHR5cGUpIHtcbiAgY29uc3QgbW9kZWxOYW1lID0gbW9kZWwubW9kZWxOYW1lXG4gIGNvbnN0IGRlZmF1bHRBcmdzID0gYnVpbGRBcmdzKHR5cGUpXG4gIHJldHVybiB7XG4gICAgW21vZGVsTmFtZS50b0xvd2VyQ2FzZSgpXToge1xuICAgICAgdHlwZTogbmV3IEdyYXBoUUxMaXN0KHR5cGUpLFxuICAgICAgYXJnczogZGVmYXVsdEFyZ3MsXG4gICAgICByZXNvbHZlOiBhc3luYyAoXywgYXJncykgPT4ge1xuICAgICAgICBpZiAoaGFzUmVwZWF0ZUFyZ3MoT2JqZWN0LmtleXMoYXJncykpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW4gbm90IHVzZSBzaW5ndWxhciBhbmQgcGx1cmFsIG9mIGFuIGFyZ3VtZW50IGluIHNhbWUgdGltZScpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IG9ubHlQbHVyYWxcbiAgICAgICAgY29uc3QgcXVlcnkgPSBPYmplY3QuZW50cmllcyhhcmdzKS5tYXAoKFthcmcsIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIG9ubHlQbHVyYWwgPSBkZWZhdWx0QXJnc1thcmddWydvbmx5UGx1cmFsJ11cbiAgICAgICAgICBhcmcgPSBhcmcucmVwbGFjZSgnXycsICcuJylcbiAgICAgICAgICBhcmcgPSAoYXJnID09PSAnaWQnICYmICdfaWQnKSB8fCAoYXJnID09PSAnaWRzJyAmJiAnX2lkcycpIHx8IGFyZ1xuICAgICAgICAgIGlmIChwbHVyYWxpemUuc2luZ3VsYXIoYXJnKSA9PT0gYXJnIHx8IG9ubHlQbHVyYWwpIHtcbiAgICAgICAgICAgIHJldHVybiB7IFthcmddOiB2YWx1ZSB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7IFtwbHVyYWxpemUuc2luZ3VsYXIoYXJnKV06IHsgJGluOiB2YWx1ZSB9IH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pLnJlZHVjZSgocXVlcnksIGl0ZW0pID0+IChPYmplY3QuYXNzaWduKHF1ZXJ5LCBpdGVtKSksIHt9KVxuXG4gICAgICAgIHJldHVybiBhd2FpdCBtb2RlbC5maW5kKHF1ZXJ5KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyBWYWxpZCBpZiBib3RoIHNpbmd1bGFyIGFuZCBwbHVyYWwgb2YgYSBhcmd1bWVudCB3ZXJlIHByb3ZpZGVkXG5sZXQgZWxlbVxuY29uc3QgaGFzUmVwZWF0ZUFyZ3MgPSAoYXJncykgPT4ge1xuICBpZiAoYXJncy5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZVxuICBlbGVtID0gYXJncy5wb3AoKVxuICBpZiAoYXJncy5maW5kKGFyZyA9PiBhcmcgPT09IHBsdXJhbGl6ZS5wbHVyYWwoZWxlbSkgfHwgYXJnID09PSBwbHVyYWxpemUuc2luZ3VsYXIoZWxlbSkpKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gaGFzUmVwZWF0ZUFyZ3MoYXJncylcbn1cbiJdfQ==