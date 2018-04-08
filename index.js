#!/usr/bin/env node

const ssh = new (require("node-ssh"))();
const localStorage = new require("node-localstorage").LocalStorage("./config");
const inquirer = require("inquirer");
const program = require("commander");

program.version("0.1.0");

program
  .command("list")
  .description("List all your ss nodes")
  .action(listServers);

program
  .command("use")
  .description("List all your ss nodes")
  .action(switchNode);

program
  .command("test")
  .description("List all your ss nodes with curl speed. It may take a lot of time.")
  .action(runTest);

program
  .command("reset")
  .description("reset all settings")
  .action(function(env) {
    localStorage.removeItem("credentials");
    console.log("Everthing is back to zero");
    process.exit();
  });

program.parse(process.argv);


function nullCheck(val) {
  if (!val || !val.trim || !val.trim()) {
    return "Please enter valid inputs;";
  }

  return true;
}

function numberCheck(val) {
  if (!val || !parseInt(val)) {
    return "Please enter valid number;";
  }

  return true;
}

async function listServers() {
  let credentials = await getCredentials();
  await getSSHConnection(credentials);

  await ssh.execCommand("dbus set ssconf_only_list_node='true'")
  let result = await ssh.execCommand("/tmp/my_web_test.sh")
  console.log(result.stdout);

  process.exit();
}

async function switchNode() {
  let initQuestions = [{
    type: "input",
    name: "node",
    message: "Which node do you want to use",
    validate: numberCheck
  }];

  let answers = await inquirer.prompt(initQuestions);
  let credentials = await getCredentials();
  await getSSHConnection(credentials);
  console.log('start...')
  await ssh.execCommand("dbus set ssconf_use_node="+answers.node)
  let result = await ssh.execCommand("/tmp/my_web_test.sh")
  console.log(result.stdout);

  process.exit();
}

async function runTest() {
  let credentials = await getCredentials();
  await getSSHConnection(credentials);
  console.log('Patience you must have, my young Padawan.');
  let result = await ssh.execCommand("/tmp/my_web_test.sh")
  console.log(result.stdout);
  process.exit();
}

function getSSHConnection(credentials) {
  return ssh.connect(credentials).then(
    () => {},
    () => {
      console.log("Authentication failed. ");
      console.log(
        "Make sure you have enabled SSH login on the router and your username and password correct."
      );
      console.log("You can use --reset to reset your router's settings");
      process.exit();
    }
  );
}

async function getCredentials() {
  let initQuestions = [];
  let credentials = localStorage.getItem("credentials");

  if (!credentials) {
    initQuestions.push({
      type: "input",
      name: "host",
      message: "What's your router's ip address?",
      validate: nullCheck
    });

    initQuestions.push({
      type: "input",
      name: "username",
      message: "What's your username for the router?",
      validate: nullCheck
    });

    initQuestions.push({
      type: "input",
      name: "password",
      message: "What's your password for the router?",
      validate: nullCheck
    });
  } else {
    return JSON.parse(credentials);
  }

  credentials = await inquirer.prompt(initQuestions);
  localStorage.setItem('credentials', JSON.stringify(credentials));
  return credentials;
}
