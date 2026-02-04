import { Request, Response } from "express";
import { ApiController } from "./ApiController";
import { redisReplica } from "../../database/redis";
import { eventJson, types } from "../../utils/casino-types";
import { marketFormatter } from "../../utils/helper";
import axios from "axios";

export default class CasinoController extends ApiController {
  getCasinoMarket = async (req: Request, res: Response) => {
    let time1 = Date.now()

    let { type, selectionId } = req.params;
    console.log(type,"FGHJKI")
    console.log(type)
    try {
      if (!type) this.fail(res, "type is required field");

      if (type === "AAA") type = "aaa";

       console.log("fghjkl")

      const [response, resultResponse] = await Promise.all([
        axios.get(`http://69.62.123.205:3000/tabledata2/${type}`),
        axios.get(`http://69.62.123.205:3000/casinoresult2/${type}`)
      ]);


      // console.log(response,resultResponse.data,"hello world")

      console.log('Api time', Date.now() - time1)

      let data = response.data;
      // console.log(data)
      data = data ? data : { data: [] };
      let markets: any = [];
      let results: any = [];
      let t1: any = {};
      let t3: any = null;
      let t4: any = null;
      let scoreCards: any = undefined;
      let tv: string = "";

      // console.log(resultResponse.data)

      results = resultResponse?.data?.data?.res ?? [];

      if(type === 'worli3'){
         return this.success(res, { data,results });
      }

      if (data?.data?.t3) {
        markets = [...markets, ...data?.data?.t3];
        t3 = data?.data?.t3;
      }
      if (data?.data?.t4) {
        markets = [...markets, ...data?.data?.t4];
        t4 = data?.data?.t4;
      }

      if (data?.data?.bf) markets = [...data?.data?.bf];


      if (data?.data?.t1) t1 = data?.data?.t1;


      if (data?.data?.sub) markets = [...data?.data?.sub]

      if (data?.data?.t2) markets = [...data?.data?.t2];

      if(type === 'ab3' || type === 'ab4'){
        markets = [...data?.data?.child]
      }

      return eventJson[type == '3cardj' ? 'Cards3J' : type]()
        .then(async (jsonData: any) => {
          const cloneJsonData = JSON.parse(JSON.stringify(jsonData.default));
          if (type != "teen91") {

            if (type === "cricketv3") {
              const scoreData = await redisReplica.hGetAll(
                `fivewicket-t1-${t1.mid}`
              );
              if (scoreData) {
                const { scoreCard } = scoreData;
                if (scoreCard) scoreCards = JSON.parse(scoreCard);
              }
            }
            // if (type === "superover") {
            //   const scoreData = await redisReplica.hGetAll(
            //     `Superover-t1-${t1.mid}`
            //   );
            //   if (scoreData) {
            //     const { scoreCards: scoreCard } = scoreData;
            //     scoreCards = JSON.parse(scoreCard).scoreCard;
            //   }
            // }
            const marketData = marketFormatter(markets, cloneJsonData);
            // console.log(tv,'tv')
            let eventData = {
              ...cloneJsonData,
              ...t1,
              match_id: t1?.mid ?? t1?.gmid,
              results,
              tv,
              defaultMarkets: cloneJsonData.event_data.market,
              scoreCard: scoreCards,
            };
            let mid = data?.data?.mid
            if (type == 'superover') {
              mid = data?.data?.t1?.gmid
            }
            const desc = data?.data?.rdesc
            const autotime = data?.data?.lt
            const min = data?.data?.sub[0]?.min
            const max = data?.data?.sub[0]?.max
            const cards = data?.data?.card?.split(',')
            const score = data?.data?.score ?? ''
            const cardObj: any = {};
            const ar = data?.data?.ares ?? ''
            const br = data?.data?.bres ?? ''
            const aall = data?.data?.aall ?? ''
             const ball = data?.data?.ball ?? ''
             const lcard = data?.data?.lcard ?? ''
             const csum = data?.data?.csum ?? ''
            cards.forEach((value: any, index: any) => {
              cardObj[`C${index + 1}`] = value;
            });
            eventData = {
              ...eventData,
              autotime,
              mid,
              max,
              min,
              desc,
              score,
              cards: data?.data?.card,
              match_id: mid,
              ar,
              br,
              aall,ball,lcard,csum,
              ...cardObj
            }
            if (data?.data) {

              const C1A = cards[0] ?? '1'
              const C2A = cards[2] ?? '1'
              const C3A = cards[4] ?? '1'
              const C1B = cards[1] ?? '1'
              const C2B = cards[3] ?? '1'
              const C3B = cards[5] ?? '1'

              eventData = {
                ...eventData,
                C1A,
                C2A,
                C3A,
                C1B,
                C2B,
                C3B,
                mid,
              };
            }
            eventData.event_data.market = marketData;
            // console.log('hello3', Date.now() - time1)
            return this.success(res, { ...eventData, t3, t4 });
          } else {
            const eventData = {
              ...cloneJsonData,
              ...t1,
              match_id: t1.mid,
              results,
              tv,
              defaultMarkets: cloneJsonData.event_data.market,
              t3,
              t4,

            };
            eventData.event_data.market = markets;
            return this.success(res, { ...eventData });
          }
        })
        .catch((e: any) => {
          console.log(e, '1')
          return this.fail(res, e.stack);
        });
    } catch (e: any) {
      console.log(e.message, '2')
      return this.fail(res, "");
    }
  };

  // getSingleMarket = async (req: Request, res: Response) => {
  //   let { type, selectionId } = req.params;
  //   try {
  //     if (!type) this.fail(res, "type is required field");
  //     if (!selectionId) this.fail(res, "selectionId is required field");

  //     //let casinoType: any = new DynamicClass(type, {});

  //     if (type === "AAA") type = "aaa";

  //     let data: any = await redisReplica.get(types[type]);
  //     data = data ? { data: JSON.parse(data) } : { data: [] };

  //     let markets: any = [];
  //     let singleMarket = {};
  //     if (data?.data?.t2) markets = [...markets, ...data?.data?.t2];
  //     if (data?.data?.t3) markets = [...markets, ...data?.data?.t3];
  //     if (data?.data?.t4) markets = [...markets, ...data?.data?.t4];
  //     if (data?.data?.bf) markets = [...data?.data?.bf];

  //     if (markets.length > 0 && selectionId) {
  //       let sidStr = "sid";
  //       switch (type.toLowerCase()) {
  //         case "teen9":
  //           sidStr = "tsection";
  //           break;
  //         case "teen":
  //           sidStr = "sectionId";
  //           break;
  //       }

  //       const matchedRecord = markets.filter(
  //         (market: any) => market[sidStr] == selectionId
  //       );

  //       if (matchedRecord.length > 0) {
  //         singleMarket = matchedRecord[0];
  //       }
  //     }

  //     if (
  //       data?.data?.t1 &&
  //       data?.data?.t1.length > 0 &&
  //       data?.data?.t1[0].min
  //     ) {
  //       const min =
  //         data?.data?.t1 && data?.data?.t1.length > 0
  //           ? data?.data?.t1[0].min
  //           : 0;
  //       const max =
  //         data?.data?.t1 && data?.data?.t1.length > 0
  //           ? data?.data?.t1[0].max
  //           : 0;
  //       singleMarket = { ...singleMarket, min, max };
  //     }

  //     console.log(singleMarket,"aif")

  //     return this.success(res, { ...singleMarket });
  //   } catch (e: any) {
  //     return this.fail(res, e.stack);
  //   }
  // };

getSingleMarket = async (req: Request, res: Response) => {
    let { type, selectionId } = req.params;
    console.log(req.params, "getsinglemarket");
    

    try {
      if (!type) return this.fail(res, "type is a required field");
      console.log("type", type);
      if (!selectionId)
        return this.fail(res, "selectionId is a required field");

      if (type === "AAA") type = "aaa";

      let response = await axios.get(
        `http://69.62.123.205:3000/tabledata2/${type}`
      );
      let data = response.data;


      let pdata = data?.data?.sub ?? [];
      let markets: any = pdata;
      // console.log(markets, "markets");

      interface Market {
        sid?: string | undefined; // Ensure sid is always a string (no undefined allowed)
        nat?: string | undefined;
        b?: number;
        l?:number | 0;
        max: number;
        min: number;
        gstatus?: string | undefined;
        b1?: number; // Optional if missing in API
        l1?:any;
        runnerName?: string | undefined;
        title?: string;
      }

      // let l :any;

      let singleMarket: Market | null = null;

      if (markets.length > 0 && selectionId) {
        let sidStr = "sid";
        switch (type.toLowerCase()) {
          case "testtp":
            sidStr = "tsection";
            break;
          case "tp1day":
            sidStr = "sectionId";
            break;
        }

        const matchedRecord = markets.filter(
          (market: any) => market[sidStr] == selectionId
        );

        if (matchedRecord.length > 0) {
          singleMarket = matchedRecord[0] as Market;
        }
      }

      console.log(singleMarket, "singleMarket");
      let bhav: any = singleMarket?.b;



      // Ensure singleMarketData has all required properties, with default values where needed
      let singleMarketData: Market | null = singleMarket
        ? {
          sid: singleMarket?.sid ?? "defaultSid", // Default value for sid
          nat: singleMarket?.nat ?? "", // Default empty string for optional string fields
          b1: bhav.toString() ?? 0,
          l1:singleMarket?.l?.toString(),// Default 0 for numbers
          max: singleMarket?.max ?? 0,
          min: singleMarket?.min ?? 0,
          gstatus: singleMarket?.gstatus ?? "",
          runnerName: singleMarket?.nat ?? "", // Default empty string
          title: singleMarket?.title ?? "", // Default empty string
        }
        : null;

      // Add min/max from the API if available
      if (data?.data?.t1?.length > 0 && data?.data?.t1[0].min) {
        const min: number = data?.data?.t1[0].min ?? 0;
        const max: number = data?.data?.t1[0].max ?? 0;
        singleMarketData = { ...singleMarketData, min, max };
      }
      console.log("single market Data", singleMarketData);
      return this.success(res, { ...singleMarketData });
    } catch (e: any) {
      return this.fail(res, e.stack);
    }
  };



}
