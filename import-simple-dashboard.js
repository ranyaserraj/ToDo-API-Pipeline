#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📊 IMPORT DASHBOARD SIMPLIFIÉ');
console.log('============================');

// Lire le dashboard simple
const dashboardPath = path.join(__dirname, 'simple-dashboard.json');
const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
const dashboard = JSON.parse(dashboardContent);

console.log('✅ Dashboard simple créé');
console.log(`   📋 Titre: ${dashboard.dashboard.title}`);
console.log(`   📊 Panels: ${dashboard.dashboard.panels.length}`);
console.log(`   🔄 Refresh: ${dashboard.dashboard.refresh}`);

console.log('\n📋 INSTRUCTIONS D\'IMPORT:');
console.log('=========================');
console.log('1. Allez sur http://localhost:3001');
console.log('2. Cliquez sur "New" → "Import"');
console.log('3. Cliquez sur "Upload JSON file"');
console.log('4. Sélectionnez: simple-dashboard.json');
console.log('5. Cliquez sur "Load"');
console.log('6. Sélectionnez "prometheus-local" comme source de données');
console.log('7. Cliquez sur "Import"');
console.log('');
console.log('🎯 DASHBOARD CONTIENT:');
console.log('   🖥️  CPU Usage %');
console.log('   💾 Memory Usage %');
console.log('   ⚡ Power Consumption (Watts)');
console.log('   🌍 CO2 Emissions (kg CO2e)');
console.log('   📈 CPU Usage Over Time (graphique)');
console.log('');
console.log('✅ Dashboard simplifié prêt pour l\'import !');
