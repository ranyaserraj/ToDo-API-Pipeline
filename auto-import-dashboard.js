#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 IMPORT AUTOMATIQUE DU DASHBOARD GRAFANA');
console.log('==========================================');

// Lire le dashboard JSON
const dashboardPath = path.join(__dirname, 'grafana-dashboard-auto.json');
const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
const dashboard = JSON.parse(dashboardContent);

console.log('📊 Dashboard JSON chargé avec succès');
console.log(`   📋 Titre: ${dashboard.dashboard.title}`);
console.log(`   📊 Panels: ${dashboard.dashboard.panels.length}`);
console.log(`   🏷️  Tags: ${dashboard.dashboard.tags.join(', ')}`);

// Créer le fichier d'import pour Grafana
const importData = {
  dashboard: dashboard.dashboard,
  overwrite: true,
  inputs: [
    {
      name: "DS_PROMETHEUS",
      type: "datasource",
      pluginId: "prometheus",
      value: "prometheus-local"
    }
  ]
};

const importPath = path.join(__dirname, 'grafana-dashboard-import.json');
fs.writeFileSync(importPath, JSON.stringify(importData, null, 2));

console.log('✅ Fichier d\'import créé: grafana-dashboard-import.json');
console.log('');
console.log('📋 INSTRUCTIONS POUR IMPORT MANUEL:');
console.log('==================================');
console.log('1. Allez sur http://localhost:3001');
console.log('2. Connectez-vous (admin/admin123)');
console.log('3. Cliquez sur ➕ (Create) → Import');
console.log('4. Cliquez sur "Upload JSON file"');
console.log('5. Sélectionnez le fichier: grafana-dashboard-import.json');
console.log('6. Cliquez sur "Load"');
console.log('7. Sélectionnez "prometheus-local" comme source de données');
console.log('8. Cliquez sur "Import"');
console.log('');
console.log('🎯 VOTRE DASHBOARD CONTIENT:');
console.log('   🖥️  CPU Cores et Usage %');
console.log('   💾 Mémoire utilisée (MB et %)');
console.log('   ⚡ Consommation électrique (Watts et kWh)');
console.log('   🌍 Émissions CO2 (kg CO2e)');
console.log('   📊 Facteur d\'électricité');
console.log('   📈 Graphiques temporels');
console.log('');
console.log('✅ Dashboard prêt pour l\'import !');
