import React, { MouseEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import{shallowEqual} from "react-redux";
import {
  betPopup,
  selectBetCount,
  selectBetPopup,
  selectPlaceBet,
  setBetCount,
} from '../../../redux/actions/bet/betSlice'
import { IUserBetStake } from '../../../models/IUserStake'
import IBet, { IBetOn, IBetType } from '../../../models/IBet'
import { getPlaceBetAction } from '../../../redux/actions/bet/bet.action'
import { IApiStatus } from '../../../models/IApiStatus'
import { useWebsocketUser } from '../../../context/webSocketUser'
import { OddsType } from '../../../models/IMarket'

const PlaceBetBox = ({ stake }: { stake: IUserBetStake }) => {
  console.log(stake,"stake")
  const [betObj, setBetObj] = React.useState<IBet>({} as IBet)
  const betValues = useAppSelector(selectBetPopup,shallowEqual)
  const getPlaceBet = useAppSelector(selectPlaceBet,shallowEqual)
  const betCount = useAppSelector(selectBetCount)
  const { socketUser } = useWebsocketUser()

  const dispatch = useAppDispatch()

  React.useEffect(() => {
    setBetObj({
      ...betValues.betData,
      odds:
        typeof betValues.betData.odds === 'string'
          ? parseFloat(betValues.betData.odds)
          : betValues.betData.odds,
    })
  }, [betValues.betData])

  React.useEffect(() => {
    if (getPlaceBet.status === IApiStatus.Done) {
      socketUser.emit('place-bet', getPlaceBet.bet)
      // dispatch(setBookMarketList({}))
      dispatch(betPopup({ isOpen: false, betData: {} as IBet }))
      dispatch(setBetCount(betCount + 1))
    }
  }, [getPlaceBet.status])

  const reset = () => {
    setBetObj({ ...betObj, stack: 0, pnl: 0 })
    dispatch(betPopup({ ...betValues, betData: { ...betValues.betData, stack: 0, pnl: 0 } }))
  }

  const onStack = (stack: number) => {
    const betObjItem = { ...betObj }
    betObjItem.stack = betObjItem.stack + stack
    const calPnl = calculatePnlF(betObjItem)

    betObjItem.pnl = calPnl.pnl
    betObjItem.exposure = calPnl.exposure
    setBetObj(betObjItem)
    dispatch(betPopup({ ...betValues, betData: { ...betObjItem } }))
  }

  const incrementDecrementOdds = (type = 'inc') => {
    const betObjItem = { ...betObj }

    if (betObjItem.oddsType === OddsType.BM || betObjItem.oddsType === OddsType.F) {
      return true
    }
    switch (type) {
      case 'inc':
        betObjItem.odds = parseFloat((betObjItem.odds + 0.01).toFixed(4))
        break
      case 'dec':
        betObjItem.odds = parseFloat((betObjItem.odds - 0.01).toFixed(4))
        break
    }
    const calPnl = calculatePnlF(betObjItem)
    betObjItem.pnl = calPnl.pnl
    betObjItem.exposure = calPnl.exposure
    betObjItem.type =
      betObjItem.odds !== betObjItem.currentMarketOdds ? IBetType.UnMatch : IBetType.Match
    dispatch(betPopup({ ...betValues, betData: { ...betObjItem } }))

    setBetObj(betObjItem)
  }

  const calculatePnlF = (betValue: IBet) => {
    let pnl = 0,
      exposure = 0
    if (Object.keys(betValue).length > 0) {
      if (betValue.betOn == IBetOn.MATCH_ODDS || betValue.gtype === 'fancy1'||betValue.gtype === 'oddeven') {
        if (betValue.isBack || betValue.gtype === 'oddeven' ) {
          pnl = betValue.odds * betValue.stack - betValue.stack
          exposure = -1 * betValue.stack
        } else {
          pnl = betValue.stack
          exposure = -1 * (betValue.odds * betValue.stack - betValue.stack)
        }
      } else if (betValue.betOn != IBetOn.CASINO) {
        if (betValue.isBack) {
          pnl = (betValue.volume * betValue.stack) / 100
          exposure = -betValue.stack
        } else {
          exposure = -((betValue.volume * betValue.stack) / 100)
          pnl = betValue.stack
        }
      } else if (betValue.betOn == IBetOn.CASINO) {
        if (betValue.matchId == 33) {
          //// specific condition for cmeter game
          pnl = 0
          exposure = -50 * betValue.stack * 1.0
        } else if (betValue.matchId == 9) {
          //// specific condition for tp1day game
          if (betValue.isBack) {
            pnl = (betValue.odds / 100) * betValue.stack
            exposure = -betValue.stack
          } else {
            pnl = betValue.stack
            exposure = -1 * (betValue.odds * betValue.stack - betValue.stack)
          }
        } else if (betValue.fancystatus == 'yes') {
          //// specific condition for cmeter game
          if (betValue.isBack) {
            pnl = (betValue.volume * betValue.stack) / 100
            exposure = -betValue.stack
          } else {
            exposure = -((betValue.volume * betValue.stack) / 100)
            pnl = betValue.stack
          }
        } else {
          if (betValue.isBack) {
            pnl = betValue.odds * betValue.stack - betValue.stack
            exposure = -1 * betValue.stack
          } else {
            pnl = betValue.stack
            exposure = -1 * (betValue.odds * betValue.stack - betValue.stack)
          }
        }
      }
    }
    return { pnl: parseInt(pnl.toFixed()), exposure: parseInt(exposure.toFixed()) }
  }

  const onChangeStack = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetObj({ ...betObj, stack: parseInt(e.target.value) })
  }

  const onBlurStack = () => {
    onStack(0)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(getPlaceBetAction(betObj))
  }

  const renderStakeButtons = () => {
    const buttons = []
    for (let i = 1; i <= 10; i++) {
      buttons.push(
        <button
          key={i}
          type='button'
          onClick={() => onStack(stake[`value${i}`])}
          className='btn btn-secondary m-l-5 m-b-5'
          style={{borderRadius:"0px"}}
        >
          {stake[`name${i}`]}
        </button>,
      )
    }
    return buttons
  }

  const closeBetPopup = () => {
    dispatch(
      betPopup({
        ...betValues,
        isOpen: false,
        betData: { ...betValues.betData, stack: 0, pnl: 0 },
      }),
    )
  }
  const onBackDrop = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    dispatch(
      betPopup({
        ...betValues,
        isOpen: false,
        betData: { ...betValues.betData, stack: 0, pnl: 0 },
      }),
    )
  }
  //betValues.isOpen 
  console.log(betValues,"hajdd")

  console.log("place bet re render ")
  return (
    <>
      { betValues.isOpen && (
        <>
          <div onClick={onBackDrop} className='backdrop-custom'></div>

          <div className='card m-b-10 place-bet'>
            <div className='card-header'>
              <h6 className='card-title d-inline-block col-10'>Place Bet</h6>
              <span className='card-title d-inline-block col-2' onClick={closeBetPopup}>
                X
              </span>
            </div>
            <div className={`table-responsive px-2 ${betObj.isBack ? 'back' : 'lay'}`}>
              <form onSubmit={onSubmit}>
                <div className='coupon-table table table-borderedless'>
              
                  <div>
                    <div>
                      <div className='text-center d-flex justify-content-between align-items-center px-2 py-2' style={{ fontWeight:"600", fontSize:"16px"}}>
                        {/* <a onClick={closeBetPopup} className='text-danger'>
                          <i className='fa fa-times' />
                        </a> */}
                        {betObj.selectionName}
                      <div className=' bet-profit text-nowrap'>Profit:{betValues.betData.pnl}</div>

                      </div>
                       <div className="row mt-3 px-2" style={{background:"#ffffff45"}}>
      <div className="col-6 text-center">
        <label className=''>Odds</label>
        <div className="d-flex odds-box align-items-center">
          <button
          style={{height:"35px" ,fontSize:"25px"}}
            type="button"
            className="btn btn-dark text-light"
            onClick={() => incrementDecrementOdds('dec')}
          >−</button>

          <input
            type="text"
            value={betObj.odds}
            readOnly
            className="form-control text-center"
          />

          <button
             style={{height:"35px" ,fontSize:"25px"}}
            type="button"
            className="btn btn-dark text-light"
            onClick={() => incrementDecrementOdds('inc')}
          >+</button>
        </div>
      </div>

      <div className="col-6 text-center">
        <label>Amount</label>
        <input
          type="number"
          className="form-control"
          value={betObj.stack || ''}
          onChange={onChangeStack}
        />
      </div>
    </div>
                      {/* <div className='bet-stakes'>
                        <div className='form-group bet-stake'>
                          <input
                            maxLength={10}
                            required
                            type='number'
                            value={betObj.stack || ''}
                            onBlur={onBlurStack}
                            onChange={onChangeStack}
                          />
                        </div>
                      </div> */}
                      {/* <td className='text-right bet-profit'>{betValues.betData.pnl}</td> */}
                    </div>
                    <div>
                      <div className='value-buttons' style={{ padding: 5 }}>
                        {renderStakeButtons()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-md-12 d-flex justify-content-between align-items-center p-2'>
                <button className="btn w-100 btn-link text-primary p-0" onClick={reset}>
        Clear
      </button>

      <button className="btn btn-info px-4 w-100">Edit</button>

                  <button
                    onClick={reset}
                    type='button'
                    className='btn  btn-danger float-left w-100'
                  >
                    Reset
                  </button>
                  <button
                    type='submit'
                    disabled={getPlaceBet.status === IApiStatus.Loading}
                    className='btn btn-success float-right  w-100'
                  >
                    Place Bet
                    {getPlaceBet.status === IApiStatus.Loading ? (
                      <i className='mx-5 fas fa-spinner fa-spin'></i>
                    ) : (
                      ''
                    )}
                  </button>
                </div>
                <div className="range-text mt-2">
      Range: 100 to 2L
    </div>
    <div style={{background: "#ffffff45",
        padding: "4px"}} className="odds-count mt-1 h-2"></div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}
export default React.memo(PlaceBetBox)

