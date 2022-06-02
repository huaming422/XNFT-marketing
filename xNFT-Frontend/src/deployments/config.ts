const chainMap: { [key: string]: string } = {
  56: 'bsc',
  97: 'bsc',
  128: 'heco',
  256: 'heco',
  1: 'eth',
  1337: 'eth',
};

const deployments = require(`./deployments/deployments_${
  chainMap[window?.ethereum?.chainId || '1']
}_${process.env.REACT_APP_HOST_TYPE}.json`);

const configurations: { [env: string]: any } = {
  local: {
    deployments,
    chainId: 256,
    gasLimitMultiplier: 2,
    etherscanUrl: 'https://hecoinfo.com',
    defaultProvider: 'https://mainnet.infura.io/v3/692cc4f2d5874121a22bbda6b2feb9f3',
    fetchUrl: 'http://dev-api-v2.xnft.net',
  },
  development: {
    deployments,
    chainId: 256,
    gasLimitMultiplier: 2,
    etherscanUrl: 'https://hecoinfo.com',
    defaultProvider: 'https://mainnet.infura.io/v3/692cc4f2d5874121a22bbda6b2feb9f3',
    fetchUrl: 'http://dev-api-v2.xnft.net',
  },
  testnet: {
    deployments,
    chainId: 256,
    gasLimitMultiplier: 2,
    etherscanUrl: 'https://hecoinfo.com',
    defaultProvider: 'https://mainnet.infura.io/v3/692cc4f2d5874121a22bbda6b2feb9f3',
    fetchUrl: 'http://pro-api.xnft.net',
  },
  mainnet: {
    deployments,
    chainId: 256, //TODO 正式网-128  测试网-256 先用测试网做默认值
    gasLimitMultiplier: 2,
    etherscanUrl: 'https://hecoinfo.com',
    defaultProvider: 'https://mainnet.infura.io/v3/692cc4f2d5874121a22bbda6b2feb9f3',
    fetchUrl: 'http://pro-api.xnft.net',
  },
};

export default configurations[process.env.REACT_APP_HOST_TYPE || 'development'];
