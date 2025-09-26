// Stockage en mémoire des tâches
let tasks = [];
let nextId = 1;

/**
 * Récupère toutes les tâches
 * @returns {Array} Liste de toutes les tâches
 */
function getTasks() {
  return [...tasks]; // Retourne une copie pour éviter les mutations
}

/**
 * Ajoute une nouvelle tâche
 * @param {string|Object} taskData - Le texte de la tâche ou un objet avec les propriétés
 * @returns {Object} La tâche créée avec son ID
 */
function addTask(taskData) {
  let taskText, priority = 'medium', category = null, dueDate = null;

  if (typeof taskData === 'string') {
    taskText = taskData;
  } else if (typeof taskData === 'object' && taskData.task) {
    taskText = taskData.task;
    priority = taskData.priority || 'medium';
    category = taskData.category || null;
    dueDate = taskData.dueDate || null;
  } else {
    throw new Error('Le paramètre task doit être une chaîne ou un objet avec une propriété task');
  }

  if (!taskText || typeof taskText !== 'string' || taskText.trim() === '') {
    throw new Error('Le texte de la tâche doit être une chaîne non vide');
  }

  const newTask = {
    id: nextId++,
    task: taskText.trim(),
    completed: false,
    priority: priority,
    category: category,
    dueDate: dueDate,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  return newTask;
}

/**
 * Supprime une tâche par son ID
 * @param {number} id - L'ID de la tâche à supprimer
 * @returns {boolean} true si la tâche a été supprimée, false sinon
 */
function deleteTask(id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('L\'ID doit être un entier positif');
  }

  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return false;
  }

  tasks.splice(taskIndex, 1);
  return true;
}

/**
 * Marque une tâche comme complétée
 * @param {number} id - L'ID de la tâche
 * @returns {boolean} true si la tâche a été mise à jour, false sinon
 */
function completeTask(id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('L\'ID doit être un entier positif');
  }

  const task = tasks.find(task => task.id === id);
  
  if (!task) {
    return false;
  }

  task.completed = true;
  task.completedAt = new Date().toISOString();
  return task;
}

/**
 * Marque une tâche comme non complétée
 * @param {number} id - L'ID de la tâche
 * @returns {boolean} true si la tâche a été mise à jour, false sinon
 */
function uncompleteTask(id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('L\'ID doit être un entier positif');
  }

  const task = tasks.find(task => task.id === id);
  
  if (!task) {
    return false;
  }

  task.completed = false;
  delete task.completedAt;
  return task;
}

/**
 * Met à jour une tâche existante
 * @param {number} id - L'ID de la tâche
 * @param {Object} updates - Les mises à jour à appliquer
 * @returns {Object|null} La tâche mise à jour ou null
 */
function updateTask(id, updates) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('L\'ID doit être un entier positif');
  }

  const task = tasks.find(task => task.id === id);
  
  if (!task) {
    return null;
  }

  // Mise à jour des champs autorisés
  if (updates.task !== undefined) {
    task.task = updates.task.trim();
  }
  if (updates.priority !== undefined) {
    task.priority = updates.priority;
  }
  if (updates.category !== undefined) {
    task.category = updates.category.trim();
  }
  if (updates.dueDate !== undefined) {
    task.dueDate = updates.dueDate;
  }
  
  task.updatedAt = new Date().toISOString();
  return task;
}

/**
 * Recherche des tâches par critères
 * @param {Object} filters - Critères de recherche
 * @returns {Array} Liste des tâches correspondantes
 */
function searchTasks(filters = {}) {
  let results = [...tasks];

  // Filtre par statut de complétion
  if (filters.completed !== undefined) {
    results = results.filter(task => task.completed === filters.completed);
  }

  // Filtre par priorité
  if (filters.priority) {
    results = results.filter(task => task.priority === filters.priority);
  }

  // Filtre par catégorie
  if (filters.category) {
    results = results.filter(task => 
      task.category && task.category.toLowerCase().includes(filters.category.toLowerCase())
    );
  }

  // Recherche par texte
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    results = results.filter(task => 
      task.task.toLowerCase().includes(searchTerm)
    );
  }

  // Filtre par date d'échéance
  if (filters.dueDate) {
    const filterDate = new Date(filters.dueDate);
    results = results.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === filterDate.toDateString();
    });
  }

  return results;
}

/**
 * Trie les tâches selon un critère
 * @param {Array} taskList - Liste des tâches à trier
 * @param {string} sortBy - Critère de tri
 * @param {string} order - Ordre (asc/desc)
 * @returns {Array} Liste triée
 */
function sortTasks(taskList, sortBy = 'createdAt', order = 'desc') {
  return [...taskList].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Gestion des dates
    if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'completedAt' || sortBy === 'dueDate') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }

    // Gestion des priorités
    if (sortBy === 'priority') {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      aValue = priorityOrder[aValue] || 0;
      bValue = priorityOrder[bValue] || 0;
    }

    if (order === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
}

/**
 * Réinitialise le stockage des tâches (utile pour les tests)
 */
function resetTasks() {
  tasks = [];
  nextId = 1;
}

/**
 * Récupère une tâche par son ID
 * @param {number} id - L'ID de la tâche
 * @returns {Object|null} La tâche trouvée ou null
 */
function getTaskById(id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('L\'ID doit être un entier positif');
  }

  return tasks.find(task => task.id === id) || null;
}

/**
 * Récupère les statistiques des tâches
 * @returns {Object} Statistiques des tâches
 */
function getTaskStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;

  // Statistiques par priorité
  const priorityStats = {
    high: tasks.filter(task => task.priority === 'high').length,
    medium: tasks.filter(task => task.priority === 'medium').length,
    low: tasks.filter(task => task.priority === 'low').length
  };

  // Statistiques par catégorie
  const categoryStats = {};
  tasks.forEach(task => {
    if (task.category) {
      categoryStats[task.category] = (categoryStats[task.category] || 0) + 1;
    }
  });

  // Tâches en retard
  const overdue = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  }).length;

  return {
    total,
    completed,
    pending,
    overdue,
    completionRate: total > 0 ? (completed / total * 100).toFixed(2) : 0,
    priorityStats,
    categoryStats
  };
}

/**
 * Exporte toutes les tâches en JSON
 * @returns {string} JSON des tâches
 */
function exportTasks() {
  return {
    tasks: tasks,
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };
}

/**
 * Importe des tâches depuis un JSON
 * @param {string} jsonData - JSON des tâches à importer
 * @param {boolean} merge - Si true, fusionne avec les tâches existantes
 * @returns {Object} Résultat de l'import
 */
function importTasks(jsonData, merge = false) {
  try {
    const data = JSON.parse(jsonData);
    
    if (!data.tasks || !Array.isArray(data.tasks)) {
      throw new Error('Format JSON invalide');
    }

    let importedCount = 0;
    let skippedCount = 0;

    if (!merge) {
      tasks.length = 0; // Vider les tâches existantes
      nextId = 1; // Réinitialiser l'ID
    }

    data.tasks.forEach(taskData => {
      try {
        // Valider les données de la tâche
        if (!taskData.task || typeof taskData.task !== 'string') {
          skippedCount++;
          return;
        }

        const newTask = {
          id: merge ? nextId++ : taskData.id || nextId++,
          task: taskData.task.trim(),
          completed: taskData.completed || false,
          priority: taskData.priority || 'medium',
          category: taskData.category || null,
          dueDate: taskData.dueDate || null,
          createdAt: taskData.createdAt || new Date().toISOString(),
          completedAt: taskData.completedAt || null,
          updatedAt: taskData.updatedAt || null
        };

        tasks.push(newTask);
        importedCount++;
      } catch (error) {
        skippedCount++;
      }
    });

    return {
      success: true,
      imported: importedCount,
      skipped: skippedCount,
      total: data.tasks.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Récupère les catégories uniques
 * @returns {Array} Liste des catégories
 */
function getCategories() {
  const categories = [...new Set(tasks.map(task => task.category).filter(Boolean))];
  return categories.sort();
}

/**
 * Supprime toutes les tâches complétées
 * @returns {number} Nombre de tâches supprimées
 */
function clearCompletedTasks() {
  const initialLength = tasks.length;
  const filteredTasks = tasks.filter(task => !task.completed);
  const deletedCount = initialLength - filteredTasks.length;
  
  tasks.length = 0;
  tasks.push(...filteredTasks);
  
  return deletedCount;
}

module.exports = {
  getTasks,
  addTask,
  deleteTask,
  completeTask,
  uncompleteTask,
  updateTask,
  searchTasks,
  sortTasks,
  resetTasks,
  getTaskById,
  getTaskStats,
  exportTasks,
  importTasks,
  getCategories,
  clearCompletedTasks
};
