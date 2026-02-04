// ✅ LayBackButton.tsx
import React from "react";
import { IBetOn, IBetType } from "../../../../../models/IBet";
import { RoleType } from "../../../../../models/User";
import { betPopup } from "../../../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import authService from "../../../../../services/auth.service";
import { nFormatter } from "../../../../../utils/helper";
import { useLocation, useParams } from "react-router-dom";


const LayBackButton = (props: any) => {
  const { selectionid, lastOdds, liveMatchData, clsnamename, showLay = true  } = props;
  const { gameCode } = useParams();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);
  const currentSlug =
    gameCode ||
    (location?.pathname ? location.pathname.split("/").filter(Boolean)[0] : "");

  // list of slugs for which we WANT TO HIDE the size span
  const hideSlugs = ["poison", "poison20", "joker20","teen1","joker1","trap"]; // add more slugs here

  const onBet = (isBack = false, item: any) => {
    const ipAddress = authService.getIpAddress();
    if (userState.user.role === RoleType.user) {
      const oddsVal = parseFloat(isBack ? item.b : item.l);
      if (oddsVal <= 0 || !item.gstatus || item.gstatus === "SUSPENDED") return;

      dispatch(
        betPopup({
          isOpen: true,
          betData: {
            isBack,
            odds: oddsVal,
            volume: isBack
              ? item.bs > 1000000 ? 1 : item.bs
              : item.ls > 1000000 ? 1 : item.ls,
            marketId: item?.mid || item?.marketId,
            marketName: item.MarketName,
            matchId: liveMatchData?.event_data?.match_id || 0,
            selectionName: item.runnerName,
            selectionId: item?.sid ? parseInt(item?.sid) : item?.sectionId,
            pnl: 0,
            stack: 0,
            currentMarketOdds: isBack ? item.b : item.l,
            eventId: item?.mid || item?.marketId,
            exposure: -0,
            ipAddress,
            type: IBetType.Match,
            matchName: liveMatchData.title,
            betOn: IBetOn.CASINO,
            gtype: gameCode,
          },
        })
      );
    }
  };

  const ItemMarket: any = lastOdds?.[selectionid] || {};

  return (
    <>
      {/* BACK */}
      <td className={`back teen-section ${clsnamename} `}>
        <button className="back" onClick={() => onBet(true, ItemMarket)}>
          <span className="odd">{ItemMarket.b}</span>
          {/* 🔥 Hide this when URL = poison */}
            {!hideSlugs.includes(currentSlug) && (
            <span className="fw-12 laysize" style={{ display: "block" }}>
              {nFormatter(ItemMarket.bs, 2)}
            </span>
          )}
        </button>
      </td>

      {/* LAY — only if showLay is true */}
      {showLay && (
        <td className={`lay teen-section ${clsnamename}`}>
          <button className="lay" onClick={() => onBet(false, ItemMarket)}>
            <span className="odd">
              <b>{ItemMarket.l}</b>
            </span>
            {!hideSlugs.includes(currentSlug) && (
            <span className="fw-12 laysize" style={{ display: "block" }}>
              {nFormatter(ItemMarket.ls, 2)}
            </span>
            )}
          </button>
        </td>
      )}
    </>
  );
};

export default React.memo(LayBackButton);