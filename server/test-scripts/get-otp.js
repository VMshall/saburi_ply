/* eslint-disable no-console */
const { User } = require('../src/models');

const getOtp = async () => {
    try {
        const email = process.argv[2];
        if (!email) {
            console.error('Please provide email');
            process.exit(1);
        }
        const user = await User.findOne({ where: { email } });
        if (user) {
            // Print only the OTP code to stdout so it can be captured
            console.log(user.otp_code || 'No OTP');
        } else {
            console.log('User not found');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error fetching OTP:', error);
        process.exit(1);
    }
};

getOtp();
