package com.example.onlinequiz.model; import jakarta.persistence.*; import java.util.List;
@Entity @Table(name="questions") public class  Question {
    @Id @GeneratedValue private Long id; private String text, correctAnswer;
    @ElementCollection @CollectionTable(name="question_options", joinColumns=@JoinColumn(name="question_id")) @Column(name="option") private List<String> options;
    @ManyToOne @JoinColumn(name="quiz_id") private Quiz quiz;
    public Question() {} public Question(String text, List<String> options, String correctAnswer, Quiz quiz) {
        this.text=text; this.options=options; this.correctAnswer=correctAnswer; this.quiz=quiz;
    }
//ALL GETTERS/SETTERS (from previous)