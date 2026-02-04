import { isMobile } from 'react-device-detect'
import CasinoPnl from './casinoPnl'
import ButtonItem from './_common/new/ButtonItem'
import LaybackBox from './_common/new/LaybackBox'
import CardItem from './_common/new/CardItem'
import Limitinfo from './_common/limitinfo'
import LayBackButton from './_common/new/LayBackButton'

const Trio = (props: any) => {
  const { lastOdds, liveMatchData } = props
  const cardMarketIndex: any = [6, 7, 8, 9];
  const laybacklayout = (index: any, className: string) => {
    const finalMarketList = liveMatchData?.defaultMarkets?.[index]?.Runners || []
    return (
      finalMarketList.map((ItemNew: any, index: number) => {
        return (
          <div className={`${className} text-center mb-10`} key={index}>
            <div>
              <span className='d-block'>
                <b className='nameTrio'>
                  {ItemNew.RunnerName}
                </b>
              </span>
            </div>
            <LaybackBox selectionid={ItemNew.SelectionId} title={ItemNew.RunnerName} lastOdds={lastOdds} liveMatchData={liveMatchData} />
            {/* <div className='tx-16 mt30'>
              <CasinoPnl sectionId={ItemNew.SelectionId} matchId={liveMatchData.match_id} />
            </div> */}
          </div>
        )
      })
    )
  }
const laybacklayoutmobile = (keyType: number) => {
  return liveMatchData?.defaultMarkets?.[keyType]?.Runners?.map(
    (ItemNew: any, key: number) => {
      const Item: any = lastOdds?.[ItemNew.SelectionId] || {};
      const clsstatus =
        !Item.gstatus || Item.gstatus === "SUSPENDED" || Item.gstatus === "CLOSED"
          ? "suspended"
          : "";

      return (
       <tr data-title="SUSPENDED" key={key} className={clsstatus}>
         <td className="box-6" style={{ paddingLeft: "3px" }}>
            <b>
               {ItemNew.RunnerName}
            </b>
            <CasinoPnl
              sectionId={ItemNew?.SelectionId || 0}
              matchId={liveMatchData?.match_id}
            />
         </td>
         <LayBackButton
            selectionid={ItemNew.SelectionId}
            lastOdds={lastOdds}
            liveMatchData={liveMatchData}
            clsnamename={"box-2"}
          />
       </tr>
      );
    }
  );
};

const laylayoutmobile = (keyType: number) => {
  return liveMatchData?.defaultMarkets?.[keyType]?.Runners?.map(
    (ItemNew: any, key: number) => {
      const Item: any = lastOdds?.[ItemNew.SelectionId] || {};
      const clsstatus =
        !Item.gstatus || Item.gstatus === "SUSPENDED" || Item.gstatus === "CLOSED"
          ? "suspended"
          : "";

      return (
       <tr data-title="SUSPENDED" key={key} className={clsstatus}>
         <td className="box-6" style={{ paddingLeft: "3px" }}>
            <b>
               {ItemNew.RunnerName}
            </b>
            <CasinoPnl
              sectionId={ItemNew?.SelectionId || 0}
              matchId={liveMatchData?.match_id}
            />
         </td>
         <LayBackButton
            selectionid={ItemNew.SelectionId}
            lastOdds={lastOdds}
            liveMatchData={liveMatchData}
            clsnamename={"box-2"}
            showLay={false}
          />
       </tr>
      );
    }
  );
};
  const layonlayout = (index: any, className: string) => {
    const finalMarketList = liveMatchData?.defaultMarkets?.[index]?.Runners || []
    return (
      finalMarketList.map((ItemNew: any, index: number) => {
        return (
          <div className={`${className} text-center mb-10`} key={index}>
            <div>
              <span className='d-block'>
                <b className='nameTrio'>
                  {ItemNew.RunnerName}
                </b>
              </span>
            </div>
            <LaybackBox selectionid={ItemNew.SelectionId} title={ItemNew.RunnerName} lastOdds={lastOdds} liveMatchData={liveMatchData} showLay={false}/>
            {/* <div className='tx-16 mt30'>
              <CasinoPnl sectionId={ItemNew.SelectionId} matchId={liveMatchData.match_id} />
            </div> */}
          </div>
        )
      })
    )
  }


  const className3 = isMobile ? 'col-12 ' : 'col-6'
  const layoutForMobile = () => {
    return <div className='mobile-layout' >
     <table className="table coupon-table table table-bordered btabl-casino">
       <tbody >
         {laybacklayoutmobile(0)}
       </tbody>
     </table>
     <table className="table coupon-table table table-bordered btabl-casino">
       <tbody >
         {laybacklayoutmobile(1)}
       </tbody>
     </table>
     <table className="table coupon-table table table-bordered btabl-casino">
       <tbody >
         {laybacklayoutmobile(2)}
       </tbody>
     </table>
     <table className="table coupon-table table table-bordered btabl-casino">
       <tbody >
         {laybacklayoutmobile(3)}
       </tbody>
     </table>
     <table className="table coupon-table table table-bordered btabl-casino">
       <tbody >
         {laybacklayoutmobile(4)}
       </tbody>
     </table>
     <table className="table coupon-table table table-bordered btabl-casino">
       <tbody >
         {laybacklayoutmobile(5)}
       </tbody>
     </table>
     <table className="table coupon-table table table-bordered btabl-casino">
       <tbody >
         {laybacklayoutmobile(6)}
       </tbody>
     </table>
      <table className="table coupon-table table table-bordered btabl-casino">
       <tbody >
         {laylayoutmobile(7)}
       </tbody>
     </table>
   </div>
  }
  const layoutForDesktop = () => {
   const row1Markets = [0, 1, 2];     // First row → 3 items
   const row2Markets = [3, 4, 5, 6];  // Second row → 4 items
   const row3Markets = [7, 8, 9, 10, 11];
   return (
     <div className='desktop-layout'>

      {/* ---------------- Row 1 ---------------- */}
      <div className='m-t-10 mb-10'>
        {/* <Limitinfo
          min={liveMatchData?.event_data?.min}
          max={liveMatchData?.event_data?.max}
          nameString={"lbl8"}
          clsName={"tx-right"}
        /> */}

        <div className="row">
          {row1Markets.map((mIndex, i) => (
            <div className="col-lg-4 col-md-4 col-4" key={i}>
              {laybacklayout(mIndex, '')}
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- Row 2 ---------------- */}
      <div className='row row5 mb-10'>
        {row2Markets.map((mIndex, i) => (
          <div className="col-lg-3 col-md-3 col-6" key={i}>
            {/* <Limitinfo
              min={liveMatchData?.event_data?.min}
              max={liveMatchData?.event_data?.max}
              nameString={"lbl3"}
              clsName={"tx-right"}
            /> */}

            {laybacklayout(mIndex, '')}
          </div>
        ))}
      </div>
       {/* ---------------- Row 2 ---------------- */}
      <div className='row row5 mb-10' >
        {row3Markets.map((mIndex, i) => (
          <div className="col-lg-2 col-md-2 col-4" key={i}>
            {/* <Limitinfo
              min={liveMatchData?.event_data?.min}
              max={liveMatchData?.event_data?.max}
              nameString={"lbl3"}
              clsName={"tx-right"}
            /> */}
            {layonlayout(mIndex, '')}
          </div>
        ))}
      </div>
   </div>
  );
  };
  

  return (<>
    {/* {!isMobile ? layoutForDesktop() : ""}
    {isMobile ? layoutForMobile() : ""} */}
    {layoutForDesktop()}
  </>
  )
}
export default Trio