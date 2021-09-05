# 💬 ETHTalk
![ETHTalk Cover](https://bafybeicy5tjxjqsfc5tddiszrjsv6fijnsg377kyoqtlttmcfogxd2n4eq.ipfs.infura-ipfs.io/)
EthTalk is a comments widget implemented and designed for the Ethereum ecosystem built on top of [🏗 Scaffold-ETH](https://github.com/austintgriffith/scaffold-eth), lets visitors leave comments on your website with their non-custodial Ethereum account

> Try it yourself: https://ethtalk.app/

### Why ETHTalk?

### Features
- Open source 🌍
- ENS (Ethereum Name Service) supported 😎
- Sign-in with your non-custodial Ethereum accounts (No Facebook, Google, or Twitter accounts needed 🙅‍♀️)
- 🦊 MetaMask and 🔥 [BurnerWallet](https://www.xdaichain.com/for-users/wallets/burner-wallet) supported
- LaTex supported for commenting 🧮
- All the data is stored on Firebase Firestore 💽

### More fun ideas (feel free to contribute)
- Add verify badge for who have done Proof of Humanity
- Buy me a beer, send 🍺 (1x🍺 = 0.001 ETH) directly within a comment for patronizing the author
- Use your NFTs as a sticker
- Fully customize theme (with dark mode supported 🌝)

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

### How it works? (Overview)
1. User connect their wallet to give a public address to the site
2. Frontend send that public address to get a challenge code (nonce) from the backend
3. Frontend give the challenge code to the wallet to sign a message with PK 🔑
4. Frontend submit that signed message to the backend
5. Backend received the message, proof validity, and generate a new JWT custom token to frontend
6. Frontend use that token to sign in (using Firebase Custom Authentication)
7. Now the user can comment, like, and reply on the web 😎

### Tech stack
- Frontend: Firebase, React, Antd, [scaffold-eth/serverless-auth](https://github.com/austintgriffith/scaffold-eth/tree/serverless-auth) template
- Backend: Firebase Cloud Functions, Firestore, Firebase Custom Authentication

---

Crafted with 🧡 by [@chunza2542](https://twitter.com/chunza2542)
