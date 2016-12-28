import { decodeToken } from 'jsontokens'

// May reduce this code with an abstract class

/** Class representing a (issuer, value) mapping. */
// TODO return object by im.map or by wrapper ex. im.object
// Sub map of TSProfile, TODO explain where this is used, this won't necessarily be a public class.
class IssuerMap {

  /**
   *  Class constructor.
   *  Creates and IssuerMap object. Initilizes the mapping and consumes and optional address with allow for additional ways to traverse the mapping.
   *
   *  @memberof IssuerMap#
   *  @method          constructor
   *  @param           {String}         address        TODO:OPTIONAL                                                  the address (UportIdentity) for which these claims represented as (issuer, value) are for.
   *  @return          {Object}         self
   */
  constructor(address) {
    this.map = {}
    // TODO will this address be optional
    this.address = address
  }

  //  In the future we may want this be able to also consume and another Profile/persona object which represents the issuer.
  /**
   *  Returns an array of values for the given issuer
   *
   *  @memberof IssuerMap#
   *  @method          issuer
   *  @param           {String}                      issuer                          The address of the issuer
   *  @return          {Object[]|String[]}                                        An array of Strings and/or Objects
   */
  issuer(issuer) {
    return this.map[issuer]
  }

  /**
   *  Adds a (issuer, value) to the mapping
   *
   *  @memberof IssuerMap#
   *  @method          add
   *  @param           {String}                       issuer                          The address of the issuer
   *  @param           {String|Object}                val                          The value of claim, may be an object or string
   *  @return          {Object[]|String[]}                                         An array of Strings and/or Objects
   */
  add(issuer, val) {
    if (this.map[issuer]) {
      this.map[issuer].push(val)
    } else {
      this.map[issuer] = [val]
    }
  }


  // Return flat array of {type: type, value: value} objects
  // TODO or call this flatten
  /**
   *  A getter which creates and returns a flattened iterable of the (key, values) as [{issuer:'issuer', value: 'value'}, ....]
   *
   *  @memberof IssuerMap#
   *  @method          all
   *  @return          {Object[]}                                         An array of objects [{issuer:'issuer', value: 'value'}, ....]
   */
  get all() {
    return Object.keys(this.map).map(key => this.map[key].map(val => ({issuer: key, value: val}))).reduce((acc, val) => acc.concat(val))
  }

  /**
   *  Returns values created/issued by the profile identity itself
   *
   *  @memberof IssuerMap#
   *  @method          all
   *  @return          {Object[]}                                         An array of objects [{key:'key', value: 'value'}, ....]
   */
  //  TODO if address optional, must have error here
  get self() {
    return this.map[this.address]
  }

  /**
   *  Returns array of issuers for iterating
   *
   *  @memberof IssuerMap#
   *  @method          issuers
   *  @return          {String[]}                                         An array of Issuers<String>
   */
  get issuers() {
    return Object.keys(this.map)
  }
}

// Sub map of ISProfile
/** Class representing a (type, value) mapping. */
class TypeMap {
  /**
   *  Class constructor.
   *  Creates and TypeMap object. Initilizes the mapping.
   *
   *  @memberof TypeMap#
   *  @method          constructor
   *  @return          {Object}         self
   */
  constructor() {
    this.map = {}
  }

  /**
   *  Returns an array of values for the given type
   *
   *  @memberof TypeMap#
   *  @method          type
   *  @param           {String}                      type                          The type string
   *  @return          {Object[]|String[]}                                        An array of Strings and/or Objects
   */
  type(type) {
    return this.map[type]
  }

  /**
   *  Adds a (issuer, value) to the mapping
   *
   *  @memberof TypeMap#
   *  @method          add
   *  @param           {String}                       type                      A claim type as a string.
   *  @param           {String|Object}                val                       The value of claim, may be an object or string
   *  @return          {Object[]|String[]}                                   An array of Strings and/or Objects
   */
  add(type, val) {
    if (this.map[type]) {
      this.map[type].push(val)
    } else {
      this.map[type] = [val]
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
   *  @return          {Object[]}                                         An array of objects [{type:'type', value: 'value'}, ....]
   */
  get all() {
    return Object.keys(this.map).map(key => this.map[key].map(val => ({type: key, value: val}))).reduce((acc, val) => acc.concat(val))
  }

  /**
   *  Returns array of types for iterating
   *
   *  @memberof IssuerMap#
   *  @method          types
   *  @return          {String[]}                                         An array of types<String>
   */
  get types() {
    return Object.keys(this.map)
  }
}



// Could these two object be generalized.
//  ISProfile => Issuer sorted profile
// {type: {issuer: [vals, vals], issuer: [vals, vals] ... }, type: ....}
//  TSProfile => Type sorted profile
// {issuer: {type: [vals, vals], type: [vals, vals] ... }, issuer: ....}


/** Class representing a Issuer Indexed/Sorted profile. Sub objects are TypeMap objects */
class ISProfile {

  /**
   *  Class constructor.
   *  Creates ISProfile
   *
   *  @memberof ISProfile#
   *  @method          constructor
   *  @return          {Object}         self
   */
  constructor() {}

  /**
   *  Adds a (issuer, value) to the mapping
   *
   *  @memberof ISProfile#
   *  @method          add
   *  @param           {String}                       issuer                    A claim issuer
   *  @param           {String|Object}                type                      A claim type
   *  @param           {String|Object}                val                       A claim value
   */
  add(issuer, type, value) {
    if (this[issuer]) {
      this[issuer].add(type, value)
    } else {
      this[issuer] = new TypeMap()
      this[issuer].add(type, value)
    }
  }
}

/** Class representing a Type Indexed/Sorted profile. Sub objects are IssuerMap objects */
class TSProfile {
  /**
   *  Class constructor.
   *  Creates TSProfile
   *
   *  @memberof TSProfile#
   *  @method          constructor
   *  @param           {String}                       address                      Address of this profile
   *  @return          {Object}         self
   */
  constructor(address) {
    // TODO is adress optional ?
    this.address = address
  }

  /**
   *  Adds a (issuer, value) to the mapping
   *
   *  @memberof TSProfile#
   *  @method          add
   *  @param           {String}                       issuer                    A claim issuer
   *  @param           {String|Object}                type                      A claim type
   *  @param           {String|Object}                val                       A claim value
   */
  add(issuer, type, value) {
    if (this[type]) {
      this[type].add(type, value)
    } else {
      this[type] = new IssuerMap(this.address)
      this[type].add(issuer, value)
    }
  }
}



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
class PersonaInterface {

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
  constructor(TSProfile, ISProfile, address){
    // TODO type check?
    this.TSProfile = TSProfile
    this.ISProfile = ISProfile
    // TODO address optional
    this.profileAddress = address
  }

  /**
   *  Returns a IssuerMap object for the the given type string
   *
   *  @memberof PersonaInterface#
   *  @method          type
   *  @param           {String}                      type                       A claim type.
   *  @return          {IssuerMap}
   */
  type(typeString) {
    return this.TSProfile[typeString]
  }

  /**
   *  Returns a TypeMap object for the the given issuer string.
   *
   *  @memberof PersonaInterface#
   *  @method          issuer
   *  @param           {String}                      issuer                     A claim type.
   *  @return          {TypeMap}
   */
  issuer(issuerString) {
    return this.ISProfile[issuerString]
  }

  /**
   *  Returns a TypeMap object for claims issued/created by this profile
   *
   *  @memberof PersonaInterface#
   *  @method          issuer
   *  @return          {TypeMap}
   */
  get self() {
    return this.issuer(this.address)
  }

  /**
   *  A getter which returns the address of this profile
   *
   *  @memberof PersonaInterface#
   *  @method          address
   *  @return          {String}
   */
  get address() {
    //TODO Address is optional
    if (!this.profileAddress) throw new Error("Persona was not given an address")
    return this.profileAddress
  }
}

/** Class representing PublicPersona, extends PersonaInterface*/
class PublicPersona extends PersonaInterface {
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
  constructor (publicProfile, address) {
    // TODO validate publicProfile Format.
    // TODO don't neccesarily force the use of passing a new profile object below.
    var ISP = publicProfileToISProfile(publicProfile, new ISProfile(), address)
    var TSP = publicProfileToTSProfile(publicProfile, new TSProfile(address), address)
    super(TSP, ISP, address)
    this.profileData = publicProfile
  }

  /**
   *  A getter which returns a simple Profile Object
   *
   *  @memberof PublicPersona#
   *  @method          profile
   *  @return          {Object}
   */
  get profile () {
    return this.profileData
  }
}

/** Class representing a Persona, extends PersonaInterface*/
class Persona extends PersonaInterface {

  /**
   *  Class constructor.
   *  Creates a new Persona object.
   *
   *  @memberof Persona#
   *  @method          constructor
   *  @param           {Object[]}         claims                             The identity address
   *  @param           {PublicPersona}       publicProfile                      TODO: example from json
   *  @param           {String}              address                            The identity address
   *  @return          {Object}              self
   */
  constructor(claims, publicPersona, address) {
    // This only needs publicProfile or address, may just two arg func with scnd arg parser
    // should it throw error if not given claims for some id or just ignore them and filter on demand for a user.
    // probably throught error and given a filter util, which will filter js  on web tokens, maybe decoded ones or not?
    // where do we filter, a profile is defined as a group of consitent attestations, consistent as in all describing one uportID
    const ISProfile = claimsToISProfile(claims, new ISProfile(), publicProfile.ISProfile)
    const TSProfile = claimsToTSProfile(claims, new TSProfile(address), publicProfile.TSProfile)
    super(ISProfile, TSProfile, address)
  }
}


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
const publicProfileToISProfile = (publicProfile, ISProfile, address) => {
  return publicProfileToProfile(publicProfile, enforceISProfile(ISProfile), address)
}

/**
 *  Returns a Typed indexed profile object given a public profile JSON object.
 *
 *  @method          publicProfileToTSProfile
 *  @param           {JSON}                      publicProfile                  JSON public profile format.
 *  @param           {ISProfile}                 TSProfile                      A TSProfile to extend, may be empty if creating a new one
 *  @param           {String}                    address
 *  @return          {TSProfile}
 */
const publicProfileToTSProfile = (publicProfile, TSProfile, address) => {
  return publicProfileToProfile(publicProfile, enforceTSProfile(TSProfile), address)
}

/**
 *  Returns a Issuer indexed profile object given an Array of claims, currently only parses default JWT formatted claims
 *
 *  @method          claimsToISProfile
 *  @param           {Array}                     claims                         An array of claims
 *  @param           {ISProfile}                 ISProfile                      A ISProfile to extend, may be empty if creating a new one
 *  @return          {ISProfile}
 */
const claimsToISProfile = (claims, ISProfile) => {
  return claimsToProfile(publicProfile, enforceISProfile(TSProfile))
}

/**
 *  Returns a Type indexed profile object given an Array of claims, currently only parses default JWT formatted claims
 *
 *  @method          claimsToISProfile
 *  @param           {Array}                     claims                         An array of claims
 *  @param           {TSProfile}                 TSProfile                      A TSProfile to extend, may be empty if creating a new one
 *  @return          {TSProfile}
 */
const claimsToTSProfile = (claims, TSProfile) => {
  return claimsToProfile(publicProfile, enforceTSProfile(TSProfile))
}

// Enforces profile type, if not correct type throw error, if null, returns an empty profile of proper type
const enforceISProfile = (ISProfileObj) => {
  const profile = ISProfileObj || new ISProfile()
  if (!(profile instanceof ISProfile)) throw new Error('Not a ISProfile')
  return profile
}

const enforceTSProfile = (TSProfileObj) => {
  const profile = TSProfileObj || new TSProfile()
  if (!(profile instanceof TSProfile)) throw new Error('Not a TSProfile')
  return profile
}

// General function to map inputs to profile, so far this includes public profile and an array of claims
// allows different profiles representations to be generated and allows functions for other inputs to be easily added

const publicProfileToProfile = (publicProfile, profile, address) => {
  // TODO change to claims
  const claims = publicProfile.attestations
  delete publicProfile.claims

  for (let type in publicProfile) {
    profile.add(address, type, publicProfile[type])
  }

  if (claims) {
    return claimsToProfile(claims, profile)
  }

  return profile
}


//TODO should profile types share a class, a helper class to help
const claimsToProfile = (claims, profile) => {
  // Ensure consistency of subject
  // or have optional address argument
  // throw error is claims doesn't match/consistent or should it just filter
  const address = decodeClaim(claims[0]).payload.sub.uportId

  for (let claim of claims) {
    const decodedToken = decodeClaim(claim)

    if (address === decodedToken.payload.sub.uportId) {
      profile.add(decodedToken.payload.iss.uportId, decodedToken.payload.type, decodedToken.payload.value)
    }
  }

  return profile
}

// TODO this will move to claim utilities after.
const decodeClaim = (token) => decodeToken(token)

// TODO Claim Utilities

module.exports = { PublicPersona, Persona }
