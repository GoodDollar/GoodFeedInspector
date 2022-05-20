import { CeramicClient } from '@ceramicnetwork/http-client'

import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'

import { fromString } from 'uint8arrays'
import { assign } from 'lodash'
import { DID } from 'dids'

import { CeramicModel } from './CeramicModel'

export const bootstrapCeramic = async (ceramicNodeURL: string, ceramicDIDSeed: string): Promise<any> => {
  const ceramic = new CeramicClient(ceramicNodeURL)

  if (ceramicDIDSeed) {
    const key = fromString(ceramicDIDSeed, 'base16')

    // initialize DID with provider and resolver
    const did = new DID({
      provider: new Ed25519Provider(key),
      resolver: getResolver()
    })

    // Authenticate the DID with the provider
    await did.authenticate()
    assign(ceramic, { did })
  }

  class Post extends CeramicModel {
    static readonly family = "Post"

    static readonly ceramic = ceramic
  }

  return { ceramic, Post }
}
