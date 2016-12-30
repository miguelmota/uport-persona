# uPort Persona
A library for creating, updating and reading attributes and claims on uport personas. It's intended as an easy interface to the uport-registry, allowing developers to focus on the actual data instead of the datastructure of the object stored in the registry. 

The primary interface for accessing persona data is through the Registry object.


## Example usage

### Importing

```js
import { Registry } from 'uport-persona';
```

### Configuring Registry

To use the `Registry` instantiate it like this:

```js
const registry = new Registry()
```

You can pass in various options in a settings object:

```js
import Web3 from 'web3'
const registry = new Registry( {
    web3prov: new Web3.providers.HttpProvider("http://localhost:8545"),
    ipfs: {host: 'localhost', port: 5001, protocol: 'http'}, // Pass in a configuration object or a ipfs-api compliant provider
    registryAddress: '0x...'
})
```

### Returning profile information for an ethereum address

Simply call the `registry.getPublicProfile(...)` method and you will be returned a promise containing the public uport profile.

```js
registry.getPublicProfile('0x06b4915f423117e3c71d671edcbbabd2a0222236').then((profile) => {
    console.log(profile)
})
```

To receive a more advanced Persona object that will let you query the profile based on who issued the claims use
 `registry.getPersona(...)` method and you will be returned a promise containing the Persona object.

```js
registry.getPersona('0x06b4915f423117e3c71d671edcbbabd2a0222236').then((persona) => {
    console.log(persona)
})
```

## Running tests
Simply run
```
$ npm test
```
## Documentation
<a name="Registry"></a>

## Registry
Class representing a uPort Registry.

**Kind**: global class  

* [Registry](#Registry)
    * [.constructor()](#Registry+constructor) ⇒ <code>Object</code>
    * [.getPublicProfile()](#Registry+getPublicProfile) ⇒ <code>Promise.&lt;JSON, Error&gt;</code>
    * [.getPersona()](#Registry+getPersona) ⇒ <code>Promise.&lt;PublicPersona, Error&gt;</code>
    * [.getPersonas()](#Registry+getPersonas) ⇒ <code>Promise.&lt;PublicPersona, Error&gt;</code>

<a name="Registry+constructor"></a>

### registry.constructor() ⇒ <code>Object</code>
Class constructor.
 Creates a new Registry object. The registryAddress is an optional argument and if not specified will be at the moment set to the default ropsten network uport-registry.

**Kind**: instance method of <code>[Registry](#Registry)</code>  
**Returns**: <code>Object</code> - self  

| Param | Type | Description |
| --- | --- | --- |
| settings.ipfs | <code>Object</code> | Optional custom ipfs provider (defaults to infura) |
| settings.web3prov | <code>Web3Provider</code> | Optional web3 provider object (defaults to infura ropsten node) |
| settings.registryAddress | <code>String</code> | Optional ethereum address of a uport contract |

<a name="Registry+getPublicProfile"></a>

### registry.getPublicProfile() ⇒ <code>Promise.&lt;JSON, Error&gt;</code>
Gets the public profile JSON object stored in IPFS for the given address.

**Kind**: instance method of <code>[Registry](#Registry)</code>  
**Returns**: <code>Promise.&lt;JSON, Error&gt;</code> - A promise that returns the JSON object stored in IPFS for the given address  
<a name="Registry+getPersona"></a>

### registry.getPersona() ⇒ <code>Promise.&lt;PublicPersona, Error&gt;</code>
Gets the the data stored in IPFS for the given object and creates a PublicPersona object.

**Kind**: instance method of <code>[Registry](#Registry)</code>  
**Returns**: <code>Promise.&lt;PublicPersona, Error&gt;</code> - A promise that returns a new PublicPersona object.  
<a name="Registry+getPersonas"></a>

### registry.getPersonas() ⇒ <code>Promise.&lt;PublicPersona, Error&gt;</code>
Gets the data stored in IPFS for an array of given addresses and creates an array of PublicPersona objects.

**Kind**: instance method of <code>[Registry](#Registry)</code>  
**Returns**: <code>Promise.&lt;PublicPersona, Error&gt;</code> - A promise that returns an array of new PublicPersona objects.  

<a name="PublicPersona"></a>

## PublicPersona
Class representing PublicPersona, extends PersonaInterface

**Kind**: global class  

* [PublicPersona](#PublicPersona)
    * [.constructor(publicProfile, address)](#PublicPersona+constructor) ⇒ <code>Object</code>
    * [.profile()](#PublicPersona+profile) ⇒ <code>Object</code>

<a name="PublicPersona+constructor"></a>

### publicPersona.constructor(publicProfile, address) ⇒ <code>Object</code>
Class constructor.
 Creates a new PublicPersona object.

**Kind**: instance method of <code>[PublicPersona](#PublicPersona)</code>  
**Returns**: <code>Object</code> - self  

| Param | Type | Description |
| --- | --- | --- |
| publicProfile | <code>JSON</code> | Public Profile on IPFS |
| address | <code>String</code> | The identity address |

<a name="PublicPersona+profile"></a>

### publicPersona.profile() ⇒ <code>Object</code>
A getter which returns a simple Profile Object

**Kind**: instance method of <code>[PublicPersona](#PublicPersona)</code>  

