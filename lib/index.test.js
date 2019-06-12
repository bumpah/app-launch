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

  it("Should work whitout mock args", async () => {
    const mockData = {
      mockArgs: ["test"],
      mockJson: { test: "ech hello" }
    }
    await main.main(mockData)
  })

})