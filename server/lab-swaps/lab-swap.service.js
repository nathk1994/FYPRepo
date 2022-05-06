const db = require('_helpers/db');
const sendEmail = require('_helpers/send-email');
//const { Op } = require('sequelize');
//const config = require('config.json');

module.exports = {
    // authenticate,
    // verifyEmail,
    getAllLabSwaps,
    getLabSwapById,
    create,
    update,
    delete: _delete,
    notifyLecturer
};

async function notifyLecturer(origin) {
    const labSwap = origin.params;
    const account = origin.account;

    // send email
    await sendNotifyLecturerEmail(labSwap, account);
}

async function sendNotifyLecturerEmail(labSwap, account) {
    //let message;
    
    await sendEmail({
        to: labSwap.createdBy,
        subject: `Attention - Student ${account.firstName} ${account.lastName} has reserved a Lab Slot`,
        html: `Hello!
        <br><h4>Student ${account.firstName} ${account.lastName} is now attending the ${labSwap.labTime} lab on ${labSwap.labDate}s for the "${labSwap.labName}" Module!   
        <br> 
        <br> ${account.firstName} ${account.lastName} will not be attending their originally assigned default class group lab time.
        <br> </h4>
        <br> Thank you.`
    });

    await sendEmail({
        to: account.email,
        subject: 'Reminder - You have reserved a Lab Slot',
        html: `Hello!
        <br><h4>You are now attending the ${labSwap.labTime} lab on ${labSwap.labDate}s for the "${labSwap.labName}" Module! 
        <br> 
        <br> Instead of your originally assigned default class group lab time.
        <br> </h4>
        <br> Thank you.`
    });
}

async function getAllLabSwaps() {
    return await db.LabSwap.findAll();
}

async function getLabSwapById(id) {
    return await getLabSwap(id);
}

async function create(params) {
    // validate
    //if (await db.LabSwap.findOne({ where: { email: params.email } })) {
    //    throw 'Email "' + params.email + '" is already registered';
    //}

    // create labSwap object
    const labSwap = new db.LabSwap(params);

    // put current date in 'labSwap.verified' property
    labSwap.verified = Date.now();

    // hash a password if needed
    //labSwap.passwordHash = await hash(params.password);

    // save labSwap table
    await labSwap.save();

    // return basicDetails(labSwap);
}

async function update(id, params) {
    const labSwap = await getLabSwap(id);

    // validate (if email was changed)
    //if (params.email && labSwap.email !== params.email && await db.LabSwap.findOne({ where: { email: params.email } })) {
    //    throw 'Email "' + params.email + '" is already taken';
    //}

    // hash password if it was entered
    //if (params.password) {
    //    params.passwordHash = await hash(params.password);
    //}

    // copy params to Lab Swap and save
    Object.assign(labSwap, params);
    labSwap.updated = Date.now();
    await labSwap.save();

    // return basicDetails(labSwap); // ?
}

async function _delete(id) {
    const labSwap = await getLabSwap(id);
    await labSwap.destroy();
}


// helper functions

async function getLabSwap(id) {
    const labSwap = await db.LabSwap.findByPk(id);
    if (!labSwap) throw 'Lab Swap not found';
    return labSwap;
}

// async function getAllLabSwaps() {
//     const labSwaps = await db.LabSwap.findAll();
//     return labSwaps.map(x => basicDetails(x));
// }

// async function getLabSwapById(id) {
//     const labSwap = await getLabSwap(id);
//     return basicDetails(labSwap);
// }

// function basicDetails(labSwap) {
//     const { id, fullNameList, swapRequestDetail, swapCandidateOne, swapCandidateTwo, isSwapComplete } = labSwap;
//     return { id, fullNameList, swapRequestDetail, swapCandidateOne, swapCandidateTwo, isSwapComplete };
// }