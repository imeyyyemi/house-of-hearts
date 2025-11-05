package com.example.quiz.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import com.example.quiz.model.Quiz;
import com.example.quiz.model.Question;
import com.example.quiz.repository.QuizRepository;
import com.example.quiz.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Arrays;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {
    @Autowired private QuizRepository quizRepository;
    @Autowired private QuestionRepository questionRepository;

    @GetMapping("/api/test")
    public ResponseEntity<?> testDatabase() {
        Quiz quiz = new Quiz("Test Quiz", "Sample");
        quiz = quizRepository.save(quiz);
        Question question = new Question("What?", Arrays.asList("A", "B", "C", "D"), "A", quiz);
        questionRepository.save(question);
        return ResponseEntity.ok("{\"message\": \"✅ JAVA QUIZ SAVED!\", \"quizId\": " + quiz.getId() + ", \"questionId\": " + question.getId() + "}");
    }
}