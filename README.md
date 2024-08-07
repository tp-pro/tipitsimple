# TipitSimple DApp

## Backend

Go to /backend

`yarn install`

Launch local blockchain

`npx hardhat node`

note the local wallets to add to Metamask for using the DApp in local

### Metamask

install Metamask web3 wallet https://metamask.io/download/

add hardhat local network

- Network Name: `Hardhat`— This is up to you and defines how the network will show up in your network dropdown.
- New RPC URL: [`http://127.0.0.1:8545/`]
- Chain ID: `31337` — This is the default chain identifier that is implemented by Hardhat.
- Currency Symbol: `HardhatETH` — This is up to you and defines the symbol for the local network currency (ie. ETH).

Then add local wallets you can use with local hardhat blockchain

### Test the smart contract

You can pass tests

`npx hardhat test`

And coverage

`npx hardhat coverage`

### Security with Slither

more infos https://github.com/crytic/slither

python3 -m pip install slither-analyzer

`slither . --checklist`

### Hardhat console

You launch hardhat console

`npx hardhat console --network localhost`

### Deploy

Need to deploy ?

`npx hardhat ignition deploy ./ignition/modules/TISdeploy.js --network localhost`

## Frontend

Go to /frontend

`npm install`

Launch the front

`npm run dev`

### Rainbowkit ID

You'll need an ID for RainbowKit connect https://cloud.walletconnect.com/

### env variables

Create a .env.local and add :

NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID="ID from cloud walleconnect"

Doc Next JS https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables

## Ready to use the DApp

1. First you need to add local wallet address to metamask
2. Then connect to first account of the list, now you should have the Form to add accounts
3. Add an account with the second address for exemple, with a name like John
4. Then disconnect for connect with another wallet address, the third of the list for exemple
5. Now you should have the profil of John, you can send him a tip
