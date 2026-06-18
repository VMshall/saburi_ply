const { User, BecomePartner, ContactUs, Quote, Enquiry } = require('../models');
const { Op } = require('sequelize');

/**
 * Get dashboard statistics
 * @returns {Promise<Object>}
 */
const getStats = async () => {
    const [users, partners, contacts, quotes, enquiries] = await Promise.all([
        User.count(),
        BecomePartner.count(),
        ContactUs.count(),
        Quote.count(),
        Enquiry.count()
    ]);

    return {
        users,
        partners,
        contacts,
        quotes,
        enquiries
    };
};

/**
 * Get recent submissions from all tables with pagination
 * @param {Object} options - Query options
 * @param {number} [options.limit] - Maximum number of results (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {string} [options.from_date] - Start date
 * @param {string} [options.until_date] - End date
 * @returns {Promise<Object>}
 */
const getRecentSubmissions = async (options = {}) => {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const buildFilter = (fieldsMap) => {
        const queryFilter = {};
        if (options.from_date && options.until_date) {
            queryFilter.created_at = { [Op.between]: [new Date(options.from_date), new Date(options.until_date)] };
        } else if (options.from_date) {
            queryFilter.created_at = { [Op.gte]: new Date(options.from_date) };
        } else if (options.until_date) {
            queryFilter.created_at = { [Op.lte]: new Date(options.until_date) };
        }

        Object.entries(fieldsMap).forEach(([queryField, modelField]) => {
            if (options[queryField]) {
                queryFilter[modelField] = { [Op.like]: `%${options[queryField]}%` };
            }
        });
        return queryFilter;
    };

    const partnerFilter = buildFilter({ name: 'name', email: 'email', message: 'message', phone: 'contact_number' });
    const contactFilter = buildFilter({ name: 'name', email: 'email', message: 'message', phone: 'phone_number' });
    const quoteFilter = buildFilter({ name: 'name', email: 'email', message: 'additional_requirements', phone: 'phone_number' });
    const enquiryFilter = buildFilter({ name: 'name', email: 'email', message: 'message', phone: 'phone_number' });

    // We fetch a bit more than the total limit per table to ensure we have enough data to sort and paginate
    // For a dashboard "recent" view, this is common. 
    // If lists are huge, we would use a different approach (view or union)
    const fetchLimit = limit * page;
    const order = [['created_at', 'DESC']];

    const [partners, contacts, quotes, enquiries] = await Promise.all([
        BecomePartner.findAll({ where: partnerFilter, limit: fetchLimit, order, raw: true }),
        ContactUs.findAll({ where: contactFilter, limit: fetchLimit, order, raw: true }),
        Quote.findAll({ where: quoteFilter, limit: fetchLimit, order, raw: true }),
        Enquiry.findAll({ where: enquiryFilter, limit: fetchLimit, order, raw: true })
    ]);

    // Count everything for pagination
    const counts = await Promise.all([
        BecomePartner.count({ where: partnerFilter }),
        ContactUs.count({ where: contactFilter }),
        Quote.count({ where: quoteFilter }),
        Enquiry.count({ where: enquiryFilter })
    ]);
    const totalResults = counts.reduce((acc, curr) => acc + curr, 0);

    // Add source field and merge
    const merged = [
        ...partners.map(i => ({
            id: `partner_${i.id}`,
            original_id: i.id,
            source: 'Become Partner',
            name: i.name,
            email: i.email,
            phone: i.contact_number,
            location: i.city,
            info: i.partner_type, // Specific to Partner
            message: i.message,
            created_at: i.created_at
        })),
        ...contacts.map(i => ({
            id: `contact_${i.id}`,
            original_id: i.id,
            source: 'Contact Us',
            name: i.name,
            email: i.email,
            phone: i.phone_number,
            location: i.state,
            info: 'General Inquiry',
            message: i.message,
            created_at: i.created_at
        })),
        ...quotes.map(i => ({
            id: `quote_${i.id}`,
            original_id: i.id,
            source: 'Quote',
            name: i.name,
            email: i.email,
            phone: i.phone_number,
            location: 'N/A', // Quote doesn't have location fields in model
            info: i.product_type,
            message: i.additional_requirements,
            created_at: i.created_at
        })),
        ...enquiries.map(i => ({
            id: `enquiry_${i.id}`,
            original_id: i.id,
            source: 'Enquiry',
            name: i.name,
            email: i.email,
            phone: i.phone_number,
            location: `${i.city || ''}, ${i.state}`,
            info: i.product,
            message: i.message,
            created_at: i.created_at
        }))
    ];

    // Sort globally
    merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Assign sequential IDs after sorting (1, 2, 3, ...)
    merged.forEach((item, index) => {
        item.id = index + 1;
    });

    // Paginate merged array
    const results = merged.slice(offset, offset + limit);

    return {
        results,
        page,
        limit,
        totalPages: Math.ceil(totalResults / limit),
        totalResults
    };
};

module.exports = {
    getStats,
    getRecentSubmissions
};
