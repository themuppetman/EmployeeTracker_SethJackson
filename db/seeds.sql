USE employee_db;

-- Insert data into the department table
INSERT INTO department (name)
VALUES
('IT'),
('Finance'),
('Marketing'),
('Sales'),
('Engineering'),
('Legal'),
('Customer Service'),
('Product Management'),
('Research and Development');

-- Insert data into the role table
INSERT INTO role (title, salary, department_id)
VALUES
('Chief Executive Officer', 200000.00, 1),
('Marketing Manager', 100000.00, 3),
('HR Director', 90000.00, 2),
('Sales Manager', 80000.00, 4),
('Engineering Manager', 80000.00, 5),
('Legal Counsel', 80000.00, 6),
('Customer Service Manager', 70000.00, 7),
('Product Manager', 70000.00, 8),
('Research and Development Manager', 70000.00, 9);

-- Insert data into the employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Doe', 2, 1),
('Jim', 'Doe', 3, 1),
('Jill', 'Doe', 4, 1),
('Jack', 'Doe', 5, 1),
('Jenny', 'Doe', 6, 1),
('Jared', 'Doe', 7, 1),
('Jasmine', 'Doe', 8, 1),
('Jesse', 'Doe', 9, 1);
