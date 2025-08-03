const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.sendResponse = async (req, res) => {
  const { comments, status } = req.body;
  const { report_id } = req.body; // Get report_id from query string
  const date_sent = new Date();

  // Basic validation
  if (!report_id || !comments || !status) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    // 1. Fetch report to get user_id
    const reportResult = await pool.query(
      'SELECT user_id FROM reports WHERE report_id = $1',
      [report_id]
    );

    if (reportResult.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    const { user_id } = reportResult.rows[0];
    const response_id = uuidv4();

    // 2. Insert response (admin_responses table)
    await pool.query(
      `INSERT INTO admin_responses (response_id, report_id, user_id, comments, status, date_sent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [response_id, report_id, user_id, comments, status, date_sent]
    );

    // 3. Update status of the report
    await pool.query(
      `UPDATE reports SET status = $1 WHERE report_id = $2`,
      [status, report_id]
    );

    // 4. Send notification to the user
    const notification_id = uuidv4();
    await pool.query(
      `INSERT INTO notifications (notification_id, user_id, report_id, message, status, date_received)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [notification_id, user_id, report_id, comments, status, date_sent]
    );

    res.status(201).json({ message: 'Response sent successfully.' });
  } catch (error) {
    console.error('Error sending response:', error.message);
    res.status(500).json({ message: 'Failed to send response.' });
  }
};
