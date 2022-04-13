const { Worker } = require("worker_threads");

let numberOfWorkers = 8;

let workers = [];

console.time("time taken");
while (numberOfWorkers--) {
  const worker = new Worker("./worker.js", {
    workerData: { id: numberOfWorkers },
  });
  workers.push(worker);

  worker.on("message", console.log);

  worker.on("exit", (exitCode) => {
    // console.log({ exitCode });
    if (exitCode === 0) {
      console.timeEnd("time taken");
      workers.forEach((w) => w.terminate());
    }
  });
}
