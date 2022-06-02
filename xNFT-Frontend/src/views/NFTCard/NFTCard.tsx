import React, { useState, useContext, useEffect } from 'react';
import Page from '@components/Page';
import { useIntl } from 'react-intl';
import styled, { keyframes, ThemeContext } from 'styled-components';
import { Context } from '@src/contexts/provider/Provider';
import Spacer from '@components/Spacer';
import ArrowUpIcon from '@assets/img/arrow-up.png';
import ArrowDownIcon from '@assets/img/arrow-down.png';
import CloseIcon from '@assets/img/close.png';
import DeleteIcon from '@assets/img/delete.png';
import Deleteimg from '@assets/img/deleteimg.png';
import DefaultImgIcon from '@assets/img/defaultImg.png';
import LogoSM from '@assets/img/logoSM.png';
import NormalIcon from '@assets/img/normalIcon.png';
import DateIcon from '@assets/img/dateIcon.png';
import NumberIcon from '@assets/img/numberIcon.png';
import Container from '@src/components/Container';
import Input from '@src/components/Input';
import ArrowUp from '@assets/img/arrow-up.png';
import ArrowDown from '@assets/img/arrow-down.png';
import Dropdown from 'rc-dropdown';
import Checkbox from 'rc-checkbox';
import Modal from 'styled-react-modal';
import Menu, { Item as MenuItem } from 'rc-menu';
import Button from '@src/components/Button';
import { useWallet } from 'use-wallet';
import {
  ToastType,
  schemaMap,
  IdentifierMap,
  ERC1155MAXCOUNT,
  ossSizeMap,
} from '@src/utils/constants';
import useOperation from '@hooks/useOperation';
import useCategory from '@hooks/useCategory';
import useNFTPlatforms from '@hooks/useNFTPlatforms';
import { useHistory } from 'react-router-dom';
import Collapse from 'rc-collapse';
import moment from 'moment';
import DateTimePicker from 'react-datetime-picker';
import Upload from 'rc-upload';
import axios from 'axios';
import config from '../../config';
import useMedia from 'use-media';
import { Circle } from 'rc-progress';

const Panel = Collapse.Panel;

const typeIconMap: { [key: string]: string } = {
  normal: NormalIcon,
  date: DateIcon,
  number: NumberIcon,
};

const NFTCard: React.FC = () => {
  const intl = useIntl();
  const history = useHistory();
  const { account, connect } = useWallet();
  const { toggleLoading } = useContext(Context);
  const { maxWidth, color } = useContext(ThemeContext);
  const { Toast, connectWallet } = useContext(Context);
  const { addNFTInfo, mintERC721, mintERC1155, checkSensitiveWord } = useOperation();
  const categorys = useCategory();
  const { originChainId } = useContext(Context);
  const nftPlatforms = useNFTPlatforms();

  const isMobile = useMedia({ maxWidth: '600px' });
  useEffect(() => {
    if (!window?.ethereum) {
      window.location.href = '/nowallet';
    }
    if (!account) {
      connectWallet();
    }
  }, [account]);

  // 合约类型
  const [type, setType] = useState('');
  // 选中的合约包含的藏品类型
  const categoryTypeObj =
    nftPlatforms.find((item) => item.schemaName === type)?.categoryList || [];
  // 藏品类别
  const [category, setCategory] = useState('');
  const categorysMenu = (
    <StyledCategoryMenu mode="inline">
      {categorys
        .filter((item) => categoryTypeObj.includes(item.langCode))
        .map((item) => (
          <MenuItem
            key={item.langValue}
            onClick={() => {
              setCategory(item.langValue);
            }}
          >
            {item.langValue}
          </MenuItem>
        ))}
    </StyledCategoryMenu>
  );

  // NFT名称
  const [name, setName] = useState('');

  // 属性弹窗的展示方式
  const [visible, setVisible] = useState(false);

  // 向后台传数据用
  const [ipfsImageUrl, setIpfsImageUrl] = useState({
    type: 'img',
    src: '',
  });
  // 添加属性
  const [attributes, setAttributes] = useState([]);
  // 展示方式
  const showTypeMap: { [key: string]: string } = {
    normal: intl.formatMessage({ id: 'nft.create.modal.type.normal' }),
    number: intl.formatMessage({ id: 'nft.create.modal.type.number' }),
    date: intl.formatMessage({ id: 'nft.create.modal.type.date' }),
  };
  const [showType, setShowType] = useState('normal');
  const [typeModal, setTypeModal] = useState<boolean>(false);
  const toggleTypeModal = () => {
    setShowType('normal');
    setPropertyName('');
    setPropertyVal('');
    setTypeModal(!typeModal);
  };
  const [propertyName, setPropertyName] = useState('');
  const [propertyVal, setPropertyVal] = useState<any>();

  // 高级属性
  const [accordion, setAccordion] = useState(false);

  const [symbolVisible, setSymbolVisible] = useState(false);

  // 数量
  const [count, setCount] = useState('');

  // 描述
  const [comments, setComments] = useState('');

  // 外部链接
  const [link, setLink] = useState('');

  // 继续添加新属性
  const [autoNext, setAutoNext] = useState(false);

  // 上传组件props
  const [percent, setPercent] = useState(0);
  const isUploading = percent > 0 && percent < 100;

  const identifier = IdentifierMap[originChainId];
  const uploadProps = {
    action: `${config.fetchUrl}/api/v1/xnft/nft/make/upload/${account?.toLowerCase()}`,
    multiple: false,
    data: { identifier, userAddress: account?.toLowerCase() },
    headers: {
      Authorization: '$prefix $token',
    },
    accept: '.JPG,.JPEG,.PNG,.GIF,.SVG,.MP4,.WEBM,.OGG',
    customRequest({
      action,
      data,
      file,
      filename,
      headers,
      onError,
      onProgress,
      onSuccess,
      withCredentials,
    }: {
      action: string;
      data: {
        identifier: string;
        userAddress: string;
      };
    }) {
      // EXAMPLE: post form-data with 'axios'
      // eslint-disable-next-line no-undef
      const formData = new FormData();
      if (data) {
        Object.keys(data).forEach((key) => {
          formData.append(key, data[key]);
        });
      }
      formData.append(filename, file);

      axios
        .post(action, formData, {
          withCredentials,
          headers,
          onUploadProgress: ({ total, loaded }) => {
            setPercent(Math.round((loaded / total) * 100));
          },
        })
        .then(({ data: response }) => {
          setIpfsImageUrl({
            type: file.type.includes('image') ? 'img' : 'video',
            src: response.data,
          });
        })
        .catch(onError);
    },
  };

  // 非自增锻造token ID
  const [tokenId, setTokenId] = useState('');

  const isTokenIdAutoIncrement = nftPlatforms.find(
    (item) => item.schemaName === type,
  )?.isTokenIdAutoIncrement;

  const [contractAddress, setContractAddress] = useState('');

  const handleMint = async () => {
    try {
      if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
        return Toast(ToastType.WARNING, intl.formatMessage({ id: 'nft.card.form.link.error' }));
      }
      toggleLoading(true);
      const categoryCode = categorys.find((item) => item.langValue === category)?.langCode;

      // 先检查敏感词
      let attributesStr = '';
      attributes.forEach(
        (item: { display_type: string; trait_type: string; value: string }) => {
          attributesStr += `${item.trait_type}${item.value}`;
        },
      );
      const allWords = `${name}${comments}${link}${attributesStr}`;
      const checkResult = await checkSensitiveWord(allWords);
      if (checkResult && checkResult?.data?.length > 0) {
        toggleLoading(false);
        return Toast(
          ToastType.WARNING,
          intl.formatMessage(
            { id: 'nft.check.sensitive' },
            { word: checkResult?.data?.toString() },
          ),
        );
      }

      if (type === schemaMap.ERC721) {
        const response = await addNFTInfo(
          name,
          ipfsImageUrl.src,
          contractAddress,
          attributes,
          comments,
          link,
          '',
          '',
          '',
          categoryCode,
        );
        if (response?.data) {
          // 锻造loading
          toggleLoading(true, intl.formatMessage({ id: 'modal.minting' }));
          mintERC721(response?.data, contractAddress, isTokenIdAutoIncrement, tokenId)
            .then(() => {
              toggleLoading(false);
              history.push('/user/nfts');
            })
            .catch(() => {
              toggleLoading(false);
              Toast(ToastType.WARNING, intl.formatMessage({ id: 'common.msg.error' }));
            });
        } else {
          toggleLoading(false);
          Toast(ToastType.WARNING, intl.formatMessage({ id: 'common.msg.error' }));
        }
      } else if (type === schemaMap.ERC1155) {
        const response = await addNFTInfo(
          name,
          ipfsImageUrl.src,
          contractAddress,
          attributes,
          comments,
          link,
          '',
          '',
          '',
          categoryCode,
        );
        if (response?.data) {
          // 锻造loading
          toggleLoading(true, intl.formatMessage({ id: 'modal.minting' }));
          mintERC1155(
            response?.data,
            Number(count),
            contractAddress,
            isTokenIdAutoIncrement,
            tokenId,
          )
            .then(() => {
              toggleLoading(false);
              history.push('/user/nfts');
            })
            .catch(() => {
              toggleLoading(false);
              Toast(ToastType.WARNING, intl.formatMessage({ id: 'common.msg.error' }));
            });
        } else {
          Toast(ToastType.WARNING, response?.msg);
        }
      }
    } catch (e) {
      toggleLoading(false);
      Toast(ToastType.WARNING, intl.formatMessage({ id: 'common.msg.error' }));
    }
  };
  if (isMobile) {
    return (
      <Page page="nftCard">
        <Container
          flex
          direction="column"
          align="left"
          justify="center"
          maxWidth={maxWidth}
          padding="0 24px"
          overflow="hidden"
        >
          {<Spacer size="md" />}
          <StyledTitle>{intl.formatMessage({ id: 'nft.card.title' })}</StyledTitle>
          <Spacer size="sm" />
          <StyledSubTitle>{intl.formatMessage({ id: 'nft.card.content' })}</StyledSubTitle>
        </Container>
        <Spacer size="md" />
        <Container
          flex
          direction="column"
          align="center"
          justify="center"
          padding="24px 24px"
          maxWidth={maxWidth}
          background="#fff"
        >
          <StyledContentTitle>
            {intl.formatMessage({ id: 'nft.card.form.title1' })}
          </StyledContentTitle>
          <Spacer size="md" />

          <StyledUpload>
            <StyledImage>
              <div className="inner">
                {isUploading ? (
                  <Circle
                    percent={[percent, 100]}
                    strokeWidth={8}
                    strokeLinecap="round"
                    strokeColor={[color.primary.main, '#F3F3F3']}
                  />
                ) : (
                  <>
                    {ipfsImageUrl.type === 'img' && (
                      <img
                        src={
                          ipfsImageUrl.src && ipfsImageUrl.src?.toLowerCase().includes('.svg')
                            ? ipfsImageUrl.src
                            : ipfsImageUrl.src
                            ? `${ipfsImageUrl.src}${ossSizeMap[184]}`
                            : DefaultImgIcon
                        }
                        alt=""
                      />
                    )}
                    {ipfsImageUrl.type === 'video' && (
                      <video
                        src={ipfsImageUrl.src}
                        controls
                        poster={`${ipfsImageUrl.src}?x-oss-process=video/snapshot,t_7000,f_jpg,m_fast`}
                      ></video>
                    )}
                  </>
                )}
              </div>
              {ipfsImageUrl.src && (
                // <div className="deleteimg">
                <img
                  className="delete"
                  src={Deleteimg}
                  width="24px"
                  alt=""
                  onClick={() => {
                    setIpfsImageUrl({
                      type: 'img',
                      src: '',
                    });
                  }}
                />
                // </div>
              )}
            </StyledImage>
            {/* <Spacer size="md" /> */}
            <Spacer size="md" />
            <div className="operation">
              <div className="button">{intl.formatMessage({ id: 'nft.card.form.upload' })}</div>
              <Spacer size="md" />
              <Upload {...uploadProps}>
                <Button
                  onClick={() => {
                    if (!account) {
                      Toast(
                        ToastType.WARNING,
                        intl.formatMessage({ id: 'modal.warning.connect.wallet' }),
                      );
                      connectWallet();
                    }
                  }}
                  size={'md'}
                  variant="secondary"
                  disabled={percent > 0 && percent < 100}
                  loading={percent > 0 && percent < 100}
                  text={intl.formatMessage({ id: 'nft.card.form.button.add' })}
                />
              </Upload>
            </div>
          </StyledUpload>
          <Spacer size="md" />
          <StyledContentSubTitle>
            {intl.formatMessage({ id: 'nft.card.form.select.type' })}
          </StyledContentSubTitle>
          <Spacer size="md" />
          <StyledGroup>
            {nftPlatforms.map((item, index) => (
              <div
                key={item.contractAddress}
                className={`card ${contractAddress === item.contractAddress ? 'active' : ''}`}
                onClick={() => {
                  setType(item.schemaName);
                  setContractAddress(item.contractAddress);
                  setCategory('');
                }}
              >
                <img src={LogoSM} width="48px" alt="" />
                <Spacer size="sm" />
                <div className="comments">
                  <span>{item.collectionSlug}</span>
                  <span>{item.schemaName}</span>
                </div>
              </div>
            ))}
            <Spacer size="md" />
          </StyledGroup>
          <Spacer size="md" />
          <div className="more">
            {intl.formatMessage({ id: 'nft.card.form.select.type.more' })}
          </div>
          <Spacer size="md" />
          {isTokenIdAutoIncrement === 'N' ? (
            <>
              <StyledContentSubTitle>Token ID</StyledContentSubTitle>
              <Spacer size="sm" />
              <Input
                width="100%"
                onChange={(event) => {
                  const inputVal = event.currentTarget.value;
                  if (inputVal && !Number.isInteger(Number(inputVal))) {
                    setTokenId('');
                  } else {
                    setTokenId(inputVal);
                  }
                }}
                placeholder={intl.formatMessage({ id: 'nft.card.form.name.placeholder' })}
                value={tokenId}
                padding="0"
                variant="inline"
                background="transparent"
              />
              <Spacer size="lg" />
            </>
          ) : (
            ''
          )}
          <StyledContentSubTitle>
            {intl.formatMessage({ id: 'nft.card.form.name' })}
          </StyledContentSubTitle>
          <Spacer size="sm" />
          <Input
            width="100%"
            type="text"
            onChange={(event) => {
              const inputVal = event.currentTarget.value;
              if (inputVal && inputVal?.length > 50) {
                setName(inputVal?.slice(0, 50));
              } else {
                setName(inputVal);
              }
            }}
            placeholder={intl.formatMessage({ id: 'nft.card.form.name.placeholder' })}
            value={name}
            padding="0"
            variant="inline"
            background="transparent"
            endAdornment={`${name?.length || 0}/50`}
          />
          {type === schemaMap.ERC1155 && (
            <>
              <Spacer size="md" />
              <StyledContentSubTitle>
                {intl.formatMessage({ id: 'nft.card.form.count' })}
              </StyledContentSubTitle>
              <Spacer size="sm" />
              <Input
                width="100%"
                onChange={(event) => {
                  const inputVal = event.currentTarget.value;
                  if (inputVal && Number(inputVal) > ERC1155MAXCOUNT) {
                    setCount(`${ERC1155MAXCOUNT}`);
                  } else {
                    setCount(inputVal);
                  }
                }}
                placeholder={intl.formatMessage({ id: 'nft.card.form.count.placeholder' })}
                value={count}
                padding="0"
                variant="inline"
                background="transparent"
              />
            </>
          )}
          <Spacer size="md" />
          <StyledContentSubTitle>
            {intl.formatMessage({ id: 'nft.card.form.type' })}
          </StyledContentSubTitle>
          <Spacer size="sm" />
          <Dropdown
            trigger="click"
            overlayStyle={
              categorys?.filter((item) => categoryTypeObj.includes(item.langCode))?.length > 0
                ? {
                    width: '220px',
                    height: '246px',
                    minWidth: '220px',
                    maxHeight: '246px',
                    overflow: 'auto',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                  }
                : {
                    display: 'none',
                  }
            }
            align={{ targetOffset: [0, 12] }}
            overlay={categorysMenu}
            placement="topRight"
            onVisibleChange={(visible) => {
              setSymbolVisible(visible);
            }}
          >
            <StyledSelect>
              {category || intl.formatMessage({ id: 'nft.card.form.type.placeholder' })}
              <img width="20px" src={symbolVisible ? ArrowUpIcon : ArrowDownIcon} alt="" />
            </StyledSelect>
          </Dropdown>
          <Spacer size="md" />
          <StyledCollapse
            accordion={accordion}
            onChange={() => {
              setAccordion(!accordion);
            }}
            expandIcon={() => (
              <img src={accordion ? ArrowUpIcon : ArrowDownIcon} width="20px" alt="" />
            )}
          >
            <Panel
              header={
                <StyledContentTitle>
                  {intl.formatMessage({ id: 'nft.card.form.title2' })}
                  <Spacer size="sm" />
                  <span className="comments">
                    {intl.formatMessage({ id: 'nft.card.form.title2.comments' })}
                  </span>
                </StyledContentTitle>
              }
              headerClass="my-header-class"
            >
              <>
                <StyledContentSubTitle>
                  {intl.formatMessage({ id: 'nft.card.form.comments' })}
                </StyledContentSubTitle>
                <Spacer size="sm" />
                <Input
                  width="100%"
                  type="text"
                  onChange={(event) => {
                    const inputVal = event.currentTarget.value;
                    if (inputVal && inputVal?.length > 200) {
                      setComments(inputVal?.slice(0, 200));
                    } else {
                      setComments(inputVal);
                    }
                  }}
                  placeholder={intl.formatMessage({ id: 'nft.card.form.comments.placeholder' })}
                  value={comments}
                  padding="0"
                  variant="inline"
                  background="transparent"
                  endAdornment={`${comments?.length || 0}/200`}
                />
                <Spacer size="md" />
                <StyledContentSubTitle>
                  {intl.formatMessage({ id: 'nft.card.form.link' })}
                </StyledContentSubTitle>
                <Spacer size="sm" />
                <Input
                  width="100%"
                  type="text"
                  onChange={(event) => {
                    const inputVal = event.currentTarget.value;
                    if (inputVal && inputVal?.length > 300) {
                      setLink(inputVal?.slice(0, 300));
                    } else {
                      setLink(inputVal);
                    }
                  }}
                  placeholder={intl.formatMessage({ id: 'nft.card.form.link.placeholder' })}
                  value={link}
                  padding="0"
                  variant="inline"
                  background="transparent"
                  endAdornment={`${link?.length || 0}/300`}
                />
                <Spacer size="md" />
                <StyledContentSubTitle>
                  {intl.formatMessage({ id: 'nft.card.form.property' })}
                  {ipfsImageUrl && attributes?.length <= 50 && (
                    <span
                      className="property"
                      onClick={() => {
                        toggleTypeModal();
                      }}
                    >
                      {intl.formatMessage({ id: 'nft.card.form.property.add' })}
                    </span>
                  )}
                </StyledContentSubTitle>
                <Spacer size="md" />
                <StyledAttribute>
                  {attributes.map((item, index) => (
                    <div
                      key={`${item.display_type}-${item.trait_type}-${index}`}
                      className="item"
                    >
                      <div className="detail">
                        <img
                          src={typeIconMap[item.display_type || 'normal']}
                          width="18px"
                          alt=""
                        />
                        <Spacer size="md" />
                        <Dropdown
                          trigger="click"
                          align={{ targetOffset: [0, 12] }}
                          placement="topCenter"
                          overlayStyle={{
                            width: '320px',
                            minWidth: '320px',
                          }}
                          overlay={<StyledPopover>{item.trait_type}</StyledPopover>}
                        >
                          <span>{item.trait_type}</span>
                        </Dropdown>
                        <Spacer size="md" />
                        {item.display_type === 'date' ? (
                          <span>{moment(item.value).format('YYYY-MM-DD HH:mm:ss')}</span>
                        ) : (
                          <Dropdown
                            trigger="click"
                            align={{ targetOffset: [0, 12] }}
                            placement="topCenter"
                            overlayStyle={{
                              width: '320px',
                              minWidth: '320px',
                            }}
                            overlay={<StyledPopover>{item.value}</StyledPopover>}
                          >
                            <span>{item.value}</span>
                          </Dropdown>
                        )}
                      </div>
                      <img
                        onClick={() => {
                          setAttributes(attributes.filter((_, newIdx) => newIdx !== index));
                        }}
                        src={DeleteIcon}
                        width="18px"
                        alt=""
                      />
                    </div>
                  ))}
                </StyledAttribute>
              </>
            </Panel>
          </StyledCollapse>
          <Spacer size="md" />
          <StyleMintButton>
            <Button
              onClick={handleMint}
              disabled={
                isTokenIdAutoIncrement === 'Y'
                  ? !ipfsImageUrl.src || !name || !category || (percent > 0 && percent < 100)
                  : !ipfsImageUrl.src ||
                    !name ||
                    !contractAddress ||
                    !category ||
                    (percent > 0 && percent < 100) ||
                    !tokenId
              }
              size={'md'}
              variant="primary"
              text={intl.formatMessage({ id: 'nft.card.form.mint.button' })}
            />
          </StyleMintButton>
        </Container>
        <Spacer size="md" />
        <StyledModal
          isOpen={typeModal}
          onBackgroundClick={() => {
            toggleTypeModal();
          }}
          onEscapeKeydown={() => {
            toggleTypeModal();
          }}
        >
          <Container
            flex
            direction="column"
            align="center"
            justify="center"
            padding="40px"
            boxShadow="0px 4px 16px 0px rgba(31, 43, 77, 0.15)"
          >
            <div className="title">
              <span>{intl.formatMessage({ id: 'nft.create.modal.type.title' })}</span>
              <img
                src={CloseIcon}
                width="24px"
                alt=""
                onClick={() => {
                  toggleTypeModal();
                }}
              />
            </div>
            <Spacer size="md" />
            <div className="item-container">
              <span className="sub-title">
                {intl.formatMessage({ id: 'nft.create.modal.type.label' })}
              </span>
              <Dropdown
                trigger="click"
                overlayStyle={{
                  width: '140px',
                  minWidth: '140px',
                }}
                overlay={
                  <StyledTypeMenu mode="inline">
                    <MenuItem
                      key="normal"
                      onClick={() => {
                        setShowType('normal');
                        setPropertyName('');
                        setPropertyVal('');
                      }}
                    >
                      <img src={typeIconMap['normal']} width="24px" alt="" />
                      <Spacer size="sm" />
                      {intl.formatMessage({ id: 'nft.create.modal.type.normal' })}
                    </MenuItem>
                    <MenuItem
                      key="number"
                      onClick={() => {
                        setShowType('number');
                        setPropertyName('');
                        setPropertyVal('');
                      }}
                    >
                      <img src={typeIconMap['number']} width="24px" alt="" />
                      <Spacer size="sm" />
                      {intl.formatMessage({ id: 'nft.create.modal.type.number' })}
                    </MenuItem>
                    <MenuItem
                      key="date"
                      onClick={() => {
                        setShowType('date');
                        setPropertyName('');
                        setPropertyVal(new Date());
                      }}
                    >
                      <img src={typeIconMap['date']} width="24px" alt="" />
                      <Spacer size="sm" />
                      {intl.formatMessage({ id: 'nft.create.modal.type.date' })}
                    </MenuItem>
                  </StyledTypeMenu>
                }
                placement="bottomRight"
                onVisibleChange={(showType: boolean) => {
                  setVisible(showType);
                }}
              >
                <div className="dropdown">
                  <span>{showTypeMap[showType]}</span>
                  <img width="18px" src={visible ? ArrowUp : ArrowDown} alt="" />
                </div>
              </Dropdown>
            </div>
            <Spacer size="md" />
            <div className="item-container">
              <span className="sub-title">
                {intl.formatMessage({ id: 'nft.create.modal.type.property' })}
              </span>
              <Input
                type="text"
                onChange={(event) => {
                  const inputVal = event.currentTarget.value;
                  if (inputVal && inputVal?.length > 50) {
                    setPropertyName(inputVal?.slice(0, 50));
                  } else {
                    setPropertyName(inputVal);
                  }
                }}
                placeholder={intl.formatMessage({
                  id: 'nft.create.modal.type.property.placeholder',
                })}
                value={propertyName}
                padding="0"
                variant="inline"
                background="transparent"
                endAdornment={
                  <StyledEndAdornment>{propertyName?.length || 0}/50</StyledEndAdornment>
                }
              />
            </div>
            <Spacer size="md" />
            <div className="item-container">
              <span className="sub-title">
                {intl.formatMessage({ id: 'nft.create.modal.type.property.value' })}
              </span>
              {showType === 'date' ? (
                <StyledDateTimePicker>
                  <DateTimePicker
                    onChange={(value: any) => {
                      setPropertyVal(value);
                    }}
                    value={propertyVal}
                    format="y-MM-dd HH:mm:ss"
                  />
                </StyledDateTimePicker>
              ) : (
                <Input
                  type={showType === 'number' ? 'number' : 'text'}
                  onChange={(event) => {
                    const inputVal = event.currentTarget.value;
                    if (inputVal && inputVal?.length > 100) {
                      setPropertyVal(inputVal?.slice(0, 100));
                    } else {
                      setPropertyVal(inputVal);
                    }
                  }}
                  placeholder={intl.formatMessage({
                    id: 'nft.create.modal.type.property.value.placeholder',
                  })}
                  value={propertyVal}
                  padding="0"
                  variant="inline"
                  background="transparent"
                  endAdornment={
                    <StyledEndAdornment>{propertyVal?.length || 0}/100</StyledEndAdornment>
                  }
                />
              )}
            </div>
            <Spacer size="md" />
            <StyledCheckbox
              onClick={() => {
                setAutoNext(!autoNext);
              }}
            >
              <Checkbox
                checked={autoNext}
                name="my-checkbox"
                onChange={(e: any) => {
                  setAutoNext(e.target.checked);
                }}
              />
              <Spacer size="sm" />
              <span>{intl.formatMessage({ id: 'nft.card.form.property.checkbox' })}</span>
            </StyledCheckbox>
            <Spacer size="md" />
            <Button
              disabled={!propertyName || !propertyVal}
              size="md"
              text="确认"
              variant="primary"
              onClick={() => {
                // const [attributes, setAttributes] = useState<Array<{
                // display_type: string;
                // trait_type: string;
                // value: string;
                // }>>()

                const newAttributes = [
                  ...attributes,
                  {
                    display_type: showType === 'normal' ? '' : showType,
                    trait_type: propertyName,
                    value: showType === 'date' ? moment(propertyVal).valueOf() : propertyVal,
                  },
                ];
                setAttributes(newAttributes?.slice(0, 50));
                if (autoNext) {
                  setPropertyName('');
                  setPropertyVal(showType === 'date' ? new Date() : '');
                } else {
                  toggleTypeModal();
                }
              }}
            />
          </Container>
        </StyledModal>
      </Page>
    );
  }

  return (
    <Page page="nftCard">
      <Container
        flex
        direction="column"
        align="left"
        justify="center"
        maxWidth={maxWidth}
        padding="0 80px"
        overflow="hidden"
      >
        {<Spacer size="lg" />}
        <Spacer size="md" />
        <StyledTitle>{intl.formatMessage({ id: 'nft.card.title' })}</StyledTitle>
        {<Spacer size="lg" />}
        <StyledSubTitle>{intl.formatMessage({ id: 'nft.card.content' })}</StyledSubTitle>
      </Container>
      <Spacer size="lg" />
      <Container
        flex
        direction="column"
        align="center"
        justify="center"
        padding="64px 80px"
        maxWidth={maxWidth}
        background="#fff"
      >
        <StyledContentTitle>
          {intl.formatMessage({ id: 'nft.card.form.title1' })}
        </StyledContentTitle>
        <Spacer size="md" />

        <StyledUpload>
          <StyledImage>
            <div className="inner">
              {isUploading ? (
                <Circle
                  percent={[percent, 100]}
                  strokeWidth={8}
                  strokeLinecap="round"
                  strokeColor={[color.primary.main, '#F3F3F3']}
                />
              ) : (
                <>
                  {ipfsImageUrl.type === 'img' && (
                    <img
                      src={
                        ipfsImageUrl.src && ipfsImageUrl.src?.toLowerCase().includes('.svg')
                          ? ipfsImageUrl.src
                          : ipfsImageUrl.src
                          ? `${ipfsImageUrl.src}${ossSizeMap[184]}`
                          : DefaultImgIcon
                      }
                      alt=""
                    />
                  )}
                  {ipfsImageUrl.type === 'video' && (
                    <video
                      src={ipfsImageUrl.src}
                      controls
                      poster={`${ipfsImageUrl.src}?x-oss-process=video/snapshot,t_7000,f_jpg,m_fast`}
                    ></video>
                  )}
                </>
              )}
            </div>
          </StyledImage>
          {ipfsImageUrl.src && (
            <img
              className="delete"
              src={DeleteIcon}
              width="24px"
              alt=""
              onClick={() => {
                setIpfsImageUrl({
                  type: 'img',
                  src: '',
                });
              }}
            />
          )}
          <div className="operation">
            <Spacer size="lg" />
            <div className="button">{intl.formatMessage({ id: 'nft.card.form.upload' })}</div>
            <Spacer size="lg" />
            <Upload {...uploadProps}>
              <Button
                onClick={() => {
                  if (!account) {
                    Toast(
                      ToastType.WARNING,
                      intl.formatMessage({ id: 'modal.warning.connect.wallet' }),
                    );
                    connectWallet();
                  }
                }}
                size={'md'}
                variant="secondary"
                disabled={percent > 0 && percent < 100}
                loading={percent > 0 && percent < 100}
                text={intl.formatMessage({ id: 'nft.card.form.button.add' })}
              />
            </Upload>
          </div>
          <Spacer size="md" />
        </StyledUpload>
        <Spacer size="lg" />
        <StyledContentSubTitle>
          {intl.formatMessage({ id: 'nft.card.form.select.type' })}
        </StyledContentSubTitle>
        <Spacer size="md" />
        <StyledGroup>
          {nftPlatforms.map((item, index) => (
            <div
              key={item.contractAddress}
              className={`card ${item.contractAddress === contractAddress ? 'active' : ''}`}
              onClick={() => {
                setType(item.schemaName);
                setContractAddress(item.contractAddress);
                setCategory('');
              }}
            >
              <img src={LogoSM} width="48px" alt="" />
              <Spacer size="sm" />
              <div className="comments">
                <span>{item.collectionSlug}</span>
                <span>{item.schemaName}</span>
              </div>
            </div>
          ))}
          <Spacer size="md" />
          <div className="more">
            {intl.formatMessage({ id: 'nft.card.form.select.type.more' })}
          </div>
        </StyledGroup>
        <Spacer size="lg" />
        {isTokenIdAutoIncrement === 'N' ? (
          <>
            <StyledContentSubTitle>
              {intl.formatMessage({ id: 'nft.card.form.token.id' })}
            </StyledContentSubTitle>
            <Spacer size="sm" />
            <Input
              width="100%"
              onChange={(event) => {
                const inputVal = event.currentTarget.value;
                if (inputVal && !Number.isInteger(Number(inputVal))) {
                  setTokenId('');
                } else {
                  setTokenId(inputVal);
                }
              }}
              placeholder={intl.formatMessage({ id: 'nft.card.form.token.id.placeholder' })}
              value={tokenId}
              padding="0"
              variant="inline"
              background="transparent"
            />
            <Spacer size="lg" />
          </>
        ) : (
          ''
        )}
        <StyledContentSubTitle>
          {intl.formatMessage({ id: 'nft.card.form.name' })}
        </StyledContentSubTitle>
        <Spacer size="sm" />
        <Input
          width="100%"
          type="text"
          onChange={(event) => {
            const inputVal = event.currentTarget.value;
            if (inputVal && inputVal?.length > 50) {
              setName(inputVal?.slice(0, 50));
            } else {
              setName(inputVal);
            }
          }}
          placeholder={intl.formatMessage({ id: 'nft.card.form.name.placeholder' })}
          value={name}
          padding="0"
          variant="inline"
          background="transparent"
          endAdornment={`${name?.length || 0}/50`}
        />
        {type === schemaMap.ERC1155 && (
          <>
            <Spacer size="lg" />
            <StyledContentSubTitle>
              {intl.formatMessage({ id: 'nft.card.form.count' })}
            </StyledContentSubTitle>
            <Spacer size="sm" />
            <Input
              width="100%"
              onChange={(event) => {
                const inputVal = event.currentTarget.value;
                if (inputVal && inputVal.includes('.')) {
                  setCount('');
                } else if (inputVal && !Number.isInteger(Number(inputVal))) {
                  setCount('');
                } else if (inputVal && Number(inputVal) > ERC1155MAXCOUNT) {
                  setCount(`${ERC1155MAXCOUNT}`);
                } else {
                  setCount(inputVal);
                }
              }}
              placeholder={intl.formatMessage({ id: 'nft.card.form.count.placeholder' })}
              value={count}
              padding="0"
              variant="inline"
              background="transparent"
            />
          </>
        )}
        <Spacer size="lg" />
        <StyledContentSubTitle>
          {intl.formatMessage({ id: 'nft.card.form.type' })}
        </StyledContentSubTitle>
        <Spacer size="sm" />
        <Dropdown
          overlayStyle={
            categorys?.filter((item) => categoryTypeObj.includes(item.langCode))?.length > 0
              ? {
                  width: '220px',
                  height: '246px',
                  minWidth: '220px',
                  maxHeight: '246px',
                  overflow: 'auto',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }
              : {
                  display: 'none',
                }
          }
          align={{ targetOffset: [0, 12] }}
          overlay={categorysMenu}
          placement="topRight"
          onVisibleChange={(visible) => {
            setSymbolVisible(visible);
          }}
        >
          <StyledSelect selected={category ? true : false}>
            {category || intl.formatMessage({ id: 'nft.card.form.type.placeholder' })}
            <img width="20px" src={symbolVisible ? ArrowUpIcon : ArrowDownIcon} alt="" />
          </StyledSelect>
        </Dropdown>
        <Spacer size="lg" />
        <StyledCollapse
          accordion={accordion}
          onChange={() => {
            setAccordion(!accordion);
          }}
          expandIcon={() => (
            <img src={accordion ? ArrowUpIcon : ArrowDownIcon} width="20px" alt="" />
          )}
        >
          <Panel
            header={
              <StyledContentTitle>
                {intl.formatMessage({ id: 'nft.card.form.title2' })}
                <Spacer size="sm" />
                <span className="comments">
                  {intl.formatMessage({ id: 'nft.card.form.title2.comments' })}
                </span>
              </StyledContentTitle>
            }
            headerClass="my-header-class"
          >
            <>
              <StyledContentSubTitle>
                {intl.formatMessage({ id: 'nft.card.form.comments' })}
              </StyledContentSubTitle>
              <Spacer size="sm" />
              <Input
                width="100%"
                type="text"
                onChange={(event) => {
                  const inputVal = event.currentTarget.value;
                  if (inputVal && inputVal?.length > 200) {
                    setComments(inputVal?.slice(0, 200));
                  } else {
                    setComments(inputVal);
                  }
                }}
                placeholder={intl.formatMessage({ id: 'nft.card.form.comments.placeholder' })}
                value={comments}
                padding="0"
                variant="inline"
                background="transparent"
                endAdornment={`${comments?.length || 0}/200`}
              />
              <Spacer size="md" />
              <StyledContentSubTitle>
                {intl.formatMessage({ id: 'nft.card.form.link' })}
              </StyledContentSubTitle>
              <Spacer size="sm" />
              <Input
                width="100%"
                type="text"
                onChange={(event) => {
                  const inputVal = event.currentTarget.value;
                  if (inputVal && inputVal?.length > 300) {
                    setLink(inputVal?.slice(0, 300));
                  } else {
                    setLink(inputVal);
                  }
                }}
                placeholder={intl.formatMessage({ id: 'nft.card.form.link.placeholder' })}
                value={link}
                padding="0"
                variant="inline"
                background="transparent"
                endAdornment={`${link?.length || 0}/300`}
              />
              <Spacer size="md" />
              <StyledContentSubTitle>
                {intl.formatMessage({ id: 'nft.card.form.property' })}
                {ipfsImageUrl && attributes?.length <= 50 && (
                  <span
                    className="property"
                    onClick={() => {
                      toggleTypeModal();
                    }}
                  >
                    {intl.formatMessage({ id: 'nft.card.form.property.add' })}
                  </span>
                )}
              </StyledContentSubTitle>
              <Spacer size="md" />
              <StyledAttribute>
                {attributes.map((item, index) => (
                  <div className="item" key={`type-${item.display_type}-${index}`}>
                    <div className="detail">
                      <img
                        src={typeIconMap[item.display_type || 'normal']}
                        width="18px"
                        alt=""
                      />
                      <Spacer size="md" />
                      <Dropdown
                        align={{ targetOffset: [0, 12] }}
                        placement="topCenter"
                        overlayStyle={{
                          width: '320px',
                          minWidth: '320px',
                        }}
                        overlay={<StyledPopover>{item.trait_type}</StyledPopover>}
                      >
                        <span>{item.trait_type}</span>
                      </Dropdown>
                      <Spacer size="md" />
                      {item.display_type === 'date' ? (
                        <span>{moment(item.value).format('YYYY-MM-DD HH:mm:ss')}</span>
                      ) : (
                        <Dropdown
                          align={{ targetOffset: [0, 12] }}
                          placement="topCenter"
                          overlayStyle={{
                            width: '320px',
                            minWidth: '320px',
                          }}
                          overlay={<StyledPopover>{item.value}</StyledPopover>}
                        >
                          <span>{item.value}</span>
                        </Dropdown>
                      )}
                    </div>
                    <img
                      onClick={() => {
                        setAttributes(attributes.filter((_, newIdx) => newIdx !== index));
                      }}
                      src={DeleteIcon}
                      width="18px"
                      alt=""
                    />
                  </div>
                ))}
              </StyledAttribute>
            </>
          </Panel>
        </StyledCollapse>
        <Spacer size="lg" />
        <StyleMintButton>
          <Button
            onClick={handleMint}
            disabled={
              type === schemaMap.ERC1155
                ? !count ||
                  !ipfsImageUrl.src ||
                  !name ||
                  !contractAddress ||
                  !category ||
                  (percent > 0 && percent < 100)
                : !ipfsImageUrl.src || !name || !category || (percent > 0 && percent < 100)
            }
            size={'lg'}
            variant="primary"
            text={intl.formatMessage({ id: 'nft.card.form.mint.button' })}
          />
        </StyleMintButton>
      </Container>
      <Spacer size="lg" />
      <StyledModal
        isOpen={typeModal}
        onBackgroundClick={() => {
          toggleTypeModal();
        }}
        onEscapeKeydown={() => {
          toggleTypeModal();
        }}
      >
        <Container
          flex
          direction="column"
          align="center"
          justify="center"
          padding="40px"
          boxShadow="0px 4px 16px 0px rgba(31, 43, 77, 0.15)"
        >
          <div className="title">
            <span>{intl.formatMessage({ id: 'nft.create.modal.type.title' })}</span>
            <img
              src={CloseIcon}
              width="24px"
              alt=""
              onClick={() => {
                toggleTypeModal();
              }}
            />
          </div>
          <Spacer size="md" />
          <div className="item-container">
            <span className="sub-title">
              {intl.formatMessage({ id: 'nft.create.modal.type.label' })}
            </span>
            <Dropdown
              trigger={isMobile ? 'click' : 'hover'}
              overlayStyle={{
                width: '140px',
                minWidth: '140px',
              }}
              overlay={
                <StyledTypeMenu mode="inline">
                  <MenuItem
                    key="normal"
                    onClick={() => {
                      setShowType('normal');
                      setPropertyName('');
                      setPropertyVal('');
                    }}
                  >
                    <img src={typeIconMap['normal']} width="24px" alt="" />
                    <Spacer size="sm" />
                    {intl.formatMessage({ id: 'nft.create.modal.type.normal' })}
                  </MenuItem>
                  <MenuItem
                    key="number"
                    onClick={() => {
                      setShowType('number');
                      setPropertyName('');
                      setPropertyVal('');
                    }}
                  >
                    <img src={typeIconMap['number']} width="24px" alt="" />
                    <Spacer size="sm" />
                    {intl.formatMessage({ id: 'nft.create.modal.type.number' })}
                  </MenuItem>
                  <MenuItem
                    key="date"
                    onClick={() => {
                      setShowType('date');
                      setPropertyName('');
                      setPropertyVal(new Date());
                    }}
                  >
                    <img src={typeIconMap['date']} width="24px" alt="" />
                    <Spacer size="sm" />
                    {intl.formatMessage({ id: 'nft.create.modal.type.date' })}
                  </MenuItem>
                </StyledTypeMenu>
              }
              placement="bottomRight"
              onVisibleChange={(showType: boolean) => {
                setVisible(showType);
              }}
            >
              <div className="dropdown">
                <span>{showTypeMap[showType]}</span>
                <img width="18px" src={visible ? ArrowUp : ArrowDown} alt="" />
              </div>
            </Dropdown>
          </div>
          <Spacer size="md" />
          <div className="item-container">
            <span className="sub-title">
              {intl.formatMessage({ id: 'nft.create.modal.type.property' })}
            </span>
            <Input
              type="text"
              onChange={(event) => {
                const inputVal = event.currentTarget.value;
                if (inputVal && inputVal?.length > 50) {
                  setPropertyName(inputVal?.slice(0, 50));
                } else {
                  setPropertyName(inputVal);
                }
              }}
              placeholder={intl.formatMessage({
                id: 'nft.create.modal.type.property.placeholder',
              })}
              value={propertyName}
              padding="0"
              variant="inline"
              background="transparent"
              endAdornment={
                <StyledEndAdornment>{propertyName?.length || 0}/50</StyledEndAdornment>
              }
            />
          </div>
          <Spacer size="md" />
          <div className="item-container">
            <span className="sub-title">
              {intl.formatMessage({ id: 'nft.create.modal.type.property.value' })}
            </span>
            {showType === 'date' ? (
              <StyledDateTimePicker>
                <DateTimePicker
                  onChange={(value: any) => {
                    setPropertyVal(value);
                  }}
                  value={propertyVal}
                  format="y-MM-dd HH:mm:ss"
                />
              </StyledDateTimePicker>
            ) : (
              <Input
                type={showType === 'number' ? 'number' : 'text'}
                onChange={(event) => {
                  const inputVal = event.currentTarget.value;
                  if (inputVal && inputVal?.length > 100) {
                    setPropertyVal(inputVal?.slice(0, 100));
                  } else {
                    setPropertyVal(inputVal);
                  }
                }}
                placeholder={intl.formatMessage({
                  id: 'nft.create.modal.type.property.value.placeholder',
                })}
                value={propertyVal}
                padding="0"
                variant="inline"
                background="transparent"
                endAdornment={
                  <StyledEndAdornment>{propertyVal?.length || 0}/100</StyledEndAdornment>
                }
              />
            )}
          </div>
          <Spacer size="md" />
          <StyledCheckbox
            onClick={() => {
              setAutoNext(!autoNext);
            }}
          >
            <Checkbox
              checked={autoNext}
              name="my-checkbox"
              onChange={(e: any) => {
                setAutoNext(e.target.checked);
              }}
            />
            <Spacer size="sm" />
            <span>{intl.formatMessage({ id: 'nft.card.form.property.checkbox' })}</span>
          </StyledCheckbox>
          <Spacer size="md" />
          <Button
            disabled={!propertyName || !propertyVal}
            size="md"
            text="确认"
            variant="primary"
            onClick={() => {
              // const [attributes, setAttributes] = useState<Array<{
              // display_type: string;
              // trait_type: string;
              // value: string;
              // }>>()

              const newAttributes = [
                ...attributes,
                {
                  display_type: showType === 'normal' ? '' : showType,
                  trait_type: propertyName,
                  value: showType === 'date' ? moment(propertyVal).valueOf() : propertyVal,
                },
              ];
              setAttributes(newAttributes?.slice(0, 50));
              if (autoNext) {
                setPropertyName('');
                setPropertyVal(showType === 'date' ? new Date() : '');
              } else {
                toggleTypeModal();
              }
            }}
          />
        </Container>
      </StyledModal>
    </Page>
  );
};

const StyledCategoryMenu = styled(Menu)`
  border: none;
`;

const StyledUploadImage = styled.div`
  background: url(${(props: { img: string }) => props.img});
  background-size: cover;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-repeat: round;
`;

const StyledPopover = styled.div`
  display: flex;
  border-radius: 8px;
  background: #eee;
  padding: 8px;
  font-size: 14px;
  color: #000;
  text-align: center;
`;

const StyledEndAdornment = styled.span`
  padding: 0 4px;
  margin-top: -4px;
`;

const StyledCheckbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .rc-checkbox-inner {
    width: 24px !important;
    height: 24px !important;
  }
  .rc-checkbox-checked .rc-checkbox-inner {
    border-color: #0079ff !important;
    background-color: #0079ff !important;
  }
  .rc-checkbox-inner:after {
    left: 8px !important;
    top: 4px !important;
  }
  span {
    cursor: pointer;
  }
`;

const StyledDateTimePicker = styled.div`
  width: 100%;
  border-bottom: 1px solid #eee;
  padding: 8px 0;
  .react-datetime-picker__wrapper {
    border: none;
  }
  .react-calendar__tile--now {
    background: #eee !important;
  }
  .react-calendar__tile--active {
    background: ${(props) => props.theme.color.primary.main} !important;
  }
`;

const StyledTypeMenu = styled(Menu)`
  .rc-dropdown-menu-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding-left: 0 !important;
  }
`;

const StyledAttribute = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 600px) {
    width: 100%;
  }
  .item {
    margin-top: 16px;
    flex-basis: 48%;
    width: 48%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    @media (max-width: 600px) {
      width: 98%;
      flex-basis: 98%;
    }
    .detail {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 98%;
      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 45%;
        display: inline-block;
      }
    }
    img {
      cursor: pointer;
    }
  }
`;

const StyleMintButton = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    width: 280px;
    min-width: 280px;
  }
`;

const StyledCollapse = styled(Collapse)`
  width: 100%;
  border: none;
  background-color: transparent;
  .rc-collapse-header {
    position: relative !important;
    padding: 0 !important;
  }
  .rc-collapse-header img {
    right: 0 !important;
    position: absolute !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
  }
  .rc-collapse-content {
    padding: 0 !important;
  }
`;

const StyledModal = Modal.styled`
  width: 480px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 8px;
  @media (max-width: 600px) {
    width: 90%;
  }
  .title {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    span {
      font-size: 24px;
      font-family: 'Noto Sans SC', sans-serif;
      font-weight: 600;
      color: #000000;
      line-height: 33px;
    }
    img {
      cursor: pointer;
    }
  }
  .item-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .sub-title {
      font-size: 16px;
      font-family: 'Noto Sans SC', sans-serif;
      font-weight: 500;
      color: #000000;
      line-height: 22px;
      min-width: 80px;
    }
  }
  .dropdown {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
    span {
      padding: 10px 0;
      width: 100%;
    }
  }
`;

const StyledGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  .card {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    border-radius: 12px;
    padding: 24px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
    margin-right: 24px;
    @media (max-width: 600px) {
      width: 152px;
      height: 168px;
      border-radius: 12px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
  .active {
    border: 2px solid #0079ff;
  }
  .comments {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    span:last-child {
      color: rgba(0, 0, 0, 0.4);
    }
  }
  .more {
    font-size: 14px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 500;
    color: #000000;
    line-height: 20px;
    @media (max-width: 600px) {
      font-size: 14px;
      font-weight: 500;
      color: #000000;
      line-height: 20px;
    }
  }
`;

const StyledUpload = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  @media (max-width: 600px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .operation {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    @media (max-width: 600px) {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    button {
      @media (max-width: 600px) {
        font-size: 13px;
        font-weight: 500;
      }
    }
  }

  .delete {
    @media (max-width: 600px) {
      width: 32px;
      height: 32px;
      // background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 66px;
      right: 56px;
    }
    cursor: pointer;
  }
`;

const StyledImage = styled.div`
  width: 232px;
  height: 232px;
  border-radius: 12px;
  /* opacity: 0.1; */
  border: 2px dashed rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 600px) {
    width: 240px;
    height: 240px;
    position: relative;
    .delete {
      position: absolute;
      top: -16px;
      right: -16px;
    }
  }
  .inner {
    width: 184px;
    height: 184px;
    background: #f3f3f3;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      max-width: 100%;
      max-height: 100%;
      border-radius: 8px;
    }
    video {
      max-width: 100%;
      max-height: 100%;
      cursor: pointer;
      object-fit: cover;
      border-radius: 8px;
      width: 100%;
      height: 100%;
    }
    svg {
      width: 60%;
      height: 60%;
    }
    .percent {
      color: ${(props) => props.theme.color.primary.main};
      font-size: 36px;
      font-weight: bold;
    }
  }
`;

const StyledButton = styled.div`
  background: linear-gradient(90deg, #0079ff 0%, #00f364 100%);
  border-radius: 27px;
  font-size: 18px;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 600;
  color: #ffffff;
  line-height: 25px;
  padding: 16px 104px;
  cursor: pointer;
`;

const StyledInputComments = styled.div`
  width: 100%;
  text-align: left;
  font-size: 14px;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 400;
  color: #000000;
  line-height: 20px;
`;

const StyledEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledAddNFT = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  .title {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .comments {
    font-size: 16px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 400;
    color: #000000;
    line-height: 28px;
    .amount {
      color: ${(props) => props.theme.color.primary.main};
    }
  }
`;

const StyledSelect = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  color: ${(props: { selected?: boolean }) => (props.selected ? '#000' : '#999')};
`;

const StyledTitle = styled.div`
  font-size: 40px;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 600;
  color: #ffffff;
  line-height: 56px;
  @media (max-width: 600px) {
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
    line-height: 36px;
  }
`;

const StyledSubTitle = styled.div`
  font-size: 16px;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  line-height: 22px;
  @media (max-width: 600px) {
    font-size: 13px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.8);
    line-height: 19px;
  }
`;

const StyledContentTitle = styled.div`
  width: 100%;
  font-size: 24px;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 600;
  color: #000000;
  line-height: 33px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  .comments {
    font-size: 16px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 400;
    color: #000000;
    line-height: 22px;
  }
`;

const StyledContentSubTitle = styled.div`
  width: 100%;
  text-align: left;
  font-size: 20px;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 500;
  color: #000000;
  line-height: 28px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .property {
    font-size: 16px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 600;
    color: #0079ff;
    line-height: 22px;
    cursor: pointer;
  }
`;

export default NFTCard;
