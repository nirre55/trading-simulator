#!/usr/bin/env python
import sys
import warnings

from datetime import datetime

from tasks_generator.crew import TasksGenerator
from tasks_generator.crew_ui import UiGenerator

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information

def run():
    """
    Run the crew.
    """
    inputs = {
        'topic': 'AI LLMs',
        'current_year': str(datetime.now().year)
    }
    
    try:
        TasksGenerator().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        "topic": "AI LLMs",
        'current_year': str(datetime.now().year)
    }
    try:
        TasksGenerator().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        TasksGenerator().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        "topic": "AI LLMs",
        "current_year": str(datetime.now().year)
    }
    
    try:
        TasksGenerator().crew().test(n_iterations=int(sys.argv[1]), eval_llm=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")

# Instancier et exécuter le crew pour générer les tâches
def task_generator_run():
    output_file = r'src/tasks_generator/doc/TASKS.md'
    input_file = r'src/tasks_generator/doc/SPECIFICATION.md'
    inputs={
        "input_file": input_file,
        "output_file": output_file
    }
    crew = TasksGenerator()
    result = crew.crew_tasks().kickoff(inputs=inputs)

    print(result)


# Instancier et exécuter le crew pour générer details ui 
def ui_generator_run():
    output_file = r'src/tasks_generator/doc/UI_UX.md'
    input_file = r'src/tasks_generator/doc/SPECIFICATION.md'
    inputs={
        "input_file": input_file,
        "output_file": output_file
    }
    crew_ui_ux = UiGenerator()
    result = crew_ui_ux.crew_ui_ux().kickoff(inputs=inputs)

    print(result)

task_generator_run()
#ui_generator_run()