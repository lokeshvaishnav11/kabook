import React from "react";
import { IBetOn, IBetType } from "../../../../../models/IBet";
import { RoleType } from "../../../../../models/User";
import { betPopup } from "../../../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import authService from "../../../../../services/auth.service";
import { useParams } from "react-router-dom";
import { isMobile } from "react-device-detect";

const ButtonItemCmeter1 = (props: any) => {
  const { selectionid, lastOdds, liveMatchData, type } = props;
  const { gameCode } = useParams();
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);

  const onBet = (isBack = false, item: any) => {
    if (suspend) return;
    const ipAddress = authService.getIpAddress()
    if (userState.user.role === RoleType.user) {
      const oddsVal = parseFloat(isBack ? item.b : item.l);
      if (oddsVal <= 0) return
      if (!item.gstatus || item.gstatus == 'SUSPENDED' || item.gstatus == '0') return
      dispatch(
        betPopup({
          isOpen: true,
          betData: {
            isBack,
            odds: oddsVal,
            volume: isBack ? item.bs : item.ls,
            marketId: item.mid,
            marketName: item.MarketName,
            matchId: liveMatchData?.event_data?.match_id || 0,
            selectionName: item.runnerName,
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
        }),
      )
    }
  }

  const ItemMarket: any = lastOdds?.[selectionid] || {};

  // 🔒 Suspend Logic
  const suspend =
    !ItemMarket.gstatus ||
    ItemMarket.gstatus == 0 ||
    ItemMarket.gstatus == "SUSPENDED" ||
    ItemMarket.gstatus == "CLOSED";

  return (
    <button
      disabled={suspend}
      className={`btn w-100 text-uppercase d-flex justify-content-center align-items-center py-2 ${suspend ? "opacity-75 cursor-not-allowed" : "text-black"}`}
      style={{
        backgroundColor: suspend ? "#999" : "#72BBEF",
        backgroundImage: suspend ? "none" : "linear-gradient(#198754, #198754)",
        backgroundRepeat: "no-repeat",
        backgroundSize: suspend ? "100% 100%" : type === "A" ? "0% 100%" : "0% 100%",
        backgroundPosition: type === "A" ? "left" : "right",
        transition: "background-size 0.6s ease, color 0.3s ease, border-color 0.3s ease, letter-spacing 0.4s ease",
        border: suspend ? "3px solid #666" : type === "A" ? "3px solid #E2283A" : "3px solid #ECC116",
        cursor: suspend ? "not-allowed" : "pointer",
        borderRadius: "0px",
        fontWeight: 700,
        fontSize: "20px",
        gap: '10px'
      }}
      onMouseEnter={(e) => {
        if (suspend) return;
        e.currentTarget.style.letterSpacing = "2px";
        e.currentTarget.style.backgroundSize = "100% 100%";
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.borderColor = "#198754";

        const img = e.currentTarget.querySelector("img");
        if (img) img.style.transform += " scale(1.2)";
      }}
      onMouseLeave={(e) => {
        if (suspend) return;
        e.currentTarget.style.backgroundSize = "0% 100%";
        e.currentTarget.style.color = "black";
        e.currentTarget.style.borderColor = type === "A" ? "#E2283A" : "#ECC116";
        e.currentTarget.style.letterSpacing = "0px";

        const img = e.currentTarget.querySelector("img");
        if (img) img.style.transform = img.dataset.rotate || "";
      }}
      onClick={() => onBet(true, ItemMarket)}
    >
      {/* LEFT Punch for B */}
      {!suspend && type === "B" && (
        <img
          src="/imgs/fight.png"
          alt="fight"
          data-rotate={isMobile ? "rotate(0deg)" : "rotate(-90deg)"}
          style={{
            width: "35px",
            height: "35px",
            objectFit: "contain",
            transform: isMobile ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 0.3s ease",
          }}
        />
      )}
      <b>
        {suspend ? "🔒 LOCKED" : ItemMarket?.MarketName ?? ""}
      </b>
      {!suspend && type === "A" && (
        <img
          src="/imgs/fight.png"
          alt="fight"
          data-rotate={isMobile ? "rotate(180deg)" : "rotate(90deg)"}
          style={{
            width: "35px",
            height: "35px",
            objectFit: "contain",
            transform: isMobile ? "rotate(180deg)" : "rotate(90deg)",
            transition: "transform 0.3s ease",
          }}
        />
      )}
    </button>
  );
};

export default React.memo(ButtonItemCmeter1);
