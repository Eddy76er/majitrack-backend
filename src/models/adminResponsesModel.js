// models/adminResponsesModel.js
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

/**
 * Insert a new admin response into the database.
 * 
 * @param {Object} params - Response data.
 * @param {string} params.report_id - The ID of the report being responded to.
 * @param {string} params.user_id - The ID of the resident receiving the response.
 * @param {string} params.water_source_id - The water source related to the report.
 * @param {string} params.comments - The admin's response comments.
 * @param {string} params.status - The status of the report after response (default: 'resolved').
 * @param {string} params.admin_user_id - The ID of the admin sending the response.
 * @returns {Promise<Object>} The inserted response row.
 */
const sendResponse = async ({ report_id, user_id, water_source_id, comments, status = 'resolved', admin_user_id }) => {
  const response_id = uuidv4();
  const date_sent = new Date(); // Auto-captured

  const result = await db.query(
    `INSERT INTO admin_responses 
      (response_id, report_id, user_id, water_source_id, comments, status, date_sent, admin_user_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [response_id, report_id, user_id, water_source_id, comments, status, date_sent, admin_user_id]
  );

  return result.rows[0];
};

/**
 * Fetch a single response by report_id.
 * 
 * @param {string} report_id - The ID of the report.
 * @returns {Promise<Object|null>} The matching response, or null if not found.
 */
const getResponseByReportId = async (report_id) => {
  const result = await db.query(
    `SELECT ar.*, u.name AS resident_name, u.phone_number, ws.water_source_type
     FROM admin_responses ar
     JOIN users u ON ar.user_id = u.user_id
     JOIN water_sources ws ON ar.water_source_id = ws.water_source_id
     WHERE ar.report_id = $1`,
    [report_id]
  );
  return result.rows[0] || null;
};

/**
 * Fetch all responses sent by a specific admin.
 * 
 * @param {string} admin_user_id - The ID of the admin.
 * @returns {Promise<Array>} List of responses.
 */
const getResponsesByAdminId = async (admin_user_id) => {
  const result = await db.query(
    `SELECT 
        ar.response_id,
        u.name AS resident_name,
        u.phone_number,
        ws.water_source_type,
        ar.comments,
        ar.status,
        ar.date_sent
     FROM admin_responses ar
     JOIN users u ON ar.user_id = u.user_id
     JOIN water_sources ws ON ar.water_source_id = ws.water_source_id
     WHERE ar.admin_user_id = $1
     ORDER BY ar.date_sent DESC`,
    [admin_user_id]
  );
  return result.rows;
};

module.exports = {
  sendResponse,
  getResponseByReportId,
  getResponsesByAdminId
};

