import { constants } from "../../utils/contants.js";
import db from "../../config/db";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const accountid = req.body.accountid;

    const firstname = req.body.firstname;
    const middlename = req.body.middlename;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const password = req.body.password;
    const gender = req.body.gender;
    const birthdate = req.body.birthdate;
    const department = req.body.department;
    const accounttype = req.body.accounttype;
    const accountstatus = 1;
    const email = req.body.email;
    const activity = "Added account " + username;
    //CHECK IF USERNAME IS ALREADY EXIST
    const sqlQuerySelect =
      "SELECT * FROM tbl_account WHERE ACCOUNT_USERNAME = ?";

    db.query(sqlQuerySelect, [username], (err, result) => {
      if (err) {
        res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err });
      } else {
        if (result.length > 0) {
          res
            .status(constants.STATUS_CODES.SERVER_ERROR)
            .json({ auth: false, message: "This username is already exist" });
        } else {
          //IF NOT EXISTING IN THE DATABASE, THEN SAVE IT
          const sqlQuery =
            "INSERT INTO tbl_account (DEPT_ID, ACCOUNT_USERNAME, ACCOUNT_PASSWORD, ACCOUNT_FIRSTNAME, ACCOUNT_MIDDLENAME, ACCOUNT_LASTNAME, ACCOUNT_GENDER, ACCOUNT_BIRTHDATE, ACCOUNT_STATUS, ACCOUNT_TYPE, ACCOUNT_EMAIL) VALUES (?,?,?,?,?,?,?,?,?,?,?)";

          db.query(
            sqlQuery,
            [
              department,
              username,
              password,
              firstname,
              middlename,
              lastname,
              gender,
              birthdate,
              accountstatus,
              accounttype,
              email,
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

                const sqlQuerySelectx =
                  "SELECT tbl_account.*, tbl_department.DEPT_NAME FROM tbl_account INNER JOIN tbl_department ON tbl_account.DEPT_ID = tbl_department.DEPT_ID  ORDER BY tbl_account.ACCOUNT_ID DESC";
                db.query(sqlQuerySelectx, (err, result) => {
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

export const login = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const sqlQuery =
      "SELECT * FROM tbl_account WHERE ACCOUNT_USERNAME = ? AND ACCOUNT_PASSWORD = ?";

    db.query(sqlQuery, [username, password], (err, result) => {
      if (err) {
        res
          .status(constants.STATUS_CODES.SERVER_ERROR)
          .json({ auth: false, message: err });
      }
      if (result.length > 0) {
        if (result[0].ACCOUNT_STATUS === 1) {
          const account__id = result[0].ACCOUNT_ID;
          const activity = "Log in";
          const token = jwt.sign({ account__id }, "Faculty!System_2022_jwtPK");
          const auditQuery =
            "INSERT INTO tbl_audit (ACCOUNT_ID, AUDIT_ACTIVITY) VALUES (?, ?)";
          db.query(
            auditQuery,
            [account__id, activity],
            (errAudit, resultAudit) => {
              if (errAudit) {
                console.log(errAudit);
              }
            }
          );
          //GET DOCUMENTS RECEIVED BY THIS USER ID
          const sqlQueryDocument =
            "SELECT tbl_sending.*, tbl_document.* FROM tbl_sending INNER JOIN tbl_document ON tbl_sending.DOCUMENT_ID = tbl_document.DOCUMENT_ID WHERE tbl_sending.CATEGORY_NAME = ? AND tbl_sending.RECEIVER_ID = ? ORDER BY tbl_sending.SEND_ID";
          const document_category = "Document";

          db.query(
            sqlQueryDocument,
            [document_category, account__id],
            (errDocument, resultDocument) => {
              if (errDocument) {
                res
                  .status(constants.STATUS_CODES.SERVER_ERROR)
                  .json({ auth: false, message: errDocument });
              }

              //GET MEMORANDUM RECEIVED BY THIS USER ID
              const sqlQueryMemorandum =
                "SELECT tbl_sending.*, tbl_document.* FROM tbl_sending INNER JOIN tbl_document ON tbl_sending.DOCUMENT_ID = tbl_document.DOCUMENT_ID WHERE tbl_sending.CATEGORY_NAME = ? AND tbl_sending.RECEIVER_ID = ? ORDER BY tbl_sending.SEND_ID";
              const memorandum_category = "Memorandum";

              db.query(
                sqlQueryMemorandum,
                [memorandum_category, account__id],
                (errMemorandum, resultMemorandum) => {
                  if (errDocument) {
                    res
                      .status(constants.STATUS_CODES.SERVER_ERROR)
                      .json({ auth: false, message: errMemorandum });
                  }

                  //GET DOCUMENTS RECEIVED BY THIS USER ID
                  const sqlQueryAnnouncement =
                    "SELECT tbl_sending.*, tbl_announcement.* FROM tbl_sending INNER JOIN tbl_announcement ON tbl_sending.DOCUMENT_ID = tbl_announcement.ANNOUNCEMENT_ID WHERE tbl_sending.CATEGORY_NAME = ? AND tbl_sending.RECEIVER_ID = ? ORDER BY tbl_sending.SEND_ID";
                  const announcement_category = "Announcement";

                  db.query(
                    sqlQueryAnnouncement,
                    [announcement_category, account__id],
                    (errAnnouncement, resultAnnouncement) => {
                      if (errDocument) {
                        res
                          .status(constants.STATUS_CODES.SERVER_ERROR)
                          .json({ auth: false, message: errAnnouncement });
                      }

                      res.header("Authorization", "Bearer " + token).json({
                        auth: true,
                        result: result,
                        document: resultDocument,
                        memorandum: resultMemorandum,
                        announcement: resultAnnouncement,
                        token: token,
                      });
                    }
                  );
                }
              );
            }
          );
        } else {
          res.json({
            auth: false,
            message:
              "Sorry! You can't log in right now. Your account in not accepted yet by admin. Thank you!",
          });
        }
      } else {
        res.json({
          auth: false,
          message: "Incorrect username/password! Please try again.",
        });
      }
    });
  } catch (error) {
    res
      .status(constants.STATUS_CODES.SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.header("Authorization", " ").json({ message: "Logout success" });

    console.log("req.body");
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};

export const logout2 = async (req, res) => {
  try {
    const account_id = req.body.user_id;
    const activity = "Logout";
    const auditQuery =
      "INSERT INTO tbl_audit (ACCOUNT_ID, AUDIT_ACTIVITY) VALUES (?, ?)";
    db.query(auditQuery, [account_id, activity], (errAudit, resultAudit) => {
      if (errAudit) {
        console.log(errAudit);
      }
    });
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};

export const getemail = async (req, res) => {
  try {
    const email = req.body.email;
    function generateRandomNumber() {
      var minm = 100000;
      var maxm = 999999;
      return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    }
    let output = generateRandomNumber();

    //CHECK IF USERNAME IS ALREADY EXIST
    const sqlQuerySelect =
      "SELECT * FROM tbl_account WHERE ACCOUNT_EMAIL = ? && ACCOUNT_TYPE != 3";

    db.query(sqlQuerySelect, [email], (err, result) => {
      if (err) {
        res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err });
      } else {
        if (result.length <= 0) {
          res.status(constants.STATUS_CODES.SERVER_ERROR).json({
            auth: false,
            message:
              "This email is not exist or your account type is faculy member",
          });
        } else {
          const sqlQuery =
            "UPDATE tbl_account SET ACCOUNT_CODE = ? WHERE ACCOUNT_EMAIL = ?";

          db.query(sqlQuery, [output, email], (err, result) => {
            if (err) {
              res
                .status(constants.STATUS_CODES.SERVER_ERROR)
                .json({ message: err });
            } else {
              const sqlQuerySelect =
                "SELECT * FROM tbl_account WHERE ACCOUNT_EMAIL = ?";
              db.query(sqlQuerySelect, [email], (err3, result3) => {
                if (err3) {
                  res
                    .status(constants.STATUS_CODES.SERVER_ERROR)
                    .json({ message: err3 });
                }

                if (result3.length > 0) {
                  res
                    .status(constants.STATUS_CODES.SUCCESS)
                    .json({ result: result3 });
                } else {
                  res
                    .status(constants.STATUS_CODES.NOT_FOUND)
                    .json({ message: "Account not found" });
                }
              });
            }
          });
        }
      }
    });
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};

export const resetpass = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const sqlQuerySelect =
      "UPDATE tbl_account set ACCOUNT_PASSWORD = ? WHERE ACCOUNT_EMAIL = ?";

    db.query(sqlQuerySelect, [password, email], (err, result) => {
      if (err) {
        res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: err });
      } else {
        if (result.changedRows > 0) {
          res.status(constants.STATUS_CODES.SUCCESS).json({
            auth: false,
            message: "Password reset successfully!",
          });
        } else {
          res
            .status(constants.STATUS_CODES.SERVER_ERROR)
            .json({ auth: false, message: "Please try again" });
        }
      }
    });
  } catch (error) {
    res.status(constants.STATUS_CODES.SERVER_ERROR).json({ message: error });
  }
};
