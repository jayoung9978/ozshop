// Express 웹 프레임워크
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");

// 관리자 라우트
const adminProductRoutes = require("./routes/admin/productRoutes.js");
const adminUserRoutes = require("./routes/admin/userRoutes.js");
const adminOrderRoutes = require("./routes/admin/orderRoutes.js");

const setupDatabase = require("./config/dbSetup.js");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// 관리자 API 라우트
const adminDashboardRoutes = require("./routes/admin/dashboardRoutes.js");
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
	res.json({ message: "Hello from the backend!" });
});

const startServer = async () => {
	await setupDatabase();

	app.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});
};

startServer();
