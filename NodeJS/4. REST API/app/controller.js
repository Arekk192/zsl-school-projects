import tasks from "./model.js";

const controller = {
  getall: () => {
    return tasks;
  },
  get: (id) => {
    const task = tasks.filter((el) => el.id == id)[0];
    return task
      ? { status: 200, ...task }
      : { status: 404, message: `task with id ${id} not found` };
  },
  insert(data) {
    const id = tasks[tasks.length - 1].id + 1;
    tasks.push({ id: id, ...data });
    return { status: 201, task: data };
  },
  // update: () => {
  //   if (task) {
  //     tasks = tasks.map(el => {
  //       if (task.id == id)
  //     })
  //     return;
  //   } else return { status: 404, message: `no task with id ${id} found` };
  // },
  delete: (id) => {
    const task = tasks.filter((el) => el.id == id)[0];
    if (task) {
      tasks = tasks.filter((el) => el.id != id);
      return { status: 202, message: `task with id ${id} deleted succesfully` };
    } else return { status: 404, message: `task with id ${id} not found` };
  },
};
export default controller;
