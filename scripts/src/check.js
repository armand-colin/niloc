const { execSync } = require("child_process")

const { getOrderedPackages } = require("./packages")

// function that runs over all the packages and runs "yarn build" to detect typescript issues
function check() {
    for (const package of getOrderedPackages()) {
        console.log(`Checking ${package.name}`)
        execSync(`cd ../${package.name} && yarn && yarn build`, { })
    }
}

check()