var express = require('express');
var app = express();

app.set('view engine', 'ejs')

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve('/home/junho/CBNU-Waken/fabric/Energy_network', 'connection-org1.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())



app.get('/', function (req, res) {
  res.render('index');
});
app.get('/balanceOf/:KEY', async function(req,res){
    console.log(req.params.KEY)
	const query_responses= await balanceOf(req.params.KEY);
	if (query_responses) {
           res.send(JSON.stringify(query_responses.toString()));
	} else {
	   console.log("No payloads were returned from query");
	}
});
app.post('/transfer', async function(req,res){
    const data = {
        callerId: req.body.caller_id,
        recipientId: req.body.recipient_id,
        location: req.body.location,
        transferAmount: req.body.transferAmount
    }
	const query_responses = await transfer(data);
	if (query_responses) {
       res.json(query_responses);
	} else {
       console.log("No payloads were returned from transfer");
       res.json('No payloads were returned from transfer');
	}
});

app.post('/SignUp', async function(req,res){
    const data = {
        Hash: req.body.hash,
        Id: req.body.id,
        Pw: req.body.pw,
        Name: req.body.name,
        Ph: req.body.ph,
        Email: req.body.email,
        Residentnum: req.body.residentnum,
        Bank: req.body.bank,
        Banknum: req.body.banknum
    }
	const query_responses = await SignUp(data);
	if (query_responses) {
       res.json(query_responses);
	} else {
       console.log("No payloads were returned from transfer");
       res.json('No payloads were returned from transfer');
	}
});


app.post('/DetermineCost', async function(req,res){
    const data = {
        Date: req.body.date,
        Chargecarcost: req.body.chargecarcost,
        Procsellcost: req.body.procsellcost,
        Cmlxsellcost:req.body.cmlxsellcost,
    }
	const query_responses = await DetermineCost(data);
	if (query_responses) {
       res.json(query_responses);
	} else {
       console.log("No payloads were returned from transfer");
       res.json('No payloads were returned from transfer');
	}
});



app.post('/Update', async function(req,res){
    const data = {
        Newhash: req.body.Newhash,
        Newpw: req.body.Newpw,
        Newph: req.body.Newph,
        Newemail: req.body.Newemail,
        Newbank: req.body.Newbank,
        Newbanknum: req.body.Newbanknum,
    }
	const query_responses = await Update(data);
	if (query_responses) {
       res.json(query_responses);
	} else {
       console.log("No payloads were returned from transfer");
       res.json('No payloads were returned from transfer');
	}
});




async function balanceOf(KEY) {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('Energy_network');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.evaluateTransaction("balanceOf", KEY.toString());
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        return result;

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return "error"
    }
}
async function transfer(data) {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('Energy_network');

        // Submit the specified transaction.
        // transfer transaction - requires 4 argument, ex: ('transfer', 'callerId', 'recipientId', 'location', 'transferAmount')
        console.log(data)
        const response = await contract.submitTransaction('transfer', data.callerId.toString(), data.recipientId.toString(), data.location.toString(), data.transferAmount.toString());
        console.log('Transaction has been submitted');
        
        // Disconnect from the gateway.
        await gateway.disconnect();
        return "Transfer Success"

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return "error"
    }
}

async function SignUp(data) {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('Energy_network');

        // Submit the specified transaction.
        // SignUp transaction - requires 9 argument, ex: {SignUp, hash, id, pw, name, ph, email, residentnum, bank, banknum}
        console.log(data)
        const response = await contract.submitTransaction('SignUp', data.Hash.toString(), data.Id.toString(),data.Pw.toString(), data.Name.toString(), data.Ph.toString(), data.Email.toString(), data.Residentnum.toString(), data.Bank.toString(), data.Banknum.toString());
        console.log('Transaction has been submitted');
        
        // Disconnect from the gateway.
        await gateway.disconnect();
        return "SignUp Success"

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return "error"
    }
}

async function DetermineCost(data) {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('Energy_network');

        // Submit the specified transaction.
        // SignUp transaction - requires 9 argument, ex: {DetermineCost, hash, id, pw, name, ph, email, residentnum, bank, banknum}
        console.log(data)

        const response = await contract.submitTransaction('DetermineCost', data.Date.toString(), data.Chargecarcost.toString(),data.Procsellcost.toString(), data.Cmlxsellcost.toString());
        console.log('Transaction has been submitted');
        
        // Disconnect from the gateway.
        await gateway.disconnect();
        return "SignUp Success"

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return "error"
    }
}



async function Update(data) {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('Energy_network');

        // Submit the specified transaction.
        // SignUp transaction - requires 6 argument, ex: {Update, Newhash, Newpw, Newph, Newemail, Newbank, Newbanknum}
        console.log(data)

        const response = await contract.submitTransaction('Update', data.Newhash.toString(),data.Newpw.toString(), data.Newph.toString(), data.Newemail.toString(), data.Newbank.toString(), data.Newbanknum.toString());
        console.log('Transaction has been submitted');
        
        // Disconnect from the gateway.
        await gateway.disconnect();
        return "SignUp Success"

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return "error"
    }
}


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

