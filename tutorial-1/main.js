module.exports.loop = function () {
    Game.creeps.worker.harvest(Game.getObjectById("80060a92841a71d3dd3e0ec9"));
    let puller = Game.creeps.puller;
    let worker = Game.creeps.worker;
    // puller.moveTo(Game.getObjectById("80060a92841a71d3dd3e0ec9"));
    // puller.move(RIGHT);
    // puller.pull(worker);
    // worker.move(puller);
    // console.log(worker.transfer(Game.spawns.s1, RESOURCE_ENERGY));
    let carrier = Game.creeps.carrier;
    // console.log(carrier.pickup(RESOURCE_ENERGY));
    // puller.moveTo(Game.getObjectById("48f012c5010a2e6d9259ca64"));
    let c3 = Game.creeps.carrier3;
    puller.moveTo(new RoomPosition(20, 15, "sim"));
    puller.pull(worker);
    puller.pull(c3);
    worker.move(puller);
    c3.move(puller);
    worker.pull(carrier);
    carrier.move(worker);
    // console.log(Game.creeps.carrier3.pickup(Game.getObjectById("d6af1fa79da504d009bf9c06")));
    console.log(Game.creeps.carrier3.transfer(Game.spawns.s1, RESOURCE_ENERGY))
}