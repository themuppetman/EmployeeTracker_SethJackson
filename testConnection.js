const mysql = require('mysql2');

// Create connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '', // Add your MySQL password here if applicable
    database: 'employee_db',
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected as id ' + connection.threadId);
    connection.end();
});
