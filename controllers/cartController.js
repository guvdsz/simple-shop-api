import { open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "node:path";

export async function getCartItems(req, res) {
	const db = await open({
		filename: path.join("database.db"),
		driver: sqlite3.Database,
	});

	try {
		const items = await db.all(
			`SELECT 
                cartItems.*, 
                products.name, 
                products.description, 
                products.price 
            FROM cartItems 
            JOIN products ON cartItems.product_id = products.id 
            WHERE cartItems.user_id = ?`,
			[req.session.userId]
		);
		res.status(200).json({ data: items });
	} catch (error) {
		res.status(500).json({
			error: "Failed to fetch cart items",
			details: error.message,
		});
	} finally {
		await db.close();
	}
}

export async function addItemToCart(req, res) {
	const { productId, quantity } = req.body || {};

	if (!productId || !quantity) {
		return res.status(400).json({
			error: "Invalid request",
			details: "Product ID and quantity are required",
		});
	}

	const db = await open({
		filename: path.join("database.db"),
		driver: sqlite3.Database,
	});

	try {
		const product = await db.get(`SELECT * FROM products WHERE id = ?`, [
			productId,
		]);

		if (!product) {
			return res.status(404).json({
				error: "Product not found",
				details: "The specified product does not exist",
			});
		}

		const existingItem = await db.get(
			`SELECT * FROM cartItems WHERE product_id = ? AND user_id = ?`,
			[productId, req.session.userId]
		);

		if (existingItem) {
			await db.run(
				`UPDATE cartItems 
                SET quantity = quantity + ? 
                WHERE product_id = ? AND user_id = ?`,
				[quantity, productId, req.session.userId]
			);
			const updatedItem = await db.get(
				`SELECT * FROM cartItems WHERE id = ?`,
				[existingItem.id]
			);
			return res.status(200).json({
				message: "Cart updated",
				data: updatedItem,
			});
		} else {
			const result = await db.run(
				`INSERT INTO cartItems 
                (user_id, product_id, quantity)
                VALUES (?,?,?)`,
				[req.session.userId, productId, quantity]
			);

			const newItem = await db.get(
				`SELECT * FROM cartItems WHERE id = ?`,
				[result.lastID]
			);

			return res.status(201).json({
				message: "Item added to cart",
				data: newItem,
			});
		}
	} catch (error) {
		res.status(500).json({
			error: "Failed to add item to cart",
			details: error.message,
		});
	} finally {
		await db.close();
	}
}
