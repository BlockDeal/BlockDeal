declare module '@/contracts/deployment.json' {
  interface ContractDeployment {
    address: string;
    abi: any[];
  }

  interface DeploymentInfo {
    token: ContractDeployment;
    marketplace: ContractDeployment;
    network: {
      chainId: number;
      name: string;
    };
    deployer: string;
    timestamp: string;
  }

  const deployment: DeploymentInfo;
  export default deployment;
}

declare module '*.json' {
  const value: any;
  export default value;
} 