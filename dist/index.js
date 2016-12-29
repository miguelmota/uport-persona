'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PublicPersona = exports.Persona = exports.Registry = undefined;

var _persona = require('./persona');

var _registry = require('./registry');

var _registry2 = _interopRequireDefault(_registry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Registry = _registry2.default;
exports.Persona = _persona.Persona;
exports.PublicPersona = _persona.PublicPersona;