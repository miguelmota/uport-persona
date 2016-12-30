'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uportRegistry = require('uport-registry');

var _uportRegistry2 = _interopRequireDefault(_uportRegistry);

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _persona = require('./persona');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ropsten registry address, default for now
var DEFAULT_REGISTRY_ADDRESS = '0xb9C1598e24650437a3055F7f66AC1820c419a679';

// TODO return schema.org specific key values with prefix @ ? or filter them?

// TODO wording: uportID or address
// TODO profile or persona? wording for the represenation of identity/profile in here
// TODO not sure if or how address (for a profile) should be passed around or if it should even, maybe optional
// TODO decide what functionality to expose, and reflect that in the documents
// TODO don't add type value for attestations
// TODO when creating two indexed profiles don't do twice the work, for example don't parse tokens twice.

// const personaNetwork = new Persona.Network(ipfs, web3Provider, registryAddress)
// const personaProfile =  personaNetwork.getProfile(address)  //promise, can return raw data or personaProfile object

/** Class representing a uPort Registry. */

var Registry = function () {

  /**
  *  Class constructor.
  *  Creates a new Registry object. The registryAddress is an optional argument and if not specified will be at the moment set to the default ropsten network uport-registry.
  *
  *  @memberof        Registry#
  *  @method          constructor
  *  @param           {Object}         settings.ipfs      Optional custom ipfs provider (defaults to infura)
  *  @param           {Web3Provider}   settings.web3prov  Optional web3 provider object (defaults to infura ropsten node)
  *  @param           {String}         settings.registryAddress Optional ethereum address of a uport contract
  *  @return          {Object}         self
  */
  function Registry() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Registry);

    if (!settings.web3prov) {
      settings.web3prov = new _web2.default.providers.HttpProvider('https://ropsten.infura.io/uport-persona-lib');
    }
    this.uportRegistry = new _uportRegistry2.default(settings);
  }

  /**
   *  Gets the public profile JSON object stored in IPFS for the given address.
   *
   *  @memberof Registry#
   *  @method           getPublicProfile
   *  @return           {Promise<JSON, Error>}            A promise that returns the JSON object stored in IPFS for the given address
   */


  _createClass(Registry, [{
    key: 'getPublicProfile',
    value: function getPublicProfile(address) {
      return this.uportRegistry.getAttributes(address);
    }

    /**
     *  Gets the the data stored in IPFS for the given object and creates a PublicPersona object.
     *
     *  @memberof Registry#
     *  @method           getPersona
     *  @return           {Promise<PublicPersona, Error>}            A promise that returns a new PublicPersona object.
     */

  }, {
    key: 'getPersona',
    value: function getPersona(address) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.getPublicProfile(address).then(function (profile) {
          return resolve(new _persona.PublicPersona(profile, address));
        });
      });
    }

    /**
     *  Gets the data stored in IPFS for an array of given addresses and creates an array of PublicPersona objects.
     *
     *  @memberof Registry#
     *  @method           getPersonas
     *  @return           {Promise<PublicPersona, Error>}            A promise that returns an array of new PublicPersona objects.
     */

  }, {
    key: 'getPersonas',
    value: function getPersonas(addresses) {
      var self = this;
      return Promise.all(addresses.map(function (address) {
        return self.getPersona(address);
      }));
    }
  }]);

  return Registry;
}();

exports.default = Registry;