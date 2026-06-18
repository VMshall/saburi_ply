const { DataTypes } = require('sequelize');

/*
 * Enquiry Model
 * Purpose: Represents the 'enquiries' table.
 * Stores enquiries submitted via the enquiry modal.
 */

module.exports = (sequelize) => {
    const Enquiry = sequelize.define('Enquiry', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Name is required' }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: { msg: 'Must be a valid email address' }
            }
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        product: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'enquiries',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Enquiry;
};
