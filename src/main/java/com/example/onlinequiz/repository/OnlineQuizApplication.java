package com.example.onlinquiz.controller;
import com.example.onlinquiz.model.; import com.example.onlinquiz.repository.; import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @CrossOrigin(origins = "http://localhost:3000") @RequestMapping("/api")
public class ApiController {
    @Autowired private QuizRepository quizRepo; @Autowired private QuestionRepository questionRepo;
    @Autowired private HouseRepository houseRepo; @Autowired private AdminRepository adminRepo;
    // --- Authentication Endpoint ---
    @PostMapping("/login") public String login(@RequestBody LoginRequest req) {
        Admin admin = adminRepo.findByUsername(req.username);return admin != null &&
                admin.getPassword().equals(req.password) ? "VALID" : "INVALID";
    }
    // --- Retrieval Endpoints ---
    @GetMapping("/houses") public List<House> getHouses() { return houseRepo.findAll(); }
    @GetMapping("/quizzes") public List<Quiz> getQuizzes() { return quizRepo.findAll(); }
    @GetMapping("/quizzes/{houseId}") public List<Quiz>
    getQuizzesByHouse(@PathVariable Long houseId) { return quizRepo.findByHouseId(houseId); }
    // --- Quiz Creation Endpoint ---
    @PostMapping("/quizzes") public Quiz createQuiz(@RequestBody Quiz quiz) { return quizRepo.save(quiz); }
    // --- Question Retrieval Endpoint ---
    @GetMapping("/quizzes/{id}/questions") public List<Question>
    getQuestions(@PathVariable Long id) { return questionRepo.findByQuizId(id); }
    // --- Quiz Submission Endpoint ---
    @PostMapping("/quizzes/submit") public int submitQuiz(@RequestBody SubmitRequest req)
    {
        int score = 0; for (Answer a : req.answers) { Question q =
            questionRepo.findById(a.questionId).get(); if (q.getCorrectAnswer().equals(a.answer)) {
        score++; }
    }
        return score;
    }
    class LoginRequest { public String username, password; } class SubmitRequest { public Long quizId; public List<Answer> answer;} class Answer { public Long questionId; public String answer; }