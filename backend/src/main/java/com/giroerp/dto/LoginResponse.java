package com.giroerp.dto;

public class LoginResponse {
    private String token;
    private String refreshToken;
    private String type = "Bearer";
    private UsuarioDTO user;

    // Getters e Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public UsuarioDTO getUser() { return user; }
    public void setUser(UsuarioDTO user) { this.user = user; }
}