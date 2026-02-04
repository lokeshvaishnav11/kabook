import React from "react"
import { IBetOn, IBetType } from "../../../../../models/IBet";
import { RoleType } from "../../../../../models/User";
import { betPopup } from "../../../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import authService from "../../../../../services/auth.service";
import { useParams } from 'react-router-dom'

const CardItemNoteNum = (props: any) => {
  const { selectionid, title, lastOdds, liveMatchData } = props;
  const { gameCode } = useParams();
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);
  console.log('lastOdds---carditem', lastOdds);
  console.log('liveMacthData',liveMatchData)
  const onBet = (isBack = false, item: any) => {
  const ipAddress = authService.getIpAddress();
  if (userState.user.role === RoleType.user) {
    const oddsVal = parseFloat(isBack ? item.b : item.l);
    if (oddsVal <= 0) return;
    if (item.SUSPENDED === "SUSPENDED") return;

    dispatch(
      betPopup({
        isOpen: true,
        betData: {
          isBack,
          odds: oddsVal,
          volume: isBack ? item.bs : item.ls,
          marketId: item.mid,
          marketName: item.parentNat || title, // <-- FIXED
          matchId: liveMatchData?.event_data?.match_id || 0,
          selectionName: item.nat,
          selectionId: item.sid,
          pnl: 0,
          stack: 0,
          currentMarketOdds: isBack ? item.b : item.l,
          eventId: item.mid,
          exposure: -0,
          ipAddress: ipAddress,
          type: IBetType.Match,
          matchName: liveMatchData.title,
          betOn: IBetOn.CASINO,
          gtype: gameCode,
        },
      })
    );
  }
};

  // FIXED HERE ↓
  const ItemMarket: any = lastOdds || {};
//   console.log(liveMatchData.gstatus,'status--------------------');

  const suspend =
    !ItemMarket.gstatus ||
    ItemMarket.gstatus == 0 ||
    ItemMarket.gstatus == "SUSPENDED" ||
    ItemMarket.gstatus == "CLOSED"
      ? "suspended"
      : "";

  const newtitle = title == "Card A" ? "Card 1" : title;

  return (
    <>
      <span className="mb-1">{ItemMarket.b}</span>
      <div className={`lucky7card ${suspend}`} style={{display:'flex',flexDirection:'column',justifyContent:'space-around',alignItems:'center'}}>
          <img
             onClick={() => onBet(true, ItemMarket)}
             src={`/imgs/casino/cards/${newtitle}.jpeg`}
             className="m-r-5 m-l-5 wd-casino"
            />
      </div>
   </>
  );
};

export default React.memo(CardItemNoteNum)