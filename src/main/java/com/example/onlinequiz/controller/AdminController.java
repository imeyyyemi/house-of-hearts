package com.example.quiz.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpSession;
import java.util.Map;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.springframework.core.io.ClassPathResource; // From previous step
import org.springframework.web.bind.annotation.CrossOrigin; // Add this

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {
    @PostMapping("/api/admin/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpSession session) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        System.out.println("Login attempt for username: " + username);

        try {
            ClassPathResource resource = new ClassPathResource("admin_env.txt");
            String storedPassword = Files.readString(resource.getFile().toPath()).trim();
            if ("admin".equals(username) && storedPassword.equals(password)) {
                session.setAttribute("user", username);
                session.setMaxInactiveInterval(3600); // 1 hour session timeout
                System.out.println("Login successful. Session ID: " + session.getId());
                return ResponseEntity.ok(Map.of(
                        "username", username,
                        "sessionId", session.getId()
                ));
            }
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Password file error"));
        }
        System.out.println("Login failed for username: " + username);
        return ResponseEntity.badRequest().body(Map.of("error", "Wrong credentials"));
    }
}

        @GetMapping("/api/admin/quizzes")
         public ResponseEntity<List<Quiz>> listQuizzes() {
         List<Quiz> quizzes = quizService.getAllQuizzes();
         return ResponseEntity.ok(quizzes);
    }
}