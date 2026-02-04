import React from 'react'
import CasinoPnl from './casinoPnl'
import Minmax from './_common/minmax'
import ButtonItem from './_common/new/ButtonItem'
import CardItem from './_common/new/CardItem'
import { useParams } from 'react-router-dom'

const LuckSeven = (props: any) => {
    const { lastOdds, liveMatchData } = props
    const { gameCode } = useParams()
    const layout1 = () => {
        const eventData = liveMatchData?.defaultMarkets || []
        const market: any = eventData?.[0]?.Runners?.[0] || {}
        const market2: any = eventData?.[1]?.Runners?.[0] || {}
        return <div className="card-content lucky-seven-content m-b-10 col-12">
            <div className="row m-t-10">
                <div className="col-5 text-center">
                    <ButtonItem selectionid={market.SelectionId} title={market.RunnerName} lastOdds={lastOdds} liveMatchData={liveMatchData} />
                    <CasinoPnl matchId={liveMatchData.match_id} sectionId={market.SelectionId} />
                </div>
                <div className="col-2 text-center card-seven">
                    <img src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${gameCode == 'lucky5' ? '6' : '7'}.png`} className="card-seven-single" />
                </div>
                <div className="col-5 text-center">
                    <ButtonItem selectionid={market2.SelectionId} title={market2.RunnerName} lastOdds={lastOdds} liveMatchData={liveMatchData} />
                    <CasinoPnl matchId={liveMatchData.match_id} sectionId={market2.SelectionId} />
                </div>
            </div>
            <div className="row m-t-10">
                <Minmax min={liveMatchData.min} max={liveMatchData.max} />
            </div>
        </div>
    }
    const layoutTwoMarket = (markets1: number, markets2: number) => {
        const market: any = liveMatchData?.defaultMarkets?.[markets1]?.Runners?.[0] || {}
        const market2: any = liveMatchData?.defaultMarkets?.[markets2]?.Runners?.[0] || {}

        let title = market.RunnerName == 'Red' ? <span className="card-icon"> <span className={"card-red"}>{"[{"}</span> </span> : market.RunnerName;
        title = market.RunnerName == 'Black' ? <span className="card-icon"> <span className={"card-black"}>{"]}"}</span> </span> : title;
        let title2 = market2.RunnerName == 'Red' ? <span className="card-icon"> <span className={"card-red"}>{"[{"}</span> </span> : market2.RunnerName;
        title2 = market2.RunnerName == 'Black' ? <span className="card-icon"> <span className={"card-black"}>{"]}"}</span> </span> : title2;

        return <div className="lucky-seven-content m-b-10 col-6" style={{ padding: '10px' }}>

            <div className="row m-t-10">
                <div className="col-6 text-center">
                    <ButtonItem selectionid={market.SelectionId} title={title} lastOdds={lastOdds} liveMatchData={liveMatchData} />

                </div>
                <div className="col-6 text-center">
                    <ButtonItem selectionid={market2.SelectionId} title={title2} lastOdds={lastOdds} liveMatchData={liveMatchData} />
                </div>
            </div>
            <div className="row">
                <div className="col-6 text-center">
                    <CasinoPnl matchId={liveMatchData.match_id} sectionId={market.SelectionId} />
                </div>
                <div className="col-6 text-center">
                    <CasinoPnl matchId={liveMatchData.match_id} sectionId={market2.SelectionId} />
                </div>
            </div>
            <div className="row">
                <Minmax min={liveMatchData.min} max={liveMatchData.max} />
            </div>
        </div>
    }
    const layout4 = () => {
        const market = liveMatchData?.defaultMarkets?.filter((Itemc: any) => Itemc.MarketName.includes('Card ')) || []
        return <div className="card-content lucky-seven-content m-b-10 col-12">
            <div className="row m-t-10">
                <div className="col-12 text-center  m-b-10"><b >{gameCode == 'lucky5' ? 10.00 : 12.00}</b></div>
                <div className="col-12 text-center card-seven">
                    {market &&
                        market.map((ItemN: any, indexRunner: number) => {
                          const currentRunner: any = ItemN?.Runners?.[0] || {}
                          return <div className="d-inline-block" key={indexRunner}>
                                <CardItem selectionid={currentRunner.SelectionId} title={currentRunner.RunnerName} lastOdds={lastOdds} liveMatchData={liveMatchData} />
                                <div >
                                    <CasinoPnl matchId={liveMatchData.match_id} sectionId={currentRunner.SelectionId} />
                                </div>
                            </div>
                        })
                    }
                </div>
                <Minmax min={liveMatchData.min} max={liveMatchData.max} />
            </div>
        </div>
    }
    const layout5 = () => {
        if (gameCode !== "lucky7eu2") return null;

        const markets = liveMatchData?.defaultMarkets?.filter((m: any) =>
            m.MarketName.includes("Line")
        ) || [];

        if (!markets.length) return null;

        const cardGroups = [
            ["Card 1", "Card 2", "Card 3"],
            ["Card 4", "Card 5", "Card 6"],
            ["Card 8", "Card 9", "Card 10"],
            ["Card J", "Card Q", "Card K"],
        ];

        return (
            <div className="card-content lucky-seven-content m-b-10 col-12">
                <div className="row m-t-10">

                    {markets.slice(0, 4).map((market: any, idx: number) => {
                        const group = cardGroups[idx];
                        const runner = market?.Runners?.[0];
                         const ItemMarket: any = lastOdds?.[runner?.SelectionId] || {}
                       const suspend = !ItemMarket.gstatus || ItemMarket.gstatus == 0 || ItemMarket.gstatus=="SUSPENDED" || ItemMarket.gstatus=="CLOSED"? 'suspended' : '';

                        return (
                            
                            <div className={`col-6 col-md-3 text-center ${suspend}`} key={idx}>

                                {/* Line row button */}
                                <ButtonItem
                                    selectionid={runner?.SelectionId}
                                    title={runner?.RunnerName}
                                    lastOdds={lastOdds}
                                    liveMatchData={liveMatchData}
                                />

                                {/* Group wrapper → suspend applies to whole block */}
                                <div className={`card-group-wrapper card-seven m-t-10`}>
                                    <div className="group-cards d-flex justify-content-center m-r-5">

                                        {group.map((card, cardIndex) => (
                                            <div className="" key={cardIndex}>
                                                {/* <CardItem
                                                selectionid={runner?.SelectionId}
                                                title={card}
                                                lastOdds={lastOdds}
                                                liveMatchData={liveMatchData}
                                            /> */}
                                                <div className={`lucky7card  `} >
                                                    <img src={`/imgs/casino/cards/${card}.jpeg`} className=" wd-casino" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Single PNL for whole group */}
                                    <CasinoPnl matchId={liveMatchData.match_id} sectionId={runner?.SelectionId} />
                                </div>

                                <Minmax min={liveMatchData.min} max={liveMatchData.max} />
                            </div>
                        );
                    })}

                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="m-b-10 my-bet">
                <div className="new-casino">
                    <div className="row row6">
                        {layout1()}
                        {layoutTwoMarket(2, 3)}
                        {layoutTwoMarket(4, 5)}
                        {layout5()}
                        {layout4()}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default React.memo(LuckSeven)
