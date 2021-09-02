import React, { useState, useCallback, useEffect } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import styled from "styled-components";
import Icon, {
  CopyOutlined,
  FileDoneOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Menu, Dropdown } from "antd";
import MetaMaskIconSVG from "../assets/metamask.svg";
import WalletConnectIconSVG from "../assets/walletconnect.svg";
import BurnerWalletIconPNG from "../assets/burner-wallet.png";
import Button from "./Button";
import { useUserSigner } from "../hooks";
import { INFURA_ID, NETWORKS } from "../constants";
import { firebaseLogin } from "../utils/auth";
import { auth } from "../utils/firebase";
import { signInWithCustomToken, signOut } from "@firebase/auth";
import useFirebaseAuth from "../hooks/FirebaseAuth";

const { ethers } = require("ethers");

const Container = styled.div`
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #fbfbfb;
`;
const TextArea = styled.textarea`
  width: 100%;
  border: 0;
  outline: none;
  padding: 7px;
  border-bottom: 1px solid #ddd;

  &:disabled {
    background: white;
    cursor: not-allowed;
  }
`;
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -5px;
  padding: 7px;
`;
const Support = styled.a`
  color: #555;
  font-size: 0.8rem;

  &:hover {
    color: #555;
    text-decoration: underline;
  }
`;
// const PatronInfo = styled.div`
//   color: #888;
//   font-size: 0.8rem;
//   margin-bottom: 12px;
// `;
const SignInItem = styled.div`
  display: flex;
  align-items: center;

  & svg {
    margin-right: 7px;
  }

  ${props =>
    props.disabled
      ? `
      cursor: not-allowed;
      opacity: 0.5;
  `
      : ""}
`;
const PanelContainer = styled.div`
  display: flex;
  align-items: center;
`;
const Profile = styled.div`
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin-right: 5px;
  padding: 2.75px;

  & img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
  }
`;
const MetaMaskIcon = () => (
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <image href={MetaMaskIconSVG} height="20" width="20" />
  </svg>
);
const WalletConnectIcon = () => (
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <image href={WalletConnectIconSVG} height="20" width="20" />
  </svg>
);
const BurnerWalletIcon = () => (
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <image href={BurnerWalletIconPNG} height="20" width="20" />
  </svg>
);

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  network: "mainnet",
  cacheProvider: true,
  theme: "light",
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        bridge: "https://polygon.bridge.walletconnect.org",
        infuraId: INFURA_ID,
        rpc: {
          1: `https://mainnet.infura.io/v3/${INFURA_ID}`,
          100: "https://dai.poa.network",
        },
      },
    },
  },
});

const targetNetwork = NETWORKS.mainnet;
const localProviderUrl = targetNetwork.rpcUrl;
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);

const CommentEditor = () => {
  const [injectedProvider, setInjectedProvider] = useState();
  const userSigner = useUserSigner(injectedProvider, localProvider);
  const { publicAddress } = useFirebaseAuth();

  // Sign in with Firebase custom token
  const signInWithEthereum = async () => {
    const customToken = await firebaseLogin(userSigner);
    await signInWithCustomToken(auth, customToken);
  };

  useEffect(() => {
    if (userSigner !== undefined) {
      signInWithEthereum();
    }
  }, [userSigner]);

  const signOutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    // Sign out from Firebase
    signOut(auth);
  };

  const loadWeb3Modal = useCallback(
    async providerName => {
      const provider = await web3Modal.connectTo(providerName);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));

      // Subscribe to session disconnection
      provider.on("disconnect", () => {
        signOutOfWeb3Modal();
      });
    },
    [setInjectedProvider],
  );

  const signInOptions = (
    <Menu>
      <Menu.Item key="0">
        <SignInItem
          onClick={() => {
            if (window.ethereum) {
              loadWeb3Modal("injected");
            }
          }}
          disabled={!window.ethereum}
        >
          <Icon component={MetaMaskIcon} />
          <div>Connect with MetaMask</div>
        </SignInItem>
      </Menu.Item>
      <Menu.Item key="1">
        <SignInItem disabled>
          <Icon component={WalletConnectIcon} />
          <div>Connect with WalletConnect</div>
        </SignInItem>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="burner"
        onClick={() => {
          setInjectedProvider(null);
        }}
      >
        <SignInItem>
          <Icon component={BurnerWalletIcon} />
          <div>Connect with a Burner Wallet</div>
        </SignInItem>
      </Menu.Item>
    </Menu>
  );

  // TODO: handle profile logic
  const profileOptions = (
    <Menu>
      <Menu.Item key="0">
        <SignInItem>
          <CopyOutlined />
          <div>Copy Address to Clipboard</div>
        </SignInItem>
      </Menu.Item>
      <Menu.Item key="1">
        <SignInItem>
          <LinkOutlined />
          <div>Open in Etherscan</div>
        </SignInItem>
      </Menu.Item>
      <Menu.Item key="2">
        <SignInItem>
          <FileDoneOutlined />
          <div>Register ENS Domain</div>
        </SignInItem>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        danger
        key="signout"
        onClick={() => {
          signOutOfWeb3Modal();
        }}
      >
        <SignInItem>
          <Icon component={LogoutOutlined} />
          <div>Sign Out</div>
        </SignInItem>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      {/* <PatronInfo>
        <InfoCircleOutlined /> For patronizing, you can buy the author a beers 🍺 and attach it with this comment (1x🍺
        = 0.001 ETH)
      </PatronInfo> */}
      <Container>
        <TextArea placeholder="Add a comment..." rows={4} disabled={!publicAddress} />
        <Footer>
          {/* TODO: Add link for writing instruction (to markdown file) */}
          <Support target="_blank" href="">
            Markdown and LaTex supported
          </Support>
          {!publicAddress && (
            <Dropdown overlay={signInOptions} trigger={["click"]} placement="topRight">
              <Button>Sign in with Ethereum</Button>
            </Dropdown>
          )}
          {publicAddress && (
            <PanelContainer>
              <Dropdown overlay={profileOptions} trigger={["click"]} placement="topRight">
                <Profile>
                  <img src="https://bafybeie6vfcd6xb27nru5ksj3cksmaeblvlm3vkymiyf6plvlfs7mu6jlm.ipfs.infura-ipfs.io/"></img>
                </Profile>
              </Dropdown>
              <Button>Comment</Button>
            </PanelContainer>
          )}
        </Footer>
      </Container>
    </>
  );
};

export default CommentEditor;
