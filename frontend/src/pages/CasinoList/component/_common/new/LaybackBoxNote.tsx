import React from "react"
import { IBetOn, IBetType } from "../../../../../models/IBet";
import { RoleType } from "../../../../../models/User";
import { betPopup } from "../../../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import authService from "../../../../../services/auth.service";
import { useParams } from 'react-router-dom'

const LaybackBoxNote = (props: any) => {
  const { selectionid, title, lastOdds, liveMatchData, showLay = true, showBack = true } = props;
  const { gameCode } = useParams();
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);

  const ItemMarket: any = lastOdds || {};   // <-- FIX: no [selectionid] here
  const market3Card = liveMatchData?.defaultMarkets?.[2]?.Runners?.[0];
  const odds3 = lastOdds?.[market3Card?.SelectionId] || {};

  const onBet = (isBack = false, item: any) => {
    const ipAddress = authService.getIpAddress();

    if (userState.user.role === RoleType.user) {
      const oddsVal = parseFloat(isBack ? item.b : item.l);
      if (oddsVal <= 0) return;
      if (item.gstatus === 'SUSPENDED' || item.gstatus === 'CLOSED') return;

      dispatch(betPopup({
        isOpen: true,
        betData: {
          isBack,
          odds: oddsVal,
          volume: gameCode === 'mogambo' ? isBack ? item.bbhav : item.lbhav : isBack ? item.bs : item.ls,
          marketId: item.mid,
          marketName: item.MarketName,
          matchId: liveMatchData?.event_data?.match_id || 0,
          selectionName: item.nat,
          selectionId: item.sid,
          pnl: 0,
          stack: 0,
          currentMarketOdds: isBack ? item.b : item.l,
          eventId: item.mid,
          exposure: 0,
          ipAddress,
          type: IBetType.Match,
          matchName: liveMatchData.title,
          betOn: IBetOn.CASINO,
          gtype: gameCode,
        }
      }));
    }
  };

  const suspend =
    gameCode === 'mogambo'
      ? (
        !odds3?.gstatus ||
        odds3.gstatus === 'SUSPENDED' ||
        odds3.gstatus === 'CLOSED'
      )
        ? 'suspended'
        : ''
      : (
        !ItemMarket?.gstatus ||
        ItemMarket.gstatus === 'SUSPENDED' ||
        ItemMarket.gstatus === 'CLOSED'
      )
        ? 'suspended'
        : '';


  return (
    <div className={`aaa-button clearfix h-100`}>
      {showBack && (
        <button className={`back ${suspend}`} onClick={() => onBet(true, gameCode === 'mogambo' ? odds3 : ItemMarket)}>
          <span className="odd">{gameCode === 'mogambo' ? odds3?.b ?? "--" : ItemMarket.b}</span>
          <br />
          {gameCode === 'mogambo' && <small>{odds3?.bbhav ?? "--"}</small>}
        </button>
      )}

      {showLay && (
        <button className={`lay ${suspend} ${!showBack ? "full-width" : ""}`} onClick={() => onBet(false, gameCode === 'mogambo' ? odds3 : ItemMarket)}>
          <span className="odd">{gameCode === 'mogambo' ? odds3?.l ?? "--" : ItemMarket.l}</span>
          <br />
          {gameCode === 'mogambo' && <small>{odds3?.lbhav ?? "--"}</small>}
        </button>
      )}
    </div>
  );
};

export default React.memo(LaybackBoxNote)