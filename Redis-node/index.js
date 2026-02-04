// const express = require("express")
// const Redis = require("ioredis");
// const http = require('http');
// const { Server } = require('socket.io');
// const mongoose = require("mongoose");
// const Match = require('./models/Match.model');
// const Market = require("./models/Market.model")
// const { default: axios } = require("axios");
// // const app = express()
// // const dsn ="mongodb+srv://365infayou:Jv9lwv6csl7J1Jp5@cluster365.sxln4q8.mongodb.net/infa?retryWrites=true&w=majority&appName=Cluster365&tlsAllowInvalidCertificates=true";
// const dsn = "mongodb://admin:Diamond11123@72.61.19.197:27017/infa?authSource=admin&replicaSet=rs0";
// //  const dsn = "mongodb+srv://infayou:HkrflNhX6UxHLSqC@cluster0.zbf0n.mongodb.net/infa?retryWrites=true&w=majority&appName=Cluster0&tlsAllowInvalidCertificates=true";
// const setConnection = async () => {
//   await mongoose.connect(dsn).then(() => {
//     console.log("DataBase Connected Succesfully")
//   }).catch((err) => {
//     console.log("error in connecting DataBase", err)
//   })
// }

// const app = express()
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*", // allow all origins (for development)
//     methods: ["GET", "POST"]
//   }
// });

// setConnection()
// app.use(express.json());


// // function for checking MatchList that we have data to need 

// let match = []
// let MarketIds = []
// const getMatchid = async () => {
//   matchi = await Match.find({ active: true })
//   // console.log("xxx")
//   match = matchi
//   //  console.log(match)
//   // return match;

// }



// console.log(match, "match")


// setInterval(getMatchid, 1000)
// getMatchid().then((res) => {
//   // console.log(res,"response is here",res.length)
//   // console.log(MatchIds,MarketIds,"MatchIds is here ")
// }).catch((err) => {
//   console.log("error in fetching data from Match", err)
// })




// // connnection for publisher hahha 

// const publisher = new Redis({
//   host: "127.0.0.1",
//   port: 6379,
//   // password: "yourpassword", // if Redis is secured
// });


// const FancyData = {}

// const getFancyDataApi = () => {
//   // console.log(match)
//   if (match.length > 0) {
//     match.forEach((m) => {
//       axios.get(`http://130.250.191.174:3009/getPriveteData?gmid=${m?.matchId}&sid=${m?.sportId}&key=dijbfuwd719e12rqhfbjdqdnkqnd11eqdqd`).then((res) => {
//         // console.log(res.data.data, "Fancy  data is Here hahaha")
//         FancyData[m?.matchId] = res?.data?.data
//         // console.log(res.data.data)
//         // console.log(FancyData,"Fancy Data haaha")
//       }).catch((err) => {
//         console.log("error in fetching Fancy data from api", err)
//       })
//     })
//   }
// }


// // const formattedFancyData = async () => {
// //   for (const m of MatchIds) {
// //     const data = FancyData[m];
// //     if (!data || !data.fancy || data.fancy.length === 0) continue;

// //     const fancydata = data.fancy
// //       .filter(f => 
// //         f.marketType !== "MATCH_ODDS" &&
// //         f.marketType !== "The Draw" &&
// //         f.marketType !== "BOOKMAKER"
// //       )
// //       .map(f => ({


// //         BackPrice1: f.runsYes,
// //         BackPrice2: 0,
// //         BackPrice3: 0,
// //         BackSize1: f.oddsYes,
// //         BackSize2: 0,
// //         BackSize3: 0,
// //         LayPrice1: f.runsNo,
// //         LayPrice2: 0,
// //         LayPrice3: 0,
// //         LaySize1: f.oddsNo,
// //         LaySize2: 0,
// //         LaySize3: 0,
// //         RunnerName: f.marketName,
// //         SelectionId: f?.marketCondition?.marketId.toString(),
// //         ballsess: "1",
// //         gtype:
// //           f.catagory === "SESSIONS"
// //             ? "session"
// //             : f.catagory === "ODD_EVEN"
// //             ? "oddeven"
// //             : f.catagory?.toLowerCase(),
// //         GameStatus: "",
// //         gtstatus: "",
// //         max: "50000",
// //         min: "100",
// //         remm: "",
// //         srno: f.sortingOrder.toString(),
// //         mname:
// //           f.catagory === "SESSIONS"
// //             ? "session"
// //             : f.catagory === "ODD_EVEN"
// //             ? "oddeven"
// //             : f.catagory?.toLowerCase() === "w/p/xtra"
// //             ? "session"
// //             : f?.catagory?.toLowerCase(),
// //       }));

// //     await publisher.set(`fancy-${m}`, JSON.stringify(fancydata));
// //     console.log(`Saved fancy-${m} to Redis ✅`);
// //   }
// // };



// console.log(FancyData, 'fancydata ')
// // const formattedFancyData = async () => {
// //   for (const m of match) {
// //     console.l
// //     const data = FancyData[m.matchId];

// //     // console.log(data, "data");

// //     // if (!data || !data?.data || data?.data.length === 0) continue;

// //     const fancydata = data
// //       ?.filter(fb => fb.mname != "Bookmaker" || fb.mname != "MATCH_ODDS" || fb.mname != "TIED_MATCH")
// //       ?.flatMap(f =>
// //         f.section.map(fa => ({
// //           BackPrice1: fa.odds[0]?.odds || 0,
// //           BackPrice2: 0,
// //           BackPrice3: 0,
// //           BackSize1: fa.odds[0]?.size || 0,
// //           BackSize2: 0,
// //           BackSize3: 0,
// //           LayPrice1: fa.odds[1]?.odds || 0,
// //           LayPrice2: 0,
// //           LayPrice3: 0,
// //           LaySize1: fa.odds[1]?.size || 0,
// //           LaySize2: 0,
// //           LaySize3: 0,
// //           RunnerName: fa?.nat,
// //           SelectionId: fa?.sid,
// //           ballsess: "1",
// //           gtype: f?.gtype,
// //           GameStatus: "",
// //           gtstatus: f?.gstatus,
// //           max: "50000",
// //           min: "100",
// //           remm: "",
// //           srno: fa?.sno?.toString(),
// //           mname: f?.mname,
// //         }))
// //       );

// //     // console.log(fancydata, "fancydata is here");

// //     await publisher.set(`fancy-${m.matchId}`, JSON.stringify(fancydata));
// //     console.log(`Saved fancy-${m.matchId} to Redis ✅`);
// //   }
// // };


// const formattedFancyData = async () => {
//   for (const m of match) {
//     try {
//       const data = FancyData[m.matchId];

//       if (!data || data.length === 0) continue;

//       const fancydata = data
//         ?.filter(
//           fb =>
//             fb.mname != "Bookmaker" ||
//             fb.mname != "MATCH_ODDS" ||
//             fb.mname != "TIED_MATCH"
//         )
//         ?.flatMap(f =>
//           f.section.map(fa => ({
//             BackPrice1: fa.odds[0]?.odds || 0,
//             BackPrice2: 0,
//             BackPrice3: 0,
//             BackSize1: fa.odds[0]?.size || 0,
//             BackSize2: 0,
//             BackSize3: 0,
//             LayPrice1: fa.odds[1]?.odds || 0,
//             LayPrice2: 0,
//             LayPrice3: 0,
//             LaySize1: fa.odds[1]?.size || 0,
//             LaySize2: 0,
//             LaySize3: 0,
//             RunnerName: fa?.nat,
//             SelectionId: fa?.sid,
//             ballsess: "1",
//             gtype: f?.gtype,
//             GameStatus: "",
//             gtstatus: f?.gstatus,
//             max: "50000",
//             min: "100",
//             remm: "",
//             srno: fa?.sno?.toString(),
//             mname: f?.mname,
//           }))
//         );

//       // 🔹 Fetch previous fancy from Redis
//       const previousFancyStr = await publisher.get(`fancy-${m.matchId}`);
//       let pfancy = [];
//       if (previousFancyStr) {
//         try {
//           pfancy = JSON.parse(previousFancyStr);
//         } catch (e) {
//           console.error("Invalid JSON for key:", `fancy-${m.matchId}`, e);
//         }
//       }

//       const currentSelectionIds = new Set(fancydata.map(item => item.SelectionId));
//       const previousSelectionIds = new Set(pfancy.map(item => item.SelectionId));

//       // 🔹 Emit new fancies
//       for (const item of fancydata) {
//         if (!previousSelectionIds.has(item.SelectionId)) {
//           io.emit("newFancyAdded", {
//             fancy: { matchId: m.matchId, ...item },
//             matchId: m.matchId,
//           });
//         }
//       }

//       // 🔹 Emit deactivated fancies
//       const deactivated = pfancy.filter(oldItem => !currentSelectionIds.has(oldItem.SelectionId));
//       if (deactivated.length > 0) {
//         io.emit("deactivateFancy", {
//           [m.matchId]: deactivated.map(d => d.SelectionId.toString()),
//         });
//       }

//       // 🔹 Save updated fancy to Redis
//       await publisher.set(`fancy-${m.matchId}`, JSON.stringify(fancydata));
//       console.log(`Saved fancy-${m.matchId} to Redis ✅`);

//     } catch (err) {
//       console.error(`Error processing match ${m.matchId}:`, err.message || err);
//     }
//   }
// };








// const MatchOddsData = async () => {
//   const promises = MatchIds.map(id =>
//     axios.get(`http://195.110.59.236:3000//ssdfgfds/.allMatchData/4/${id}ghjk`)
//       .then(res => ({ status: 'fulfilled', data: res.data, marketId: id }))
//       .catch(err => ({ status: 'rejected', error: err.message, marketId: id }))
//   );

//   const results = await Promise.allSettled(promises);

//   results.forEach(async (result, index) => {
//     if (result.status === 'fulfilled') {
//       const { marketId, data } = result.value;
//       const Data = data?.[0]
//       // console.log(`✅ Market ID: ${marketId}`, Data);

//       // const ParseData = {
//       //     betDelay:data.betDelay,
//       //     bspReconciled:data.bspReconciled,
//       //     complete:data.complete,
//       //     crossMatching:data.crossMatching,
//       //     inplay:data.inplay,
//       //     isMarketDataDelayed:data.isMarketDataDelayed,
//       //     lastMatchTime:data.lastMatchTime,
//       //     marketId:marketId,
//       //     numberOfActiveRunners:

//       // }

//       if (Data) {
//         // const jsonMessage = JSON.stringify(Data);
//         // console.log(Data.runners[0].ex.availableToBack,Data,"jsonMessage")

//         const adjustMarketData = (market) => {
//           if (!market.runners) return market;

//           market.runners = market.runners.map((runner) => {
//             if (!runner.ex) return runner;

//             // Adjust back prices: Decrease by 0.3
//             runner.ex.availableToBack = (runner.ex.availableToBack || []).map(b => ({
//               price: (parseFloat((b.price - 0.3))),
//               size: b.size
//             }));

//             // Adjust lay prices: Increase by 0.3
//             runner.ex.availableToLay = (runner.ex.availableToLay || []).map(l => ({
//               price: (parseFloat((l.price + 0.3))),
//               size: l.size
//             }));

//             return runner;
//           });

//           return market;
//         };
//         const dataone = adjustMarketData(Data)
//         // console.log(dataone,"xyz zyz")
//         const jsonMessage = JSON.stringify(dataone);


//         await publisher.set(`odds-market-${marketId}`, jsonMessage);


//         publisher.publish("getMarketData", jsonMessage);
//         // console.log("📤 Published:", dataone.runner[0]);
//       }

//     } else {
//       const { marketId, error } = result.reason || result;
//       console.error(`❌ Failed to fetch Market ID ${marketId}:`, error);
//     }
//   });
// };



// // BookMaker Market Odds Mangment 
// const BookMakerOddsData = async () => {
//   // const promises = MatchIds.map(id =>
//   //   axios.get(`http://195.110.59.236:3000/allMatchData/4/${id}`)
//   //     .then(res => ({ status: 'fulfilled', data: res.data, marketId: id}))
//   //     .catch(err => ({ status: 'rejected', error: err.message, marketId: id }))
//   // );

//   // const results = await Promise.allSettled(promises);

//   match.forEach(async (m, index) => {
//     if (true) {

//       // console.log(data,"data is ")

//       const fData = FancyData[m.matchId]?.filter((m) => m.gtype.includes('match'))
//       const bData = fData
//       console.log(bData, "Data is here ")


//       if (bData?.length > 0) {

//       bData.map(async(Data)=>{


//         const transformRunners = (inputRunners) => {
//           return {
//             runners: inputRunners.map(runner => {
//               // Filter out zero-priced odds
//               // console.log(runner,"runner is here")
//               const backOdds = runner.odds.filter(odd => odd.otype == "back");
//               const layOdds = runner.odds.filter(odd => odd.otype == "lay");

//               const backoddsmain = backOdds?.reverse()?.map((m) => {
//                 return {
//                   size: m.size,
//                   price: m.odds
//                 }
//               })

//               const layoddsmain = layOdds.map((m) => {
//                 return {
//                   size: m.size,
//                   price: m.odds
//                 }
//               })
//               console.log(layoddsmain, backoddsmain, "FGHJ")

//               // Estimate lastPriceTraded as midpoint between best back and lay
//               let lastPriceTraded = null;
//               if (backOdds.length > 0 && layOdds.length > 0) {
//                 lastPriceTraded = (backOdds[0].price + layOdds[0].price) / 2;
//               }

//               return {
//                 selectionId: runner.sid,
//                 status: runner.gstatus,
//                 lastPriceTraded: lastPriceTraded,
//                 runnerName: runner.nat,
//                 totalMatched: 0,
//                 ex: {
//                   availableToBack: backoddsmain,
//                   availableToLay: layoddsmain
//                 }
//               };
//             })
//           };
//         };
//         const output = transformRunners(Data?.section)
//         console.log(output.runners, "output")
//         Data.runners = output.runners
//         Data.marketName = Data.mname
//         Data.marketId = Data.mid.toString();
//         Data.matchId = Data.gmid.toString();

//         const jsonMessage = JSON.stringify(Data);


//         await publisher.set(`odds-market-${Data.marketId}`, jsonMessage);


//         publisher.publish("getMarketData", jsonMessage);
//         // console.log("📤 Published:", jsonMessage);
//           })
//       }

//     } else {
//       const { marketId, error } = result.reason || result;
//       console.error(`❌ Failed to fetch Market ID ${marketId}:`, error);
//     }
//   });
// };

// setInterval(getFancyDataApi, 1000)

// // setInterval(MatchOddsData,1000)

// setInterval(formattedFancyData, 2000)

// setInterval(BookMakerOddsData,2000)


// // Fancy Result Hahahahahah
// let FancyList = null

// const FancyResult = async () => {
//   try {
//     for (const id of MatchIds) {
//       const response = await axios(`http://69.62.123.205:7000/api/v/event-result?eventid=${id}`);

//       const data = response.data;

//       // ✅ Process the data here safely, one-by-one
//       // await performOperation(data); // <-- your logic goes here
//       data.items.map((d) => {
//         FancyList.map(async (f) => {
//           if (f?.matchId == id) {
//             if (d?.marketName == f?.selectionName) {
//               const data = {
//                 message: 'ok',
//                 matchId: f?.matchId,
//                 marketId: f?.selectionId,
//                 result: d?.payload?.marketResultSummary?.winnerId,
//                 RunnerName: f?.selectionName

//               }
//               await axios.post("https://api.newdiamond365.com/api/update-fancy-result", data)

//             }
//           }
//         })
//       })
//     }

//     console.log("All market results processed successfully.");
//   } catch (error) {
//     console.error("Error in FancyResult cron job:", error);
//   }
// };

// const getFancyList = async () => {
//   const res = await axios.get('https://api.newdiamond365.com/api/get-business-fancy-list')
//   console.log(res.data.data.list, "Fancy List is Here")
//   FancyList = res.data?.data?.list
// }

// // setInterval(getFancyList,1000*60);

// // setInterval(FancyResult,1000*60*2)


// publisher.on('connect', () => {
//   console.log(` sucessfully connected to redis hahah !`)
// })


// //   setInterval(() => {
// //     const payload = {
// //       type: "getMarketData",
// //       timestamp: new Date().toISOString(),
// //       message: "Hello from publisher"
// //     };

// // const jsonMessage = JSON.stringify(payload);

// // publisher.publish("getMarketData", jsonMessage);
// // console.log("📤 Published:", payload);
// //   }, 3000);






// const PORT = 3030;

// server.listen(PORT, () => {
//   console.log(`server is Listeing on ${PORT}`)
// })





const express = require("express");
const Redis = require("ioredis");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const axios = require("axios").default;

const Match = require("./models/Match.model");

const dsn =
  "mongodb://admin:Diamond11123@72.61.19.197:27017/infa?authSource=admin&replicaSet=rs0";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

// ---------------- DB Connection ----------------
const setConnection = async () => {
  try {
    await mongoose.connect(dsn);
    console.log("✅ DataBase Connected Successfully");
  } catch (err) {
    console.log("❌ error in connecting DataBase", err);
    process.exit(1);
  }
};

// ---------------- Redis Connection ----------------
const publisher = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

publisher.on("connect", () => {
  console.log("✅ Successfully connected to Redis");
});

publisher.on("error", (err) => {
  console.log("❌ Redis error:", err?.message || err);
});

// ---------------- In-memory store ----------------
let matches = []; // active matches list
const FancyData = {}; // FancyData[matchId] = array

// ---------------- Fetch active matches ----------------
const getMatches = async () => {
  try {
    const list = await Match.find({ active: true }).lean();
    matches = list || [];
    // console.log("Active matches:", matches.length);
  } catch (err) {
    console.log("❌ error in fetching matches:", err?.message || err);
  }
};

// ---------------- Fetch Fancy API Data ----------------
const getFancyDataApi = async () => {
  try {
    if (!matches || matches.length === 0) return;

    // parallel requests (but safe)
    await Promise.all(
      matches.map(async (m) => {
        try {
          const url = `http://130.250.191.174:3009/getPriveteData?gmid=${m?.matchId}&sid=${m?.sportId}&key=dijbfuwd719e12rqhfbjdqdnkqnd11eqdqd`;
          const res = await axios.get(url);

          FancyData[m?.matchId] = res?.data?.data || [];
        } catch (err) {
          console.log(
            `❌ Fancy API error matchId=${m?.matchId}:`,
            err?.message || err
          );
        }
      })
    );
  } catch (err) {
    console.log("❌ getFancyDataApi error:", err?.message || err);
  }
};

// ---------------- Format fancy + Redis store + socket emit ----------------
const formattedFancyData = async () => {
  try {
    if (!matches || matches.length === 0) return;

    for (const m of matches) {
      const data = FancyData[m.matchId];

      if (!data || !Array.isArray(data) || data.length === 0) continue;

      // ✅ FIXED FILTER (must be &&)
      const fancydata = data
        .filter(
          (fb) =>
            fb.mname !== "Bookmaker" &&
            fb.mname !== "MATCH_ODDS" &&
            fb.mname !== "TIED_MATCH"
        )
        .flatMap((f) =>
          (f.section || []).map((fa) => ({
            BackPrice1: fa?.odds?.[0]?.odds || 0,
            BackPrice2: 0,
            BackPrice3: 0,
            BackSize1: fa?.odds?.[0]?.size || 0,
            BackSize2: 0,
            BackSize3: 0,

            LayPrice1: fa?.odds?.[1]?.odds || 0,
            LayPrice2: 0,
            LayPrice3: 0,
            LaySize1: fa?.odds?.[1]?.size || 0,
            LaySize2: 0,
            LaySize3: 0,

            RunnerName: fa?.nat,
            SelectionId: fa?.sid,

            ballsess: "1",
            gtype: f?.gtype,
            GameStatus: fa?.gstatus,
            gtstatus: fa?.gstatus,

            max: "50000",
            min: "100",
            remm: "",
            srno: fa?.sno?.toString(),
            mname: f?.mname,
          }))
        );

      const redisKey = `fancy-${m.matchId}`;

      // previous fancy from redis
      const previousFancyStr = await publisher.get(redisKey);
      let pfancy = [];
      if (previousFancyStr) {
        try {
          pfancy = JSON.parse(previousFancyStr);
        } catch (e) {
          pfancy = [];
        }
      }

      const currentSelectionIds = new Set(
        fancydata.map((item) => item.SelectionId)
      );
      const previousSelectionIds = new Set(
        pfancy.map((item) => item.SelectionId)
      );

      // Emit new fancy added
      for (const item of fancydata) {
        if (!previousSelectionIds.has(item.SelectionId)) {
          io.emit("newFancyAdded", {
            fancy: { matchId: m.matchId, ...item },
            matchId: m.matchId,
          });
        }
      }

      // Emit deactivated fancy
      const deactivated = pfancy.filter(
        (oldItem) => !currentSelectionIds.has(oldItem.SelectionId)
      );

      if (deactivated.length > 0) {
        io.emit("deactivateFancy", {
          [m.matchId]: deactivated.map((d) => d.SelectionId?.toString()),
        });
      }

      // Save updated fancy to Redis
      await publisher.set(redisKey, JSON.stringify(fancydata));
      console.log(`✅ Saved ${redisKey} to Redis`);
    }
  } catch (err) {
    console.log("❌ formattedFancyData error:", err?.message || err);
  }
};

// ---------------- BookMaker Odds Data ----------------
const BookMakerOddsData = async () => {
  try {
    if (!matches || matches.length === 0) return;

    for (const m of matches) {
      const allFancy = FancyData[m.matchId];
      if (!allFancy || !Array.isArray(allFancy)) continue;

      // Bookmaker / match type
      const bData = allFancy.filter((x) => {
        const gtype = (x?.gtype || "").toLowerCase();

        return (
          gtype.includes("match") ||
          gtype.includes("cricketcasino")
        );
      });


      if (!bData || bData.length === 0) continue;

      for (const Data of bData) {
        try {
          const transformRunners = (inputRunners) => {
            return {
              runners: (inputRunners || []).map((runner) => {
                const oddsArr = runner?.odds || [];

                const backOdds = oddsArr.filter((odd) => odd.otype === "back");
                const layOdds = oddsArr.filter((odd) => odd.otype === "lay");

                const backoddsmain = [...backOdds]
                  .reverse()
                  .map((x) => ({ size: x.size, price: x.odds }));

                const layoddsmain = layOdds.map((x) => ({
                  size: x.size,
                  price: x.odds,
                }));

                return {
                  selectionId: runner.sid,
                  status: runner.gstatus.toUpperCase(),
                  lastPriceTraded: null,
                  runnerName: runner.nat,
                  totalMatched: 0,
                  ex: {
                    availableToBack: backoddsmain,
                    availableToLay: layoddsmain,
                  },
                };
              }),
            };
          };

          const output = transformRunners(Data?.section);

          const marketPayload = {
            ...Data,
            runners: output.runners,
            marketName: Data?.mname,
            marketId: Data?.mid?.toString(),
            matchId: Data?.gmid?.toString(),
          };

          if (!marketPayload.marketId) continue;

          const jsonMessage = JSON.stringify(marketPayload);

          await publisher.set(`odds-market-${marketPayload.marketId}`, jsonMessage);
          publisher.publish("getMarketData", jsonMessage);
        } catch (err) {
          console.log(
            `❌ BookMakerOddsData matchId=${m.matchId} error:`,
            err?.message || err
          );
        }
      }
    }
  } catch (err) {
    console.log("❌ BookMakerOddsData error:", err?.message || err);
  }
};

// ---------------- Start App ----------------
const start = async () => {
  await setConnection();

  // initial fetch
  await getMatches();
  await getFancyDataApi();

  // 🔥 Intervals (optimized)
  setInterval(getMatches, 5000); // every 5 sec (not 1 sec)
  setInterval(getFancyDataApi, 2000);
  setInterval(formattedFancyData, 2500);
  setInterval(BookMakerOddsData, 2500);

  const PORT = 3030;
  server.listen(PORT, () => {
    console.log(`🚀 Socket Server running on port ${PORT}`);
  });
};

start();
