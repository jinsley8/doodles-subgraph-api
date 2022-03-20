import { ipfs, json } from '@graphprotocol/graph-ts';

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
    token.tokenURI = "/" + event.params.tokenId.toString()

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
          token.ipfsURI = "ipfs.io/ipfs/" + ipfsHash + token.tokenURI
        }

        const attributes = value.get('attributes')

        if (attributes) {
          const arr = attributes.toArray()
          for (let i = 0; i < arr.length; i++) {
            const obj = arr[i].toObject()
            const traitType = obj.get('trait_type')
            const value = obj.get("value")
            if (traitType && value) {
              if (traitType.toString() == "face") token.face = value.toString()
              if (traitType.toString() == "hair") token.hair = value.toString()
              if (traitType.toString() == "body") token.body = value.toString()
              if (traitType.toString() == "background") token.background = value.toString()
              if (traitType.toString() == "head") token.head = value.toString()
              if (traitType.toString() == "piercing") token.piercing = value.toString()
            }
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