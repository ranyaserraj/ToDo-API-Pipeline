const express = require('express');
const { 
  getTasks, 
  addTask, 
  deleteTask, 
  completeTask, 
  uncompleteTask, 
  updateTask, 
  searchTasks, 
  sortTasks, 
  getTaskStats, 
  exportTasks, 
  importTasks, 
  getCategories, 
  clearCompletedTasks 
} = require('./tasks');
const { generatePrometheusMetrics } = require('./carbon-metrics');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static('public'));

// Route pour récupérer toutes les tâches
app.get('/tasks', (req, res) => {
  try {
    const tasks = getTasks();
    res.json({
      success: true,
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des tâches'
    });
  }
});

// Route pour ajouter une nouvelle tâche
app.post('/tasks', (req, res) => {
  try {
    const { task } = req.body;
    
    if (!task || typeof task !== 'string' || task.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Le champ "task" est requis et doit être une chaîne non vide'
      });
    }

    const newTask = addTask(task.trim());
    res.status(201).json({
      success: true,
      data: newTask,
      message: 'Tâche ajoutée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'ajout de la tâche'
    });
  }
});

// Route pour supprimer une tâche
app.delete('/tasks/:id', (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    
    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        error: 'L\'ID doit être un nombre valide'
      });
    }

    const deleted = deleteTask(taskId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Tâche non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Tâche supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression de la tâche'
    });
  }
});

// Route pour marquer une tâche comme complétée
app.patch('/tasks/:id/complete', (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    
    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        error: 'L\'ID doit être un nombre valide'
      });
    }

    const completed = completeTask(taskId);
    
    if (!completed) {
      return res.status(404).json({
        success: false,
        error: 'Tâche non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Tâche marquée comme complétée'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour de la tâche'
    });
  }
});

// Route pour marquer une tâche comme non complétée
app.patch('/tasks/:id/uncomplete', (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    
    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        error: 'L\'ID doit être un nombre valide'
      });
    }

    const uncompleted = uncompleteTask(taskId);
    
    if (!uncompleted) {
      return res.status(404).json({
        success: false,
        error: 'Tâche non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Tâche marquée comme non complétée'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour de la tâche'
    });
  }
});

// Route pour mettre à jour une tâche
app.put('/tasks/:id', (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    
    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        error: 'L\'ID doit être un nombre valide'
      });
    }

    const updatedTask = updateTask(taskId, req.body);
    
    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        error: 'Tâche non trouvée'
      });
    }

    res.json({
      success: true,
      data: updatedTask,
      message: 'Tâche mise à jour avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour de la tâche'
    });
  }
});

// Route pour rechercher et filtrer les tâches
app.get('/tasks/search', (req, res) => {
  try {
    const filters = {
      completed: req.query.completed !== undefined ? req.query.completed === 'true' : undefined,
      priority: req.query.priority,
      category: req.query.category,
      search: req.query.search,
      dueDate: req.query.dueDate
    };

    const results = searchTasks(filters);
    
    // Tri optionnel
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order || 'desc';
    const sortedResults = sortTasks(results, sortBy, order);

    res.json({
      success: true,
      data: sortedResults,
      count: sortedResults.length,
      filters: filters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la recherche des tâches'
    });
  }
});

// Route pour obtenir les statistiques
app.get('/stats', (req, res) => {
  try {
    const stats = getTaskStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques'
    });
  }
});

// Route pour obtenir les catégories
app.get('/categories', (req, res) => {
  try {
    const categories = getCategories();
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des catégories'
    });
  }
});

// Route pour exporter les tâches
app.get('/export', (req, res) => {
  try {
    const jsonData = exportTasks();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="tasks-export.json"');
    res.send(jsonData);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'export des tâches'
    });
  }
});

// Route pour importer les tâches
app.post('/import', (req, res) => {
  try {
    const { jsonData, merge = false } = req.body;
    
    if (!jsonData) {
      return res.status(400).json({
        success: false,
        error: 'Données JSON requises'
      });
    }

    const result = importTasks(jsonData, merge);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'Tâches importées avec succès',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'import des tâches'
    });
  }
});

// Route pour supprimer toutes les tâches complétées
app.delete('/tasks/completed', (req, res) => {
  try {
    const deletedCount = clearCompletedTasks();
    res.json({
      success: true,
      message: `${deletedCount} tâche(s) complétée(s) supprimée(s)`,
      deletedCount: deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression des tâches complétées'
    });
  }
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API ToDo est opérationnelle',
    timestamp: new Date().toISOString()
  });
});

// Route pour les métriques Prometheus
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(generatePrometheusMetrics());
});

// Route pour les métriques d'empreinte carbone
app.get('/carbon-metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(generatePrometheusMetrics());
});

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée'
  });
});

// Gestion globale des erreurs
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({
    success: false,
    error: 'Erreur interne du serveur'
  });
});

// Démarrage du serveur (seulement si ce n'est pas un test)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur ToDo API démarré sur le port ${PORT}`);
    console.log(`🌐 Interface web: http://localhost:${PORT}/index.html`);
    console.log(`📋 Endpoints disponibles:`);
    console.log(`   GET    /tasks              - Récupérer toutes les tâches`);
    console.log(`   POST   /tasks              - Ajouter une tâche`);
    console.log(`   PUT    /tasks/:id          - Mettre à jour une tâche`);
    console.log(`   DELETE /tasks/:id          - Supprimer une tâche`);
    console.log(`   PATCH  /tasks/:id/complete - Marquer comme complétée`);
    console.log(`   PATCH  /tasks/:id/uncomplete - Marquer comme non complétée`);
    console.log(`   GET    /tasks/search       - Rechercher et filtrer`);
    console.log(`   GET    /stats              - Statistiques`);
    console.log(`   GET    /categories         - Liste des catégories`);
    console.log(`   GET    /export             - Exporter les tâches`);
    console.log(`   POST   /import             - Importer des tâches`);
    console.log(`   DELETE /tasks/completed    - Supprimer les tâches complétées`);
    console.log(`   GET    /health             - Vérifier l'état de l'API`);
  });
}

module.exports = app;
