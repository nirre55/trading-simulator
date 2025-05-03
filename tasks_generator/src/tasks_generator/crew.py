from crewai import Agent, Crew, Task
from crewai.project import CrewBase, agent, crew, task
from typing import List
from crewai_tools import FileReadTool, FileWriterTool
from dotenv import load_dotenv


# 1. Load environment variables from .env file
load_dotenv()

# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators

@CrewBase
class TasksGenerator():
    """Crew for generating project tasks"""

    # Créer l'outil de lecture de fichier
    read_file_tool = FileReadTool(file_path= r'src/tasks_generator/doc/SPECIFICATION.md')
    write_file_tool = FileWriterTool()

    @agent
    def task_structuring_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config['task_structuring_specialist'],
            tools=[self.read_file_tool],
            verbose=True,
        )

    @task
    def task_structuring_specialist_task(self) -> Task:
        return Task(
            config=self.tasks_config['task_structuring_specialist_task'],
            tools=[self.write_file_tool],
            verbose=True,
        )

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=[self.task_structuring_specialist()],
            tasks=[self.task_structuring_specialist_task()],
            verbose=True
        )
