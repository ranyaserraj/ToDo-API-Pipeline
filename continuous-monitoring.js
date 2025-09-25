#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 SURVEILLANCE CONTINUE DES MÉTRIQUES');
console.log('====================================');

function runCommand(command) {
    try {
        return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).trim();
    } catch (error) {
        return null;
    }
}

function collectMetrics() {
    const timestamp = new Date().toISOString();
    
    // CPU
    let cpuUsage = 0;
    try {
        const cpuLoad = runCommand('wmic cpu get LoadPercentage /value');
        if (cpuLoad) {
            const loadMatch = cpuLoad.match(/LoadPercentage=(\d+)/);
            cpuUsage = loadMatch ? parseInt(loadMatch[1]) : 0;
        }
    } catch (error) {
        console.warn(`⚠️  Erreur CPU: ${error.message}`);
    }

    // Mémoire
    let memoryUsed = 0;
    let memoryTotal = 0;
    try {
        const memoryInfo = runCommand('wmic ComputerSystem get TotalPhysicalMemory /value');
        const freeMemoryInfo = runCommand('wmic OS get FreePhysicalMemory /value');
        
        if (memoryInfo && freeMemoryInfo) {
            const totalMatch = memoryInfo.match(/TotalPhysicalMemory=(\d+)/);
            const freeMatch = freeMemoryInfo.match(/FreePhysicalMemory=(\d+)/);
            
            memoryTotal = totalMatch ? Math.round(parseInt(totalMatch[1]) / (1024 * 1024)) : 0;
            const freeMB = freeMatch ? Math.round(parseInt(freeMatch[1]) / 1024) : 0;
            memoryUsed = memoryTotal - freeMB;
        }
    } catch (error) {
        console.warn(`⚠️  Erreur mémoire: ${error.message}`);
    }

    // Docker
    let dockerContainerCount = 0;
    try {
        const containerCountOutput = runCommand('docker ps -q | wc -l');
        if (containerCountOutput) {
            dockerContainerCount = parseInt(containerCountOutput);
        }
    } catch (error) {
        console.warn(`⚠️  Erreur Docker: ${error.message}`);
    }

    // Calculs d'empreinte carbone
    const cpuCores = 12;
    const cpuPowerWatts = cpuCores * (cpuUsage / 100) * 0.01 * 100;
    const memoryPowerWatts = memoryUsed * 0.00001 * 1000;
    const dockerPowerWatts = dockerContainerCount * 0.5;
    const networkPowerWatts = 1 * 0.1;
    
    const totalPowerWatts = cpuPowerWatts + memoryPowerWatts + dockerPowerWatts + networkPowerWatts;
    const totalPowerKWh = totalPowerWatts / 1000;
    const co2Emissions = totalPowerKWh * 0.057;

    return {
        timestamp,
        cpu: {
            cores: cpuCores,
            usage_percent: cpuUsage,
            power_watts: cpuPowerWatts
        },
        memory: {
            total_bytes: memoryTotal * 1024 * 1024,
            used_bytes: memoryUsed * 1024 * 1024,
            used_percent: memoryTotal > 0 ? (memoryUsed / memoryTotal) * 100 : 0
        },
        docker: {
            container_count: dockerContainerCount
        },
        carbon: {
            power_watts: totalPowerWatts,
            power_kwh: totalPowerKWh,
            co2_emissions_kg: co2Emissions,
            electricity_factor: 0.057
        }
    };
}

function updateDashboard(metrics) {
    console.log(`📊 ${new Date().toLocaleTimeString()} - Métriques collectées:`);
    console.log(`   🖥️  CPU: ${metrics.cpu.cores} cores, ${metrics.cpu.usage_percent.toFixed(2)}%`);
    console.log(`   💾 Mémoire: ${(metrics.memory.used_bytes / (1024*1024*1024)).toFixed(2)}GB / ${(metrics.memory.total_bytes / (1024*1024*1024)).toFixed(2)}GB`);
    console.log(`   🐳 Docker: ${metrics.docker.container_count} conteneurs`);
    console.log(`   ⚡ Puissance: ${metrics.carbon.power_watts.toFixed(3)}W`);
    console.log(`   🌍 CO2: ${metrics.carbon.co2_emissions_kg.toFixed(6)} kg CO2e`);
    
    // Sauvegarder les métriques
    const metricsPath = path.join(__dirname, 'continuous-metrics.json');
    fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2));
}

// Surveillance continue
console.log('🔄 Démarrage de la surveillance continue...');
console.log('   📊 Collecte toutes les 30 secondes');
console.log('   📈 Mise à jour automatique du dashboard');
console.log('   ⏹️  Appuyez sur Ctrl+C pour arrêter');
console.log('');

let intervalId = setInterval(() => {
    const metrics = collectMetrics();
    updateDashboard(metrics);
}, 30000); // Toutes les 30 secondes

// Arrêt propre
process.on('SIGINT', () => {
    console.log('\n⏹️  Arrêt de la surveillance...');
    clearInterval(intervalId);
    console.log('✅ Surveillance arrêtée.');
    process.exit(0);
});

// Première collecte
const initialMetrics = collectMetrics();
updateDashboard(initialMetrics);
