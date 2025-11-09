import { open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "node:path";
import bcrypt from "bcryptjs";
import validator from "validator";

export async function register(req, res) {
	let { username, password, email } = req.body || {};

	if (!username || !password || !email) {
		return res.status(400).json({
			error: "All fields are required",
			details: "Username, password, and email must be provided",
		});
	}

	username = username.trim();
	email = email.trim();
	password = password.trim();

	const validateUserNameRegex = /^[a-zA-Z0-9_-]{1,20}$/;
	const isUserNameValid = validateUserNameRegex.test(username);
	const isEmailValid = validator.isEmail(email);

	if (!isUserNameValid) {
		return res.status(400).json({
			error: "Invalid username",
			details: "Username must be 1-20 characters long and contain only letters, numbers, hyphens, and underscores",
		});
	}

	if (!isEmailValid) {
		return res.status(400).json({
			error: "Invalid email",
			details: "Please provide a valid email address",
		});
	}

	const db = await open({
		filename: path.join("database.db"),
		driver: sqlite3.Database,
	});

	try {
		const emailExists = await db.get(
			`SELECT * FROM users WHERE email = ?`,
			[email]
		);

		if (emailExists) {
			return res.status(409).json({
				error: "Email already registered",
				details: "An account with this email address already exists",
			});
		}

		const passwordHash = await bcrypt.hash(password, 10);

		await db.run(
			`INSERT INTO users (username, password, email) VALUES (?, ?, ?)`,
			[username, passwordHash, email]
		);

		res.status(201).json({
			message: "User registered successfully",
			user: { username, email },
		});
	} catch (error) {
		res.status(500).json({
			error: "Failed to register user",
			details: error.message,
		});
	}
}

export async function login(req, res) {
	let { password, email } = req.body || {};

	if (!password || !email) {
		return res.status(400).json({
			error: "All fields are required",
			details: "Password and email must be provided",
		});
	}

	email = email.trim();

	const isEmailValid = validator.isEmail(email);

	if (!isEmailValid) {
		return res.status(400).json({
			error: "Invalid email",
			details: "Please provide a valid email address",
		});
	}

	const db = await open({
		filename: path.join("database.db"),
		driver: sqlite3.Database,
	});

	try {
		const existingUser = await db.get(
			`SELECT * FROM users WHERE email = ?`,
			[email]
		);

		if (!existingUser) {
			return res.status(401).json({
				error: "Invalid credentials",
				details: "Email or password is incorrect",
			});
		}

		const isPasswordCorrect = await bcrypt.compare(
			password,
			existingUser.password
		);

		if (!isPasswordCorrect) {
			return res.status(401).json({
				error: "Invalid credentials",
				details: "Email or password is incorrect",
			});
		}

		req.session.userId = existingUser.id;
		req.session.email = existingUser.email;

		res.status(200).json({
			message: "Login successful",
			user: {
				id: existingUser.id,
				username: existingUser.username,
				email: existingUser.email,
			},
		});
	} catch (error) {
		res.status(500).json({
			error: "Failed to login user",
			details: error.message,
		});
	}
}

export async function me(req, res) {
	const db = await open({
		filename: path.join("database.db"),
		driver: sqlite3.Database,
	});

	try {
		const existingUser = await db.get(
			`SELECT * FROM users WHERE id = ?`,
			[req.session.userId]
		);

		if (!existingUser) {
			return res.status(401).json({
				error: "Session invalid",
				details: "User not found for the current session. Please login again",
			});
		}

		res.status(200).json({
			data: existingUser,
		});
	} catch (error) {
		res.status(500).json({
			error: "Failed to get user information",
			details: error.message,
		});
	}
}

export async function logout(req, res) {
	req.session.destroy((err) => {
		if (err) {
			return res.status(500).json({
				error: "Failed to logout",
				details: err.message,
			});
		}

		res.status(200).json({
			message: "Logout successful",
		});
	});
}
