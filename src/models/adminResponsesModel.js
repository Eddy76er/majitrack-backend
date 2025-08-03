// adminResponsesModel.js

const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { createNotification } = require('./notificationModel');

const sendResponse = async ({ report_id, comments, status }) => {
  const parsedReportId = parseInt(report_id, 10);
  const date_sent = new Date();

  if (!parsedReportId || !comments || !status) {
    throw new Error('Missing required fields.');
  }

  // 1. Get user_id from the report
  const reportResult = await db.query(
    'SELECT user_id FROM reports WHERE report_id = $1',
    [parsedReportId]
  );

  if (reportResult.rows.length === 0) {
    throw new Error('Report not found.');
  }

  const { user_id } = reportResult.rows[0];
  const response_id = uuidv4();

  // 2. Insert the admin response
  await db.query(
    `INSERT INTO admin_responses (response_id, report_id, user_id, comments, status, date_sent)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [response_id, parsedReportId, user_id, comments, status, date_sent]
  );

  // 3. Update the report's status
  await db.query(
    `UPDATE reports SET status = $1 WHERE report_id = $2`,
    [status, parsedReportId]
  );

  // 4. Create notification for the user
  await createNotification({
    user_id,
    report_id: parsedReportId,
    message: comments,
    status,
    date_received: date_sent
  });

  return { message: 'Response and notification successfully processed.' };
};

module.exports = {
  sendResponse
};
