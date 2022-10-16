import { constants } from "../../utils/contants.js";
import db from "../../config/db";
export const getDepartmentcount = async (req, res) => {
  try {
    const sqlQuery =
      "SELECT tbl_department.DEPT_NAME, COUNT(*) AS EMPLOYEE FROM tbl_department INNER JOIN tbl_account ON tbl_department.DEPT_ID = tbl_account.DEPT_ID WHERE tbl_department.DEPT_STATUS != 2 AND tbl_account.ACCOUNT_STATUS != 2 GROUP BY tbl_department.DEPT_NAME";

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
