const { DataTypes } = require('sequelize');

/*
 * ContactUs Model
 * Purpose: Represents the 'contact_us' table.
 * Stores general inquiries submitted via the contact form.
 */

module.exports = (sequelize) => {
    const ContactUs = sequelize.define('ContactUs', {
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
            allowNull: false,
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
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'contact_us',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return ContactUs;
};
