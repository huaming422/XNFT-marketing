import { useContext } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import {
  IdentifierMap,
  schemaMap,
  mainChainAddress,
  ToastType,
  ERRORMSG,
} from '@utils/constants';
import { useWallet } from 'use-wallet';
import config from '../config';
import { getDefaultProvider } from '@src/utils/provider';
import { Contract, BigNumber, ethers } from 'ethers';
import Axios from 'axios';
const { deployments } = config;

const ERC20ABI = require('../deployments/erc20.json');

const gasOptions = (gas?: BigNumber) => {
  const multiplied = Math.floor(gas.toNumber() * config.gasLimitMultiplier);
  return BigNumber.from(multiplied);
};

const useOperation = () => {
  const { fetchUrl } = config;
  const { account } = useWallet();
  const { originChainId, lang } = useContext(Context);

  // 00(OK)_用户-登陆钱包后上报地址信息
  const saveUserAddress = async () => {
    const identifier = IdentifierMap[originChainId];
    try {
      return (
        await Axios.get(
          `${fetchUrl}/api/v1/xnft/user/${identifier}/${account?.toLowerCase()}`,
          {
            headers: {
              'Accept-Language': lang,
            },
          },
        )
      )?.data;
    } catch (e) {
      console.error('failed to save user address', e);
      return Promise.reject('failed to save');
    }
  };

  // /api/v1/xnft/nft/make/ipfs/{userAddress}
  // 21_NFT-添加用户NFT信息到IPFS
  const addNFTInfo = async (
    name: string,
    image: string,
    contractAddress: string,
    attributes: Array<{
      display_type: string;
      trait_type: string;
      value: string;
    }>,
    description?: string,
    external_url?: string,
    paymentContractAddress?: string,
    paymentContractSymbol?: string,
    paymentContractAmountRaw?: string,
    categoryCode?: string,
  ) => {
    const identifier = IdentifierMap[originChainId];
    const provider = await getDefaultProvider();
    const signer = provider.getSigner();
    const metaData = `userAddress=${account?.toLowerCase()}&name=${name}&description=${description}&image=${image}&externalUrl=${external_url}&backgroundColor=${
      paymentContractAddress ? `&paymentContractAddress=${paymentContractAddress}` : ''
    }${paymentContractSymbol ? `&paymentContractSymbol=${paymentContractSymbol}` : ''}${
      paymentContractAmountRaw ? `&paymentContractAmountRaw=${paymentContractAmountRaw}` : ''
    }${categoryCode ? `&categoryCode=${categoryCode}` : ''}${attributes
      .map((item, index) => {
        if (item.display_type) {
          return `&attributes[${index}].displayType=${item.display_type}&attributes[${index}].traitType=${item.trait_type}&attributes[${index}].value=${item.value}`;
        } else {
          return `&attributes[${index}].traitType=${item.trait_type}&attributes[${index}].value=${item.value}`;
        }
      })
      .join('')}`;

    const signature = await signer.signMessage(metaData);
    console.debug('signature', signature);
    try {
      const result = await Axios.post(
        `${fetchUrl}/api/v1/xnft/nft/make/ipfs/${identifier}/${contractAddress}/${account?.toLowerCase()}`,
        {
          signature,
          requestBean: {
            name,
            image,
            attributes,
            description,
            external_url,
            background_color: '',
            paymentContractAddress,
            paymentContractSymbol,
            paymentContractAmountRaw,
            categoryCode,
          },
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept-Language': lang,
          },
        },
      );
      return result.data;
    } catch (e) {
      console.error('failed to add nft info');
      return null;
    }
  };

  // 22_NFT-用户上传NFT图片等信息
  const addUserNFTImg = async (file: any) => {
    try {
      const identifier = IdentifierMap[originChainId];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('identifier', identifier);
      formData.append('userAddress', account?.toLowerCase());

      const response: any = await Axios.post(
        `${fetchUrl}/api/v1/xnft/nft/make/upload/${account?.toLowerCase()}`,
        {
          formData,
        },
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      const { data } = await response.data;
      return data || {};
    } catch (e) {
      console.error('failed to upload image', e);
    }
  };

  // 授权
  const approveNFT = async (nftContractAddress: string, schemaName: string) => {
    const provider = await getDefaultProvider();
    const signer = provider.getSigner();
    const NFTContract = new Contract(
      nftContractAddress,
      deployments[
        schemaName === schemaMap.ERC721 ? 'XNFTERC721Tradable' : 'XNFTERC1155Tradable'
      ].abi,
      signer,
    );
    const result = await NFTContract.setApprovalForAll(deployments.NormalMarket.address, true);
    return result.wait();
  };

  // 41(OK)_市场-用户将NFT挂单到市场，请求参数《详细说明》
  const doOrder = async (
    orderType: string,
    nftContractAddress: string,
    nftTokenId: string,
    ownerAddress: string,
    paymentTokenContractAddress: string,
    nftCount: number,
    paymentTokenContractAmountRaw: string,
    schemaName: string,
  ) => {
    try {
      const provider = await getDefaultProvider();
      const signer = provider.getSigner();
      const NFTContract = new Contract(
        nftContractAddress,
        deployments[
          schemaName === schemaMap.ERC721 ? 'XNFTERC721Tradable' : 'XNFTERC1155Tradable'
        ].abi,
        signer,
      );
      const isApproved = await NFTContract.isApprovedForAll(
        account?.toLowerCase(),
        deployments.NormalMarket.address,
      );
      if (!isApproved) {
        await NFTContract.setApprovalForAll(deployments.NormalMarket.address, true);
      }
      const metaData = `orderType=${orderType}&nftContractAddress=${nftContractAddress}&nftTokenId=${nftTokenId}&ownerAddress=${ownerAddress}&paymentTokenContractAddress=${paymentTokenContractAddress}&nftCount=${nftCount}&paymentTokenContractAmountRaw=${paymentTokenContractAmountRaw}`;
      const signature = await signer.signMessage(metaData);
      const identifier = IdentifierMap[originChainId];
      return Axios.post(
        `${fetchUrl}/api/v1/xnft/market/${identifier}`,
        {
          signature,
          requestBean: {
            orderType,
            nftContractAddress,
            nftTokenId,
            ownerAddress,
            paymentTokenContractAddress,
            nftCount,
            paymentTokenContractAmountRaw,
          },
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': lang,
          },
        },
      );
    } catch (e) {
      console.error('failed to doOrder', e);
      return Promise.reject('failed');
    }
  };

  // 42(OK)_市场-用户修改NFT市场的订单数据
  const cancelOrder = async (orderBizId: string) => {
    try {
      const provider = await getDefaultProvider();
      const signer = provider.getSigner();
      const metaData = `orderBizId=${orderBizId}&orderOperationType=CANCEL&ownerAddress=${account?.toLowerCase()}`;
      const signature = await signer.signMessage(metaData);
      const identifier = IdentifierMap[originChainId];
      return await Axios.put(
        `${fetchUrl}/api/v1/xnft/market/${identifier}`,
        {
          signature,
          requestBean: {
            orderBizId,
            orderOperationType: 'CANCEL',
            ownerAddress: account?.toLowerCase(),
          },
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': lang,
          },
        },
      );
    } catch (e) {
      console.error('failed to cancelOrder', e);
      return Promise.reject('failed');
    }
  };

  // 购买盲盒
  const buyLuckyBox = async (
    tokenId: string,
    count: number,
    paymentContractAddress: string,
    paymentContractAmountRaw: string,
    handleCancelApproving: Function,
    handleApproving: Function,
    handleStart: Function,
  ) => {
    try {
      const provider = await getDefaultProvider();
      const signer = provider.getSigner();
      const PrivateLuckyBoxContract = new Contract(
        deployments.PrivateLuckyBox.address,
        deployments.PrivateLuckyBox.abi,
        signer,
      );
      // 先授权
      const isMainCoin =
        paymentContractAddress?.toUpperCase() === mainChainAddress.toUpperCase();
      if (!isMainCoin) {
        const ERC20Token = new Contract(paymentContractAddress, ERC20ABI, signer);
        console.debug('account', account, ERC20Token);
        const balance = await ERC20Token.balanceOf(account?.toLowerCase());
        console.debug('balance', balance, balance.toString());
        if (BigNumber.from(paymentContractAmountRaw).gt(balance)) {
          return Promise.reject(ERRORMSG.INSUFFICIENT);
        }

        const allowance = await ERC20Token.allowance(
          account,
          deployments.PrivateLuckyBox.address,
        );
        if (
          Number(allowance.toString()) &&
          BigNumber.from(paymentContractAmountRaw).gt(allowance)
        ) {
          const resetResult = await ERC20Token.approve(deployments.PrivateLuckyBox.address, 0);
          handleCancelApproving();
          await resetResult.wait();
        }
        const approveResult = await ERC20Token.approve(
          deployments.PrivateLuckyBox.address,
          paymentContractAmountRaw,
        );
        handleApproving();
        await approveResult.wait();
      }

      const estimateGas = await PrivateLuckyBoxContract.estimateGas.purchase(tokenId, count, {
        value: isMainCoin ? paymentContractAmountRaw : 0,
      });
      const result = await PrivateLuckyBoxContract.purchase(tokenId, count, {
        value: isMainCoin ? paymentContractAmountRaw : 0,
        gasLimit: gasOptions(estimateGas),
      });
      handleStart();
      const buyBoxResult = await result.wait();
      const { blockNumber } = buyBoxResult;
      const reponseData = (
        await PrivateLuckyBoxContract.queryFilter({}, blockNumber, blockNumber)
      )?.filter((item: any) => item.event === 'PurchaseBoxNFT');
      const gotNFTIds = reponseData.map((item: any) => ({
        logIndex: item?.logIndex?.toString(),
        nftTokenId: item?.args?.tokenId?.toString(),
        nftContractAddress: item?.args?.nftAddress?.toString()?.toLowerCase(),
      }));
      return Promise.resolve(gotNFTIds);
    } catch (e) {
      console.error(`failed to buyLuckyBox `, e);
      return Promise.reject('failed');
    }
  };

  // 售卖
  const buyCard = async (
    orderBizId: string,
    handleCancelAllowance: Function,
    handleAllowance: Function,
  ) => {
    try {
      const metaData = `orderBizId=${orderBizId}&purchaser=${account?.toLowerCase()}`;
      const provider = await getDefaultProvider();
      const signer = provider.getSigner(0);
      const signature = await signer.signMessage(metaData);
      const identifier = IdentifierMap[originChainId];

      const responseData = await Axios.post(
        `${fetchUrl}/api/v1/xnft/market/sale/${identifier}`,
        {
          signature,
          requestBean: {
            orderBizId,
            purchaser: account?.toLowerCase(),
          },
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': lang,
          },
        },
      );
      const response = responseData?.data;
      const {
        orderId,
        schemaName,
        contractParams: {
          amount,
          erc721Address,
          erc1155Address,
          tokenId,
          price,
          feeRatio,
          paymentTokenAddress,
          sellerAddress,
          sigR,
          sigS,
          sigV,
        },
      } = response?.data;
      // 先授权
      const isMainCoin = paymentTokenAddress?.toUpperCase() === mainChainAddress.toUpperCase();
      if (!isMainCoin) {
        const ERC20Token = new Contract(paymentTokenAddress, ERC20ABI, signer);
        // 先判断余额
        const balance = await ERC20Token.balanceOf(account);
        console.debug('balance', paymentTokenAddress, price, balance.toString());
        if (BigNumber.from(price).gt(balance)) {
          return Promise.reject(ERRORMSG.INSUFFICIENT);
        }

        // 判断授权额度
        const allowance = await ERC20Token.allowance(account, deployments.NormalMarket.address);
        if (Number(allowance.toString()) && BigNumber.from(price).gt(allowance)) {
          // 额度不足，取消授权（0）
          handleCancelAllowance();
          const resetResult = await ERC20Token.approve(deployments.NormalMarket.address, 0);
          await resetResult.wait();
        }
        // 重新授权
        handleAllowance();
        const approveResult = await ERC20Token.approve(deployments.NormalMarket.address, price);
        await approveResult.wait();
      } else {
        const balance = await provider.getBalance(account);
        if (BigNumber.from(price).gt(balance)) {
          return Promise.reject(ERRORMSG.INSUFFICIENT);
        }
      }
      const NormalMarketContract = new Contract(
        deployments.NormalMarket.address,
        deployments.NormalMarket.abi,
        signer,
      );
      if (schemaName === schemaMap.ERC721) {
        const result = await NormalMarketContract.purchaseERC721(
          orderId,
          erc721Address,
          tokenId,
          price,
          feeRatio,
          paymentTokenAddress,
          sellerAddress,
          sigR,
          sigS,
          sigV,
          {
            value: isMainCoin ? price : 0,
          },
        );
        return result.wait();
      } else if (schemaName === schemaMap.ERC1155) {
        const result = await NormalMarketContract.purchaseERC1155(
          orderId,
          erc1155Address,
          tokenId,
          amount,
          price,
          feeRatio,
          paymentTokenAddress,
          sellerAddress,
          sigR,
          sigS,
          sigV,
          {
            value: isMainCoin ? price : 0,
          },
        );
        return result.wait();
      }
    } catch (e) {
      console.error(`failed to buyCard `, e);
      return Promise.reject('failed');
    }
  };

  // 创建盲盒以及添加NFT
  const mintAndBatchAddNFTs = async (
    tokenURI: string,
    paymentTokenAddress: string,
    price: string,
    nftAddresses: Array<string>,
    tokenIds: Array<string>,
    amounts: Array<string>,
    schemas: Array<string>,
    boxAddress: string,
    boxTokenId: string,
    selectedNFT: any,
    symbol: string,
    decimals: number,
  ) => {
    try {
      const provider = await getDefaultProvider();
      const signer = provider.getSigner();
      const PrivateLuckyBoxContract = new Contract(
        deployments.PrivateLuckyBox.address,
        deployments.PrivateLuckyBox.abi,
        signer,
      );
      const XNFTERC721TradableContract = new Contract(
        deployments.XNFTERC721Tradable.address,
        deployments.XNFTERC721Tradable.abi,
        signer,
      );
      const isERC721Approved = await XNFTERC721TradableContract.isApprovedForAll(
        account?.toLowerCase(),
        deployments.PrivateLuckyBox.address,
      );
      if (!isERC721Approved) {
        const approvalResult = await XNFTERC721TradableContract.setApprovalForAll(
          deployments.PrivateLuckyBox.address,
          true,
        );
        await approvalResult.wait();
      }

      const XNFTERC1155TradableContract = new Contract(
        deployments.XNFTERC1155Tradable.address,
        deployments.XNFTERC1155Tradable.abi,
        signer,
      );
      const isERC1155Approved = await XNFTERC1155TradableContract.isApprovedForAll(
        account?.toLowerCase(),
        deployments.PrivateLuckyBox.address,
      );
      if (!isERC1155Approved) {
        const approvalResult = await XNFTERC1155TradableContract.setApprovalForAll(
          deployments.PrivateLuckyBox.address,
          true,
        );
        await approvalResult.wait();
      }

      // 2.记录盲盒内添加的NFT价格
      await addLukyboxNFTPrice(
        boxAddress,
        boxTokenId,
        selectedNFT.map((item: any) => ({ ...item })),
      );

      const nonce = await signer.getTransactionCount('pending');
      console.debug('创建盲盒nonce', nonce);

      const result = await PrivateLuckyBoxContract.mintAndBatchAddNFTs(
        tokenURI,
        paymentTokenAddress,
        price,
        nftAddresses,
        tokenIds,
        amounts,
        schemas,
        {
          nonce,
        },
      );

      return result.wait();
    } catch (e) {
      console.error('failed to mintAndBatchAddNFTs', e);
      return Promise.reject('failed');
    }
  };

  // 修改盲盒
  // uint256 boxTokenId,
  // address owner,
  // address[] memory nftAddressesForRemoval,
  // uint256[] memory tokenIdsForRemoval,
  // uint256[] memory amountsForRemoval,
  // address[] memory nftAddressesForAddition,
  // uint256[] memory tokenIdsForAddition,
  // uint256[] memory amountsForAddition,
  // uint256[] memory schemasForAddition
  const batchEditNFTs = async (
    boxTokenId: string,
    tokenURI: string,
    price: string,
    nftAddressesForRemoval: Array<string>,
    tokenIdsForRemoval: Array<string>,
    amountsForRemoval: Array<string>,
    nftAddressesForAddition: Array<string>,
    tokenIdsForAddition: Array<string>,
    amountsForAddition: Array<string>,
    schemasForAddition: Array<string>,
  ) => {
    console.debug('batchEditNFTs', {
      boxTokenId,
      tokenURI,
      price,
      nftAddressesForRemoval,
      tokenIdsForRemoval,
      amountsForRemoval,
      nftAddressesForAddition,
      tokenIdsForAddition,
      amountsForAddition,
      schemasForAddition,
    });
    try {
      const provider = await getDefaultProvider();
      const signer = provider.getSigner();
      const PrivateLuckyBoxContract = new Contract(
        deployments.PrivateLuckyBox.address,
        deployments.PrivateLuckyBox.abi,
        signer,
      );
      const XNFTERC721TradableContract = new Contract(
        deployments.XNFTERC721Tradable.address,
        deployments.XNFTERC721Tradable.abi,
        signer,
      );
      const isApproved = await XNFTERC721TradableContract.isApprovedForAll(
        account?.toLowerCase(),
        deployments.PrivateLuckyBox.address,
      );
      if (!isApproved) {
        await XNFTERC721TradableContract.setApprovalForAll(
          deployments.PrivateLuckyBox.address,
          true,
        );
      }

      const result = await PrivateLuckyBoxContract.batchEditNFTs(
        boxTokenId,
        tokenURI,
        price,
        nftAddressesForRemoval,
        tokenIdsForRemoval,
        amountsForRemoval,
        nftAddressesForAddition,
        tokenIdsForAddition,
        amountsForAddition,
        schemasForAddition,
      );

      return result.wait();
    } catch (e) {
      console.error('failed to batchEditNFTs', e);
      return Promise.reject('failed');
    }
  };

  // 创建NFT
  const mintERC721 = async (
    tokenURI: string,
    contractAddress: string,
    isTokenIdAutoIncrement: 'Y' | 'N',
    tokenId?: string,
  ) => {
    try {
      const provider = await getDefaultProvider();
      const signer = provider.getSigner();

      if (isTokenIdAutoIncrement === 'Y') {
        const XNFTERC721TradableContract = new Contract(
          contractAddress,
          deployments.XNFTERC721Tradable.abi,
          signer,
        );
        const result = await XNFTERC721TradableContract.mint(tokenURI);
        return result.wait();
      } else {
        const EXTERC721TradableContract = new Contract(
          contractAddress,
          deployments.EXTERC721Tradable.abi,
          signer,
        );
        const result = await EXTERC721TradableContract.mint(tokenId, tokenURI);
        return result.wait();
      }
    } catch (e) {
      console.error('failed to mint', e);
      return Promise.reject('failed');
    }
  };

  // 创建NFT
  const mintERC1155 = async (
    tokenURI: string,
    amount: number,
    contractAddress: string,
    isTokenIdAutoIncrement: 'Y' | 'N',
    tokenId?: string,
  ) => {
    try {
      const provider = await getDefaultProvider();
      const signer = provider.getSigner();

      if (isTokenIdAutoIncrement === 'Y') {
        const XNFTERC1155TradableContract = new Contract(
          contractAddress,
          deployments.XNFTERC1155Tradable.abi,
          signer,
        );
        const result = await XNFTERC1155TradableContract.mint(amount, tokenURI);
        return result.wait();
      } else {
        const EXTERC1155TradableContract = new Contract(
          contractAddress,
          deployments.EXTERC1155Tradable.abi,
          signer,
        );
        const result = await EXTERC1155TradableContract.mint(tokenId, amount, tokenURI);
        return result.wait();
      }
    } catch (e) {
      console.error('failed to mint 1155', e);
      return Promise.reject('failed');
    }
  };

  // 查询是否平台合约授权
  const isApprovedForLuckybox = async (
    schemaName: string,
    contractAddress: string,
    isTokenIdAutoIncrement: string,
  ) => {
    try {
      const provider = await getDefaultProvider();
      const signer = provider.getSigner();

      let contractInstance = null;
      switch (schemaName) {
        case schemaMap.ERC721:
          contractInstance = new Contract(
            contractAddress,
            deployments[
              isTokenIdAutoIncrement === 'Y' ? 'XNFTERC721Tradable' : 'EXTERC721Tradable'
            ].abi,
            signer,
          );
          break;
        case schemaMap.ERC1155:
          contractInstance = new Contract(
            contractAddress,
            deployments[
              isTokenIdAutoIncrement === 'Y' ? 'XNFTERC1155Tradable' : 'EXTERC1155Tradable'
            ].abi,
            signer,
          );
          break;
      }

      return await contractInstance.isApprovedForAll(
        account?.toLowerCase(),
        deployments.PrivateLuckyBox.address,
      );
    } catch (e) {
      console.error('failed to isApprovedForLuckybox', e);
    }
  };

  const approveNFTToLuckyBox = async (nftContractAddress: string, schemaName: string) => {
    try {
      const provider = await getDefaultProvider();
      const signer = provider.getSigner();
      const NFTContract = new Contract(
        nftContractAddress,
        deployments[
          schemaName === schemaMap.ERC721 ? 'XNFTERC721Tradable' : 'XNFTERC1155Tradable'
        ].abi,
        signer,
      );
      const result = await NFTContract.setApprovalForAll(
        deployments.PrivateLuckyBox.address,
        true,
      );
      return result.wait();
    } catch (e) {
      return Promise.reject('failed to approve');
    }
  };

  // 37(OK)_盲盒-上报盲盒中藏品价格
  const addLukyboxNFTPrice = async (
    boxAddress: string,
    boxTokenId: string,
    priceList: Array<{
      nftAddress: string;
      nftTokenId: string;
      paymentContractAddress: string;
      paymentContractSymbol: string;
      price: string;
      priceAmountRaw: string;
    }>,
  ) => {
    try {
      const provider = await getDefaultProvider();
      const signer = provider.getSigner();
      const nonce = await signer.getTransactionCount('pending');
      const identifier = IdentifierMap[originChainId];
      const response: any = await Axios.post(
        `${fetchUrl}/api/v1/xnft/public/box/tx/${identifier}/${boxAddress}/${account?.toLowerCase()}`,
        {
          boxTokenId,
          nonce,
          priceList,
        },
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      const { data } = response.data;
      return data || {};
    } catch (e) {
      console.error('failed to upload image', e);
    }
  };

  // 03_敏感词检测接口
  const checkSensitiveWord = async (text: string) => {
    try {
      const response: any = await Axios.post(
        `${fetchUrl}/api/v1/xnft/public/sensitive-word/check`,
        {
          text,
        },
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      return response?.data;
    } catch (e) {
      console.error('failed to checkSensitiveWord', e);
    }
  };

  // 关闭
  const closeLuckybox = async (boxTokenId: string) => {
    try {
      const provider = await getDefaultProvider();
      const signer = provider.getSigner();

      const PrivateLuckyBoxContract = new Contract(
        deployments.PrivateLuckyBox.address,
        deployments.PrivateLuckyBox.abi,
        signer,
      );
      const result = await PrivateLuckyBoxContract.close(boxTokenId);
      return result.wait();
    } catch (e) {
      console.error('failed to closeLuckybox', e);
    }
  };

  // 60_项目-上报邀请信息
  // A邀请B  inviterAddress-邀请人  account-被邀请人
  const uploadInviteInfo = async (
    refId: string,
    activityType: string,
    inviterAddress: string, // 邀请人
  ) => {
    try {
      const provider = await getDefaultProvider();
      const signer = provider.getSigner();
      const metaData = `inviterAddress=${inviterAddress}&activityType=${activityType}&refId=${refId}`;
      const signature = await signer.signMessage(metaData);
      const identifier = IdentifierMap[originChainId];
      return await Axios.post(
        `${fetchUrl}/api/v1/xnft/activity/report/invite/${identifier}/${account?.toLowerCase()}`,
        {
          signature,
          requestBean: {
            inviterAddress,
            activityType,
            refId,
          },
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': lang,
          },
        },
      );
    } catch (e) {
      console.error('failed to cancelOrder', e);
      return Promise.reject('failed');
    }
  };

  // 42(OK)_市场-用户修改NFT市场的订单数据
  const fetchSaveNickname = async (nickname: string) => {
    try {
      const provider = await getDefaultProvider();
      const signer = provider.getSigner();
      const metaData = `userAddress=${account?.toLowerCase()}&nickname=${nickname}`;
      const signature = await signer.signMessage(metaData);
      return (
        await Axios.post(
          `${fetchUrl}/api/v1/xnft/user/nickname`,
          {
            signature,
            requestBean: {
              userAddress: account?.toLowerCase(),
              nickname: nickname,
            },
          },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Accept-Language': lang,
            },
          },
        )
      )?.data;
    } catch (e) {
      console.error('failed to fetchSaveNickname', e);
      return Promise.reject('failed');
    }
  };

  const uploadAvatarIcon = async (file: File, handleProgress: Function) => {
    try {
      const provider = await getDefaultProvider();
      const signer = provider.getSigner();
      const formData = new FormData();
      const metaData = `userAddress=${account?.toLowerCase()}`;
      const signature = await signer.signMessage(metaData);
      formData.append('signature', signature);
      formData.append('userAddress', account?.toLowerCase());
      formData.append('file', file);

      const action = `${fetchUrl}/api/v1/xnft/user/avatar`;
      return (
        await Axios.post(action, formData, {
          onUploadProgress: ({ total, loaded }) => {
            handleProgress(Math.round((loaded / total) * 100));
          },
        })
      )?.data;
    } catch (e) {
      console.error('failed to upload icon', e);
      return Promise.reject('error');
    }
  };

  return {
    uploadAvatarIcon,
    fetchSaveNickname,
    uploadInviteInfo,
    saveUserAddress,
    addUserNFTImg,
    addNFTInfo,
    doOrder,
    mintAndBatchAddNFTs,
    mintERC721,
    mintERC1155,
    buyLuckyBox,
    buyCard,
    approveNFT,
    cancelOrder,
    isApprovedForLuckybox,
    approveNFTToLuckyBox,
    addLukyboxNFTPrice,
    batchEditNFTs,
    checkSensitiveWord,
    closeLuckybox,
  };
};

export default useOperation;
