const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
// const accountService = require('./account.service');
const labSwapService = require('./lab-swap.service')

// routes
//router.post('/authenticate', authenticateSchema, authenticate);
//router.post('/refresh-token', refreshToken);
//router.post('/revoke-token', authorize(), revokeTokenSchema, revokeToken);
//router.post('/verify-email', verifyEmailSchema, verifyEmail);
//router.post('/forgot-password', forgotPasswordSchema, forgotPassword);
//router.post('/validate-reset-token', validateResetTokenSchema, validateResetToken);
//router.post('/reset-password', resetPasswordSchema, resetPassword);
//router.get('/', authorize(Role.Admin), getAll);


// 11th February Routes
router.get('/', getAllLabSwaps);
router.get('/:id', getLabSwapById);
router.post('/', createLabSwapSchema, create);
router.put('/:id', updateLabSwapSchema, update);
//router.delete('/:id', _delete);

//Original Routes
//router.post('/register', labSwapSchema);
router.get('/', authorize(Role.Admin), getAllLabSwaps);
router.get('/:id', authorize(), getLabSwapById);
router.post('/', authorize(Role.Admin), createLabSwapSchema, create);
router.put('/:id', authorize(), updateLabSwapSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

// function authenticateSchema(req, res, next) {
//     const schema = Joi.object({
//         email: Joi.string().required(),
//         password: Joi.string().required()
//     });
//     validateRequest(req, next, schema);
// }

// function authenticate(req, res, next) {
//     const { email, password } = req.body;
//     const ipAddress = req.ip;
//     accountService.authenticate({ email, password, ipAddress })
//         .then(({ refreshToken, ...account }) => {
//             setTokenCookie(res, refreshToken);
//             res.json(account);
//         })
//         .catch(next);
// }

// function refreshToken(req, res, next) {
//     const token = req.cookies.refreshToken;
//     const ipAddress = req.ip;
//     accountService.refreshToken({ token, ipAddress })
//         .then(({ refreshToken, ...account }) => {
//             setTokenCookie(res, refreshToken);
//             res.json(account);
//         })
//         .catch(next);
// }

// function revokeTokenSchema(req, res, next) {
//     const schema = Joi.object({
//         token: Joi.string().empty('')
//     });
//     validateRequest(req, next, schema);
// }

// function revokeToken(req, res, next) {
//     // accept token from request body or cookie
//     const token = req.body.token || req.cookies.refreshToken;
//     const ipAddress = req.ip;

//     if (!token) return res.status(400).json({ message: 'Token is required' });

//     // users can revoke their own tokens and admins can revoke any tokens
//     if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }

//     accountService.revokeToken({ token, ipAddress })
//         .then(() => res.json({ message: 'Token revoked' }))
//         .catch(next);
// }

// function labSwapSchema(req, res, next) {
//     const schema = Joi.object({
//         //fullNameList: Joi.string().required(),
//         swapRequestDetail: Joi.string().required(),
//         swapCandidateOne: Joi.string().required(),
//         swapCandidateTwo: Joi.string().required(),
//         isSwapComplete: Joi.boolean().valid(false).required()
//     });
//     validateRequest(req, next, schema);
// }

// function register(req, res, next) {
//     accountService.register(req.body, req.get('origin'))
//         .then(() => res.json({ message: 'Registration successful, please check your email for verification instructions' }))
//         .catch(next);
// }

// function verifyEmailSchema(req, res, next) {
//     const schema = Joi.object({
//         token: Joi.string().required()
//     });
//     validateRequest(req, next, schema);
// }

// function verifyEmail(req, res, next) {
//     accountService.verifyEmail(req.body)
//         .then(() => res.json({ message: 'Verification successful, you can now login' }))
//         .catch(next);
// }

// function forgotPasswordSchema(req, res, next) {
//     const schema = Joi.object({
//         email: Joi.string().email().required()
//     });
//     validateRequest(req, next, schema);
// }

// function forgotPassword(req, res, next) {
//     accountService.forgotPassword(req.body, req.get('origin'))
//         .then(() => res.json({ message: 'Please check your email for password reset instructions' }))
//         .catch(next);
// }

// function validateResetTokenSchema(req, res, next) {
//     const schema = Joi.object({
//         token: Joi.string().required()
//     });
//     validateRequest(req, next, schema);
// }

// function validateResetToken(req, res, next) {
//     accountService.validateResetToken(req.body)
//         .then(() => res.json({ message: 'Token is valid' }))
//         .catch(next);
// }

// function resetPasswordSchema(req, res, next) {
//     const schema = Joi.object({
//         token: Joi.string().required(),
//         password: Joi.string().min(6).required(),
//         confirmPassword: Joi.string().valid(Joi.ref('password')).required()
//     });
//     validateRequest(req, next, schema);
// }

// function resetPassword(req, res, next) {
//     accountService.resetPassword(req.body)
//         .then(() => res.json({ message: 'Password reset successful, you can now login' }))
//         .catch(next);
// }

// function getAll(req, res, next) {
//     accountService.getAll()
//         .then(accounts => res.json(accounts))
//         .catch(next);
// }

// function getLabSwapById(req, res, next) {
//     // users can get their own Lab Swap and admins can get any Lab Swap
//     if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }

//     labSwapService.getLabSwapById(req.params.id)
//         .then(labSwap => labSwap ? res.json(labSwap) : res.sendStatus(404))
//         .catch(next);
// }

// function getById(req, res, next) {
//     // users can get their own account and admins can get any account
//     if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }

//     accountService.getById(req.params.id)
//         .then(account => account ? res.json(account) : res.sendStatus(404))
//         .catch(next);
// }

function getAllLabSwaps(req, res, next) {
    labSwapService.getAllLabSwaps()
        .then(labSwaps => res.json(labSwaps))
        .catch(next);
}


function getLabSwapById(req, res, next) {
    labSwapService.getLabSwapById(req.params.id)
        .then(labSwap => res.json(labSwap))
        .catch(next);
}

function create(req, res, next) {
    labSwapService.create(req.body)
        .then(() => res.json({ message: 'Lab Swap created' }))
        //.then(labSwap => res.json(labSwap))
        .catch(next);
}


function update(req, res, next) {
    labSwapService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Lab Swap updated' }))
        .catch(next);
}


function update(req, res, next) {
    // users can update their own account and admins can update any account
    if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    labSwapService.update(req.params.id, req.body)
        .then(labSwap => res.json(labSwap))
        .catch(next);
}


function createLabSwapSchema(req, res, next) {
    const schema = Joi.object({
        // fullNameList: Joi.string(),
        // swapCandidateOne: Joi.string().required(),
        // swapCandidateTwo: Joi.string(),
        // swapRequestDetail: Joi.string(),
        // isSwapComplete: Joi.boolean().valid(false),
        labName: Joi.string().required(),
        labDate: Joi.string().required(),
        labTime: Joi.string().required(),
        classGroup: Joi.string().required(), //maybe classGroupId and make a new table, for dropdown list instead.
        availableLabSlotsNumber: Joi.number().integer().required(),
        
    });
    validateRequest(req, next, schema);
}


function updateLabSwapSchema(req, res, next) {
    const schema = Joi.object({
        // swapRequestDetail: Joi.string().empty(''),
        // swapCandidateOne: Joi.string().empty(''),
        labName: Joi.string().empty(''),
        labDate: Joi.string().empty(''),
        labTime: Joi.string().empty(''),
        classGroup: Joi.string().empty(''),
        availableLabSlotsNumber: Joi.number().integer().empty(''),
        //swapCandidateTwo: Joi.string().empty(''),
        //isSwapComplete: Joi.boolean().empty(''),
    });

    // only admins can update role
    // if (req.user.role === Role.Admin) {
    //     schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
    // }

    // const schema = Joi.object(schemaRules).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}


function _delete(req, res, next) {
    // users can delete their own lab swap and admins can delete any lab swap
    if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    labSwapService.delete(req.params.id)
        .then(() => res.json({ message: 'Lab Swap deleted successfully' }))
        .catch(next);
}