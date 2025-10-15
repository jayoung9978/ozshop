const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const setupDatabase = async () => {
	let connection;
	try {
		// MySQL 서버에 연결 (데이터베이스 지정 없이)
		connection = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
		});

		console.log("MySQL 서버에 연결되었습니다.");

		// 1. 데이터베이스 생성
		await connection.query(
			`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
		);
		console.log(`데이터베이스 '${process.env.DB_NAME}' 생성 완료`);

		// 데이터베이스 선택
		await connection.query(`USE ${process.env.DB_NAME}`);

		// 2. users 테이블 생성
		await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
		console.log("users 테이블 생성 완료");

		// 3. products 테이블 생성
		await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(500),
        stock INT DEFAULT 0,
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
		console.log("products 테이블 생성 완료");

		// 4. cart 테이블 생성
		await connection.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id)
      )
    `);
		console.log("cart 테이블 생성 완료");

		// 5. orders 테이블 생성
		await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        shipping_address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
		console.log("orders 테이블 생성 완료");

		// 6. order_items 테이블 생성
		await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);
		console.log("order_items 테이블 생성 완료");

		// 7. 샘플 상품 데이터 삽입 (중복 방지)
		const [existingProducts] = await connection.query(
			"SELECT COUNT(*) as count FROM products"
		);

		if (existingProducts[0].count === 0) {
			await connection.query(`
        INSERT INTO products (name, description, price, image_url, stock, category) VALUES
        ('무선 이어폰', '고음질 블루투스 무선 이어폰', 89000, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500', 50, '전자기기'),
        ('노트북 거치대', '각도 조절 가능한 알루미늄 거치대', 35000, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', 30, '액세서리'),
        ('기계식 키보드', 'RGB 백라이트 기계식 키보드', 129000, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', 25, '전자기기'),
        ('무선 마우스', '인체공학적 디자인 무선 마우스', 45000, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500', 40, '전자기기'),
        ('USB 허브', '7포트 USB 3.0 허브', 28000, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500', 60, '액세서리'),
        ('모니터', '27인치 4K UHD 모니터', 450000, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', 15, '전자기기'),
        ('웹캠', '1080p HD 웹캠', 85000, 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500', 20, '전자기기'),
        ('스마트폰 거치대', '각도 조절 가능한 거치대', 15000, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500', 100, '액세서리')
      `);
			console.log("샘플 상품 데이터 삽입 완료");
		} else {
			console.log("이미 상품 데이터가 존재합니다.");
		}

		console.log("데이터베이스 설정이 완료되었습니다!");
	} catch (error) {
		console.error("데이터베이스 설정 중 오류 발생:", error);
		throw error;
	} finally {
		if (connection) {
			await connection.end();
		}
	}
};

module.exports = setupDatabase;