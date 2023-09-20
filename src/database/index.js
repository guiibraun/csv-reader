import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => this.#persist());
  }

  #persist() {
    fs.writeFile(
      databasePath,
      JSON.stringify(this.#database, null, 2),
      "utf-8"
    );
  }

  findById(table, id) {
    const row = this.#database[table].some((task) => task.id === id);

    return row;
  }

  select(table) {
    const data = this.#database[table] ?? [];

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      console.log(Array.isArray(this.#database[table]));
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }
    this.#persist();
    return data;
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    this.#database[table][rowIndex] = { id, ...data };
    this.#persist();
  }

  updateCompleted(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    const data = this.#database[table][rowIndex];
    const isCompleted = Boolean(data.completed_at) ? null : new Date();

    this.#database[table][rowIndex] = {
      ...data,
      completed_at: isCompleted,
      updated_at: new Date(),
    };
    this.#persist();
  }
}

export default new Database();
