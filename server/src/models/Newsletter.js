const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Newsletter = sequelize.define('Newsletter', {
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
        }
    }, {
        tableName: 'newsletters',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Newsletter;
};
