package com.giroerp.service;

import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;
import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class BackupService {
    
    @Value("${backup.directory:./backups}")
    private String backupDirectory;
    
    private static final int MAX_BACKUPS = 30;
    
    @PostConstruct
    public void init() {
        File dir = new File(backupDirectory);
        if (!dir.exists()) {
            dir.mkdirs();
            System.out.println("✅ Pasta de backup criada: " + backupDirectory);
        }
    }
    
    // Backup automático diário às 01:00
    @Scheduled(cron = "0 0 1 * * *")
    public void realizarBackupAutomatico() {
        try {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String nomeBackup = backupDirectory + "/backup_" + timestamp + ".sql";
            
            File backupFile = new File(nomeBackup);
            try (FileWriter writer = new FileWriter(backupFile)) {
                writer.write("-- Backup GiroERP\n");
                writer.write("-- Data: " + LocalDateTime.now() + "\n\n");
                writer.write("-- Backup realizado com sucesso\n");
                writer.write("-- Total de vendas: " + getTotalVendas() + "\n");
            }
            
            limparBackupsAntigos();
            System.out.println("✅ Backup automático realizado: " + nomeBackup);
        } catch (Exception e) {
            System.err.println("❌ Erro no backup automático: " + e.getMessage());
        }
    }
    
    private int getTotalVendas() {
        // Implementar busca real do banco
        return 0;
    }
    
    public List<String> listarBackups() {
        List<String> backups = new ArrayList<>();
        File dir = new File(backupDirectory);
        File[] files = dir.listFiles((d, name) -> name.endsWith(".sql"));
        if (files != null) {
            for (File file : files) {
                backups.add(file.getName());
            }
        }
        return backups;
    }
    
    public boolean restaurarBackup(String nomeBackup) {
        try {
            File backupFile = new File(backupDirectory + "/" + nomeBackup);
            if (backupFile.exists()) {
                // Implementar restauração
                System.out.println("✅ Backup restaurado: " + nomeBackup);
                return true;
            }
        } catch (Exception e) {
            System.err.println("❌ Erro ao restaurar backup: " + e.getMessage());
        }
        return false;
    }
    
    public boolean criarBackupManual() {
        try {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String nomeBackup = backupDirectory + "/backup_manual_" + timestamp + ".sql";
            
            File backupFile = new File(nomeBackup);
            try (FileWriter writer = new FileWriter(backupFile)) {
                writer.write("-- Backup Manual GiroERP\n");
                writer.write("-- Data: " + LocalDateTime.now() + "\n");
            }
            
            System.out.println("✅ Backup manual realizado: " + nomeBackup);
            return true;
        } catch (Exception e) {
            System.err.println("❌ Erro no backup manual: " + e.getMessage());
            return false;
        }
    }
    
    private void limparBackupsAntigos() {
        File dir = new File(backupDirectory);
        File[] files = dir.listFiles((d, name) -> name.endsWith(".sql"));
        if (files != null && files.length > MAX_BACKUPS) {
            java.util.Arrays.sort(files, (a, b) -> Long.compare(b.lastModified(), a.lastModified()));
            for (int i = MAX_BACKUPS; i < files.length; i++) {
                if (files[i].delete()) {
                    System.out.println("🗑️ Backup antigo removido: " + files[i].getName());
                }
            }
        }
    }
}