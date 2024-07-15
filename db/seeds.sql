INSERT INTO departments (department name)
('IT')
('Finance')
('Marketing')
('Sales')
('Engineering')
('Legal')
('Customer Service')
('Product Management')
('Research and Development')

INSERT INTO roles (title, salary, department_id)
VALUES
(Chiet Executive Officer, 200000.00, 1),
(Marketing Manager, 100000.00, 2),
(HR Director, 90000.00, 3),
(Sales Manager, 80000.00, 4),
(Engineering Manager, 80000.00, 5),
(Legal Counsel, 80000.00, 6),
(Customer Service Manager, 70000.00, 7),
(Product Manager, 70000.00, 8),
(Research and Development Manager, 70000.00, 9),

INSERT INTO employees (first_name, last_name, role_id, manager_id)
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



