import { ipfs, json, JSONValue } from '@graphprotocol/graph-ts';

import {
  Transfer as TransferEvent,
  Token as TokenContract,
} from "../generated/Token/Token"

import {
  Token, User
} from "../generated/schema"


export function handleTransfer(event: TransferEvent): void {

  const ipfsHash = "QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS";

  let token = Token.load(event.params.tokenId.toString());

  if (!token) {
    token = new Token(event.params.tokenId.toString());
    token.tokenID = event.params.tokenId;
    token.tokenURI = "/" + event.params.tokenId.toString();

    let metadata = ipfs.cat(ipfsHash + token.tokenURI);

    if (metadata) {
      const value = json.fromBytes(metadata).toObject()
      if (value) {
        const image = value.get('image')
        const name = value.get('name')
        const description = value.get('description')

        if (name && image && description) {
          token.name = name.toString()
          token.image = image.toString()
          token.description = description.toString()
          token.ipfsURI = 'ipfs.io/ipfs/' + ipfsHash + token.tokenURI
        }

        let attributes:JSONValue[]
        let atts = value.get('attributes')
        if (atts) {
          attributes = atts.toArray()
        }

        for (let i = 0; i < attributes.length; i++) {
          let item = attributes[i].toObject()
          let trait:string
          let t = item.get('trait_type')
          if (t) {
            t.toString()
          }
          let value:string
          let v = item.get('value')
          if (v) {
            value = v.toString()
          }
          if (trait == "face") {
            token.face = value
          }

          if (trait == "hair") {
            token.hair = value
          }

          if (trait == "body") {
            token.body = value
          }

          if (trait == "background") {
            token.background = value
          }

          if (trait == "head") {
            token.head = value
          }

          if (trait == "piercing") {
            token.piercing = value
          }
        }
      }
    }
  }

  token.updatedAtTimestamp = event.block.timestamp;
  token.owner = event.params.to.toHexString();
  token.save();

  let user = User.load(event.params.to.toHexString());
  if (!user) {
    user = new User(event.params.to.toHexString());
    user.save();
  }
}