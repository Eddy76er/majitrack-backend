const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.sendAdminResponse = async (req, res) => {
  const { report_id, comments, status } = req.body;

  if (!report_id || !comments || !status) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const reportResult = await pool.query(
      'SELECT user_id FROM reports WHERE report_id = $1',
      [report_id]
    );

    if (reportResult.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    const { user_id } = reportResult.rows[0];
    const response_id = uuidv4();
    const date_sent = new Date();

    await pool.query(
      `INSERT INTO admin_responses (response_id, report_id, user_id, comments, status, date_sent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [response_id, report_id, user_id, comments, status, date_sent]
    );

    await pool.query(
      `UPDATE reports SET status = $1 WHERE report_id = $2`,
      [status, report_id]
    );

    const notification_id = uuidv4();
    await pool.query(
      `INSERT INTO notifications (notification_id, user_id, report_id, message, status, date_received)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [notification_id, user_id, report_id, comments, status, date_sent]
    );

    res.status(201).json({ message: 'Response sent successfully.' });
  } catch (error) {
    console.error('Error sending response:', error);
    res.status(500).json({ message: 'Failed to send response.' });
  }
};
