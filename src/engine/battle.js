function getTurnOrder(creatures) {
    return creatures.sort((a, b) => b.speed - a.speed)
}