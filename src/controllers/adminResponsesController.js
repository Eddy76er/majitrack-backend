// src/controllers/adminResponsesController.js
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { createNotification } = require('../models/notificationModel');

// ========================
// Send a response to a report
// ========================
exports.sendResponse = async (req, res) => {
  try {
    // ✅ Admin's user_id is auto-captured from login session (or JWT middleware)
    const adminUserId = req.session.user_id; // Adjust if using JWT: req.user.user_id
    if (!adminUserId) {
      return res.status(401).json({ message: 'Unauthorized: Admin not logged in.' });
    }

    const { report_id, comments, status } = req.body;

    if (!report_id || !comments || !status) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // 1️⃣ Get user_id and water_source_id from the report
    const reportResult = await pool.query(
      'SELECT user_id, water_source_id FROM reports WHERE report_id = $1',
      [report_id]
    );

    if (reportResult.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    const { user_id, water_source_id } = reportResult.rows[0];

    if (!user_id || !water_source_id) {
      return res.status(500).json({ message: 'user_id or water_source_id missing in report.' });
    }

    // 2️⃣ Insert admin response with admin_user_id
    const response_id = uuidv4();
    const date_sent = new Date();

    const responseResult = await pool.query(
      `INSERT INTO admin_responses 
        (response_id, report_id, user_id, water_source_id, comments, status, date_sent, admin_user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [response_id, report_id, user_id, water_source_id, comments, status, date_sent, adminUserId]
    );

    // 3️⃣ Update report status
    await pool.query(
      'UPDATE reports SET status = $1 WHERE report_id = $2',
      [status, report_id]
    );

    // 4️⃣ Send notification to user
    await createNotification({
      user_id,
      report_id,
      message: comments,
      status,
    });

    res.status(201).json({
      message: '✅ Response sent successfully.',
      response: responseResult.rows[0],
    });

  } catch (error) {
    console.error('❌ Error sending response:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: '❌ Failed to send response.' });
  }
};

// ========================
// Get a response by report_id
// ========================
exports.getResponseByReportId = async (req, res) => {
  try {
    const { reportId } = req.params;

    const responseResult = await pool.query(
      'SELECT * FROM admin_responses WHERE report_id = $1',
      [reportId]
    );

    if (responseResult.rows.length === 0) {
      return res.status(404).json({ message: 'Response not found for this report ID.' });
    }

    res.status(200).json(responseResult.rows[0]);
  } catch (error) {
    console.error('❌ Error fetching response by reportId:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: '❌ Failed to fetch response.' });
  }
};

// ========================
// Get all responses for the logged-in admin
// ========================
exports.getResponsesForLoggedInAdmin = async (req, res) => {
  try {
    const adminUserId = req.session.user_id; // Or req.user.user_id if using JWT
    if (!adminUserId) {
      return res.status(401).json({ message: 'Unauthorized: Admin not logged in.' });
    }

    const result = await pool.query(
      `SELECT 
         ar.response_id,
         u.name AS resident_name,
         u.phone_number AS resident_phone,
         ws.water_source_type,
         ar.comments,
         ar.status,
         ar.date_sent
       FROM admin_responses ar
       JOIN users u ON ar.user_id = u.user_id
       JOIN water_sources ws ON ar.water_source_id = ws.water_source_id
       WHERE ar.admin_user_id = $1
       ORDER BY ar.date_sent DESC`,
      [adminUserId]
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error('❌ Error fetching admin responses:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: '❌ Failed to fetch admin responses.' });
  }
};
