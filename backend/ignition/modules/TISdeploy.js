const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TISdeploy", (m) => {
  const tipdeploy = m.contract("TipItSimple");

  return { tipdeploy };
});
