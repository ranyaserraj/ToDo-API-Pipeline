#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 IMPORT AUTOMATIQUE DU DASHBOARD PROMETHEUS DYNAMIQUE');
console.log('======================================================');

// Lire le dashboard JSON
const dashboardPath = path.join(__dirname, 'prometheus-dashboard-import.json');
const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
const dashboard = JSON.parse(dashboardContent);

console.log('📊 Dashboard Prometheus chargé avec succès');
console.log(`   📋 Titre: ${dashboard.dashboard.title}`);
console.log(`   📊 Panels: ${dashboard.dashboard.panels.length}`);
console.log(`   🏷️  Tags: ${dashboard.dashboard.tags.join(', ')}`);
console.log(`   🔄 Refresh: ${dashboard.dashboard.refresh}`);

console.log('\n🎯 DASHBOARD DYNAMIQUE CONTIENT:');
console.log('================================');
console.log('   🖥️  CPU Cores et Usage % (temps réel)');
console.log('   💾 Mémoire utilisée (MB et %) (temps réel)');
console.log('   ⚡ Consommation électrique (Watts et kWh) (temps réel)');
console.log('   🌍 Émissions CO2 (kg CO2e) (temps réel)');
console.log('   📊 Facteur d\'électricité (temps réel)');
console.log('   📈 Graphiques temporels (mise à jour automatique)');
console.log('   🔄 Rafraîchissement automatique toutes les 5 secondes');

console.log('\n📋 INSTRUCTIONS POUR IMPORT DYNAMIQUE:');
console.log('=====================================');
console.log('1. Allez sur http://localhost:3001');
console.log('2. Connectez-vous (admin/admin123)');
console.log('3. Cliquez sur ➕ (Create) → Import');
console.log('4. Cliquez sur "Upload JSON file"');
console.log('5. Sélectionnez le fichier: prometheus-dashboard-import.json');
console.log('6. Cliquez sur "Load"');
console.log('7. Sélectionnez "prometheus-local" comme source de données');
console.log('8. Cliquez sur "Import"');
console.log('');
console.log('✅ DASHBOARD DYNAMIQUE PRÊT !');
console.log('   📊 Les métriques se mettront à jour automatiquement');
console.log('   🔄 Prometheus collecte les données en temps réel');
console.log('   📈 Les graphiques évoluent automatiquement');
console.log('   ⚡ Calcul d\'empreinte carbone en temps réel');
