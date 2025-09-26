const { 
  resetTasks, 
  getTasks, 
  addTask, 
  deleteTask, 
  getTaskById, 
  getTaskStats,
  completeTask,
  uncompleteTask,
  updateTask,
  searchTasks,
  sortTasks,
  exportTasks,
  importTasks,
  getCategories,
  clearCompletedTasks
} = require('./tasks');

describe('🧪 Tests Unitaires - Fonctions tasks.js', () => {
  beforeEach(() => {
    resetTasks();
  });

  describe('getTasks', () => {
    test('devrait retourner un tableau vide initialement', () => {
      const tasks = getTasks();
      expect(tasks).toEqual([]);
      expect(Array.isArray(tasks)).toBe(true);
    });

    test('devrait retourner une copie des tâches', () => {
      addTask('Test task');
      const tasks1 = getTasks();
      const tasks2 = getTasks();
      expect(tasks1).not.toBe(tasks2); // Différentes références
      expect(tasks1).toEqual(tasks2); // Même contenu
    });
  });

  describe('addTask', () => {
    test('devrait ajouter une tâche avec un ID auto-incrémenté', () => {
      const task1 = addTask('Première tâche');
      const task2 = addTask('Deuxième tâche');
      
      expect(task1.id).toBe(1);
      expect(task2.id).toBe(2);
      expect(task1.task).toBe('Première tâche');
      expect(task2.task).toBe('Deuxième tâche');
      expect(task1.completed).toBe(false);
      expect(task1.createdAt).toBeDefined();
    });

    test('devrait trimmer les espaces', () => {
      const task = addTask('  Tâche avec espaces  ');
      expect(task.task).toBe('Tâche avec espaces');
    });

    test('devrait lever une erreur pour des paramètres invalides', () => {
      expect(() => addTask('')).toThrow();
      expect(() => addTask(null)).toThrow();
      expect(() => addTask(undefined)).toThrow();
      expect(() => addTask(123)).toThrow();
    });
  });

  describe('deleteTask', () => {
    test('devrait supprimer une tâche existante', () => {
      addTask('Tâche à supprimer');
      const result = deleteTask(1);
      
      expect(result).toBe(true);
      expect(getTasks()).toHaveLength(0);
    });

    test('devrait retourner false pour une tâche inexistante', () => {
      const result = deleteTask(999);
      expect(result).toBe(false);
    });

    test('devrait lever une erreur pour des IDs invalides', () => {
      expect(() => deleteTask(0)).toThrow();
      expect(() => deleteTask(-1)).toThrow();
      expect(() => deleteTask('abc')).toThrow();
    });
  });

  describe('getTaskById', () => {
    test('devrait retourner une tâche existante', () => {
      addTask('Tâche test');
      const task = getTaskById(1);
      
      expect(task).toBeDefined();
      expect(task.id).toBe(1);
      expect(task.task).toBe('Tâche test');
    });

    test('devrait retourner null pour une tâche inexistante', () => {
      const task = getTaskById(999);
      expect(task).toBeNull();
    });
  });

  describe('getTaskStats', () => {
    test('devrait calculer les statistiques correctement', () => {
      addTask('Tâche 1');
      addTask('Tâche 2');
      addTask('Tâche 3');
      
      const stats = getTaskStats();
      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(0);
      expect(stats.pending).toBe(3);
      expect(stats.completionRate).toBe('0.00');
    });
  });

  describe('Priorités et catégories', () => {
    test('devrait créer une tâche avec priorité et catégorie', () => {
      const taskData = {
        task: 'Tâche importante',
        priority: 'high',
        category: 'Travail'
      };
      
      const task = addTask(taskData);
      
      expect(task.task).toBe('Tâche importante');
      expect(task.priority).toBe('high');
      expect(task.category).toBe('Travail');
      expect(task.completed).toBe(false);
    });

    test('devrait créer une tâche avec date d\'échéance', () => {
      const dueDate = '2024-12-31';
      const taskData = {
        task: 'Tâche avec échéance',
        dueDate: dueDate
      };
      
      const task = addTask(taskData);
      
      expect(task.dueDate).toBe(dueDate);
    });
  });

  describe('Marquage des tâches', () => {
    test('devrait marquer une tâche comme complétée', () => {
      const task = addTask('Tâche à compléter');
      const result = completeTask(task.id);
      
      expect(result).toBeDefined();
      expect(result.completed).toBe(true);
      
      const updatedTask = getTaskById(task.id);
      expect(updatedTask.completed).toBe(true);
      expect(updatedTask.completedAt).toBeDefined();
    });

    test('devrait marquer une tâche comme non complétée', () => {
      const task = addTask('Tâche à reprendre');
      completeTask(task.id);
      const result = uncompleteTask(task.id);
      
      expect(result).toBeDefined();
      expect(result.completed).toBe(false);
      
      const updatedTask = getTaskById(task.id);
      expect(updatedTask.completed).toBe(false);
      expect(updatedTask.completedAt).toBeUndefined();
    });
  });

  describe('Mise à jour des tâches', () => {
    test('devrait mettre à jour une tâche', () => {
      const task = addTask('Tâche originale');
      const updates = {
        task: 'Tâche modifiée',
        priority: 'high',
        category: 'Important'
      };
      
      const updatedTask = updateTask(task.id, updates);
      
      expect(updatedTask).toBeDefined();
      expect(updatedTask.task).toBe('Tâche modifiée');
      expect(updatedTask.priority).toBe('high');
      expect(updatedTask.category).toBe('Important');
      expect(updatedTask.updatedAt).toBeDefined();
    });
  });

  describe('Recherche et filtrage', () => {
    beforeEach(() => {
      addTask({ task: 'Tâche importante', priority: 'high', category: 'Travail' });
      addTask({ task: 'Tâche normale', priority: 'medium', category: 'Personnel' });
      addTask({ task: 'Tâche simple', priority: 'low' });
    });

    test('devrait filtrer par statut de complétion', () => {
      const task = getTasks()[0];
      completeTask(task.id);
      
      const completedTasks = searchTasks({ completed: true });
      const pendingTasks = searchTasks({ completed: false });
      
      expect(completedTasks).toHaveLength(1);
      expect(pendingTasks).toHaveLength(2);
    });

    test('devrait filtrer par priorité', () => {
      const highPriorityTasks = searchTasks({ priority: 'high' });
      const mediumPriorityTasks = searchTasks({ priority: 'medium' });
      
      expect(highPriorityTasks).toHaveLength(1);
      expect(mediumPriorityTasks).toHaveLength(1);
    });

    test('devrait filtrer par catégorie', () => {
      const workTasks = searchTasks({ category: 'Travail' });
      const personalTasks = searchTasks({ category: 'Personnel' });
      
      expect(workTasks).toHaveLength(1);
      expect(personalTasks).toHaveLength(1);
    });

    test('devrait rechercher par texte', () => {
      const importantTasks = searchTasks({ search: 'importante' });
      const normalTasks = searchTasks({ search: 'normale' });
      
      expect(importantTasks).toHaveLength(1);
      expect(normalTasks).toHaveLength(1);
    });
  });

  describe('Tri des tâches', () => {
    beforeEach(() => {
      addTask({ task: 'Tâche A', priority: 'low' });
      addTask({ task: 'Tâche B', priority: 'high' });
      addTask({ task: 'Tâche C', priority: 'medium' });
    });

    test('devrait trier par priorité', () => {
      const tasks = getTasks();
      const sortedByPriority = sortTasks(tasks, 'priority', 'desc');
      
      expect(sortedByPriority[0].priority).toBe('high');
      expect(sortedByPriority[1].priority).toBe('medium');
      expect(sortedByPriority[2].priority).toBe('low');
    });

    test('devrait trier par date de création', () => {
      const tasks = getTasks();
      const sortedByDate = sortTasks(tasks, 'createdAt', 'asc');
      
      // Vérifier que le tri fonctionne (même nombre de tâches)
      expect(sortedByDate).toHaveLength(3);
      expect(sortedByDate[0]).toBeDefined();
      expect(sortedByDate[1]).toBeDefined();
      expect(sortedByDate[2]).toBeDefined();
    });
  });

  describe('Statistiques avancées', () => {
    beforeEach(() => {
      addTask({ task: 'Tâche 1', priority: 'high', category: 'Travail' });
      addTask({ task: 'Tâche 2', priority: 'medium', category: 'Personnel' });
      addTask({ task: 'Tâche 3', priority: 'low' });
      completeTask(1);
    });

    test('devrait calculer les statistiques complètes', () => {
      const stats = getTaskStats();
      
      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.pending).toBe(2);
      expect(stats.priorityStats.high).toBe(1);
      expect(stats.priorityStats.medium).toBe(1);
      expect(stats.priorityStats.low).toBe(1);
      expect(stats.categoryStats.Travail).toBe(1);
      expect(stats.categoryStats.Personnel).toBe(1);
    });
  });

  describe('Export/Import', () => {
    test('devrait exporter les tâches en JSON', () => {
      addTask('Tâche 1');
      addTask('Tâche 2');
      
      const data = exportTasks();
      
      expect(data.tasks).toHaveLength(2);
      expect(data.exportedAt).toBeDefined();
      expect(data.version).toBe('1.0');
    });

    test('devrait importer des tâches depuis JSON', () => {
      const jsonData = JSON.stringify({
        tasks: [
          { task: 'Tâche importée 1', priority: 'high' },
          { task: 'Tâche importée 2', priority: 'low' }
        ]
      });
      
      const result = importTasks(jsonData, false);
      
      expect(result.success).toBe(true);
      expect(result.imported).toBe(2);
      expect(getTasks()).toHaveLength(2);
    });

    test('devrait fusionner les tâches lors de l\'import', () => {
      addTask('Tâche existante');
      
      const jsonData = JSON.stringify({
        tasks: [{ task: 'Tâche importée' }]
      });
      
      const result = importTasks(jsonData, true);
      
      expect(result.success).toBe(true);
      expect(result.imported).toBe(1);
      expect(getTasks()).toHaveLength(2);
    });
  });

  describe('Gestion des catégories', () => {
    test('devrait récupérer les catégories uniques', () => {
      addTask({ task: 'Tâche 1', category: 'Travail' });
      addTask({ task: 'Tâche 2', category: 'Personnel' });
      addTask({ task: 'Tâche 3', category: 'Travail' });
      
      const categories = getCategories();
      
      expect(categories).toHaveLength(2);
      expect(categories).toContain('Personnel');
      expect(categories).toContain('Travail');
    });
  });

  describe('Nettoyage des tâches', () => {
    test('devrait supprimer toutes les tâches complétées', () => {
      addTask('Tâche 1');
      addTask('Tâche 2');
      addTask('Tâche 3');
      
      completeTask(1);
      completeTask(2);
      
      const deletedCount = clearCompletedTasks();
      
      expect(deletedCount).toBe(2);
      expect(getTasks()).toHaveLength(1);
    });
  });
});
