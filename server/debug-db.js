const { sequelize } = require('./src/models');

const debugDB = async () => {
    try {
        const [results] = await sequelize.query("SHOW INDEX FROM users;");
        console.log("Indexes on 'users' table:");
        results.forEach(idx => {
            console.log(`- ${idx.Key_name} (${idx.Column_name}) | Unique: ${!idx.Non_unique}`);
        });
        process.exit(0);
    } catch (error) {
        console.error("Error debugging DB:", error);
        process.exit(1);
    }
};

debugDB();
