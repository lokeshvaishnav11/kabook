import { isMobile } from 'react-device-detect'
import Limitinfo from './_common/limitinfo'
import CasinoPnl from './casinoPnl'
import LaybackBox from './_common/new/LaybackBox'
import ButtonItem from './_common/new/ButtonItem'
import CardItem from './_common/new/CardItem'
import LayBackButton from './_common/new/LayBackButton'

const Duskadum = (props: any) => {
  const { lastOdds, liveMatchData } = props
  const cardMarketIndex: any = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  const laybacklayout = () => {
    const markets = liveMatchData?.event_data?.market?.[0]?.Runners || [];
    return (
     <div className='card-content aaa-content m-t-10'>
       <div className='row'>
         <div className='col-12 text-right'>
           {/* <Limitinfo nameString={'layback'} min={liveMatchData?.event_data?.min} max={liveMatchData?. event_data?.max} clsName={'tx-right'} /> */}
         </div>
       </div>
       {markets.map((Item: any, index: number) => {
          return (
           <div className='d-flex text-center justify-content-center w-100' key={index}>
             <div style={{width:'40%', display:'flex', justifyContent:'center', alignItems:'center'}}>
               <span className='d-block'>
                 <b>{Item.nat}</b>
               </span>
             </div>
             <div style={{width:'40%'}}>
                <LaybackBox 
                    selectionid={Item.sid}  
                    lastOdds={lastOdds} 
                    liveMatchData={liveMatchData} 
                />
             </div>
           </div>
          )
        })}
     </div>
    )
  }
  const laybacklayoutmobile = () => {
    const markets = liveMatchData?.defaultMarkets?.[0]?.Runners || []
    return <div className="row row5 mt--30">
      <div className={"col-12 mb-10"}>
      <table className="table coupon-table table table-bordered btabl-casino">
        <thead >
          <tr >
            <th colSpan={3} style={{ textAlign: "left" }}>
              MIN : 100 Max : 300000
            </th>
          </tr>
        </thead>
        <tbody >
          {markets.map((Item: any, key: number) => {
            let runner = "A";
            runner = Item.RunnerName == "Akbar" ? 'B' : runner;
            runner = Item.RunnerName == "Anthony" ? 'C' : runner;
            const ItemMarket: any = lastOdds?.[Item.SelectionId] || {}

            const clsstatus =
            ItemMarket.gstatus == 'SUSPENDED' || ItemMarket.gstatus == 'CLOSED' ? 'suspended' : ''
            return <tr data-title="SUSPENDED" key={key} className={clsstatus}>
              <td className={"box-6 "}><b ><span className="tx-red">{runner}.</span> {Item.RunnerName}</b>
                <CasinoPnl sectionId={Item.SelectionId} matchId={liveMatchData.match_id} />
              </td>
              <LayBackButton selectionid={Item.SelectionId} lastOdds={lastOdds} liveMatchData={liveMatchData} clsnamename={'box-2'} />
            </tr>
          })}
        </tbody>
      </table>
    </div>
    </div>
  }

  const buttonLayout = (classData: string, marketIndex: any) => {
    const finalMarketList = liveMatchData?.defaultMarkets?.filter((ItemN: any, index: number) => marketIndex.indexOf(index) > -1) || []
    return (
      finalMarketList.map((Item: any, key: number) => {
        const market = Item?.Runners?.[0] || {}
        let title = market.RunnerName == 'Red' ? <span className="card-icon"> <span className={"card-red"}>{"[{"}</span> </span> : market.RunnerName;
        title = market.RunnerName == 'Black' ? <span className="card-icon"> <span className={"card-black"}>{"]}"}</span> </span> : title;
        return (
          <>  
            {' '}
            <div key={key} className={`${classData} text-center`}>
            <div className='row m-b-10'>
                <div className='col-12 text-center'>
                <ButtonItem selectionid={market.SelectionId} title={title} lastOdds={lastOdds} liveMatchData={liveMatchData} />
                {/* <div className='m-t-5 m-b-5' >
                    <CasinoPnl sectionId={market.SelectionId} matchId={liveMatchData.match_id} />
                  </div> */}
                </div>
                </div>
            </div>
          </>
        )
      })
    )
  }
  return (
   <div>
     {!isMobile ? laybacklayout() : ''}
     {isMobile ? laybacklayoutmobile() : ''}
     <div className='card-content  m-t-10'>
       <div className='row m-t-10 '>
         <div className='col-6'>
           <div className='aaa-content'>
             <div className='text-right'>
                {/* <Limitinfo nameString={'redblack'} min={liveMatchData?.event_data?.min} max={liveMatchData?.event_data?.max} clsName={'tx-right'} /> */}
             </div>
             {buttonLayout('', [3])}
             {buttonLayout('', [4])}
           </div>
         </div>
         <div className='col-6'>
           <div className='aaa-content'>
             <div className='text-right'>
                {/* <Limitinfo nameString={'oddeven'} min={liveMatchData?.event_data?.min} max={liveMatchData?.event_data?.max} clsName={'tx-right'} /> */}
             </div>
             {buttonLayout('', [1])}
             {buttonLayout('', [2])}
           </div> 
         </div>
       </div>
     </div>
    </div>
  )
}
export default Duskadum
