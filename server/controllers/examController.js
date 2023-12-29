const asyncHandler = require("express-async-handler");
const Exam = require("../models/examModel.js");

// @desc Get all exams
// @route GET /api/exams
// @access Public
exports.getExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find();
  res.status(200).json(exams);
});


// @desc Create a new exam
// @route POST /api/exams
// @access Private (admin)
exports.createExam = asyncHandler(async (req, res) => {
  const { examName, totalQuestions, duration, liveDate, deadDate } = req.body;

  const exam = new Exam({
    examName,
    totalQuestions,
    duration,
    liveDate,
    deadDate,
  });

  const createdExam = await exam.save();

  if (createdExam) {
    res.status(201).json(createdExam);
  } else {
    res.status(400);
    throw new Error("Invalid Exam Data");
  }
});

// export { getExams, createExam };
