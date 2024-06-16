import TonWeb from 'tonweb';
const BN = TonWeb.utils.BN;

const tonweb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC')); // Replace with your provider

const adminPrivateKey = '<ADMIN_PRIVATE_KEY>';
const adminAddress = '<ADMIN_ADDRESS>';
const userPrivateKey = '<USER_PRIVATE_KEY>';
const userAddress = '<USER_ADDRESS>';

async function deployContract() {
    // Deploy your contract here, this is just a placeholder
    console.log('Deploying contract...');
    // You would normally deploy your contract and return the contract address
    const contractAddress = '<CONTRACT_ADDRESS>';
    return contractAddress;
}

async function sendFunds(senderKey: string, senderAddress: string, contractAddress: string, amount: number) {
    const wallet = tonweb.wallet.create({publicKey: TonWeb.utils.nacl.sign.keyPair.fromSeed(TonWeb.utils.hexToBytes(senderKey)).publicKey});

    const seqno = await wallet.methods.seqno().call();
    await wallet.methods.transfer({
        secretKey: TonWeb.utils.hexToBytes(senderKey),
        toAddress: contractAddress,
        amount: TonWeb.utils.toNano(amount),
        seqno: seqno,
        payload: '',
        sendMode: 3,
    }).send();
}

async function checkBalance(address: string) {
    const balance = await tonweb.provider.getBalance(address);
    return TonWeb.utils.fromNano(balance);
}

async function main() {
    const contractAddress = await deployContract();

    console.log('Contract deployed at:', contractAddress);

    // Test 1: Send less than 2 TON
    console.log('Test 1: Send less than 2 TON');
    await sendFunds(userPrivateKey, userAddress, contractAddress, 1);
    let balance = await checkBalance(contractAddress);
    console.log('Contract balance after sending 1 TON:', balance);

    // Test 2: Send more than 2 TON
    console.log('Test 2: Send more than 2 TON');
    await sendFunds(userPrivateKey, userAddress, contractAddress, 3);
    balance = await checkBalance(contractAddress);
    console.log('Contract balance after sending 3 TON:', balance);

    // Test 3: Admin withdraw
    console.log('Test 3: Admin withdraw');
    await sendFunds(adminPrivateKey, adminAddress, contractAddress, 1);
    balance = await checkBalance(contractAddress);
    console.log('Contract balance after admin withdraw 1 TON:', balance);
}

main().catch(console.error);