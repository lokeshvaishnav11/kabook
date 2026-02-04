import authService from '../../../services/auth.service'
import { RoleType } from '../../../models/User'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { selectUserData } from '../../../redux/actions/login/loginSlice'
import { betPopup } from '../../../redux/actions/bet/betSlice'
import { IBetOn, IBetType } from '../../../models/IBet'
import CasinoPnl from './casinoPnl'
import { isMobile } from 'react-device-detect'
import { useCallback } from 'react'
import { useParams } from 'react-router-dom'

const AndarBhar = (props: any) => {
   const { gameCode } = useParams()
  const { lastOdds, liveMatchData } = props
  const dispatch = useAppDispatch()
  const userState = useAppSelector(selectUserData)
  // const cardNameValue: any = { J: 11, Q: 12, K: 13, A: 1 }

  const onBet = (isBack = false, item: any) => {
   
    const ipAddress = authService.getIpAddress()
    const oddVal = item.b
    const odds = oddVal
    if (userState.user.role === RoleType.user) {
      if (parseFloat(odds) <= 0 || !item.gstatus || item.gstatus === 'SUSPENDED') return
       console.log(item,'item____')
      dispatch(
        betPopup({
          isOpen: true,
          betData: {
            isBack,
            odds: parseFloat(odds),
            volume: 100,
            marketId: item.mid,
            marketName: item.MarketName,
            matchId: parseInt(liveMatchData?.match_id) || 0,
            selectionName: `${item.nat}`,
            selectionId: item.sid,
            pnl: 0,
            stack: 0,
            currentMarketOdds: item.b,
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
  const laybacklayout = useCallback(
    (index: number) => {
      return liveMatchData?.defaultMarkets?.map((ItemNew: any, key: number) => {
        // console.log(liveMatchData,'_____live match______')
        
        const andarCardData = liveMatchData?.ar?.split(',')
        const baharCardData = liveMatchData?.br?.split(',')
        
        return (
          <>
            <tbody>
              {isMobile?<tr className={`${ItemNew.MarketName == 'Andar' ? 'Andar' : 'bahar'}`}>
              { (
                  <td >
                    <div id='nation1' className='p-title text-center' style={{marginBottom:"0px"}}>
                      {ItemNew.MarketName}
                    </div>
                  </td>
                )}
              </tr>:""}
              <tr className={`${ItemNew.MarketName == 'Andar' ? 'Andar' : 'bahar'}`}>
              { !isMobile && (
                  <td style={{width:"10%"}}>
                    <div id='nation1' className='p-title text-center' style={{marginBottom:"0px"}}>
                      {ItemNew.MarketName}
                    </div>
                  </td>
                )}
                                   <td id="andar-box" className={`text-center p5`} >
              <div className={isMobile?'row text-center justify-content-center ml-0':'d-flex justify-content-center'}>
                  {ItemNew.Runners.map((ItemCardsData: any, keyCardsData: number) => {
                    // console.log(ItemCardsData,'item card data')
                    // console.log(lastOdds,'LAST____________')
                    const Item: any = lastOdds?.[ItemCardsData?.SelectionId] || {}
                    // console.log(Item,'__item')
                    
                    let cardImage = ItemCardsData?.RunnerName?.replace('Bahar ', '')
                    cardImage = cardImage?.replace('Ander ', '')
                    // cardImage = cardNameValue?.[cardImage] || cardImage
                    cardImage =
                      ItemNew.MarketName == 'Andar'
                        ? andarCardData?.[keyCardsData] || cardImage
                        : baharCardData?.[keyCardsData] || cardImage

                        if(cardImage > 20){
                          cardImage = cardImage - 20;
                        }

                        if(cardImage==1){
                        cardImage = 'A';
                      }

                      if(cardImage==0){
                        cardImage = '1';
                      }

                      if(cardImage==11){
                        cardImage = 'J';
                      }

                      if(cardImage==12){
                        cardImage = 'Q';
                      }

                       if(cardImage==13){
                        cardImage = 'K';
                      }
                      

                    return (
                      <>
                        <p>
                          <span
                            className='game-section m-r-5'
                            key={keyCardsData}
                            onClick={() => {
                              onBet(true, Item)
                            }}
                          >
                            <img
                              src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${cardImage}.png`}
                              className={`card-image`}
                              style={{marginBottom:"0px"}}
                            />
                          </span>
                          <CasinoPnl
                            sectionId={ItemCardsData?.SelectionId}
                            matchId={liveMatchData.match_id}
                            clsName={'text-center'}
                          />
                        </p>
                      </>
                    )
                  })}
                  </div>
                </td>
              </tr>
            </tbody>
          </>
        )
      })
    },
    [liveMatchData],
  )

  return (
    <div className='container teenpattixyz' style={{ marginTop: isMobile ? '-10px' : '' }}>
      <div className='row  '>
        <div className='col-lg-12 m-b-10 main-market ' style={{ padding: '0px' }}>
          <div className='live-poker'>
            <div className='card-content m-b-5'>
              <table className={`table main-table table-bordered `}>
                <tbody>{laybacklayout(0)}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AndarBhar
