const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const ResearchFundingModule = buildModule("ResearchFundingModule", (m) => {
  const researchFunding = m.contract("ResearchFunding");

  return { researchFunding };
});

module.exports = ResearchFundingModule;
