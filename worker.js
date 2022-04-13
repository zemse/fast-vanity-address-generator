const { workerData, parentPort } = require("worker_threads");
const fs = require("fs-extra");

const {
  BigNumber,
  utils: { randomBytes, keccak256, arrayify, getAddress, hexZeroPad },
} = require("ethers");
const { getPublicKey } = require("@noble/secp256k1");

// if this method returns true then we found the address we want
function match(addressStr) {
  const prefixChars = "0xC0de";
  return (
    addressStr.toLowerCase().slice(0, prefixChars.length) ===
    prefixChars.toLowerCase()
  );
}

function main() {
  let entropy = BigNumber.from(randomBytes(32));
  let address;
  let offset = 0;
  do {
    offset++;
    address = getAddressFromSecretKey(entropy.add(offset));
    if (offset % 1000 === 0) {
      // parentPort.postMessage(`Completed ${offset} trials by ${workerData.id}`);
    }
  } while (!match(address));

  // parentPort.postMessage(`Done`);
  // console.log(workerData);
  fs.appendFile(
    "secret-keys.txt",
    `
SecretKey: ${hexZeroPad(entropy.add(offset).toHexString(), 32)}
Address:   ${address}
    `
  );
}

function getAddressFromSecretKey(secretKey) {
  const publicKey = getPublicKey(arrayify(secretKey));
  return getAddress(keccak256(publicKey.slice(1)).slice(26));
}

main();
