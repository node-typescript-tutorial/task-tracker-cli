# task-tracker-cli

Task Tracker CLI is a Typescript todo list project sample.

## Installation & Started

```bash
npm install
npm run dev
```

## Usage

```bash
 # Show todo list. status is an optional parameter if you want to list of data depend on status(done | to-do | in-progress | outdated | cancel)
task-cli list
task-cli list to-do

# Add new task
task-cli add "description of the task you want to add"

# Update description task. format of id is "task-<number>", example: task-1
task-cli update task-1 "new description to update"

# Delete task by id
task-cli delete task-1

# change task's status by id
task-cli mark-to-do task-2                          # change status to to-do
task-cli mark-done task-3                           # change status to done
task-cli mark-in-progress task-1                    # change status to in-progress
task-cli mark-cancel task-1                         # change status to cancel 
task-cli mark-outdated task-3                       # change status to outdated
```
