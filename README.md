# Doodles Subgraph API

Subgraph to query Doodles NFT tokens along with the traits and owners.


### How to use the API

Try it out [here](https://thegraph.com/hosted-service/subgraph/jinsley8/doodles-api)

Example query:

```graphql
{
  tokens(first: 5) {
    id
    tokenID
    tokenURI
    image
    name
    description
    face
    hair
    body
    background
    head
    piercing
    updatedAtTimestamp 
    owner {
      id 
    }
  }
}
```

Filtering

```graphql
{
  tokens(
    where: {
      face_contains: "mustache"
    }
  ) {
    face
    name
  }
}
```

Full text search

```graphql
{
  tokenSearch(
    text: "'#334'"
  ) {
    id
    name
    description
  }
}
```


### How to deploy the API

This project is an example of how you can build and deploy Graph Protocol APIs for NFT projects.

This subgraph indexes data from [doodles](https://etherscan.io/address/0x2acab3dea77832c09420663b0e1cb386031ba17b) smart contract transactions and makes them queryable.

This API enables advanced querying capabilities like full text search, relationships between tokens and users, filtering, sorting, and pagination.

To deploy this API, follow these steps:

1. Clone this repo, change into the directory, and install the dependencies:

```sh
git clone git@github.com:jinsley8/doodles-subgraph-api.git

cd doodles-subgraph-api

npm install
```

2. Visit The Graph [hosted service dashboard](https://thegraph.com/hosted-service/), create a profile, and create a new subgraph by clicking __Add Subgraph__.

3. Install The Graph CLI:

```sh
npm install -g @graphprotocol/graph-cli
```

4. Authenticate the your CLI environment with the __Access Token__ from your account dashboard:

```
graph auth https://api.thegraph.com/deploy/ <ACCESS_TOKEN>
```

5. Replace `username/apiname` in `package.json` with your username and apiname, for example: `jinsley8/doodles-api`

6. Deploy the subgraph

```sh
yarn deploy
```