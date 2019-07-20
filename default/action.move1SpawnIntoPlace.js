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
const smartMove = require("./action.smartMove");
const supplyChain = require("./supplyChain");

function spawnToSource1Chain(
  moverName,
  transportedName,
  dest,
  startHarvesting = true
) {
  let hv = Game.creeps[transportedName];
  let mv = Game.creeps[moverName];
  let source1 = Memory.source1;
  let s1 = Memory.s1;
  let energy;
  let needMover = false;
  let ext1 = Game.getObjectById("5ce6a1f809af315f015a8295");
  let ext2 = Game.getObjectById("5ce6a1f809af315f015a8295");

  if (!hv.pos.isNearTo(dest) || tr1.pos.x <= hv.pos.x) {
    console.log("Need to pull tr1 into place next to hv.");
    if (!mv.pos.isNearTo(tr1)) {
      console.log("moving to tow position:" + smartMove(mv, tr1, 1));
    } else if (
      !mv.pos.isEqualTo(
        new RoomPosition(hv.pos.x + 1, hv.pos.y - 1, hv.room.name)
      )
    ) {
      console.log(
        "pulling tr1." +
          chainMove(
            mv.name,
            [tr1.name],
            new RoomPosition(hv.pos.x + 1, hv.pos.y - 1, hv.room.name),
            0
          )
      );
    } else {
      try {
        console.log("pulling tr1  . " + chainMove(mv.name, [tr1.name], tr1, 0));
      } catch (e) {
        console.log(e.message);
        console.log(
          "pulling tr1." +
            chainMove(
              mv.name,
              [tr1.name],
              new RoomPosition(45, 5, hv.room.name),
              0
            )
        );
      }
    }
  }
}

module.exports = spawnToSource1Chain;
