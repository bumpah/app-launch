const util = require("util")
const exec = util.promisify(require("child_process").exec)
const fs = require("fs")

const APPS_JSON_PATH = `${process.env.HOME}/app-launch.json`

async function main(mocks) {
  const { mockArgs, mockJson } = mocks || {}

  const args = mockArgs || readArgs()
  const appJson = mockJson || JSON.parse(readAppFile())

  const result = []
  for (let app of args) {
    try {
      const { stdout, stderr } = await runProgram(appJson[app])
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
  .filter(item => item.indexOf("--") < 0)

const runProgram = (command) => exec(command)

const readAppFile = () => fs.readFileSync(APPS_JSON_PATH).toString()


module.exports = {
  main,
  readArgs,
  runProgram,
  readAppFile,
}