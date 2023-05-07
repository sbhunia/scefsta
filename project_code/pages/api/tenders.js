

export default async function handler(req, res) {
    
    switch (req.method) {
        case 'GET': {
            return getTenders(req, res)
        }
        case 'POST': {
            return addTender(req, res)
        }
        case 'DELETE': {
            return deleteTender(req, res)
        }
    }
}

// Not functional
async function addTender(req, res) {
    try {
        const client = await clientPromise;

        const database = client.db('ais_main');

        await database.collection('tenders').insertOne(JSON.parse(req.body));

        return res.json({
            message: 'Tender added successfully',
            success: true,
        });
    } catch (error) {
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}


// Updated to work with mysql as a temporary fix
// Needs to be updated to get tenders from blockchain
async function getTenders(req, res) {
    // get all the tenders and see if it returns data
    //console.log("test get tenders");

    // const value = getAllTenders()
    
    // if (value != undefined) {
    //     //openTenders = true;
    //     console.log("value: ", value);
    //     //data = value;
    // }
    

    const test = [{
        walletId: 'TEST WALLET',
        firstName: 'TEST',
        lastName: 'NAME',
        email: 'rfishwick3@scribd.com',
        ipAddress: '255.224.253.2',
        username: 'rfishwick3',
        address: '3075 Hamilton-Mason Road',
        city: 'Hamilton',
        state: 'Ohio',
        policeDept: null,
        station: null,
        hospitalSystem: 'Bethesda Butler Hospital',
        licensePlate: null,
        tender_id: '0x1659B8865655396f2c5366a3DD331462cFabF6e7',
        payment_amount: 1007897432443.00,
        penalty_amount: 1033423424.00,
        status:"Open",
        expiration_time:"30 Seconds",
        patient_name:"Rosita Fishwick"
    }];

    // res.status(200).send(test);
    
    return new Promise((resolve, reject) => {
        try {
            //const value = getAllTenders()
            //console.log(getAllTenders());
            res.status(200).send(test)
            resolve();
        } catch (error) {
            console.log(error);
            res.status(500).send({success: false});
            resolve();
        }
    });

}

// Not functional
async function deleteTender(req, res) {
    try {
        const client = await clientPromise;

        const database = client.db('ais_main')

        await database.collection('tenders').deleteOne({
            tender_id: parseInt(req.body)
        });

        return res.json({
            message: 'Tender deleted successfully',
            success: true
        });
    } catch (error) {
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}
