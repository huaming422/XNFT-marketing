import React, { useState, useContext, useEffect } from 'react';
import Spacer from '@components/Spacer';
import { useIntl } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';
import { Context } from '@contexts/provider';
import UserNameEditIcon from '@assets/img/username-edit.png';
import CopySuccessIcon from '@assets/img/copy-success.png';
import UploadIcon from '@assets/img/upload.png';
import CopyIcon from '@assets/img/copy.png';
import CopyToClipboard from 'react-copy-to-clipboard';
import Upload from 'rc-upload';
import Skeleton from 'react-loading-skeleton';
import useOperation from '@hooks/useOperation';
import useMedia from 'use-media';
import Input from '@src/components/Input';
import { Circle } from 'rc-progress';
import DefaultAvatar from '@assets/img/boy.png';
import { EVENT, ToastType } from '@src/utils/constants';

const AvatarInfo: React.FC<{
  account?: string;
  handleChange: Function;
}> = ({ account, handleChange }) => {
  const intl = useIntl();
  const isMobile = useMedia({ maxWidth: '600px' });

  const { color } = useContext(ThemeContext);
  const { Toast, setEvent, avatar, setAvatar } = useContext(Context);
  const { fetchSaveNickname, saveUserAddress, uploadAvatarIcon, checkSensitiveWord } =
    useOperation();

  const [nickName, setNickName] = useState<string>('');
  const [savedNickName, setSavedNickName] = useState<string>('');

  const [editNickNameFlag, setEditNickNameFlag] = useState<boolean>(false);
  const [copySuccessFlag, setCopySuccessFlag] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const isUploading = progress > 0 && progress < 100;

  useEffect(() => {
    if (copySuccessFlag) {
      setTimeout(() => {
        setCopySuccessFlag(false);
      }, 3000);
    }
  }, [copySuccessFlag]);

  const fetchData = async () => {
    const userInfo = await saveUserAddress();
    const { data } = userInfo;
    const { nickname, profileImageUrl } = data || {};
    if (nickname) {
      setNickName(nickname);
      setSavedNickName(nickname);
    }
    if (profileImageUrl) {
      setAvatar(`${profileImageUrl}?timer=${Date.now()}&x-oss-process=image/resize,s_120`);
    }
  };

  useEffect(() => {
    if (account) {
      fetchData();
    }
  }, [account]);

  const handleEditNickNameInputChange = (e: any) => {
    const inputVal = e.target.value;
    if (inputVal) {
      setNickName(inputVal.slice(0, 60));
    } else {
      setNickName('');
    }
  };

  const handleCopyUserKeyClick = () => {
    setCopySuccessFlag(true);
  };

  const fetchSaveNickName = async () => {
    try {
      if (nickName && nickName !== savedNickName) {
        const checkResult = await checkSensitiveWord(nickName);
        if (checkResult && checkResult?.data?.length > 0) {
          setNickName(savedNickName);
          return Toast(
            ToastType.WARNING,
            intl.formatMessage(
              { id: 'nft.check.sensitive' },
              { word: checkResult?.data?.toString() },
            ),
          );
        }
        const fetchResp = await fetchSaveNickname(nickName);
        if (fetchResp.code === 0) {
          setSavedNickName(nickName);
          Toast(ToastType.OK, intl.formatMessage({ id: 'common.msg.ok' }), () => {
            handleChange();
          });
        } else {
          setNickName(savedNickName);
          Toast(ToastType.WARNING, fetchResp.msg);
        }
      }
    } catch (e) {
      setNickName(savedNickName);
      Toast(ToastType.WARNING, intl.formatMessage({ id: 'common.msg.error' }));
    }
  };

  const uploadProps = {
    multiple: false,
    headers: {
      Authorization: '$prefix $token',
    },
    accept: '.JPG,.JPEG,.PNG,.GIF,.SVG',
    async customRequest({ file }) {
      try {
        setEvent(EVENT.DEFAULT);
        const fetchResp = await uploadAvatarIcon(file, (percent: number) => {
          setProgress(percent);
        });
        if (fetchResp.code === 0) {
          setAvatar(`${fetchResp?.data}?timer=${Date.now()}&x-oss-process=image/resize,s_120`);
          Toast(ToastType.OK, intl.formatMessage({ id: 'common.msg.ok' }));
        } else {
          fetchData();
          Toast(ToastType.WARNING, intl.formatMessage({ id: 'common.msg.error' }));
        }
      } catch (e) {
        fetchData();
        Toast(ToastType.WARNING, intl.formatMessage({ id: 'common.msg.error' }));
      }
    },
  };

  return (
    <>
      <AvatarInfoContainer>
        <Spacer size="lg" />
        <AvatarContainer>
          {account ? (
            <Upload {...uploadProps}>
              <div className="avatar-container">
                <StyledAvatar icon={avatar || DefaultAvatar}></StyledAvatar>
                <div className="upload-avatar">
                  <img className="upload-icon" src={UploadIcon} width="32" height="32" alt="" />
                </div>
              </div>
            </Upload>
          ) : (
            <div className="avatar-container">
              <StyledAvatar icon={avatar || DefaultAvatar}></StyledAvatar>
            </div>
          )}
          {isUploading ? (
            <div className="loading-container">
              <Circle
                percent={[progress, 100]}
                strokeWidth={8}
                strokeLinecap="round"
                strokeColor={[color.primary.main, '#F3F3F3']}
              />
            </div>
          ) : (
            ''
          )}
        </AvatarContainer>
        <Spacer size={isMobile ? 'md' : 'lg'} />
        {editNickNameFlag ? (
          <EditNicName>
            <form
              action=""
              onSubmit={(event) => {
                event.currentTarget.blur();
                event.preventDefault();
                event.stopPropagation();
                setEditNickNameFlag(false);
                fetchSaveNickName();
                if (!nickName) {
                  setNickName(savedNickName);
                }
              }}
            >
              <Input
                value={nickName}
                type="text"
                // onFocus={() => {
                //   document.addEventListener('keypress', handleEnterKey);
                // }}
                autoFocus={editNickNameFlag}
                onBlur={() => {
                  // document.removeEventListener('keypress', handleEnterKey);
                  setEditNickNameFlag(false);
                  if (!isMobile) {
                    fetchSaveNickName();
                    if (!nickName) {
                      setNickName(savedNickName);
                    }
                  }
                }}
                onChange={(e) => handleEditNickNameInputChange(e)}
              />
            </form>
          </EditNicName>
        ) : (
          <NickName>
            <div className="name">
              {nickName || intl.formatMessage({ id: 'user.detail.defaultNickName' })}
              {account && (
                <img
                  onClick={() => {
                    setEditNickNameFlag(true);
                  }}
                  className="edit-icon"
                  src={UserNameEditIcon}
                  width="32"
                  height="32"
                  alt=""
                />
              )}
            </div>
          </NickName>
        )}
        <Spacer size="md" />
        {account && account.length && (
          <UserKey>
            <span>{account?.toLowerCase() || <Skeleton />}</span>
            <CopyToClipboard text={account?.toLowerCase()} onCopy={handleCopyUserKeyClick}>
              <img className="copy-icon" src={CopyIcon} width="16" height="16" alt="" />
            </CopyToClipboard>
          </UserKey>
        )}
        {isMobile ? (
          <>
            <Spacer size="sm" />
            <Spacer size="sm" />
          </>
        ) : (
          <>
            <Spacer size="lg" />
            <Spacer size="sm" />
            <Spacer size="sm" />
          </>
        )}
        {copySuccessFlag && (
          <CopySuccess>
            <span>{intl.formatMessage({ id: 'user.detail.copySuccess' })}</span>
            <img className="success-icon" src={CopySuccessIcon} width="16" height="16" alt="" />
          </CopySuccess>
        )}
      </AvatarInfoContainer>
    </>
  );
};
const StyledAvatar = styled.div`
  width: 120px;
  height: 120px;
  background-image: url(${(props: { icon: string }) => props.icon});
  background-size: cover;
  border-radius: 50%;
  @media (max-width: 600px) {
    width: 100px;
    height: 100px;
  }
`;

const AvatarInfoContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-width: ${(props) => props.theme.maxWidth}px;
`;

const AvatarContainer = styled.div`
  position: relative;
  @media (max-width: 600px) {
    width: 100px;
    height: 100px;
  }

  .avatar-container {
    width: 120px;
    height: 120px;
    @media (max-width: 600px) {
      width: 100px;
      height: 100px;
    }
    .avatar {
      max-width: 100%;
      max-height: 100%;
      display: block;
      border-radius: 50%;
    }
  }

  .upload-avatar {
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    > p {
      color: rgba(255, 255, 255, 0.9);
    }
  }

  :hover {
    .upload-avatar {
      display: flex;
      cursor: pointer;
      align-items: center;
      justify-content: center;
    }
  }
  .loading-container {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    svg {
      width: 60px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;

const NickName = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  max-width: ${(props) => props.theme.maxWidth}px;
  .name {
    font-size: 24px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 600;
    color: #000000;
    line-height: 33px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    padding: 0 48px;
    @media (max-width: 600px) {
      max-width: 90%;
    }
    .edit-icon {
      display: block;
      cursor: pointer;
      position: absolute;
      top: 50%;
      right: 0px;
      transform: translateY(-50%);
    }
  }
`;

const EditNicName = styled.div`
  height: 33px;

  .edit-nick-name-input {
    width: 240px;
    height: 100%;
    padding: 0 5px;
    box-sizing: border-box;
    line-height: 31px;
    border: 1px solid ${(props) => props.theme.color.primary.main};
    border-radius: 2px;
  }
`;

const UserKey = styled.div`
  padding: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  > span {
    font-size: 14px;
    font-family: 'Noto Sans SC', sans-serif;
    color: #000000;
    @media (max-width: 600px) {
      font-size: 12px;
      font-weight: 400;
    }
  }

  .copy-icon {
    cursor: pointer;
    margin-left: 8px;
  }
`;

const CopySuccess = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 33px;
  background: #ffffff;
  box-shadow: 0 4px 16px 0 rgba(31, 43, 77, 0.15);
  border-radius: 8px;
  width: 90px;
  margin-left: -45px;

  > span {
    font-size: 12px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 500;
    color: #000000;
  }

  .success-icon {
    margin-left: 8px;
  }
`;

export default AvatarInfo;
