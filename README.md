# evm-smart-contract-example

<p align="center"><img src="https://raw.githubusercontent.com/jonalvarezz/evm-smart-contract-example/main/assets/screenshot.png?token=GHSAT0AAAAAABUAWENUMNSMA6WBPA7YTTW2ZRP4BYQ" width="500"></p>

Watch a demo video here: https://github.com/jonalvarezz/evm-smart-contract-example/tree/main/assets/demo.mp4

This is a web application to interact with the two following smart contracts on the Sepolia (ETH) network:

- [Bank contract 0x37C...6408](https://sepolia.etherscan.io/address/0x37C3E0343b0c5E23913eB3f4c346FAF336bf6408)
- [BankToken contract 0x9aF...615e](https://sepolia.etherscan.io/address/0x9aF18838611950953823154a04a14d2A34eE615e)

The app allows users to deposit and withdraw BankToken(TTK) tokens to and from the Bank Contract.

## 🚀 Quick start

1. Clone the repository

   ```
   git clone https://github.com/jonalvarezz/evm-smart-contract-example.git

   cd evm-smart-contract-example
   ```

2. Install dependencies with PNPM

   ```
   pnpm install
   ```

3. Start the application

   ```
   pnpm dev
   ```

### 🤖 Tech stack

This project features the following frameworks and libraries:

- [NX](https://nx.dev) to manage the workspace.
- Next.js
- ChakraUI
- Viem

## 🐉 Explore the project graph

Run `npx nx graph` to show the graph of the workspace.
It will show tasks that you can run with Nx.

- [Learn more about Exploring the Project Graph](https://nx.dev/core-features/explore-graph)

## 📝 Notes

### Motivation

- Gain familiarity interacting with EVM Smart Contract from a web app.

### Technical highlights

- Use Viem directly instead of Wagmi. Wagmi is a React Query wrapped of Viem to provide React Hooks for all of Viem's features. As a consequence, one ends up relying on `useEffect` to tell when something changed from Wagmi hooks. I decided to use Viem to one, keep it simple. And two, further understand Wagmi's decisions when wrapping Viem.
- React Query. For the app's state management, async operations and HTTP/WS's cache. It's worth nothing that some data is preloaded, as for instance, the Token's name, and symbol, not to block the rendering with data that doesn't change often. Data is revalidated in the background after the first mount.

### TODO

- [x] ops: deploy the app to the internet.
- [x] docs: add a demo video in the readme
- [x] feat: check allowance
- [ ] feat: support withdrawal
- [ ] feat: support token allowance increase from the app
- [ ] feat: support token minting
- [x] tech-debt: handle network missmatch. request connecting to sepolia on wallet connection `wallet_switchEthereumChain`
- [ ] ~~feat: maybe more wallets. use ConnectKit, Rainbow or similar~~
- [ ] feat: Support ENS. Display ENS instead of address, if any.
- [ ] feat: asynchronous transaction status. Allow users to close the app and come later to check the status of their last transaction(s).
- [x] tech-debt: remove token hardcoded decimals and token name. get its metadata from chain.

### Things I struggled the most with

- Writing into contracts from the app was not working. No matter the contract, the net or the libraries. I tried several combinations and it wouldn't work. As if the call never reached the wallet for signing and transport. I then realized my VPN connection was somehow blocking it. It took me a couple of hours to find out.
