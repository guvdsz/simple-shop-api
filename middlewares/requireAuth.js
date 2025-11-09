export function requireAuth(req, res, next) {
	let { userId, email } = req.session || {};

	if (!userId || !email) {
		return res.status(401).json({
			error: "Unauthorized",
			details: "No active session found. Please login to continue",
		});
	}

    next()
}
