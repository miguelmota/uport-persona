import {assert} from 'chai'
import Persona from '../lib/persona.js'
import testData from './testData.json'

// TODO test against profile json and public JWTs
// Maybe group some traversals together

describe('PublicPersona', function () {

  const publicProfileJSON = testData.profiles[0]
  const address = testData.ethAddresses[0]
  const profile = new Persona.PublicPersona(publicProfileJSON, address)


  it('Instatiates a public persona object', () => {
    const publicPersona = new Persona.PublicPersona(publicProfileJSON)
  })

  it('Returns all claims for a given issuer', () => {
    const claimsIssuer = profile.issuer("0xC302Dcc0d534aa931634103A47FF8E9d636DD76a")
    assert.equal(claimsIssuer.type('email')[0], "hello@world.net")
  })

  it('Returns all claims for a given type', () => {
    const claimsType = profile.type('name')
    assert.equal(claimsType.self[0], "Alice")
  })


  it('Returns all claims given issuer and given type', () => {
    const countryClaim = profile.issuer("0x565Af2FDC65D10B3226f04a6edC1C59C158D1dD8").type("country")
    assert.equal(countryClaim[0], 'United States')
  })


  it('Returns all claims given type and given issuer', () => {
    const countryClaim = profile.type("country").issuer("0x565Af2FDC65D10B3226f04a6edC1C59C158D1dD8")
    assert.equal(countryClaim[0], 'United States')
  })

  it('Returns all claims issued/created by the profile', () => {
    const ownProfile = profile.self
      assert.equal(ownProfile.type('name')[0], 'Alice')
      assert.equal(ownProfile.type('publicKey')[0], "020313f206e46575c98ed35658378fc76abfbad99900a05b0093a743a5d79dff67")
  })

  it('Returns all claims given a type and issued/created by the profile', () => {
    const ownName = profile.type('name').self
    assert.equal(ownName[0], 'Alice')
  })

  it('Returns all claims issued/created by the profile and a given type', () => {
    const ownName = profile.self.type('name')
    assert.equal(ownName[0], 'Alice')
  })



  // TODO return types
  // TODO return issuers
  // TODO iterators
  // TODO plain js object return



  // TODO are all these variations tested
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


  // this.timeout(30000)
  //
  // let persona
  //
  // it('Correctly verifies tokens', (done) => {
  //   assert.isTrue(Persona.isTokenValid(testData.validClaim))
  //   testData.invalidClaim.forEach((token) => {
  //     assert.isFalse(Persona.isTokenValid(token))
  //   })
  //   done()
  // })
  //
  // it('Correctly converts private keys to public keys', (done) => {
  //   const pubSignKey = Persona.privateKeyToPublicKey(testData.privSignKey1)
  //   assert.equal(pubSignKey, testData.pubSignKey1_valid)
  //   assert.notEqual(pubSignKey, testData.pubSignKey1_invalid)
  //   done()
  // })
  //
  // it('Creates a persona object', (done) => {
  //   persona = new Persona('myAddress', null, null)
  //   assert.equal(persona.address, 'myAddress')
  //   done()
  // })
  //
  // it('Correctly loads tokenRecords from list of claims', (done) => {
  //   persona.load(testData.claimList).then(() => {
  //     assert.deepEqual(testData.claimList, persona.getAllClaims())
  //     done()
  //   }).catch(done)
  // })
  //
  // it('Returns correct profile', (done) => {
  //   var p = persona.getProfile()
  //   delete p.pubSignKey
  //   delete p.pubEncKey
  //   assert.deepEqual(p, testData.profile)
  //   done()
  // })
  //
  // it('Correctly returns requested claim', (done) => {
  //   let token = persona.getClaims('name')[0]
  //   assert.equal(token.decodedToken.payload.claim.name, testData.profile.name)
  //   token = persona.getClaims('dontExist')[0]
  //   assert.isUndefined(token)
  //   done()
  // })
  //
  // it('Signs attribute correctly', (done) => {
  //   // should not be able to create claim without issuerId
  //   assert.throws(persona.signAttribute.bind(persona, testData.additionalAttribute, testData.privSignKey2), 'issuerId has to be set')
  //   // Create a claim that is signed by a third party
  //   let claim = persona.signAttribute(testData.additionalAttribute, testData.privSignKey2, testData.ethereumAddress)
  //   assert.isTrue(Persona.isTokenValid(claim))
  //   done()
  // })
})
