const main = require("./index.js")

describe("Test main functionality", () => {

  it("Should read file", () => {
    const result = main.readAppFile()
    expect(typeof result).toBe("string")
  })


  it("Should run command on CLI and return value", async () => {
    const { stdout } = await main.runProgram("echo hello")
    expect(stdout.trim()).toBe("hello")
  })

  it("Should return help", async () => {
    const mockData = {
      mockArgs: ["help"],
      mockJson: {},
    }
    const result = await main.main(mockData)
    expect(result[0].trim()).toBe(main.displayHelp().stdout.trim())
  })


  it("Should have array of arguments", () => {
    const result = main.readArgs()
    expect(result.length).toBeDefined()
  })

  it("Should run main and echo hello", async () => {
    const mockData = {
      mockArgs: ["test"],
      mockJson: { test: "echo hello" }
    }
    const result = await main.main(mockData)
    expect(result.toString()).toBe(["hello"].toString())
  })

  it("Should run whitout mock args", async () => {
    await main.main()
  })

  it("Should print console.error -message", async () => {
    const mockData = {
      mockArgs: ["test"],
      mockJson: { test: "ech hello" }
    }
    await main.main(mockData)
  })


  it("Should pick save program stage", async () => {
    const { stdout } = main.solveApp('save-new="echo im new saved command"', {})
    console.log(stdout)
  })

  it("Should pick save program stage", async () => {
    const { stdout } = main.solveApp('jenkins="docker run -p 8080:8080 --restart=always jenkins:jenkins"', {})
    console.log(stdout)
  })

})