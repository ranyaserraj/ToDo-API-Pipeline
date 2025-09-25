#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 SYSTÈME DYNAMIQUE COMPLET');
console.log('===========================');

function runCommand(command) {
    try {
        return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).trim();
    } catch (error) {
        return null;
    }
}

function collectRealTimeMetrics() {
    console.log('📊 Collecte des métriques en temps réel...');
    
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
        timestamp: new Date().toISOString(),
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

function createDynamicDashboard(metrics) {
    console.log('📈 Création du dashboard dynamique...');
    
    const dashboard = {
        "dashboard": {
            "id": null,
            "title": `Dynamic System Monitoring - ${new Date().toLocaleString()}`,
            "tags": ["dynamic", "monitoring", "realtime"],
            "style": "dark",
            "timezone": "browser",
            "panels": [
                {
                    "id": 1,
                    "title": "CPU Usage %",
                    "type": "stat",
                    "targets": [{"expr": "cpu_usage_percent", "refId": "A"}],
                    "fieldConfig": {
                        "defaults": {
                            "unit": "percent",
                            "color": {"mode": "thresholds"},
                            "thresholds": {
                                "steps": [
                                    {"color": "green", "value": null},
                                    {"color": "yellow", "value": 50},
                                    {"color": "red", "value": 80}
                                ]
                            }
                        }
                    },
                    "gridPos": {"h": 8, "w": 6, "x": 0, "y": 0}
                },
                {
                    "id": 2,
                    "title": "Memory Usage %",
                    "type": "stat",
                    "targets": [{"expr": "memory_used_percent", "refId": "A"}],
                    "fieldConfig": {
                        "defaults": {
                            "unit": "percent",
                            "color": {"mode": "thresholds"},
                            "thresholds": {
                                "steps": [
                                    {"color": "green", "value": null},
                                    {"color": "yellow", "value": 60},
                                    {"color": "red", "value": 80}
                                ]
                            }
                        }
                    },
                    "gridPos": {"h": 8, "w": 6, "x": 6, "y": 0}
                },
                {
                    "id": 3,
                    "title": "Power (Watts)",
                    "type": "stat",
                    "targets": [{"expr": "power_watts", "refId": "A"}],
                    "fieldConfig": {
                        "defaults": {
                            "unit": "watt",
                            "color": {"mode": "thresholds"},
                            "thresholds": {
                                "steps": [
                                    {"color": "green", "value": null},
                                    {"color": "yellow", "value": 50},
                                    {"color": "red", "value": 100}
                                ]
                            }
                        }
                    },
                    "gridPos": {"h": 8, "w": 6, "x": 12, "y": 0}
                },
                {
                    "id": 4,
                    "title": "CO2 (kg CO2e)",
                    "type": "stat",
                    "targets": [{"expr": "co2_emissions_kg", "refId": "A"}],
                    "fieldConfig": {
                        "defaults": {
                            "unit": "short",
                            "color": {"mode": "thresholds"},
                            "thresholds": {
                                "steps": [
                                    {"color": "green", "value": null},
                                    {"color": "yellow", "value": 0.005},
                                    {"color": "red", "value": 0.01}
                                ]
                            }
                        }
                    },
                    "gridPos": {"h": 8, "w": 6, "x": 18, "y": 0}
                },
                {
                    "id": 5,
                    "title": "CPU Usage Over Time",
                    "type": "timeseries",
                    "targets": [{"expr": "cpu_usage_percent", "refId": "A"}],
                    "fieldConfig": {
                        "defaults": {
                            "unit": "percent",
                            "color": {"mode": "palette-classic"}
                        }
                    },
                    "gridPos": {"h": 8, "w": 12, "x": 0, "y": 8}
                },
                {
                    "id": 6,
                    "title": "Memory Usage Over Time",
                    "type": "timeseries",
                    "targets": [{"expr": "memory_used_percent", "refId": "A"}],
                    "fieldConfig": {
                        "defaults": {
                            "unit": "percent",
                            "color": {"mode": "palette-classic"}
                        }
                    },
                    "gridPos": {"h": 8, "w": 12, "x": 12, "y": 8}
                },
                {
                    "id": 7,
                    "title": "CO2 Emissions Over Time",
                    "type": "timeseries",
                    "targets": [{"expr": "co2_emissions_kg", "refId": "A"}],
                    "fieldConfig": {
                        "defaults": {
                            "unit": "short",
                            "color": {"mode": "palette-classic"}
                        }
                    },
                    "gridPos": {"h": 8, "w": 24, "x": 0, "y": 16}
                }
            ],
            "time": {"from": "now-1h", "to": "now"},
            "refresh": "5s"
        },
        "overwrite": true,
        "inputs": [
            {
                "name": "DS_PROMETHEUS",
                "type": "datasource",
                "pluginId": "prometheus",
                "value": "prometheus-local"
            }
        ]
    };

    // Sauvegarder le dashboard dynamique
    const dashboardPath = path.join(__dirname, 'dynamic-dashboard.json');
    fs.writeFileSync(dashboardPath, JSON.stringify(dashboard, null, 2));
    
    console.log('✅ Dashboard dynamique créé !');
    console.log(`   📊 CPU: ${metrics.cpu.cores} cores, ${metrics.cpu.usage_percent.toFixed(2)}%`);
    console.log(`   💾 Mémoire: ${(metrics.memory.used_bytes / (1024*1024*1024)).toFixed(2)}GB / ${(metrics.memory.total_bytes / (1024*1024*1024)).toFixed(2)}GB`);
    console.log(`   ⚡ Puissance: ${metrics.carbon.power_watts.toFixed(3)}W`);
    console.log(`   🌍 CO2: ${metrics.carbon.co2_emissions_kg.toFixed(6)} kg CO2e`);
    
    return dashboard;
}

function startContinuousMonitoring() {
    console.log('🔄 Démarrage de la surveillance continue...');
    console.log('   📊 Collecte toutes les 30 secondes');
    console.log('   📈 Mise à jour automatique du dashboard');
    console.log('   ⏹️  Appuyez sur Ctrl+C pour arrêter');
    console.log('');

    let intervalId = setInterval(() => {
        const metrics = collectRealTimeMetrics();
        createDynamicDashboard(metrics);
        
        console.log(`📊 ${new Date().toLocaleTimeString()} - Métriques mises à jour:`);
        console.log(`   🖥️  CPU: ${metrics.cpu.usage_percent.toFixed(2)}%`);
        console.log(`   💾 Mémoire: ${metrics.memory.used_percent.toFixed(2)}%`);
        console.log(`   ⚡ Puissance: ${metrics.carbon.power_watts.toFixed(3)}W`);
        console.log(`   🌍 CO2: ${metrics.carbon.co2_emissions_kg.toFixed(6)} kg CO2e`);
        console.log('');
    }, 30000); // Toutes les 30 secondes

    // Arrêt propre
    process.on('SIGINT', () => {
        console.log('\n⏹️  Arrêt de la surveillance...');
        clearInterval(intervalId);
        console.log('✅ Surveillance arrêtée.');
        process.exit(0);
    });

    // Première collecte
    const initialMetrics = collectRealTimeMetrics();
    createDynamicDashboard(initialMetrics);
}

// Démarrer le système
startContinuousMonitoring();
