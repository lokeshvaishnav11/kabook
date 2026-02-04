// import 'reflect-metadata'
// import { cpus } from 'node:os'
// import cluster from 'node:cluster'

// import App from './providers/App'
// import NativeEvent from './exception/NativeEvent'
// import UserSocket from './sockets/user-socket'
// import CasinoSocket from './sockets/casino-socket'

// if (cluster.isMaster) {
//   /**
//    * Catches the process events
//    */
//   NativeEvent.process()

//   /**
//    * Clear the console before the app runs
//    */
//   App.clearConsole()

//   /**
//    * Load Configuration
//    */
//   App.loadConfiguration()

//   /**
//    * Find the number of available CPUS
//    */
//   const CPUS: any = cpus()
//   /**
//    * Fork the process, the number of times we have CPUs available
//    */
//   CPUS.forEach(() => cluster.fork())

//   /**
//    * Catches the cluster events
//    */
//   NativeEvent.cluster(cluster)
//   new CasinoSocket()

// } else {
//   /**
//    * Run the Database pool
//    */
//   App.loadDatabase()

//   /**
//    * Run the Server on Clusters
//    */
//   App.loadServer()

//   new UserSocket()
// }


import 'reflect-metadata';
import cluster from 'node:cluster';
import { cpus } from 'node:os';

import App from './providers/App';
import NativeEvent from './exception/NativeEvent';
import UserSocket from './sockets/user-socket';
import CasinoSocket from './sockets/casino-socket';
import { startCronJob } from './controllers/cronController';

const CPU_COUNT = cpus().length;

if (cluster.isMaster) {
  console.log(`Master process started (PID: ${process.pid})`);
  console.log(`CPU Cores Available: ${CPU_COUNT}`);

  // Load basic configurations
  App.loadConfiguration();
  App.loadDatabase();
  NativeEvent.process();

  // -----------------------------
  // 🚀 1. Fork API Workers
  // -----------------------------
  for (let i = 0; i < CPU_COUNT; i++) {
    cluster.fork({ WORKER_TYPE: "API" });
  }

  // -----------------------------
  // 🚀 2. Fork Dedicated Cron Worker
  // -----------------------------
  cluster.fork({ WORKER_TYPE: "CRON" });

  // Listen to cluster events
  NativeEvent.cluster(cluster);

} else {
  // ======================================================
  // === WORKER PROCESS ===================================
  // ======================================================

  const workerType = process.env.WORKER_TYPE;

  // ======================================================
  // 🔵 API WORKERS (Handle HTTP + Betting + Users)
  // ======================================================
  if (workerType === "API") {
    console.log(`API Worker Started (PID: ${process.pid})`);

    App.loadDatabase();
    App.loadServer();

    // Init sockets for API worker
    new UserSocket();
    new CasinoSocket();

  // ======================================================
  // 🟡 CRON WORKER (Only cron jobs)
  // ======================================================
  } else if (workerType === "CRON") {
    console.log(`CRON Worker Started (PID: ${process.pid})`);

    App.loadDatabase();

    // Init sockets for cron worker (needed for exposer/balance updates)
    new UserSocket();
    new CasinoSocket();

    // Start cron jobs
    startCronJob();
  }
}
