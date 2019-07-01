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

  console.log("Birthing in spawncreeptypes");

  if (!s1.room.lookForAt(LOOK_CREEPS, s1.pos.x + 1, s1.pos.y + 1).pop()) {
    retval = Game.spawns.Spawn1.spawnCreep(parts, name, {
      memory: {
        role: chosenRole,
        direction: direction,
        sourceId: sourceId,
      },
      directions: spawnDirection,
    });
  } else {
    retval = Game.spawns.Spawn1.spawnCreep(parts, name, {
      memory: { role: chosenRole, direction: direction, sourceId: sourceId },
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

  // 1200
  let upContrParts = [];
  addPart(upContrParts, 10, CARRY);
  addPart(upContrParts, 5, WORK);
  addPart(upContrParts, 4, MOVE);

  // 1200
  let southHvParts = [];
  addPart(southHvParts, 1, CARRY);
  addPart(southHvParts, 8, WORK);
  addPart(southHvParts, 7, MOVE);

  // 1200
  let newhvParts = [];
  addPart(newhvParts, 3, CARRY);
  addPart(newhvParts, 7, WORK);
  addPart(newhvParts, 7, MOVE);

  // 1200
  let workerParts = [];
  addPart(workerParts, 4, CARRY);
  addPart(workerParts, 6, WORK);
  addPart(workerParts, 8, MOVE);

  // 1200
  let repairerParts = [];
  addPart(repairerParts, 4, CARRY);
  addPart(repairerParts, 7, WORK);
  addPart(repairerParts, 6, MOVE);

  // 300
  let linkGetsParts = [];
  addPart(linkGetsParts, 1, CARRY);
  addPart(linkGetsParts, 2, WORK);
  addPart(linkGetsParts, 1, MOVE);

  let rezzyParts = [CLAIM, MOVE];
  let basicHv = [CARRY, WORK, MOVE];
  let simpleParts = [CARRY, CARRY, CARRY, WORK, MOVE];

  let eAttackerId = Memory.eAttackerId;
  let wAttackerId = Memory.wAttackerId;
  let nAttackerId = Memory.nAttackerId;
  let invaderId = Memory.invaderId;

  if (enAvail >= 300) {
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
      birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (linkGets.length < 2 && Game.creeps.harvester1) {
      chosenRole = "linkGet";
      name = "link" + t;
      parts = linkGetsParts;
      linkGets.push(name);
      birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (
      northHarvesters.length < 2 &&
      (!nAttackerId || Game.time >= nAttackDurationSafeCheck)
    ) {
      name += "N";
      direction = "north";
      northHarvesters.push(name);
      birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (
      westHarvesters.length < 2 &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      name += "W";
      direction = "west";
      westHarvesters.push(name);
      birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (
      eastHarvesters.length < 1 &&
      (!eAttackerId || Game.time >= eAttackDurationSafeCheck)
    ) {
      name += "E";
      direction = "east";
      eastHarvesters.push(name);
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
  }

  // Roster
  if (enAvail >= 1200) {
    let t = Game.time.toString().slice(4);
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";
    let waitForRezzy = false;
    let sourceId = Memory.source2;
    let parts = newhvParts;
    let spawnDirection = [BOTTOM_RIGHT];
    let birth = false;

    if (southHarvesters.length < 3) {
      southHarvesters.push(name);
      parts = southHvParts;
      birth = true;
    } else if (linkGets.length < 2 && Game.creeps.harvester1) {
      chosenRole = "linkGet";
      name = "link" + t;
      parts = linkGetsParts;
      linkGets.push(name);
      birth = true;
    } else if (roadRepairers.length < 1) {
      chosenRole = "r";
      name = chosenRole + t;
      parts = repairerParts;
      roadRepairers.push(name);
      birth = true;
    } else if (workers.length < 2) {
      chosenRole = "w";
      name = chosenRole + t;
      parts = workerParts;
      workers.push(name);
      birth = true;
    } else if (
      northHarvesters.length < 4 &&
      (!nAttackerId || Game.time >= nAttackDurationSafeCheck)
    ) {
      name += "N";
      direction = "north";
      northHarvesters.push(name);
      birth = true;
    } else if (
      westHarvesters.length < 4 &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      name += "west";
      direction = "west";
      westHarvesters.push(name);
      birth = true;
    } else if (
      northHarvesters.length < 6 &&
      (!nAttackerId || Game.time >= nAttackDurationSafeCheck)
    ) {
      name += "N";
      direction = "north";
      northHarvesters.push(name);
      birth = true;
    } else if (
      westHarvesters.length < 6 &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      name += "W";
      direction = "west";
      westHarvesters.push(name);
      birth = true;
    } else if (workers.length < 3) {
      chosenRole = "w";
      name = chosenRole + t;
      parts = workerParts;
      workers.push(name);
      birth = true;
    } else if (roadRepairers.length < 3) {
      chosenRole = "r";
      name = chosenRole + t;
      parts = repairerParts;
      roadRepairers.push(name);
      birth = true;
    } else if (
      !Game.creeps.eastRezzy &&
      (!eAttackerId || Game.time >= eAttackDurationSafeCheck)
    ) {
      waitForRezzy = true;
      chosenRole = "eastRezzy";
      name = chosenRole;
      direction = "east";
      parts = upContrParts;
      birth = true;
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
        birth = true;
      }
    } else if (
      !Game.creeps.westRezzy &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      waitForRezzy = true;
      chosenRole = "westRezzy";
      name = chosenRole;
      direction = "west";
      parts = rezzyParts;
      birth = true;
    }

    if ((!waitForRezzy || numCrps < 10 || name.endsWith("Rezzy")) && birth) {
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
  }

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
