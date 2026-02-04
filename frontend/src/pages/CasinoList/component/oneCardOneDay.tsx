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

const OneCard1Day = (props: any) => {
  const { lastOdds, liveMatchData } = props
   const { gameCode } = useParams()
  const dispatch = useAppDispatch()
  const userState = useAppSelector(selectUserData)
  const getCurrentMatch = useAppSelector(selectCasinoCurrentMatch)
  const [updateOdds, setUpdateOdds] = useState<any>(undefined)

  const onBet = (isBack = false, item: any) => {
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
    return (['7'].map((ItemNew: any, key: number) => {
       const market1 = liveMatchData?.defaultMarkets?.filter((ItemEven: any) => ItemEven.MarketName == `${ItemNew} Down Player`)?.[0]?.Runners?.[0] || {}
      const market2 = liveMatchData?.defaultMarkets?.filter((ItemEven: any) => ItemEven.MarketName == `${ItemNew} Up Player`)?.[0]?.Runners?.[0] || {}
     
      return <tr key={key}>
       {/* <td className='box-2' style={{ paddingLeft: "10px"}}><b>{ItemNew}</b></td> */}
       <img
          src="/trape-seven.png"
          alt=""
         style={{
            position: "absolute",
            top: "-8px",        // move upward
            left: "50%",
            transform: "translateX(-50%)",
            width: "60px",
            zIndex: 10
          }}
        />
        <BackButtonPnl key={key} selectionid={market1.SelectionId} lastOdds={lastOdds} liveMatchData={liveMatchData} textname="DOWN" clsnamename={'back twentypoker teen-section'} />
        <BackButtonPnl key={key + 2} selectionid={market2.SelectionId} lastOdds={lastOdds} liveMatchData={liveMatchData} textname="UP" clsnamename={'back twentypoker teen-section'} />
     </tr>
    }))
  }
  const dealer = () => {
    return (['7'].map((ItemNew: any, key: number) => {
      const market3 = liveMatchData?.defaultMarkets?.filter((ItemEven: any) => ItemEven.MarketName == `${ItemNew} Down Dealer`)?.[0]?.Runners?.[0] || {}
      const market4 = liveMatchData?.defaultMarkets?.filter((ItemEven: any) => ItemEven.MarketName == `${ItemNew} Up Dealer`)?.[0]?.Runners?.[0] || {}
      return <tr key={key}>
        {/* <td className='box-2' style={{ paddingLeft: "10px"}}><b>{ItemNew}</b></td> */}
       <img
          src="/trape-seven.png"
          alt=""
         style={{
            position: "absolute",
            top: "-8px",        // move upward
            left: "50%",
            transform: "translateX(-50%)",
            width: "60px",
            zIndex: 10
          }}
        />
        <BackButtonPnl key={key} selectionid={market3.SelectionId} lastOdds={lastOdds} liveMatchData={liveMatchData} textname="DOWN" clsnamename={'back twentypoker teen-section'} />
        <BackButtonPnl key={key + 2} selectionid={market4.SelectionId} lastOdds={lastOdds} liveMatchData={liveMatchData} textname="UP" clsnamename={'back twentypoker teen-section'} />
     </tr>
    }))
  }

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
        <div className='col-lg-6 m-b-10 main-market  bg-gray' style={{ padding: '0px' }}>
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
export default OneCard1Day
