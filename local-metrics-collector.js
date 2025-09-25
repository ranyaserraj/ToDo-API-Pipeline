#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

console.log('📊 COLLECTEUR DE MÉTRIQUES LOCALES D\'EMPREINTE CARBONE');
console.log('======================================================');

// Configuration pour la mesure locale
const LOCAL_CONFIG = {
    // Facteurs d'émission locaux (exemples pour la France)
    electricityFactor: 0.057, // kg CO2e par kWh (France 2023)
    memoryFactor: 0.000001, // kg CO2e par MB par heure
    cpuFactor: 0.00001, // kg CO2e par core par heure
    diskFactor: 0.0000001, // kg CO2e par MB par heure
    networkFactor: 0.0000001 // kg CO2e par MB
};

// Fonction pour exécuter une commande
function execCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`⚠️  Commande échouée: ${command}`);
                resolve(null);
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

// Mesurer la consommation CPU locale
async function measureLocalCPU() {
    try {
        const cpus = os.cpus();
        let totalIdle = 0;
        let totalTick = 0;
        
        cpus.forEach(cpu => {
            for (type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        });
        
        const usage = ((totalTick - totalIdle) / totalTick * 100);
        const powerConsumption = (usage / 100) * cpus.length * 0.1; // Watts par core
        
        return {
            cores: cpus.length,
            usage: usage.toFixed(2),
            powerWatts: powerConsumption,
            powerKWh: powerConsumption / 1000 // Conversion en kWh
        };
    } catch (error) {
        console.log('⚠️  Erreur mesure CPU:', error.message);
        return { cores: 1, usage: 0, powerWatts: 0.1, powerKWh: 0.0001 };
    }
}

// Mesurer la consommation mémoire locale
function measureLocalMemory() {
    try {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        
        // Estimation de la consommation électrique de la RAM
        const ramPowerWatts = (usedMem / 1024 / 1024) * 0.01; // 0.01W par MB de RAM
        
        return {
            total: Math.round(totalMem / 1024 / 1024), // MB
            used: Math.round(usedMem / 1024 / 1024), // MB
            free: Math.round(freeMem / 1024 / 1024), // MB
            powerWatts: ramPowerWatts,
            powerKWh: ramPowerWatts / 1000
        };
    } catch (error) {
        console.log('⚠️  Erreur mesure mémoire:', error.message);
        return { total: 0, used: 0, free: 0, powerWatts: 0.1, powerKWh: 0.0001 };
    }
}

// Mesurer la consommation Docker locale
async function measureLocalDocker() {
    try {
        // Mesurer la taille des images
        const imageSize = await execCommand('docker images --format "{{.Size}}" | head -1');
        const sizeMB = imageSize ? parseInt(imageSize.match(/\d+/)?.[0] || '45') : 45;
        
        // Mesurer les conteneurs en cours
        const containers = await execCommand('docker ps --format "{{.Names}}"');
        const containerCount = containers ? containers.split('\n').filter(c => c.trim()).length : 0;
        
        // Estimation de la consommation Docker
        const dockerPowerWatts = containerCount * 0.5; // 0.5W par conteneur
        
        return {
            imageSize: sizeMB,
            containerCount: containerCount,
            powerWatts: dockerPowerWatts,
            powerKWh: dockerPowerWatts / 1000
        };
    } catch (error) {
        console.log('⚠️  Erreur mesure Docker:', error.message);
        return { imageSize: 45, containerCount: 1, powerWatts: 0.5, powerKWh: 0.0005 };
    }
}

// Mesurer la consommation réseau locale
async function measureLocalNetwork() {
    try {
        // Estimation basée sur l'activité réseau
        const networkActivity = await execCommand('netstat -i | grep -v lo | wc -l');
        const interfaceCount = networkActivity ? parseInt(networkActivity) : 1;
        
        const networkPowerWatts = interfaceCount * 0.1; // 0.1W par interface
        
        return {
            interfaces: interfaceCount,
            powerWatts: networkPowerWatts,
            powerKWh: networkPowerWatts / 1000
        };
    } catch (error) {
        console.log('⚠️  Erreur mesure réseau:', error.message);
        return { interfaces: 1, powerWatts: 0.1, powerKWh: 0.0001 };
    }
}

// Calculer l'empreinte carbone locale
function calculateLocalCarbonFootprint(metrics) {
    const totalPowerKWh = 
        metrics.cpu.powerKWh + 
        metrics.memory.powerKWh + 
        metrics.docker.powerKWh + 
        metrics.network.powerKWh;
    
    const co2Emissions = totalPowerKWh * LOCAL_CONFIG.electricityFactor;
    
    return {
        totalPowerKWh: totalPowerKWh,
        co2Emissions: co2Emissions,
        electricityFactor: LOCAL_CONFIG.electricityFactor
    };
}

// Fonction principale de collecte locale
async function collectLocalMetrics() {
    console.log('📊 Collecte des métriques locales...');
    
    // 1. Mesurer le CPU local
    console.log('   🖥️  Mesure du CPU local...');
    const cpu = await measureLocalCPU();
    
    // 2. Mesurer la mémoire locale
    console.log('   💾 Mesure de la mémoire locale...');
    const memory = measureLocalMemory();
    
    // 3. Mesurer Docker local
    console.log('   🐳 Mesure de Docker local...');
    const docker = await measureLocalDocker();
    
    // 4. Mesurer le réseau local
    console.log('   🌐 Mesure du réseau local...');
    const network = await measureLocalNetwork();
    
    // 5. Calculer l'empreinte carbone locale
    console.log('   🌱 Calcul de l\'empreinte carbone locale...');
    const metrics = { cpu, memory, docker, network };
    const carbonFootprint = calculateLocalCarbonFootprint(metrics);
    
    // 6. Créer le rapport local
    const report = {
        timestamp: new Date().toISOString(),
        pipeline: {
            name: 'ToDo-API-Local',
            type: 'Local-Docker',
            region: 'Local-Machine',
            metrics: {
                cpu: {
                    cores: cpu.cores,
                    usage: `${cpu.usage}%`,
                    powerWatts: `${cpu.powerWatts.toFixed(3)}W`,
                    powerKWh: `${cpu.powerKWh.toFixed(6)}kWh`
                },
                memory: {
                    total: `${memory.total}MB`,
                    used: `${memory.used}MB`,
                    free: `${memory.free}MB`,
                    powerWatts: `${memory.powerWatts.toFixed(3)}W`,
                    powerKWh: `${memory.powerKWh.toFixed(6)}kWh`
                },
                docker: {
                    imageSize: `${docker.imageSize}MB`,
                    containerCount: docker.containerCount,
                    powerWatts: `${docker.powerWatts.toFixed(3)}W`,
                    powerKWh: `${docker.powerKWh.toFixed(6)}kWh`
                },
                network: {
                    interfaces: network.interfaces,
                    powerWatts: `${network.powerWatts.toFixed(3)}W`,
                    powerKWh: `${network.powerKWh.toFixed(6)}kWh`
                }
            }
        },
        carbonFootprint: {
            totalPowerKWh: carbonFootprint.totalPowerKWh,
            co2Emissions: carbonFootprint.co2Emissions,
            electricityFactor: carbonFootprint.electricityFactor
        },
        localFactors: LOCAL_CONFIG
    };
    
    // 7. Sauvegarder le rapport local
    const reportPath = path.join(__dirname, 'local-metrics-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 4));
    
    console.log('\n📊 MÉTRIQUES LOCALES COLLECTÉES:');
    console.log(`   🖥️  CPU: ${cpu.cores} cores, ${cpu.usage}% utilisation, ${cpu.powerWatts.toFixed(3)}W`);
    console.log(`   💾 Mémoire: ${memory.used}MB / ${memory.total}MB, ${memory.powerWatts.toFixed(3)}W`);
    console.log(`   🐳 Docker: ${docker.imageSize}MB, ${docker.containerCount} conteneurs, ${docker.powerWatts.toFixed(3)}W`);
    console.log(`   🌐 Réseau: ${network.interfaces} interfaces, ${network.powerWatts.toFixed(3)}W`);
    console.log(`   ⚡ Puissance totale: ${carbonFootprint.totalPowerKWh.toFixed(6)} kWh`);
    console.log(`   🌍 CO2: ${carbonFootprint.co2Emissions.toFixed(6)} kg CO2e`);
    
    console.log(`\n💾 Rapport local sauvegardé: ${reportPath}`);
    
    return report;
}

// Exécuter la collecte locale
collectLocalMetrics().then(report => {
    console.log('\n✅ Collecte locale terminée avec succès !');
    console.log('📈 Utilisez ces métriques pour alimenter votre dashboard Grafana local.');
}).catch(error => {
    console.error('❌ Erreur lors de la collecte locale:', error.message);
    process.exit(1);
});
