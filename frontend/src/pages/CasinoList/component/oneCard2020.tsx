import React from 'react'
import CasinoPnl from './casinoPnl'
import Minmax from './_common/minmax'
import ButtonItem from './_common/new/ButtonItem'
import CardItem from './_common/new/CardItem'
import { useParams } from 'react-router-dom'

const OneCard2020 = (props: any) => {
    const { lastOdds, liveMatchData } = props
    const { gameCode } = useParams()
    const layout1 = () => {
        const eventData = liveMatchData?.defaultMarkets || []
        const market: any = eventData?.[0]?.Runners?.[0] || {}
        const market2: any = eventData?.[1]?.Runners?.[0] || {}
        const market3: any = eventData?.[2]?.Runners?.[0] || {}
        const market4: any = eventData?.[3]?.Runners?.[0] || {}
        return <div className="card-content lucky-seven-content m-b-10 col-12">
            <div className="row m-t-10">
                <div className="col-3 text-center">
                    <ButtonItem selectionid={market.SelectionId} title={market.RunnerName} lastOdds={lastOdds} liveMatchData={liveMatchData} />
                    {/* <CasinoPnl matchId={liveMatchData.match_id} sectionId={market.SelectionId} /> */}
                </div>
                <div className="col-3 text-center">
                    <ButtonItem selectionid={market3.SelectionId} title={market3.RunnerName} lastOdds={lastOdds} liveMatchData={liveMatchData} />
                    {/* <CasinoPnl matchId={liveMatchData.match_id} sectionId={market3.SelectionId} /> */}
                </div>
                <div className="col-3 text-center">
                    <ButtonItem selectionid={market2.SelectionId} title={market2.RunnerName} lastOdds={lastOdds} liveMatchData={liveMatchData} />
                    {/* <CasinoPnl matchId={liveMatchData.match_id} sectionId={market2.SelectionId} /> */}
                </div>
                <div className="col-3 text-center" style={{borderLeft:'4px solid #116257',paddingBottom:'10px'}}>
                    <ButtonItem selectionid={market4.SelectionId} title={market4.RunnerName} lastOdds={lastOdds} liveMatchData={liveMatchData} />
                    {/* <CasinoPnl matchId={liveMatchData.match_id} sectionId={market4.SelectionId} /> */}
                </div>
            </div>
        </div>
    }

    return (
        <div>
            <div className="m-b-10 my-bet">
                <div className="new-casino">
                    <div className="row row6">
                        {layout1()}
                        {/* {layoutTwoMarket(2, 3)}
                        {layoutTwoMarket(4, 5)} */}
                        {/* {layout5()} */}
                        {/* {layout4()} */}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default React.memo(OneCard2020)
