import { open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "node:path";

export async function getProducts(req, res) {
	const db = await open({
		filename: path.join("database.db"),
		driver: sqlite3.Database,
	});

	try {
		const products = await db.all(`SELECT * FROM products`);
		res.status(200).json({ data: products });
	} catch (error) {
		res.status(500).json({
			error: "Failed to fetch products",
			details: err.message,
		});
	}
}

export async function getProductById(req, res) {
	const db = await open({
		filename: path.join("database.db"),
		driver: sqlite3.Database,
	});

	const { id } = req.params;

	if (!id) {
		res.status(400).json({
			error: "ID is required",
			details: "Product ID must be provided in parameters",
		});
	}

	try {
		const product = await db.get(`SELECT * FROM products WHERE id = ?`, [
			id,
		]);

		if (!product) {
			return res.status(404).json({
				error: "Product not found",
				details: "No product exists with the provided ID",
			});
		}

		res.status(200).json({ data: product });
	} catch (error) {
		res.status(500).json({
			error: "Failed to fetch products",
			details: err.message,
		});
	}
}

export async function getProductsBySearch(req, res) {
	const db = await open({
		filename: path.join("database.db"),
		driver: sqlite3.Database,
	});

	const { q } = req.query;

	try {
		let products = null;

		if (!q) {
			products = await db.all(`SELECT * FROM products`);
		} else {
			products = await db.all(
				`SELECT * FROM products WHERE name LIKE ? OR description LIKE ?`,
				[`%${q}%`, `%${q}%`]
			);
		}

		res.status(200).json({ data: products });
	} catch (error) {
		res.status(500).json({
			error: "Failed to fetch products",
			details: err.message,
		});
	}
}
