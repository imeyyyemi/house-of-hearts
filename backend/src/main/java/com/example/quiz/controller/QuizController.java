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

    @GetMapping("/quizzes")
    public List<Quiz> getQuizzes() {
        return quizRepository.findAll();
    }

    @PostMapping("/admin/quizzes")
    public ResponseEntity<?> createQuiz(@RequestBody Map<String, Object> quizData, HttpSession session) {
        try {
            System.out.println("Received quiz creation request: " + quizData);
            System.out.println("Session attributes: " + session.getAttribute("user"));

            String user = (String) session.getAttribute("user");
            if (user == null || !user.equals("admin")) {
                System.out.println("Unauthorized: user = " + user);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
            }

            // Validate required fields
            if (quizData.get("title") == null || ((String) quizData.get("title")).trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Quiz title is required"));
            }

            // Create quiz
            Quiz quiz = new Quiz();
            quiz.setTitle((String) quizData.get("title"));
            quiz.setDescription((String) quizData.get("description"));
            quiz = quizRepository.save(quiz);
            System.out.println("Created quiz: " + quiz.getId());

            // Handle questions if they exist
            List<Map<String, Object>> questions = (List<Map<String, Object>>) quizData.get("questions");
            if (questions != null && !questions.isEmpty()) {
                List<Question> savedQuestions = new ArrayList<>();

                for (Map<String, Object> q : questions) {
                    if (q.get("questionText") == null || ((String) q.get("questionText")).trim().isEmpty()) {
                        continue; // Skip invalid questions
                    }

                    Question question = new Question();
                    question.setText((String) q.get("questionText"));
                    question.setCorrectAnswer((String) q.get("correctAnswer"));

                    // Handle options
                    List<?> optionsList = (List<?>) q.get("options");
                    List<String> options = new ArrayList<>();
                    if (optionsList != null) {
                        for (Object opt : optionsList) {
                            if (opt instanceof String && !((String) opt).trim().isEmpty()) {
                                options.add((String) opt);
                            }
                        }
                    }

                    if (!options.isEmpty() && question.getCorrectAnswer() != null) {
                        question.setOptions(options);
                        question.setQuiz(quiz);
                        Question savedQuestion = questionRepository.save(question);
                        savedQuestions.add(savedQuestion);
                        System.out.println("Added question: " + savedQuestion.getId());
                    }
                }

                if (!savedQuestions.isEmpty()) {
                    quiz.setQuestions(savedQuestions);
                    quiz = quizRepository.save(quiz);
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("id", quiz.getId());
            response.put("title", quiz.getTitle());
            response.put("description", quiz.getDescription());
            response.put("questionCount", quiz.getQuestions().size());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error creating quiz: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create quiz: " + e.getMessage()));
        }
    }

    @GetMapping("/student/quizzes")
    public ResponseEntity<List<Map<String, Object>>> getAvailableQuizzes() {
        List<Quiz> quizzes = quizRepository.findAll();
        List<Map<String, Object>> quizInfoList = new ArrayList<>();

        for (Quiz quiz : quizzes) {
            Map<String, Object> quizInfo = new HashMap<>();
            quizInfo.put("id", quiz.getId());
            quizInfo.put("title", quiz.getTitle());
            quizInfo.put("description", quiz.getDescription());
            quizInfo.put("questionCount", quiz.getQuestions().size());
            quizInfoList.add(quizInfo);
        }

        return ResponseEntity.ok(quizInfoList);
    }

    @GetMapping("/student/quizzes/{quizId}")
    public ResponseEntity<?> getQuizQuestions(@PathVariable Long quizId) {
        try {
            Quiz quiz = quizRepository.findById(quizId).orElse(null);
            if (quiz == null) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("id", quiz.getId());
            response.put("title", quiz.getTitle());
            response.put("description", quiz.getDescription());

            List<Map<String, Object>> questionsList = new ArrayList<>();
            for (Question q : quiz.getQuestions()) {
                Map<String, Object> questionMap = new HashMap<>();
                questionMap.put("id", q.getId());
                questionMap.put("text", q.getText());
                questionMap.put("options", q.getOptions());
                // Don't include correct answer for student view
                questionsList.add(questionMap);
            }

            response.put("questions", questionsList);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to load quiz: " + e.getMessage()));
        }
    }

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