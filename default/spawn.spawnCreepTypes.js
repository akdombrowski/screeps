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
  let spawningPositionBlocked = s1.room.lookForAt(
    LOOK_CREEPS,
    s1.pos.x,
    s1.pos.y + 1
  );
  if (!spawningPositionBlocked || spawningPositionBlocked.length <= 0) {
    retval = Game.spawns.Spawn1.spawnCreep(parts, name, {
      memory: {
        role: chosenRole,
        direction: direction,
        sourceId: sourceId,
      },
      directions: [BOTTOM],
    });
  } else {
    retval = Game.spawns.Spawn1.spawnCreep(parts, name, {
      memory: { role: chosenRole, direction: direction, sourceId: sourceId },
    });
  }

  if (retval === OK) {
    console.log("spawn1ed." + name);
    return retval;
  } else {
    console.log("Spawn1 failed: " + retval + " " + name);
    retval = Game.spawns.spawn2.spawnCreep(parts, name, {
      memory: {
        role: chosenRole,
        direction: direction,
        sourceId: sourceId,
      },
      directions: [TOP],
    });
  }

  if (retval === OK) {
    console.log("spawn2ed." + name);
    return retval;
  } else {
    retval = Game.spawns.sspawn3.spawnCreep(parts, name, {
      memory: {
        role: chosenRole,
        direction: direction,
        sourceId: sourceId,
      },
      directions: [TOP_RIGHT],
    });

    if (retval === OK) {
      console.log("spawn3ed." + name);
    }
  }
}

function spawnCreepTypes(enAvail) {
  let linkGets = Memory.linkGets || [];
  let workers = Memory.workers || [];
  let nworkers = Memory.nworkers || [];
  let nwworkers = Memory.nwworkers || [];
  let neworkers = Memory.neworkers || [];
  let harvesters = Memory.harvesters || [];
  let upControllers = Memory.upControllers || [];
  let upControllersN = Memory.upControllersN || [];
  let upControllersNW = Memory.upControllersNW || [];
  let upControllersW = Memory.upControllersW || [];
  let upControllersNE = Memory.upControllersNE || [];
  let roadRepairers = Memory.roadRepairers || [];
  let harvestersN = Memory.harvestersN || [];
  let harvestersNW = Memory.harvestersNW || [];
  let harvestersNWW = Memory.harvestersNWW || [];
  let harvestersW = Memory.westHarvesters || [];
  let harvestersS = Memory.harvestersS || [];
  let harvestersE = Memory.eastHarvesters || [];
  let southtowerHarvesters = Memory.southtowerHarvesters || [];
  let claimers = Memory.claimers || [];
  let claimersN = Memory.claimersN || [];
  let claimersNW = Memory.claimersNW || [];
  let claimersNWW = Memory.claimersNWW || [];
  let claimersW = Memory.claimersW || [];
  let claimersNE = Memory.claimersNE || [];
  let attackersNW = Memory.attackersNW || [];
  let attackersNWW = Memory.attackersNWW || [];
  let attackers = Memory.attackers || [];
  let eAttackDurationSafeCheck = Memory.eAttackDurationSafeCheck;
  let nAttackDurationSafeCheck = Memory.nAttackDurationSafeCheck;
  let sAttackDurationSafeCheck = Memory.sAttackDurationSafeCheck;
  let wAttackDurationSafeCheck = Memory.wAttackDurationSafeCheck;
  let nwAttackDurationSafeCheck = Memory.nwAttackDurationSafeCheck;
  let nwwAttackDurationSafeCheck = Memory.nwwAttackDurationSafeCheck;

  let crps = Game.creeps;
  let numCrps = Object.keys(crps).length;

  let s1 = Game.spawns.Spawn1;

  // 500
  let upContrParts = [];
  addPart(upContrParts, 3, CARRY);
  addPart(upContrParts, 1, WORK);
  addPart(upContrParts, 5, MOVE);

  // 500
  let workerParts500 = [];
  addPart(workerParts500, 3, CARRY);
  addPart(workerParts500, 2, WORK);
  addPart(workerParts500, 3, MOVE);

  // 2500
  let moverParts = [];
  addPart(moverParts, 50, MOVE);

  // 1100
  let medsouthHvParts = [];
  addPart(medsouthHvParts, 4, CARRY);
  addPart(medsouthHvParts, 5, WORK);
  addPart(medsouthHvParts, 8, MOVE);

  // 3000
  let upContrPartsBig = [];
  addPart(upContrPartsBig, 20, CARRY);
  addPart(upContrPartsBig, 10, WORK);
  addPart(upContrPartsBig, 20, MOVE);

  // 3500
  let southHvParts = [];
  addPart(southHvParts, 8, CARRY);
  addPart(southHvParts, 20, WORK);
  addPart(southHvParts, 22, MOVE);

  // 650
  let claimerParts = [];
  addPart(claimerParts, 1, MOVE);
  addPart(claimerParts, 1, CLAIM);

  // 2750
  let newhvParts = [];
  addPart(newhvParts, 20, CARRY);
  addPart(newhvParts, 5, WORK);
  addPart(newhvParts, 25, MOVE);

  // 3000
  let travelhvParts = [];
  addPart(travelhvParts, 12, CARRY);
  addPart(travelhvParts, 10, WORK);
  addPart(travelhvParts, 28, MOVE);

  // 2900
  let workerParts = [];
  addPart(workerParts, 16, CARRY);
  addPart(workerParts, 8, WORK);
  addPart(workerParts, 26, MOVE);

  // 3000
  let repairerParts = [];
  addPart(repairerParts, 10, CARRY);
  addPart(repairerParts, 10, WORK);
  addPart(repairerParts, 30, MOVE);

  // 300
  let linkGetsParts = [];
  addPart(linkGetsParts, 1, CARRY);
  addPart(linkGetsParts, 2, WORK);
  addPart(linkGetsParts, 1, MOVE);

  // 3000
  let largeLinkGetsParts = [];
  addPart(largeLinkGetsParts, 10, CARRY);
  addPart(largeLinkGetsParts, 10, WORK);
  addPart(largeLinkGetsParts, 30, MOVE);

  // 290
  let attackerParts = [];
  addPart(attackerParts, 3, ATTACK);
  addPart(attackerParts, 1, MOVE);

  // 500
  let attackerParts500 = [];
  addPart(attackerParts500, 3, ATTACK);
  addPart(attackerParts500, 5, MOVE);

  // 3250
  let bigAttackerParts = [];
  addPart(bigAttackerParts, 25, ATTACK);
  addPart(bigAttackerParts, 25, MOVE);

  let rezzyParts = [CLAIM, MOVE];
  let basicCarry = [CARRY, CARRY, CARRY, WORK, MOVE];
  let basicHv = [CARRY, WORK, MOVE];
  let simpleParts = [CARRY, WORK, WORK, MOVE];
  let simpleParts350 = [CARRY, WORK, WORK, MOVE, MOVE];
  let simpleParts500 = [
    CARRY,
    CARRY,
    CARRY,
    CARRY,
    WORK,
    WORK,
    MOVE,
    MOVE,
  ];

  let eAttackerId = Memory.eAttackerId;
  let wAttackerId = Memory.wAttackerId;
  let nAttackerId = Memory.nAttackerId;
  let neAttackerId = Memory.neAttackerId;
  let invaderId = Memory.invaderId;

  let retval = -16;

  // if (enAvail >= 650) {
  //   if (
  //     claimers.length < 1 &&
  //     !Game.getObjectById("5bbcaf1b9099fc012e63a2dd").my
  //   ) {
  //     let t = Game.time.toString().slice(4);
  //     chosenRole = "c";
  //     name = "claimer" + t;
  //     direction = "ee";
  //     parts = claimerParts;
  //     sourceId = "";
  //     spawnDirection = [TOP_RIGHT];
  //     claimers.push(name);

  //     console.log("claimers");

  //     birthCreep(
  //       s1,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       spawnDirection
  //     );
  //     Memory.claimers = claimers;
  //     return;
  //   }
  // }
  if (
    Game.spawns.Spawn1.spawning &&
    Game.spawns.spawn2.spawning &&
    Game.spawns.sspawn3.spawning
  ) {
    return;
  }

  const contrW = Game.getObjectById("5bbcaeeb9099fc012e639c4d");
  const contrNW = Game.getObjectById("5bbcaeeb9099fc012e639c4a");
  const contrNWW = Game.getObjectById("5bbcaedb9099fc012e639a93");

  if (enAvail >= 300 && attackers.length < 1 && Memory.nAttackerId) {
    let t = Game.time.toString().slice(4);
    let name = "harv" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = simpleParts;
    let spawnDirection = [BOTTOM];

    parts = attackerParts;
    name = "att" + t;
    chosenRole = "attacker";
    direction = "north";
    attackers.push(name);
    retval = birthCreep(
      s1,
      parts,
      name,
      chosenRole,
      direction,
      sourceId,
      spawnDirection
    );
  } else if (enAvail >= 300 && !invaderId) {
    let t = Game.time.toString().slice(4);
    let name = "harv" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = simpleParts;
    let spawnDirection = [BOTTOM];

    if (harvestersS.length < 1) {
      harvestersS.push(name);
      parts = simpleParts;
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (upControllers.length < 1) {
      name = "upC" + t;
      chosenRole = "upC";
      upControllers.push(name);
      parts = basicCarry;
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    }

    if (retval !== -16) {
      console.log("spawningS " + name + " " + retval);
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  if (enAvail >= 350 && !invaderId) {
    let t = Game.time.toString().slice(4);
    let name = "harv" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = simpleParts350;
    let spawnDirection = [BOTTOM];

    if (harvestersS.length < 2) {
      harvestersS.push(name);
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    }

    if (retval !== -16) {
      console.log("spawningS " + name + " " + retval);
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  if (enAvail >= 500) {
    let t = Game.time.toString().slice(4);
    let name = "att" + t;
    let chosenRole = "a";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = attackerParts500;
    let spawnDirection = [BOTTOM];

    if (Memory.nwAttackerId && attackersNW.length < 2) {
      direction = "nw";
      name += "NW";
      attackersNW.push(name);
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (Memory.nwwAttackerId && attackersNWW.length < 2) {
      direction = "nww";
      name += "NWW";
      attackersNWW.push(name);
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    }

    if (retval !== -16) {
      console.log("spawningS " + name + " " + retval);
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  if (enAvail >= 500 && !invaderId) {
    let t = Game.time.toString().slice(4);
    let name = "harv_5_OH_OH_" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = simpleParts500;
    let spawnDirection = [BOTTOM];

    if (harvestersS.length < 3) {
      name += "S";
      direction = "south";
      harvestersS.push(name);
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (
      harvestersW.length < 2 &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      name += "W";
      direction = "west";
      harvestersW.push(name);
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (
      harvestersNW.length < 4 &&
      (!Memory.nwAttackerId || Game.time >= nwAttackDurationSafeCheck)
    ) {
      name += "NW";
      direction = "nw";
      harvestersW.push(name);
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (
      harvestersNWW.length < 4 &&
      (!Memory.nwwAttackerId || Game.time >= nwwAttackDurationSafeCheck)
    ) {
      name += "NWW";
      direction = "nww";
      harvestersNWW.push(name);
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (workers.length < 4) {
      chosenRole = "worker";
      name = chosenRole + t;
      parts = workerParts500;
      direction = "south";
      workers.push(name);
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    }

    if (retval !== -16) {
      console.log("spawningS " + name + " " + retval);
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  if (enAvail >= 510 && !invaderId) {
    let t = Game.time.toString().slice(4);
    let name = "harv" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = upContrParts;
    let spawnDirection = [BOTTOM];

    if (upControllersNE.length < 1) {
      parts = upContrParts;
      name = "upCNE" + t;
      upControllersNE.push(name);
      chosenRole = "upCNE";
      direction = "ne";
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (upControllersN.length < 1) {
      parts = upContrParts;
      name = "upCN" + t;
      upControllersN.push(name);
      chosenRole = "upCN";
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    }

    if (retval !== -16) {
      console.log("spawningS " + name + " " + retval);
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  // if (enAvail >= 1100) {
  //   let t = Game.time.toString().slice(4);
  //   let name = "harv" + t;
  //   let chosenRole = "h";
  //   let direction = "south";
  //   let sourceId = Memory.source2;
  //   let parts = medsouthHvParts;
  //   let spawnDirection = [BOTTOM];

  //   if (harvestersS.length < 3) {
  //     harvestersS.push(name);
  //     birthCreep(
  //       s1,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       spawnDirection
  //     );
  //   }
  // }

  if (enAvail >= 650) {
    let t = Game.time.toString().slice(4);
    let name = "harv" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = simpleParts;
    let spawnDirection = [BOTTOM];

    if (claimersW.length < 1 && (!contrW || !contrW.my)) {
      parts = claimerParts;
      name = "claimW" + t;
      chosenRole = "claimW";
      claimersNW.push(name);
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (claimersNWW.length < 1 && (!contrNWW || !contrNWW.my)) {
      parts = claimerParts;
      name = "claimNWW" + t;
      chosenRole = "claimNWW";
      claimersNW.push(name);
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (claimersNW.length < 1 && (!contrNW || !contrNW.my)) {
      parts = claimerParts;
      name = "claimNW" + t;
      chosenRole = "claimNW";
      claimersNW.push(name);
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (claimersNWW.length < 2 && (!contrNWW || !contrNWW.my)) {
      parts = claimerParts;
      name = "claimNWW" + t;
      chosenRole = "claimNWW";
      claimersNW.push(name);
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (claimersNW.length < 2 && (!contrNW || !contrNW.my)) {
      parts = claimerParts;
      name = "claimNW" + t;
      chosenRole = "claimNW";
      claimersNW.push(name);
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (
      claimersNWW.length < 3 &&
      (!contrNWW || !contrNWW.my) &&
      (!Memory.nwwAttackerId || Game.time >= nwwAttackDurationSafeCheck)
    ) {
      parts = claimerParts;
      name = "claimNWW" + t;
      chosenRole = "claimNWW";
      claimersNW.push(name);
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (claimersW.length < 2 && (!contrW || !contrW.my)) {
      parts = claimerParts;
      name = "claimW" + t;
      chosenRole = "claimW";
      claimersNW.push(name);
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    }

    if (retval !== -16) {
      console.log("spawningS " + name + " " + retval);
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  if (enAvail >= 3250 && !invaderId) {
    let t = Game.time.toString().slice(4);
    let name = "hXL" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = newhvParts;
    let spawnDirection = [BOTTOM];
    let birth = false;
    let buildRoom = "E36N32";

    if (linkGets.length < 1 && Memory.harvester1) {
      chosenRole = "linkGet";
      name = "linkget" + t;
      parts = largeLinkGetsParts;
      linkGets.push(name);
      birth = true;
    } else if (
      harvestersW.length < 3 &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      name += "W";
      parts = travelhvParts;
      direction = "west";
      harvestersW.push(name);
      birth = true;
    } else if (harvestersNWW.length < 5) {
      name += "NWW";
      parts = travelhvParts;
      direction = "nww";
      harvestersNWW.push(name);
      birth = true;
    } else if (harvestersNW.length < 5) {
      name += "WW";
      parts = travelhvParts;
      direction = "nw";
      harvestersNW.push(name);
      birth = true;
    } else if (harvestersNWW.length < 6) {
      name += "NWW";
      parts = travelhvParts;
      direction = "nww";
      harvestersNWW.push(name);
      birth = true;
    } else if (harvestersNW.length < 6) {
      name += "WW";
      parts = travelhvParts;
      direction = "nw";
      harvestersNW.push(name);
      birth = true;
    } else if (upControllers.length < 1) {
      parts = upContrParts;
      name = "upc" + t;
      upControllers.push(name);
      chosenRole = "upC";
      birth = true;
    } else if (southtowerHarvesters.length < 3) {
      chosenRole = "southtowerHarvester";
      name = "sth" + t;
      harvesters.push(name);
      southtowerHarvesters.push(name);
      parts = southHvParts;
      birth = true;
    } else if (workers.length < 3) {
      chosenRole = "w";
      name = chosenRole + t;
      parts = workerParts;
      workers.push(name);
      birth = true;
    } else if (harvestersS.length < 4) {
      harvestersS.push(name);
      parts = southHvParts;
      birth = true;
    } else if (
      claimersW.length < 1 &&
      (!Game.getObjectById("5bbcaeeb9099fc012e639c4d") ||
        !Game.getObjectById("5bbcaeeb9099fc012e639c4d").my)
    ) {
      parts = claimerParts;
      name = "claimW" + t;
      chosenRole = "claimW";
      claimersN.push(name);
      birth = true;
    } else if (
      upControllersW.length < 1 &&
      Game.getObjectById("5bbcaeeb9099fc012e639c4d") &&
      Game.getObjectById("5bbcaeeb9099fc012e639c4d").my &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      parts = upContrPartsBig;
      name = "upCW" + t;
      chosenRole = "upCW";
      birth = true;
      upControllersW.push(name);
    } else if (
      claimersN.length < 1 &&
      !Game.getObjectById("5bbcaefa9099fc012e639e8b").my
    ) {
      parts = claimerParts;
      name = "claimN" + t;
      chosenRole = "claimN";
      claimersN.push(name);
      birth = true;
    } else if (
      upControllersN.length < 1 &&
      Game.getObjectById("5bbcaefa9099fc012e639e8b").my &&
      (!nAttackerId || Game.time >= nAttackDurationSafeCheck)
    ) {
      parts = upContrPartsBig;
      name = "upCN" + t;
      chosenRole = "upCN";
      birth = true;
      upControllersN.push(name);
    } else if (
      claimersNE.length < 1 &&
      !Game.getObjectById("5bbcaf0c9099fc012e63a0b9").my
    ) {
      parts = claimerParts;
      name = "claimNE" + t;
      chosenRole = "claimNE";
      claimersN.push(name);
      birth = true;
    } else if (
      upControllersNE.length < 1 &&
      Game.getObjectById("5bbcaf0c9099fc012e63a0b9").my &&
      (!neAttackerId || Game.time >= neAttackDurationSafeCheck)
    ) {
      parts = upContrPartsBig;
      name = "upCNE" + t;
      chosenRole = "upCNE";
      birth = true;
      upControllersNE.push(name);
    } else if (southtowerHarvesters.length < 2) {
      chosenRole = "southtowerHarvester";
      name = "sth" + t;
      harvesters.push(name);
      southtowerHarvesters.push(name);
      parts = southHvParts;
      birth = true;
    } else if (attackers.length < 2 && Memory.nAttackerId) {
      parts = bigAttackerParts;
      name = "att" + t;
      chosenRole = "attacker";
      direction = "north";
      attackers.push(name);
      birth = true;
    } else if (
      harvestersN.length < 2 &&
      (!nAttackerId || Game.time >= nAttackDurationSafeCheck)
    ) {
      name += "N";
      parts = travelhvParts;
      direction = "north";
      harvestersN.push(name);
      birth = true;
    } else if (
      harvestersW.length < 3 &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      name += "W";
      parts = travelhvParts;
      direction = "west";
      harvestersW.push(name);
      birth = true;
    } else if (neworkers.length < 3) {
      neworkers.push(name);
      chosenRole = "neBuilder";
      buildRoom = "E36N32";
      name = chosenRole + t;
      parts = workerParts;
      birth = true;
    } else {
      chosenRole = "w";
      name = chosenRole + t;
      parts = workerParts;
      workers.push(name);
      birth = true;
    }

    if (birth) {
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
      if (retval !== -16) {
        console.log("spawningS " + name + " " + retval);
      }
      if (retval === OK || retval === ERR_BUSY) {
        return retval;
      }
    } else {
      console.log("south wait for rezzy");
    }
  }

  Memory.harvesters = harvesters;
  Memory.harvestersS = harvestersS;
  Memory.workers = workers;
  Memory.nworkers = nworkers;
  Memory.nwworkers = nwworkers;
  Memory.neworkers = neworkers;
  Memory.upControllers = upControllers;
  Memory.upControllersN = upControllersN;
  Memory.upControllersNW = upControllersNW;
  Memory.upControllersNE = upControllersNE;
  Memory.roadRepairers = roadRepairers;
  Memory.attackers = attackers;
  Memory.claimers = claimers;
  Memory.claimersN = claimersN;
  Memory.claimersNW = claimersNW;
  Memory.claimersNWW = claimersNWW;
  Memory.claimersNE = claimersNE;
  Memory.harvestersN = harvestersN;
  Memory.harvestersNW = harvestersNW;
  Memory.harvestersNWW = harvestersNWW;
  Memory.eastHarvesters = harvestersE;
  Memory.westHarvesters = harvestersW;
  Memory.southHarvesters = harvestersS;
  Memory.linkGets = linkGets;
  Memory.southtowerHarvesters = southtowerHarvesters;
}

module.exports = spawnCreepTypes;
