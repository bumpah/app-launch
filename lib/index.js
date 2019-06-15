const util = require("util")
const exec = util.promisify(require("child_process").exec)
const fs = require("fs")

APPS_JSON_PATH = `${__dirname}/app-launch.json`


async function main(mocks) {
  const { mockArgs, mockJson } = mocks || {}

  const args = mockArgs || readArgs()
  const appJson = mockJson || readAppFile()

  const result = []
  for (let app of args) {
    try {
      const { stdout, stderr } = await solveApp(app, appJson)
      result.push(stdout.trim())
      console.log(app, "$:", stdout)
    } catch (error) {
      result.push(error.message)
      console.error(app, "$:", error.message)
    }
  }
  return result
}

const readArgs = () => process.argv.slice(2)

const readAppFile = () => {
  try {
    const file = fs.readFileSync(APPS_JSON_PATH).toString()
    return JSON.parse(file)
  } catch{
    console.log("file not exists, creating...")
    fs.writeFileSync(APPS_JSON_PATH, JSON.stringify({}))
    return {}
  }
}

const solveApp = (app, appJson) => {
  if (isFlag(app)) return printFlags(app, appJson)
  if (RegExp("[.]*=[.]*").test(app)) return addProgram(app, appJson)
  return runProgram(appJson[app])
}

const isFlag = (app) => app.indexOf("--") === 0

const addProgram = (app, appJson) => {
  try {
    const [cmd, ...program] = app.split("=")
    const newProgram = { [cmd]: program.join("=") }
    fs.writeFileSync(APPS_JSON_PATH, JSON.stringify(Object.assign(appJson, newProgram)))
    return { stdout: `new program added: ${JSON.stringify(newProgram)}` }
  } catch (error) {
    console.error(error.message)
  }
}

const runProgram = (command) => exec(command)

const printFlags = (app, appJson) => {
  switch (app) {
    case '--help': return displayHelp()
    case '--list': return listPrograms(appJson)
    case '--cmds': return listCommands()
    case '--commands': return listCommands()
  }
}

const displayHelp = () => ({
  stdout: `app-launch $name[="$command"]\n\
  $name: "name of command"
  [="$command"] "set new command for $name" *optional`
})

const listPrograms = (appJson) => {
  const stdout = Object.entries(appJson)
    .reduce((acc, [key, value]) => `${acc}\n${key} : ${value}`, "")
  return { stdout }
}

const listCommands = () => {
  const stdout = flags.reduce((acc, cur) => `${acc}\n${cur}`, "")
  return { stdout }
}

const flags = [
  "--help",
  "--list",
  "--cmds",
  "--commands",
]


module.exports = {
  main,
  readArgs,
  runProgram,
  readAppFile,
  displayHelp,
  solveApp,
  flags,
}