'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uportRegistry = require('uport-registry');

var _uportRegistry2 = _interopRequireDefault(_uportRegistry);

var _jsontokens = require('jsontokens');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// consensysnet registry address, default for now
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
   *  @memberof Registry#
   *  @method          constructor
   *  @param           {String}         ipfsProvider                                                        an ipfs provider
   *  @param           {String}         web3Provider                                                        web3 provider
   *  @param           {String}         [registryAddress='0xa9be82e93628abaac5ab557a9b3b02f711c0151c']      the uport-registry address to use.
   *  @return          {Object}         self
   */
  function Registry(ipfs, web3Provider, registryAddress) {
    _classCallCheck(this, Registry);

    this.uportRegistry = _uportRegistry2.default;

    if (ipfs && web3Provider) {
      this.uportRegistry.setIpfsProvider(ipfs);
      this.uportRegistry.setWeb3Provider(web3Provider);
    }

    this.registryAddress = registryAddress || DEFAULT_REGISTRY_ADDRESS;
  }

  /**
   *  Gets the public profile JSON object stored in IPFS for the given address.
   *
   *  @memberof Registry#
   *  @method           getData
   *  @return           {Promise<JSON>, Error>}            A promise that returns the JSON object stored in IPFS for the given address
   */


  _createClass(Registry, [{
    key: 'getData',
    value: function getData(address) {
      return this.uportRegistry.getAttributes(this.registryAddress, address);
    }

    /**
     *  Gets the the data stored in IPFS for the given object and creates a PublicPersona object.
     *
     *  @memberof Registry#
     *  @method           getProfile
     *  @return           {Promise<PublicPersona>, Error>}            A promise that returns a new PublicPersona object.
     */

  }, {
    key: 'getProfile',
    value: function getProfile(address) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.getData(address).then(function (profile) {
          return resolve(new PublicPersona(profile, address));
        });
      });
    }

    /**
     *  Gets the data stored in IPFS for an array of given addresses and creates an array of PublicPersona objects.
     *
     *  @memberof Registry#
     *  @method           getProfile
     *  @return           {Promise<Array[PublicPersona]>, Error>}            A promise that returns an array of new PublicPersona objects.
     */

  }, {
    key: 'getProfiles',
    value: function getProfiles(addresses) {
      return Promise.all(addresses.map(function (address) {
        return getProfile(address);
      }));
    }
  }]);

  return Registry;
}();

// May reduce this code with an abstract class

/** Class representing a (issuer, value) mapping. */
// TODO return object by im.map or by wrapper ex. im.object
// Sub map of TSProfile, TODO explain where this is used, this won't necessarily be a public class.


var IssuerMap = function () {

  /**
   *  Class constructor.
   *  Creates and IssuerMap object. Initilizes the mapping and consumes and optional address with allow for additional ways to traverse the mapping.
   *
   *  @memberof IssuerMap#
   *  @method          constructor
   *  @param           {String}         address        TODO:OPTIONAL                                                  the address (UportIdentity) for which these claims represented as (issuer, value) are for.
   *  @return          {Object}         self
   */
  function IssuerMap(address) {
    _classCallCheck(this, IssuerMap);

    this.map = {};
    // TODO will this address be optional
    this.address = address;
  }

  //  In the future we may want this be able to also consume and another Profile/persona object which represents the issuer.
  /**
   *  Returns an array of values for the given issuer
   *
   *  @memberof IssuerMap#
   *  @method          issuer
   *  @param           {String}                      issuer                          The address of the issuer
   *  @return          {Array[Object/String]}                                        An array of Strings and/or Objects
   */


  _createClass(IssuerMap, [{
    key: 'issuer',
    value: function issuer(_issuer) {
      return this.map[_issuer];
    }

    /**
     *  Adds a (issuer, value) to the mapping
     *
     *  @memberof IssuerMap#
     *  @method          add
     *  @param           {String}                       issuer                          The address of the issuer
     *  @param           {String/Object}                val                          The value of claim, may be an object or string
     *  @return          {Array[Object/String]}                                         An array of Strings and/or Objects
     */

  }, {
    key: 'add',
    value: function add(issuer, val) {
      if (this.map[issuer]) {
        this.map[issuer].push(val);
      } else {
        this.map[issuer] = [val];
      }
    }

    // Return flat array of {type: type, value: value} objects
    // TODO or call this flatten
    /**
     *  A getter which creates and returns a flattened iterable of the (key, values) as [{issuer:'issuer', value: 'value'}, ....]
     *
     *  @memberof IssuerMap#
     *  @method          all
     *  @return          {Array[Object]}                                         An array of objects [{issuer:'issuer', value: 'value'}, ....]
     */

  }, {
    key: 'all',
    get: function get() {
      var _this2 = this;

      return Object.keys(this.map).map(function (key) {
        return _this2.map[key].map(function (val) {
          return { issuer: key, value: val };
        });
      }).reduce(function (acc, val) {
        return acc.concat(val);
      });
    }

    /**
     *  Returns values created/issued by the profile identity itself
     *
     *  @memberof IssuerMap#
     *  @method          all
     *  @return          {Array[Object]}                                         An array of objects [{key:'key', value: 'value'}, ....]
     */
    //  TODO if address optional, must have error here

  }, {
    key: 'self',
    get: function get() {
      return this.map[this.address];
    }

    /**
     *  Returns array of issuers for iterating
     *
     *  @memberof IssuerMap#
     *  @method          issuers
     *  @return          {Array[String]}                                         An array of Issuers<String>
     */

  }, {
    key: 'issuers',
    get: function get() {
      return Object.keys(this.map);
    }
  }]);

  return IssuerMap;
}();

// Sub map of ISProfile
/** Class representing a (type, value) mapping. */


var TypeMap = function () {
  /**
   *  Class constructor.
   *  Creates and TypeMap object. Initilizes the mapping.
   *
   *  @memberof TypeMap#
   *  @method          constructor
   *  @return          {Object}         self
   */
  function TypeMap() {
    _classCallCheck(this, TypeMap);

    this.map = {};
  }

  /**
   *  Returns an array of values for the given type
   *
   *  @memberof TypeMap#
   *  @method          type
   *  @param           {String}                      type                          The type string
   *  @return          {Array[Object/String]}                                        An array of Strings and/or Objects
   */


  _createClass(TypeMap, [{
    key: 'type',
    value: function type(_type) {
      return this.map[_type];
    }

    /**
     *  Adds a (issuer, value) to the mapping
     *
     *  @memberof TypeMap#
     *  @method          add
     *  @param           {String}                       type                      A claim type as a string.
     *  @param           {String/Object}                val                       The value of claim, may be an object or string
     *  @return          {Array[Object/String]}                                   An array of Strings and/or Objects
     */

  }, {
    key: 'add',
    value: function add(type, val) {
      if (this.map[type]) {
        this.map[type].push(val);
      } else {
        this.map[type] = [val];
      }
    }

    // Return flat array of {type: type, value: value} objects
    // TODO or call this flatten
    // TODO or iterable
    /**
     *  A getter which creates and returns a flattened iterable of the (key, values) as [{type:'type', value: 'value'}, ....]
     *
     *  @memberof IssuerMap#
     *  @method          all
     *  @return          {Array[Object]}                                         An array of objects [{type:'type', value: 'value'}, ....]
     */

  }, {
    key: 'all',
    get: function get() {
      var _this3 = this;

      return Object.keys(this.map).map(function (key) {
        return _this3.map[key].map(function (val) {
          return { type: key, value: val };
        });
      }).reduce(function (acc, val) {
        return acc.concat(val);
      });
    }

    /**
     *  Returns array of types for iterating
     *
     *  @memberof IssuerMap#
     *  @method          types
     *  @return          {Array[String]}                                         An array of types<String>
     */

  }, {
    key: 'types',
    get: function get() {
      return Object.keys(this.map);
    }
  }]);

  return TypeMap;
}();

// Could these two object be generalized.
//  ISProfile => Issuer sorted profile
// {type: {issuer: [vals, vals], issuer: [vals, vals] ... }, type: ....}
//  TSProfile => Type sorted profile
// {issuer: {type: [vals, vals], type: [vals, vals] ... }, issuer: ....}


/** Class representing a Issuer Indexed/Sorted profile. Sub objects are TypeMap objects */


var ISProfile = function () {

  /**
   *  Class constructor.
   *  Creates ISProfile
   *
   *  @memberof ISProfile#
   *  @method          constructor
   *  @return          {Object}         self
   */
  function ISProfile() {
    _classCallCheck(this, ISProfile);
  }

  /**
   *  Adds a (issuer, value) to the mapping
   *
   *  @memberof ISProfile#
   *  @method          add
   *  @param           {String}                       issuer                    A claim issuer
   *  @param           {String/Object}                type                      A claim type
   *  @param           {String/Object}                val                       A claim value
   *  @return          {<None>}
   */


  _createClass(ISProfile, [{
    key: 'add',
    value: function add(issuer, type, value) {
      if (this[issuer]) {
        this[issuer].add(type, value);
      } else {
        this[issuer] = new TypeMap();
        this[issuer].add(type, value);
      }
    }
  }]);

  return ISProfile;
}();

/** Class representing a Type Indexed/Sorted profile. Sub objects are IssuerMap objects */


var TSProfile = function () {
  /**
   *  Class constructor.
   *  Creates TSProfile
   *
   *  @memberof TSProfile#
   *  @method          constructor
   *  @param           {String}                       address                      Address of this profile
   *  @return          {Object}         self
   */
  function TSProfile(address) {
    _classCallCheck(this, TSProfile);

    // TODO is adress optional ?
    this.address = address;
  }

  /**
   *  Adds a (issuer, value) to the mapping
   *
   *  @memberof TSProfile#
   *  @method          add
   *  @param           {String}                       issuer                    A claim issuer
   *  @param           {String/Object}                type                      A claim type
   *  @param           {String/Object}                val                       A claim value
   *  @return          {<None>}
   */


  _createClass(TSProfile, [{
    key: 'add',
    value: function add(issuer, type, value) {
      if (this[type]) {
        this[type].add(type, value);
      } else {
        this[type] = new IssuerMap(this.address);
        this[type].add(issuer, value);
      }
    }
  }]);

  return TSProfile;
}();

// Can easily create class extend PersonInterface to interact with public profile, on-chain claims, off-chain claims or any formats in the in the future,
// and can allow any combination of them, multiple inputs or by consuming other objects

// Once you have a profile object they can be accesses in the following ways
// const zachPublicProfile = new PublicPersona(publicJSONData, adddress)
// const zachProfile = new Persona([claim, claim, ...], zachPublicProfile)  or   new Persona([claim, claim, ...], new PublicPersona(publicJSONData, adddress))
// zachProfile.issuer(....) -> returns all claims by issuer  [{type: type, value: value} .........]
// zachProfile.issuer(....).type("name")  -> returns all claims by issuer and given type [value, value, ...]
// zachProfile.issuer(....).map -> returns js object type value mappings
// zachProfile.type("name").iter -> returns all claims by given type [{issuer: issuer, value: value} .........]
// zachProfile.type("name").issuer(....) -> returns all claims by given type and issuer [value, value, ...]
// zachProfile.type("name").map -> returns js object issuer value mappings
// zachProfile.self.type(....) or zachProfile.type(....).self -> returns all values of given type issued by profile itself or in its public profile.
// zachProfile.self -> all (type, values)  issued by profile itself or in its public profile (just public if PublicPersona object)
// zachProfile.issuers -> all address which have given claims
// zachProfile.type("name").issuers(...) -> all who issued claims of given type about identity
// zachProfile.types -> all types of claims given, can be used to iterate
// zachProfile.issuer(...).types -> all types of claims given by issuer
// zachProfile.type("name").all -> returns flattened iterable
// zachProfile.issuer(...).all -> returns flattened iterable


// TODO Best Name for this class
// TODO validates some types
// extendable base class for Persona and Persona Public


/** Class representing an abstract Persona Interface, shared by specific persona implementations consuming inputs to generate a persona*/


var PersonaInterface = function () {

  /**
   *  Class constructor.
   *  Creates a new abstract PersonaInterface
   *
   *  @memberof PersonaInterface#
   *  @method          constructor
   *  @param           {TSProfile}         TSProfile                               A type indexed profile
   *  @param           {ISProfile}         ISProfile                               A issuer indexed profile
   *  @param           {String}            address                                 The identity address
   *  @return          {Object}            self
   */
  function PersonaInterface(TSProfile, ISProfile, address) {
    _classCallCheck(this, PersonaInterface);

    // TODO type check?
    this.TSProfile = TSProfile;
    this.ISProfile = ISProfile;
    // TODO address optional
    this.profileAddress = address;
  }

  /**
   *  Returns a IssuerMap object for the the given type string
   *
   *  @memberof PersonaInterface#
   *  @method          type
   *  @param           {String}                      type                       A claim type.
   *  @return          {IssuerMap}
   */


  _createClass(PersonaInterface, [{
    key: 'type',
    value: function type(typeString) {
      return this.TSProfile[typeString];
    }

    /**
     *  Returns a TypeMap object for the the given issuer string.
     *
     *  @memberof PersonaInterface#
     *  @method          issuer
     *  @param           {String}                      issuer                     A claim type.
     *  @return          {TypeMap}
     */

  }, {
    key: 'issuer',
    value: function issuer(issuerString) {
      return this.ISProfile[issuerString];
    }

    /**
     *  Returns a TypeMap object for claims issued/created by this profile
     *
     *  @memberof PersonaInterface#
     *  @method          issuer
     *  @return          {TypeMap}
     */

  }, {
    key: 'self',
    get: function get() {
      return this.issuer(this.address);
    }

    /**
     *  A getter which returns the address of this profile
     *
     *  @memberof PersonaInterface#
     *  @method          address
     *  @return          {String}
     */

  }, {
    key: 'address',
    get: function get() {
      //TODO Address is optional
      if (!this.profileAddress) throw new Error("Persona was not given an address");
      return this.profileAddress;
    }
  }]);

  return PersonaInterface;
}();

/** Class representing PublicPersona, extends PersonaInterface*/


var PublicPersona = function (_PersonaInterface) {
  _inherits(PublicPersona, _PersonaInterface);

  /**
   *  Class constructor.
   *  Creates a new PublicPersona object.
   *
   *  @memberof PublicPersona#
   *  @method          constructor
   *  @param           {JSON}              publicProfile                        Public Profile on IPFS
   *  @param           {String}            address                              The identity address
   *  @return          {Object}            self
   */
  function PublicPersona(publicProfile, address) {
    _classCallCheck(this, PublicPersona);

    // TODO validate publicProfile Format.
    // TODO don't neccesarily force the use of passing a new profile object below.
    var ISP = publicProfileToISProfile(publicProfile, new ISProfile(), address);
    var TSP = publicProfileToTSProfile(publicProfile, new TSProfile(address), address);
    return _possibleConstructorReturn(this, (PublicPersona.__proto__ || Object.getPrototypeOf(PublicPersona)).call(this, TSP, ISP, address));
  }

  return PublicPersona;
}(PersonaInterface);

/** Class representing a Persona, extends PersonaInterface*/


var Persona = function (_PersonaInterface2) {
  _inherits(Persona, _PersonaInterface2);

  /**
   *  Class constructor.
   *  Creates a new Persona object.
   *
   *  @memberof Persona#
   *  @method          constructor
   *  @param           {Array[JSON]}         claims                             The identity address
   *  @param           {PublicPersona}       publicProfile                      TODO: example from json
   *  @param           {String}              address                            The identity address
   *  @return          {Object}              self
   */
  function Persona(claims, publicPersona, address) {
    _classCallCheck(this, Persona);

    // This only needs publicProfile or address, may just two arg func with scnd arg parser
    // should it throw error if not given claims for some id or just ignore them and filter on demand for a user.
    // probably throught error and given a filter util, which will filter js  on web tokens, maybe decoded ones or not?
    // where do we filter, a profile is defined as a group of consitent attestations, consistent as in all describing one uportID
    var ISProfile = claimsToISProfile(claims, new ISProfile(), publicProfile.ISProfile);
    var TSProfile = claimsToTSProfile(claims, new TSProfile(address), publicProfile.TSProfile);
    return _possibleConstructorReturn(this, (Persona.__proto__ || Object.getPrototypeOf(Persona)).call(this, ISProfile, TSProfile, address));
  }

  return Persona;
}(PersonaInterface);

// PARSERS

//  ISProfile => Issuer sorted profile
//  TSProfile => Type sorted profile
//  PublicProfile => datastruct shared public, currently on ipfs, or specify by mapping
// These abstraction should allowing for any parsing/mapping from input to a uport-persona profile
// ***
// these parsers are more functional input -> ouput and allow an already exist profile to be passed, thus they allow easy chaining
//  ex.  claimsToISProfile(claims, publicProfileToISProfile(publicProfile))
//  ***

// TODO Should these receive address or not?

// TODO Should decide if profile is the best word for the object representation in this lib


/**
 *  Returns a Issuer indexed profile object given a public profile JSON object.
 *
 *  @method          publicProfileToISProfile
 *  @param           {JSON}                      publicProfile                  JSON public profile format.
 *  @param           {ISProfile}                 ISProfile                      A ISProfile to extend, may be empty if creating a new one
 *  @param           {String}                    address
 *  @return          {ISProfile}
 */


var publicProfileToISProfile = function publicProfileToISProfile(publicProfile, ISProfile, address) {
  return publicProfileToProfile(publicProfile, enforceISProfile(ISProfile), address);
};

/**
 *  Returns a Typed indexed profile object given a public profile JSON object.
 *
 *  @method          publicProfileToTSProfile
 *  @param           {JSON}                      publicProfile                  JSON public profile format.
 *  @param           {ISProfile}                 TSProfile                      A TSProfile to extend, may be empty if creating a new one
 *  @param           {String}                    address
 *  @return          {TSProfile}
 */
var publicProfileToTSProfile = function publicProfileToTSProfile(publicProfile, TSProfile, address) {
  return publicProfileToProfile(publicProfile, enforceTSProfile(TSProfile), address);
};

/**
 *  Returns a Issuer indexed profile object given an Array of claims, currently only parses default JWT formatted claims
 *
 *  @method          claimsToISProfile
 *  @param           {Array}                     claims                         An array of claims
 *  @param           {ISProfile}                 ISProfile                      A ISProfile to extend, may be empty if creating a new one
 *  @return          {ISProfile}
 */
var claimsToISProfile = function claimsToISProfile(claims, ISProfile) {
  return claimsToProfile(publicProfile, enforceISProfile(TSProfile));
};

/**
 *  Returns a Type indexed profile object given an Array of claims, currently only parses default JWT formatted claims
 *
 *  @method          claimsToISProfile
 *  @param           {Array}                     claims                         An array of claims
 *  @param           {TSProfile}                 TSProfile                      A TSProfile to extend, may be empty if creating a new one
 *  @return          {TSProfile}
 */
var claimsToTSProfile = function claimsToTSProfile(claims, TSProfile) {
  return claimsToProfile(publicProfile, enforceTSProfile(TSProfile));
};

// Enforces profile type, if not correct type throw error, if null, returns an empty profile of proper type
var enforceISProfile = function enforceISProfile(ISProfileObj) {
  var profile = ISProfileObj || new ISProfile();
  if (!(profile instanceof ISProfile)) throw new Error('Not a ISProfile');
  return profile;
};

var enforceTSProfile = function enforceTSProfile(TSProfileObj) {
  var profile = TSProfileObj || new TSProfile();
  if (!(profile instanceof TSProfile)) throw new Error('Not a TSProfile');
  return profile;
};

// General function to map inputs to profile, so far this includes public profile and an array of claims
// allows different profiles representations to be generated and allows functions for other inputs to be easily added

var publicProfileToProfile = function publicProfileToProfile(publicProfile, profile, address) {
  // TODO change to claims
  var claims = publicProfile.attestations;
  delete publicProfile.claims;

  for (var type in publicProfile) {
    profile.add(address, type, publicProfile[type]);
  }

  if (claims) {
    return claimsToProfile(claims, profile);
  }

  return profile;
};

//TODO should profile types share a class, a helper class to help
var claimsToProfile = function claimsToProfile(claims, profile) {
  // Ensure consistency of subject
  // or have optional address argument
  // throw error is claims doesn't match/consistent or should it just filter
  var address = decodeClaim(claims[0]).payload.sub.uportId;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = claims[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var claim = _step.value;

      var decodedToken = decodeClaim(claim);

      if (address === decodedToken.payload.sub.uportId) {
        profile.add(decodedToken.payload.iss.uportId, decodedToken.payload.type, decodedToken.payload.value);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return profile;
};

// TODO this will move to claim utilities after.
var decodeClaim = function decodeClaim(token) {
  return (0, _jsontokens.decodeToken)(token);
};

// TODO Claim Utilities

module.exports = { Registry: Registry, PublicPersona: PublicPersona, Persona: Persona };