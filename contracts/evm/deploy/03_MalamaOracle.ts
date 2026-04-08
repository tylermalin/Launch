import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const sensorRegistry = await get("SensorDIDRegistry");
  const malamaOFT = await get("MalamaOFT");

  log("Deploying MalamaOracle...");

  const deployResult = await deploy("MalamaOracle", {
    from: deployer,
    args: [sensorRegistry.address, deployer, malamaOFT.address],
    log: true,
    autoMine: true,
  });

  log(`MalamaOracle deployed at: ${deployResult.address}`);
};

export default func;
func.tags = ["MalamaOracle"];
func.dependencies = ["SensorDIDRegistry", "MalamaOFT"];
