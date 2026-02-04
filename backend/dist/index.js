"use strict";
// import 'reflect-metadata'
// import { cpus } from 'node:os'
// import cluster from 'node:cluster'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
require("reflect-metadata");
const node_cluster_1 = __importDefault(require("node:cluster"));
const node_os_1 = require("node:os");
const App_1 = __importDefault(require("./providers/App"));
const NativeEvent_1 = __importDefault(require("./exception/NativeEvent"));
const user_socket_1 = __importDefault(require("./sockets/user-socket"));
const casino_socket_1 = __importDefault(require("./sockets/casino-socket"));
const cronController_1 = require("./controllers/cronController");
const CPU_COUNT = (0, node_os_1.cpus)().length;
if (node_cluster_1.default.isMaster) {
    console.log(`Master process started (PID: ${process.pid})`);
    console.log(`CPU Cores Available: ${CPU_COUNT}`);
    // Load basic configurations
    App_1.default.loadConfiguration();
    App_1.default.loadDatabase();
    NativeEvent_1.default.process();
    // -----------------------------
    // 🚀 1. Fork API Workers
    // -----------------------------
    for (let i = 0; i < CPU_COUNT; i++) {
        node_cluster_1.default.fork({ WORKER_TYPE: "API" });
    }
    // -----------------------------
    // 🚀 2. Fork Dedicated Cron Worker
    // -----------------------------
    node_cluster_1.default.fork({ WORKER_TYPE: "CRON" });
    // Listen to cluster events
    NativeEvent_1.default.cluster(node_cluster_1.default);
}
else {
    // ======================================================
    // === WORKER PROCESS ===================================
    // ======================================================
    const workerType = process.env.WORKER_TYPE;
    // ======================================================
    // 🔵 API WORKERS (Handle HTTP + Betting + Users)
    // ======================================================
    if (workerType === "API") {
        console.log(`API Worker Started (PID: ${process.pid})`);
        App_1.default.loadDatabase();
        App_1.default.loadServer();
        // Init sockets for API worker
        new user_socket_1.default();
        new casino_socket_1.default();
        // ======================================================
        // 🟡 CRON WORKER (Only cron jobs)
        // ======================================================
    }
    else if (workerType === "CRON") {
        console.log(`CRON Worker Started (PID: ${process.pid})`);
        App_1.default.loadDatabase();
        // Init sockets for cron worker (needed for exposer/balance updates)
        new user_socket_1.default();
        new casino_socket_1.default();
        // Start cron jobs
        (0, cronController_1.startCronJob)();
    }
}
//# sourceMappingURL=index.js.map