import { MeshWallet, ForgeScript, Transaction, AssetMetadata, BlockfrostProvider, IInitiator } from '@meshsdk/core';

export async function forgeHexNFT(receiverCardanoAddress: string, hexId: string): Promise<string> {
  const blockfrostKey = process.env.BLOCKFROST_API_KEY;
  const mnemonic = process.env.TREASURY_MNEMONIC;

  // Graceful fallback for demo/development purposes if keys are missing
  if (!blockfrostKey || !mnemonic) {
    console.warn("⚠️ MINTING SIMULATED: Missing BLOCKFROST_API_KEY or TREASURY_MNEMONIC. Transaction simulated.");
    await new Promise(r => setTimeout(r, 2000));
    return `mock_tx_${hexId}_${Date.now()}`;
  }

  try {
    const blockchainProvider = new BlockfrostProvider(blockfrostKey);
    
    const wallet = new MeshWallet({
      networkId: 0, // 0 for testnet/preprod, 1 for mainnet
      fetcher: blockchainProvider,
      submitter: blockchainProvider,
      key: {
        type: 'mnemonic',
        words: mnemonic.split(' ')
      }
    });

    const usedAddress = await wallet.getChangeAddress();
    console.log("💰 Treasury Wallet Authenticated. Address:", usedAddress);
    
    const forgingScript = ForgeScript.withOneSignature(usedAddress);

    // CIP-25 Metadata Standard Structure
    const assetMetadata: AssetMetadata = {
      name: `Mālama Genesis Hex #${hexId.substring(hexId.length - 4)}`,
      image: "ipfs://QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", // TODO: Upload actual map capture
      mediaType: "image/png",
      description: "Cryptographic DePIN Environmental Data Territory",
      Hex_ID: hexId,
      Territory: "Target Region", // Could dynamically check hexRegion arrays
      Asset_Type: "Genesis Node Access",
      Base_Value: "1500 USDC"
    };

    const assetName = `Hex${hexId}`; // Name of the native token

    const tx = new Transaction({ initiator: wallet })
      .mintAsset(forgingScript, {
        assetName: assetName,
        assetQuantity: '1',
        metadata: assetMetadata,
        label: '721', // CIP-25 Standard Label
        recipient: receiverCardanoAddress
      });

    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);
    
    return txHash;

  } catch (err: any) {
    console.error("Failed to mint Cardano NFT:", err);
    throw new Error("Blockchain ledger sync failed during asset minting.");
  }
}
