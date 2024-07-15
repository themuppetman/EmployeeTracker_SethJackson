const mysql = require('mysql2');
const inquirer = require('inquirer');

// Create connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '', // Add your MySQL password here
    database: 'employee_db',
});

// Connect to the database
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected as id ' + connection.threadId);
    mainMenu();
});

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

// function to view all roles 
function viewAllRoles() {
    const query = 'SELECT role.id, role.title, role.salary, department.name as department FROM role LEFT JOIN department ON role.department_id = department.id';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

// function to view all employees
function viewAllEmployees() {
    const query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, concat(manager.first_name, " ", manager.last_name) as manager from employee left join role on employee.role_id = role.id left join department on role.department_id = department.id left join employee manager on employee.manager_id = manager.id';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

// function to add department
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

// function to add role
function addRole() {
    const query = 'SELECT * FROM department';
    connection.query
        (query, (err, res) => {
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

// function to add employee
function addEmployee() {
    const query = 'SELECT * FROM role';
    connection.query
        (query, (err, res) => {
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

// function to update employee role
function updateEmployeeRole() {
    const query = 'SELECT * FROM employee';
    connection.query
        (query, (err, employees) => {
            if (err) throw err;
            const query = 'SELECT * FROM role';
            connection.query
                (query, (err, roles) => {
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

