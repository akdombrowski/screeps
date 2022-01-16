const profiler = require("./screeps-profiler");

function getRoomTerrainCosts(roomName, roomDirection) {
  let costs = Memory[roomDirection + "TerrainCosts"];
  if (!costs) {
    const terrain = Game.rooms[roomName].getTerrain();
    costs = new PathFinder.CostMatrix();

    for (let y = 0; y < 50; y++) {
      for (let x = 0; x < 50; x++) {
        const tile = terrain.get(x, y);
        const weight =
          tile === TERRAIN_MASK_WALL
            ? 0xff // wall  => unwalkable
            : tile === TERRAIN_MASK_SWAMP
            ? 11 // swamp => weight:  11
            : 2; // plain => weight:  2
        costs.set(x, y, weight);
      }
    }

    Memory[roomDirection + "TerrainCosts"] = costs.serialize();
  } else {
    costs = PathFinder.CostMatrix.deserialize(
      Memory[roomDirection + "TerrainCosts"]
    );
  }

  return costs;
}
module.exports = getRoomTerrainCosts;
getRoomTerrainCosts = profiler.registerFN(
  getRoomTerrainCosts,
  "getRoomTerrainCosts"
);
