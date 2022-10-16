import { constants } from "../../utils/contants.js";
import db from "../../config/db";
import _ from "lodash";

export const getAnnouncement = async (req, res) => {
  try {
    const accountid = req.params.id;

    fetchAll(accountid, req, res);
  } catch (error) {
    res
      .status(constants.STATUS_CODES.SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const addAnnouncement = async (req, res) => {
  try {
    if (!_.isNil(req.body)) {
      const accountid = req.body.account_id;
      const announcementtitle = req.body.announcement_title;
      const announcementcontent = req.body.announcement_content;
      const announcementstatus = 1;
      const activity = "Added anouncement" + " " + announcementtitle;
      const sqlQuery =
        "INSERT INTO tbl_announcement (ACCOUNT_ID, ANNOUNCEMENT_TITLE, ANNOUNCEMENT_CONTENT, ANNOUNCEMENT_STATUS) values (?,?,?,?)";
      db.query(
        sqlQuery,
        [accountid, announcementtitle, announcementcontent, announcementstatus],
        (err, result) => {
          if (err) {
            res
              .status(constants.STATUS_CODES.SERVER_ERROR)
              .json({ message: err });
          } else {
            const auditQuery =
              "INSERT INTO tbl_audit (ACCOUNT_ID, AUDIT_ACTIVITY) VALUES (?, ?)";
            db.query(
              auditQuery,
              [accountid, activity],
              (errAudit, resultAudit) => {
                if (errAudit) {
                  console.log(errAudit);
                }
              }
            );

            fetchAll(accountid, req, res);
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

export const updateAnnouncement = async (req, res) => {
  try {
    if (!_.isNil(req.body)) {
      const accountid = req.body.account_id;
      const announcementid = req.body.announcement_id;
      const announcementtitle = req.body.announcement_title;
      const announcementcontent = req.body.announcement_content;
      const activity = "Updated anouncement" + " " + announcementtitle;
      const sqlQuery =
        "UPDATE tbl_announcement SET ANNOUNCEMENT_TITLE = ?, ANNOUNCEMENT_CONTENT = ? WHERE ANNOUNCEMENT_ID = ?";
      db.query(
        sqlQuery,
        [announcementtitle, announcementcontent, announcementid],
        (err, result) => {
          if (err) {
            res
              .status(constants.STATUS_CODES.SERVER_ERROR)
              .json({ message: err });
          } else {
            const auditQuery =
              "INSERT INTO tbl_audit (ACCOUNT_ID, AUDIT_ACTIVITY) VALUES (?, ?)";
            db.query(
              auditQuery,
              [accountid, activity],
              (errAudit, resultAudit) => {
                if (errAudit) {
                  console.log(errAudit);
                }
              }
            );
            fetchAll(accountid, req, res);
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

export const deleteAnnouncement = async (req, res) => {
  try {
    const accountid = req.body.account_id;
    const announcementid = req.body.announcement_id;
    const announcementStatus = 2;
    const announcementtitle = req.body.announcement_title;
    const activity = "Deleted anouncement" + " " + announcementtitle;
    const sqlQuery =
      "UPDATE tbl_announcement SET ANNOUNCEMENT_STATUS = ? WHERE ANNOUNCEMENT_ID = ?";
    db.query(sqlQuery, [announcementStatus, announcementid], (err, result) => {
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
        fetchAll(accountid, req, res);
      }
    });
  } catch (error) {
    res
      .status(constants.STATUS_CODES.SERVER_ERROR)
      .json({ message: error.message });
  }
};

const fetchAll = async (accountid, req, res) => {
  const sqlQuerySelect =
    "SELECT * FROM tbl_announcement WHERE ACCOUNT_ID = ? AND ANNOUNCEMENT_STATUS != 2 ORDER BY ANNOUNCEMENT_ID DESC";

  db.query(sqlQuerySelect, [accountid], (err1, result1) => {
    if (err1) {
      res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err1 });
    }

    if (result1.length > 0) {
      res.status(constants.STATUS_CODES.SUCCESS).json({ result: result1 });
    } else {
      res
        .status(constants.STATUS_CODES.NOT_FOUND)
        .json({ message: "Announcement has no item" });
    }
  });
};
