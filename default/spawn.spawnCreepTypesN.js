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
  s2 = Game.spawns.spawnN;
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
    console.log("spawnedN." + name);
  }
  return retval;
}

function spawnCreepTypes(enAvail) {
  let linkGets = Memory.linkGets || [];
  let workers = Memory.workers || [];
  let eworkers = Memory.eworkers || [];
  let neworkers = Memory.neworkers || [];
  let nworkers = Memory.nworkers || [];

  let harvesters = Memory.harvesters || [];
  let upControllers = Memory.upControllers || [];
  let roadRepairers = Memory.roadRepairers || [];
  let roadRepairersN = Memory.roadRepairersN || [];
  let harvestersN = Memory.harvestersN || [];
  let westHarvesters = Memory.westHarvesters || [];

  let eastHarvesters = Memory.eastHarvesters || [];
  let upControllersN = Memory.eastUpControllers || [];
  let towerHarvestersN = Memory.towerHarvestersN || [];
  let eeUps = Memory.eeUps || [];

  let claimers = Memory.claimers || [];
  let eAttackDurationSafeCheck = Memory.eAttackDurationSafeCheck;
  let nAttackDurationSafeCheck = Memory.nAttackDurationSafeCheck;
  let sAttackDurationSafeCheck = Memory.sAttackDurationSafeCheck;
  let wAttackDurationSafeCheck = Memory.wAttackDurationSafeCheck;

  let crps = Game.creeps;
  let numCrps = Object.keys(crps).length;

  let s2 = Game.spawns.spawnN;

  let attackers = Memory.attackers || [];
  let attackersN = Memory.eattackers || [];

  // 300
  let upContrParts = [];
  addPart(upContrParts, 1, CARRY);
  addPart(upContrParts, 2, WORK);
  addPart(upContrParts, 1, MOVE);

  // 290
  let attackerParts = [];
  addPart(attackerParts, 3, ATTACK);
  addPart(attackerParts, 1, MOVE);

  // 500
  let hvParts500 = [];
  addPart(hvParts500, 4, CARRY);
  addPart(hvParts500, 1, WORK);
  addPart(hvParts500, 4, MOVE);

  // 500
  let rParts500 = [];
  addPart(rParts500, 3, CARRY);
  addPart(rParts500, 1, WORK);
  addPart(rParts500, 5, MOVE);

  // 500
  let workerParts500 = [];
  addPart(workerParts500, 2, CARRY);
  addPart(workerParts500, 2, WORK);
  addPart(workerParts500, 4, MOVE);

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

  // 1000
  let mednewhvParts = [];
  addPart(mednewhvParts, 5, CARRY);
  addPart(mednewhvParts, 5, WORK);
  addPart(mednewhvParts, 5, MOVE);

  // 1000
  let medworkerParts = [];
  addPart(medworkerParts, 1, CARRY);
  addPart(medworkerParts, 7, WORK);
  addPart(medworkerParts, 5, MOVE);

  // 1000
  let medrepairerParts = [];
  addPart(medrepairerParts, 5, CARRY);
  addPart(medrepairerParts, 4, WORK);
  addPart(medrepairerParts, 7, MOVE);

  // 1000
  let medlinkGetsParts = [];
  addPart(medlinkGetsParts, 5, CARRY);
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
  let basicHv = [CARRY, CARRY, WORK, MOVE, MOVE];
  let simpleParts = [CARRY, WORK, WORK, MOVE];

  let eAttackerId = Memory.eAttackerId;
  let wAttackerId = Memory.wAttackerId;
  let nAttackerId = Memory.nAttackerId;
  let neAttackerId = Memory.neAttackerId;
  let invaderId = Memory.invaderId;

  if (enAvail >= 300) {
    let t = Game.time.toString().slice(4);
    let name = "h" + t + "N";
    let chosenRole = "h";
    let direction = "n";
    let parts = upContrParts;
    let spawnDirection = [BOTTOM];
    let sourceId = "";
    let sourceDir = "";
    let birth = false;
    let buildRoom = "";

    if (harvestersN.length < 1) {
      harvestersN.push(name);
      parts = basicHv;
      sourceDir = "north";
      birth = true;
    } else if (upControllersN.length < 1) {
      chosenRole = "upCN";
      name = chosenRole + t;
      direction = "n";
      parts = simpleParts;
      upControllersN.push(name);
      birth = true;
    } else if (attackersN.length < 1 && nAttackerId) {
      console.log(
        "nattacker " +
          Memory.nAttackerId +
          " " +
          attackersN.length +
          " " +
          enAvail
      );
      parts = attackerParts;
      name = "natt" + t;
      chosenRole = "attacker";
      direction = "n";
      birth = true;
      attackersN.push(name);
    }

    if (birth) {
      const retval = birthCreep(
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

      console.log(name + " role birth: " + retval);

      if (retval === OK || retval === ERR_BUSY) {
        return retval;
      }
    }
  }

  if (enAvail >= 500) {
    let t = Game.time.toString().slice(4);
    let name = "h" + t + "N";
    let chosenRole = "h";
    let direction = "n";
    let parts = hvParts500;
    let spawnDirection = [BOTTOM];
    let sourceId = "";
    let sourceDir = "";
    let birth = false;
    let buildRoom = "";

    if (harvestersN.length < 2 && !nAttackerId) {
      harvestersN.push(name);
      name = "h" + t + "N";
      sourceDir = "north2";
      birth = true;
    }

    if (birth) {
      const retval = birthCreep(
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

      console.log(name + " role birth: " + retval);

      if (retval === OK || retval === ERR_BUSY) {
        return retval;
      }
    }
  }

  // if (enAvail >= 1000) {
  //   let t = Game.time.toString().slice(4);
  //   let name = "h" + t + "N";
  //   let chosenRole = "h";
  //   let direction = "n";
  //   let parts = mednewhvParts;
  //   let spawnDirection = [BOTTOM];
  //   let sourceId = "";
  //   let sourceDir = "n";
  //   let birth = false;
  //   let buildRoom = "E35N32";

  //   if (attackersN.length < 2 && nAttackerId) {
  //     parts = attackerMedParts;
  //     name = "Natt" + t;
  //     chosenRole = "attackerN";
  //     direction = "n";
  //     attackersN.push(name);
  //     birth = true;
  //   } else if (towerHarvestersN.length < 2) {
  //     chosenRole = "ntowerHarvester";
  //     name = chosenRole + t;
  //     towerHarvestersN.push(name);
  //     harvesters.push(name);
  //     parts = mednewhvParts;
  //     sourceDir = "north";
  //     birth = true;
  //   } else if (harvestersN.length < 3 && !nAttackerId) {
  //     harvestersN.push(name);
  //     name = "h" + t + "N";
  //     parts = mednewhvParts;
  //     sourceDir = "north1";
  //     birth = true;
  //   } else if (towerHarvestersN.length < 3) {
  //     chosenRole = "ntowerHarvester";
  //     name = chosenRole + t;
  //     towerHarvestersN.push(name);
  //     harvesters.push(name);
  //     parts = mednewhvParts;
  //     sourceDir = "north";
  //     birth = true;
  //   } else if (nworkers.length < 3) {
  //     nworkers.push(name);
  //     chosenRole = "nBuilder";
  //     buildRoom = "E35N32";
  //     name = chosenRole + t;
  //     parts = medworkerParts;
  //     birth = true;
  //   } else if (harvestersN.length < 5 && !nAttackerId) {
  //     harvestersN.push(name);
  //     name = "h" + t + "N";
  //     parts = mednewhvParts;
  //     sourceDir = "north1";
  //     birth = true;
  //   } else if (nworkers.length < 4) {
  //     upControllersN.push(name);
  //     chosenRole = "upCN";
  //     buildRoom = "E35N32";
  //     name = chosenRole + t;
  //     parts = medupContrParts;
  //     birth = true;
  //   }

  //   if (birth) {
  //     const retval = birthCreep(
  //       s2,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       sourceDir,
  //       buildRoom,
  //       spawnDirection
  //     );

  //     console.log(name + " role birth: " + retval);

  //     if (retval === OK || retval === ERR_BUSY) {
  //       return retval;
  //     }
  //   }
  // }

  if (enAvail >= 1100) {
    let t = Game.time.toString().slice(4);
    let name = "h" + t + "N";
    let chosenRole = "h";
    let direction = "ne";
    let parts = newhvParts;
    let spawnDirection = [BOTTOM];
    let sourceId = "";
    let sourceDir = "";
    let buildRoom = "E36N32";

    if (attackersN.length < 3 && Memory.nAttackerId) {
      parts = attackerBigParts;
      name = "Natt" + t;
      chosenRole = "attackerN";
      direction = "n";
      attackersN.push(name);
      birth = true;
    } else if (towerHarvestersN.length < 3) {
      chosenRole = "ntowerHarvester";
      name = chosenRole + t;
      towerHarvestersN.push(name);
      harvesters.push(name);
      parts = newhvParts;
      sourceDir = "north";
      birth = true;
    } else if (harvestersN.length < 6) {
      harvestersN.push(name);
      parts = newhvParts;
      sourceDir = "north";
    } else if (upControllersN.length < 1) {
      chosenRole = "upCN";
      name = chosenRole + t;
      parts = workerParts;
      upControllersN.push(name);
    } else if (nworkers.length < 3) {
      chosenRole = "nBuilder";
      name = chosenRole + t;
      nworkers.push(name);
      parts = workerParts;
    }

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

  Memory.harvesters = harvesters;
  Memory.nworkers = nworkers;
  Memory.eworkers = eworkers;
  Memory.neworkers = neworkers;
  Memory.upControllers = upControllers;
  Memory.upControllersN = upControllersN;
  Memory.roadRepairers = roadRepairers;
  Memory.roadRepairersN = roadRepairersN;
  Memory.attackers = attackers;
  Memory.claimers = claimers;
  Memory.westHarvesters = westHarvesters;
  Memory.linkGets = linkGets;

  Memory.attackersN = attackersN;
  Memory.eastHarvesters = eastHarvesters;
  Memory.ermHarvesters = harvestersN;
  Memory.harvestersN = harvestersN;
  Memory.towerHarvestersN = towerHarvestersN;
}

module.exports = spawnCreepTypes;
