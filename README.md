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

TODO improve Registy experience

```js
const registry = new Registry(ipfsProvider, web3Prov)
```

### Returning profile information for an ethereum address

Simply call the `registry.getProfile(...)` method and you will be returned a promise containing the persona object.


```js
registry.getProfile('0x06b4915f423117e3c71d671edcbbabd2a0222236').then((persona) => {
    console.log(persona)
})
```

## Running tests
Simply run
```
$ npm test
```
## Documentation
<a name="Persona"></a>

## Persona
Class representing a Persona, extends PersonaInterface

**Kind**: global class  
<a name="Persona+constructor"></a>

### persona.constructor(claims, publicProfile, address) ⇒ <code>Object</code>
Class constructor.
 Creates a new Persona object.

**Kind**: instance method of <code>[Persona](#Persona)</code>  
**Returns**: <code>Object</code> - self  

| Param | Type | Description |
| --- | --- | --- |
| claims | <code>Array.&lt;Object&gt;</code> | The identity address |
| publicProfile | <code>[PublicPersona](#PublicPersona)</code> | TODO: example from json |
| address | <code>String</code> | The identity address |



ERROR, Cannot find class.
