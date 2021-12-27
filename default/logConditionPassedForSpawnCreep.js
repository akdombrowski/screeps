const profiler = require("./screeps-profiler");

function logConditionPassedForSpawnCreep(
  creepType,
  creepTypeArray,
  conditionAmount
) {
  let numOfCurrentCreepTypes = Array.isArray(creepTypeArray)
    ? creepTypeArray.length
    : creepTypeArray;
  console.log(
    creepType +
      ":  " +
      numOfCurrentCreepTypes +
      " < " +
      conditionAmount +
      " = true"
  );
}
exports.logConditionPassedForSpawnCreep = logConditionPassedForSpawnCreep;
logConditionPassedForSpawnCreep = profiler.registerFN(
  logConditionPassedForSpawnCreep,
  "logConditionPassedForSpawnCreep"
);
