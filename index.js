#!/usr/bin/env node

const ssh = new (require("node-ssh"))();
const localStorage = new require("node-localstorage").LocalStorage("./config");
const inquirer = require("inquirer");
const program = require("commander");

program.version("0.1.0");

program
  .command("list")
  .description("List all your servers with respond time and download speed")
  .action(listServers);

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

async function listServers() {
  let credentials = await getCredentials();
  await getSSHConnection(credentials);

  let result = await ssh.execCommand("dbus list ssconf_basic_server")
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
