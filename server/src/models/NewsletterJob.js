const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const NewsletterJob = sequelize.define('NewsletterJob', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        newsletter_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        subscriber_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('queued', 'sent', 'failed'),
            defaultValue: 'queued'
        },
        error: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        sent_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'newsletter_jobs',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return NewsletterJob;
};
