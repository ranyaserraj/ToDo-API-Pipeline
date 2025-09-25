// Configuration LOURDE pour Jest - Monitoring et métriques avancées

// Monitoring mémoire global
global.memoryUsage = [];

beforeEach(() => {
  const memBefore = process.memoryUsage();
  global.testStartMemory = memBefore;
  global.memoryUsage.push({
    test: expect.getState().currentTestName || 'unknown',
    phase: 'before',
    memory: memBefore,
    timestamp: Date.now()
  });
  
  console.log(`🧠 Mémoire avant test: ${(memBefore.heapUsed / 1024 / 1024).toFixed(2)} MB`);
});

afterEach(() => {
  const memAfter = process.memoryUsage();
  const memDiff = {
    rss: memAfter.rss - global.testStartMemory.rss,
    heapTotal: memAfter.heapTotal - global.testStartMemory.heapTotal,
    heapUsed: memAfter.heapUsed - global.testStartMemory.heapUsed,
    external: memAfter.external - global.testStartMemory.external
  };
  
  global.memoryUsage.push({
    test: expect.getState().currentTestName || 'unknown',
    phase: 'after',
    memory: memAfter,
    diff: memDiff,
    timestamp: Date.now()
  });
  
  console.log(`🧠 Mémoire après test: ${(memAfter.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📈 Différence heap: ${(memDiff.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  
  // Alerte si fuite mémoire détectée
  if (memDiff.heapUsed > 50 * 1024 * 1024) { // Plus de 50MB
    console.warn(`⚠️  FUITE MÉMOIRE DÉTECTÉE: ${(memDiff.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  }
  
  // Force garbage collection si disponible
  if (global.gc) {
    global.gc();
    console.log('🗑️  Garbage collection forcé');
  }
});

// Monitoring des performances
global.performanceMetrics = [];

// Hook pour mesurer les performances des requêtes
const originalRequest = require('supertest');
const request = (app) => {
  const agent = originalRequest(app);
  const originalGet = agent.get;
  const originalPost = agent.post;
  const originalPut = agent.put;
  const originalDelete = agent.delete;
  
  // Wrapper pour GET
  agent.get = function(url) {
    const start = Date.now();
    const req = originalGet.call(this, url);
    
    req.end = function(callback) {
      const duration = Date.now() - start;
      global.performanceMetrics.push({
        method: 'GET',
        url,
        duration,
        timestamp: Date.now()
      });
      
      if (duration > 1000) {
        console.warn(`⏱️  Requête lente GET ${url}: ${duration}ms`);
      }
      
      return req.end.call(this, callback);
    };
    
    return req;
  };
  
  // Wrapper pour POST
  agent.post = function(url) {
    const start = Date.now();
    const req = originalPost.call(this, url);
    
    req.end = function(callback) {
      const duration = Date.now() - start;
      global.performanceMetrics.push({
        method: 'POST',
        url,
        duration,
        timestamp: Date.now()
      });
      
      if (duration > 1000) {
        console.warn(`⏱️  Requête lente POST ${url}: ${duration}ms`);
      }
      
      return req.end.call(this, callback);
    };
    
    return req;
  };
  
  return agent;
};

// Remplacer supertest global
global.request = request;

// Monitoring des timeouts
const originalSetTimeout = global.setTimeout;
global.setTimeout = function(callback, delay, ...args) {
  if (delay > 10000) { // Plus de 10 secondes
    console.log(`⏰ Timeout long détecté: ${delay}ms`);
  }
  return originalSetTimeout(callback, delay, ...args);
};

// Monitoring des Promises
const originalPromise = global.Promise;
let promiseCount = 0;
let pendingPromises = new Set();

global.Promise = class extends originalPromise {
  constructor(executor) {
    promiseCount++;
    const promiseId = promiseCount;
    
    super((resolve, reject) => {
      pendingPromises.add(promiseId);
      
      const wrappedResolve = (value) => {
        pendingPromises.delete(promiseId);
        resolve(value);
      };
      
      const wrappedReject = (reason) => {
        pendingPromises.delete(promiseId);
        reject(reason);
      };
      
      executor(wrappedResolve, wrappedReject);
    });
  }
};

// Rapport final après tous les tests
afterAll(() => {
  console.log('\n📊 RAPPORT FINAL DES TESTS LOURDS');
  console.log('=' .repeat(50));
  
  // Statistiques mémoire
  if (global.memoryUsage.length > 0) {
    const maxHeap = Math.max(...global.memoryUsage.map(m => m.memory.heapUsed));
    const avgHeap = global.memoryUsage.reduce((sum, m) => sum + m.memory.heapUsed, 0) / global.memoryUsage.length;
    
    console.log(`🧠 Mémoire maximale utilisée: ${(maxHeap / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🧠 Mémoire moyenne: ${(avgHeap / 1024 / 1024).toFixed(2)} MB`);
  }
  
  // Statistiques performances
  if (global.performanceMetrics.length > 0) {
    const maxDuration = Math.max(...global.performanceMetrics.map(p => p.duration));
    const avgDuration = global.performanceMetrics.reduce((sum, p) => sum + p.duration, 0) / global.performanceMetrics.length;
    const slowRequests = global.performanceMetrics.filter(p => p.duration > 1000).length;
    
    console.log(`⏱️  Requête la plus lente: ${maxDuration}ms`);
    console.log(`⏱️  Temps de réponse moyen: ${avgDuration.toFixed(2)}ms`);
    console.log(`🐌 Requêtes lentes (>1s): ${slowRequests}/${global.performanceMetrics.length}`);
  }
  
  // Promises en attente
  if (pendingPromises.size > 0) {
    console.warn(`⚠️  Promises en attente: ${pendingPromises.size}`);
  }
  
  console.log('=' .repeat(50));
});

// Configuration de timeouts étendus pour tests lourds
jest.setTimeout(120000); // 2 minutes par test

// Désactiver les warnings pour les tests lourds
process.env.NODE_NO_WARNINGS = '1';

// Augmenter la limite de listeners
require('events').EventEmitter.defaultMaxListeners = 100;

console.log('🏋️  Configuration Jest LOURDE chargée');
