import React from "react"
import { IBetOn, IBetType } from "../../../../../models/IBet";
import { RoleType } from "../../../../../models/User";
import { betPopup } from "../../../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import authService from "../../../../../services/auth.service";
import { nFormatter } from "../../../../../utils/helper";
import { useParams } from 'react-router-dom'

const BackButton = (props: any) => {
    const { selectionid, lastOdds, liveMatchData, clsnamename } = props;
     const { gameCode } = useParams()
    const dispatch = useAppDispatch()
    const userState = useAppSelector(selectUserData)
    const onBet = (isBack = false, item: any) => {
        const ipAddress = authService.getIpAddress()
        if (userState.user.role === RoleType.user) {
            const oddsVal = parseFloat(isBack ? item.b : item.l);
            if (oddsVal <= 0) return
            if (item.SUSPENDED == 'SUSPENDED') return
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
    return <>
     <td className={`back teen-section ${clsnamename}`}>
              <button className='back' onClick={() => onBet(true, ItemMarket)}>
                <span className='odd'>{ItemMarket.b}</span>{' '}
                <span className='fw-12 laysize'>{nFormatter(ItemMarket.bs, 2)}</span>
              </button>
      </td>
    </>
}
export default React.memo(BackButton)