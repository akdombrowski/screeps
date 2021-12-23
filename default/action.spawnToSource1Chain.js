/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('supplyChain');
 * mod.thing == 'a thing'; // true
 *
 */
const chainMove = require("./chainMove");
const smartMove = require("./move.smartMove");
const supplyChain = require("./supplyChain");
const spawnChain = require("./spawnHarvesterChain");

function spawnToSource1Chain() {
  let hv = Game.creeps["harvester1"];
  let tr1 = Game.creeps["tr1"];
  let tr2 = Game.creeps["tr2"];
  let mv = Game.creeps["mover1"];
  // let movingChain = mv.memory ? mv.memory.movingChain : false;
  let hvNames = ["harvester1"];
  let trNames = ["tr1", "tr2"];
  let source1 = Memory.source1;
  let s1 = Memory.s1;
  let energy;
  let needMover = false;
  let exts = Memory.spawnExts;
  let stor1 = Game.getObjectById(Memory.store1);
  let linkEntrance = Game.getObjectById(Memory.linkEntranceId);
  let retval = -16;

  spawnChain(
    Game.rooms["E35N31"].energyAvailable,
    Game.rooms["E35N31"],
    s1,
    Memory.harvesters
  );

  try {
    if (tr1 && source1.energy <= 0) {
      tr1.withdraw(stor1, RESOURCE_ENERGY);
      retval = tr1.transfer(linkEntrance, RESOURCE_ENERGY);

      return retval;
    }
    if (!hv) {
      // console.log("hv");

      return retval;
    } else if (!tr1 && hv.pos.isNearTo(source1)) {
      retval = hv.harvest(source1);

      // console.log("tr1");
      return retval;
    } else if (!tr2 && hv.pos.isNearTo(source1)) {
      // console.log("tr2");
      retval = hv.harvest(source1);
      if (tr1) {
        supplyChainRetVal = supplyChain([tr1.name], hv.name, source1, s1);
      }
    }
  } catch (e) {
    console.log(e.message);
    return;
  }
  // harvester not next to source to harvest
  needMover = !hv.pos.isNearTo(source1);
  // is chain broken
  needMover = needMover || !tr1.pos.isNearTo(tr2) || !tr1.pos.isNearTo(hv);
  // is chain connected to spawn1
  needMover = needMover || !tr2.pos.isNearTo(tr1) || !tr2.pos.isNearTo(s1);

  if (needMover && !mv) {
    let direction = LEFT;
    if (
      Memory.s1.room.lookForAt(
        LOOK_CREEPS,
        Memory.s1.pos.x - 1,
        Memory.s1.pos.y
      )
    ) {
      if (Memory.enAvail >= 100) {
        Game.spawns.Spawn1.spawnCreep([MOVE, MOVE], "mover1", {
          memory: {
            role: "mover",
          },
        });
      }
    } else {
      Game.spawns.Spawn1.spawnCreep([MOVE, MOVE], "mover1", {
        memory: {
          role: "mover",
          directions: direction,
        },
      });
    }
  } else if (needMover) {
    // we have a mover, let's check if everyone is in the right spot
    if (hv && !hv.pos.isNearTo(source1)) {
      // we need to pull hv into place next to the source to harvest
      if (!mv.pos.isNearTo(hv)) {
        retval = smartMove(mv, hv, 1, false);
      } else {
        console.log(hv.name + " " + hv.pos);
        if (
          !mv.pos.isEqualTo(
            new RoomPosition(
              source1.pos.x + 1,
              source1.pos.y,
              source1.room.name
            )
          )
        ) {
          retval = chainMove(
            mv.name,
            hvNames,
            new RoomPosition(
              source1.pos.x + 1,
              source1.pos.y,
              source1.room.name
            ),
            0
          );
          console.log(mv.name + " Pulled " + retval);
        } else {
          try {
            retval = chainMove(mv.name, hvNames, hv, 0);
          } catch (e) {
            retval = chainMove(
              mv.name,
              hvNames,
              new RoomPosition(45, 5, hv.room.name),
              0
            );
          }
        }
      }
    } else if (tr1 && (!tr1.pos.isNearTo(hv) || tr1.pos.x <= hv.pos.x)) {
      if (!mv.pos.isNearTo(tr1)) {
        retval = smartMove(mv, tr1, 1, false);
      } else if (
        !mv.pos.isEqualTo(
          new RoomPosition(hv.pos.x + 1, source1.pos.y - 1, hv.room.name)
        )
      ) {
        retval = chainMove(
          mv.name,
          [tr1.name],
          new RoomPosition(hv.pos.x + 1, source1.pos.y - 1, hv.room.name),
          0
        );
      } else {
        try {
          retval = chainMove(mv.name, [tr1.name], tr1, 0);
        } catch (e) {
          console.log(e.message);
          retval = chainMove(
            mv.name,
            [tr1.name],
            new RoomPosition(43, 7, hv.room.name),
            0
          );
        }
      }
    } else if (tr2 && (!tr2.pos.isNearTo(tr1) || !tr2.pos.isNearTo(s1))) {
      if (!mv.pos.isNearTo(tr2)) {
        retval = smartMove(mv, tr2, 1, false);
      } else if ((mv.pos.x != 45 && mv.pos.y != 5) || tr2.pos.x <= tr1.pos.x) {
        retval = chainMove(
          mv.name,
          [tr2.name],
          new RoomPosition(45, 5, source1.room.name),
          0
        );
      } else {
        retval = chainMove(
          mv.name,
          [tr2.name],
          new RoomPosition(
            source1.pos.x + 3,
            source1.pos.y - 1,
            source1.room.name
          ),
          0
        );
      }
    }
  } else {
    let supplyChainRetVal = -16;

    try {
      let hvVal = hv.harvest(source1);
      let extRetVal = -16;
      let extretval1 = -16;
      let extretval2 = -16;
      let chainval = supplyChain([tr1.name, tr2.name], hv.name, source1, s1);

      if (chainval[0] != OK && _.sum(tr1.carry) > 0) {
        extRetVal = -17;
        _.forEach(exts, ext => {
          let e = Game.getObjectById(ext);

          if (tr1.pos.isNearTo(e) && e.energy < e.energyCapacity) {
            extretval1 = tr1.transfer(e, RESOURCE_ENERGY);
            if (extretval1 === OK) {
              tr1.say("se");
            } else {
              console.log("tr1 fail ext: " + extChainRetVal);
            }
          }
        });
      }
      if (chainval[1] != OK && _.sum(tr2.carry) > 0 && chainval[1] != OK) {
        extRetVal = -17;
        if (_.sum(exts) < 50) {
          _.forEach(exts, ext => {
            let e = Game.getObjectById(ext);
            if (tr2.pos.isNearTo(e) && e.energy < e.energyCapacity) {
              extretval2 = tr2.transfer(e, RESOURCE_ENERGY);

              if (extretval2 === OK) {
                tr2.say("se");
              } else {
                console.log("tr2 fail ext: " + e.pos + " " + extRetVal);
              }
            }
          });
        }
      }

      let retval1 = -16;
      let retval2 = -16;
      if (extRetVal === -17) {
        if (
          extretval1 != OK &&
          Memory.linkGets.length > 0 &&
          _.sum(tr1.carry) > 0
        ) {
          retval1 = tr1.transfer(linkEntrance, RESOURCE_ENERGY);
          if (retval1 === OK) {
            tr1.say("l." + retval);
          }
        }

        if (
          extretval2 != OK &&
          Memory.linkGets.length > 0 &&
          tr2.pos.isNearTo(linkEntrance)
        ) {
          retval2 = tr2.transfer(linkEntrance, RESOURCE_ENERGY);
          if (retval2 === OK) {
            tr2.say("l." + retval2);
          }
        }

        if (retval1 != OK && tr1.pos.isNearTo(stor1)) {
          retval1 = tr1.transfer(stor1, RESOURCE_ENERGY);
          if (retval1 === OK) {
            tr1.say("st1");
          }
        }

        if (retval2 != OK && tr2.pos.isNearTo(stor1)) {
          retval2 = tr2.transfer(stor1, RESOURCE_ENERGY);
          if (retval === OK) {
            tr2.say("st1");
          }
        }
      }
    } catch (e) {
      console.log(e + "\nstart supply chain err:" + supplyChainRetVal);
      // ignore
    }
  }
}

module.exports = spawnToSource1Chain;
