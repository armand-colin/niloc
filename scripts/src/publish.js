const { execSync } = require("child_process")

const { getOrderedPackages } = require("./packages")

function publish(packages) {
    for (const package of packages) {
        console.log(`Publishing ${package}`)
        try {
            execSync(`cd ../${package} && yarn && yarn build && yarn publish`, { })
        } catch (e) {
            console.log(`Failed to publish ${package}`)
        }
    }
}

function help() {
    console.log("Usage: yarn run publish [--all|-a] [package1] [package2] ...")
    console.log("Publishes the specified packages to npm. If --all or -a is specified, all packages are published.")
    process.exit(0)
}

if (process.argv[2]  === "--help" || process.argv[2] === "-h") {
    help()
}

if (process.argv.length < 3) {
    help()
}

if (process.argv[2] === "--all" || process.argv[2] === "-a") {
    publish(getOrderedPackages().map(package => package.name))
} else {
    publish(process.argv.slice(2))
}