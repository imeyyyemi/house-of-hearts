package com.example.onlinequiz.repository; import com.example.onlinequiz.model.House;
import org.springframework.data.jpa.repository.JpaRepository;
public interface HouseRepository extends JpaRepository<House, Long> { House
findByName(String name);