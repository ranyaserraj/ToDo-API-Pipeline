#!/usr/bin/env node

const os = require('os');
const fs = require('fs');

// Configuration pour la mesure locale
const LOCAL_CONFIG = {
    electricityFactor: 0.057, // kg CO2e par kWh (France 2023)
    memoryFactor: 0.000001, // kg CO2e par MB par heure
    cpuFactor: 0.00001, // kg CO2e par core par heure
};

// Fonction pour mesurer les métriques locales
function getLocalMetrics() {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    // Calculer l'utilisation CPU
    let totalIdle = 0;
    let totalTick = 0;
    cpus.forEach(cpu => {
        for (type in cpu.times) {
            totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
    });
    const cpuUsage = ((totalTick - totalIdle) / totalTick * 100);
    
    // Estimation de la consommation électrique
    const cpuPowerWatts = (cpuUsage / 100) * cpus.length * 0.1;
    const memoryPowerWatts = (usedMem / 1024 / 1024) * 0.01;
    const totalPowerWatts = cpuPowerWatts + memoryPowerWatts;
    const totalPowerKWh = totalPowerWatts / 1000;
    
    // Calculer l'empreinte carbone
    const co2Emissions = totalPowerKWh * LOCAL_CONFIG.electricityFactor;
    
    return {
        cpu_cores: cpus.length,
        cpu_usage_percent: cpuUsage,
        memory_total_bytes: totalMem,
        memory_used_bytes: usedMem,
        memory_free_bytes: freeMem,
        memory_used_percent: (usedMem / totalMem) * 100,
        power_watts: totalPowerWatts,
        power_kwh: totalPowerKWh,
        co2_emissions_kg: co2Emissions,
        electricity_factor: LOCAL_CONFIG.electricityFactor,
        timestamp: Date.now()
    };
}

// Fonction pour générer les métriques au format Prometheus
function generatePrometheusMetrics() {
    const metrics = getLocalMetrics();
    
    let prometheusMetrics = '';
    
    // Métriques CPU
    prometheusMetrics += `# HELP cpu_cores_total Number of CPU cores\n`;
    prometheusMetrics += `# TYPE cpu_cores_total gauge\n`;
    prometheusMetrics += `cpu_cores_total ${metrics.cpu_cores}\n\n`;
    
    prometheusMetrics += `# HELP cpu_usage_percent CPU usage percentage\n`;
    prometheusMetrics += `# TYPE cpu_usage_percent gauge\n`;
    prometheusMetrics += `cpu_usage_percent ${metrics.cpu_usage_percent}\n\n`;
    
    // Métriques Mémoire
    prometheusMetrics += `# HELP memory_total_bytes Total memory in bytes\n`;
    prometheusMetrics += `# TYPE memory_total_bytes gauge\n`;
    prometheusMetrics += `memory_total_bytes ${metrics.memory_total_bytes}\n\n`;
    
    prometheusMetrics += `# HELP memory_used_bytes Used memory in bytes\n`;
    prometheusMetrics += `# TYPE memory_used_bytes gauge\n`;
    prometheusMetrics += `memory_used_bytes ${metrics.memory_used_bytes}\n\n`;
    
    prometheusMetrics += `# HELP memory_free_bytes Free memory in bytes\n`;
    prometheusMetrics += `# TYPE memory_free_bytes gauge\n`;
    prometheusMetrics += `memory_free_bytes ${metrics.memory_free_bytes}\n\n`;
    
    prometheusMetrics += `# HELP memory_used_percent Memory usage percentage\n`;
    prometheusMetrics += `# TYPE memory_used_percent gauge\n`;
    prometheusMetrics += `memory_used_percent ${metrics.memory_used_percent}\n\n`;
    
    // Métriques de Consommation Électrique
    prometheusMetrics += `# HELP power_watts Power consumption in watts\n`;
    prometheusMetrics += `# TYPE power_watts gauge\n`;
    prometheusMetrics += `power_watts ${metrics.power_watts}\n\n`;
    
    prometheusMetrics += `# HELP power_kwh Power consumption in kWh\n`;
    prometheusMetrics += `# TYPE power_kwh gauge\n`;
    prometheusMetrics += `power_kwh ${metrics.power_kwh}\n\n`;
    
    // Métriques d'Empreinte Carbone
    prometheusMetrics += `# HELP co2_emissions_kg CO2 emissions in kg CO2e\n`;
    prometheusMetrics += `# TYPE co2_emissions_kg gauge\n`;
    prometheusMetrics += `co2_emissions_kg ${metrics.co2_emissions_kg}\n\n`;
    
    prometheusMetrics += `# HELP electricity_factor Electricity emission factor\n`;
    prometheusMetrics += `# TYPE electricity_factor gauge\n`;
    prometheusMetrics += `electricity_factor ${metrics.electricity_factor}\n\n`;
    
    return prometheusMetrics;
}

module.exports = {
    getLocalMetrics,
    generatePrometheusMetrics
};
