const { getOrderedPackages } = require("./packages")
const { readFileSync, writeFileSync } = require("fs")

function bump(level, packages) {
    for (const package of packages) {
        const json = JSON.parse(readFileSync(`../${package}/package.json`))

        const versions = json.version.split(".").map(x => parseInt(x, 10))

        switch (level) {
            case "major":
                versions[0]++;
                versions[1] = 0;
                versions[2] = 0;
                break
            case "minor":
                versions[1]++;
                versions[2] = 0;
                break
            case "patch":
                versions[2]++;
                break
            default:
                throw new Error(`Unknown version bump level ${level}`)
        }

        json.version = versions.join(".")
        console.log(`- ${json.name} bump to ${versions.join(".")}`)
        writeFileSync(`../${package}/package.json`, JSON.stringify(json, null, 4))
    }
}

function help() {
    console.log("Usage: yarn run bump [major|minor|patch] [--all|-a] [package1] [package2] ...")
    console.log("Bumps the specified packages to the specified version. If --all or -a is specified, all packages are bumped.")
    process.exit(0)
}

if (process.argv[2] === "--help" || process.argv[2] === "-h") {
    help()
}

if (process.argv.length < 4) {
    help()
}

if (!["major", "minor", "patch"].includes(process.argv[2])) {
    help()
}

if (process.argv[3] === "--all" || process.argv[3] === "-a") {
    bump(process.argv[2], getOrderedPackages().map(package => package.name))
} else {
    bump(process.argv[2], process.argv.slice(3))
}