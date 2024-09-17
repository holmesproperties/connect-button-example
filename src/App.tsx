import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import { createWallet, walletConnect, ecosystemWallet, inAppWallet } from "thirdweb/wallets";
import { ethers5Adapter } from 'thirdweb/adapters/ethers5';
import { ethers } from 'ethers';
import "./App.css";
import { ConnectButton, useActiveAccount, useActiveWallet, useConnectModal } from "thirdweb/react";
import { getAllAdmins } from "thirdweb/extensions/erc4337";
import { useState } from "react";


const client = createThirdwebClient({
  // If not using Vite, then use `process.env.NEXT_PUBLIC_CLIENT_ID`
  clientId: import.meta.env.VITE_CLIENT_ID,
});


function App() {
  const  account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { connect, isConnecting } = useConnectModal();
  const [isSmartAccountConnected, setSmartAccountConnected] = useState(false);

  const wallets = [ 
    ecosystemWallet(
      "ecosystem.xai-connect", {
      partnerId: "689cdf15-34a3-4356-b0ee-abc5f160cd0f",
    }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  walletConnect()
  ];

  const recommendedWallets = [
    ecosystemWallet("ecosystem.xai-connect", {
      partnerId: "689cdf15-34a3-4356-b0ee-abc5f160cd0f",
    }),
  ]

  async function handleConnect() {
    const wallet = await connect({
      client, 
      // accountAbstraction:{x
      //   chain: defineChain(37714555429),
      //   sponsorGas: true
      // },
      wallets: 
        [ecosystemWallet("ecosystem.xai-connect", {
          partnerId: "689cdf15-34a3-4356-b0ee-abc5f160cd0f",
        }),
        //   createWallet("io.metamask"),
        // createWallet("com.coinbase.wallet"),
        // walletConnect()
        ],
      setActive: true
     }); // opens the connect modal
    console.log("connected to", wallet);
     setSmartAccountConnected(true);

    }

    async function handleConnectSmartAccount() {
      if (!account) {
        return;

        
      }

    const contract = getContract({
      client,
      chain: defineChain(37714555429),
      address: account?.address || "",
    });
    console.log("contract", contract);

    const result = getAllAdmins({
      contract,
    });

    console.log(result);
    }

  return (
    <div>
      <div style={{ marginBottom: "12px", maxWidth: "420px" }}>
        This repo shows how simple it is to add wallet connection to your web3
        apps using thirdweb SDK.
        <br /> To learn how to customize the ConnectButton, check out the{" "}
        <a
          href="https://thirdweb.com/dashboard/connect/playground"
          target="_blank"
        >
          Playground
        </a>
      </div>
      <ConnectButton client={client} wallets={wallets} recommendedWallets={recommendedWallets}/>
      <div>
        {account ? (
          <div>
            <div>Account: {account.address}</div>
            <button onClick={handleConnect} disabled={isConnecting}>Connect Wallet</button>
          </div>
        ) : (
          <div>Not connected</div>
        )}
        {isSmartAccountConnected ?(
          <button onClick={handleConnectSmartAccount}>Get All Admins</button>
        ) : (
          <div/>
        )}
      </div>
    </div>
  );
}

export default App;
