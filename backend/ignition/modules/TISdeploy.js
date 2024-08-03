const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TISdeploy", (m) => {
  const friendManager = m.contract("FriendManager");
  const tipManager = m.contract("TipManager", [friendManager]);
  const tipItSimple = m.contract("TipItSimple", [friendManager]);

  return { friendManager, tipManager, tipItSimple };
});