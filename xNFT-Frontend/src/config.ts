import { IdentifierUrlMap } from './utils/constants';

const chainMap: { [key: string]: string } = {
  56: 'bsc',
  97: 'bsc',
  128: 'heco',
  256: 'heco',
  1: 'eth',
  1337: 'eth',
};

const defaultChainId = 128;
const chainName = window?.ethereum?.chainId ? Number(window?.ethereum?.chainId) : '';
const chainId = chainName || Number(localStorage.getItem('chainId')) || defaultChainId;
const identifier = chainMap[chainId] || chainMap[defaultChainId];
const deployments = require(`./deployments/deployments_${identifier}_${process.env.REACT_APP_HOST_TYPE}.json`);

const configurations: { [env: string]: any } = {
  local: {
    deployments,
    chainId: defaultChainId,
    gasLimitMultiplier: 2,
    etherscanUrl: IdentifierUrlMap[chainId],
    fetchUrl: 'http://dev-api-v2.xnft.net',
    socketUrl: 'ws://test-mns.digicenter.top',
  },
  development: {
    deployments,
    chainId: 256,
    gasLimitMultiplier: 2,
    etherscanUrl: IdentifierUrlMap[chainId],
    fetchUrl: 'http://dev-api-v2.xnft.net',
    socketUrl: 'ws://test-mns.digicenter.top',
  },
  testnet: {
    deployments,
    chainId: 256,
    gasLimitMultiplier: 2,
    etherscanUrl: IdentifierUrlMap[chainId],
    fetchUrl: 'http://dev-api-v2.xnft.net',
    socketUrl: 'ws://test-mns.digicenter.top',
  },
  pre: {
    deployments,
    chainId: defaultChainId,
    gasLimitMultiplier: 2,
    etherscanUrl: IdentifierUrlMap[chainId],
    fetchUrl: 'http://pre-api.xnft.net',
    socketUrl: 'wss://mns.xnft.net',
  },
  mainnet: {
    deployments,
    chainId: defaultChainId,
    gasLimitMultiplier: 2,
    etherscanUrl: IdentifierUrlMap[chainId],
    fetchUrl: 'https://api.xnft.net',
    socketUrl: 'wss://mns.xnft.net',
  },
};

export default configurations[process.env.REACT_APP_HOST_TYPE || 'development'];
