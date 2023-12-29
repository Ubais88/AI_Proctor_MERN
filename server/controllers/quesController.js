const asyncHandler = require("express-async-handler");
const Question = require("../models/quesModel.js");

exports.getQuestionsByExamId = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  console.log("Question Exam id ", examId);

  if (!examId) {
    return res.status(400).json({ error: "examId is missing" });
  }

  const questions = await Question.find({ examId });
  console.log("Question Exam  ", questions);

  res.status(200).json(questions);
});



exports.createQuestion = asyncHandler(async (req, res) => {
  const { question, options, examId } = req.body;

  if (!examId) {
    return res.status(400).json({ error: "examId is missing or invalid" });
  }

  const newQuestion = new Question({
    question,
    options,
    examId,
  });

  const createdQuestion = await newQuestion.save();

  if (createdQuestion) {
    res.status(201).json(createdQuestion);
  } else {
    res.status(400);
    throw new Error("Invalid Question Data");
  }
});

// export { getQuestionsByExamId, createQuestion };
