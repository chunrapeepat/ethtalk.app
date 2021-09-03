import React, { useState, useCallback, useEffect } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import styled from "styled-components";
import Icon, { CopyOutlined, FileDoneOutlined, LinkOutlined, LogoutOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Alert } from "antd";
import MetaMaskIconSVG from "../assets/metamask.svg";
import WalletConnectIconSVG from "../assets/walletconnect.svg";
import BurnerWalletIconPNG from "../assets/burner-wallet.png";
import Button from "./Button";
import { useUserSigner } from "../hooks";
import { INFURA_ID, NETWORKS } from "../constants";
import { firebaseLogin } from "../utils/auth";
import { auth, firestore } from "../utils/firebase";
import { signInWithCustomToken, signOut } from "@firebase/auth";
import { collection, doc, setDoc, addDoc, getDoc } from "@firebase/firestore";
import useFirebaseAuth from "../hooks/FirebaseAuth";
import { copyToClipboard, displayAddress, hashURL } from "../utils/helper";

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
  resize: none;

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
const DropdownItem = styled.div`
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
const Error = styled.div`
  margin-bottom: 7px;
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

const CommentEditor = ({ commentURL }) => {
  const [injectedProvider, setInjectedProvider] = useState();
  const userSigner = useUserSigner(injectedProvider, localProvider);
  const { publicAddress } = useFirebaseAuth();
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Sign in with Firebase custom token
  const signInWithEthereum = async () => {
    setIsLoading(true);
    try {
      const customToken = await firebaseLogin(userSigner);
      await signInWithCustomToken(auth, customToken);
    } catch (e) {
      setError(e.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (injectedProvider !== undefined && userSigner !== undefined) {
      signInWithEthereum();
    }
  }, [injectedProvider, userSigner]);

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

  const handleSubmit = async () => {
    setError("");

    if (!value.trim()) return;
    if (value.length > 2000) {
      setError("character limit exceeded (maximum: 2000 characters)");
      return;
    }

    setIsLoading(true);
    try {
      const commentBoxRef = doc(firestore, "comment-boxes", hashURL(commentURL));
      const commentBox = await getDoc(commentBoxRef);
      if (!commentBox.exists()) {
        await setDoc(commentBoxRef, {
          commentURL,
          createdAt: new Date(),
        });
      }
      const commentRef = collection(firestore, "comment-boxes", hashURL(commentURL), "comments");
      await addDoc(commentRef, {
        data: value.trim(),
        likes: [],
        authorPublicAddress: publicAddress,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setValue("");
    } catch (e) {
      setError(e.message);
    }
    setIsLoading(false);
  };

  const signInOptions = (
    <Menu>
      <Menu.Item key="0">
        <DropdownItem
          onClick={() => {
            if (window.ethereum) {
              loadWeb3Modal("injected");
            }
          }}
          disabled={!window.ethereum}
        >
          <Icon component={MetaMaskIcon} />
          <div>Connect with MetaMask</div>
        </DropdownItem>
      </Menu.Item>
      <Menu.Item key="1">
        <DropdownItem disabled>
          <Icon component={WalletConnectIcon} />
          <div>Connect with WalletConnect</div>
        </DropdownItem>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="burner"
        onClick={() => {
          setInjectedProvider(null);
        }}
      >
        <DropdownItem>
          <Icon component={BurnerWalletIcon} />
          <div>Connect with a Burner Wallet</div>
        </DropdownItem>
      </Menu.Item>
    </Menu>
  );

  // TODO: handle profile logic
  const profileOptions = (
    <Menu>
      <Menu.Item key="address">
        <DropdownItem disabled>{displayAddress(publicAddress)}</DropdownItem>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="0"
        onClick={() => {
          copyToClipboard(publicAddress);
        }}
      >
        <DropdownItem>
          <CopyOutlined />
          <div>Copy Address to Clipboard</div>
        </DropdownItem>
      </Menu.Item>
      <Menu.Item key="1">
        <a target="_blank" href={`https://etherscan.io/address/${publicAddress}`}>
          <DropdownItem>
            <LinkOutlined />
            <div>Open in Etherscan</div>
          </DropdownItem>
        </a>
      </Menu.Item>
      <Menu.Item key="2">
        <a target="_blank" href="https://app.ens.domains/">
          <DropdownItem>
            <FileDoneOutlined />
            <div>Register ENS Domain</div>
          </DropdownItem>
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        danger
        key="signout"
        onClick={() => {
          signOutOfWeb3Modal();
        }}
      >
        <DropdownItem>
          <Icon component={LogoutOutlined} />
          <div>Sign Out</div>
        </DropdownItem>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      {error && (
        <Error>
          <Alert message={`Error: ${error}`} type="error" />
        </Error>
      )}
      <Container>
        <TextArea
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Add a comment..."
          rows={5}
          maxLength={2000}
          disabled={!publicAddress || isLoading}
        />
        <Footer>
          {/* TODO: Add link for writing instruction (to markdown file) */}
          <Support target="_blank" href="">
            Markdown and LaTex supported
          </Support>
          {!publicAddress && (
            <Dropdown overlay={isLoading ? <div /> : signInOptions} trigger={["click"]} placement="topRight">
              <Button loading={isLoading}>Sign in with Ethereum</Button>
            </Dropdown>
          )}
          {publicAddress && (
            <PanelContainer>
              <Dropdown overlay={profileOptions} trigger={["click"]} placement="topRight">
                <Profile>
                  <img src="https://bafybeie6vfcd6xb27nru5ksj3cksmaeblvlm3vkymiyf6plvlfs7mu6jlm.ipfs.infura-ipfs.io/"></img>
                </Profile>
              </Dropdown>
              <Button loading={isLoading} onClick={isLoading ? () => {} : handleSubmit}>
                Comment
              </Button>
            </PanelContainer>
          )}
        </Footer>
      </Container>
    </>
  );
};

export default CommentEditor;
