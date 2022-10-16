import { constants } from "../../utils/contants.js";
import db from "../../config/db";

export const getNotification = async (req, res) => {
  try {
    const accountid = req.params.id;
    const notif_deleted = 0;

    const sqlQuery =
      "SELECT tbl_notification.*, tbl_account.ACCOUNT_FIRSTNAME, tbl_account.ACCOUNT_LASTNAME FROM tbl_notification INNER JOIN tbl_account ON tbl_notification.SENDER_ID = tbl_account.ACCOUNT_ID WHERE tbl_notification.RECEIVER_ID = ? AND tbl_notification.NOTIF_STATUS != ? ORDER BY tbl_notification.NOTIF_ID DESC";

    db.query(sqlQuery, [accountid, notif_deleted], (err, result) => {
      if (err) {
        res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err });
      }

      res.status(constants.STATUS_CODES.SUCCESS).json({ result: result });
    });
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};

export const updateNotification = async (req, res) => {
  try {
    const notifid = req.body.notif_id;
    const accountid = req.body.account_id;
    const notifstatus = 2;
    const notif_deleted = 0;
    let i = 1;

    const sqlQuery =
      "UPDATE tbl_notification SET NOTIF_STATUS = ? WHERE NOTIF_ID = ?";

    notifid.forEach((item) => {
      db.query(sqlQuery, [notifstatus, item], (err, result) => {
        if (err) {
          res
            .status(constants.STATUS_CODES.SERVER_ERROR)
            .json({ message: err });
        } else {
          if (notifid.length === i) {
            const sqlQuerySelect =
              "SELECT tbl_notification.*, tbl_account.ACCOUNT_FIRSTNAME, tbl_account.ACCOUNT_LASTNAME FROM tbl_notification INNER JOIN tbl_account ON tbl_notification.SENDER_ID = tbl_account.ACCOUNT_ID WHERE tbl_notification.RECEIVER_ID = ? AND tbl_notification.NOTIF_STATUS != ? ORDER BY tbl_notification.NOTIF_ID DESC";

            db.query(
              sqlQuerySelect,
              [accountid, notif_deleted],
              (err, result) => {
                if (err) {
                  res
                    .status(constants.STATUS_CODES.SERVER_ERROR)
                    .json({ message: err });
                } else {
                  res
                    .status(constants.STATUS_CODES.SUCCESS)
                    .json({ result: result });
                }
              }
            );
          }
        }
        i = i + 1;
      });
    });
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notifid = req.body.notif_id;
    const accountid = req.body.account_id;
    const notifstatus = 2;
    const notif_deleted = 0;
    let i = 0;

    notifid.forEach(async (item) => {
      const sqlQuery =
        "UPDATE tbl_notification SET NOTIF_STATUS = ? WHERE NOTIF_ID = ?";

      db.query(sqlQuery, [notif_deleted, item], async (err, result) => {
        if (err) {
          res
            .status(constants.STATUS_CODES.SERVER_ERROR)
            .json({ message: err });
        } else {
          i = i + 1;
          if (notifid.length === i) {
            const sqlQuerySelect =
              "SELECT tbl_notification.*, tbl_account.ACCOUNT_FIRSTNAME, tbl_account.ACCOUNT_LASTNAME FROM tbl_notification INNER JOIN tbl_account ON tbl_notification.SENDER_ID = tbl_account.ACCOUNT_ID WHERE tbl_notification.RECEIVER_ID = ? AND tbl_notification.NOTIF_STATUS != ? ORDER BY tbl_notification.NOTIF_ID DESC";

            db.query(
              sqlQuerySelect,
              [accountid, notif_deleted],
              (err1, result1) => {
                if (err1) {
                  res
                    .status(constants.STATUS_CODES.SERVER_ERROR)
                    .json({ message: err1 });
                } else {
                  res
                    .status(constants.STATUS_CODES.SUCCESS)
                    .json({ result: result1 });
                }
              }
            );
          }
        }
      });
    });
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};
