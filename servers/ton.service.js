import TonWeb from "tonweb";
import nacl from "tweetnacl";

const tonweb = new TonWeb(
  new TonWeb.HttpProvider(process.env.RPC_URL)
);

const seed = Buffer.from(process.env.PRIVATE_KEY, "hex");
const keyPair = nacl.sign.keyPair.fromSeed(seed);

const wallet = tonweb.wallet.create({
  publicKey: keyPair.publicKey,
  wc: 0
});

export async function sendTON(toAddress, tonAmount) {
  const seqno = await wallet.methods.seqno().call();

  await wallet.methods.transfer({
    secretKey: keyPair.secretKey,
    toAddress,
    amount: TonWeb.utils.toNano(tonAmount),
    seqno,
    sendMode: 3
  }).send();
}

export async function sendJetton({
  jettonMaster,
  toAddress,
  amount
}) {
  const jettonMinter = new tonweb.token.jetton.JettonMinter(
    tonweb.provider,
    { address: jettonMaster }
  );

  const jettonWalletAddress =
    await jettonMinter.getJettonWalletAddress(
      tonweb.utils.Address.parse(toAddress)
    );

  const walletAddress = await wallet.getAddress();
  const seqno = await wallet.methods.seqno().call();

  const jettonWallet = new tonweb.token.jetton.JettonWallet(
    tonweb.provider,
    { address: jettonWalletAddress }
  );

  await wallet.methods.transfer({
    secretKey: keyPair.secretKey,
    toAddress: jettonWallet.address,
    amount: TonWeb.utils.toNano("0.05"), // gas
    seqno,
    payload: await jettonWallet.createTransferBody({
      jettonAmount: TonWeb.utils.toNano(amount),
      toAddress: tonweb.utils.Address.parse(toAddress),
      responseAddress: walletAddress
    }),
    sendMode: 3
  }).send();
}
