const request = require('supertest');
const app = require('./server');
const { resetTasks } = require('./tasks');

describe('🔥 Tests de performance LOURDS', () => {
  beforeEach(() => {
    resetTasks();
  });

  test('devrait gérer un grand nombre de tâches (1000)', async () => {
    console.log('🔥 DÉBUT TEST LOURD : 1000 tâches...');
    const startTime = Date.now();
    const numTasks = 1000;
    
    // Créer 1000 tâches avec données variées
    for (let i = 0; i < numTasks; i++) {
      await request(app)
        .post('/tasks')
        .send({ 
          task: `Tâche lourde ${i}`,
          priority: i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low',
          category: `Catégorie ${i % 10}`,
          dueDate: new Date(Date.now() + i * 86400000).toISOString().split('T')[0]
        })
        .expect(201);
    }

    // Vérifier que toutes les tâches sont présentes
    const response = await request(app)
      .get('/tasks')
      .expect(200);

    expect(response.body.data).toHaveLength(numTasks);
    expect(response.body.count).toBe(numTasks);
    
    const endTime = Date.now();
    console.log(`⏱️  Temps d'exécution: ${endTime - startTime}ms`);
  }, 60000);

  test('devrait effectuer des opérations CRUD massives', async () => {
    console.log('💥 DÉBUT TEST LOURD : CRUD massif...');
    const startTime = Date.now();
    
    // Créer 500 tâches
    const createPromises = [];
    for (let i = 0; i < 500; i++) {
      createPromises.push(
        request(app)
          .post('/tasks')
          .send({ task: `CRUD Test ${i}` })
      );
    }
    await Promise.all(createPromises);
    
    // Lire toutes les tâches 50 fois
    const readPromises = [];
    for (let i = 0; i < 50; i++) {
      readPromises.push(request(app).get('/tasks'));
    }
    await Promise.all(readPromises);
    
    // Mettre à jour 200 tâches
    const updatePromises = [];
    for (let i = 1; i <= 200; i++) {
      updatePromises.push(
        request(app)
          .put(`/tasks/${i}`)
          .send({ 
            task: `Tâche mise à jour ${i}`,
            priority: 'high'
          })
      );
    }
    await Promise.all(updatePromises);
    
    // Supprimer 100 tâches
    const deletePromises = [];
    for (let i = 201; i <= 300; i++) {
      deletePromises.push(request(app).delete(`/tasks/${i}`));
    }
    await Promise.all(deletePromises);
    
    const endTime = Date.now();
    console.log(`⏱️  Temps CRUD total: ${endTime - startTime}ms`);
  }, 45000);

  test('devrait gérer des requêtes simultanées', async () => {
    console.log('🌐 DÉBUT TEST LOURD : 200 requêtes simultanées...');
    const startTime = Date.now();
    
    // 200 requêtes GET simultanées
    const promises = [];
    for (let i = 0; i < 200; i++) {
      promises.push(request(app).get('/health'));
    }
    
    const results = await Promise.all(promises);
    
    const endTime = Date.now();
    console.log(`⏱️  Temps réseau: ${endTime - startTime}ms`);
    
    // Vérifier que toutes les requêtes ont réussi
    results.forEach(result => {
      expect(result.status).toBe(200);
    });
  }, 30000);

  test('devrait gérer des objets volumineux', async () => {
    console.log('📦 DÉBUT TEST LOURD : Payloads volumineux...');
    
    // Créer un payload volumineux
    const largePayload = {
      task: 'Tâche avec données volumineuses',
      description: 'A'.repeat(10000), // 10KB de texte
      metadata: {
        largeArray: new Array(1000).fill().map((_, i) => ({
          id: i,
          value: `Item ${i}`,
          data: 'B'.repeat(100)
        })),
        largeString: 'C'.repeat(50000)
      }
    };
    
    const response = await request(app)
      .post('/tasks')
      .send(largePayload);
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  }, 15000);

  test('devrait survivre à un stress test complet', async () => {
    console.log('💀 DÉBUT TEST LOURD : Stress test complet...');
    
    const operations = [];
    const startTime = Date.now();
    
    // Mix de toutes les opérations en parallèle
    for (let i = 0; i < 50; i++) {
      // Créations
      operations.push(
        request(app)
          .post('/tasks')
          .send({ task: `Stress ${i}` })
      );
      
      // Lectures
      operations.push(request(app).get('/tasks'));
      
      // Recherches
      operations.push(
        request(app)
          .get('/tasks/search')
          .query({ search: `stress ${i % 10}` })
      );
      
      // Statistiques
      operations.push(request(app).get('/stats'));
      
      // Health checks
      operations.push(request(app).get('/health'));
    }
    
    const results = await Promise.all(operations);
    
    const endTime = Date.now();
    console.log(`💀 Stress test terminé en: ${endTime - startTime}ms`);
    console.log(`💀 Opérations réussies: ${results.filter(r => r.status < 400).length}/${results.length}`);
    
    // Au moins 90% des opérations doivent réussir
    const successRate = results.filter(r => r.status < 400).length / results.length;
    expect(successRate).toBeGreaterThan(0.9);
  }, 60000);

  test('devrait gérer des recherches complexes', async () => {
    console.log('🔍 DÉBUT TEST LOURD : 500 recherches complexes...');
    
    // Créer 200 tâches avec données variées
    for (let i = 0; i < 200; i++) {
      await request(app)
        .post('/tasks')
        .send({
          task: `Recherche test ${i} avec mots-clés spéciaux ${Math.random()}`,
          priority: ['high', 'medium', 'low'][i % 3],
          category: ['Travail', 'Personnel', 'Urgent', 'Important'][i % 4]
        });
    }
    
    const startTime = Date.now();
    
    // Effectuer 500 recherches différentes
    const searchPromises = [];
    for (let i = 0; i < 500; i++) {
      searchPromises.push(
        request(app)
          .get('/tasks/search')
          .query({
            search: `test ${i % 50}`,
            priority: ['high', 'medium', 'low'][i % 3],
            category: ['Travail', 'Personnel'][i % 2]
          })
      );
    }
    
    const results = await Promise.all(searchPromises);
    expect(results.length).toBe(500);
    
    const endTime = Date.now();
    console.log(`⏱️  Temps de recherche: ${endTime - startTime}ms`);
  }, 30000);

  test('devrait gérer des opérations de tri massives', async () => {
    console.log('📊 DÉBUT TEST LOURD : Tri massif...');
    
    // Créer 300 tâches avec priorités variées
    for (let i = 0; i < 300; i++) {
      await request(app)
        .post('/tasks')
        .send({
          task: `Tâche tri ${i}`,
          priority: ['high', 'medium', 'low'][i % 3],
          category: `Catégorie ${i % 20}`
        });
    }
    
    const startTime = Date.now();
    
    // Effectuer 100 tris différents
    const sortPromises = [];
    for (let i = 0; i < 100; i++) {
      sortPromises.push(
        request(app)
          .get('/tasks')
          .query({
            sortBy: ['priority', 'createdAt', 'category'][i % 3],
            order: ['asc', 'desc'][i % 2]
          })
      );
    }
    
    const results = await Promise.all(sortPromises);
    expect(results.length).toBe(100);
    
    const endTime = Date.now();
    console.log(`⏱️  Temps de tri: ${endTime - startTime}ms`);
  }, 25000);

  test('devrait gérer des statistiques en temps réel', async () => {
    console.log('📈 DÉBUT TEST LOURD : Statistiques en temps réel...');
    
    // Créer 400 tâches
    for (let i = 0; i < 400; i++) {
      await request(app)
        .post('/tasks')
        .send({
          task: `Stat ${i}`,
          priority: ['high', 'medium', 'low'][i % 3],
          category: `Catégorie ${i % 15}`
        });
    }
    
    // Compléter 100 tâches
    for (let i = 1; i <= 100; i++) {
      await request(app)
        .patch(`/tasks/${i}/complete`);
    }
    
    const startTime = Date.now();
    
    // Effectuer 200 requêtes de statistiques
    const statsPromises = [];
    for (let i = 0; i < 200; i++) {
      statsPromises.push(request(app).get('/stats'));
    }
    
    const results = await Promise.all(statsPromises);
    expect(results.length).toBe(200);
    
    // Vérifier que les statistiques sont cohérentes
    const stats = results[0].body.data;
    expect(stats.total).toBe(400);
    expect(stats.completed).toBe(100);
    expect(stats.pending).toBe(300);
    
    const endTime = Date.now();
    console.log(`⏱️  Temps de statistiques: ${endTime - startTime}ms`);
  }, 20000);
});
