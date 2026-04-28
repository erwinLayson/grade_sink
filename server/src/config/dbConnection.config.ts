import  mysql  from "mysql2/promise";

export const pool = mysql.createPool({
  host: 'localhost',
  user: "root",
  database: "grade_sink",
  password: ""
})

const testConnection = async () => {
  try {
    const dbConn = await pool.getConnection();
    console.log(`database connected`);
    dbConn.release();
  } catch (err) {
    throw new Error(`Error: ${err}`);
  }
}

export default testConnection;