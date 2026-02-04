import { isMobile } from 'react-device-detect'
import Limitinfo from './_common/limitinfo'
import CasinoPnl from './casinoPnl'
import LaybackBox from './_common/new/LaybackBox'
import ButtonItem from './_common/new/ButtonItem'
import CardItem from './_common/new/CardItem'
import LayBackButton from './_common/new/LayBackButton'
import ButtonIItemKBC from './_common/new/ButtonIItemKBC'

const Kbc = (props: any) => {
  const { lastOdds, liveMatchData } = props
  const cardMarketIndex: any = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

const buttonLayout = (classData: string, marketIndex: any) => {
  const finalMarketList =
    liveMatchData?.defaultMarkets?.filter(
      (ItemN: any, index: number) => marketIndex.indexOf(index) > -1
    ) || [];
  // console.log(finalMarketList, 'final-------');
  

  return finalMarketList.map((marketItem: any, key: number) => {
    // Runners array
    const runners = marketItem?.Runners || [];
  // 🔹 Add console logs here
    console.log('Market:',runners);
  //  runners.forEach((r, i) => console.log(`Runner ${i} Odds:`, r?.odds));

    if (runners.length === 0) return null;
    return (
     <div key={key} className={`${classData} text-center m-b-15`} style={{width:'100%'}}> 
       {/* 🔹 Buttons for each odd in all runners */}
       <div className="row justify-content-center" style={{marginRight:'0px',marginLeft:'0px'}}>
         {runners.map((runner: any) => {
           const sid = runner.RunnerName; 
           let currentData = lastOdds?.market?.find((e:any) => e.MarketName==sid);
           console.log(currentData,'curreee----->')
           return (
             <>
               {currentData?.Runners[0]?.odds?.map((odd: any, idx: number) => {
                 const oddDataWithStatus = {
                    sid: currentData.Runners[0].sid,   // from runner ✔
                    b: odd.b,                          // from odds array ✔
                    l: odd.l,                          // from odds array ✔
                    nat: odd.nat,                      // from odds array ✔
                    ssid: odd.ssid,                    // unique selection ✔
                    gstatus: currentData.Runners[0].gstatus,
                    runnerName: currentData.Runners[0].runnerName,
                    MarketName: currentData.MarketName,
                    mid: currentData.Runners[0].mid || currentData.mid,
                    bs: currentData.Runners[0].bs,
                    ls: currentData.Runners[0].ls,
                  };
                  let title = odd.nat === 'Red' ? <span className="card-icon"><span className="card-red">[{'{'}</span></span> : odd.nat === 'Black' ? <span className="card-icon"><span className="card-black">{']}'}</span></span> : odd.nat === "Spade" ? <span className="card-icon"> <span className={"card-black"}>{"}"}</span> </span> : odd.nat === "Diamond" ? <span className="card-icon"> <span className={"card-black"}>{"]"}</span> </span> :odd.nat === "Heart" ? <span className="card-icon"> <span className={"card-red"}>{"{"}</span> </span> :odd.nat ==="Club" ?<span className="card-icon"> <span className={"card-red"}>{"["}</span> </span> : odd.nat; 
                  console.log('oddSid',odd.ssid);
                return (
                 <div key={idx} className="col-6 text-center">
                   <ButtonIItemKBC
                     selectionid={odd.ssid}
                     title={title}
                     lastOdds={oddDataWithStatus}
                     liveMatchData={liveMatchData}  
                    />
                 </div>
                );
              })}
            </>
            );
          })}
        </div>
      </div>
    );
  });
};


  return (
   <div>
     <div className='card-content card-content-kbc m-t-10'>
       <div className='row p-t-15'>
         <div className='col-4 mb-3'>
           <div className='aaa-content p-0 text-center'>
              <b className='nameTrio'>[Q1] {liveMatchData?.defaultMarkets?.[0]?.MarketName || ''}</b>
              {buttonLayout('', [0])} {/* only show buttons using odds array */}
           </div>
         </div>
          <div className='col-4 mb-3'>
           <div className='aaa-content p-0 text-center'>
              <b className='nameTrio'>[Q2] {liveMatchData?.defaultMarkets?.[1]?.MarketName || ''}</b>
              {buttonLayout('', [1])} {/* only show buttons using odds array */}
           </div>
         </div>
          <div className='col-4 mb-3'>
           <div className='aaa-content p-0 text-center'>
              <b className='nameTrio'>[Q3] {liveMatchData?.defaultMarkets?.[2]?.MarketName || ''}</b>
              {buttonLayout('', [2])} {/* only show buttons using odds array */}
           </div>
         </div>
        <div className='col-4 mb-3'>
           <div className='aaa-content p-0 text-center'>
              <b className='nameTrio'>[Q4] {liveMatchData?.defaultMarkets?.[3]?.MarketName || ''}</b>
              {buttonLayout('', [3])} {/* only show buttons using odds array */}
           </div>
         </div>
            <div className='col-4'>
           <div className='aaa-content p-0 text-center'>
              <b className='nameTrio'>[Q5] {liveMatchData?.defaultMarkets?.[4]?.MarketName || ''}</b>
              {buttonLayout('', [4])} {/* only show buttons using odds array */}
           </div>
         </div>

       </div>
     </div>
    </div>
  )
}
export default Kbc
