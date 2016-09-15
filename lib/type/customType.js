'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GraphQLMixed = exports.GraphQLDate = exports.GraphQLBuffer = undefined;

var _graphql = require('graphql');

/**
 * Buffer type
 */
var coerceBuffer = function coerceBuffer(value) {
  if (value instanceof Buffer) return value;
  throw new TypeError('Type error: ' + value + ' is not instance of Buffer');
};

var GraphQLBuffer = exports.GraphQLBuffer = new _graphql.GraphQLScalarType({
  name: 'Buffer',
  serialize: coerceBuffer, // serialize to query result
  parseValue: coerceBuffer,
  parseLiteral: function parseLiteral(ast) {
    // Read from args
    return typeof ast.value === 'string' && new Buffer(ast.value) || null;
  }
});

/**
 * Date type
 */
var coerceDate = function coerceDate(value) {
  if (value instanceof Date) return value;
  throw new TypeError('Type error: ' + value + ' is not instance of Date');
};

var GraphQLDate = exports.GraphQLDate = new _graphql.GraphQLScalarType({
  name: 'Date',
  serialize: coerceDate,
  parseValue: coerceDate,
  parseLiteral: function parseLiteral(ast) {
    var d = new Date(ast.value);
    return !isNaN(d.getTime()) && d || null;
  }
});

/**
 * Mixed type
 */
var GraphQLMixed = exports.GraphQLMixed = new _graphql.GraphQLScalarType({
  name: 'Mixed',
  serialize: function serialize(value) {
    return value;
  },
  parseValue: function parseValue(value) {
    return value;
  },
  parseLiteral: function parseLiteral(ast) {
    return ast.value;
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90eXBlL2N1c3RvbVR5cGUuanMiXSwibmFtZXMiOlsiY29lcmNlQnVmZmVyIiwidmFsdWUiLCJCdWZmZXIiLCJUeXBlRXJyb3IiLCJHcmFwaFFMQnVmZmVyIiwibmFtZSIsInNlcmlhbGl6ZSIsInBhcnNlVmFsdWUiLCJwYXJzZUxpdGVyYWwiLCJhc3QiLCJjb2VyY2VEYXRlIiwiRGF0ZSIsIkdyYXBoUUxEYXRlIiwiZCIsImlzTmFOIiwiZ2V0VGltZSIsIkdyYXBoUUxNaXhlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBOzs7QUFHQSxJQUFNQSxlQUFlLFNBQWZBLFlBQWUsQ0FBQ0MsS0FBRCxFQUFXO0FBQzlCLE1BQUlBLGlCQUFpQkMsTUFBckIsRUFBNkIsT0FBT0QsS0FBUDtBQUM3QixRQUFNLElBQUlFLFNBQUosa0JBQTZCRixLQUE3QixnQ0FBTjtBQUNELENBSEQ7O0FBS08sSUFBTUcsd0NBQWdCLCtCQUFzQjtBQUNqREMsUUFBTSxRQUQyQztBQUVqREMsYUFBV04sWUFGc0MsRUFFeEI7QUFDekJPLGNBQVlQLFlBSHFDO0FBSWpEUSxnQkFBYywyQkFBTztBQUNuQjtBQUNBLFdBQU8sT0FBT0MsSUFBSVIsS0FBWCxLQUFxQixRQUFyQixJQUFpQyxJQUFJQyxNQUFKLENBQVdPLElBQUlSLEtBQWYsQ0FBakMsSUFBMEQsSUFBakU7QUFDRDtBQVBnRCxDQUF0QixDQUF0Qjs7QUFVUDs7O0FBR0EsSUFBTVMsYUFBYSxTQUFiQSxVQUFhLENBQUNULEtBQUQsRUFBVztBQUM1QixNQUFJQSxpQkFBaUJVLElBQXJCLEVBQTJCLE9BQU9WLEtBQVA7QUFDM0IsUUFBTSxJQUFJRSxTQUFKLGtCQUE2QkYsS0FBN0IsOEJBQU47QUFDRCxDQUhEOztBQUtPLElBQU1XLG9DQUFjLCtCQUFzQjtBQUMvQ1AsUUFBTSxNQUR5QztBQUUvQ0MsYUFBV0ksVUFGb0M7QUFHL0NILGNBQVlHLFVBSG1DO0FBSS9DRixnQkFBYywyQkFBTztBQUNuQixRQUFNSyxJQUFJLElBQUlGLElBQUosQ0FBU0YsSUFBSVIsS0FBYixDQUFWO0FBQ0EsV0FBTyxDQUFDYSxNQUFNRCxFQUFFRSxPQUFGLEVBQU4sQ0FBRCxJQUF1QkYsQ0FBdkIsSUFBNEIsSUFBbkM7QUFDRDtBQVA4QyxDQUF0QixDQUFwQjs7QUFVUDs7O0FBR08sSUFBTUcsc0NBQWUsK0JBQXNCO0FBQ2hEWCxRQUFNLE9BRDBDO0FBRWhEQyxhQUFXO0FBQUEsV0FBU0wsS0FBVDtBQUFBLEdBRnFDO0FBR2hETSxjQUFZO0FBQUEsV0FBU04sS0FBVDtBQUFBLEdBSG9DO0FBSWhETyxnQkFBYztBQUFBLFdBQU9DLElBQUlSLEtBQVg7QUFBQTtBQUprQyxDQUF0QixDQUFyQiIsImZpbGUiOiJjdXN0b21UeXBlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR3JhcGhRTFNjYWxhclR5cGUgfSBmcm9tICdncmFwaHFsJ1xuXG4vKipcbiAqIEJ1ZmZlciB0eXBlXG4gKi9cbmNvbnN0IGNvZXJjZUJ1ZmZlciA9ICh2YWx1ZSkgPT4ge1xuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBCdWZmZXIpIHJldHVybiB2YWx1ZVxuICB0aHJvdyBuZXcgVHlwZUVycm9yKGBUeXBlIGVycm9yOiAke3ZhbHVlfSBpcyBub3QgaW5zdGFuY2Ugb2YgQnVmZmVyYClcbn1cblxuZXhwb3J0IGNvbnN0IEdyYXBoUUxCdWZmZXIgPSBuZXcgR3JhcGhRTFNjYWxhclR5cGUoe1xuICBuYW1lOiAnQnVmZmVyJyxcbiAgc2VyaWFsaXplOiBjb2VyY2VCdWZmZXIsIC8vIHNlcmlhbGl6ZSB0byBxdWVyeSByZXN1bHRcbiAgcGFyc2VWYWx1ZTogY29lcmNlQnVmZmVyLFxuICBwYXJzZUxpdGVyYWw6IGFzdCA9PiB7XG4gICAgLy8gUmVhZCBmcm9tIGFyZ3NcbiAgICByZXR1cm4gdHlwZW9mIGFzdC52YWx1ZSA9PT0gJ3N0cmluZycgJiYgbmV3IEJ1ZmZlcihhc3QudmFsdWUpIHx8IG51bGxcbiAgfVxufSlcblxuLyoqXG4gKiBEYXRlIHR5cGVcbiAqL1xuY29uc3QgY29lcmNlRGF0ZSA9ICh2YWx1ZSkgPT4ge1xuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBEYXRlKSByZXR1cm4gdmFsdWVcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihgVHlwZSBlcnJvcjogJHt2YWx1ZX0gaXMgbm90IGluc3RhbmNlIG9mIERhdGVgKVxufVxuXG5leHBvcnQgY29uc3QgR3JhcGhRTERhdGUgPSBuZXcgR3JhcGhRTFNjYWxhclR5cGUoe1xuICBuYW1lOiAnRGF0ZScsXG4gIHNlcmlhbGl6ZTogY29lcmNlRGF0ZSxcbiAgcGFyc2VWYWx1ZTogY29lcmNlRGF0ZSxcbiAgcGFyc2VMaXRlcmFsOiBhc3QgPT4ge1xuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZShhc3QudmFsdWUpXG4gICAgcmV0dXJuICFpc05hTihkLmdldFRpbWUoKSkgJiYgZCB8fCBudWxsXG4gIH1cbn0pXG5cbi8qKlxuICogTWl4ZWQgdHlwZVxuICovXG5leHBvcnQgY29uc3QgR3JhcGhRTE1peGVkID0gbmV3IEdyYXBoUUxTY2FsYXJUeXBlKHtcbiAgbmFtZTogJ01peGVkJyxcbiAgc2VyaWFsaXplOiB2YWx1ZSA9PiB2YWx1ZSxcbiAgcGFyc2VWYWx1ZTogdmFsdWUgPT4gdmFsdWUsXG4gIHBhcnNlTGl0ZXJhbDogYXN0ID0+IGFzdC52YWx1ZVxufSlcbiJdfQ==