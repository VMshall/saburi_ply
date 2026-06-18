const { sequelize } = require('../config/database');
const logger = require('../utils/logger');

/*
 * Models Index
 * Purpose: Centralizes model imports and initializations.
 * It imports individual model definitions and passes the sequelize instance to them.
 * It also sets up associations if they exist.
 */

const BecomePartner = require('./BecomePartner')(sequelize);
const ContactUs = require('./ContactUs')(sequelize);
const Quote = require('./Quote')(sequelize);
const Enquiry = require('./Enquiry')(sequelize);
const User = require('./User')(sequelize);

const Subscriber = require('./Subscriber')(sequelize);
const Newsletter = require('./Newsletter')(sequelize);
const NewsletterJob = require('./NewsletterJob')(sequelize);
const AuthSession = require('./AuthSession')(sequelize);
const SaveData = require('./SaveData')(sequelize);

// NewsletterJob Associations
NewsletterJob.belongsTo(Newsletter, { foreignKey: 'newsletter_id' });
NewsletterJob.belongsTo(Subscriber, { foreignKey: 'subscriber_id' });

// AuthSession Associations
AuthSession.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(AuthSession, { foreignKey: 'user_id' });

const db = {
    sequelize,
    BecomePartner,
    ContactUs,
    Quote,
    Enquiry,
    User,
    Subscriber,
    Newsletter,
    NewsletterJob,
    AuthSession,
    SaveData
};

module.exports = db;
