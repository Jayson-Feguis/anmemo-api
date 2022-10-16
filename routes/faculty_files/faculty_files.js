import { constants } from "../../utils/contants.js";
import db from "../../config/db";
import jwt from "jsonwebtoken";
import fs, { read } from "fs";
import path, { resolve } from "path";
import superagent from "superagent";
import mammoth from "mammoth";

const __dirname = path.resolve();

export const getFacultyFiles = async (req, res) => {
  try {
    const account__id = req.params.id;

    //GET DOCUMENTS RECEIVED BY THIS USER ID
    const sqlQueryDocument =
      "SELECT tbl_sending.*, tbl_document.*, CONCAT(tbl_account.ACCOUNT_FIRSTNAME, ' ', tbl_account.ACCOUNT_LASTNAME) AS SENDER_NAME FROM tbl_sending INNER JOIN tbl_document ON tbl_sending.DOCUMENT_ID = tbl_document.DOCUMENT_ID INNER JOIN tbl_account ON tbl_account.ACCOUNT_ID = tbl_sending.SENDER_ID WHERE tbl_sending.CATEGORY_NAME = ? AND tbl_sending.RECEIVER_ID = ? AND tbl_document.DOCUMENT_STATUS != 2 AND tbl_sending.SEND_STATUS != 2 ORDER BY tbl_sending.SEND_ID DESC";
    const document_category = "Document";

    db.query(
      sqlQueryDocument,
      [document_category, account__id],
      async (errDocument, resultDocument) => {
        if (errDocument) {
          res
            .status(constants.STATUS_CODES.SERVER_ERROR)
            .json({ auth: false, message: errDocument });
        }

        //GET MEMORANDUM RECEIVED BY THIS USER ID
        const sqlQueryMemorandum =
          "SELECT tbl_sending.*, tbl_document.*, CONCAT(tbl_account.ACCOUNT_FIRSTNAME, ' ', tbl_account.ACCOUNT_LASTNAME) AS SENDER_NAME FROM tbl_sending INNER JOIN tbl_document ON tbl_sending.DOCUMENT_ID = tbl_document.DOCUMENT_ID INNER JOIN tbl_account ON tbl_account.ACCOUNT_ID = tbl_sending.SENDER_ID WHERE tbl_sending.CATEGORY_NAME = ? AND tbl_sending.RECEIVER_ID = ? AND tbl_document.DOCUMENT_STATUS != 2 AND tbl_sending.SEND_STATUS != 2 ORDER BY tbl_sending.SEND_ID DESC";
        const memorandum_category = "Memorandum";

        db.query(
          sqlQueryMemorandum,
          [memorandum_category, account__id],
          async (errMemorandum, resultMemorandum) => {
            if (errDocument) {
              res
                .status(constants.STATUS_CODES.SERVER_ERROR)
                .json({ auth: false, message: errMemorandum });
            }

            //GET DOCUMENTS RECEIVED BY THIS USER ID
            const sqlQueryAnnouncement =
              "SELECT tbl_sending.*, tbl_announcement.*, CONCAT(tbl_account.ACCOUNT_FIRSTNAME, ' ', tbl_account.ACCOUNT_LASTNAME) AS SENDER_NAME FROM tbl_sending INNER JOIN tbl_announcement ON tbl_sending.DOCUMENT_ID = tbl_announcement.ANNOUNCEMENT_ID INNER JOIN tbl_account ON tbl_account.ACCOUNT_ID = tbl_sending.SENDER_ID WHERE tbl_sending.CATEGORY_NAME = ? AND tbl_sending.RECEIVER_ID = ? AND tbl_announcement.ANNOUNCEMENT_STATUS != 2 AND tbl_sending.SEND_STATUS != 2 ORDER BY tbl_sending.SEND_ID DESC";
            const announcement_category = "Announcement";

            db.query(
              sqlQueryAnnouncement,
              [announcement_category, account__id],
              async (errAnnouncement, resultAnnouncement) => {
                if (errDocument) {
                  res
                    .status(constants.STATUS_CODES.SERVER_ERROR)
                    .json({ auth: false, message: errAnnouncement });
                }
                res.status(constants.STATUS_CODES.SUCCESS).json({
                  result: {
                    document: resultDocument,
                    memorandum: resultMemorandum,
                    announcement: resultAnnouncement,
                  },
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    res
      .status(constants.STATUS_CODES.SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const searchFacultyFiles = async (req, res) => {
  try {
    const account__id = req.body.account_id;
    const search_query = req.body.search_query;
    const type = req.body.type;

    //GET DOCUMENTS RECEIVED BY THIS USER ID
    const sqlQueryDocument =
      "SELECT tbl_sending.*, tbl_document.*, CONCAT(tbl_account.ACCOUNT_FIRSTNAME, ' ', tbl_account.ACCOUNT_LASTNAME) AS SENDER_NAME FROM tbl_sending INNER JOIN tbl_document ON tbl_sending.DOCUMENT_ID = tbl_document.DOCUMENT_ID INNER JOIN tbl_account ON tbl_account.ACCOUNT_ID = tbl_sending.SENDER_ID WHERE tbl_sending.CATEGORY_NAME = ? AND tbl_sending.RECEIVER_ID = ? AND tbl_document.DOCUMENT_STATUS != 2 ORDER BY tbl_sending.SEND_ID DESC";
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
          "SELECT tbl_sending.*, tbl_document.*, CONCAT(tbl_account.ACCOUNT_FIRSTNAME, ' ', tbl_account.ACCOUNT_LASTNAME) AS SENDER_NAME FROM tbl_sending INNER JOIN tbl_document ON tbl_sending.DOCUMENT_ID = tbl_document.DOCUMENT_ID INNER JOIN tbl_account ON tbl_account.ACCOUNT_ID = tbl_sending.SENDER_ID WHERE tbl_sending.CATEGORY_NAME = ? AND tbl_sending.RECEIVER_ID = ? AND tbl_document.DOCUMENT_STATUS != 2 ORDER BY tbl_sending.SEND_ID DESC";
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
              "SELECT tbl_sending.*, tbl_announcement.*, CONCAT(tbl_account.ACCOUNT_FIRSTNAME, ' ', tbl_account.ACCOUNT_LASTNAME) AS SENDER_NAME FROM tbl_sending INNER JOIN tbl_announcement ON tbl_sending.DOCUMENT_ID = tbl_announcement.ANNOUNCEMENT_ID INNER JOIN tbl_account ON tbl_account.ACCOUNT_ID = tbl_sending.SENDER_ID WHERE tbl_sending.CATEGORY_NAME = ? AND tbl_sending.RECEIVER_ID = ? AND tbl_announcement.ANNOUNCEMENT_STATUS != 2 ORDER BY tbl_sending.SEND_ID DESC";
            const announcement_category = "Announcement";

            db.query(
              sqlQueryAnnouncement,
              [announcement_category, account__id],
              async (errAnnouncement, resultAnnouncement) => {
                if (errDocument) {
                  res
                    .status(constants.STATUS_CODES.SERVER_ERROR)
                    .json({ auth: false, message: errAnnouncement });
                }

                let all = fs.readdirSync(__dirname + "/images");
                let searchWord = search_query;
                let allFiles = await readSearchword(all, searchWord);
                let allDocuments = [];
                let allMemorandum = [];

                if (type === "Document") {
                  await Promise.all(
                    allFiles.map((item) => {
                      resultDocument.map((doc) => {
                        doc.DOCUMENT_NAME === item
                          ? allDocuments.push(doc)
                          : null;
                      });
                    })
                  );

                  res.status(constants.STATUS_CODES.SUCCESS).json({
                    result: {
                      document: allDocuments,
                      memorandum: resultMemorandum,
                      announcement: resultAnnouncement,
                    },
                  });
                } else if (type === "Memorandum") {
                  await Promise.all(
                    allFiles.map((item) => {
                      resultMemorandum.map((mem) => {
                        mem.DOCUMENT_NAME === item
                          ? allMemorandum.push(mem)
                          : null;
                      });
                    })
                  );
                  res.status(constants.STATUS_CODES.SUCCESS).json({
                    result: {
                      document: resultDocument,
                      memorandum: allMemorandum,
                      announcement: resultAnnouncement,
                    },
                  });
                }
              }
            );
          }
        );
      }
    );
  } catch (error) {
    res
      .status(constants.STATUS_CODES.SERVER_ERROR)
      .json({ message: error.message });
  }
};

const readSearchword = async (files, search) => {
  const allFiles = [];
  try {
    await Promise.all(
      files.map(async (item) => {
        let readFile = await readFromFile(__dirname + "/images/" + item);
        if (readFile.toString().includes(search)) {
          allFiles.push(item);
        }
      })
    );
    return allFiles;
  } catch (error) {
    return error;
  }
};

const readFromFile = async (file) => {
  try {
    const text = (await mammoth.extractRawText({ path: file })).value;
    return text;
  } catch (error) {
    return error;
  }
};
