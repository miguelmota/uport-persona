import uportRegistry from 'uport-registry'
import Web3 from 'web3'
import { PublicPersona } from './persona'

// ropsten registry address, default for now
const DEFAULT_REGISTRY_ADDRESS = '0xb9C1598e24650437a3055F7f66AC1820c419a679'

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
class Registry {

  /**
  *  Class constructor.
  *  Creates a new Registry object. The registryAddress is an optional argument and if not specified will be at the moment set to the default ropsten network uport-registry.
  *
  *  @memberof Registry#
  *  @method          constructor
  *  @param           {Object}         settings                                                            optional settings containing web3, ipfs and registry settings
  *  @return          {Object}         self
  */
  constructor (settings = {}) {
    this.uportRegistry = uportRegistry

    if (settings.ipfs) {
      this.uportRegistry.setIpfsProvider(settings.ipfs)
    }

    if (settings.web3) {
      this.uportRegistry.setWeb3Provider(settings.web3)
    } else {
      this.uportRegistry.setWeb3Provider(new Web3.providers.HttpProvider('https://ropsten.infura.io/uport-persona-lib'))
    }

    this.registryAddress = settings.registryAddress || DEFAULT_REGISTRY_ADDRESS
  }

  /**
   *  Gets the public profile JSON object stored in IPFS for the given address.
   *
   *  @memberof Registry#
   *  @method           getPublicProfile
   *  @return           {Promise<JSON, Error>}            A promise that returns the JSON object stored in IPFS for the given address
   */
  getPublicProfile (address) {
    return this.uportRegistry.getAttributes(this.registryAddress, address)
  }

  /**
   *  Gets the the data stored in IPFS for the given object and creates a PublicPersona object.
   *
   *  @memberof Registry#
   *  @method           getPersona
   *  @return           {Promise<PublicPersona, Error>}            A promise that returns a new PublicPersona object.
   */
  getPersona (address) {
    return new Promise((resolve, reject) => {
      this.getPublicProfile(address)
        .then(profile => resolve(new PublicPersona(profile, address)))
    })
  }

  /**
   *  Gets the data stored in IPFS for an array of given addresses and creates an array of PublicPersona objects.
   *
   *  @memberof Registry#
   *  @method           getPersonas
   *  @return           {Promise<PublicPersona, Error>}            A promise that returns an array of new PublicPersona objects.
   */
  getPersonas (addresses) {
    const self = this
    return Promise.all(addresses.map(address => self.getPersona(address)))
  }
}

export default Registry
