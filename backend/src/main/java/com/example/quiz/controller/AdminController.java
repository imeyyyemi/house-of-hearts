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

    }
}
