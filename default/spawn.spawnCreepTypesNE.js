const spawnBackupCreeps = require("./spawnBackupCreeps");

function addPart(arr, count, part) {
  for (let i = 0; i < count; i++) {
    arr.push(part);
  }
}

function birthCreep(
  s2,
  parts,
  name,
  chosenRole,
  direction,
  sourceId,
  sourceDir,
  buildRoom,
  spawnDirection
) {
  let retval;
  s2 = Game.spawns.spawnNE;
  if (!s2.room.lookForAt(LOOK_CREEPS, s2.pos.x, s2.pos.y + 1)) {
    retval = s2.spawnCreep(parts, name, {
      memory: {
        role: chosenRole,
        direction: direction,
        sourceId: sourceId,
        sourceDir: sourceDir,
        buildRoom: buildRoom,
      },
      directions: spawnDirection,
    });
  } else {
    retval = s2.spawnCreep(parts, name, {
      memory: {
        role: chosenRole,
        direction: direction,
        sourceId: sourceId,
        sourceDir: sourceDir,
        buildRoom: buildRoom,
      },
    });
  }

  if (retval == OK) {
    console.log("spawnedNE." + name);
  }
  return retval;
}

function spawnCreepTypes(enAvail) {
  let linkGets = Memory.linkGets || [];
  let workers = Memory.workers || [];
  let eworkers = Memory.eworkers || [];
  let neworkers = Memory.neworkers || [];

  let harvesters = Memory.harvesters || [];
  let upControllers = Memory.upControllers || [];
  let roadRepairers = Memory.roadRepairers || [];
  let roadRepairersNE = Memory.roadRepairersNE || [];
  let harvestersN = Memory.harvestersN || [];
  let westHarvesters = Memory.westHarvesters || [];

  let eastHarvesters = Memory.eastHarvesters || [];
  let workersNE = Memory.eastWorkers || [];
  let upControllersNE = Memory.eastUpControllers || [];
  let ermHarvesters = Memory.ermHarvesters || [];
  let harvestersNE = Memory.ermNeHarvesters || [];
  let towerHarvestersNE = Memory.etowerHarvesters || [];
  let eeUps = Memory.eeUps || [];

  let claimers = Memory.claimers || [];
  let eAttackDurationSafeCheck = Memory.eAttackDurationSafeCheck;
  let nAttackDurationSafeCheck = Memory.nAttackDurationSafeCheck;
  let sAttackDurationSafeCheck = Memory.sAttackDurationSafeCheck;
  let wAttackDurationSafeCheck = Memory.wAttackDurationSafeCheck;

  let crps = Game.creeps;
  let numCrps = Object.keys(crps).length;

  let s2 = Game.spawns.s2;

  let attackers = Memory.attackers || [];
  let attackersNE = Memory.eattackers || [];

  // 300
  let upContrParts = [];
  addPart(upContrParts, 1, CARRY);
  addPart(upContrParts, 2, WORK);
  addPart(upContrParts, 1, MOVE);

  // 290
  let attackerParts = [];
  addPart(attackerParts, 3, ATTACK);
  addPart(attackerParts, 1, MOVE);

  // 800
  let medupContrParts = [];
  addPart(medupContrParts, 1, CARRY);
  addPart(medupContrParts, 7, WORK);
  addPart(medupContrParts, 1, MOVE);

  // 800
  let medsouthHvParts = [];
  addPart(medsouthHvParts, 1, CARRY);
  addPart(medsouthHvParts, 6, WORK);
  addPart(medsouthHvParts, 3, MOVE);

  // 800
  let mednewhvParts = [];
  addPart(mednewhvParts, 1, CARRY);
  addPart(mednewhvParts, 5, WORK);
  addPart(mednewhvParts, 5, MOVE);

  // 800
  let medworkerParts = [];
  addPart(medworkerParts, 1, CARRY);
  addPart(medworkerParts, 7, WORK);
  addPart(medworkerParts, 1, MOVE);

  // 800
  let medrepairerParts = [];
  addPart(medrepairerParts, 1, CARRY);
  addPart(medrepairerParts, 4, WORK);
  addPart(medrepairerParts, 7, MOVE);

  // 800
  let medlinkGetsParts = [];
  addPart(medlinkGetsParts, 1, CARRY);
  addPart(medlinkGetsParts, 6, WORK);
  addPart(medlinkGetsParts, 3, MOVE);

  // 1100
  let southHvParts = [];
  addPart(southHvParts, 1, CARRY);
  addPart(southHvParts, 9, WORK);
  addPart(southHvParts, 3, MOVE);

  // 800
  let attackerMedParts = [];
  addPart(attackerMedParts, 8, ATTACK);
  addPart(attackerMedParts, 3, MOVE);

  // 1100
  let newhvParts = [];
  addPart(newhvParts, 1, CARRY);
  addPart(newhvParts, 7, WORK);
  addPart(newhvParts, 7, MOVE);

  // 1100
  let workerParts = [];
  addPart(workerParts, 1, CARRY);
  addPart(workerParts, 9, WORK);
  addPart(workerParts, 3, MOVE);

  // 1100
  let repairerParts = [];
  addPart(repairerParts, 1, CARRY);
  addPart(repairerParts, 6, WORK);
  addPart(repairerParts, 9, MOVE);

  // 1100
  let linkGetsParts = [];
  addPart(linkGetsParts, 1, CARRY);
  addPart(linkGetsParts, 9, WORK);
  addPart(linkGetsParts, 3, MOVE);

  let rezzyParts = [CLAIM, MOVE];
  let basicHv = [CARRY, WORK, WORK, MOVE];
  let simpleParts = [CARRY, WORK, WORK, MOVE];

  let eAttackerId = Memory.eAttackerId;
  let wAttackerId = Memory.wAttackerId;
  let nAttackerId = Memory.nAttackerId;
  let neAttackerId = Memory.neAttackerId;
  let invaderId = Memory.invaderId;

  if (enAvail >= 300) {
    let t = Game.time.toString().slice(4);
    let name = "h" + t + "NE";
    let chosenRole = "h";
    let direction = "ne";
    let parts = upContrParts;
    let spawnDirection = [BOTTOM];
    let sourceId = "";
    let sourceDir = "";
    let birth = false;
    let buildRoom = "";

    if (ermHarvesters.length < 2) {
      ermHarvesters.push(name);
      parts = basicHv;
      sourceDir = "east";
      birth = true;
    } else if (upControllersNE.length < 1) {
      chosenRole = "upCNE";
      name = chosenRole + t;
      direction = "ne";
      parts = simpleParts;
      upControllersNE.push(name);
      birth = true;
    } else if (neworkers.length < 1) {
      eworkers.push(name);
      chosenRole = "neBuilder";
      buildRoom = "E36N32";
      name = chosenRole + t;
      parts = simpleParts;
      birth = true;
    } else if (roadRepairersNE.length < 2 && !neAttackerId) {
      roadRepairersNE.push(name);
      chosenRole = "rNE";
      name = "r" + t + "NE";
      parts = basicHv;
      sourceDir = "north2";
      birth = true;
    }
    // } else if (eeUps.length < 2) {
    //   chosenRole = "eeUp";
    //   name = chosenRole + t;
    //   direction = "ee";
    //   parts = simpleParts;
    //   eeUps.push(name);
    //   birth = true;
    // }
    else if (attackersNE.length < 1 && neAttackerId) {
      console.log(
        "neattacker " +
          Memory.neAttackerId +
          " " +
          attackersNE.length +
          " " +
          enAvail
      );
      parts = attackerParts;
      name = "eatt" + t;
      chosenRole = "attacker";
      direction = "ne";
      birth = true;
      attackersNE.push(name);
    } else if (harvestersNE.length < 1 && !neAttackerId) {
      harvestersNE.push(name);
      name = "h" + t + "NE";
      parts = basicHv;
      sourceDir = "north2";
      birth = true;
    } else {
      neworkers.push(name);
      chosenRole = "neBuilder";
      buildRoom = "E36N32";
      name = chosenRole + t;
      parts = simpleParts;
      birth = true;
    }

    if (birth) {
      console.log(
        name +
          " role birth: " +
          birthCreep(
            s2,
            parts,
            name,
            chosenRole,
            direction,
            sourceId,
            sourceDir,
            buildRoom,
            spawnDirection
          )
      );
    }
  }

  if (enAvail >= 800) {
    let t = Game.time.toString().slice(4);
    let name = "h" + t + "NE";
    let chosenRole = "h";
    let direction = "ne";
    let parts = mednewhvParts;
    let spawnDirection = [BOTTOM];
    let sourceId = "";
    let sourceDir = "eeast";
    let birth = false;
    let buildRoom = "E36N32";

    if (attackersNE.length < 2 && neAttackerId) {
      parts = attackerMedParts;
      name = "eatt" + t;
      chosenRole = "attacker";
      direction = "ne";
      attackersNE.push(name);
      birth = true;
    } else if (upControllersNE.length < 2) {
      chosenRole = "upCNE";
      name = chosenRole + t;
      direction = "ne";
      parts = medupContrParts;
      upControllersNE.push(name);
      birth = true;
    } else if (harvestersNE.length < 4 && !neAttackerId) {
      harvestersNE.push(name);
      name = "h" + t + "NE";
      parts = mednewhvParts;
      sourceDir = "north1";
      birth = true;
    } else if (towerHarvestersNE.length < 2) {
      chosenRole = "netowerHarvester";
      name = chosenRole + t;
      towerHarvestersNE.push(name);
      parts = mednewhvParts;
      sourceDir = "east1";
      birth = true;
    } else if (neworkers.length < 3) {
      neworkers.push(name);
      chosenRole = "neBuilder";
      buildRoom = "E36N32";
      name = chosenRole + t;
      parts = medworkerParts;
      birth = true;
    } else if (workers.length < 2) {
      chosenRole = "worker";
      name = chosenRole + t;
      workers.push(name);
      parts = medworkerParts;
      birth = true;
    } else if (upControllersNE.length < 3) {
      chosenRole = "upCNE";
      name = chosenRole + t;
      direction = "ne";
      parts = medupContrParts;
      upControllersNE.push(name);
      birth = true;
    } else {
      harvestersNE.push(name);
      parts = mednewhvParts;
      sourceDir = "east";
      birth = true;
    }

    if (birth) {
      console.log(
        name +
          " role birth: " +
          birthCreep(
            s2,
            parts,
            name,
            chosenRole,
            direction,
            sourceId,
            sourceDir,
            buildRoom,
            spawnDirection
          )
      );
    }
  }

  if (enAvail >= 1100) {
    let t = Game.time.toString().slice(4);
    let name = "h" + t + "NE";
    let chosenRole = "h";
    let direction = "ne";
    let parts = mednewhvParts;
    let spawnDirection = [BOTTOM];
    let sourceId = "";
    let sourceDir = "";
    let buildRoom = "E36N32";

    if (attackersNE.length < 3 && Memory.neAttackerId) {
      parts = attackerBigParts;
      name = "eatt" + t;
      chosenRole = "attacker";
      direction = "ne";
      attackersNE.push(name);
      birth = true;
    } else if (harvestersNE.length < 6) {
      harvestersNE.push(name);
      parts = mednewhvParts;
      sourceDir = "north";
    } else if (upControllersNE.length < 3) {
      chosenRole = "eRezzy";
      name = chosenRole + t;
      parts = medworkerParts;
      upControllersNE.push(name);
    } else if (workers.length < 3) {
      chosenRole = "worker";
      name = chosenRole + t;
      workersNE.push(name);
      parts = medworkerParts;
    }
    birthCreep(
      s2,
      parts,
      name,
      chosenRole,
      direction,
      sourceId,
      sourceDir,
      buildRoom,
      spawnDirection
    );
  }

  Memory.harvesters = harvesters;
  Memory.workers = workers;
  Memory.eworkers = eworkers;
  Memory.neworkers = neworkers;
  Memory.upControllers = upControllers;
  Memory.roadRepairers = roadRepairers;
  Memory.roadRepairersNE = roadRepairersNE;
  Memory.attackers = attackers;
  Memory.claimers = claimers;
  Memory.harvestersN = harvestersN;
  Memory.westHarvesters = westHarvesters;
  Memory.linkGets = linkGets;

  Memory.attackersNE = attackersNE;
  Memory.eastHarvesters = eastHarvesters;
  Memory.eastWorkers = workersNE;
  Memory.upControllersNE = upControllersNE;
  Memory.ermHarvesters = ermHarvesters;
  Memory.harvestersNE = harvestersNE;
  Memory.towerHarvestersNE = towerHarvestersNE;
}

module.exports = spawnCreepTypes;
