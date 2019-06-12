const spawnBackupCreeps = require("./spawnBackupCreeps");

function addPart(arr, count, part) {
  for (let i = 0; i < count; i++) {
    arr.push(part);
  }
}

function birthCreep(
  s1,
  parts,
  name,
  chosenRole,
  direction,
  sourceId,
  spawnDirection
) {
  let retval;
  if (s1.room.lookForAt(LOOK_CREEPS, s1.pos.x + 1, s1.pos.y + 1)) {
    retval = Game.spawns.Spawn1.spawnCreep(parts, name, {
      memory: {
        role: chosenRole,
        direction: direction,
        sourceId: sourceId
      },
      directions: spawnDirection
    });
  } else {
    retval = Game.spawns.Spawn1.spawnCreep(parts, name, {
      memory: { role: chosenRole, direction: direction, sourceId: sourceId }
    });
  }

  if (retval == OK) {
    console.log("spawned." + name);
  }
}

function spawnCreepTypes(enAvail) {
  let linkGets = Memory.linkGets || [];
  let workers = Memory.workers || [];
  let harvesters = Memory.harvesters || [];
  let upControllers = Memory.upControllers || [];
  let roadRepairers = Memory.roadRepairers || [];
  let northHarvesters = Memory.northHarvesters || [];
  let westHarvesters = Memory.westHarvesters || [];
  let southHarvesters = Memory.southHarvesters || [];
  let eastHarvesters = Memory.eastHarvesters || [];
  let claimers = Memory.claimers || [];
  let eAttackDurationSafeCheck = Memory.eAttackDurationSafeCheck;
  let nAttackDurationSafeCheck = Memory.nAttackDurationSafeCheck;
  let sAttackDurationSafeCheck = Memory.sAttackDurationSafeCheck;
  let wAttackDurationSafeCheck = Memory.wAttackDurationSafeCheck;

  let crps = Game.creeps;
  let numCrps = Object.keys(crps).length;

  let s1 = Game.spawns.Spawn1;

  let attackers = Memory.attackers || [];

  // 1100
  let upContrParts = [];
  addPart(upContrParts, 1, CARRY);
  addPart(upContrParts, 7, WORK);
  addPart(upContrParts, 7, MOVE);

  // 1100
  let southHvParts = [];
  addPart(southHvParts, 1, CARRY);
  addPart(southHvParts, 6, WORK);
  addPart(southHvParts, 9, MOVE);

  // 1100
  let newhvParts = [];
  addPart(newhvParts, 2, CARRY);
  addPart(newhvParts, 7, WORK);
  addPart(newhvParts, 6, MOVE);

  // 1100
  let workerParts = [];
  addPart(workerParts, 2, CARRY);
  addPart(workerParts, 6, WORK);
  addPart(workerParts, 8, MOVE);

  // 1100
  let repairerParts = [];
  addPart(repairerParts, 2, CARRY);
  addPart(repairerParts, 5, WORK);
  addPart(repairerParts, 10, MOVE);

  // 1100
  let linkGetsParts = [];
  addPart(linkGetsParts, 2, CARRY);
  addPart(linkGetsParts, 9, WORK);
  addPart(linkGetsParts, 2, MOVE);

  let rezzyParts = [CLAIM, MOVE];
  let basicHv = [CARRY, WORK, MOVE];
  let simpleParts = [CARRY, WORK, WORK, MOVE];

  let eAttackerId = Memory.eAttackerId;
  let wAttackerId = Memory.wAttackerId;
  let nAttackerId = Memory.nAttackerId;
  let invaderId = Memory.invaderId;

  if (enAvail >= 300 && Memory.harvesters.length < 5) {
    let t = Game.time.toString().slice(4);
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = simpleParts;
    let spawnDirection = [BOTTOM_RIGHT];

    if (southHarvesters.length < 2) {
      southHarvesters.push(name);
      parts = simpleParts;
    } else if (
      eastHarvesters.length < 2 &&
      (!eAttackerId || Game.time >= eAttackDurationSafeCheck)
    ) {
      name += "east";
      direction = "east";
      eastHarvesters.push(name);
    } else if (
      northHarvesters.length < 2 &&
      (!nAttackerId || Game.time >= nAttackDurationSafeCheck)
    ) {
      name += "north";
      direction = "north";
      northHarvesters.push(name);
    } else if (
      westHarvesters.length < 2 &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      name += "west";
      direction = "west";
      westHarvesters.push(name);
    }

    birthCreep(
      s1,
      parts,
      name,
      chosenRole,
      direction,
      sourceId,
      spawnDirection
    );
  }

  // Roster
  if (enAvail >= 1100) {
    let t = Game.time.toString().slice(4);
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";
    let waitForRezzy = false;
    let sourceId = Memory.source2;
    let parts = newhvParts;
    let spawnDirection = [BOTTOM_RIGHT];

    if (southHarvesters.length < 2) {
      southHarvesters.push(name);
      parts = southHvParts;
    } else if (
      !Game.creeps.eastRezzy &&
      (!eAttackerId || Game.time >= eAttackDurationSafeCheck)
    ) {
      waitForRezzy = true;
      if (enAvail >= 650) {
        chosenRole = "eastRezzy";
        name = chosenRole;
        direction = "east";
        parts = rezzyParts;
      }
    } else if (
      !Game.creeps.northRezzy &&
      (!nAttackerId || Game.time >= eAttackDurationSafeCheck)
    ) {
      waitForRezzy = true;
      if (enAvail >= 650) {
        chosenRole = "northRezzy";
        name = chosenRole;
        direction = "north";
        parts = rezzyParts;
      }
    } else if (
      !Game.creeps.westRezzy &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      waitForRezzy = true;
      if (enAvail >= 650) {
        chosenRole = "westRezzy";
        name = chosenRole;
        direction = "west";
        parts = rezzyParts;
      }
    } else if (linkGets.length < 3) {
      chosenRole = "linkGet";
      name = chosenRole + t;
      parts = linkGetsParts;
      linkGets.push(name);
    } else if (
      eastHarvesters.length < 3 &&
      (!eAttackerId || Game.time >= eAttackDurationSafeCheck)
    ) {
      name += "east";
      direction = "east";
      eastHarvesters.push(name);
    } else if (
      northHarvesters.length < 3 &&
      (!nAttackerId || Game.time >= nAttackDurationSafeCheck)
    ) {
      name += "north";
      direction = "north";
      northHarvesters.push(name);
    } else if (
      westHarvesters.length < 3 &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      name += "west";
      direction = "west";
      westHarvesters.push(name);
    } else if (roadRepairers.length < 1) {
      chosenRole = "r";
      name = chosenRole + t;
      parts = repairerParts;
      roadRepairers.push(name);
    } else if (workers.length < 4) {
      chosenRole = "w";
      name = chosenRole + t;
      parts = workerParts;
      workers.push(name);
    } else if (
      eastHarvesters.length < 9 &&
      (!eAttackerId || Game.time >= eAttackDurationSafeCheck)
    ) {
      name += "east";
      direction = "east";
      eastHarvesters.push(name);
    } else if (
      northHarvesters.length < 9 &&
      (!nAttackerId || Game.time >= nAttackDurationSafeCheck)
    ) {
      name += "north";
      direction = "north";
      northHarvesters.push(name);
    } else if (
      westHarvesters.length < 9 &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      name += "west";
      direction = "west";
      westHarvesters.push(name);
    } else if (roadRepairers.length < 3) {
      chosenRole = "r";
      name = chosenRole + t;
      parts = repairerParts;
      roadRepairers.push(name);
    } else {
      chosenRole = "w";
      parts = workerParts;
      name = chosenRole + t;
      workers.push(name);
    }

    if (!waitForRezzy || numCrps < 10 || name.endsWith("Rezzy")) {
      birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else {
      console.log("wait for rezzy");
    }
  } else spawnBackupCreeps(harvesters, enAvail, basicHv);

  Memory.harvesters = harvesters;
  Memory.workers = workers;
  Memory.upControllers = upControllers;
  Memory.roadRepairers = roadRepairers;
  Memory.attackers = attackers;
  Memory.claimers = claimers;
  Memory.northHarvesters = northHarvesters;
  Memory.eastHarvesters = eastHarvesters;
  Memory.westHarvesters = westHarvesters;
  Memory.southHarvesters = southHarvesters;
  Memory.linkGets = linkGets;
}

module.exports = spawnCreepTypes;
