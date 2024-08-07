## backend

Go to /backend

`yarn install`

Launch local blockchain

`npx hardhat node`

note the local wallets to add to Metamask for using the DApp in local

### metamask

add hardhat local network

- Network Name: `Hardhat`— This is up to you and defines how the network will show up in your network dropdown.
- New RPC URL: [`http://127.0.0.1:8545/`]
- Chain ID: `31337` — This is the default chain identifier that is implemented by Hardhat.
- Currency Symbol: `HardhatETH` — This is up to you and defines the symbol for the local network currency (ie. ETH).

You can pass tests

`npx hardhat test`

And coverage

`npx hardhat coverage`

### security with Slither

python3 - -version

CTRL+D

python3 -m pip install slither-analyzer

`slither .`

or

`slither . --checklist` my favorite

or

`slither . --checklist - -show-ignored-findings`

### hardhat console

You launch hardhat console

`npx hardhat console --network localhost`

### deploy

Need to deploy ?

`npx hardhat ignition deploy ./ignition/modules/TISdeploy.js --network localhost`

## frontend

Go to /frontend

`npm install`

Launch the front

`npm run dev`

## How to use the DApp

First you need to add local wallet address to metamask

Then connect to first account of the list, now you should have the Form to add accounts

Add an account with the second address for exemple, with a name like John

Then disconnect for connect with another wallet address, the third of the list for exemple

Now you should have the profil of John, you can send him a tip
