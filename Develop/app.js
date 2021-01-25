const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
// const Choices = require("inquirer/lib/objects/choices");

let team = [];
let internCount = [];
let engineerCount = [];
let managerCount = [];
const employ = [
    {
        type: "list",
        message: "Add an Employee: ",
        name: "employee",
        choices: ["Manager", "Engineer", "Intern", "Team Complete"]
    }
];
const managerInfo = [
    {
        type: "input",
        message: "Name: ",
        name: "name"
    },
    {
        type: "input",
        message: "Identificaiton number: ",
        name: "id"
    },
    {
        type: "input",
        message: "Email: ",
        name: "email"
    },
    {
        type: "input",
        message: "Office Number: ",
        name: "officeNumber"
    },
    {
        type: "confirm",
        message: "Any more Managers?",
        name: "hasMoreManagers"
    },
];
// const prompts = [
//     {
//         type: "input",
//         message: "Your engineer's github?",
//         name: "officeNumber"
//     },
//     {
//         type: "confirm",
//         message: "Any more?",
//         name: "hasMoreEngineers",
//         default: true
//     },
// ];



// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// ORIGINAL IDEA: SCRAPPED!!!!
// inquirer.prompt(managerInfo).then((data) => {
//     const manager = new Manager(data.name, data.id, data.email, data.officeNumber);
//     team.push(manager);
//     if (data.hasEngineers && data.hasInterns) {
//         inquirer.prompt(engineerInfo).then((data) => {

//         })
//     }
// })

const collectEmployees = async () => {
    const { employee, ...answers } = await inquirer.prompt(employ);
    // const newInputs = [...inputs];
    // console.log(employee);
    // return newInputs;
    if (employee === "Manager") {
        return collectManagerInputs();
    }
    else if (employee === "Engineer") {
        return collectEngineerInputs();
    }
    else if (employee === "Intern") {
        return collectInternInputs();
    }
    else {
        managerCount.forEach(manager => {
            team.push(manager);
        });
        engineerCount.forEach(engineer => {
            team.push(engineer);
        });
        internCount.forEach(intern => {
            team.push(intern);
        })
        // team.push(managerCount, engineerCount, internCount);
        return team;
    }
};

const collectManagerInputs = async () => {
    const { hasMoreManagers, ...answers } = await inquirer.prompt(managerInfo);
    const newManager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
    managerCount.push(newManager);
    // return collectEmployees(team);
    // const newInputs = [...inputs, answers];
    // managerCount++;
    // if (hasMoreManagers) {
    //     return collectManagerInputs(newInputs);
    // }
    // else if (hasEngineer) {
    //     return collectEngineerInputs(newInputs);
    // }
    // else if (hasIntern) {
    //     return collectInternInputs(newInputs);
    // }
    // else {
    //     return newInputs;
    // }
    // return newInputs;
    return hasMoreManagers ? collectManagerInputs() : collectEmployees();
};

const collectEngineerInputs = async () => {
    managerInfo.pop();
    managerInfo.pop();
    managerInfo.push(
        {
            type: "input",
            message: "Your engineer's github?",
            name: "github"
        },
        {
            type: "confirm",
            message: "Any more?",
            name: "hasMoreEngineers",
            default: true
        });
    const prompts = managerInfo;
    // engineerCount++;
    const { hasMoreEngineers, ...answers } = await inquirer.prompt(prompts);
    const newEngineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
    engineerCount.push(newEngineer);
    // const newInputs = [...inputs, answers];
    // if (hasMoreEngineers) {
    //     return collectEngineerInputs(newInputs);
    // }
    // else if (hasIntern) {
    //     return collectInternInputs(newInputs);
    // }
    // else {
    //     return newInputs;
    // }
    return hasMoreEngineers ? collectEngineerInputs() : collectEmployees();
};

const collectInternInputs = async () => {
    managerInfo.pop();
    managerInfo.pop();
    managerInfo.push(
        {
            type: "input",
            message: "Your intern's school?",
            name: "school"
        },
        {
            type: "confirm",
            message: "Any more?",
            name: "hasMoreInterns",
            default: true
        });
    const prompts = managerInfo;
    // internCount++;
    const { hasMoreInterns, ...answers } = await inquirer.prompt(prompts);
    // const newInputs = [...inputs, answers];
    const newIntern = new Intern(answers.name, answers.id, answers.email, answers.school);
    internCount.push(newIntern);
    return hasMoreInterns ? collectInternInputs() : collectEmployees();
}

const main = async () => {
    const inputs = await collectEmployees();
    // const inputs = await collectManagerInputs();
    // console.log(inputs);
    // console.log(team);
    // render(inputs)
    fs.writeFile(outputPath, render(inputs), "utf-8", function (err) {
        if (err) console.log("You screwed up", err);
    })
    console.log("Something Happend Right for once");
};

main();

// let team = await render(inputs);
//     fs.writeFile(outputPath, team, "utf-8", function (err) {
//         if (err) console.log("You screwed up", err);
//     })
//     console.log("You did it");

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
