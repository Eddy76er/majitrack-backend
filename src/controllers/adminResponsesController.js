const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const RESPONSE_MESSAGES = {
  MISSING_FIELDS: 'Missing required fields.',
  INVALID_STATUS: 'Invalid status value.',
  REPORT_NOT_FOUND: 'Report not found.',
  SUCCESS: 'Response sent successfully.',
  FAILED: 'Failed to send response.'
};

const VALID_STATUSES = ['pending', 'resolved', 'rejected'];

exports.sendResponse = async (req, res) => {
  const { report_id, comments, status } = req.body;

  if (!report_id || !comments || !status) {
    return res.status(400).json({ message: RESPONSE_MESSAGES.MISSING_FIELDS });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ message: RESPONSE_MESSAGES.INVALID_STATUS });
  }

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // 1. Fetch report
    const reportResult = await client.query(
      'SELECT user_id FROM reports WHERE report_id = $1',
      [report_id]
    );
    
    if (reportResult.rows.length === 0) {
      return res.status(404).json({ message: RESPONSE_MESSAGES.REPORT_NOT_FOUND });
    }
    
    const { user_id } = reportResult.rows[0];
    const response_id = uuidv4();
    const date_sent = new Date();

    // 2. Insert response
    await client.query(
      `INSERT INTO admin_responses 
       (response_id, report_id, user_id, comments, status, date_sent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [response_id, report_id, user_id, comments, status, date_sent]
    );

    // 3. Update report status
    await client.query(
      `UPDATE reports SET status = $1 WHERE report_id = $2`,
      [status, report_id]
    );

    // 4. Insert notification
    const notification_id = uuidv4();
    const message = `Your report (ID: ${report_id}) was updated: ${comments}`;
    
    await client.query(
      `INSERT INTO notifications 
       (notification_id, user_id, report_id, message, status, date_received)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [notification_id, user_id, report_id, message, status, date_sent]
    );

    await client.query('COMMIT');
    res.status(201).json({ message: RESPONSE_MESSAGES.SUCCESS });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Error processing report ${report_id}:`, error.message);
    res.status(500).json({ message: RESPONSE_MESSAGES.FAILED });
  } finally {
    client.release();
  }
};