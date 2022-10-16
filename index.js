import express from "express";
import multer from "multer";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./config/db";
import auth from "./middleware/auth";
import jwt from "jsonwebtoken";
import http from "http";
import { Server } from "socket.io";
import { constants, PORT } from "./utils/contants";
import {
  login,
  logout,
  register,
  getemail,
  resetpass,
  logout2,
} from "./routes/login/login";
import { getAudit } from "./routes/audit/audit";
import { fetchArchive } from "./routes/archive/archive";
import {
  getDocuments,
  uploadDocument,
  sendDocuments,
  deleteDocument,
} from "./routes/send-file/send-file";
import {
  documentReceivers,
  deleteDocumentReceivers,
} from "./routes/document_receivers/document_receivers";
import {
  getAccount,
  approveAccount,
  deleteAccount,
  updateAccount,
  restoreAccount,
} from "./routes/account/account";
import {
  getDepartment,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  restoreDepartment,
} from "./routes/department/department";
import { getDepartmentcount } from "./routes/countDepartment/countDepartment";
import {
  getNotification,
  updateNotification,
  deleteNotification,
} from "./routes/notification/notification";
import {
  getAnnouncement,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "./routes/announcement/announcement";
import {
  announcementReceivers,
  deleteAnnouncementReceivers,
} from "./routes/announcement_receivers/announcement_receivers";
import {
  getFacultyFiles,
  searchFacultyFiles,
} from "./routes/faculty_files/faculty_files";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `${process.env.REACT_APP_URL}`,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/images", express.static("images"));
app.set("view engine", "ejs");
app.post("/api/logout2", logout2);
app.post("/api/login", login);
app.post("/api/logout", logout);
app.post("/api/register", register);
app.post("/api/getemail", getemail);
app.post("/api/resetpass", resetpass);
//send-file
app.post("/api/send-file/upload", auth, uploadDocument);
app.post("/api/send-file/get", auth, getDocuments);
app.post("/api/send-file/send", auth, sendDocuments);
app.post("/api/send-file/delete", auth, deleteDocument);

//document receiver
app.post("/api/document-receivers/get", auth, documentReceivers);
app.post("/api/document-receivers/delete", auth, deleteDocumentReceivers);

// account api's
app.get("/api/account/get", auth, getAccount);
app.post("/api/account/approved", auth, approveAccount);
app.post("/api/account/delete", auth, deleteAccount);
app.post("/api/account/update", auth, updateAccount);
app.post("/api/account/restore", auth, restoreAccount);
//account api's

//start dept count
app.get("/api/countDepartment/get", getDepartmentcount);
//start DEPARTMENT
app.get("/api/department/post", getDepartmentcount);
app.get("/api/department/get", getDepartment);
app.post("/api/department/add", auth, addDepartment);
app.post("/api/department/update", auth, updateDepartment);
app.post("/api/department/delete", auth, deleteDepartment);
app.post("/api/department/restore", auth, restoreDepartment);
//end DEPARTMENT

//start notification
app.get("/api/notification/get/:id", auth, getNotification);
app.post("/api/notification/update", auth, updateNotification);
app.patch("/api/notification/delete", auth, deleteNotification);
//end notification

//start announcement
app.get("/api/announcement/get/:id", auth, getAnnouncement);
app.post("/api/announcement/add", auth, addAnnouncement);
app.patch("/api/announcement/update", auth, updateAnnouncement);
app.patch("/api/announcement/delete", auth, deleteAnnouncement);
//end announcement

//start announcement receiver
app.get("/api/announcement-receivers/get/:id", auth, announcementReceivers);
app.post(
  "/api/announcement-receivers/delete",
  auth,
  deleteAnnouncementReceivers
);
//end announcement receiver

//start faculty files
app.get("/api/faculty-files/get/:id", auth, getFacultyFiles);
app.post("/api/faculty-files/search", auth, searchFacultyFiles);
//end faculty files

// audit
app.post("/api/audit/get", auth, getAudit);
//end audit

// archive
app.post("/api/archive/get", auth, fetchArchive);
// app.post("/api/archive/restore", auth, restoreAccount);
// end archive

io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.id}`);
  socket.on("add_department", (data) => {
    socket.broadcast.emit("get_department", data);
  });
  socket.on("update_department", (data) => {
    socket.broadcast.emit("get_department", data);
  });
  socket.on("delete_department", (data) => {
    socket.broadcast.emit("get_department", data);
  });
  socket.on("update_account", (data) => {
    socket.broadcast.emit("get_account", data);
  });
  socket.on("delete_account", (data) => {
    socket.broadcast.emit("get_account", data);
  });
  socket.on("restore_account", (data) => {
    socket.broadcast.emit("get_account", data);
  });
  socket.on("approve_account", (data) => {
    socket.broadcast.emit("get_account", data);
  });
  socket.on("upload_document", (data) => {
    socket.broadcast.emit("get_document", data);
  });
  socket.on("send_document", (data) => {
    if (data.message === "get_document") {
      socket.broadcast.emit("get_document", data);
    } else if (data.message === "get_notification") {
      socket.broadcast.emit("get_notification", data);
    } else if (data.message === "get_facultyfiles") {
      socket.broadcast.emit("get_facultyfiles", data);
    }
  });
  socket.on("delete_receiver", (data) => {
    if (data.message === "get_facultyfiles") {
      socket.broadcast.emit("get_facultyfiles", data);
    }
  });
  socket.on("send_announcement", (data) => {
    if (data.message === "get_facultyfiles") {
      socket.broadcast.emit("get_facultyfiles", data);
    } else if (data.message === "get_notification") {
      socket.broadcast.emit("get_notification", data);
    }
  });
});

server.listen(process.env.PORT || PORT, () => {
  console.log(`running on port ${PORT}`);
});
