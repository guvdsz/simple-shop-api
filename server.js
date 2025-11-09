import express from "express";
import cors from "cors";
import session from "express-session";
import { productRouter } from "./routes/productRoutes.js";
import { authRouter } from "./routes/authRoutes.js";
import { requireAuth } from "./middlewares/requireAuth.js";
import { cartRouter } from "./routes/cartRoutes.js";

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.use(
	session({
		secret: "123456",
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24,
		},
	})
);

app.use("/api/auth", authRouter);
app.use("/api/products", requireAuth, productRouter);
app.use("/api/cart", requireAuth, cartRouter);

app.use((req, res) => {
	res.status(404).json({
		message: "Endpoint not found.",
	});
});

app.listen(PORT, () => console.log("Server is running...")).on(
	"error",
	(err) => {
		console.error("Failed to start server:", err);
	}
);
