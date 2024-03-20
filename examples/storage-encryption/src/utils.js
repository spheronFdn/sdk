const siwe = require("siwe");
const { Wallet, verifyMessage } = require("ethers");

const domain = "localhost";
const origin = "https://localhost/login";

const signAuthMessage = async (privKey) => {
  const wallet = new Wallet(privKey);
  const statement =
    "This is a test statement. You can put anything you want here.";
  const expirationTime = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 7
  ).toISOString();

  console.log("Signing message with address: ", wallet.address);
  const siweMessage = new siwe.SiweMessage({
    domain,
    address: wallet.address,
    statement,
    uri: origin,
    version: "1",
    chainId: 1,
    expirationTime,
  });

  const messageToSign = siweMessage.prepareMessage();
  const signature = await wallet.signMessage(messageToSign);
  const recoveredAddress = verifyMessage(messageToSign, signature);

  const authSig = {
    sig: signature,
    derivedVia: "web3.eth.personal.sign",
    signedMessage: messageToSign,
    address: recoveredAddress,
  };

  return authSig;
};

module.exports = { signAuthMessage };
