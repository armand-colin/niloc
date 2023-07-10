const { execSync } = require("child_process")

const { getOrderedPackages } = require("./packages")

// function that rns over all the packages and runs "yarn build" to detect typescript issues
function check() {
    for (const package of getOrderedPackages()) {
        if (!package.test) 
            continue
        console.log(`Testing ${package.name}`)
        execSync(`cd ../${package.name} && yarn && yarn test`, { })
    }
}

check()