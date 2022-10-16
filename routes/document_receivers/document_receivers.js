import { constants } from "../../utils/contants.js";
import db from "../../config/db";
import multer from "multer";
import _ from "lodash";

export const documentReceivers = async (req, res) => {
  try {
    const documentid = req.body.document_id;
    const categoryname = req.body.category_name;
    const sqlQuerySelect =
      "SELECT tbl_sending.*, CONCAT(tbl_account.ACCOUNT_FIRSTNAME, ' ', tbl_account.ACCOUNT_LASTNAME) As RECEIVER_NAME FROM tbl_sending " +
      "INNER JOIN tbl_account ON tbl_sending.RECEIVER_ID = tbl_account.ACCOUNT_ID " +
      "INNER JOIN tbl_document ON tbl_document.DOCUMENT_ID = tbl_sending.DOCUMENT_ID " +
      "WHERE tbl_sending.DOCUMENT_ID = ? AND tbl_document.DOCUMENT_STATUS != 2 AND tbl_sending.CATEGORY_NAME = ? AND tbl_sending.SEND_STATUS != 2 ORDER BY tbl_sending.SEND_ID DESC";
    db.query(sqlQuerySelect, [documentid, categoryname], (err, result) => {
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

export const deleteDocumentReceivers = async (req, res) => {
  try {
    const documentid = req.body.document_id;
    const sendid = req.body.send_id;
    const categoryname = req.body.category_name;
    const sendstatus = "2";

    const sqlQueryUpdate =
      "UPDATE tbl_sending SET SEND_STATUS = ? WHERE SEND_ID = ?";
    db.query(sqlQueryUpdate, [sendstatus, sendid], (err, result) => {
      if (err) {
        res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err });
      } else {
        const sqlQuerySelect =
          "SELECT tbl_sending.*, CONCAT(tbl_account.ACCOUNT_FIRSTNAME, ' ', tbl_account.ACCOUNT_LASTNAME) As RECEIVER_NAME FROM tbl_sending " +
          "INNER JOIN tbl_account ON tbl_sending.RECEIVER_ID = tbl_account.ACCOUNT_ID " +
          "INNER JOIN tbl_document ON tbl_document.DOCUMENT_ID = tbl_sending.DOCUMENT_ID " +
          "WHERE tbl_sending.DOCUMENT_ID = ? AND tbl_document.DOCUMENT_STATUS != 2 AND tbl_sending.CATEGORY_NAME = ? AND tbl_sending.SEND_STATUS != 2 ORDER BY tbl_sending.SEND_ID DESC";
        db.query(
          sqlQuerySelect,
          [documentid, categoryname],
          (err1, result1) => {
            if (err1) {
              res
                .status(constants.STATUS_CODES.SERVER_ERROR)
                .json({ message: "1: " + err1 });
            }

            if (result1.length > 0) {
              res
                .status(constants.STATUS_CODES.SUCCESS)
                .json({ result: result1 });
            } else {
              res
                .status(constants.STATUS_CODES.SERVER_ERROR)
                .json({ message: "2: " + err1 });
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
