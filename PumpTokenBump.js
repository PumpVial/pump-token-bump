import { VersionedTransaction, Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import axios from "axios";

/////////////////////////////// CONFIG //////////////////////////////////////
const API_KEY = process.env.PUMPVIAL_API_KEY;
const RPC_URL = ""; // Visit Helius.dev
const connection = new Connection(RPC_URL, "confirmed");
const RECIPIENT_PRIVATE_KEY = "Enter token recipient's private key.";
const recipient = Keypair.fromSecretKey(bs58.decode(RECIPIENT_PRIVATE_KEY));

const payload = {
  recipient: recipient.publicKey,
  ca: "93xHZCeaRxL7iwRQUPcW7utRbKF5UhMmaSQW9pdEpump",
  solIn: "0.022",
  optionalFeeCharge: "0.5",
};
//////////////////////////////// END ////////////////////////////////////////

const bumpToken = async () => {
  const URL = "https://api.pumpvial.com/pump-token-bump";

  try {
    const request = await axios.post(URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
    });

    const { serializedTransaction } = request.data;
    const serialized = Uint8Array.from(
      Buffer.from(serializedTransaction, "base64")
    );

    const transaction = VersionedTransaction.deserialize(serialized);
    transaction.sign([recipient]);

    const signature = await connection.sendTransaction(transaction);
    console.log(`Success: https://solscan.io/tx/${signature}`);
  } catch (error) {
    console.error("Error:", error);
  }
};

bumpToken();
