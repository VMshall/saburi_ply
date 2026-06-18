const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit-table');

/**
 * Generate CSV from data
 * @param {Array} data
 * @param {Array} fields
 * @returns {string}
 */
const generateCsv = (data, fields) => {
    const json2csvParser = new Parser({ fields });
    return json2csvParser.parse(data);
};

/**
 * Generate PDF from data
 * @param {Array} data
 * @param {string} title
 * @param {Object} res - Express response object
 * @param {Array} [fields] - Optional fields to include in export
 */
const generatePdf = async (data, title, res, fields) => {
    // Determine orientation based on number of columns
    const columnsCount = fields ? fields.length : (data.length > 0 ? Object.keys(data[0]).length : 0);
    const layout = columnsCount > 6 ? 'landscape' : 'portrait';

    const doc = new PDFDocument({ margin: 30, size: 'A4', layout });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${title.toLowerCase().replace(/ /g, '_')}.pdf`);

    doc.pipe(res);

    // Title
    doc.fontSize(18).text(title, { align: 'center' });
    doc.moveDown();

    if (data.length === 0) {
        doc.fontSize(12).text('No data available to export.', { align: 'center' });
    } else {
        // Prepare table data
        const tableFields = fields || Object.keys(data[0] && typeof data[0].toJSON === 'function' ? data[0].toJSON() : (data[0] || {}));

        const table = {
            title: "",
            subtitle: "",
            headers: tableFields.map(field => ({
                label: field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                property: field,
                width: 0, // Auto width
                renderer: null
            })),
            datas: data.map(item => {
                const plainItem = (item && typeof item.toJSON === 'function') ? item.toJSON() : item;
                // Ensure all requested fields exist in the object
                const row = {};
                tableFields.forEach(field => {
                    row[field] = (plainItem[field] === null || plainItem[field] === undefined) ? '-' : String(plainItem[field]);
                });
                return row;
            }),
        };

        // Render table
        await doc.table(table, {
            prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
            prepareRow: () => doc.font("Helvetica").fontSize(8),
        });
    }

    doc.end();
};

module.exports = {
    generateCsv,
    generatePdf
};
