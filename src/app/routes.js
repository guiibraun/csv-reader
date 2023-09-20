import database from "../database/index.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const tasks = database.select("tasks");

      return res.end(JSON.stringify(tasks, null, 2));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title && !description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ error: "title or description dont exists" }));
      }

      const data = {
        id: randomUUID(),
        title: title,
        description: description || null,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert("tasks", data);

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const taskExists = database.findById("tasks", id);

      if (!taskExists) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: "Task not found" }));
      }

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const { title, description } = req.body;

      if (!title && !description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ error: "title or description dont exists" }));
      }

      const taskExists = database.findById("tasks", id);

      if (!taskExists) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: "Task not found" }));
      }

      database.update("tasks", id, { title, description });

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/completed"),
    handler: (req, res) => {
      const { id } = req.params;

      const taskExists = database.findById("tasks", id);

      if (!taskExists) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: "Task not found" }));
      }

      database.updateCompleted("tasks", id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/upload"),
    handler: (req, res) => {
      const { data } = req.body;

      data.forEach((task) => {
        const data = {
          id: randomUUID(),
          title: task.title,
          description: task.description,
          completed_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        };

        database.insert("tasks", data);
      });

      return res.end();
    },
  },
];
