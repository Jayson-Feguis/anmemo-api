import { constants } from "../../utils/contants.js";
import db from "../../config/db";
import multer from "multer";
import _ from "lodash";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }).array("files");

export const uploadDocument = async (req, res) => {
  try {
    const allfiles = [];

    upload(req, res, (err) => {
      const accountid = req.body.accountid;
      const category = req.body.categoryname;

      if (err) {
        return res
          .status(constants.STATUS_CODES.SERVER_ERROR)
          .json({ message: err });
      }

      let i = 0;
      req.files.forEach((value) => {
        allfiles.push(value.originalname);
        const filetype = value.originalname.split(".").pop();
        const activity = "Uploaded " + value.originalname;
        const sqlQuery =
          "INSERT INTO tbl_document (ACCOUNT_ID, DOCUMENT_NAME, DOCUMENT_TYPE, DOCUMENT_STATUS, CATEGORY_NAME) values (?,?,?,?,?)";
        db.query(
          sqlQuery,
          [accountid, value.originalname, filetype, 1, category],
          (err, result) => {
            if (err) {
              res
                .status(constants.STATUS_CODES.SERVER_ERROR)
                .json({ message: err });
            }
          }
        );

        const auditQuery =
          "INSERT INTO tbl_audit (ACCOUNT_ID, AUDIT_ACTIVITY) VALUES (?, ?)";
        db.query(auditQuery, [accountid, activity], (errAudit, resultAudit) => {
          if (errAudit) {
            console.log(errAudit);
          }
        });

        i++;
        const sqlQuerySelect =
          "SELECT tbl_document.*, CONCAT(tbl_account.ACCOUNT_FIRSTNAME, ' ', tbl_account.ACCOUNT_LASTNAME) as UPLOADED_BY FROM tbl_document INNER JOIN tbl_account ON tbl_account.ACCOUNT_ID = tbl_document.ACCOUNT_ID WHERE tbl_document.ACCOUNT_ID = ? AND tbl_document.DOCUMENT_STATUS != 2 ORDER BY tbl_document.DOCUMENT_ID DESC";
        if (req.files.length === i) {
          db.query(sqlQuerySelect, [accountid], (err1, result1) => {
            if (err1) {
              res
                .status(constants.STATUS_CODES.SERVER_ERROR)
                .json({ message: err1 });
            }

            if (result1.length > 0) {
              res
                .status(constants.STATUS_CODES.SUCCESS)
                .json({ result: result1 });
            } else {
              res
                .status(constants.STATUS_CODES.NOT_FOUND)
                .json({ message: "Document has no item" });
            }
          });
        }
      });
    });
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const accountid = req.body.account_id;
    const sqlQuerySelect =
      "SELECT tbl_document.*, CONCAT(tbl_account.ACCOUNT_FIRSTNAME, ' ', tbl_account.ACCOUNT_LASTNAME) as UPLOADED_BY FROM tbl_document INNER JOIN tbl_account ON tbl_account.ACCOUNT_ID = tbl_document.ACCOUNT_ID WHERE tbl_document.ACCOUNT_ID = ? AND tbl_document.DOCUMENT_STATUS != 2 ORDER BY tbl_document.DOCUMENT_ID DESC";
    db.query(sqlQuerySelect, [accountid], (err1, result1) => {
      if (err1) {
        res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err1 });
      }

      res.status(constants.STATUS_CODES.SUCCESS).json({ result: result1 });
    });
  } catch (error) {
    res
      .status(constants.STATUS_CODES.SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const sendDocuments = async (req, res) => {
  try {
    const senderid = req.body.sender_id;
    const sendername = req.body.sender_name;
    const documentid = req.body.document_id;
    const documentname = req.body.document_name;
    const receiver = req.body.receiver;
    const category_name = req.body.category_name;
    const urgency_level = req.body.urgencyLevel;
    const permission = 0;
    const notif_status = 1;
    const notif_title = "New notification";
    let notif_content = "";
    const account_id = req.body.sender_id;
    const activity = "Sent " + category_name + " " + documentname;
    const sendstatus = 1;

    let old_receiver = [];

    if (category_name === "Document") {
      notif_content =
        sendername + " sent you a file.\n\nDocument: " + documentname;
    } else if (category_name === "Memorandum") {
      notif_content =
        sendername + " sent you a file.\n\nMemorandum: " + documentname;
    } else if (category_name === "Announcement") {
      notif_content =
        sendername + "sent you a file.\n\nAnnouncement: " + documentname;
    }

    if (!_.isNil(req.body) && category_name !== "") {
      const auditQuery =
        "INSERT INTO tbl_audit (ACCOUNT_ID, AUDIT_ACTIVITY) VALUES (?, ?)";
      db.query(auditQuery, [account_id, activity], (errAudit, resultAudit) => {
        if (errAudit) {
          console.log(errAudit);
        }
      });

      const oldReceiverSelectQuery =
        "SELECT RECEIVER_ID FROM tbl_sending WHERE DOCUMENT_ID = ? AND SEND_STATUS != 2 AND CATEGORY_NAME = ?";
      db.query(
        oldReceiverSelectQuery,
        [documentid, category_name],
        async (errOld, resultOld) => {
          if (errOld) {
            res
              .status(constants.STATUS_CODES.SERVER_ERROR)
              .json({ message: errOld });
          } else {
            await resultOld.map((old) => old_receiver.push(old.RECEIVER_ID));
            receiver.forEach(async (value, i) => {
              const isExist = await old_receiver.some(
                (old) => value.ACCOUNT_ID === old
              );
              if (!isExist) {
                const sqlQueryInsert =
                  "INSERT INTO tbl_sending (SENDER_ID, DOCUMENT_ID, CATEGORY_NAME, URGENCY_LEVEL, RECEIVER_ID, SEND_STATUS) values (?,?,?,?,?,?)";
                db.query(
                  sqlQueryInsert,
                  [
                    senderid,
                    documentid,
                    category_name,
                    urgency_level,
                    value.ACCOUNT_ID,
                    sendstatus,
                  ],
                  (err2, result) => {
                    if (err2) {
                      res
                        .status(constants.STATUS_CODES.SERVER_ERROR)
                        .json({ message: err2 });
                    }
                  }
                );

                const sqlQueryInsertNotif =
                  "INSERT INTO tbl_notification(SENDER_ID, RECEIVER_ID, NOTIF_TITLE, NOTIF_CONTENT, NOTIF_STATUS, URGENCY_LEVEL) VALUES (?,?,?,?,?,?)";
                db.query(
                  sqlQueryInsertNotif,
                  [
                    senderid,
                    value.ACCOUNT_ID,
                    notif_title,
                    notif_content,
                    notif_status,
                    urgency_level,
                  ],
                  (err3, result) => {
                    if (err3) {
                      res
                        .status(constants.STATUS_CODES.SERVER_ERROR)
                        .json({ message: err3 });
                    } else {
                      if (receiver.length - 1 === i) {
                        const sqlQuerySelect =
                          "SELECT * FROM tbl_document WHERE ACCOUNT_ID = ? AND DOCUMENT_STATUS != 2";

                        db.query(
                          sqlQuerySelect,
                          [senderid],
                          (err5, result1) => {
                            if (err5) {
                              res
                                .status(constants.STATUS_CODES.SERVER_ERROR)
                                .json({ message: err5 });
                            }
                            console.log("Done: " + i);
                            if (result1.length > 0) {
                              res
                                .status(constants.STATUS_CODES.SUCCESS)
                                .json({ result: result1 });
                            } else {
                              res
                                .status(constants.STATUS_CODES.NOT_FOUND)
                                .json({ message: "Document has no item" });
                            }
                          }
                        );
                      }
                    }
                  }
                );
              }
            });
          }
        }
      );
    }
  } catch (error) {
    res
      .status(constants.STATUS_CODES.SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const documentid = req.body.document_id;
    const accountid = req.body.account_id;
    const deleteStatus = 0;
    const documentname = req.body.document_name;
    const activity = "Deleted " + documentname;
    // const activity
    const sqlQuery =
      "UPDATE tbl_document SET DOCUMENT_STATUS = ? WHERE DOCUMENT_ID = ?";

    db.query(sqlQuery, [deleteStatus, documentid], (err, result) => {
      if (err) {
        res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err });
      } else {
        const auditQuery =
          "INSERT INTO tbl_audit (ACCOUNT_ID, AUDIT_ACTIVITY) VALUES (?, ?)";
        db.query(auditQuery, [accountid, activity], (errAudit, resultAudit) => {
          if (errAudit) {
            console.log(errAudit);
          }
        });
        const sqlQuerySelect =
          "SELECT tbl_document.*, CONCAT(tbl_account.ACCOUNT_FIRSTNAME, ' ', tbl_account.ACCOUNT_LASTNAME) as UPLOADED_BY FROM tbl_document INNER JOIN tbl_account ON tbl_account.ACCOUNT_ID = tbl_document.ACCOUNT_ID WHERE tbl_document.ACCOUNT_ID = ? AND tbl_document.DOCUMENT_STATUS != 2 ORDER BY tbl_document.DOCUMENT_ID DESC";
        db.query(sqlQuerySelect, [accountid], (err1, result1) => {
          if (err1) {
            res
              .status(constants.STATUS_CODES.SERVER_ERROR)
              .json({ message: err1 });
          }

          if (result1.length > 0) {
            res
              .status(constants.STATUS_CODES.SUCCESS)
              .json({ result: result1 });
          } else {
            res
              .status(constants.STATUS_CODES.NOT_FOUND)
              .json({ message: "Document has no item" });
          }
        });
      }
    });
  } catch (error) {
    res
      .status(constants.STATUS_CODES.SERVER_ERROR)
      .json({ message: error.message });
  }
};
