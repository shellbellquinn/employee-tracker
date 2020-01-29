  INSERT INTO department(department) VALUES
 ("Sales"),
 ("Engineering"),
 ("Marketing"),
 ("IT"),
 ("HR");

INSERT INTO role(role_type, salary, department_id) VALUES
 ("Account Manager", 130000.00, 2),
 ("Sales Lead", 90000.00, 1),
 ("Salesperson", 70000.00, 1),
 ("Software Engineer", 110000.00, 2),
 ("Lead Engineer", 130000.00, 2), 
 ("Marketing Director", 90000.00, 3),
 ("Marketing Associate", 90000.00, 3),
 ("Technical Director", 130000.00, 4),
 ("Technical Associate", 110000.00, 4);


INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES
("Michelle", "Quinn", 2, 1),
("Sarah", "Dubiel", 1, 2),
("Luke", "Dowel", 4, 4),
("Alyssa", "Broomfield", 3, 1),
("Nick", "Riccolo", 5, 6),
("Amy", "Heller", 1, 6),
("Mike", "Zimmerman", 9, 1);


