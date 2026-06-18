const { sequelize } = require('./src/models');

const cleanupDB = async () => {
    try {
        console.log("Starting index cleanup...");
        const [results] = await sequelize.query("SHOW INDEX FROM users;");

        for (const idx of results) {
            // Drop indexes like email_2, email_3, etc.
            if (idx.Key_name.startsWith('email') && idx.Key_name !== 'email') {
                console.log(`Dropping index: ${idx.Key_name}`);
                await sequelize.query(`ALTER TABLE users DROP INDEX ${idx.Key_name};`);
            }
        }

        console.log("Cleanup complete.");
        process.exit(0);
    } catch (error) {
        console.error("Error cleaning up DB:", error);
        process.exit(1);
    }
};

cleanupDB();
