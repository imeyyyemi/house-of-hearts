package com.example.onlinequiz.controller; // Siguraduhin na tama ang package mo

// Ang klase na ito ay ginagamit para tanggapin ang body ng request
// kapag nag-lo-login ang user o admin.
public class LoginRequest {

    // Ang username na ipinasa ng user.
    private String username;

    // Ang password na ipinasa ng user.
    private String password;

    // --- Constructors ---

    public LoginRequest() {}

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // --- Getters and Setters (Kailangan para sa Spring Boot/Jackson) ---

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}