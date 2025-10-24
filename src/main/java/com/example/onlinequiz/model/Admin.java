package com.example.onlinequiz.model; import jakarta.persistence.*;
@Entity @Table(name="admins") public class Admin {
    @Id @GeneratedValue private Long id; private String username, password;
    public Admin() {} public Admin(String username, String password;) {
        this.username = username; this.password = password; }
    //Getters/Setters

    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getUsename() { return username; } public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; } public void setPassword(String password) { this.password = password; }
}