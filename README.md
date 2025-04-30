# trading-simulator

It's trading simulator build with agent ai

# A savoir (deplacer plus tard dans un repo infos):

```bash
pyenv versions                  # Voir toutes les versions installé
pyenv install --list            # Voir toutes les versions disponibles
pyenv install 3.10.12           # Installer une version
pyenv local 3.10.12             # Utiliser cette version dans le projet
python -m venv .venv            # Créer l’environnement virtuel
source .venv/bin/activate       # Activer (Linux/macOS)
.venv\Scripts\activate          # Activer (Windows)
deactivate                      # Désactiver
rm -r .venv                     # Supprime le dossier .venv
rmdir /s /q .venv               # Supprime le dossier .venv
pip freeze > requirements.txt   # Génére le fichier requirements.txt
```



role: "Technical Task Structuring Specialist for Web Development Projects"
goal: "Produce a detailed, well-structured TASKS.md file to guide and monitor the development of a crypto trading simulation application built with React, based on a provided functional specification"
backstory: >
  You are a seasoned expert in agile project management and Web Development task decomposition with 10 years experience. Over the past decade, you’ve collaborated with numerous product and engineering teams to translate complex functional requirements into actionable, granular development tasks. You prioritize clarity, maintainability, and traceability in everything you produce. Your documentation is known for its precision, technical completeness, and alignment with modern best practices in collaborative software development.


Task Design

description: >
  À partir d’un fichier nommé SPECIFICATION.md décrivant une application web (React + Vite + TypeScript + TailwindCSS) de simulation de stratégies de trading crypto avec effet de levier, générez un fichier Markdown nommé TASKS.md. Ce document doit :
  - Décomposer le projet en tâches atomiques
  - Structurer le document en sections : Jalons, Tâches à réaliser, Backlog, Éléments découverts, Instructions pour le suivi
  - Formater chaque tâche avec :
    - Une coche vide `[]` (non terminée)
    - Une description claire

expected_output: >
  Un fichier nommé `TASKS.md` contenant :
  - Une section **Jalons** avec les étapes clés du projet
  - Une section **Tâches à réaliser** avec une liste de tâches formatées :
    - Exemple : `[] Implémenter la logique de validation du formulaire - senior dev`
                `[] Implémenter le composant button - frontend dev`

description: >
  À partir d’un fichier nommé SPECIFICATION.md décrivant une application web (React + Vite + TypeScript + TailwindCSS) de simulation de stratégies de trading crypto avec effet de levier, générez un fichier Markdown nommé TASKS.md. Ce document doit :
  - Structurer le projet en **phases** logiques (ex. : Initial Setup, UI Implementation, Trading Logic)
  - Décomposer chaque phase en sous-sections numérotées avec des titres descriptifs (ex. : "Task 1.1: Project Setup")
  - Lister les tâches sous forme de cases à cocher `[ ]`, avec une formulation actionnable, claire, et concise
  - S’assurer que chaque tâche soit suffisamment atomique pour être suivie individuellement

expected_output: >
  Un fichier `TASKS.md` structuré comme suit :
  - Des **phases** numérotées (`Phase 1`, `Phase 2`, etc.), avec un titre clair
  - Des **sous-tâches** identifiées par un titre de type `Task X.Y: Nom de la tâche`
  - Une **liste de tâches** par sous-tâche, chacune précédée d’une case à cocher `[ ]`
  - Exemple de format :
      ### Phase 1: Initial Setup

      #### Task 1.1: Project Initialization
      - [ ] Create project repository
      - [ ] Set up Vite + React project with TypeScript
      - [ ] Configure TailwindCSS


task:
  name: "Generate Project Tasks"
  description: >
    À partir d'un fichier nommé SPECIFICATION.md décrivant une application web 
    (React + Vite + TypeScript + TailwindCSS) de simulation de stratégies de trading 
    crypto avec effet de levier, générez un fichier Markdown nommé TASKS.md. Ce document doit :
    
    - Structurer le projet en **phases** logiques (ex. : Initial Setup, UI Implementation, Trading Logic)
    - Décomposer chaque phase en sous-sections numérotées avec des titres descriptifs
    - Lister les tâches sous forme de cases à cocher `[ ]`, avec une formulation actionnable
    - S'assurer que chaque tâche soit suffisamment atomique pour être suivie individuellement

  expected_output: >
    Un fichier `TASKS.md` structuré comme suit :
    - Des **phases** numérotées (`Phase 1`, `Phase 2`, etc.), avec un titre clair
    - Des **sous-tâches** identifiées par un titre de type `Task X.Y: Nom de la tâche`
    - Une **liste de tâches** par sous-tâche, chacune précédée d'une case à cocher `[ ]`

  output_file: "TASKS.md"
  
  tools: 
    - FileReadTool
    - FileWriteTool
    - MarkdownParserTool

  validation_criteria: >
    - Chaque tâche doit être réalisable en 2-4 heures maximum
    - Les tâches doivent avoir des critères d'acceptation clairs
    - Les dépendances entre tâches doivent être clairement indiquées
    - La structure doit suivre une progression logique du développement
    - Le format Markdown doit être correctement appliqué

  context: >
    - Le fichier SPECIFICATION.md contient les exigences détaillées du projet
    - L'application utilise des technologies modernes (React, Vite, TypeScript, TailwindCSS)
    - Le projet nécessite une planification détaillée pour le développement itératif