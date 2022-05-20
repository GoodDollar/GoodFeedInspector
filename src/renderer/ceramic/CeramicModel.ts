import { assign, isEmpty }  from 'lodash'

import { TileDocument } from '@ceramicnetwork/stream-tile'

export class CeramicModel {
  static ceramic = null;

  static family = null;

  static async load(id) {
    return TileDocument.load(this.ceramic, id)
  }

  static async update(document, content, tags = []) {
    const updatedContent = { ...document.content, ...content }

    return this.store(document, updatedContent, tags)
  }

  static async store(document, content, tags = []) {
    const metadata = this.createMetadata(tags)

    await document.update(content, metadata)
    return document
  }

  static async getIndex() {
    return this.getIndexDocument()
  }

  static async getLiveIndex() {
    return this.getIndexDocument(true)
  }

  private static async getIndexDocument(forLiveIndex = false) {
    const tagName = `${forLiveIndex ? 'live-' : ''}indexes`
    const index = await this.deterministic([tagName])

    if (isEmpty(index.content) && !forLiveIndex) {
      await index.update({ items: [] })
    }

    return index
  }

  private static createMetadata(tags = []) {
    const { family } = this
    const metadata = { family }

    if (!isEmpty(tags)) {
      assign(metadata, { tags })
    }

    return metadata
  }

  private static async deterministic(tags) {
    const { ceramic, family } = this
    const { id: controller } = ceramic.did

    return TileDocument.deterministic(ceramic, {
      // A single controller must be provided to reference a deterministic document
      controllers: [controller],
      // A family or tag must be provided in addition to the controller
      family,
      tags
    })
  }
}
