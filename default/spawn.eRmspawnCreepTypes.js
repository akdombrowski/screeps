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
  s2 = Game.getObjectById(Memory.s2);
  if (!s2.room.lookForAt(LOOK_CREEPS, s2.pos.x, s2.pos.y - 1)) {
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
    console.log("spawnedE." + name);
  }
  return retval;
}

function spawnCreepTypes(enAvail) {
  let linkGets = Memory.linkGets || [];
  let workers = Memory.workers || [];
  let eworkers = Memory.eworkers || [];
  let neworkers = Memory.neworkers || [];
  let erepairers = Memory.erepairers || [];

  let harvesters = Memory.harvesters || [];
  let upControllers = Memory.upControllers || [];
  let upControllersE = Memory.upControllersE || [];
  let upControllersNE = Memory.upControllersNE || [];
  let roadRepairers = Memory.roadRepairers || [];
  let harvestersN = Memory.harvestersN || [];
  let westHarvesters = Memory.westHarvesters || [];

  let eastHarvesters = Memory.eastHarvesters || [];
  let ermHarvesters = Memory.ermHarvesters || [];
  let harvestersNE = Memory.harvestersNE || [];
  let etowerHarvesters = Memory.etowerHarvesters || [];
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
  let eattackers = Memory.eattackers || [];

  // 300
  let upContrParts = [];
  addPart(upContrParts, 3, CARRY);
  addPart(upContrParts, 1, WORK);
  addPart(upContrParts, 1, MOVE);

  // 290
  let attackerParts = [];
  addPart(attackerParts, 3, ATTACK);
  addPart(attackerParts, 1, MOVE);

  // 800
  let medupContrParts = [];
  addPart(medupContrParts, 13, CARRY);
  addPart(medupContrParts, 1, WORK);
  addPart(medupContrParts, 1, MOVE);

  // 800
  let medsouthHvParts = [];
  addPart(medsouthHvParts, 7, CARRY);
  addPart(medsouthHvParts, 1, WORK);
  addPart(medsouthHvParts, 7, MOVE);

  // 800
  let mednewhvParts = [];
  addPart(mednewhvParts, 6, CARRY);
  addPart(mednewhvParts, 1, WORK);
  addPart(mednewhvParts, 8, MOVE);

  // 800
  let medworkerParts = [];
  addPart(medworkerParts, 7, CARRY);
  addPart(medworkerParts, 1, WORK);
  addPart(medworkerParts, 7, MOVE);

  // 800
  let medrepairerParts = [];
  addPart(medrepairerParts, 5, CARRY);
  addPart(medrepairerParts, 1, WORK);
  addPart(medrepairerParts, 9, MOVE);

  // 800
  let medlinkGetsParts = [];
  addPart(medlinkGetsParts, 1, CARRY);
  addPart(medlinkGetsParts, 6, WORK);
  addPart(medlinkGetsParts, 3, MOVE);

  // 800
  let attackerMedParts = [];
  addPart(attackerMedParts, 5, ATTACK);
  addPart(attackerMedParts, 8, MOVE);

  // 2000
  let southHvParts = [];
  addPart(southHvParts, 18, CARRY);
  addPart(southHvParts, 1, WORK);
  addPart(southHvParts, 20, MOVE);

  // 2000
  let newhvParts = [];
  addPart(newhvParts, 18, CARRY);
  addPart(newhvParts, 1, WORK);
  addPart(newhvParts, 20, MOVE);

  // 2000
  let workerParts = [];
  addPart(workerParts, 17, CARRY);
  addPart(workerParts, 1, WORK);
  addPart(workerParts, 21, MOVE);

  // 2000
  let repairerParts = [];
  addPart(repairerParts, 17, CARRY);
  addPart(repairerParts, 1, WORK);
  addPart(repairerParts, 21, MOVE);

  // 2000
  let linkGetsParts = [];
  addPart(linkGetsParts, 5, CARRY);
  addPart(linkGetsParts, 9, WORK);
  addPart(linkGetsParts, 17, MOVE);

  let rezzyParts = [CLAIM, MOVE];
  let basicHv = [CARRY, WORK, WORK, MOVE];
  let simpleParts = [CARRY, WORK, WORK, MOVE];

  let eAttackerId = Memory.eAttackerId;
  let wAttackerId = Memory.wAttackerId;
  let nAttackerId = Memory.nAttackerId;
  let neAttackerId = Memory.neAttackerId;
  let invaderId = Memory.invaderId;

  if (Memory.eAttackerId) {
    return;
  }

  if (enAvail >= 300) {
    let t = Game.time.toString().slice(4);
    let name = "h" + t + "E";
    let chosenRole = "h";
    let direction = "east";
    let parts = upContrParts;
    let spawnDirection = [TOP];
    let sourceId = "";
    let sourceDir = "east";
    let birth = false;
    let buildRoom = "";

    if (ermHarvesters.length < 2) {
      ermHarvesters.push(name);
      parts = basicHv;
      sourceDir = "east";
      birth = true;
    } else if (upControllersE.length < 1) {
      chosenRole = "eRezzy";
      name = chosenRole + t;
      direction = "east";
      parts = simpleParts;
      upControllersE.push(name);
      birth = true;
    } else if (upControllersNE.length < 1) {
      chosenRole = "upCNE";
      name = chosenRole + t;
      direction = "ne";
      parts = simpleParts;
      upControllersNE.push(name);
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
    else if (eattackers.length < 1 && neAttackerId) {
      console.log(
        "neattacker " +
          Memory.neAttackerId +
          " " +
          eattackers.length +
          " " +
          enAvail
      );
      parts = attackerParts;
      name = "eatt" + t;
      chosenRole = "attacker";
      direction = "ne";
      birth = true;
      eattackers.push(name);
    }

    if (birth) {
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
  }

  if (enAvail >= 2000) {
    let t = Game.time.toString().slice(4);
    let name = "h" + t + "E";
    let chosenRole = "h";
    let direction = "e";
    let parts = newhvParts;
    let spawnDirection = [TOP];
    let sourceId = "";
    let sourceDir = "east";
    let buildRoom = "E36N31";

    if (eattackers.length < 1 && Memory.neAttackerId) {
      parts = attackerBigParts;
      name = "eatt" + t;
      chosenRole = "attacker";
      direction = "ne";
      eattackers.push(name);
      birth = true;
    } else if (harvestersNE.length < 3) {
      name = "h" + t + "NE";
      chosenRole = "h";
      direction = "ne";
      harvestersNE.push(name);
      parts = newhvParts;
      sourceDir = "north";
    } else if (etowerHarvesters.length < 2) {
      name = "eth" + t;
      chosenRole = "etowerHarvester";
      direction = "east";
      etowerHarvesters.push(name);
      parts = southHvParts;
      sourceDir = "east";
    } else if (neworkers.length < 3) {
      neworkers.push(name);
      chosenRole = "neBuilder";
      buildRoom = "E36N32";
      name = chosenRole + t;
      parts = workerParts;
      birth = true;
    } else if (eworkers.length < 3) {
      eworkers.push(name);
      chosenRole = "eBuilder";
      buildRoom = "E36N31";
      name = chosenRole + t;
      parts = workerParts;
      birth = true;
    } else if (upControllersE.length < 2) {
      chosenRole = "eRezzy";
      name = chosenRole + t;
      parts = medworkerParts;
      upControllersE.push(name);
    } else if (upControllersNE.length < 3) {
      chosenRole = "upCNE";
      name = chosenRole + t;
      parts = medworkerParts;
      upControllersNE.push(name);
    } else if (eworkers.length < 3) {
      chosenRole = "eworker";
      buildRoom = "E36N31";
      name = chosenRole + t;
      eworkers.push(name);
      parts = workerParts;
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
  Memory.erepairers = erepairers;
  Memory.upControllers = upControllers;
  Memory.upControllersE = upControllersE;
  Memory.upControllersNE = upControllersNE;
  Memory.roadRepairers = roadRepairers;
  Memory.attackers = attackers;
  Memory.claimers = claimers;
  Memory.harvestersN = harvestersN;
  Memory.westHarvesters = westHarvesters;
  Memory.linkGets = linkGets;

  Memory.eattackers = eattackers;
  Memory.eastHarvesters = eastHarvesters;
  Memory.ermHarvesters = ermHarvesters;
  Memory.harvestersNE = harvestersNE;
  Memory.etowerHarvesters = etowerHarvesters;
  Memory.eeUps = eeUps;
}

module.exports = spawnCreepTypes;
