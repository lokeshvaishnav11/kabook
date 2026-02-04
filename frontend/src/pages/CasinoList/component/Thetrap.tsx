import authService from '../../../services/auth.service';
import { RoleType } from '../../../models/User';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectUserData } from '../../../redux/actions/login/loginSlice';
import { selectCasinoCurrentMatch } from '../../../redux/actions/casino/casinoSlice';
import { betPopup } from '../../../redux/actions/bet/betSlice';
import { IBetOn, IBetType } from '../../../models/IBet';
import { useState } from 'react';
import CasinoPnl from './casinoPnl';
import Limitinfo from './_common/limitinfo';
import LayBackButton from './_common/new/LayBackButton';
import ButtonItem from './_common/new/ButtonItem';
import BackButtonPnl from './_common/new/BackButtonPnl';
import { useParams } from 'react-router-dom'
import BackButtonPnlTheTrap from './_common/new/BackButtonPnlTheTrap';

const TheTrap = (props: any) => {
  const { lastOdds, liveMatchData } = props
   const { gameCode } = useParams()
  const dispatch = useAppDispatch()
  const userState = useAppSelector(selectUserData)
  const getCurrentMatch = useAppSelector(selectCasinoCurrentMatch)
  const [updateOdds, setUpdateOdds] = useState<any>(undefined)
  console.log('lastodds',lastOdds);

  const onBet = (isBack = false, item: any) => {
    console.log(item,'item value')
    const ipAddress = authService.getIpAddress()
    const oddVal = parseFloat(isBack ? item.b : item.l);
    const odds = oddVal.toString();
    if (userState.user.role === RoleType.user) {
      if (parseFloat(odds) <= 0 || item.gstatus === 'SUSPENDED') return
      dispatch(
        betPopup({
          isOpen: true,
          betData: {
            isBack,
            odds: parseFloat(odds),
            volume: 100,
            marketId: item.mid,
            marketName: item.MarketName,
            matchId: getCurrentMatch?.match_id || 0,
            selectionName: item?.nation || item?.RunnerName || item?.nat,
            selectionId: item.SelectionId,
            pnl: 0,
            stack: 0,
            currentMarketOdds: isBack ? item.b : item.l,
            eventId: item.mid,
            exposure: -0,
            ipAddress: ipAddress,
            type: IBetType.Match,
            matchName: getCurrentMatch.title,
            betOn: IBetOn.CASINO,
            gtype: gameCode,
          },
        }),
      )
    }
  }
const laybacklayoutPlayer = () => {
  const clsnamehead = "box-4";

  return (
    [0].map((mIndex: number) => {
      const market = liveMatchData?.defaultMarkets?.[mIndex];
      if (!market) return null;

      return market.Runners?.map((runner: any, rIndex: number) => {
        const ItemMarket: any = lastOdds?.[runner.SelectionId] || {};
        const clsstatus =
          !ItemMarket.gstatus ||
          ItemMarket.gstatus === "SUSPENDED" ||
          ItemMarket.gstatus === "CLOSED"
            ? "suspended"
            : "";

        return (
          <tr key={`${mIndex}-${rIndex}`} className={clsstatus}>
            <td className={clsnamehead} style={{ paddingLeft: "10px" }}>
              <b>{runner.RunnerName}</b>
            </td>

            <LayBackButton
              selectionid={runner.SelectionId}
              lastOdds={lastOdds}
              liveMatchData={liveMatchData}
              clsnamename={""}
            />
          </tr>
        );
      });
    })
  );
};

const laybacklayoutDealer = () => {
  const clsnamehead = "box-4";

  return (
    [1].map((mIndex: number) => {
      const market = liveMatchData?.defaultMarkets?.[mIndex];
      if (!market) return null;

      return market.Runners?.map((runner: any, rIndex: number) => {
        const ItemMarket: any = lastOdds?.[runner.SelectionId] || {};
        const clsstatus =
          !ItemMarket.gstatus ||
          ItemMarket.gstatus === "SUSPENDED" ||
          ItemMarket.gstatus === "CLOSED"
            ? "suspended"
            : "";

        return (
          <tr key={`${mIndex}-${rIndex}`} className={clsstatus}>
            <td className={clsnamehead} style={{ paddingLeft: "10px" }}>
              <b>{runner.RunnerName}</b>
            </td>

            <LayBackButton
              selectionid={runner.SelectionId}
              lastOdds={lastOdds}
              liveMatchData={liveMatchData}
              clsnamename={""}
            />
          </tr>
        );
      });
    })
  );
};

const player = () => {
  // Find "Low High" market
  const lowHighMarket = lastOdds?.market?.find(
    (m: any) => m.MarketName === "Low High"
  );

  if (!lowHighMarket) return null;

  // Find the opened runner
  const openedRunner = lowHighMarket?.Runners?.find(
    (r: any) => r.gstatus === "OPEN"
  ) || lowHighMarket?.Runners?.[0]; // fallback to first if none open

  const cardName = openedRunner?.nat ?? "Card";
  const fullMarketName = `Low High - ${cardName}`;

  // Odds for this runner
  const oddsList = openedRunner?.odds || [];

  const highObj = oddsList.find((o: any) => o.nat === "High") || {};
  const lowObj  = oddsList.find((o: any) => o.nat === "Low") || {};

  // Common properties for both Low/High items
  const common = {
    gstatus: openedRunner?.gstatus ?? "SUSPENDED",
    mid: openedRunner?.mid ?? 0,
    MarketName: fullMarketName,
  };

  // Build Low/High items
  // Build Low/High items with specific MarketName
const lowItem = {
  ...lowObj,
  ...common,
  runnerName: `Low-${cardName}`,
  MarketName: "Low High",
  b: lowObj?.b ?? 0,
  l: lowObj?.l ?? 0,
  bs: lowObj?.bs ?? 0,
  ls: lowObj?.ls ?? 0,
  sid: openedRunner?.sid,   // fallback
  mid: openedRunner?.mid ?? 0,             // fallback
  gstatus: openedRunner?.gstatus ?? "OPEN",
};

const highItem = {
  ...highObj,
  ...common,
  runnerName: `High-${cardName}`,
  MarketName: "Low High",
  b: highObj?.b ?? 0,
  l: highObj?.l ?? 0,
  bs: highObj?.bs ?? 0,
  ls: highObj?.ls ?? 0,
  sid: openedRunner?.sid,  // fallback
  mid: openedRunner?.mid ?? 0,             // fallback
  gstatus: openedRunner?.gstatus ?? "OPEN",
};


  return (
    <tr>
      {/* Static card image */}
      <img
        src="/trape-seven.png"
        style={{
          position: "absolute",
          top: "-8px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60px",
          zIndex: 10,
        }}
      />

      <BackButtonPnlTheTrap
        selectionid={lowObj.sid}
        item={lowItem}                   // gstatus is correct here
        liveMatchData={liveMatchData}
        textname="Low"
        value={lowItem.b}
        clsnamename="back twentypoker teen-section"
      />

     <BackButtonPnlTheTrap
       selectionid={highObj.sid}
       item={highItem}                  // gstatus is correct here
       liveMatchData={liveMatchData}
       textname="High"
       value={highItem.b}
       clsnamename="back twentypoker teen-section"
      />
    </tr>
  );
};


const dealer = () => {
  const clsnamehead = "box-4";

  // Find JQK market
  const jqkMarket = lastOdds?.market?.find((m: any) => m.MarketName === "JQK");
  if (!jqkMarket) return null;

  // Find the open card
  const openedRunner = jqkMarket?.Runners?.find((r: any) => r.gstatus === "OPEN");

  // Create ItemMarket for LayBackButton
  const ItemMarket = {
    ...lastOdds?.[openedRunner?.sid],
    b: openedRunner?.odds?.[0]?.b ?? 0,
    l: openedRunner?.odds?.[0]?.l ?? 0,
    bs: openedRunner?.bs ?? 0,
    ls: openedRunner?.ls ?? 0,
    gstatus: openedRunner?.gstatus ?? "SUSPENDED",
    mid: openedRunner?.mid ?? 0,
    runnerName: `${jqkMarket?.MarketName} - ${openedRunner?.nat ?? "Card"}`,
    MarketName: `${jqkMarket?.MarketName}`,
  };

  // 👉 Suspended logic ONLY here (when b=0 & l=0)
  const isSuspended = ItemMarket.b === 0 && ItemMarket.l === 0;

  return (
    <tr key={`jqk-permanent`} className={isSuspended ? "suspended" : ""}>
      {/* Always fixed 3 images */}
      <td className={clsnamehead} style={{ paddingLeft: 10 }}>
        <img
          src="https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/J.png"
          alt="img1"
          style={{ width: "20px", marginRight: "5px" }}
        />
        <img
          src="https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/Q.png"
          alt="img2"
          style={{ width: "20px", marginRight: "5px" }}
        />
        <img
          src="https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/K.png"
          alt="img3"
          style={{ width: "20px" }}
        />
      </td>

      {/* This will always remain visible – values update only when OPEN card changes */}
      <LayBackButton
        selectionid={openedRunner?.sid ?? 0}
        lastOdds={{ [openedRunner?.sid ?? 0]: ItemMarket }}
        liveMatchData={liveMatchData}
        clsnamename=""
      />
    </tr>
  );
};


 return (
    <div className='container ' id={`${getCurrentMatch?.slug}`} style={{ marginTop: "-10px" }}>
      <div className='row '>
        <div className='col-lg-6 m-b-10 main-market bg-gray' style={{ padding: '0px' }}>
          <div className='live-poker'>
            <table className='table coupon-table table table-bordered'>
              <tbody>
                {laybacklayoutPlayer()}
              </tbody>
            </table>
          </div>
        </div>
         <div className='col-lg-6 m-b-10 main-market bg-gray' style={{ padding: '0px' }}>
          <div className='live-poker'>
            <table className='table coupon-table table table-bordered'>
              <tbody>
                {laybacklayoutDealer()}
              </tbody>
            </table>
          </div>
        </div>
        <div className='col-lg-6 m-b-10 main-market bg-gray' style={{ padding: '0px' }}>
          <table className='table coupon-table table table-bordered suspendwidth'>
            <tbody>
              {player()}
            </tbody>
          </table>
        </div>
        <div className='col-lg-6 m-b-10 main-market  bg-gray' style={{ padding: '0px' }}>
          <table className='table coupon-table table table-bordered suspendwidth'>
            <tbody>
              {dealer()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default TheTrap