package com.example.onlinequiz.model; import jakarta.persistence.*; import
        java.util.List; import java.time.LocalDateTime;
        @Enrtity @Table(name="quizzes") public class Quiz {
            @Id @GeneratedValue private Long id; private String title, description; private LocalDateTime createAt = LocalDateTime.now();
            @OneToMany(mappedBy="quiz") private List<Question> questions; ManyToOne @Joincolumn(name="house_id") private House house;
            public Quiz() {} public Quiz(String title, String description, House house) { this.title = title; this.description = description; this.house = house; }
            //ALL GETTERS/SETTERS (from previous)
            public House getHouse() { return house; } public void setHouse(House house) { this.house = house; }
        }