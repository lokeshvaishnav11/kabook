import React from "react"
import { IBetOn, IBetType } from "../../../../../models/IBet";
import { RoleType } from "../../../../../models/User";
import { betPopup } from "../../../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import authService from "../../../../../services/auth.service";
import { useLocation, useParams } from 'react-router-dom'

const ButtonItem = (props: any) => {
    const { selectionid, bs, title, lastOdds, liveMatchData } = props;
    const { gameCode } = useParams()
    const dispatch = useAppDispatch()
    const userState = useAppSelector(selectUserData)
    const location = useLocation();
    const currentSlug =
        gameCode ||
        (location?.pathname ? location.pathname.split("/").filter(Boolean)[0] : "");
    // list of slugs for which we WANT TO HIDE the size span
    const hideSlugs = ["kbc"]; // add more slugs here
    const onBet = (isBack = false, item: any) => {
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

    const ItemMarket: any = lastOdds?.[selectionid] || {}
    const suspend = !ItemMarket.gstatus || ItemMarket.gstatus == 0 || ItemMarket.gstatus == "SUSPENDED" || ItemMarket.gstatus == "CLOSED" ? 'suspended' : '';

    return <>
        {
            gameCode !== 'dolidana' ? (
                <>
                    <div className='row m-b-10'>
                        <div className='col-12 text-center'>
                            <b>{ItemMarket?.b || 0.00}</b>
                        </div>
                    </div>
                    <button className={`text-uppercase btn-theme ${suspend}`} onClick={() => onBet(true, ItemMarket)}><b >{title}</b></button>
                </>
            ) : (
                <button className={`text-uppercase bg-transparent border-0 w-100 h-100 ${suspend}`} onClick={() => onBet(true, ItemMarket)}><b >{title}</b> <br />{bs && <small>{ItemMarket.bs || 0}</small>}</button>
            )
        }
    </>
}
export default React.memo(ButtonItem)