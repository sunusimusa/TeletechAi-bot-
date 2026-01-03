// blockchain/ton.js
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

export { tonweb, wallet, keyPair };
