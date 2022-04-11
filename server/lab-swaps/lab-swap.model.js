const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        fullNameList: { type: DataTypes.STRING, allowNull: true },
        swapRequestDetail: { type: DataTypes.STRING, allowNull: true },
        swapCandidateOne: { type: DataTypes.STRING, allowNull: true },
        swapCandidateTwo: { type: DataTypes.STRING, allowNull: true },
        isSwapComplete: { type: DataTypes.BOOLEAN },
        labName: { type: DataTypes.STRING, allowNull: true },
        labDate: { type: DataTypes.STRING, allowNull: true },
        labTime: { type: DataTypes.STRING, allowNull: true },
        classGroup: { type: DataTypes.STRING, allowNull: true },
        availableLabSlotsNumber: { type: DataTypes.INTEGER, allowNull: true },
        createdBy: { type: DataTypes.STRING, allowNull: true },
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE },

    };

    const options = {
        // disable default timestamp fields (createdAt and updatedAt)
        timestamps: false,     
    };

    return sequelize.define('lab-swap', attributes, options);
}