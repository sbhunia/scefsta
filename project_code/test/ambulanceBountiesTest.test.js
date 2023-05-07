const ambulanceBounties = artifacts.require('AmbulanceBounties');
const crypto = require('crypto');
const keccak256 = require('keccak256');
const Web3 = require('web3');
const toBn = Web3.utils.toBn;


contract('AmbulanceBounties', (accounts) => {
    let [a, b, c, d, e, f, g] = accounts;
    const id = [1,2,3];
    let price = 1;
    const address = [
    '0xD88358A8222BBCD3FCFDF2187AED80CDE7889670', '0xD88358A8222BBCD3FCFDF2187AED80CDE7889671', '0xD88358A8222BBCD3FCFDF2187AED80CDE7889672',
    '0xD88358A8222BBCD3FCFDF2187AED80CDE7889673', '0xD88358A8222BBCD3FCFDF2187AED80CDE7889674', '0xD88358A8222BBCD3FCFDF2187AED80CDE7889675',
    '0xD88358A8222BBCD3FCFDF2187AED80CDE7889676', '0xD88358A8222BBCD3FCFDF2187AED80CDE7889677', '0xD88358A8222BBCD3FCFDF2187AED80CDE7889678',
    '0xD88358A8222BBCD3FCFDF2187AED80CDE7889679', '0xD88358A8222BBCD3FCFDF2187AED80CDE7889680', '0xD88358A8222BBCD3FCFDF2187AED80CDE7889681',
    '0xD88358A8222BBCD3FCFDF2187AED80CDE7889682', '0xD88358A8222BBCD3FCFDF2187AED80CDE7889683', '0xD88358A8222BBCD3FCFDF2187AED80CDE7889684',
    '0xD88358A8222BBCD3FCFDF2187AED80CDE7889685', '0xD88358A8222BBCD3FCFDF2187AED80CDE7889686', '0xD88358A8222BBCD3FCFDF2187AED80CDE7889687',
    '0xD88358A8222BBCD3FCFDF2187AED80CDE7889688', '0xD88358A8222BBCD3FCFDF2187AED80CDE7889689', '0xD88358A8222BBCD3FCFDF2187AED80CDE7889690',
    '0xD88358A8222BBCD3FCFDF2187AED80CDE7889691', '0xD88358A8222BBCD3FCFDF2187AED80CDE7889692', '0xD88358A8222BBCD3FCFDF2187AED80CDE7889693',
    '0xD88358A8222BBCD3FCFDF2187AED80CDE7889694', '0xD88358A8222BBCD3FCFDF2187AED80CDE7889695', '0xD88358A8222BBCD3FCFDF2187AED80CDE7889696'
    ]
    it('returns time for API calls', async() => {
        const contractInstance = await ambulanceBounties.new();
        const fs = require('fs');
        const funcNames = [
            "addAmbulance", "addPolice", "addHospital", 
            "isAmbulance", "isPolice", "isHospital", 
            "removeAmbulance", "removePolice", "removeHospital", "postTender",
            // "secretBid", "revealBid", "getWinner", 
          //  "verifyDelivery", "reclaimTender", "retractTender"
        ]
        addAmbArr = []
        addPolArr = []
        addHospArr = []
        let fileStr = ""
        //fileStr += funcNames.toString() + "\n"

        let ind = address.length - 1;

        const addpol = await contractInstance.addPolice(b, {from: a});
        const addamb = await contractInstance.addAmbulance(c, {from: a});
        const tender = await contractInstance.postTender.call(10000, "Home", [], 10, "critical", {from: b, value: 10000});

        let bid = 100;
        let salt = 10;
        let ret = await contractInstance.hashVal(bid, salt);       
        await contractInstance.secretBid.call(0, ret, {from: c, value: 10});
        

       // const addpol = await contractInstance.addPolice.call(accounts[0]);

        // const addAmb = await contractInstance.addAmbulance(accounts[1]);
        // for (let i = 0; i < 1; i++) {
        //     let addAmbStart = Date.now().toString();
        //     const addAmb = await contractInstance.addAmbulance(address[i]);
        //     let addAmbEnd = Date.now().toString();
        //     let addAmbTime = (addAmbEnd - addAmbStart).toString();
        //     //fileStr += addAmbTime + ",";

        //     let addPolStart = Date.now().toString();
        //     const addPol = await contractInstance.addPolice(address[i]);
        //     let addPolEnd = Date.now().toString();
        //     let addPolTime = (addPolEnd - addPolStart).toString();
        //     //fileStr += addPolTime + ","

        //     let addHospStart = Date.now().toString();
        //     const addHosp = await contractInstance.addHospital(address[i]);
        //     let addHospEnd = Date.now().toString();
        //     let addHospTime = (addHospEnd - addHospStart).toString();
        //     //fileStr += addHospTime + ","

        //     let isAmbStart = Date.now().toString();
        //     const isAmb = await contractInstance.isAmbulance(address[i]);
        //     let isAmbEnd = Date.now().toString();
        //     let isAmbTime = (isAmbEnd - isAmbStart).toString();
        //     //fileStr += isAmbTime + ",";

        //     let isPolStart = Date.now().toString();
        //     const isPol = await contractInstance.isPolice(address[i]);
        //     let isPolEnd = Date.now().toString();
        //     let isPolTime = (isPolEnd - isPolStart).toString();
        //     //fileStr += isPolTime + ","

        //     let isHospStart = Date.now().toString();
        //     const isHosp = await contractInstance.isHospital(address[i]);
        //     let isHospEnd = Date.now().toString();
        //     let isHospTime = (isHospEnd - isHospStart).toString();
        //     //fileStr += isHospTime + ","

        //     let postStart = Date.now().toString();
        //     const tender = await contractInstance.postTender.call(10000, "Home", [], 10, "critical", {from: a, value: 10000});
        //     let postEnd = Date.now().toString();
        //     let postTime = (postEnd - postStart).toString();

        //     //let bid = 100;
            
        //     // calculate a random salt to be used with the hash
        //     //let salt = ((Math.random() * 10000) + 1000);
        //     //let salt = 10;

        //     //let ret = await contractInstance.hashVal(bid, salt);
        //     //fileStr += ret + "\n";

        //     //let bidStart = Date.now().toString();
        //     //const bidRet = await contractInstance.secretBid(tender, ret, {from: accounts[1], value: 10});
        //     // let bidEnd = Date.now().toString();
        //     // let bidTime = (bidEnd - bidStart).toString();

        //     // let revStart = Date.now().toString();
        //     // //const reveal = await contractInstance.revealBid(address[i]);
        //     // let revEnd = Date.now().toString();
        //     // let revTime = (revEnd - revStart).toString();

        //     // let getStart = Date.now().toString();
        //     // //const getWin = await contractInstance.getWinner();
        //     // let getEnd = Date.now().toString();
        //     // let getTime = (getEnd - getStart).toString();

        //     // let verStart = Date.now().toString();
        //     // //const verify = await contractInstance.verifyDelivery(address[i]);
        //     // let verEnd = Date.now().toString();
        //     // let verTime = (verEnd - verStart).toString();

        //     // let recStart = Date.now().toString();
        //     // //const reclaim = await contractInstance.reclaimTender(tender);
        //     // let recEnd = Date.now().toString();
        //     // let recTime = (recEnd - recStart).toString();

        //     // let retStart = Date.now().toString();
        //     // //const retract = await contractInstance.retractTender(tender);
        //     // let retEnd = Date.now().toString();
        //     // let retTime = (retEnd - retStart).toString();

        //     let remAmbStart = Date.now().toString();
        //     const remAmb = await contractInstance.removeAmbulance(address[i]);
        //     let remAmbEnd = Date.now().toString();
        //     let remAmbTime = (remAmbEnd - remAmbStart).toString();

        //     let remPolStart = Date.now().toString();
        //     const remPol = await contractInstance.removePolice(address[i]);
        //     let remPolEnd = Date.now().toString();
        //     let remPolTime = (remPolEnd - remPolStart).toString();

        //     let remHospStart = Date.now().toString();
        //     const remHosp = await contractInstance.removeHospital(address[i]);
        //     let remHospEnd = Date.now().toString();
        //     let remHospTime = (remHospEnd - remHospStart).toString();

        //     // fileStr += addAmbTime + "," + addPolTime + "," + addHospTime + "," +
        //     // isAmbTime + "," + isPolTime + "," + isHospTime + "," + 
        //     // remAmbTime + "," + remPolTime + "," + remHospTime + "," + postTime + "\n";
        // }
        fs.writeFile('time.csv', fileStr, (err) => { if (err) throw err;});

    });

    // it('Should add and check permissions properly', async () => {
    //     const contractInstance = await ambulanceBounties.new();
    //     const addAmb = await contractInstance.addAmbulance(a, {from: a});
    //     const addPol = await contractInstance.addPolice(a, {from: a});
    //     const addHosp = await contractInstance.addHospital(a, {from: a});
    //     const isAmbA = await contractInstance.isAmbulance(a);
    //     const isPolA = await contractInstance.isPolice(a);
    //     const isHospA = await contractInstance.isHospital(a);
    //     assert(isAmbA == true);
    //     assert(isPolA == true);
    //     assert(isHospA == true);
    //     const isAmbB = await contractInstance.isAmbulance(b);
    //     const isPolB = await contractInstance.isPolice(b);
    //     const isHospB = await contractInstance.isHospital(b);
    //     assert(isAmbB == false);
    //     assert(isPolB == false);
    //     assert(isHospB == false); 
    // });

    // it('Should post bounty properly', async () => {
    //     const contractInstance = await ambulanceBounties.new();
    //     const addpol = await contractInstance.addPolice(a, {from: a});
    //     const postTend = await contractInstance.postTender(10, "Home", [], 10, {from: a, value: 10000});
    //     const allTenders = await contractInstance.getAllTenders();
    //     assert(allTenders.length !== 0);
    // });
    // it('Should remove tender', async() => {
    //     const contractInstance = await ambulanceBounties.new();
    //     const addpol = await contractInstance.addPolice(a, {from: a});
    //     const postTend = await contractInstance.postTender(10, "Home", [], 10, {from: a, value: 10000});
    //     const allTenders = await contractInstance.getAllTenders();
    //     assert(allTenders.length !== 0);
    //     const removeTEnder = await contractInstance.retractTender(0, {from: a});
    //     const allTenders2 = await contractInstance.getAllTenders();
    //     assert(allTenders2.length === 0);
    // })
});