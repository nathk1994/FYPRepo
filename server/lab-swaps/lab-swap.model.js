const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        fullNameList: { type: DataTypes.STRING, allowNull: true },
        swapRequestDetail: { type: DataTypes.STRING, allowNull: true },
        swapCandidateOne: { type: DataTypes.STRING, allowNull: true },
        swapCandidateTwo: { type: DataTypes.STRING, allowNull: true },
        isSwapComplete: { type: DataTypes.BOOLEAN },
        //firstName: { type: DataTypes.STRING, allowNull: false },
        //lastName: { type: DataTypes.STRING, allowNull: false },
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE },

    };

    const options = {
        // disable default timestamp fields (createdAt and updatedAt)
        timestamps: false,     
    };

    return sequelize.define('lab-swap', attributes, options);
}