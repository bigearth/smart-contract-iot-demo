var Clone = artifacts.require("./Clone.sol");

module.exports = function(deployer) {
  deployer.deploy(Clone, 1, 'EARTH');
};
