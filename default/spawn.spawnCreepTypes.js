const spawnBackupCreeps = require("./spawnBackupCreeps");
const profiler = require("./screeps-profiler");

function addPart(arr, count, part) {
  for (let i = 0; i < count; i++) {
    arr.push(part);
  }
}
addPart = profiler.registerFN(addPart, "addPart");

function birthCreep(
  spawns,
  parts,
  name,
  chosenRole,
  direction,
  sourceId,
  spawnDirection,
  group
) {
  let retval = -16;
  let enAvail = -1;

  for (const spawn of spawns) {
    try {
      let spawningPositionBlocked = spawn.room.lookForAt(
        LOOK_CREEPS,
        spawn.pos.x,
        spawn.pos.y - 1
      );

      enAvail = spawn.room.energyAvailable;

      if (!spawningPositionBlocked || spawningPositionBlocked.length <= 0) {
        retval = spawn.spawnCreep(parts, name, {
          memory: {
            role: chosenRole,
            direction: direction,
            sourceId: sourceId,
            group: group,
          },
          directions: spawnDirection,
        });
      } else {
        retval = spawn.spawnCreep(parts, name, {
          memory: {
            role: chosenRole,
            direction: direction,
            sourceId: sourceId,
          },
        });
      }

      if (retval === OK) {
        console.log(
          "spawn1ed." +
            name +
            " " +
            chosenRole +
            " " +
            group +
            " " +
            direction +
            " " +
            spawnDirection
        );
        return retval;
      }
    } catch (e) {
      // likely not actually a spawn in the array
      // console.log("spawns " + spawn)
    }
  }
  return retval;
}
birthCreep = profiler.registerFN(birthCreep, "birthCreep");

function spawnCreepTypes(enAvail, spawns) {
  let linkGets = Memory.linkGets || [];
  let workers = Memory.workers || [];
  let harvesters = Memory.harvesters || [];
  let harvestersE59S47 = Memory.harvestersE59S47 || [];
  let harvestersE59S49 = Memory.harvestersE59S49 || [];
  let upControllers = Memory.upControllers || [];
  let upControllersE59S47 = Memory.upControllersE59S47 || [];
  let upControllersE59S49 = Memory.upControllersE59S49 || [];
  let roadRepairers = Memory.roadRepairers || [];
  let roadRepairersE59S47 = Memory.roadRepairersE59S47 || [];
  let roadRepairersE59S49 = Memory.roadRepairersE59S49 || [];
  let roadBuilders = Memory.roadBuilders || [];
  let reservers = Memory.reservers || [];
  let towerHarvesters = Memory.towerHarvesters || [];
  let claimers = Memory.claimers || [];
  let claimersE59S47 = Memory.claimersE59S47 || [];
  let claimersE59S49 = Memory.claimersE59S49 || [];
  let attackers = Memory.attackers || [];
  let attackersE59S47 = Memory.attackersE59S47 || [];
  let attackersE59S49 = Memory.attackersE59S49 || [];
  let eAttackDurationSafeCheck = Memory.eAttackDurationSafeCheck;
  let nAttackDurationSafeCheck = Memory.nAttackDurationSafeCheck;
  let sAttackDurationSafeCheck = Memory.sAttackDurationSafeCheck;
  let wAttackDurationSafeCheck = Memory.wAttackDurationSafeCheck;
  let nwAttackDurationSafeCheck = Memory.nwAttackDurationSafeCheck;
  let nwwAttackDurationSafeCheck = Memory.nwwAttackDurationSafeCheck;

  let crps = Game.creeps;
  let numCrps = Object.keys(crps).length;

  let s1 = Game.spawns.deepSouthSpawn1;

  // 200
  let upContrParts200 = [];
  addPart(upContrParts200, 1, CARRY);
  addPart(upContrParts200, 1, WORK);
  addPart(upContrParts200, 1, MOVE);

  // 290
  let attackerParts290 = [];
  addPart(attackerParts290, 1, MOVE);
  addPart(attackerParts290, 3, ATTACK);

  // 300
  let linkGetsParts300 = [];
  addPart(linkGetsParts300, 1, CARRY);
  addPart(linkGetsParts300, 2, WORK);
  addPart(linkGetsParts300, 1, MOVE);

  // 500
  let workerParts500 = [];
  addPart(workerParts500, 1, CARRY);
  addPart(workerParts500, 2, WORK);
  addPart(workerParts500, 5, MOVE);

  // 500
  let attackerParts500 = [];
  addPart(attackerParts500, 5, MOVE);
  addPart(attackerParts500, 3, ATTACK);

  // 550
  let workerParts550 = [];
  addPart(workerParts550, 1, CARRY);
  addPart(workerParts550, 3, WORK);
  addPart(workerParts550, 4, MOVE);

  // 550
  let harvesterParts550 = [];
  addPart(harvesterParts550, 1, CARRY);
  addPart(harvesterParts550, 4, WORK);
  addPart(harvesterParts550, 2, MOVE);

  // 650
  let claimerParts650 = [];
  addPart(claimerParts650, 1, MOVE);
  addPart(claimerParts650, 1, CLAIM);

  // 800
  let harvesterParts800 = [];
  addPart(harvesterParts800, 1, CARRY);
  addPart(harvesterParts800, 5, WORK);
  addPart(harvesterParts800, 5, MOVE);

  // 800
  let workerParts800 = [];
  addPart(workerParts800, 1, CARRY);
  addPart(workerParts800, 5, WORK);
  addPart(workerParts800, 5, MOVE);

  // 800
  let upContrParts800 = [];
  addPart(upContrParts800, 1, CARRY);
  addPart(upContrParts800, 5, WORK);
  addPart(upContrParts800, 5, MOVE);

  // 1100
  let medsouthHvParts1100 = [];
  addPart(medsouthHvParts1100, 1, CARRY);
  addPart(medsouthHvParts1100, 10, WORK);
  addPart(medsouthHvParts1100, 1, MOVE);

  // 2500
  let moverParts2500 = [];
  addPart(moverParts2500, 50, MOVE);

  // 2750
  let newhvParts2750 = [];
  addPart(newhvParts2750, 2, CARRY);
  addPart(newhvParts2750, 25, WORK);
  addPart(newhvParts2750, 23, MOVE);

  // 2900
  let workerParts2900 = [];
  addPart(workerParts2900, 2, CARRY);
  addPart(workerParts2900, 25, WORK);
  addPart(workerParts2900, 23, MOVE);

  // 3000
  let upContrPartsBig3000 = [];
  addPart(upContrPartsBig3000, 2, CARRY);
  addPart(upContrPartsBig3000, 25, WORK);
  addPart(upContrPartsBig3000, 10, MOVE);

  // 3000
  let bigclaimerParts3000 = [];
  addPart(bigclaimerParts3000, 6, MOVE);
  addPart(bigclaimerParts3000, 4, CLAIM);

  // 3000
  let travelhvParts3000 = [];
  addPart(travelhvParts3000, 1, CARRY);
  addPart(travelhvParts3000, 25, WORK);
  addPart(travelhvParts3000, 24, MOVE);

  // 3000
  let repairerParts3000 = [];
  addPart(repairerParts3000, 1, CARRY);
  addPart(repairerParts3000, 25, WORK);
  addPart(repairerParts3000, 9, MOVE);

  // 3000
  let largeLinkGetsParts3000 = [];
  addPart(largeLinkGetsParts3000, 4, CARRY);
  addPart(largeLinkGetsParts3000, 25, WORK);
  addPart(largeLinkGetsParts3000, 6, MOVE);

  // 3250
  let bigAttackerParts3250 = [];
  addPart(bigAttackerParts3250, 25, MOVE);
  addPart(bigAttackerParts3250, 25, ATTACK);

  // 3750
  let southHvParts3750 = [];
  addPart(southHvParts3750, 1, CARRY);
  addPart(southHvParts3750, 25, WORK);
  addPart(southHvParts3750, 24, MOVE);

  let rezzyParts = [CLAIM, MOVE];
  let basicCarry300 = [CARRY, WORK, WORK, MOVE];
  let basicHv200 = [CARRY, WORK, MOVE];
  let simpleParts300 = [CARRY, WORK, WORK, MOVE];
  let simpleParts350 = [CARRY, WORK, WORK, MOVE, MOVE];
  let simpleParts500 = [CARRY, WORK, WORK, WORK, WORK, MOVE];

  let eAttackerId = Memory.eAttackerId;
  let wAttackerId = Memory.wAttackerId;
  let nAttackerId = Memory.nAttackerId;
  let neAttackerId = Memory.neAttackerId;
  let dSAttackerId = Memory.dSAttackerId;
  let invaderId = Memory.invaderId;

  let retval = -16;

  if (Game.spawns.Spawn1.spawning) {
    return;
  }

  let northController = Game.getObjectById("59bbc5d22052a716c3cea133");
  let deepSouthController = Game.getObjectById("59bbc5d22052a716c3cea13a");

  const contrW = Game.getObjectById("5bbcaeeb9099fc012e639c4d");
  const contrNW = Game.getObjectById("5bbcaeeb9099fc012e639c4a");
  const contrNWW = Game.getObjectById("5bbcaedb9099fc012e639a93");

  const timeDigitsSlice = 2;
  const t = Game.time.toString().slice(timeDigitsSlice);

  const numOfCreepsTotal = Object.keys(Game.creeps).length;

  //     #     #######  #######     #      #####   #    #
  //    # #       #        #       # #    #     #  #   #
  //   #   #      #        #      #   #   #        #  #
  //  #     #     #        #     #     #  #        ###
  //  #######     #        #     #######  #        #  #
  //  #     #     #        #     #     #  #     #  #   #
  //  #     #     #        #     #     #   #####   #    #
  if (enAvail >= 500 && invaderId) {
    let name = "att" + t;
    let chosenRole = "attacker";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = attackerParts500;
    let spawnDirection = [TOP];
    let group = "attackers";

    attackers.push(name);
    retval = birthCreep(
      spawns,
      parts,
      name,
      chosenRole,
      direction,
      sourceId,
      spawnDirection,
      group
    );
  }

  //     #     #######  #######     #      #####   #    #
  //    # #       #        #       # #    #     #  #   #
  //   #   #      #        #      #   #   #        #  #
  //  #     #     #        #     #     #  #        ###
  //  #######     #        #     #######  #        #  #
  //  #     #     #        #     #     #  #     #  #   #
  //  #     #     #        #     #     #   #####   #    #
  // if (enAvail >= 500 && attackersE59S47.length < 3 && nAttackerId) {
  //   let name = "att" + t;
  //   let chosenRole = "attacker";
  //   let direction = "north";
  //   let sourceId = Memory.nSource2;
  //   let parts = attackerParts500;
  //   let group = "attackersE59S47";
  //   let spawnDirection = [TOP];

  //   attackersE59S47.push(name);
  //   retval = birthCreep(
  //     spawns,
  //     parts,
  //     name,
  //     chosenRole,
  //     direction,
  //     sourceId,
  //     spawnDirection,
  //     group
  //   );
  // }

  //     #     #######  #######     #      #####   #    #
  //    # #       #        #       # #    #     #  #   #
  //   #   #      #        #      #   #   #        #  #
  //  #     #     #        #     #     #  #        ###
  //  #######     #        #     #######  #        #  #
  //  #     #     #        #     #     #  #     #  #   #
  //  #     #     #        #     #     #   #####   #    #
  if (enAvail >= 500 && attackersE59S49.length < 3 && dSAttackerId) {
    let name = "dSatt" + t;
    let chosenRole = "attacker";
    let direction = "deepSouth";
    let sourceId = Memory.dSSource2;
    let parts = attackerParts500;
    let group = "attackersE59S49";
    let spawnDirection = [TOP];

    attackersE59S49.push(name);
    retval = birthCreep(
      spawns,
      parts,
      name,
      chosenRole,
      direction,
      sourceId,
      spawnDirection,
      group
    );
  }

  //   #####     ###      ###
  //  #     #   #   #    #   #
  //        #  #     #  #     #
  //   #####   #     #  #     #
  //        #  #     #  #     #
  //  #     #   #   #    #   #
  //   #####     ###      ###
  if (enAvail >= 300 && !invaderId) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = simpleParts300;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (numOfCreepsTotal < 20) {
      harvesters.push(name);
      parts = simpleParts300;
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    }

    if (retval !== -16) {
      console.log("spawningS " + name + " " + retval);
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  //   #####     ###      ###
  //  #     #   #   #    #   #
  //        #  #     #  #     #
  //   #####   #     #  #     #
  //        #  #     #  #     #
  //  #     #   #   #    #   #
  //   #####     ###      ###
  if (enAvail >= 300 && !invaderId) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = simpleParts300;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (upControllers.length < 1) {
      name = "upC" + t;
      chosenRole = "upC";
      upControllers.push(name);
      parts = upContrParts200;
      group = "upControllers";
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (
      northController &&
      northController.my &&
      !nAttackerId &&
      upControllersE59S47.length < 1
    ) {
      // when north controller is controlled change this to upControllersN
      name = "upCN" + t;
      chosenRole = "upCN";
      upControllersE59S47.push(name);
      direction = "north";
      parts = upContrParts200;
      group = "upControllersN";
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (upControllersE59S49.length < 1) {
      name = "upCdS" + t;
      upControllersE59S49.push(name);
      chosenRole = "upCdS";
      direction = "deepSouth";
      group = "upControllersE59S49";
      parts = upContrParts200;

      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (roadRepairers.length < 1) {
      name = "rR" + t;
      chosenRole = "roadRepairer";
      roadRepairers.push(name);
      parts = simpleParts300;
      group = "roadRepairers";
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    }

    if (retval !== -16) {
      console.log("spawningS " + name + " " + retval);
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  //   #####     ###      ###
  //  #     #   #   #    #   #
  //        #  #     #  #     #
  //   #####   #     #  #     #
  //        #  #     #  #     #
  //  #     #   #   #    #   #
  //   #####     ###      ###
  if (enAvail >= 300 && !nAttackerId && northController && northController.my) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = simpleParts300;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (upControllersE59S47.length < 1) {
      // when north controller is controlled change this to upControllersN
      name = "upCN" + t;
      chosenRole = "upCN";
      upControllersE59S47.push(name);
      direction = "north";
      parts = upContrParts200;
      group = "upControllersN";
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    }

    if (retval !== -16) {
      console.log("spawningS " + name + " " + retval);
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  //   #####   #######    ###
  //  #     #  #         #   #
  //        #  #        #     #
  //   #####   ######   #     #
  //        #        #  #     #
  //  #     #  #     #   #   #
  //   #####    #####     ###
  if (enAvail >= 350 && !invaderId) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source1;
    let parts = simpleParts350;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (numOfCreepsTotal < 25) {
      harvesters.push(name);
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    }

    if (retval !== -16) {
      console.log("spawningS " + name + " " + retval);
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  //     #     #######  #######     #      #####   #    #
  //    # #       #        #       # #    #     #  #   #
  //   #   #      #        #      #   #   #        #  #
  //  #     #     #        #     #     #  #        ###
  //  #######     #        #     #######  #        #  #
  //  #     #     #        #     #     #  #     #  #   #
  //  #     #     #        #     #     #   #####   #    #
  if (enAvail >= 500) {
    let name = "att" + t;
    let chosenRole = "a";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = attackerParts500;
    let group = "attackersNW";
    let spawnDirection = [TOP];

    if (Memory.nwAttackerId && attackersNW.length < 2) {
      direction = "nw";
      name += "NW";
      attackersNW.push(name);
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (Memory.nwwAttackerId && attackersNWW.length < 2) {
      direction = "nww";
      name += "NWW";
      group = "attackersNWW";
      attackersNWW.push(name);
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    }

    if (retval !== -16) {
      console.log("spawningS " + name + " " + retval);
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  // if (enAvail >= 650 && !invaderId) {
  //   let name = "resN" + t;
  //   let chosenRole = "reserver";
  //   let direction = "north";
  //   let sourceId = Memory.source2;
  //   let parts = simpleParts500;
  //   let group = "reservers";
  //   let spawnDirection = [TOP];

  //   if (reservers.length < 1) {
  //     reservers.push(name);
  //     parts = claimerParts;
  //     retval = birthCreep(
  //       spawns,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       spawnDirection,
  //       group
  //     );
  //   }

  //   if (retval !== -16) {
  //     console.log("spawningS " + name + " " + retval);
  //   }
  //   if (retval === OK || retval === ERR_BUSY) {
  //     return retval;
  //   }
  // }

  //  #######  #######    ###
  //  #        #         #   #
  //  #        #        #     #
  //  ######   ######   #     #
  //        #        #  #     #
  //  #     #  #     #   #   #
  //   #####    #####     ###
  if (enAvail >= 550 && !invaderId) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "north";
    let sourceId = Memory.source2;
    let parts = harvesterParts550;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (harvesters.length < 14) {
      name = "h" + t;
      harvesters.push(name);
      chosenRole = "h";
      direction = "south";
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
      // } else if (harvestersE59S47.length < 1) {
      //   name = "hN" + t;
      //   harvestersE59S47.push(name);
      //   chosenRole = "h";
      //   direction = "north";
      //   group = "harvestersE59S47";
      //   retval = birthCreep(
      //     spawns,
      //     parts,
      //     name,
      //     chosenRole,
      //     direction,
      //     sourceId,
      //     spawnDirection,
      //     group
      //   );
    } else if (roadRepairers.length < 1) {
      parts = workerParts550;
      name = "rR" + t;
      roadRepairers.push(name);
      chosenRole = "roadRepairer";
      direction = "south";
      group = "roadRepairers";
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (harvesters.length < 20) {
      name = "h" + t;
      harvesters.push(name);
      chosenRole = "h";
      direction = "south";
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
      // } else if (harvestersE59S47.length < 1) {
      //   name = "hN" + t;
      //   harvestersE59S47.push(name);
      //   chosenRole = "h";
      //   direction = "north";
      //   group = "harvestersE59S47";
      //   retval = birthCreep(
      //     spawns,
      //     parts,
      //     name,
      //     chosenRole,
      //     direction,
      //     sourceId,
      //     spawnDirection,
      //     group
      //   );
    }

    if (retval !== -16) {
      console.log("spawningS " + name + " " + retval);
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  //   #####   #           #     ###  #     #
  //  #     #  #          # #     #   ##   ##
  //  #        #         #   #    #   # # # #
  //  #        #        #     #   #   #  #  #
  //  #        #        #######   #   #     #
  //  #     #  #        #     #   #   #     #
  //   #####   #######  #     #  ###  #     #
  if (
    enAvail >= 650 &&
    !invaderId &&
    !nAttackerId &&
    (!northController ||
      (northController &&
        !northController.my &&
        (!northController.safeModeCooldown ||
          northController.safeModeCooldown <= 0)))
  ) {
    let name = "hN" + t;
    let chosenRole = "h";
    let direction = "north";
    let sourceId = Memory.nSource2;
    let parts = claimerParts650;
    let group = "claimers";
    let spawnDirection = [TOP];

    if (claimers.length < 1) {
      name = "cN" + t;
      chosenRole = "claimerN";
      claimers.push(name);
      direction = "north";
      parts = claimerParts650;
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    }

    if (retval !== -16) {
      console.log("spawningS " + name + " " + retval);
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  //   #####   #           #     ###  #     #
  //  #     #  #          # #     #   ##   ##
  //  #        #         #   #    #   # # # #
  //  #        #        #     #   #   #  #  #
  //  #        #        #######   #   #     #
  //  #     #  #        #     #   #   #     #
  //   #####   #######  #     #  ###  #     #
  if (
    enAvail >= 650 &&
    !invaderId &&
    !dSAttackerId &&
    deepSouthController &&
    !deepSouthController.my
  ) {
    let name = "hdS" + t;
    let chosenRole = "h";
    let direction = "deepSouth";
    let sourceId = Memory.nSource2;
    let parts = claimerParts650;
    let group = "claimers";
    let spawnDirection = [TOP];

    if (claimers.length < 1) {
      name = "cdS" + t;
      chosenRole = "claim";
      claimers.push(name);
      parts = claimerParts650;
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    }

    if (retval !== -16) {
      console.log("spawningS " + name + " " + retval);
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  //
  //
  //
  // ..#######....#####.....#####..
  // .##.....##..##...##...##...##.
  // .##.....##.##.....##.##.....##
  // ..#######..##.....##.##.....##
  // .##.....##.##.....##.##.....##
  // .##.....##..##...##...##...##.
  // ..#######....#####.....#####..
  //
  //
  //
  if (enAvail >= 800 && !invaderId) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "north";
    let sourceId = Memory.source2;
    let parts = harvesterParts800;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (harvesters.length < 16) {
      name = "h" + t;
      harvesters.push(name);
      chosenRole = "h";
      direction = "south";
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
      // } else if (harvestersE59S47.length < 16) {
      //   name = "hN" + t;
      //   harvestersE59S47.push(name);
      //   chosenRole = "h";
      //   direction = "north";
      //   group = "harvestersE59S47";
      //   retval = birthCreep(
      //     spawns,
      //     parts,
      //     name,
      //     chosenRole,
      //     direction,
      //     sourceId,
      //     spawnDirection,
      //     group
      //   );
    } else if (harvestersE59S49.length < 1) {
      name = "hdS" + t;
      harvestersE59S49.push(name);
      chosenRole = "h";
      direction = "deepSouth";
      group = "harvestersE59S49";
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (upControllersE59S49.length < 1) {
      name = "upCdS" + t;
      upControllersE59S49.push(name);
      chosenRole = "upCdS";
      direction = "deepSouth";
      group = "upControllersE59S49";
      parts = upContrParts800;
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (roadRepairers.length < 2) {
      parts = workerParts800;
      name = "rR" + t;
      roadRepairers.push(name);
      chosenRole = "roadRepairer";
      direction = "south";
      group = "roadRepairers";
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
      // } else if (roadRepairersE59S47.length < 1) {
      //   parts = workerParts800;
      //   name = "rRN" + t;
      //   roadRepairersE59S47.push(name);
      //   chosenRole = "roadRepairer";
      //   direction = "north";
      //   group = "roadRepairersE59S47";
      //   retval = birthCreep(
      //     spawns,
      //     parts,
      //     name,
      //     chosenRole,
      //     direction,
      //     sourceId,
      //     spawnDirection,
      //     group
      //   );
    } else if (roadRepairersE59S49.length < 1) {
      parts = workerParts800;
      name = "rRdS" + t;
      roadRepairersE59S49.push(name);
      chosenRole = "roadRepairer";
      direction = "deepSouth";
      group = "roadRepairersE59S49";
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (roadRepairers.length < 3) {
      parts = workerParts800;
      name = "rR" + t;
      roadRepairers.push(name);
      chosenRole = "roadRepairer";
      direction = "south";
      group = "roadRepairers";
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (upControllers.length < 4) {
      name = "upC" + t;
      upControllers.push(name);
      chosenRole = "upC";
      direction = "south";
      group = "upControllers";
      parts = upContrParts800;
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
      // } else if (roadRepairersE59S47.length < 1) {
      //   parts = workerParts800;
      //   name = "rRN" + t;
      //   roadRepairersE59S47.push(name);
      //   chosenRole = "roadRepairer";
      //   direction = "north";
      //   group = "roadRepairersE59S47";
      //   retval = birthCreep(
      //     spawns,
      //     parts,
      //     name,
      //     chosenRole,
      //     direction,
      //     sourceId,
      //     spawnDirection,
      //     group
      //   );
    } else {
      // south road repairer, roadRepairers
      parts = workerParts800;
      name = "rR" + t;
      roadRepairers.push(name);
      chosenRole = "roadRepairer";
      direction = "south";
      group = "roadRepairers";
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
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
  //       spawns,
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
  //       spawns,
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
  //       spawns,
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
  //       spawns,
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
  //       spawns,
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
    let parts = newhvParts2750;
    let spawnDirection = [BOTTOM];
    let birth = false;
    let buildRoom = "E36N32";

    if (linkGets.length < 1 && Memory.harvester1) {
      chosenRole = "linkGet";
      name = "linkget" + t;
      parts = largeLinkGetsParts3000;
      linkGets.push(name);
      birth = true;
    } else if (claimersNW.length < 2 && (!contrNW || !contrNW.my)) {
      parts = bigclaimerParts3000;
      name = "claimNW" + t;
      chosenRole = "claimNW";
      claimersNW.push(name);
      birth = true;
    } else if (
      claimersNWW.length < 3 &&
      (!contrNWW || !contrNWW.my) &&
      (!Memory.nwwAttackerId || Game.time >= nwwAttackDurationSafeCheck)
    ) {
      parts = bigclaimerParts3000;
      name = "claimNWW" + t;
      chosenRole = "claimNWW";
      claimersNW.push(name);
      birth = true;
    } else if (claimersW.length < 2 && (!contrW || !contrW.my)) {
      parts = bigclaimerParts3000;
      name = "claimW" + t;
      chosenRole = "claimW";
      claimersNW.push(name);
      birth = true;
    } else if (harvestersS.length < 2) {
      harvestersS.push(name);
      parts = southHvParts3750;
      birth = true;
    } else if (harvestersS.length < 3) {
      harvestersS.push(name);
      direction = "ntoS";
      parts = southHvParts3750;
      birth = true;
    } else if (
      harvestersW.length < 3 &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      name += "W";
      parts = travelhvParts3000;
      direction = "west";
      harvestersW.push(name);
      birth = true;
    } else if (harvestersNWW.length < 5) {
      name += "NWW";
      parts = travelhvParts3000;
      direction = "nww";
      harvestersNWW.push(name);
      birth = true;
    } else if (harvestersNW.length < 5) {
      name += "NW";
      parts = travelhvParts3000;
      direction = "nw";
      harvestersNW.push(name);
      birth = true;
    } else if (harvestersNWW.length < 6) {
      name += "NWW";
      parts = travelhvParts3000;
      direction = "nww";
      harvestersNWW.push(name);
      birth = true;
    } else if (harvestersNW.length < 6) {
      name += "NW";
      parts = travelhvParts3000;
      direction = "nw";
      harvestersNW.push(name);
      birth = true;
    } else if (southtowerHarvesters.length < 3) {
      chosenRole = "southtowerHarvester";
      name = "sth" + t;
      harvesters.push(name);
      southtowerHarvesters.push(name);
      parts = southHvParts3750;
      birth = true;
    } else if (workers.length < 3) {
      chosenRole = "w";
      name = chosenRole + t;
      parts = workerParts2900;
      workers.push(name);
      birth = true;
    } else if (harvestersS.length < 4) {
      harvestersS.push(name);
      parts = southHvParts3750;
      birth = true;
    } else if (
      claimersW.length < 1 &&
      (!Game.getObjectById("5bbcaeeb9099fc012e639c4d") ||
        !Game.getObjectById("5bbcaeeb9099fc012e639c4d").my)
    ) {
      parts = claimerParts650;
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
      parts = upContrPartsBig3000;
      name = "upCW" + t;
      chosenRole = "upCW";
      birth = true;
      upControllersW.push(name);
    } else if (
      claimersN.length < 1 &&
      !Game.getObjectById("5bbcaefa9099fc012e639e8b").my
    ) {
      parts = claimerParts650;
      name = "claimN" + t;
      chosenRole = "claimN";
      claimersN.push(name);
      birth = true;
    } else if (
      upControllersN.length < 1 &&
      Game.getObjectById("5bbcaefa9099fc012e639e8b").my &&
      (!nAttackerId || Game.time >= nAttackDurationSafeCheck)
    ) {
      parts = upContrPartsBig3000;
      name = "upCN" + t;
      chosenRole = "upCN";
      birth = true;
      upControllersN.push(name);
    } else if (
      claimersNE.length < 1 &&
      !Game.getObjectById("5bbcaf0c9099fc012e63a0b9").my
    ) {
      parts = claimerParts650;
      name = "claimNE" + t;
      chosenRole = "claimNE";
      claimersN.push(name);
      birth = true;
    } else if (
      upControllersNE.length < 1 &&
      Game.getObjectById("5bbcaf0c9099fc012e63a0b9").my &&
      (!neAttackerId || Game.time >= neAttackDurationSafeCheck)
    ) {
      parts = upContrPartsBig3000;
      name = "upCNE" + t;
      chosenRole = "upCNE";
      birth = true;
      upControllersNE.push(name);
    } else if (southtowerHarvesters.length < 2) {
      chosenRole = "southtowerHarvester";
      name = "sth" + t;
      harvesters.push(name);
      southtowerHarvesters.push(name);
      parts = southHvParts3750;
      birth = true;
    } else if (attackers.length < 2 && Memory.nAttackerId) {
      parts = bigAttackerParts3250;
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
      parts = travelhvParts3000;
      direction = "north";
      harvestersN.push(name);
      birth = true;
    } else if (
      harvestersW.length < 3 &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      name += "W";
      parts = travelhvParts3000;
      direction = "west";
      harvestersW.push(name);
      birth = true;
    } else if (neworkers.length < 3) {
      neworkers.push(name);
      chosenRole = "neBuilder";
      buildRoom = "E36N32";
      name = chosenRole + t;
      parts = workerParts2900;
      birth = true;
    } else {
      chosenRole = "w";
      name = chosenRole + t;
      parts = workerParts2900;
      workers.push(name);
      birth = true;
    }

    if (birth) {
      retval = birthCreep(
        spawns,
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

  Memory.roadBuilders = roadBuilders;
  Memory.reservers = reservers;
  Memory.harvesters = harvesters;
  Memory.harvestersE59S47 = harvestersE59S47;
  Memory.harvestersE59S49 = harvestersE59S49;
  Memory.workers = workers;
  Memory.upControllers = upControllers;
  Memory.upControllersE59S47 = upControllersE59S47;
  Memory.upControllersE59S49 = upControllersE59S49;
  Memory.roadRepairers = roadRepairers;
  Memory.roadRepairersE59S47 = roadRepairersE59S47;
  Memory.roadRepairersE59S49 = roadRepairersE59S49;
  Memory.attackers = attackers;
  Memory.attackersE59S47 = attackersE59S47;
  Memory.attackersE59S49 = attackersE59S49;
  Memory.claimers = claimers;
  Memory.claimersE59S47 = claimersE59S47;
  Memory.claimersE59S49 = claimersE59S49;
  Memory.linkGets = linkGets;
  Memory.towerHarvesters = towerHarvesters;
}
spawnCreepTypes = profiler.registerFN(spawnCreepTypes, "spawnCreepTypes");

module.exports = spawnCreepTypes;
