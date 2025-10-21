package com.example.quiz.repository;

import com.example.quiz.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    // Use nested property 'quiz.id' — underscores are required for nested property lookup
    List<QuizAttempt> findByQuiz_Id(Long quizId);
}
