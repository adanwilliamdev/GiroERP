package com.giroerp.controller;

import com.giroerp.service.BackupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/backup")
@RequiredArgsConstructor
public class BackupController {
    
    private final BackupService backupService;
    
    @GetMapping("/listar")
    public ResponseEntity<List<String>> listarBackups() {
        return ResponseEntity.ok(backupService.listarBackups());
    }
    
    @PostMapping("/realizar")
    public ResponseEntity<Map<String, String>> realizarBackup() {
        backupService.realizarBackupAutomatico();
        Map<String, String> response = new HashMap<>();
        response.put("message", "Backup realizado com sucesso!");
        return ResponseEntity.ok(response);
    }
}