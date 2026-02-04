import React from "react"
import { isMobile } from "react-device-detect";
import { IBetOn, IBetType } from "../../../../../models/IBet";
import { RoleType } from "../../../../../models/User";
import { betPopup } from "../../../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import authService from "../../../../../services/auth.service";
import CasinoPnl from "../../casinoPnl";
import { useLocation, useParams } from 'react-router-dom'

const BackButtonPnlTheTrap = (props: any) => {
    const { selectionid, item, liveMatchData, clsnamename, needSuspend, titleStatus, textname, value } = props;
    const { gameCode } = useParams();
    const dispatch = useAppDispatch();
    const userState = useAppSelector(selectUserData);
    const location = useLocation();
    // console.log(item,'MarketName------------------>');
    const currentSlug =
      gameCode ||
      (location?.pathname ? location.pathname.split("/").filter(Boolean)[0] : "");

    const hideSlugs = ["trap"];

    const onBet = (isBack = false, item: any) => {
        console.log(item,'item bet----------------------------->>>>>>>>>>>>>>>>>>>')
        const ipAddress = authService.getIpAddress();
        if (userState.user.role === RoleType.user) {
            const oddsVal = parseFloat(isBack ? item.b : item.l);
           if (oddsVal <= 0) return;
            if (!item.gstatus || item.gstatus === "SUSPENDED") return;
            dispatch(
                betPopup({
                    isOpen: true,
                    betData: {
                        isBack,
                        odds: oddsVal,
                        volume: isBack ? item.b : item.l,
                        marketId: item.mid || item?.marketId,
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
                })
            );
        }
    };
   
    // ✅ Use the `item` passed from parent (player function)
    const clsstatus =
        !item?.gstatus || item.gstatus === "SUSPENDED" || item.gstatus === "CLOSED"
            ? "suspended"
            : "";

    return (
        <td
            className={`back teen-section ${clsnamename} ${
                needSuspend === undefined || needSuspend ? clsstatus : ""
            }`}
        >
            <button className="back" onClick={() => onBet(true, item)}>
                <span className="odd" style={{ fontSize: isMobile ? "12px" : "" }}>
                    {value ?? (titleStatus !== undefined ? item.runnerName : item.b)}
                </span>
                <br />
                {textname && (
                    <span className="text-label" style={{ marginRight: "5px", fontWeight: 600 }}>
                        {textname}
                    </span>
                )}
                {!hideSlugs.includes(currentSlug) && (
                    <span className="fw-12 laysize">
                        <CasinoPnl sectionId={item.sid} matchId={liveMatchData?.match_id} />
                    </span>
                )}
            </button>
        </td>
    );
};
export default React.memo(BackButtonPnlTheTrap);