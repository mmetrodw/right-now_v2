// Get the client
import mysql from 'mysql2/promise';

// Create the connection to database
export async function connectToDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  return connection;
}