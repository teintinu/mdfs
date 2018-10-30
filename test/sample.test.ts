import * as mdfs from ".."
import * as ts from "typescript"

mdfs.describe(__dirname + "/sample", "es5.js", (test: mdfs.MdFsTest) => {
  const t = transpile(test)
  return t.es5
},
)

mdfs.describe(__dirname + "/sample", "es5.js", (test: mdfs.MdFsTest) => {
  const t = transpile(test)
  return t.es5
},
  (test, folder) => {
    return [(test ? test.mdfs.title : folder), " (applying assertion function)"].join("")
  },
)

mdfs.describe(__dirname + "/sample", "es5.js",
  (test: mdfs.MdFsTest) => {
    const t = transpile(test)
    return t.es5
  },
  (test: mdfs.MdFsTest, folder: string) => {
    return (test ? test.mdfs.title : folder) + " (applying assertion function)"
  },
  (actual: any, expected: any, test: mdfs.MdFsTest) => {
    expect(actual).toEqual(expected)
  },
)

mdfs.describe(__dirname + "/sample", ["es5.js", "es5.map"],
  (test) => {
    const t = transpile(test)
    return {
      "es5.js": t.es5,
      "es5.map": t.map,
    }
  },
  (test, folder) => {
    return (test ? test.mdfs.title : folder) + " (applying assertion function in two results)"
  },
  (actual: any, expected: any) => {
    expect(actual["es5.js"]).toEqual(expected["es5.js"])
    const e = JSON.parse(expected["es5.map"])
    const a = actual["es5.map"]
    expect(a).toEqual(e)
  },
)

function transpile(test: mdfs.MdFsTest) {
  const source = test.files["es6.js"]
  try {
    const out = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, sourceMap: true },
      reportDiagnostics: true,
    })
    const diagnostics = out && out.diagnostics
    if (!diagnostics) throw new Error("transpile out error")
    if (diagnostics.length) throw new Error("transpile error")
    const map = JSON.parse(out.sourceMapText || "{}")
    return {
      es5: out.outputText.replace("//# sourceMappingURL=module.js.map", "").trim(),
      map: {
        version: map.version,
        mappings: map.mappings,
        file: test.mdfs.file,
      },
    }
  } catch (e) {
    throw new Error("transpile error: " + e.message)
  }
}
