const packages = [
    {
        name: "utils",
    },
    {
        name: "niloc-core",
        requires: ["utils"]
    },
    {
        name: "niloc-decorators",
        requires: ["niloc-core"]
    },
    {
        name: "niloc-socketio-client",
        requires: ["niloc-core"]
    },
    {
        name: "niloc-socketio-server",
        requires: ["niloc-core"]
    },
    {
        name: "niloc-webrtc",
        requires: ["niloc-core"]
    },
    {
        name: "niloc-signaling-client",
        requires: ["niloc-core"]
    },
    {
        name: "niloc-signaling-server",
        requires: ["niloc-core"]
    },
]

// Gets the packages in order, so that the dependencies are built first
function getOrderedPackages() {
    const orderedPackages = []
    const packagesToCheck = [...packages]

    while (packagesToCheck.length > 0) {
        const pkg = packagesToCheck.shift()
        if (pkg.requires) {
            const missingDependencies = pkg.requires.filter(r => !orderedPackages.find(p => p.name === r))
            if (missingDependencies.length > 0) {
                packagesToCheck.push(pkg)
                continue
            }
        }

        orderedPackages.push(pkg)
    }

    return orderedPackages
}

module.exports = { getOrderedPackages }