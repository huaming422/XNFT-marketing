import { ethers } from 'ethers';
import Web3 from 'web3';
export type EthereumConfig = {
  testing: boolean;
  autoGasMultiplier: number;
  defaultConfirmations: number;
  defaultGas: string;
  defaultGasPrice: string;
  ethereumNodeTimeout: number;
};

export const defaultEthereumConfig = {
  testing: false,
  autoGasMultiplier: 1.5,
  defaultConfirmations: 1,
  defaultGas: '6000000',
  defaultGasPrice: '1000000000000',
  ethereumNodeTimeout: 10000,
};

const web3ProviderFrom = (endpoint: string, config?: EthereumConfig): any => {
  const ethConfig = Object.assign(defaultEthereumConfig, config || {});

  const providerClass = endpoint.includes('wss')
    ? Web3.providers.WebsocketProvider
    : Web3.providers.HttpProvider;

  return new providerClass(endpoint, {
    timeout: ethConfig.ethereumNodeTimeout,
  });
};

export async function getDefaultProvider() {
  try {
    if (!window.ethereum) {
      window.location.href = '/nowallet';
    }
    await window?.ethereum?.enable();
    // return new ethers.providers.Web3Provider(
    //   web3ProviderFrom(config.defaultProvider),
    //   config.chainId,
    //   // window.ethereum,
    // );
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider.pollingInterval = 200;
    return provider;
  } catch (e) {
    console.error('failed to get Provider');
    return {
      getSigner: () => {},
    };
  }
}
