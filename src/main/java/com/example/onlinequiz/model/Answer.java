package com.example.onlinequiz;
@Entity @Table(name="houses") public class House {
    @Id @GeneratedValue private Long id; private String name, color;
    public House() {} public House(String name, String color) { this.name = name; this.color = color; }
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }

    public String getColor() { return color; } public void setColor(String color)  { this.color = color; }
