import { open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "node:path";

const SEED_DATA = [
	{
		name: "Camiseta Básica Preta",
		description:
			"Camiseta 100% algodão, confortável e versátil para o dia a dia",
		price: 49.9,
	},
	{
		name: "Tênis Esportivo Running",
		description:
			"Tênis ideal para corrida com amortecimento e design moderno",
		price: 299.9,
	},
	{
		name: "Mochila Executiva",
		description:
			"Mochila resistente com compartimento para notebook até 15 polegadas",
		price: 189.9,
	},
	{
		name: "Fone de Ouvido Bluetooth",
		description:
			"Fone sem fio com cancelamento de ruído e bateria de longa duração",
		price: 249.9,
	},
	{
		name: "Garrafa Térmica 500ml",
		description:
			"Mantém líquidos quentes por 12h e frios por 24h, livre de BPA",
		price: 79.9,
	},
];

async function seedTable() {
	const db = await open({
		filename: path.join("database.db"),

		driver: sqlite3.Database,
	});

	try {
		await db.exec("BEGIN TRANSACTION");

		for (const { name, description, price } of SEED_DATA) {
			await db.run(
				`
        INSERT INTO products (name, description, price)

        VALUES (?, ?, ?)`,

				[name, description, price]
			);

			console.log("All records inserted");
		}

		await db.exec("COMMIT");
	} catch (err) {
		await db.exec("ROLLBACK");

		console.error("Error inserting data:", err.message);
	} finally {
		await db.close();

		console.log("Database connection closed.");
	}
}

seedTable()