import { constants } from "../../utils/contants.js";
import db from "../../config/db";

export const fetchArchive = async (req, res) => {
  try {
    const sqlQuery =
      "SELECT tbl_account.*, tbl_department.DEPT_NAME FROM tbl_account INNER JOIN tbl_department ON tbl_account.DEPT_ID = tbl_department.DEPT_ID WHERE tbl_account.ACCOUNT_STATUS = 2 ORDER BY tbl_account.ACCOUNT_ID DESC";
    db.query(sqlQuery, (err, result) => {
      if (err) {
        res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err });
      } else {
        res.status(constants.STATUS_CODES.SUCCESS).json({
          result: result,
        });
      }
    });
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};

export const restoreAccount = async (req, res) => {
  try {
    console.log("res");
    const accountid = req.body.account_id;
    const accountstatus = "1";
    const userid = req.body.user_id;
    const lastname = req.body.account_lastname;
    const firstname = req.body.account_firstname;
    const activity = "Restored account " + firstname + " " + lastname;

    const sqlQuery =
      "UPDATE tbl_account SET ACCOUNT_STATUS = ? WHERE ACCOUNT_ID = ?";
    db.query(sqlQuery, [accountstatus, accountid], (err, result) => {
      if (err) {
        res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err });
      } else {
        const auditQuery =
          "INSERT INTO tbl_audit (ACCOUNT_ID, AUDIT_ACTIVITY) VALUES (?, ?)";
        db.query(auditQuery, [userid, activity], (errAudit, resultAudit) => {
          if (errAudit) {
            console.log(errAudit);
          }
        });
        const sqlQuerySelect =
          "SELECT tbl_account.*, tbl_department.DEPT_NAME FROM tbl_account INNER JOIN tbl_department ON tbl_account.DEPT_ID = tbl_department.DEPT_ID WHERE ACCOUNT_STATUS = 2 ORDER BY tbl_account.ACCOUNT_ID DESC";

        db.query(sqlQuerySelect, (err1, result1) => {
          if (err1) {
            res
              .status(constants.STATUS_CODES.SERVER_ERROR)
              .json({ message: err1 });
          }

          res
            .status(constants.STATUS_CODES.SUCCESS)
            .json({
              result: Object.values(JSON.parse(JSON.stringify(result1))),
            });
        });
      }
    });
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};
