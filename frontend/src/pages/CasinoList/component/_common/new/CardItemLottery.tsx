import React from "react";
import { IBetOn, IBetType } from "../../../../../models/IBet";
import { RoleType } from "../../../../../models/User";
import { betPopup } from "../../../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import authService from "../../../../../services/auth.service";
import { useParams } from "react-router-dom";

// ---- MAP TITLES TO IMAGES ----
const cardMap: any = {
    "1": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/A.png",
    "2": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/2.png",
    "3": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/3.png",
    "4": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/4.png",
    "5": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/5.png",
    "6": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/6.png",
    "7": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/7.png",
    "8": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/8.png",
    "9": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/9.png",
    "10": "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/10.png",
};

// fallback image (use any existing image)
const fallbackImage = "/imgs/card/1.jpg";

const CardItemLottery = (props: any) => {
    const { selectionid, title, lastOdds, liveMatchData } = props;
    const { gameCode } = useParams();
    const dispatch = useAppDispatch();
    const userState = useAppSelector(selectUserData);

    // ---------------- DEBUGGING ----------------
    console.log("RAW TITLE =>", title);

    // Extract only digits (Card 1 → 1, Card A → "", etc)
    const number = title.replace(/\D/g, "");

    console.log("EXTRACTED NUMBER =>", number);
    console.log("IMAGE FROM MAP =>", cardMap[number]);

    const cardImage = cardMap[number] || fallbackImage;

    console.log("FINAL IMAGE USED =>", cardImage);
    // ------------------------------------------------

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
                        marketName: item.MarketName,
                        matchId: liveMatchData?.event_data?.match_id || 0,
                        selectionName: item.runnerName,
                        selectionId: item.sid,
                        pnl: 0,
                        stack: 0,
                        currentMarketOdds: isBack ? item.b : item.l,
                        eventId: item.mid,
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
    const suspend =
        !ItemMarket.gstatus ||
        ItemMarket.gstatus == 0 ||
        ItemMarket.gstatus === "SUSPENDED" ||
        ItemMarket.gstatus === "CLOSED"
            ? "suspended"
            : "";

    return (
        <div className={`lucky7card ${suspend}`}>
            <img
                onClick={() => onBet(true, ItemMarket)}
                src={cardImage}
                className="m-r-5 m-l-5 wd-casino"
                onError={(e) => {
                    console.error("IMAGE FAILED TO LOAD =>", cardImage);
                    (e.currentTarget as HTMLImageElement).src = fallbackImage;
                }}
            />
        </div>
    );
};

export default React.memo(CardItemLottery);