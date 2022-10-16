import { constants } from "../../utils/contants.js";
import db from "../../config/db";
export const getDepartmentcount = async (req, res) => {
  try {
    const sqlQuery =
      "SELECT tbl_department.DEPT_NAME, COUNT(*) FROM tbl_department INNER JOIN tbl_account ON tbl_department.DEPT_ID = tbl_account.DEPT_ID GROUP BY  tbl_department.DEPT_NAME";

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

export const getDepartment = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM tbl_department ORDER BY DEPT_ID DESC";

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

export const addDepartment = async (req, res) => {
  try {
    const deptname = req.body.dept_name;
    const account_id = req.body.account_id;
    const activity = "Added Department" + " " + deptname;

    const deptstatus = 1;
    const sqlQuery =
      "INSERT INTO tbl_department (DEPT_NAME, DEPT_STATUS) values (?,?)";
    db.query(sqlQuery, [deptname, deptstatus], (err, result) => {
      if (err) {
        res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err });
      } else {
        const auditQuery =
          "INSERT INTO tbl_audit (ACCOUNT_ID, AUDIT_ACTIVITY) VALUES (?, ?)";
        db.query(
          auditQuery,
          [account_id, activity],
          (errAudit, resultAudit) => {
            if (errAudit) {
              console.log(errAudit);
            }
          }
        );
        const sqlQuerySelect =
          "SELECT * FROM tbl_department WHERE DEPT_STATUS != 2 ORDER BY DEPT_ID DESC";

        db.query(sqlQuerySelect, (err1, result1) => {
          if (err) {
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
              .json({ message: "Department has no item" });
          }
        });
      }
    });
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const deptid = req.body.dept_id;
    const deptname = req.body.dept_name;
    const account_id = req.body.account_id;
    const activity = "Updated Department" + " " + deptname;
    const sqlQuery =
      "UPDATE tbl_department SET DEPT_NAME = ? WHERE DEPT_ID = ?";
    db.query(sqlQuery, [deptname, deptid], (err, result) => {
      if (err) {
        res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err });
      } else {
        const auditQuery =
          "INSERT INTO tbl_audit (ACCOUNT_ID, AUDIT_ACTIVITY) VALUES (?, ?)";
        db.query(
          auditQuery,
          [account_id, activity],
          (errAudit, resultAudit) => {
            if (errAudit) {
              console.log(errAudit);
            }
          }
        );
        const sqlQuerySelect =
          "SELECT * FROM tbl_department  ORDER BY DEPT_ID DESC";
        db.query(sqlQuerySelect, (err1, result1) => {
          if (err) {
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
              .json({ message: "Department has no item" });
          }
        });
      }
    });
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const deptid = req.body.dept_id;
    const deptstatus = "2";
    const deptname = req.body.dept_name;
    const account_id = req.body.account_id;
    const activity = "Deleted Department" + " " + deptname;

    const sqlQuery =
      "UPDATE tbl_department SET DEPT_STATUS = ? WHERE DEPT_ID = ?";

    db.query(sqlQuery, [deptstatus, deptid], (err, result) => {
      if (err) {
        res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err });
      } else {
        const auditQuery =
          "INSERT INTO tbl_audit (ACCOUNT_ID, AUDIT_ACTIVITY) VALUES (?, ?)";
        db.query(
          auditQuery,
          [account_id, activity],
          (errAudit, resultAudit) => {
            if (errAudit) {
              console.log(errAudit);
            }
          }
        );
        const sqlQuerySelect =
          "SELECT * FROM tbl_department  ORDER BY DEPT_ID DESC";

        db.query(sqlQuerySelect, (err1, result1) => {
          if (err) {
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
              .json({ message: "Department has no item" });
          }
        });
      }
    });
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};

export const restoreDepartment = async (req, res) => {
  try {
    const deptid = req.body.dept_id;
    const deptstatus = "1";
    const deptname = req.body.dept_name;
    const account_id = req.body.account_id;
    const activity = "Restored Department" + " " + deptname;
    console.log(req.body);
    const sqlQuery =
      "UPDATE tbl_department SET DEPT_STATUS = ? WHERE DEPT_ID = ?";

    db.query(sqlQuery, [deptstatus, deptid], (err, result) => {
      if (err) {
        res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err });
      } else {
        const auditQuery =
          "INSERT INTO tbl_audit (ACCOUNT_ID, AUDIT_ACTIVITY) VALUES (?, ?)";
        db.query(
          auditQuery,
          [account_id, activity],
          (errAudit, resultAudit) => {
            if (errAudit) {
              console.log(errAudit);
            }
          }
        );
        const sqlQuerySelect =
          "SELECT * FROM tbl_department  ORDER BY DEPT_ID DESC";

        db.query(sqlQuerySelect, (err1, result1) => {
          if (err) {
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
              .json({ message: "Department has no item" });
          }
        });
      }
    });
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};
