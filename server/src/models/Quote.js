const { DataTypes } = require('sequelize');

/*
 * Quote Model
 * Purpose: Represents the 'quotes' table.
 * Stores product quotation requests.
 */

module.exports = (sequelize) => {
    const Quote = sequelize.define('Quote', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        inquiry_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        product_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        estimated_qty: {
            type: DataTypes.STRING,
            allowNull: true
        },
        additional_requirements: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'quotes',
        timestamps: true, // SQL dump didn't specify timestamps, but good practice to add
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Quote;
};
