import { constants } from "../../utils/contants.js";
import db from "../../config/db";
import multer from "multer";
import _ from "lodash";

//last modified: get all annoucement receivers on announcement tab

export const announcementReceivers = async (req, res) => {
  try {
    const announcementid = req.params.id;
    const categoryname = "Announcement";
    const sqlQuerySelect =
      "SELECT tbl_sending.*, CONCAT(tbl_account.ACCOUNT_FIRSTNAME, ' ', tbl_account.ACCOUNT_LASTNAME) As RECEIVER_NAME FROM tbl_sending " +
      "INNER JOIN tbl_account ON tbl_sending.RECEIVER_ID = tbl_account.ACCOUNT_ID " +
      "INNER JOIN tbl_announcement ON tbl_announcement.ANNOUNCEMENT_ID = tbl_sending.DOCUMENT_ID " +
      "WHERE tbl_announcement.ANNOUNCEMENT_ID = ? AND tbl_announcement.ANNOUNCEMENT_STATUS != 2 AND tbl_sending.CATEGORY_NAME = ? AND tbl_sending.SEND_STATUS != 2 ORDER BY tbl_sending.SEND_ID DESC";
    db.query(sqlQuerySelect, [announcementid, categoryname], (err, result) => {
      if (err) {
        res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err });
      }

      if (result.length > 0) {
        res.status(constants.STATUS_CODES.SUCCESS).json({ result: result });
      } else {
        res
          .status(constants.STATUS_CODES.NOT_FOUND)
          .json({ message: "Document has no item" });
      }
    });
  } catch (error) {
    res
      .status(constants.STATUS_CODES.SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const deleteAnnouncementReceivers = async (req, res) => {
  try {
    const announcementid = req.body.announcement_id;
    const sendid = req.body.send_id;
    const categoryname = "Announcement";
    const sendstatus = "2";

    console.log(req.body);

    const sqlQueryUpdate =
      "UPDATE tbl_sending SET SEND_STATUS = ? WHERE SEND_ID = ?";

    db.query(sqlQueryUpdate, [sendstatus, sendid], (err, result) => {
      if (err) {
        res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err });
      } else {
        const sqlQuerySelect =
          "SELECT tbl_sending.*, CONCAT(tbl_account.ACCOUNT_FIRSTNAME, ' ', tbl_account.ACCOUNT_LASTNAME) As RECEIVER_NAME FROM tbl_sending " +
          "INNER JOIN tbl_account ON tbl_sending.RECEIVER_ID = tbl_account.ACCOUNT_ID " +
          "INNER JOIN tbl_announcement ON tbl_announcement.ANNOUNCEMENT_ID = tbl_sending.DOCUMENT_ID " +
          "WHERE tbl_announcement.ANNOUNCEMENT_ID = ? AND tbl_announcement.ANNOUNCEMENT_STATUS != 2 AND tbl_sending.CATEGORY_NAME = ? AND tbl_sending.SEND_STATUS != 2 ORDER BY tbl_sending.SEND_ID DESC";
        db.query(
          sqlQuerySelect,
          [announcementid, categoryname],
          (err1, result1) => {
            if (err1) {
              res
                .status(constants.STATUS_CODES.SERVER_ERROR)
                .json({ message: err1 });
            } else {
              if (result1.length > 0) {
                res
                  .status(constants.STATUS_CODES.SUCCESS)
                  .json({ result: result1 });
              } else {
                res
                  .status(constants.STATUS_CODES.NOT_FOUND)
                  .json({ message: err1 });
              }
            }
          }
        );
      }
    });
  } catch (error) {
    res
      .status(constants.STATUS_CODES.SERVER_ERROR)
      .json({ message: error.message });
  }
};
