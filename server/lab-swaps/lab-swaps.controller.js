const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
// const accountService = require('./account.service');
const labSwapService = require('./lab-swap.service')

router.get('/', getAllLabSwaps);
router.get('/:id', getLabSwapById);
router.post('/', createLabSwapSchema, create);
router.put('/:id', updateLabSwapSchema, update);
router.post('/notifyLecturer', notifyLecturer);
router.get('/', authorize(Role.Admin), getAllLabSwaps);
router.get('/:id', authorize(), getLabSwapById);
router.post('/', authorize(Role.Admin), createLabSwapSchema, create);
router.put('/:id', authorize(), updateLabSwapSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;



function notifyLecturer(req, res, next) {
    labSwapService.notifyLecturer(req.body, req.get('origin'))
        .then(() => res.json({ message: 'Lecturer notified via email' }))
        .catch(next);
}

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
        labName: Joi.string().required(),
        labDate: Joi.string().required(),
        labTime: Joi.string().required(),
        classGroup: Joi.string().required(), //maybe classGroupId and make a new table, for dropdown list instead.
        availableLabSlotsNumber: Joi.number().integer().required(),
        createdBy: Joi.string(),
        room: Joi.string(),
    });
    validateRequest(req, next, schema);
}


function updateLabSwapSchema(req, res, next) {
    const schema = Joi.object({
        labName: Joi.string().empty(''),
        labDate: Joi.string().empty(''),
        labTime: Joi.string().empty(''),
        classGroup: Joi.string().empty(''),
        availableLabSlotsNumber: Joi.number().integer().empty(''),
        createdBy: Joi.string().empty(''),
        room: Joi.string().empty(''),
    });

    validateRequest(req, next, schema);
}


function _delete(req, res, next) {

    labSwapService.delete(req.params.id)
        .then(() => res.json({ message: 'Lab Swap deleted successfully' }))
        .catch(next);
}
