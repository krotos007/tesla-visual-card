# Script para sacar as imagens do Tesla Doors Visual (CORRIGIDO)
$baseUrl = "https://raw.githubusercontent.com/threesquare/Tesla-doors-visual/main/tesla_doors"
$destDir = "C:\Users\Krotos\CURSOR\Teslafi\tesla-doors-visual\images"

# Cria a pasta de imagens se não existir
if (!(Test-Path -Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir | Out-Null
    Write-Host "Pasta criada: $destDir"
}

# Lista de ficheiros CORRETA baseada no código do cartão
$files = @(
    "base.png",
    "trunk_base.png",
    "frunk_base.png",
    "plug.png",
    "driving.png",
    "charging.png",
    "fl.png",
    "fr.png",
    "rl.png",
    "rr.png",
    "frunk.png",
    "flrl.png",
    "plug_trunk.png",
    "plug_FL.png",
    "plug_FR.png",
    "plug_RL.png",
    "plug_RR.png",
    "plug_FLRL.png"
)

foreach ($file in $files) {
    $url = "$baseUrl/$file"
    $output = "$destDir\$file"
    Write-Host "A sacar: $file ..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $output
    }
    catch {
        Write-Warning "Falha ao sacar $file. Verifica se existe no repo original."
    }
}

Write-Host "Downloads concluídos!"
