import React, { useState, useContext, useEffect } from 'react';
import Spacer from '@components/Spacer';
import { useIntl } from 'react-intl';
import styled, { keyframes, ThemeContext } from 'styled-components';
import { Context } from '@contexts/provider';
import Promore from '@assets/img/pro-more.png';
import OfficialIcon from '@assets/img/channel/official.png';
import WechatIcon from '@assets/img/channel/wechat.png';
import TelegramIcon from '@assets/img/channel/telegram2.png';
import TwitterIcon from '@assets/img/channel/twitter2.png';
import MediumIcon from '@assets/img/channel/medium2.png';
import GithubIcon from '@assets/img/channel/gitHub2.png';
import WikiIcon from '@assets/img/channel/wiki.png';
import FacebookIcon from '@assets/img/channel/fowter.png';
import LinkedinIcon from '@assets/img/channel/linkedIn2.png';
import DiscardIcon from '@assets/img/channel/discard.png';
import WeiboIcon from '@assets/img/channel/weibo2.png';
import useCollection from '@hooks/useCollection';
import { useRouteMatch } from 'react-router-dom';
import Dropdown from 'rc-dropdown';
import Menu, { Item as MenuItem } from 'rc-menu';
import { useHistory } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import useMedia from 'use-media';

const UserDetail: React.FC = () => {
  const intl = useIntl();
  const { maxWidth } = useContext(ThemeContext);
  const { toggleLoading } = useContext(Context);
  const history = useHistory();
  const isMobile = useMedia({ maxWidth: '600px' });
  const match: {
    params: {
      projectId: string;
    };
  } = useRouteMatch();

  const { projectId } = match.params;
  const fetchProjectDetail = useCollection(projectId);
  const [projectDetail, setProjectDetail] = useState({
    backgroundImageUrl: '',
    boxCount: '',
    description: '',
    externalLink: '',
    favoriteCount: '',
    hidden: '',
    imageUrl: '',
    name: '',
    nftCount: '',
    nftOwnerCount: '',
    nftTradeCount: '',
    ownerAddress: '',
    slug: '',
    socialChannel: '',
    tradeCount: '',
  });
  const fetchProjectDetailData = async () => {
    const projectDetailData = await fetchProjectDetail();
    setProjectDetail(projectDetailData);
  };
  //菜单图片转数组  projectDetail.socialChannel
  let socialChannels = [];
  try {
    socialChannels = JSON.parse(projectDetail?.socialChannel);
  } catch (e) {
    //console.error('failed to get socialChannels');
  }
  // 1.引用图片
  // 2.创建一个Object 用数据里面的name做key，  如src={ChannelIconMap[item.name]
  // obj{weibo(接口的name字段): weiboIcon(引用的图片名称)}
  // 3. 拿到数据后循环， Object[name] 就是weiboIcon   然后window.open（url）

  const ChannelIconMap: { [key: string]: string } = {
    weibo: WeiboIcon,
    discard: DiscardIcon,
    linkedIn: LinkedinIcon,
    wiki: WikiIcon,
    facebook: FacebookIcon,
    gitHub: GithubIcon,
    medium: MediumIcon,
    twitter: TwitterIcon,
    telegram: TelegramIcon,
    wechat: WechatIcon,
    official: OfficialIcon,
  };

  //npm dropdown组件
  const ProMenus = (
    <StyledSymbolMenu mode="inline">
      <MenuItem key="menus_link">
        {socialChannels.map((item: any) => (
          <img
            key={item.url}
            className="avatar"
            src={ChannelIconMap[item.name]}
            width="20"
            height="20"
            alt=""
            onClick={() => {
              window.open(item.url);
            }}
          />
        ))}
      </MenuItem>
    </StyledSymbolMenu>
  );
  useEffect(() => {
    fetchProjectDetailData();
  }, []);

  const [showMore, setShowMore] = useState(false);
  // console.log('projectDetail',projectDetail);
  return (
    <>
      <ProjectHeader>
        <div className="bannerimg">
          {projectDetail.backgroundImageUrl && (
            <img src={projectDetail.backgroundImageUrl} alt="" width="100%" />
          )}
        </div>
        <div className="avatar-container">
          <div className="shadow">
            {projectDetail.imageUrl && (
              <img
                className="avatar"
                src={projectDetail.imageUrl}
                width="120"
                height="120"
                alt=""
              />
            )}
          </div>
        </div>
      </ProjectHeader>
      <Spacer size="sm" />
      <Spacer size="sm" />
      <ProjectTitle>
        <div className="proName">{projectDetail.name || <Skeleton />}</div>
        {projectDetail.name ? (
          isMobile ? (
            <img
              onClick={() => {
                setShowMore(!showMore);
              }}
              className="avatar mobile-icon"
              src={Promore}
              width="20"
              height="20"
              alt=""
            />
          ) : (
            <StyledMoreButton overlay={ProMenus} placement="bottomLeft">
              <StyledCreateImg>
                <img className="avatar" src={Promore} width="38" height="38" alt="" />
              </StyledCreateImg>
            </StyledMoreButton>
          )
        ) : (
          ''
        )}
      </ProjectTitle>
      {showMore && (
        <StyledChannelPop
          onClick={() => {
            setShowMore(!showMore);
          }}
        >
          <StyledChannels
            show={showMore}
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
          >
            {socialChannels.map((item: any) => (
              <img
                key={item.url}
                className="avatar"
                src={ChannelIconMap[item.name]}
                width="40px"
                height="40px"
                alt=""
                onClick={() => {
                  window.open(item.url);
                }}
              />
            ))}
          </StyledChannels>
        </StyledChannelPop>
      )}
    </>
  );
};

const fadeInUpBig = keyframes`
  0%{opacity:0;
  -webkit-transform:translateY(2000px)}
  100%{opacity:1;
  -webkit-transform:translateY(0)}
`;

const fadeOutDownBig = keyframes`
  0%{opacity:0;
  -webkit-transform:translateY(0)}
  100%{opacity:1;
  -webkit-transform:translateY(-2000px)}
`;

const StyledChannelPop = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 99;
`;

const StyledChannels = styled.div`
  animation: ${(props: { show: boolean }) => (props.show ? fadeInUpBig : fadeOutDownBig)} 0.2s
    ease both;
  width: 100%;
  // height: 220px;
  position: absolute;
  bottom: 32px;
  padding: 32px;
  z-index: 2;
  background: #ffffff;
  border-radius: 20px 20px 0px 0px;
  img {
    background: #000;
    border-radius: 50%;
    margin: 8px;
  }
`;

const StyledMoreButton = styled(Dropdown)`
  position: absolute;
  right: -60px;
  top: 50%;
  transform: translateY(-50%);
  height: 38px;
  @media (max-width: 600px) {
    right: -30px;
    height: 20px;
    img {
      width: 20px;
      height: 20px;
    }
  }
`;
const ProjectHeader = styled.div`
  .bannerimg {
    @media (max-width: 600px) {
      width: 100%;
      height: 72px;
    }
    img {
      @media (max-width: 600px) {
        width: 100%;
        height: 100%;
      }
    }
  }
  .avatar-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    @media (max-width: 600px) {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .shadow {
      position: relative;
      width: 130px;
      height: 130px;
      margin-top: -60px;
      border-radius: 50%;
      background: #ffffff;
      text-align: center;
      vertical-align: middle;
      @media (max-width: 600px) {
        position: relative;
        width: 50px;
        height: 50px;
        margin-top: -30px;
        border-radius: 50%;
        background: #ffffff;
        text-align: center;
        vertical-align: middle;
      }
      .avatar {
        text-align: center;
        vertical-align: middle;
        width: 120px;
        height: 120px;
        display: block;
        border-radius: 50%;
        position: absolute;
        left: 5px;
        top: 5px;
        margin: 0 auto;
        @media (max-width: 600px) {
          text-align: center;
          vertical-align: middle;
          width: 40px;
          height: 40px;
          display: block;
          border-radius: 50%;
          position: absolute;
          left: 5px;
          top: 5px;
          margin: 0 auto;
        }
      }
    }
  }
`;
const StyledSymbolMenu = styled(Menu)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  /* width: 422px; */
  height: 40px;
  background: #ffffff !important;
  box-shadow: 0px 4px 16px 0px rgba(31, 43, 77, 0.15);
  border-radius: 8px;
  border: none;
  padding-right: 0px !important;
  padding-left: 0px !important;
  flex-basis: 0 !important;
  flex-grow: 1 !important;
  .rc-dropdown-menu-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    padding: 0 8px !important;
    width: 100%;
    &::after {
      display: none !important;
    }
    img {
      width: 20px;
      height: 20px;
      margin: 0 5px;
    }
    img:hover {
      width: 20px;
      height: 20px;
      background: #000000 !important;
      border-radius: 50%;
      cursor: pointer !important;
      margin: 0 5px;
    }
  }
  .rc-dropdown-menu-item-active {
    background: transparent !important;
  }
`;
const StyledCreateImg = styled(Menu)``;
const ProjectTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  .proName {
    font-size: 32px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 600;
    color: #000000;
    line-height: 38px;
    position: relative;
    @media (max-width: 600px) {
      font-size: 16px;
      font-weight: 600;
      color: #000000;
      line-height: 24px;
    }
  }
  .mobile-icon {
    position: absolute;
    right: -40px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export default UserDetail;
