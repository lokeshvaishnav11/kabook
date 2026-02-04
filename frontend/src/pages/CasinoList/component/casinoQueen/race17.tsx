import React, { useMemo } from "react";
import { IBetOn, IBetType } from "../../../../models/IBet";
import { RoleType } from "../../../../models/User";
import { betPopup } from "../../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import authService from "../../../../services/auth.service";

const RaceSeventeen = ({ lastOdds, liveMatchData }: any) => {
  console.log(lastOdds,'live match data')
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);

  /* ✅ 1. MERGE DATA PROPERLY (KEY FIX) */
  // const markets = useMemo(() => {
  //   if (!liveMatchData?.event_data?.market) return [];

  //   return liveMatchData.event_data.market.map((market: any) => ({
  //     ...market,
  //     Runners: market.Runners.map((item: any) => ({
  //       ...item,
  //       ...(lastOdds?.[item.sid] || {}), // 🔥 live update
  //     })),
  //   }));
  // }, [liveMatchData?.event_data?.market, lastOdds]);

 const onBet = (isBack: boolean, item: any, marketName: string) => {
  if (userState.user.role !== RoleType.user) return;
  if (item.gstatus !== "OPEN") return; // item should be liveItem

  const oddsVal = Number(isBack ? item.b : item.l);
  if (oddsVal <= 0) return;

  dispatch(
    betPopup({
      isOpen: true,
      betData: {
        isBack,
        odds: oddsVal,
        volume: isBack ? item.bs : item.ls,
        marketName,
        marketId: item.sid,
        matchId: liveMatchData?.event_data?.match_id || 0,
        selectionName: item.nat,
        selectionId: item.sid,
        pnl: 0,
        stack: 0,
        currentMarketOdds: oddsVal,
        eventId: item.sid,
        exposure: 0,
        ipAddress: authService.getIpAddress(),
        type: IBetType.Match,
        matchName: liveMatchData.title,
        betOn: IBetOn.CASINO,
        gtype: liveMatchData.slug,
      },
    })
  );
};


  const marketRow = (item: any, marketName: string) => {
    const suspended =
      item.gstatus !== "OPEN" || item.visible !== 1 ? "suspended" : "";

    return (
      <div className="casino-odds-box casino-yn">
        <div
          className={`back-border ${suspended}`}
          onClick={() => onBet(true, item, marketName)}
        >
          <span className="casino-odds-box-odd">{item.b}</span>
          <span className="fw-12 laysize">{item.bs}</span>
        </div>

        <div
          className={`lay-border ${suspended}`}
          onClick={() => onBet(false, item, marketName)}
        >
          <span className="casino-odds-box-odd">{item.l}</span>
          <span className="fw-12 laysize">{item.ls}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="new-casino">
      <div className="card-content" style={{ padding: "10px" }}>
        <div className="row row5">
          {lastOdds?.market?.map((market: any) =>
  market.Runners?.map((item: any) => {
    const odds = lastOdds?.market
      ?.flatMap((m: any) => m.Runners)
      .find((r: any) => r.sid === item.sid);

    const liveItem = {
      ...item,
      nat: odds?.nat ?? item.nat,
      b: odds?.b ?? item.b,
      l: odds?.l ?? item.l,
      bs: odds?.bs ?? item.bs,
      ls: odds?.ls ?? item.ls,
      gstatus: odds?.gstatus ?? item.gstatus,
      visible: odds?.visible ?? item.visible,
    };

    return (
      <div
        className="col-lg-3 col-6"
        key={`${market.MarketName}-${item.sid}`}
      >
        <div className="casino-odds-box-container casino-odds-box-container-extra">
          <div className="casino-yn">
            <div className="casino-odds-box-bhav">
              <b>{liveItem.nat}</b>
            </div>
          </div>

          {marketRow(liveItem, market.MarketName)}
        </div>
      </div>
    );
  })
)}

        </div>
      </div>
    </div>
  );
};

export default React.memo(RaceSeventeen);
