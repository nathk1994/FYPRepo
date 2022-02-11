const db = require('_helpers/db');
//const { Op } = require('sequelize');
//const config = require('config.json');

module.exports = {
    // authenticate,
    // refreshToken,
    // revokeToken,
    // register,
    // verifyEmail,
    // forgotPassword,
    // validateResetToken,
    // resetPassword,
    getAllLabSwaps,
    getLabSwapById,
    create,
    update,
    delete: _delete
};

async function getAllLabSwaps() {
    return await db.User.findAll();
}

async function getLabSwapById(id) {
    return await getLabSwap(id);
}

// async function getAllLabSwaps() {
//     const labSwaps = await db.LabSwap.findAll();
//     return labSwaps.map(x => basicDetails(x));
// }

// async function getLabSwapById(id) {
//     const labSwap = await getLabSwap(id);
//     return basicDetails(labSwap);
// }

async function create(params) {
    // validate
    //if (await db.LabSwap.findOne({ where: { email: params.email } })) {
    //    throw 'Email "' + params.email + '" is already registered';
    //}

    const labSwap = new db.LabSwap(params);
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

// function basicDetails(labSwap) {
//     const { id, fullNameList, swapRequestDetail, swapCandidateOne, swapCandidateTwo, isSwapComplete } = labSwap;
//     return { id, fullNameList, swapRequestDetail, swapCandidateOne, swapCandidateTwo, isSwapComplete };
// }