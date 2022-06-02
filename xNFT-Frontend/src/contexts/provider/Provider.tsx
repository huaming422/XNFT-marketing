import React, { createContext, useEffect, useRef, useState } from 'react';
import Loading from '@components/Loading';
import { IntlProvider } from 'react-intl';
import zhJSON from '../../lang/zh-CN';
import enJSON from '../../lang/en-US';
import { useWallet } from 'use-wallet';
import { ReadyState, SOCKET_PING_TIMER, ToastType } from '@utils/constants';
import styled, { keyframes, ThemeContext } from 'styled-components';
import Spacer from '@components/Spacer';
import LoadingIcon from '@assets/img/modalLoading.svg';
import OKIcon from '@assets/img/ok.png';
import ErrorIcon from '@assets/img/error.png';
import { toast } from 'react-toastify';
import useWebSocket from 'react-use-websocket';
import useOperation from '@hooks/useOperation';
import config from '../../config';

export interface BaseContext {
  operation: string;
  setOperation: Function;
  toggleLoading: Function;
  connectWallet: Function;
  Toast: Function;
  lang: string;
  setLang: Function;
  originChainId: number;
  onSwitchChainId: Function;
  loading: boolean;
  getWebSocket: Function;
  subscribe: Function;
  unsubscribe: Function;
  readyState: Number;
  event: string;
  setEvent: Function;
  avatar: string;
  setAvatar: Function;
}

export const Context = createContext<BaseContext>({
  operation: '',
  setOperation: null,
  Toast: (type: string) => {},
  lang: navigator?.language || 'zh',
  setLang: () => {},
  toggleLoading: () => {},
  onSwitchChainId: () => {},
  connectWallet: () => {},
  originChainId: 128,
  loading: false,
  getWebSocket: () => {},
  subscribe: () => {},
  unsubscribe: () => {},
  readyState: 0,
  event: '',
  setEvent: () => {},
  avatar: '',
  setAvatar: () => {},
});

const StyledModalCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: fixed;
  width: 400px;
  height: 280px;
  background: #ffffff;
  box-shadow: 0px 2px 26px 2px rgba(0, 0, 0, 0.24);
  border-radius: 9px;
  z-index: 1001;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .label {
    font-size: 16px;
    font-weight: 600;
    color: ${(props) => props.color};
    line-height: 22px;
    @media (max-width: 600px) {
      font-size: 12px;
    }
  }
  .comment {
    font-size: 12px;
    font-weight: 600;
    color: #a8a9b4;
    line-height: 17px;
    padding: 0 32px;
    text-align: center;
  }
  .error {
    color: #ec504f;
  }
  @media (max-width: 600px) {
    width: 70%;
    height: auto;
    padding: 24px 0;
  }
`;

const StyledModalContainer = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const StyledMessage = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  span {
    font-size: 16px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 600;
    color: #fdfdfd;
    line-height: 22px;
  }
`;

interface ProviderProps {
  originChainId: number;
  onSwitchChainId: Function;
}

const messages: any = {
  'zh-CN': zhJSON,
  'en-US': enJSON,
};

export const BaseProvider: React.FC<ProviderProps> = ({
  children,
  originChainId,
  onSwitchChainId,
}) => {
  const { account, connect } = useWallet();
  const { saveUserAddress } = useOperation();

  const [operation, setOperation] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [event, setEvent] = useState('');
  const [avatar, setAvatar] = useState('');

  const toggleLoading = (isLoading: boolean, message?: string) => {
    if (isLoading && message) {
      setLoadingMessage(message);
    } else {
      setLoadingMessage(messages[lang]['modal.fetching']);
    }
    setLoading(isLoading);
  };

  const Toast = (type?: string, message?: string, onClose?: any) => {
    // setShowModal({
    //   type,
    //   message,
    // });
    switch (type) {
      case ToastType.SENDED:
        return toast.dark(
          <StyledMessage>
            <img src={OKIcon} width="24px" alt="" />
            <Spacer size="sm" />
            <span>{messages[lang]['modal.sended']}</span>
          </StyledMessage>,
          {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            onClose: onClose,
          },
        );
      case ToastType.OK:
        return toast.dark(
          <StyledMessage>
            <img src={OKIcon} width="24px" alt="" />
            <Spacer size="sm" />
            <span>{messages[lang]['common.msg.ok']}</span>
          </StyledMessage>,
          {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            onClose: onClose,
          },
        );
      case ToastType.CANCEL:
        return toast.dark(
          <StyledMessage>
            <img src={ErrorIcon} width="24px" alt="" />
            <Spacer size="sm" />
            <span>{messages[lang]['modal.cancel']}</span>
          </StyledMessage>,
          {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            onClose: onClose,
          },
        );
      case ToastType.LOADING:
        return toast.dark(
          <StyledMessage>
            <img src={LoadingIcon} width="32px" alt="" />
            <Spacer size="sm" />
            <span>{messages[lang]['modal.loading']}</span>
          </StyledMessage>,
          {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            onClose: onClose,
          },
        );
      case ToastType.WARNING:
        return toast.dark(
          <StyledMessage>
            <img src={ErrorIcon} width="24px" alt="" />
            <Spacer size="sm" />
            <span>{message}</span>
          </StyledMessage>,
          {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            onClose: onClose,
          },
        );
      case ToastType.CLOSE:
        return toast.dismiss();
    }
  };

  const defaultLang = localStorage.getItem('language') || 'en-US';
  const [lang, setLang] = useState(defaultLang);

  const [loadingMessage, setLoadingMessage] = useState(messages[lang]['modal.fetching']);

  const timerInterval = useRef<ReturnType<typeof setInterval>>();
  const { sendMessage, readyState, getWebSocket } = useWebSocket(config.socketUrl, {
    onOpen: () => {
      console.debug('socket connected');
      timerInterval.current = setInterval(() => {
        sendMessage(JSON.stringify({ event: 'ping' }));
      }, SOCKET_PING_TIMER);
    },
    retryOnError: true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    shouldReconnect: () => true,
    onClose: () => {
      console.error('error websocket onClose');
      clearInterval(timerInterval.current);
    },
    onError: () => {
      console.error('error websocket onError');
      clearInterval(timerInterval.current);
    },
  });

  /* eslint-disable react-hooks/exhaustive-deps */
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        window.location.href = '/nowallet';
      }
      await window?.ethereum?.enable();
      await connect('injected');
      localStorage.setItem('autoConnect', 'true');
    } catch (e) {
      console.error('failed to connect wallet');
      Toast(ToastType.WARNING, messages[lang]['modal.warning.connect.wallet']);
    }
  };

  // useEffect(() => {
  //   const autoConnect = localStorage.getItem('autoConnect');
  //   if (!autoConnect) {
  //     localStorage.setItem('autoConnect', 'true');
  //   }
  //   const isNoWallet = window?.location?.pathname?.includes('nowallet');
  //   if (!account && !isNoWallet) {
  //     connectWallet();
  //   }
  // }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    window?.ethereum?.on('connect', () => {
      console.debug('connected');
      connectWallet();
    });

    window?.ethereum?.on('disconnect', () => {
      console.debug('disconnect');
      window.location.reload();
    });

    window?.ethereum?.on('accountsChanged', (accounts: Array<string>) => {
      if (originChainId && accounts && accounts.length > 0) {
        saveUserAddress();
      }
    });

    window?.ethereum?.on('networkChanged', (networkId: number) => {
      console.debug('networkChanged', networkId);
      window.location!.href = '/';
    });

    window?.ethereum?.on('chainChanged', (chainId: number) => {
      console.debug('chainChanged', chainId);
      // window.location.reload();
      window.location!.href = '/';
    });
  }, []);

  const subscribe = (params: { event: string; biz: string; type: string }) => {
    if (readyState === ReadyState.OPEN) {
      sendMessage(JSON.stringify(params));
    }
  };
  const unsubscribe = (params: { event: string; biz: string; type: string }) => {
    if (readyState === ReadyState.OPEN) {
      sendMessage(JSON.stringify(params));
    }
  };

  return (
    <Context.Provider
      value={{
        operation,
        setOperation,
        loading,
        Toast,
        lang,
        setLang,
        originChainId,
        onSwitchChainId,
        toggleLoading,
        connectWallet,
        getWebSocket,
        subscribe,
        unsubscribe,
        readyState,
        event,
        setEvent,
        avatar,
        setAvatar,
      }}
    >
      <IntlProvider locale={lang} messages={messages[lang]}>
        {children}
        {loading && (
          <StyledModalContainer>
            <StyledModalCard color="#0079FF">
              <Loading />
              <span className="label">{loadingMessage}</span>
              <Spacer size="lg" />
            </StyledModalCard>
          </StyledModalContainer>
        )}
        {/* <Loading /> */}
        {/* {showModal.type === ToastType.LOADING && (
          <StyledModalContainer>
            <StyledModalCard color="#0079FF">
              <img src={LoadingIcon} height="100px" alt="" />
              <span className="label">{messages[lang]['modal.loading']}</span>
              <Spacer size="lg" />
            </StyledModalCard>
          </StyledModalContainer>
        )}
        {showModal.type === ToastType.CANCEL && (
          <StyledModalContainer>
            <StyledModalCard color="#EC504F">
              <img src={ErrorIcon} height="60px" alt="" />
              <Spacer size="md" />
              <span className="label">{messages[lang]['modal.cancel']}</span>
              <Spacer size="md" />
              <span className={`comment ${showModal.message ? 'error' : ''}`}>
                {showModal.message || messages[lang]['modal.retry']}
              </span>
              <Spacer size="md" />
              <Button
                size="sm"
                variant="secondary"
                text={messages[lang]['common.button.close']}
                onClick={() => {
                  toggleModal();
                  setOperation(OPERATION.DEFAULT);
                  // window.location.href = window.location.href;
                }}
              />
            </StyledModalCard>
          </StyledModalContainer>
        )}
        {showModal.type === ToastType.SENDED && (
          <StyledModalContainer>
            <StyledModalCard color="#4BBC39">
              <img src={OKIcon} height="60px" alt="" />
              <Spacer size="md" />
              <span className="label">{messages[lang]['modal.sended']}</span>
              <Spacer size="sm" />
              <span className="comment">{showModal.message || ''}</span>
              <Spacer size="md" />
              <Button
                size="sm"
                variant="secondary"
                text={messages[lang]['common.button.close']}
                onClick={() => {
                  toggleModal();
                  setOperation(OPERATION.DEFAULT);
                  // window.location.href = window.location.href;
                }}
              />
            </StyledModalCard>
          </StyledModalContainer>
        )} */}
      </IntlProvider>
    </Context.Provider>
  );
};
