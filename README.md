# 💬 ETHTalk
![ETHTalk Cover](https://bafybeicy5tjxjqsfc5tddiszrjsv6fijnsg377kyoqtlttmcfogxd2n4eq.ipfs.infura-ipfs.io/)
EthTalk is a comments widget implemented for the Ethereum ecosystem that leveraged the ideas of ENS and Ethereum Single Sign-on built with 🏗 Scaffold-ETH, lets visitors leave comments on your website with their non-custodial Ethereum account

> Try it yourself: https://ethtalk.app/

### Why ETHTalk?

### Features

### Setting up project
1. Clone this repository
```sh
git clone git@github.com:chunza2542/ethtalk.app.git
```
3. Install dependencies
```sh
yarn # or npm install
```
3. Setup your firebase project
4. Start firebase-api (backend)
```
yarn firebase-api:start
```
5. Setup frontend environment variables
```
cd packages/react-app && cp .env.example .env && vim .env
```
6. Start react-app (frontend)
```
yarn react-app:start
```
7. Experiment and develop your AWESOME 😎 features

### Tech stack
- Frontend: Firebase, React, Antd, [scaffold-eth/serverless-auth](https://github.com/austintgriffith/scaffold-eth/tree/serverless-auth) template
- Backend: Firebase Cloud Functions, Firestore, Firebase Custom Authentication

---

Crafted with 🧡 by [@chunza2542](https://twitter.com/chunza2542)
