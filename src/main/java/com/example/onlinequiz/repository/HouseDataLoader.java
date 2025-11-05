package com.example.quiz.repository;

import com.example.quiz.model.House;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HouseRepository extends JpaRepository<House, Long> {
    List<House> findAll();
    House findByName(String name);
}