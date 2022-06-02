// Unit
const unit: any = {
  0: 'noether',
  1: 'wei',
  3: 'kwei',
  6: 'mwei',
  9: 'gwei',
  12: 'microether',
  15: 'milli',
  18: 'ether',
  20: 'kether',
  23: 'mether',
  26: 'gether',
  29: 'tether',
};
// noether: ‘0’
// wei: ‘1’
// kwei: ‘900’
// Kwei: ‘900’
// babbage: ‘900’
// femtoether: ‘900’
// mwei: ‘900000’
// Mwei: ‘900000’
// lovelace: ‘900000’
// picoether: ‘900000’
// gwei: ‘900000000’
// Gwei: ‘900000000’
// shannon: ‘900000000’
// nanoether: ‘900000000’
// nano: ‘900000000’
// szabo: ‘900000000000’
// microether: ‘900000000000’
// micro: ‘900000000000’
// finney: ‘900000000000000’
// milliether: ‘900000000000000’
// milli: ‘900000000000000’
// ether: ‘900000000000000000’
// kether: ‘900000000000000000000’
// grand: ‘900000000000000000000’
// mether: ‘900000000000000000000000’
// gether: ‘900000000000000000000000000’
// tether: ‘900000000000000000000000000000’

const mainChainAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

const MAX_INT_HEX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const NONE_ADDRESS = '0x0000000000000000000000000000000000000000';

const UINT_MAX_VALUE =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';

const OPERATION = {
  DEFAULT: 'DEFAULT',
};

// 挖矿时间
const MINTTIMER = 5000;

// 合约中放大的倍数
const ray = 27;
const wad = 18;

// 基础数值小数位
const digits = '0.00000000';
// 手续费小数位
const feeDigits = '0.00000000';
// 百分比小数位
const percentDigits = 2;
// 金融数字最大小数位
const maxDigits = 8;

// 利率类型
const enumRateMode = {
  NONE: 0,
  STABLE: 1,
  VARIABLE: 2,
};

// 平台币
const PLATFORM_SYMBOL = 'PT';

const DIRECTION = {
  DEFAULT: 'DEFAULT',
  DESC: 'DESC',
  ASC: 'ASC',
};

// 交互状态
const ToastType = {
  LOADING: 'LOADING',
  CANCEL: 'CANCEL',
  SENDED: 'SENDED',
  OK: 'OK',
  WARNING: 'WARNING',
  CLOSE: 'CLOSE',
};

// 区块确认时间
const BLOCK_CONFIRM_TIMER = 3000;

// 轮询时间
const LOOP_TIMER = 5000;

// 接口枚举
const IdentifierMap: { [key: number]: string } = {
  128: 'heco',
  256: 'heco',
  1: 'ethereum',
  1337: 'ethereum',
  97: 'bsc',
  56: 'bsc',
};

// 接口枚举
const IdentifierUrlMap: { [key: number]: string } = {
  1: 'https://etherscan.io/',
  56: 'https://bscscan.com/',
  97: 'https://testnet.bscscan.com/',
  128: 'https://hecoinfo.com/',
  256: 'https://testnet.hecoinfo.com/',
};

// SchemaMap
const schemaMap: { [key: string]: string } = {
  ERC20: 'ERC20',
  ERC721: 'ERC721',
  ERC1155: 'ERC1155',
};

// SchemaMap(Contract)
const schemaContractMap: { [key: string]: string } = {
  ERC721: '721',
  ERC1155: '1155',
};

const platformContractType = {
  BOX: 'BOX',
  BOX_PRIVATE: 'BOX_PRIVATE',
  MARKET: 'MARKET_SALE',
};

// 翻页每页固定数据数量
const pageSize = 40;

// 市场挂单状态
const MARKET_STATUS = {
  NORMAL: 'NORMAL',
  MARKET_SALE: 'MARKET_SALE',
};

// 交易类型
const saleType = {
  SALE: 'SALE',
  AUCTION: 'AUCTION',
};

// NFT授权状态
const approvedStatus = {
  APPROVED: 'Y',
  NOT_APPROVED: 'N',
};

// sort status
const SORT_STATUS = {
  ASC: 'ASC',
  DESC: 'DESC',
};

// sort field
const NFT_SORT_FIELD = {
  MINT_TIME: 'MINT_TIME',
  UPDATE_TIME: 'UPDATE_TIME',
  CREATE_TIME: 'CREATE_TIME',
  OPEN_COUNT: 'OPEN_COUNT',
};

// Swiper轮播时间间隔
const SWIPER_TIMER = 8000;

// 1155最大可锻造数量
const ERC1155MAXCOUNT = 100000000;
// 1155最大价格
const ERC1155MAXPRICE = 100000000;
// 盲盒最大价格
const LUCKYBOXMAXPRICE = 100000000;

// 全0地址
const zeroAddress = '0x0000000000000000000000000000000000000000';

//底部链接
const wechatUrl =
  'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=Mzg4MTYyMTQwNQ==&scene=124&uin=&key=&devicetype=Windows+10+x64&version=6303004c&lang=zh_CN&a8scene=7&fontgear=2';
const telegramurl = 'https://t.me/xNFT_Global';
const twitterurl = 'https://twitter.com/xNFT_Protocol?s=05';
const mediumurl = 'https://www.baidu.com/';
const gitHuburl = 'https://www.baidu.com/';
const wikiurl = 'https://www.baidu.com/';
const facebookurl = 'https://www.baidu.com/';
const linkedInurl = 'https://www.baidu.com/';
const discardurl = 'https://www.baidu.com/';
const weibourl = 'https://weibo.com/u/7590158942';

const chromeDownloadUrl = 'https://www.google.com/chrome';
const metaDownloadUrl = 'https://metamask.io';
const digiCenterUrl = 'https://www.digicenter.top/';
const bscUrl = 'https://bscscan.com/';
const hecoUrl = 'https://hecoinfo.com/';

// 图片尺寸限制
const ossSizeMap = {
  100: '?x-oss-process=image/resize,s_100',
  184: '?x-oss-process=image/resize,s_184',
  200: '?x-oss-process=image/resize,s_200',
  312: '?x-oss-process=image/resize,s_312',
  400: '?x-oss-process=image/resize,s_400',
  // 100: '?x-oss-process=image/resize,m_fill,w_100',
  // 184: '?x-oss-process=image/resize,m_fill,w_184',
  // 200: '?x-oss-process=image/resize,m_fill,w_200',
  // 312: '?x-oss-process=image/resize,m_fill,w_312',
};

const ERRORMSG = {
  INSUFFICIENT: 'INSUFFICIENT',
};

// 活动类型
const ACTIVITY_TYPE = {
  BOX: 'PRIVATE_BOX',
  NFT: 'MARKET_SELL',
};

// NFT事件
const NFT_EVENT = {
  // NFT
  NORMAL_PURCHASE: 'NORMAL_PURCHASE',
  TRANSFER: 'TRANSFER',
  TRANSFER_SINGLE: 'TRANSFER_SINGLE',
  TRANSFER_BATCH: 'TRANSFER_BATCH',
  // Luckybox
  BATCH_ADD: 'BATCH_ADD',
  PURCHASE_BOX_NFT: 'PURCHASE_BOX_NFT',
  BATCH_REMOVE: 'BATCH_REMOVE',
};

const SOCKET_EVENT = {
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
  PING: 'ping',
};

const SOCKET_BIZ = {
  xNFT: 'xNFT',
  DCW: 'DCW',
};

const SOCKET_TYPE = {
  MARKET_SALE: 'MARKET_SALE',
  MARKET_AUCTION: 'MARKET_AUCTION',
  BOX_PRIVATE: 'BOX_PRIVATE',
  BOX_PUBLIC: 'BOX_PUBLIC',
  NFT: 'NFT',
};

const SOCKET_ACTION = {
  NFT_MINT: 'MINT',
  PENDING: 'PENDING',
  USER_CANCEL: 'USER_CANCEL',
  DEAL: 'DEAL',
  TRANSFER_CANCEL: 'TRANSFER_CANCEL',
  PRIVATE_BOX_ADD: 'ADD',
  PRIVATE_BOX_REMOVE: 'REMOVE',
  PRIVATE_BOX_EDIT: 'EDIT',
  PRIVATE_BOX_TRANSFER: 'TRANSFER',
  PRIVATE_BOX_CLOSE: 'CLOSE',
  PRIVATE_BOX_START: 'START',
  PRIVATE_BOX_END: 'END',
};

const ReadyState = {
  UNINSTANTIATED: -1,
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

// socket ping timer
const SOCKET_PING_TIMER = 10000;

// EVENT for update status by brothers components
const EVENT = {
  DEFAULT: 'DEFAULT',
  UPDATE_AVATAR: 'UPDATE_AVATAR',
};

export {
  EVENT,
  NFT_SORT_FIELD,
  SORT_STATUS,
  SOCKET_PING_TIMER,
  SOCKET_ACTION,
  ReadyState,
  SOCKET_TYPE,
  SOCKET_BIZ,
  SOCKET_EVENT,
  zeroAddress,
  NFT_EVENT,
  ACTIVITY_TYPE,
  bscUrl,
  hecoUrl,
  ERRORMSG,
  ossSizeMap,
  digiCenterUrl,
  metaDownloadUrl,
  chromeDownloadUrl,
  wechatUrl,
  telegramurl,
  twitterurl,
  mediumurl,
  gitHuburl,
  wikiurl,
  facebookurl,
  linkedInurl,
  discardurl,
  weibourl,
  unit,
  pageSize,
  mainChainAddress,
  OPERATION,
  MINTTIMER,
  digits,
  ray,
  wad,
  enumRateMode,
  MAX_INT_HEX,
  PLATFORM_SYMBOL,
  DIRECTION,
  feeDigits,
  ToastType,
  NONE_ADDRESS,
  UINT_MAX_VALUE,
  percentDigits,
  BLOCK_CONFIRM_TIMER,
  LOOP_TIMER,
  IdentifierMap,
  IdentifierUrlMap,
  schemaMap,
  platformContractType,
  MARKET_STATUS,
  schemaContractMap,
  saleType,
  approvedStatus,
  SWIPER_TIMER,
  ERC1155MAXCOUNT,
  ERC1155MAXPRICE,
  LUCKYBOXMAXPRICE,
  maxDigits,
};
