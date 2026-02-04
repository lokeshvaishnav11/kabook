import React from "react"
import { IBetOn, IBetType } from "../../../../../models/IBet";
import { RoleType } from "../../../../../models/User";
import { betPopup } from "../../../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import authService from "../../../../../services/auth.service";
import { useLocation, useParams } from 'react-router-dom'

const ButtonIitemKBC = (props: any) => {
    const { selectionid, title, lastOdds, liveMatchData } = props;
    const { gameCode } = useParams()
    const dispatch = useAppDispatch()
    const userState = useAppSelector(selectUserData)
    const location = useLocation();


    const onBet = (isBack = false, item: any) => {
        const ipAddress = authService.getIpAddress()
        if (userState.user.role === RoleType.user) {
            const oddsVal = parseFloat(isBack ? item.b : item.l);
            console.log("Odds =>", oddsVal);
            console.log("gstatus =>", item.gstatus);

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
                        marketName: gameCode === 'teen62' ? item.nat : item.MarketName,
                        matchId: liveMatchData?.event_data?.match_id || 0,
                        selectionName: item.subtype === 'con' ? 'Consecutive' : item.runnerName,
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


    const suspend =
        !lastOdds.gstatus ||
            lastOdds.gstatus === "SUSPENDED" ||
            lastOdds.gstatus === "CLOSED" ||
            lastOdds.gstatus === "0"
            ? "suspended"
            : "";


    return <>
        {
            gameCode === 'teen62' ? (
                <button className={`text-uppercase bg-transparent h-100 w-100 border-0 ${suspend}`} onClick={() => {
                    onBet(true, lastOdds)
                }
                }><b >{title}</b>
                </button >
            ) : (
                <div className='row'>
                    <div className='col-lg-12 p-1 m-0'>
                        <button className={`text-uppercase btn-theme btn-theme-kbc ${suspend}`} onClick={() => {
                            console.log("<-------Button Clicked----->");
                            onBet(true, lastOdds)
                        }
                        }><b >{title}</b>
                        </button >
                    </div >
                </div >
            )
        }

    </>
}
export default React.memo(ButtonIitemKBC)