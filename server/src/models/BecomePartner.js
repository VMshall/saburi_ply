const { DataTypes } = require('sequelize');

/*
 * BecomePartner Model
 * Purpose: Represents the 'become_partner' table in the database.
 * Stores inquiries from potential partners like interior designers, architects, and dealers.
 */

module.exports = (sequelize) => {
    const BecomePartner = sequelize.define('BecomePartner', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Primary Key'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Name cannot be empty' }
            }
        },
        firm_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Firm name cannot be empty' }
            }
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contact_number: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // Simple regex for basic phone validation flexibility
                // Adjust regex based on strictness requirements
                notEmpty: { msg: 'Contact number is required' }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: { msg: 'Must be a valid email address' }
            }
        },
        project_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        partner_type: {
            type: DataTypes.ENUM('INTERIOR_DESIGNER', 'ARCHITECT', 'DEALERSHIP'),
            allowNull: false,
            validate: {
                isIn: {
                    args: [['INTERIOR_DESIGNER', 'ARCHITECT', 'DEALERSHIP']],
                    msg: 'Invalid partner type'
                }
            }
        }
    }, {
        tableName: 'become_partner',
        timestamps: true, // Adds createdAt and updatedAt
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return BecomePartner;
};
