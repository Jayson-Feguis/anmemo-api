import { constants } from "../../utils/contants.js";
import db from "../../config/db";

export const getAudit = async (req, res) => {
  try {
    const sqlQuery =
      "SELECT tbl_audit.*, tbl_account.ACCOUNT_FIRSTNAME, tbl_account.ACCOUNT_MIDDLENAME ,tbl_account.ACCOUNT_LASTNAME FROM tbl_audit INNER JOIN tbl_account ON tbl_audit.ACCOUNT_ID = tbl_account.ACCOUNT_ID";

    db.query(sqlQuery, (err, result) => {
      if (err) {
        res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err });
      }

      res.status(constants.STATUS_CODES.SUCCESS).json({ result: result });
    });
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};
