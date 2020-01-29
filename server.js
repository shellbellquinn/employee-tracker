var mysql = require("mysql");
var mysql = require("mysql2");
var inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mqMQ123#",
    database: "employeetracker"
});

connection.connect(function (err) {
    if (err) throw err;
    initialize();
});

function initialize() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",

                "View All Roles",
                "Add Role",
                "Remove Role",

                "View All Departments",
                "Add Department",
                "Remove Department",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    viewEmployees();
                    break;
                case "View All Departments":
                    viewDepartments();
                    break;
                case "View All Roles":
                    viewRoles();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Remove Employee":
                    removeEmployee();
                    break;
                case "Remove Department":
                    removeDepartment();
                    break;
                case "Remove Role":
                    removeRole();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
}

//view data
function viewEmployees() {
  //  var query = "SELECT employee.employee_id,employee.first_name,employee.last_name,role.role_type,department.department,role.salary,employee.manager_id FROM employee INNER JOIN role ON (role.role_id = employee.role_id) INNER JOIN department ON (department.department_id = role.department_id);";
  var query ="SELECT a.employee_id AS 'employee ID',a.first_name,a.last_name,role.role_type,department.department,role.salary,concat(b.first_name, ' ',b.last_name) as 'Manager Name' FROM employee a LEFT OUTER JOIN employee b ON a.manager_id = b.employee_id INNER JOIN role ON (role.role_id = a.role_id) INNER JOIN department ON (department.department_id = role.department_id);";  
  //change to adding department based on manager id details later
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        initialize();
    });
}

function viewDepartments() {
    connection.query("SELECT * FROM department;", function (err, res) {
        if (err) throw err;
        console.table(res);
        initialize();

    });
}

function viewRoles() {
    connection.query("SELECT * FROM role;", function (err, res) {
        if (err) throw err;
        console.table(res);
        initialize();

    });
}


//remove data
function removeEmployee() {
    connection.query("SELECT * FROM employee;", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: "choice",
                type: "rawlist",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].first_name);
                    }
                    return choiceArray;
                },
                message: "Which Employee do you want to remove?"
            },
            ])
            .then(function (answer) {
                connection.query("DELETE FROM employee WHERE first_name = ?", [answer.choice],
                    function (err) {
                        if (err) throw err;
                        console.log("Employee removed successfully");
                        initialize();
                    }
                );
            });
    });
}

function removeDepartment() {
    connection.query("SELECT department FROM department;", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: "choice",
                type: "rawlist",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].department);
                    }
                    return choiceArray;
                },
                message: "What department would you like to remove?"
            },
            ])
            .then(function (answer) {
                connection.query("DELETE FROM department WHERE department = ?", [answer.choice],
                    function (err) {
                        if (err) throw err;
                        console.log("Departments deleted successfully");
                        initialize();
                    }
                );
            });
    });
}

function removeRole() {
    connection.query("SELECT * FROM role;", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: "choice",
                type: "rawlist",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].role_type);
                    }
                    return choiceArray;
                },
                message: "Which Employee do you want to remove?"
            },
            ])
            .then(function (answer) {
                connection.query("DELETE FROM role WHERE role_type = ?", [answer.choice],
                    function (err) {
                        if (err) throw err;
                        console.log("Role removed successfully");
                        initialize();
                    }
                );
            });
    });
}



//add data
function addEmployee() {
    connection.query("SELECT role.role_type,role.role_id,department.department,department.department_id  FROM role INNER JOIN department ON (department.department_id = role.department_id);",
    function (err, res) {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        name: "first_name",
                        type: "input",
                        message: "What is Employee's first name?"
                    },
                    {
                        name: "last_name",
                        type: "input",
                        message: "What is Employee's last name?"
                    },
                    {
                        name: "role",
                        type: "rawlist",
                        message: "What is employee's role?",
                        choices: function () {
                            var choiceArray = [];
                            for (var i = 0; i < res.length; i++) {
                                choiceArray.push(res[i].role_type);
                            }
                            return choiceArray;
                        }
                    },
                    {
                        name: "manager_id",
                        type: "input",
                        message: "What is Employee's Manager's id?"
                        //change to adding manager later
                    },

                ])
                .then(function (answer) {
                    var role_id;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].role_type === answer.role) {
                            role_id = res[i].role_id;
                        }
                    }
                    connection.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?) ", [answer.first_name, answer.last_name, role_id, answer.manager_id],
                        function (err) {
                            if (err) throw err;
                            console.log("Added employee to database successfully");
                            initialize();
                        }
                    );
                });
        });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                name: "dep_name",
                type: "input",
                message: "What is the new Department name?"
            }
        ])
        .then(function (answer) {
            connection.query("INSERT INTO department (department) VALUES (?) ", [answer.dep_name],
                function (err) {
                    if (err) throw err;
                    console.log("Added department to database successfully");
                    initialize();
                }
            );
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                name: "role_type",
                type: "input",
                message: "What is the new Role?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the Expected Salary?"
            },
            {
                name: "department",
                type: "input",
                message: "What is the new department?"
                //change to adding department based on role later
            }
        ])
        .then(function (answer) {
            connection.query("INSERT INTO role(role_type, salary, department_id) VALUES (?,?,?) ", [answer.role_type, answer.salary, answer.department],
                function (err) {
                    if (err) throw err;
                    console.log("Added role to database successfully");
                    initialize();
                }
            );
        });
}


