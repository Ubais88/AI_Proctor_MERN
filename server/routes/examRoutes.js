const express = require("express");
const examRoutes = express.Router();

const { protect } = require("../middleware/authMiddleware.js");
const { createExam, getExams } = require("../controllers/examController.js");
const {createQuestion,getQuestionsByExamId,} = require("../controllers/quesController.js");
const {getCheatingLogsByExamId,saveCheatingLog} = require("../controllers/cheatingLogController.js");


// protecting Exam route using auth middleware protect /api/users/
examRoutes.route("/exam").get(protect, getExams).post(protect, createExam);
examRoutes.route("/exam/questions").post(protect, createQuestion);
examRoutes.route("/exam/questions/:examId").get(protect, getQuestionsByExamId);
examRoutes.route("/cheatingLogs/:examId").get(protect, getCheatingLogsByExamId);
examRoutes.route("/cheatingLogs/").post(protect, saveCheatingLog);


module.exports = examRoutes;