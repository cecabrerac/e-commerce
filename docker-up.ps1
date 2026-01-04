# Script para levantar Docker Compose con o sin build

$files = @("Dockerfile", "docker-compose.yml", "backend")

# Revisar si hubo cambios en esos archivos
$changes = git diff --name-only HEAD -- $files

if ($changes) {
    Write-Host "⚡ Cambios detectados en Dockerfile o backend → usando 'docker compose up --build -d'"
    docker compose up --build -d
} else {
    Write-Host "✅ No hay cambios en Dockerfile ni backend → usando 'docker compose up -d'"
    docker compose up -d
}

# Para ejeccutar este script en PowerShell: .\docker-up.ps1