const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Subscriber = sequelize.define('Subscriber', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        status: {
            type: DataTypes.ENUM('pending', 'active', 'unsubscribed', 'bounced'),
            defaultValue: 'active'
        },
        unsubscribed_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'subscribers',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Subscriber;
};
