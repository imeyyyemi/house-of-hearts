package com.example.quiz.controller;

import com.example.quiz.model.Quiz;
import com.example.quiz.model.Question;
import com.example.quiz.model.QuizAttempt;
import java.util.*;
import com.example.quiz.repository.QuizRepository;
import com.example.quiz.repository.QuestionRepository;
import com.example.quiz.repository.QuizAttemptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class QuizController {
    @Autowired private QuizRepository quizRepository;
    @Autowired private QuestionRepository questionRepository;
    @Autowired private QuizAttemptRepository quizAttemptRepository;

  

    @PostMapping("/student/quizzes/{quizId}/submit")
    public ResponseEntity<?> submitQuiz(@PathVariable Long quizId,
                                      @RequestBody Map<String, Object> payload) {
        try {
            Quiz quiz = quizRepository.findById(quizId).orElse(null);
            if (quiz == null) {
                return ResponseEntity.notFound().build();
            }

            // Extract student info and answers
            String studentId = (String) payload.get("studentId");
            String studentName = (String) payload.get("studentName");
            List<Map<String, String>> answers = (List<Map<String, String>>) payload.get("answers");

            if (studentId == null || studentName == null || answers == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
            }

            int correctAnswers = 0;
            List<Question> questions = quiz.getQuestions();

            for (int i = 0; i < answers.size(); i++) {
                String submittedAnswer = answers.get(i).get("answer");
                if (submittedAnswer.equals(questions.get(i).getCorrectAnswer())) {
                    correctAnswers++;
                }
            }

            double percentage = (double) correctAnswers / questions.size() * 100;
            boolean passed = percentage >= 70; // 70% passing grade

            // Save the quiz attempt
            QuizAttempt attempt = new QuizAttempt();
            attempt.setQuiz(quiz);
            attempt.setStudentId(studentId);
            attempt.setStudentName(studentName);
            attempt.setScore(correctAnswers);
            attempt.setTotalQuestions(questions.size());
            attempt.setPercentage(percentage);
            attempt.setPassed(passed);
            QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);
            System.out.println("Saved QuizAttempt id=" + savedAttempt.getId() + " for quizId=" + quizId + " student=" + studentId);

            Map<String, Object> result = new HashMap<>();
            result.put("totalQuestions", questions.size());
            result.put("correctAnswers", correctAnswers);
            result.put("percentage", percentage);
            result.put("passed", passed);
            result.put("studentName", studentName);
            result.put("studentId", studentId);
            result.put("attemptDate", attempt.getAttemptDate());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to submit quiz: " + e.getMessage()));
        }
    }

    @PutMapping("/admin/quizzes/{quizId}")
    public ResponseEntity<?> updateQuiz(@PathVariable Long quizId,
                                      @RequestBody Map<String, Object> quizData,
                                      HttpSession session) {
        try {
            String user = (String) session.getAttribute("user");
            if (user == null || !user.equals("admin")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
            }

            Quiz quiz = quizRepository.findById(quizId).orElse(null);
            if (quiz == null) {
                return ResponseEntity.notFound().build();
            }

            quiz.setTitle((String) quizData.get("title"));
            quiz.setDescription((String) quizData.get("description"));

            // Update existing questions and add new ones
            List<Map<String, Object>> questions = (List<Map<String, Object>>) quizData.get("questions");
            if (questions != null) {
                // Remove old questions
                questionRepository.deleteAll(quiz.getQuestions());

                List<Question> newQuestions = new ArrayList<>();
                for (Map<String, Object> q : questions) {
                    Question question = new Question();
                    question.setText((String) q.get("questionText"));
                    question.setCorrectAnswer((String) q.get("correctAnswer"));
                    question.setOptions((List<String>) q.get("options"));
                    question.setQuiz(quiz);
                    newQuestions.add(questionRepository.save(question));
                }
                quiz.setQuestions(newQuestions);
            }

            quiz = quizRepository.save(quiz);
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update quiz: " + e.getMessage()));
        }
    }

    @DeleteMapping("/admin/quizzes/{quizId}")
    public ResponseEntity<?> deleteQuiz(@PathVariable Long quizId, HttpSession session) {
        try {
            String user = (String) session.getAttribute("user");
            if (user == null || !user.equals("admin")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
            }

            Quiz quiz = quizRepository.findById(quizId).orElse(null);
            if (quiz == null) {
                return ResponseEntity.notFound().build();
            }

            // Delete all questions first
            questionRepository.deleteAll(quiz.getQuestions());
            // Delete the quiz
            quizRepository.delete(quiz);

            return ResponseEntity.ok(Map.of("message", "Quiz deleted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete quiz: " + e.getMessage()));
        }
    }

    @GetMapping("/admin/quizzes/{quizId}/attempts")
    public ResponseEntity<?> getQuizAttempts(@PathVariable Long quizId, HttpSession session) {
        try {
            String user = (String) session.getAttribute("user");
            if (user == null || !user.equals("admin")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
            }

            List<QuizAttempt> attempts = quizAttemptRepository.findByQuiz_Id(quizId);
            System.out.println("Returning " + attempts.size() + " attempts for quizId=" + quizId);

            // Map attempts to DTO-friendly structure and serialize attemptDate to ISO string
            List<Map<String, Object>> out = new ArrayList<>();
            for (QuizAttempt a : attempts) {
                Map<String, Object> m = new HashMap<>();
                m.put("id", a.getId());
                m.put("studentId", a.getStudentId());
                m.put("studentName", a.getStudentName());
                m.put("score", a.getScore());
                m.put("totalQuestions", a.getTotalQuestions());
                m.put("percentage", a.getPercentage());
                m.put("passed", a.isPassed());
                m.put("attemptDate", a.getAttemptDate() == null ? null : a.getAttemptDate().toString());
                out.add(m);
            }

            return ResponseEntity.ok(out);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch quiz attempts: " + e.getMessage()));
        }
    }
}
