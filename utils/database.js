import { open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "node:path";

async function createProductsTable() {
	const db = await open({
		filename: path.join("database.db"),
		driver: sqlite3.Database,
	});

	await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL
    )
    `);

	await db.close();

	console.log("Table products created");
}

async function createUsersTable() {
	const db = await open({
		filename: path.join("database.db"),
		driver: sqlite3.Database,
	});

	await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userName TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL
    )
    `);

	await db.close();

	console.log("Table users created");
}

async function createCartItemsTable() {
	const db = await open({
		filename: path.join("database.db"),
		driver: sqlite3.Database,
	});

	await db.exec(`
    CREATE TABLE IF NOT EXISTS cartItems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
    `);

	await db.close();

	console.log("Table cartItems created");
}

createUsersTable();
createProductsTable();
createCartItemsTable();
