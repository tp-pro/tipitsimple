## backend

nvm use stable
yarn init
yarn add hardhat --dev
yarn hardhat init

## compilation du contrat

npx hardhat compile

## sécurité du contrat avec Slither

python3 - -version
CTRL+D
python3 -m pip install slither-analyzer

slither .
slither . - -checklist
slither . - -checklist - -show-ignored-findings

## test

/backend/test/
renommer Lock.js en TipItSimple.test.js
nettoyer
describe("TipItSimple test", function ()
deployOneYearLockFixture => deployFixture
npx hardhat test
yarn hardhat coverage

## déploiement

/backend/ignition/modules
npx hardhat ignition deploy ./ignition/modules/TISdeploy.js --network localhost
0x5FbDB2315678afecb367f032d93F642f64180aa3 = Contract address: 0x5fbdb2315678afecb367f032d93f642f64180aa3 retourné par la console du réseau local (npx hardhat node)
