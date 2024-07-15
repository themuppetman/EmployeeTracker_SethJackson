const mysql = require('mysql2');
const inquirer = require('inquirer');

// Create connection to the MySQL server
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Add your MySQL password here
    multipleStatements: true
});

// Connect to the MySQL server
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL server.');
    setupDatabase();
});

// Function to setup the database
function setupDatabase() {
    const createDatabaseAndTablesQuery = `
        DROP DATABASE IF EXISTS employee_db;
        CREATE DATABASE employee_db;
        USE employee_db;

        CREATE TABLE IF NOT EXISTS department (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS role (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(50) NOT NULL,
            salary DECIMAL(10, 2) NOT NULL,
            department_id INT,
            FOREIGN KEY (department_id) REFERENCES department(id)
        );

        CREATE TABLE IF NOT EXISTS employee (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(30) NOT NULL,
            last_name VARCHAR(30) NOT NULL,
            role_id INT,
            manager_id INT,
            FOREIGN KEY (role_id) REFERENCES role(id),
            FOREIGN KEY (manager_id) REFERENCES employee(id)
        );
    `;

    connection.query(createDatabaseAndTablesQuery, (err, results) => {
        if (err) throw err;
        console.log('Database and tables created.');
        insertInitialData();
    });
}

// Function to insert initial data
function insertInitialData() {
    const insertDataQuery = `
        USE employee_db;

        INSERT INTO department (name) VALUES 
        ('IT'), ('Finance'), ('Marketing'), ('Sales'), ('Engineering'), ('Legal'), 
        ('Customer Service'), ('Product Management'), ('Research and Development');

        INSERT INTO role (title, salary, department_id) VALUES
        ('Chief Executive Officer', 200000.00, 1),
        ('Marketing Manager', 100000.00, 3),
        ('HR Director', 90000.00, 2),
        ('Sales Manager', 80000.00, 4),
        ('Engineering Manager', 80000.00, 5),
        ('Legal Counsel', 80000.00, 6),
        ('Customer Service Manager', 70000.00, 7),
        ('Product Manager', 70000.00, 8),
        ('Research and Development Manager', 70000.00, 9);

        INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
        ('John', 'Doe', 1, NULL), ('Jane', 'Doe', 2, 1), ('Jim', 'Doe', 3, 1),
        ('Jill', 'Doe', 4, 1), ('Jack', 'Doe', 5, 1), ('Jenny', 'Doe', 6, 1),
        ('Jared', 'Doe', 7, 1), ('Jasmine', 'Doe', 8, 1), ('Jesse', 'Doe', 9, 1);
    `;

    connection.query(insertDataQuery, (err, results) => {
        if (err) throw err;
        console.log('Initial data inserted.');
        mainMenu();
    });
}

// Main menu function
function mainMenu() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'Select an action',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit',
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case 'View all departments':
                    viewAllDepartments();
                    break;
                case 'View all roles':
                    viewAllRoles();
                    break;
                case 'View all employees':
                    viewAllEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case 'Exit':
                    connection.end();
                    break;
                default:
                    console.log(`Invalid action: ${answer.action}`);
                    break;
            }
        });
}

// Function to view all departments
function viewAllDepartments() {
    const query = 'SELECT * FROM department';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

// Function to view all roles
function viewAllRoles() {
    const query = `
        SELECT 
            role.id, 
            role.title, 
            role.salary, 
            department.name AS department 
        FROM 
            role 
        LEFT JOIN department ON role.department_id = department.id
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

// Function to view all employees
function viewAllEmployees() {
    const query = `
        SELECT 
            employee.id, 
            employee.first_name, 
            employee.last_name, 
            role.title, 
            department.name AS department, 
            role.salary, 
            CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
        FROM 
            employee 
        LEFT JOIN role ON employee.role_id = role.id 
        LEFT JOIN department ON role.department_id = department.id 
        LEFT JOIN employee manager ON employee.manager_id = manager.id
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

// Function to add a department
function addDepartment() {
    inquirer
        .prompt({
            name: 'name',
            type: 'input',
            message: 'Enter the name of the department',
        })
        .then((answer) => {
            const query = 'INSERT INTO department SET ?';
            connection.query(query, { name: answer.name }, (err, res) => {
                if (err) throw err;
                console.log('Department added');
                mainMenu();
            });
        });
}

// Function to add a role
function addRole() {
    const query = 'SELECT * FROM department';
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'title',
                    type: 'input',
                    message: 'Enter the title of the role',
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'Enter the salary of the role',
                },
                {
                    name: 'department_id',
                    type: 'list',
                    message: 'Select the department of the role',
                    choices: res.map((department) => ({
                        name: department.name,
                        value: department.id,
                    })),
                },
            ])
            .then((answer) => {
                const query = 'INSERT INTO role SET ?';
                connection.query(query, { title: answer.title, salary: answer.salary, department_id: answer.department_id }, (err, res) => {
                    if (err) throw err;
                    console.log('Role added');
                    mainMenu();
                });
            });
    });
}

// Function to add an employee
function addEmployee() {
    const query = 'SELECT * FROM role';
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: 'Enter the first name of the employee',
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'Enter the last name of the employee',
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'Select the role of the employee',
                    choices: res.map((role) => ({
                        name: role.title,
                        value: role.id,
                    })),
                },
            ])
            .then((answer) => {
                const query = 'INSERT INTO employee SET ?';
                connection.query(query, { first_name: answer.first_name, last_name: answer.last_name, role_id: answer.role_id }, (err, res) => {
                    if (err) throw err;
                    console.log('Employee added');
                    mainMenu();
                });
            });
    });
}

// Function to update employee role
function updateEmployeeRole() {
    const query = 'SELECT * FROM employee';
    connection.query(query, (err, employees) => {
        if (err) throw err;
        const query = 'SELECT * FROM role';
        connection.query(query, (err, roles) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        name: 'employee_id',
                        type: 'list',
                        message: 'Select the employee to update',
                        choices: employees.map((employee) => ({
                            name: `${employee.first_name} ${employee.last_name}`,
                            value: employee.id,
                        })),
                    },
                    {
                        name: 'role_id',
                        type: 'list',
                        message: 'Select the new role of the employee',
                        choices: roles.map((role) => ({
                            name: role.title,
                            value: role.id,
                        })),
                    },
                ])
                .then((answer) => {
                    const query = 'UPDATE employee SET ? WHERE ?';
                    connection.query(query, [{ role_id: answer.role_id }, { id: answer.employee_id }], (err, res) => {
                        if (err) throw err;
                        console.log('Employee role updated');
                        mainMenu();
                    });
                });
        });
    });
}

process.on('exit', () => {
    connection.end();
});
