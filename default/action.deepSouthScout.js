const transferEnergy = require("./transferEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const buildRoad = require("./action.buildRoad");

const smartMove = require("./move.smartMove");
function scoutDeepSouth(creep, flag, path) {
  creep.memory.direction = "deepSouth";
  const northExit = Game.flags.deepSouthExit;
  const northEntrance = Game.flags.deepSouthEntrance1;

  if (creep.room === Memory.rm) {
    if (creep.pos.isNearTo(northExit)) {
      creep.move(BOTTOM);
      creep.say("Down");
    } else {
      smartMove(creep, northExit, 1);
    }
  } else {
    let retval = -16;
    let moved = true;
    if (creep.pos.x <= 5) {
      retval = creep.move(RIGHT);
      moved = retval === OK;
      console.log("R." + retval);
      creep.say("R." + retval);
    }

    if (moved < 0 || creep.pos.x >= 45) {
      retval = creep.move(LEFT);
      moved = retval === OK;
      creep.say("L." + retval);
    }

    if (moved < 0 || creep.pos.y <= 3) {
      retval = creep.move(BOTTOM);
      moved = retval === OK;
      creep.say = "down." + retval;
    }

    if (moved < 0 || creep.pos.y >= 47) {
      retval = creep.move(TOP);
      moved = retval === OK;
      creep.say("top." + retval);
    }
  }
}

module.exports = scoutDeepSouth;
