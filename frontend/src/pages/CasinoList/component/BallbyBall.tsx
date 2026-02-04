import authService from '../../../services/auth.service';
import { RoleType } from '../../../models/User';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectUserData } from '../../../redux/actions/login/loginSlice';
import { betPopup } from '../../../redux/actions/bet/betSlice';
import { IBetOn, IBetType } from '../../../models/IBet';
import React from 'react';
import CasinoPnl from './casinoPnl';
import { replacecardstring } from '../../../utils/helper';
import { useParams } from 'react-router-dom'

const BallByBall = (props: any) => {
  const { lastOdds, liveMatchData } = props
  const dispatch = useAppDispatch()
  const userState = useAppSelector(selectUserData)
  const { gameCode } = useParams()

  const pushDataToPositions = React.useCallback(
    (data: string) => {
      const positions = [0, 1, 2, 3, 4, 5, 6, 7]
      const finalString = data?.split(',') || []
      const dataArray: Array<string> = (finalString && finalString.filter((d) => d !== '1')) ?? []
      const indicesToRemove = [8, 16, 24];
      for (const index of indicesToRemove) {
        dataArray.splice(index, 1);
      }
      return dataArray.reduce(
        (acc: Record<number, any>, item, index) => {
          const positionIndex = index % 8
          if (index !== 25) {
            const position: any = positions[positionIndex]
            acc[position].push(item)
          }
          return acc
        },
        {
          '0': [], '1': [], '2': [], '3': [],
          '4': [], '5': [], '6': [], '7': [],
        },
      )
    },
    [lastOdds?.cardsstring],
  )

  const onBet = (isBack = false, item: any) => {
    const ipAddress = authService.getIpAddress()
    const oddVal = parseFloat(isBack ? item.b : item.l);
    const odds = oddVal.toString()
    if (userState.user.role === RoleType.user) {
      if (parseFloat(odds) <= 0 || item.gstatus === '0') return
      dispatch(
        betPopup({
          isOpen: true,
          betData: {
            isBack,
            odds: parseFloat(odds),
            volume: 100,
            marketId: item.mid,
            marketName: item.MarketName,
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
        }),
      )
    }
  }

  const laybacklayout = React.useCallback(() => {
    const clsnamehead = 'box-4'
    const clsnamename = 'box-3'
    const heightdata = ''
    const cards = pushDataToPositions(lastOdds?.cardsstring || '')
    let rows: JSX.Element[] = []

    liveMatchData?.defaultMarkets?.forEach((ItemMarketLink: any, keyLink: number) => {
      ItemMarketLink?.Runners?.forEach((ItemNew: any, key: number) => {
        if (keyLink >= 8) return

        const Item: any = lastOdds?.[ItemNew.SelectionId] || {}
        const clsstatus = !Item.gstatus || ['SUSPENDED', 'CLOSED', '0'].includes(Item.gstatus) ? 'suspended' : ''
        const otherMarket = liveMatchData?.defaultMarkets?.[keyLink + 8]?.Runners[0] || {}
        const ItemOther: any = lastOdds?.[otherMarket.SelectionId] || {}

        rows.push(
           <tr key={`${keyLink}-${key}`} className={` ${heightdata} ${clsstatus}`}>
               <td className={clsnamehead} style={{ paddingLeft: "10px" }}>
                  <b>{ItemNew.RunnerName}</b>
                  {cards && cards[keyLink] && cards[keyLink].map((ItemCard: any, keyCard: any) => (
                      <span key={keyCard} className={`card-icon ${keyCard === 0 ? 'm-l-20' : 'm-l-1'}`}>
                         <span>{replacecardstring(ItemCard)}</span>
                      </span>
                    ))}
              </td>
              <td className={`back teen-section ${clsnamename}`}>
                 <button className='back' onClick={() => onBet(true, Item)}>
                      <span className='odd'>{Item.b}</span>
                      <CasinoPnl sectionId={Item.sid} matchId={liveMatchData.match_id} classData={'text-center'} />
                 </button>
              </td>
              <td className="box-3 text-center">
                 <div style={{ fontSize: "11px", lineHeight: "14px",color:'#097c93'}}>
                     <b style={{color:'#097c93'}}>Min:</b> {Item?.min || 0}
                     <br />
                     <b style={{color:'#097c93'}}>Max:</b> {Item?.max || 0}
                 </div>
              </td>
           </tr>
        )
      })
    })
    return rows
  }, [lastOdds, liveMatchData])

  // 📌 Generate rows only once
  const rows = laybacklayout()
  const firstTableRows = rows.slice(0, 3)
  const secondTableRows = rows.slice(3, 6)
  const thirdTableRows = rows.slice(6)

  return (
    <>
      <div>
          <table style={{width:'100%'}}>
              <thead style={{ borderBottom: "0px" }}>
                  <tr style={{ background: '#2c3e50d9'}}>
                     <th className="box-4" style={{ color: 'white', paddingLeft: '7px', fontSize: '14px', fontWeight: 'bold',padding:'8px'}}>
                         Runs
                     </th>
                  </tr>
              </thead>
          </table>
      </div>
      <div className='container' style={{ display: 'flex' }}>
          {/* FIRST TABLE */}
          <div className='row casino-32A' style={{ marginLeft: '-15px', marginRight: '0px', width: '50%' }}>
              <div className='col-lg-12 m-b-10 main-market bg-gray' style={{ padding: '0px' }}>
                  <div className='live-poker'>
                      <table className='table coupon-table table table-bordered suspendwidth'>
                          <tbody>
                              <tr>
                                   <th className="box-4"></th>
                                   <th className="back box-3">Back</th>
                                   <th className="box-4"></th>
                              </tr>
                             {firstTableRows}
                          </tbody>
                      </table>
                  </div>
              </div>
         </div>
         {/* SECOND TABLE */}
         <div className='row casino-32A' style={{ marginLeft: '0px', marginRight: '0px', width: '50%' }}>
              <div className='col-lg-12 m-b-10 main-market bg-gray' style={{ padding: '0px' }}>
                  <div className='live-poker'>
                      <table className='table coupon-table table table-bordered suspendwidth'>
                          <tbody>
                              <tr>
                                  <th className="box-4"></th>
                                  <th className="back box-3">Back</th>
                                 <th className="box-4"></th>  
                              </tr>
                               {secondTableRows}
                          </tbody>
                     </table>
                  </div>
              </div>
          </div>
         {/* THIRD TABLE */}
         <div className='row casino-32A' style={{ marginLeft: '0px', marginRight: '0px', width: '50%' }}>
              <div className='col-lg-12 m-b-10 main-market bg-gray' style={{ padding: '0px' }}>
                  <div className='live-poker'>
                      <table className='table coupon-table table table-bordered suspendwidth'>
                          <tbody>
                              <tr>
                                  <th className="box-4"></th>
                                  <th className="back box-3">Back</th>
                                  <th className="box-4"></th>  
                             </tr>
                             {thirdTableRows}
                          </tbody>
                     </table>
                  </div>
              </div>
          </div>
      </div>
    </>
  )
}

export default BallByBall;