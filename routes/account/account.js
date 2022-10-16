import { constants } from "../../utils/contants.js";
import db from "../../config/db";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }).array("files");

export const getAccount = async (req, res) => {
  try {
    const sqlQuery =
      "SELECT tbl_account.*, tbl_department.DEPT_NAME FROM tbl_account INNER JOIN tbl_department ON tbl_account.DEPT_ID = tbl_department.DEPT_ID ORDER BY tbl_account.ACCOUNT_ID DESC";

    db.query(sqlQuery, (err, result) => {
      if (err) {
        res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err });
      }

      if (result.length > 0) {
        res.status(constants.STATUS_CODES.SUCCESS).json({ result: result });
      } else {
        res
          .status(constants.STATUS_CODES.NOT_FOUND)
          .json({ message: "Account has no item" });
      }
    });
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};
export const approveAccount = async (req, res) => {
  try {
    const accounttid = req.body.account_id;

    const lastname = req.body.account_lastname;
    const firstname = req.body.account_firstname;
    const activity = "Approved account " + firstname + " " + lastname;
    const accountstatus = 1;
    const sqlQuery =
      "UPDATE tbl_account SET ACCOUNT_STATUS = ? WHERE ACCOUNT_ID = ? ";
    db.query(sqlQuery, [accountstatus, accounttid], (err, result) => {
      if (err) {
        res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err });
      } else {
        const auditQuery =
          "INSERT INTO tbl_audit (ACCOUNT_ID, AUDIT_ACTIVITY) VALUES (?, ?)";
        db.query(
          auditQuery,
          [accounttid, activity],
          (errAudit, resultAudit) => {
            if (errAudit) {
              console.log(errAudit);
            }
          }
        );
        const sqlQuerySelect =
          "SELECT tbl_account.*, tbl_department.DEPT_NAME FROM tbl_account INNER JOIN tbl_department ON tbl_account.DEPT_ID = tbl_department.DEPT_ID  ORDER BY tbl_account.ACCOUNT_ID DESC";
        db.query(sqlQuerySelect, (err, result) => {
          if (err) {
            res
              .status(constants.STATUS_CODES.SERVER_ERROR)
              .json({ message: err });
          }
          if (result.length > 0) {
            res.status(constants.STATUS_CODES.SUCCESS).json({ result: result });
          } else {
            res
              .status(constants.STATUS_CODES.NOT_FOUND)
              .json({ message: "Account has no item" });
          }
        });
      }
    });
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};
export const deleteAccount = async (req, res) => {
  try {
    console.log("reds");
    const accountid = req.body.account_id;
    const accountstatus = "2";
    const userid = req.body.user_id;
    const lastname = req.body.account_lastname;
    const firstname = req.body.account_firstname;
    const activity = "Deleted account " + firstname + " " + lastname;
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
          "SELECT tbl_account.*, tbl_department.DEPT_NAME FROM tbl_account INNER JOIN tbl_department ON tbl_account.DEPT_ID = tbl_department.DEPT_ID ORDER BY tbl_account.ACCOUNT_ID DESC";

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
              .json({ message: "Account has no item" });
          }
        });
      }
    });
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};

// export const deleteAccount = async (req, res) => {
//   try {
//     const accountid = req.body.account_id;
//     const accountstatus = "2";

//     const sqlQuery =
//       "UPDATE tbl_account SET ACCOUNT_STATUS = ? WHERE ACCOUNT_ID = ?";

//     db.query(sqlQuery, [accountstatus, accountid], (err, result) => {
//       if (err) {
//         res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err });
//       } else {
//         const sqlQuerySelect =
//           "SELECT tbl_account.*, tbl_department.DEPT_NAME FROM tbl_account INNER JOIN tbl_department ON tbl_account.DEPT_ID = tbl_department.DEPT_ID WHERE ACCOUNT_STATUS != 2 ORDER BY tbl_account.ACCOUNT_ID DESC";

//         db.query(sqlQuerySelect, (err, result) => {
//           if (err) {
//             res
//               .status(constants.STATUS_CODES.SERVER_ERROR)
//               .json({ message: err });
//           }

//           if (result.length > 0) {
//             res.status(constants.STATUS_CODES.SUCCESS).json({ result: result });
//           } else {
//             res
//               .status(constants.STATUS_CODES.NOT_FOUND)
//               .json({ message: "Account has no item" });
//           }
//         });
//       }
//     });
//   } catch (error) {
//     res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
//   }
// };

export const updateAccount = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      let profile_picture = req.files[0].originalname;
      const is_picture_changed = req.body.is_picture_changed;
      const account_id = req.body.account_id;
      const account_name = req.body.account_firstname;
      const account_lastname = req.body.account_lastname;
      const account_mname = req.body.account_middlename;
      const account_gender = req.body.account_gender;
      const account_username = req.body.account_username;
      const account_password = req.body.account_password;
      const account_birthdate = req.body.account_birthdate;
      const account_type = req.body.account_type;
      const dept_id = req.body.dept_id;
      const user_id = req.body.user_id;

      if (err) {
        return res
          .status(constants.STATUS_CODES.SERVER_ERROR)
          .json({ message: err });
      }

      if (is_picture_changed) {
        const activity =
          "Updated account " + account_name + " " + account_lastname;
        const sqlQuery =
          "UPDATE tbl_account SET ACCOUNT_FIRSTNAME = ?, ACCOUNT_LASTNAME = ?, ACCOUNT_MIDDLENAME = ?, ACCOUNT_GENDER = ?, ACCOUNT_USERNAME = ?, ACCOUNT_PASSWORD = ?, ACCOUNT_BIRTHDATE = ?, ACCOUNT_TYPE = ?, DEPT_ID = ?, ACCOUNT_PICTURE = ? WHERE ACCOUNT_ID = ?";

        db.query(
          sqlQuery,
          [
            account_name,
            account_lastname,
            account_mname,
            account_gender,
            account_username,
            account_password,
            account_birthdate,
            account_type,
            dept_id,
            profile_picture,
            account_id,
          ],
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
                [account_id, activity],
                (errAudit, resultAudit) => {
                  if (errAudit) {
                    console.log(errAudit);
                  }
                }
              );
              const sqlQuerySelect =
                "SELECT tbl_account.*, tbl_department.DEPT_NAME FROM tbl_account INNER JOIN tbl_department ON tbl_account.DEPT_ID = tbl_department.DEPT_ID  ORDER BY tbl_account.ACCOUNT_ID DESC";

              db.query(sqlQuerySelect, (err, result) => {
                if (err) {
                  res
                    .status(constants.STATUS_CODES.SERVER_ERROR)
                    .json({ message: err });
                }

                if (result.length > 0) {
                  res
                    .status(constants.STATUS_CODES.SUCCESS)
                    .json({ result: result });
                } else {
                  res
                    .status(constants.STATUS_CODES.NOT_FOUND)
                    .json({ message: "Account has no item" });
                }
              });
            }
          }
        );
      } else {
        const ispicturechanged = req.body.is_picture_changed;
        const accountid = req.body.account_id;
        const accountname = req.body.account_firstname;
        const accountlastname = req.body.account_lastname;
        const accountmname = req.body.account_middlename;
        const accountgender = req.body.account_gender;
        const accountusername = req.body.account_username;
        const accountpassword = req.body.account_password;
        const accountbirthdate = req.body.account_birthdate;
        const accounttype = req.body.account_type;
        const deptid = req.body.dept_id;
        const userid = req.body.user_id;

        console.log(req.body);

        if (!ispicturechanged) {
          const activity =
            "Updated account " + accountname + " " + accountlastname;
          const sqlQuery =
            "UPDATE tbl_account SET ACCOUNT_FIRSTNAME = ?, ACCOUNT_LASTNAME = ?, ACCOUNT_MIDDLENAME = ?, ACCOUNT_GENDER = ?, ACCOUNT_USERNAME = ?, ACCOUNT_PASSWORD = ?, ACCOUNT_BIRTHDATE = ?, ACCOUNT_TYPE = ?, DEPT_ID = ? WHERE ACCOUNT_ID = ?";

          db.query(
            sqlQuery,
            [
              accountname,
              accountlastname,
              accountmname,
              accountgender,
              accountusername,
              accountpassword,
              accountbirthdate,
              accounttype,
              deptid,
              accountid,
            ],
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
                const sqlQuerySelect =
                  "SELECT tbl_account.*, tbl_department.DEPT_NAME FROM tbl_account INNER JOIN tbl_department ON tbl_account.DEPT_ID = tbl_department.DEPT_ID  ORDER BY tbl_account.ACCOUNT_ID DESC";

                db.query(sqlQuerySelect, (err, result) => {
                  if (err) {
                    res
                      .status(constants.STATUS_CODES.SERVER_ERROR)
                      .json({ message: err });
                  }

                  if (result.length > 0) {
                    res
                      .status(constants.STATUS_CODES.SUCCESS)
                      .json({ result: result });
                  } else {
                    res
                      .status(constants.STATUS_CODES.NOT_FOUND)
                      .json({ message: "Account has no item" });
                  }
                });
              }
            }
          );
        }
      }
    });
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};

export const restoreAccount = async (req, res) => {
  try {
    console.log("ACCOUNT");
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
          "SELECT tbl_account.*, tbl_department.DEPT_NAME FROM tbl_account INNER JOIN tbl_department ON tbl_account.DEPT_ID = tbl_department.DEPT_ID ORDER BY tbl_account.ACCOUNT_ID DESC";

        db.query(sqlQuerySelect, (err1, result1) => {
          if (err) {
            res
              .status(constants.STATUS_CODES.SERVER_ERROR)
              .json({ message: err1 });
          }
          console.log(result1);
          res.status(constants.STATUS_CODES.SUCCESS).json({ result: result1 });
        });
      }
    });
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};
