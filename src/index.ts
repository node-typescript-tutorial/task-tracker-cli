import * as fs from "fs";
import * as readline from "readline";
import { STATUS, Task } from "./task";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const addReg = new RegExp('^task-cli\\sadd\\s"(.*?)"$');
const updateReg = new RegExp('^task-cli\\supdate\\s(task-[0-9]+)\\s"(.*?)"$');

// (?:...): non capturing group
const listReg = new RegExp(
  "^task-cli\\slist(?:\\s(in-progress|to-do|done|cancel|outdated)|)$"
);

const markReg = new RegExp(
  "^task-cli\\smark-(in-progress|to-do|done|cancel|outdated)\\s(task-[0-9]+)$"
);

const deleteReg = new RegExp("^task-cli\\sdelete\\s(task-[0-9]+)$");

const data = fs.readFileSync("./data/tasks.json", "utf-8");

const tasks: Task[] = JSON.parse(data);

const handleInput = (text: string) => {
  //check is add command
  let parts = checkRegex(text, addReg);

  if (parts && parts.length > 1) {
    hanldeAddCommand(parts[1], tasks);
    prompt();
    return;
  }

  // check is update command
  parts = checkRegex(text, updateReg);

  if (parts && parts.length > 2) {
    hanldeUpdateCommand(parts[1], parts[2], tasks);
    prompt();
    return;
  }

  // check is list command
  parts = checkRegex(text, listReg);
  if (parts && parts.length > 1) {
    console.log("waiting...");
    handleListCommand(
      tasks,
      parts.length > 1 ? (parts[1] as STATUS) : undefined
    );
    prompt();
    return;
  }

  // check is mark command
  parts = checkRegex(text, markReg);

  if (parts && parts.length > 2) {
    hanldeMarkCommand(parts[2], parts[1] as STATUS, tasks);
    prompt();
    return;
  }

  parts = checkRegex(text, deleteReg);
  if (parts && parts.length > 1) {
    handlDeleteCommand(tasks, parts[1]);
    return;
  }
  // wrong command
  console.log("command is not recognized");
  prompt();
};

const checkRegex = (str: string, regex: RegExp) => {
  return regex.exec(str);
};

// command: task-cli add "<description>"
const hanldeAddCommand = (description: string, tasks: Task[]) => {
  const newTask: Task = {
    id: `task-${tasks.length + 1}`,
    description: description,
    status: "to-do",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  tasks.push(newTask);

  const jsonTask = JSON.stringify(tasks, null, 2);
  fs.writeFileSync("./data/tasks.json", jsonTask);
  console.log(
    "you have created new task:\n" + JSON.stringify(newTask, null, 2)
  );
};

// command: task-cli update <task-number> "<description>"
const hanldeUpdateCommand = (
  id: string,
  newDescription: string,
  tasks: Task[]
) => {
  const taskIdx = tasks.findIndex((v) => v.id == id);

  if (taskIdx == -1) {
    console.log(`task not found with id: ${id}`);
    return;
  }
  tasks[taskIdx].description = newDescription;

  const jsonTask = JSON.stringify(tasks, null, 2);
  fs.writeFileSync("./data/tasks.json", jsonTask);
  console.log(
    "you have updated task:\n" + JSON.stringify(tasks[taskIdx], null, 2)
  );
};

// command: task-cli mark-<status> <id>
const hanldeMarkCommand = (id: string, status: STATUS, tasks: Task[]) => {
  const taskIdx = tasks.findIndex((v) => v.id == id);

  if (taskIdx == -1) {
    console.log(`task not found with id: ${id}`);
    return;
  }

  const oldStatus = tasks[taskIdx].status.toString();
  tasks[taskIdx].status = status;

  const jsonTask = JSON.stringify(tasks, null, 2);
  fs.writeFileSync("./data/tasks.json", jsonTask);
  console.log(
    `you have updated status task ${id} from ${oldStatus} to ${status}`
  );
};

// command: task-cli list
const handleListCommand = (list: Task[], status?: STATUS) => {
  if (list.length == 0) {
    console.log("list is empty");
    return;
  } else if (status) {
    list
      .filter((item) => item.status === status)
      .forEach((item) => {
        console.log(
          `id: ${item.id} description: ${item.description} status: ${item.status}\n`
        );
      });
  } else {
    list.forEach((item) => {
      console.log(
        `id: ${item.id} description: ${item.description} status: ${item.status}\n`
      );
    });
  }
};

const handlDeleteCommand = (list: Task[], id: string) => {
  const idx = list.findIndex((t) => t.id === id);
  if (idx == -1) {
    console.log(`cannot find a task with id ${id}`);
    return;
  } else {
    list.splice(idx, 1);
    console.log(`task having id ${id} was deleted successfully`);
    fs.writeFileSync("./data/tasks.json", JSON.stringify(list));
  }
};
const prompt = (text?: string) => {
  rl.question(text ?? "enter something here: ", (answer) => {
    handleInput(answer.trim());
  });
};

prompt();
