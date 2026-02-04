import React from 'react'
import ButtonItemCmeter1 from './_common/new/ButtonItemCmeter1'
import { useParams } from 'react-router-dom'
import { isMobile } from 'react-device-detect'

const Cmeter1 = (props: any) => {
    const { lastOdds, liveMatchData } = props
    const { gameCode } = useParams()
    const layout1 = () => {
        const eventData = liveMatchData?.defaultMarkets || []
        const market: any = eventData?.[0]?.Runners?.[0] || {}
        const market2: any = eventData?.[1]?.Runners?.[0] || {}

        const colClass = isMobile ? "col-12" : "col-6";

        return <div className="card-content lucky-seven-content m-b-10 col-12 bg-transparent ">
            <div className="row m-t-10" style={{gap: isMobile ? "1rem" : "0rem"}}>
                <div className={`${colClass} text-center`}>
                    <ButtonItemCmeter1 type="A" selectionid={market.SelectionId} title={market.RunnerName} lastOdds={lastOdds} liveMatchData={liveMatchData} />
                </div>
                <div className={`${colClass} text-center`}>
                    <ButtonItemCmeter1 type="B" selectionid={market2.SelectionId} title={market2.RunnerName} lastOdds={lastOdds} liveMatchData={liveMatchData} />
                </div>
            </div>
        </div>
    }
    return (
        <div>
            <div className="m-b-10 my-bet ">
                <div className="new-casino border-0">
                    <div className="row row6">
                        {layout1()}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default React.memo(Cmeter1)
