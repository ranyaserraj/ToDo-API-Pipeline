const request = require('supertest');
const app = require('./server');
const { resetTasks } = require('./tasks');

describe('🌐 Tests d\'intégration - API REST', () => {
  beforeEach(() => {
    resetTasks();
  });

  describe('GET /tasks', () => {
    test('devrait retourner un tableau vide initialement', async () => {
      const response = await request(app)
        .get('/tasks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    test('devrait retourner toutes les tâches', async () => {
      // Ajouter des tâches via l'API
      await request(app)
        .post('/tasks')
        .send({ task: 'Tâche 1' })
        .expect(201);

      await request(app)
        .post('/tasks')
        .send({ task: 'Tâche 2' })
        .expect(201);

      const response = await request(app)
        .get('/tasks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });
  });

  describe('POST /tasks', () => {
    test('devrait créer une nouvelle tâche', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ task: 'Nouvelle tâche' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.task).toBe('Nouvelle tâche');
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.completed).toBe(false);
      expect(response.body.message).toBe('Tâche ajoutée avec succès');
    });

    test('devrait trimmer les espaces', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ task: '  Tâche avec espaces  ' })
        .expect(201);

      expect(response.body.data.task).toBe('Tâche avec espaces');
    });

    test('devrait retourner une erreur 400 pour des données invalides', async () => {
      const testCases = [
        { task: '' },
        { task: null },
        {},
        { task: 123 },
        { task: '   ' }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/tasks')
          .send(testCase)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('requis');
      }
    });
  });

  describe('DELETE /tasks/:id', () => {
    test('devrait supprimer une tâche existante', async () => {
      // Créer une tâche
      const createResponse = await request(app)
        .post('/tasks')
        .send({ task: 'Tâche à supprimer' })
        .expect(201);

      const taskId = createResponse.body.data.id;

      // Supprimer la tâche
      const deleteResponse = await request(app)
        .delete(`/tasks/${taskId}`)
        .expect(200);

      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.message).toBe('Tâche supprimée avec succès');

      // Vérifier que la tâche n'existe plus
      const getResponse = await request(app)
        .get('/tasks')
        .expect(200);

      expect(getResponse.body.data).toHaveLength(0);
    });

    test('devrait retourner 404 pour une tâche inexistante', async () => {
      const response = await request(app)
        .delete('/tasks/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Tâche non trouvée');
    });

    test('devrait retourner 400 pour un ID invalide', async () => {
      const response = await request(app)
        .delete('/tasks/abc')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('nombre valide');
    });
  });

  describe('PATCH /tasks/:id/complete', () => {
    test('devrait marquer une tâche comme complétée', async () => {
      // Créer une tâche
      const createResponse = await request(app)
        .post('/tasks')
        .send({ task: 'Tâche à compléter' })
        .expect(201);

      const taskId = createResponse.body.data.id;

      // Marquer comme complétée
      const completeResponse = await request(app)
        .patch(`/tasks/${taskId}/complete`)
        .expect(200);

      expect(completeResponse.body.success).toBe(true);
      expect(completeResponse.body.data.completed).toBe(true);
      expect(completeResponse.body.data.completedAt).toBeDefined();
    });

    test('devrait retourner 404 pour une tâche inexistante', async () => {
      const response = await request(app)
        .patch('/tasks/999/complete')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Tâche non trouvée');
    });
  });

  describe('PATCH /tasks/:id/uncomplete', () => {
    test('devrait marquer une tâche comme non complétée', async () => {
      // Créer et compléter une tâche
      const createResponse = await request(app)
        .post('/tasks')
        .send({ task: 'Tâche à reprendre' })
        .expect(201);

      const taskId = createResponse.body.data.id;

      await request(app)
        .patch(`/tasks/${taskId}/complete`)
        .expect(200);

      // Marquer comme non complétée
      const uncompleteResponse = await request(app)
        .patch(`/tasks/${taskId}/uncomplete`)
        .expect(200);

      expect(uncompleteResponse.body.success).toBe(true);
      expect(uncompleteResponse.body.data.completed).toBe(false);
      expect(uncompleteResponse.body.data.completedAt).toBeUndefined();
    });
  });

  describe('PUT /tasks/:id', () => {
    test('devrait mettre à jour une tâche', async () => {
      // Créer une tâche
      const createResponse = await request(app)
        .post('/tasks')
        .send({ task: 'Tâche originale' })
        .expect(201);

      const taskId = createResponse.body.data.id;

      // Mettre à jour la tâche
      const updateResponse = await request(app)
        .put(`/tasks/${taskId}`)
        .send({
          task: 'Tâche modifiée',
          priority: 'high',
          category: 'Important'
        })
        .expect(200);

      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.data.task).toBe('Tâche modifiée');
      expect(updateResponse.body.data.priority).toBe('high');
      expect(updateResponse.body.data.category).toBe('Important');
      expect(updateResponse.body.data.updatedAt).toBeDefined();
    });
  });

  describe('GET /tasks/search', () => {
    beforeEach(async () => {
      // Créer des tâches de test
      await request(app)
        .post('/tasks')
        .send({ task: 'Tâche importante', priority: 'high', category: 'Travail' });

      await request(app)
        .post('/tasks')
        .send({ task: 'Tâche normale', priority: 'medium', category: 'Personnel' });

      await request(app)
        .post('/tasks')
        .send({ task: 'Tâche simple', priority: 'low' });
    });

    test('devrait rechercher par texte', async () => {
      const response = await request(app)
        .get('/tasks/search')
        .query({ search: 'importante' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].task).toBe('Tâche importante');
    });

    test('devrait filtrer par priorité', async () => {
      // Créer une tâche avec priorité high
      await request(app)
        .post('/tasks')
        .send({ task: 'Tâche prioritaire', priority: 'high' });

      const response = await request(app)
        .get('/tasks/search')
        .query({ priority: 'high' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].priority).toBe('high');
    });

    test('devrait filtrer par catégorie', async () => {
      // Créer une tâche avec catégorie Travail
      await request(app)
        .post('/tasks')
        .send({ task: 'Tâche de travail', category: 'Travail' });

      const response = await request(app)
        .get('/tasks/search')
        .query({ category: 'Travail' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].category).toBe('Travail');
    });

    test('devrait filtrer par statut de complétion', async () => {
      // Compléter une tâche
      await request(app)
        .patch('/tasks/1/complete')
        .expect(200);

      const response = await request(app)
        .get('/tasks/search')
        .query({ completed: true })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].completed).toBe(true);
    });
  });

  describe('GET /stats', () => {
    test('devrait retourner les statistiques', async () => {
      // Créer quelques tâches
      await request(app)
        .post('/tasks')
        .send({ task: 'Tâche 1', priority: 'high', category: 'Travail' });

      await request(app)
        .post('/tasks')
        .send({ task: 'Tâche 2', priority: 'medium', category: 'Personnel' });

      await request(app)
        .post('/tasks')
        .send({ task: 'Tâche 3', priority: 'low' });

      // Compléter une tâche
      await request(app)
        .patch('/tasks/1/complete')
        .expect(200);

      const response = await request(app)
        .get('/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBe(3);
      expect(response.body.data.completed).toBe(1);
      expect(response.body.data.pending).toBe(2);
      expect(response.body.data.priorityStats).toBeDefined();
      expect(response.body.data.categoryStats).toBeDefined();
    });
  });

  describe('GET /categories', () => {
    test('devrait retourner les catégories', async () => {
      // Créer des tâches avec différentes catégories
      await request(app)
        .post('/tasks')
        .send({ task: 'Tâche 1', category: 'Travail' });

      await request(app)
        .post('/tasks')
        .send({ task: 'Tâche 2', category: 'Personnel' });

      await request(app)
        .post('/tasks')
        .send({ task: 'Tâche 3', category: 'Travail' });

      const response = await request(app)
        .get('/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data).toContain('Travail');
      expect(response.body.data).toContain('Personnel');
    });
  });

  describe('GET /export', () => {
    test('devrait exporter les tâches', async () => {
      // Créer quelques tâches
      await request(app)
        .post('/tasks')
        .send({ task: 'Tâche 1' });

      await request(app)
        .post('/tasks')
        .send({ task: 'Tâche 2' });

      const response = await request(app)
        .get('/export')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks).toHaveLength(2);
      expect(response.body.data.exportedAt).toBeDefined();
      expect(response.body.data.version).toBe('1.0');
    });
  });

  describe('POST /import', () => {
    test('devrait importer des tâches', async () => {
      const importData = {
        tasks: [
          { task: 'Tâche importée 1', priority: 'high' },
          { task: 'Tâche importée 2', priority: 'low' }
        ]
      };

      const response = await request(app)
        .post('/import')
        .send({ jsonData: importData })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.imported).toBe(2);

      // Vérifier que les tâches ont été importées
      const getResponse = await request(app)
        .get('/tasks')
        .expect(200);

      expect(getResponse.body.data).toHaveLength(2);
    });
  });

  describe('DELETE /tasks/completed', () => {
    test('devrait supprimer toutes les tâches complétées', async () => {
      // Créer des tâches
      await request(app)
        .post('/tasks')
        .send({ task: 'Tâche 1' });

      await request(app)
        .post('/tasks')
        .send({ task: 'Tâche 2' });

      await request(app)
        .post('/tasks')
        .send({ task: 'Tâche 3' });

      // Compléter deux tâches
      await request(app)
        .patch('/tasks/1/complete')
        .expect(200);

      await request(app)
        .patch('/tasks/2/complete')
        .expect(200);

      // Supprimer les tâches complétées
      const response = await request(app)
        .delete('/tasks/completed')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.deleted).toBe(2);

      // Vérifier qu'il ne reste qu'une tâche
      const getResponse = await request(app)
        .get('/tasks')
        .expect(200);

      expect(getResponse.body.data).toHaveLength(1);
    });
  });

  describe('GET /health', () => {
    test('devrait retourner le statut de santé', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('API ToDo est opérationnelle');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('Gestion des erreurs', () => {
    test('devrait retourner 404 pour une route inexistante', async () => {
      const response = await request(app)
        .get('/inexistante')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Route non trouvée');
    });
  });
});
