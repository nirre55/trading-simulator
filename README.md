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


interface_design_task:
  description: >
    Generate a comprehensive textual description of the user interface for the
    Trading Position Simulator (Crypto) web application based on {input_file}.
    The description should be divided into clear sections, detailing layout,
    components, styling using TailwindCSS classes, and responsiveness for both
    desktop and mobile views.  
  expected_output: >
    A detailed, sectioned textual description of the interface, including
    specific TailwindCSS class references, design choices (e.g., "background
    color #1a202c for dark mode", "green button #48bb78 with hover effect"), and
    explanations on how the interface adapts to different screen sizes and saves
    everything in {output_file}.
  agent: >
    ui_ux_expert