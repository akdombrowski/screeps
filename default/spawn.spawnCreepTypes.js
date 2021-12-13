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
    if (Game.spawns.Spawn2) {
      retval = Game.spawns.Spawn2.spawnCreep(parts, name, {
        memory: {
          role: chosenRole,
          direction: direction,
          sourceId: sourceId,
        },
        directions: [TOP],
      });
    }
  }

  if (retval === OK) {
    console.log("spawn2ed." + name);
    return retval;
  } else {
    if (Game.spawns.Spawn3) {
      retval = Game.spawns.Spawn3.spawnCreep(parts, name, {
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
}

function spawnCreepTypes(enAvail) {
  let linkGets = Memory.linkGets || [];
  let workers = Memory.workers || [];
  let harvesters = Memory.harvesters || [];
  let upControllers = Memory.upControllers || [];
  let roadRepairers = Memory.roadRepairers || [];
  let towerHarvesters = Memory.towerHarvesters || [];
  let claimers = Memory.claimers || [];
  let attackers = Memory.attackers || [];
  let eAttackDurationSafeCheck = Memory.eAttackDurationSafeCheck;
  let nAttackDurationSafeCheck = Memory.nAttackDurationSafeCheck;
  let sAttackDurationSafeCheck = Memory.sAttackDurationSafeCheck;
  let wAttackDurationSafeCheck = Memory.wAttackDurationSafeCheck;
  let nwAttackDurationSafeCheck = Memory.nwAttackDurationSafeCheck;
  let nwwAttackDurationSafeCheck = Memory.nwwAttackDurationSafeCheck;
  let roadBuilder = Memory.roadBuilder || [];

  let crps = Game.creeps;
  let numCrps = Object.keys(crps).length;

  let s1 = Game.spawns.Spawn1;

  // 200
  let upContrParts = [];
  addPart(upContrParts, 1, CARRY);
  addPart(upContrParts, 1, WORK);
  addPart(upContrParts, 1, MOVE);

  // 500
  let workerParts500 = [];
  addPart(workerParts500, 7, CARRY);
  addPart(workerParts500, 1, WORK);
  addPart(workerParts500, 1, MOVE);

  // 550
  let workerParts550 = [];
  addPart(workerParts550, 2, CARRY);
  addPart(workerParts550, 2, WORK);
  addPart(workerParts550, 5, MOVE);

  // 550
  let harvesterParts550 = [];
  addPart(harvesterParts550, 2, CARRY);
  addPart(harvesterParts550, 3, WORK);
  addPart(harvesterParts550, 3, MOVE);

  // 2500
  let moverParts = [];
  addPart(moverParts, 50, MOVE);

  // 1100
  let medsouthHvParts = [];
  addPart(medsouthHvParts, 10, CARRY);
  addPart(medsouthHvParts, 1, WORK);
  addPart(medsouthHvParts, 10, MOVE);

  // 3000
  let upContrPartsBig = [];
  addPart(upContrPartsBig, 16, CARRY);
  addPart(upContrPartsBig, 12, WORK);
  addPart(upContrPartsBig, 22, MOVE);

  // 3750
  let southHvParts = [];
  addPart(southHvParts, 1, CARRY);
  addPart(southHvParts, 25, WORK);
  addPart(southHvParts, 24, MOVE);

  // 650
  let claimerParts = [];
  addPart(claimerParts, 1, MOVE);
  addPart(claimerParts, 1, CLAIM);

  // 3000
  let bigclaimerParts = [];
  addPart(bigclaimerParts, 6, MOVE);
  addPart(bigclaimerParts, 4, CLAIM);

  // 2750
  let newhvParts = [];
  addPart(newhvParts, 1, CARRY);
  addPart(newhvParts, 25, WORK);
  addPart(newhvParts, 24, MOVE);

  // 3000
  let travelhvParts = [];
  addPart(travelhvParts, 1, CARRY);
  addPart(travelhvParts, 25, WORK);
  addPart(travelhvParts, 24, MOVE);

  // 2900
  let workerParts = [];
  addPart(workerParts, 1, CARRY);
  addPart(workerParts, 25, WORK);
  addPart(workerParts, 24, MOVE);

  // 3000
  let repairerParts = [];
  addPart(repairerParts, 1, CARRY);
  addPart(repairerParts, 25, WORK);
  addPart(repairerParts, 24, MOVE);

  // 300
  let linkGetsParts = [];
  addPart(linkGetsParts, 1, CARRY);
  addPart(linkGetsParts, 2, WORK);
  addPart(linkGetsParts, 1, MOVE);

  // 3000
  let largeLinkGetsParts = [];
  addPart(largeLinkGetsParts, 20, CARRY);
  addPart(largeLinkGetsParts, 10, WORK);
  addPart(largeLinkGetsParts, 20, MOVE);

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
  let simpleParts500 = [CARRY, CARRY, CARRY, CARRY, WORK, WORK, MOVE, MOVE];

  let eAttackerId = Memory.eAttackerId;
  let wAttackerId = Memory.wAttackerId;
  let nAttackerId = Memory.nAttackerId;
  let neAttackerId = Memory.neAttackerId;
  let invaderId = Memory.invaderId;

  let retval = -16;

  if (Game.spawns.Spawn1.spawning) {
    return;
  }

  const contrW = Game.getObjectById("5bbcaeeb9099fc012e639c4d");
  const contrNW = Game.getObjectById("5bbcaeeb9099fc012e639c4a");
  const contrNWW = Game.getObjectById("5bbcaedb9099fc012e639a93");

  const timeDigitsSlice = 2;
  const t = Game.time.toString().slice(timeDigitsSlice);

  let southCreeps = _.filter(harvesters, function (h) {
    return h.memory.direction && h.memory.direction.startsWith("s");
  });

  if (enAvail >= 300 && Memory.AttackerId) {
    let name = "att" + t;
    let chosenRole = "attacker";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = attackerParts;
    let spawnDirection = [TOP];

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
  } else if (enAvail >= 300 && Memory.nAttackerId) {
    let name = "att" + t;
    let chosenRole = "attacker";
    let direction = "north";
    let sourceId = Memory.nSource2;
    let parts = attackerParts;
    let spawnDirection = [TOP];

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
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = simpleParts;
    let spawnDirection = [TOP];

    if (harvesters.length < 2) {
      harvesters.push(name);
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
      parts = upContrParts;
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
      name = "upCN" + t;
      chosenRole = "upCN";
      upControllers.push(name);
      direction = "north";
      parts = upContrParts;
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (roadRepairers.length < 1) {
      name = "rR" + t;
      chosenRole = "roadRepairer";
      roadRepairers.push(name);
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
    }

    if (retval !== -16) {
      console.log("spawningS " + name + " " + retval);
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  if (enAvail >= 350 && !invaderId) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source1;
    let parts = simpleParts350;
    let spawnDirection = [TOP];

    if (harvesters.length < 3) {
      harvesters.push(name);
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
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = simpleParts500;
    let spawnDirection = [TOP];

    if (harvesters.length < 1) {
      direction = "south";
      harvesters.push(name);
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

  if (enAvail >= 650 && !invaderId) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = simpleParts500;
    let spawnDirection = [TOP];

    if (claimers.length < 1) {
      name = "c" + t;
      chosenRole = "c";
      claimers.push(name);
      direction = "north";
      parts = claimerParts;
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

  if (enAvail >= 550 && !invaderId) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "north";
    let sourceId = Memory.source2;
    let parts = harvesterParts550;
    let spawnDirection = [TOP];

    if (southCreeps.length < 2) {
      name = "h" + t;
      harvesters.push(name);
      chosenRole = "h";
      direction = "south";
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (harvesters.length < 7) {
      name = "h" + t;
      harvesters.push(name);
      chosenRole = "h";
      direction = "north";
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (workers.length < 1) {
      name = "w" + t;
      chosenRole = "worker";
      direction = "south";
      workers.push(name);
      parts = workerParts550;
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (roadBuilder.length < 1) {
      name = "rB" + t;
      chosenRole = "roadBuilder";
      roadBuilder.push(name);
      direction = "south";
      parts = workerParts550;
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (roadRepairers.length < 1) {
      parts = workerParts550;
      name = "rR" + t;
      roadRepairers.push(name);
      chosenRole = "roadRepairer";
      direction = "s";
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (roadRepairers.length < 2) {
      parts = workerParts550;
      name = "rR" + t;
      roadRepairers.push(name);
      chosenRole = "roadRepairer";
      direction = "north";
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (roadBuilder.length < 2) {
      name = "rB" + t;
      chosenRole = "roadBuilder";
      roadBuilder.push(name);
      direction = "north";
      parts = workerParts550;
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
      parts = workerParts550;
      name = "w" + t;
      workers.push(name);
      chosenRole = "w";
      direction = "south";
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (harvesters.length < 9) {
      name = "h" + t;
      harvesters.push(name);
      chosenRole = "h";
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else if (workers.length < 8) {
      parts = workerParts550;
      name = "w" + t;
      workers.push(name);
      chosenRole = "w";
      direction = "south";
      retval = birthCreep(
        s1,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
    } else {
      name = "upC" + t;
      upControllers.push(name);
      chosenRole = "upC";
      direction = "south";

      parts = workerParts550;
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
  //   let name = "h" + t;
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

  // if (enAvail >= 650) {
  //   let name = "h" + t;
  //   let chosenRole = "h";
  //   let direction = "south";
  //   let sourceId = Memory.source2;
  //   let parts = simpleParts;
  //   let spawnDirection = [BOTTOM];

  //   if (claimersW.length < 1 && (!contrW || !contrW.my)) {
  //     parts = claimerParts;
  //     name = "claimW" + t;
  //     chosenRole = "claimW";
  //     claimersNW.push(name);
  //     retval = birthCreep(
  //       s1,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       spawnDirection
  //     );
  //   } else if (claimersNWW.length < 1 && (!contrNWW || !contrNWW.my)) {
  //     parts = claimerParts;
  //     name = "claimNWW" + t;
  //     chosenRole = "claimNWW";
  //     claimersNW.push(name);
  //     retval = birthCreep(
  //       s1,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       spawnDirection
  //     );
  //   } else if (claimersNW.length < 1 && (!contrNW || !contrNW.my)) {
  //     parts = claimerParts;
  //     name = "claimNW" + t;
  //     chosenRole = "claimNW";
  //     claimersNW.push(name);
  //     retval = birthCreep(
  //       s1,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       spawnDirection
  //     );
  //   } else if (claimersNWW.length < 2 && (!contrNWW || !contrNWW.my)) {
  //     parts = claimerParts;
  //     name = "claimNWW" + t;
  //     chosenRole = "claimNWW";
  //     claimersNW.push(name);
  //     retval = birthCreep(
  //       s1,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       spawnDirection
  //     );
  //   }

  //   if (retval !== -16) {
  //     console.log("spawningS " + name + " " + retval);
  //   }
  //   if (retval === OK || retval === ERR_BUSY) {
  //     return retval;
  //   }
  // }

  if (enAvail >= 3750 && !invaderId) {
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
    } else if (claimersNW.length < 2 && (!contrNW || !contrNW.my)) {
      parts = bigclaimerParts;
      name = "claimNW" + t;
      chosenRole = "claimNW";
      claimersNW.push(name);
      birth = true;
    } else if (
      claimersNWW.length < 3 &&
      (!contrNWW || !contrNWW.my) &&
      (!Memory.nwwAttackerId || Game.time >= nwwAttackDurationSafeCheck)
    ) {
      parts = bigclaimerParts;
      name = "claimNWW" + t;
      chosenRole = "claimNWW";
      claimersNW.push(name);
      birth = true;
    } else if (claimersW.length < 2 && (!contrW || !contrW.my)) {
      parts = bigclaimerParts;
      name = "claimW" + t;
      chosenRole = "claimW";
      claimersNW.push(name);
      birth = true;
    } else if (harvestersS.length < 2) {
      harvestersS.push(name);
      parts = southHvParts;
      birth = true;
    } else if (harvestersS.length < 3) {
      harvestersS.push(name);
      direction = "ntoS";
      parts = southHvParts;
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
      name += "NW";
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
      name += "NW";
      parts = travelhvParts;
      direction = "nw";
      harvestersNW.push(name);
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

  Memory.roadBuilder = roadBuilder;
  Memory.harvesters = harvesters;
  Memory.workers = workers;
  Memory.upControllers = upControllers;
  Memory.roadRepairers = roadRepairers;
  Memory.attackers = attackers;
  Memory.claimers = claimers;
  Memory.linkGets = linkGets;
  Memory.towerHarvesters = towerHarvesters;
}

module.exports = spawnCreepTypes;
