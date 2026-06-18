const { DataTypes } = require('sequelize');

/*
 * SaveData Model
 * Purpose: Represents the 'save_data' table.
 */

module.exports = (sequelize) => {
    const SaveData = sequelize.define('SaveData', {
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
            allowNull: true
        }
    }, {
        tableName: 'save_data',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return SaveData;
};
