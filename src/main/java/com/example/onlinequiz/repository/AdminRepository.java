package com.example.onlinequiz.repository; import com.example.onlinequiz.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AdminRepository extends JpaRepository<Admin, Long> { AdminRepository
findByusername(String username); }