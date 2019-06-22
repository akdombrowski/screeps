const moveAwayFromCreep = require("./action.moveAwayFromCreep");

function smartMove(
    creep,
    dest,
    range,
    ignoreCreeps = true,
    pathColor = "#ffffff",
    pathMem = 2000,
    maxOps = 100
) {
    let retVal = -16;
    ignoreCreeps = ignoreCreeps;
    pathColor = pathColor || "#ffffff";
    pathMem = pathMem || 2000;
    maxOps = maxOps || 100;

    if (creep.fatigue > 0) {
        creep.say("f." + creep.fatigue);
        return ERR_TIRED;
    }

    if (
        moveAwayFromCreep(creep) ||
        !ignoreCreeps //||
    ) {
        pathMem = 0;
        ignoreCreeps = false;
        creep.say("out of my way creep");
    }

    retval = creep.moveTo(dest, {
        reusePath: pathMem,
        ignoreCreeps: ignoreCreeps,
        range: range,
        maxOps: maxOps,
        serializeMemory: true,
        visualizePathStyle: { stroke: pathColor }
    });
    if (retval === ERR_NO_PATH) {
        retval = creep.moveTo(dest, {
            reusePath: 0,
            ignoreCreeps: ignoreCreeps,
            range: range,
            maxOps: maxOps,
            serializeMemory: true,
            visualizePathStyle: { stroke: pathColor }
        });
    }
    creep.say("m." + retval);
    return retval;
}

module.exports = smartMove;