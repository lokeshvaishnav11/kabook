import CasinoPnl from './casinoPnl';
import LayBackButton from './_common/new/LayBackButton';

const OneDayTeen = ({ lastOdds, liveMatchData }: any) => {
  const markets = liveMatchData?.defaultMarkets?.[0]?.Runners || [];
  const isTeen41 = window.location.pathname.includes("teen41") || window.location.pathname.includes("teen42");

  const renderRows = (data: any[], showLay = true, singleRow = false) => {
    if (singleRow) {
      // ✅ Combine all items in one <tr> for last 2 items
      return (
        
        <table style={{ borderCollapse: "separate",width:'100%'}}>
        <tbody>
        <tr style={{width: '100%'}}>
          {data.map((item: any, i: number) => {
            const odds = lastOdds?.[item.SelectionId] || {};
            const status =
              !odds.gstatus || ["SUSPENDED", "CLOSED"].includes(odds.gstatus)
                ? "suspended"
                : "";

            return (
              <td
                key={i}
                className={`${status}`}
                style={{ padding: "0px", verticalAlign: "top"}}
              >
                <div style={{ display: "flex", flexDirection: "row", justifyContent:'space-between',alignItems: "center"}}>
                 <div style={{display:'flex',flexDirection:'column',paddingLeft:'10px'}}>
                    <b>{item.RunnerName}</b>
                    <CasinoPnl sectionId={item.SelectionId} matchId={liveMatchData.match_id} />
                 </div> 
                  <LayBackButton
                    selectionid={item.SelectionId}
                    lastOdds={lastOdds}
                    liveMatchData={liveMatchData} 
                    clsnamename="box-4" // full width inside td
                    showLay={false} // hide LAY button
                  />
                </div>
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
      );
    }

    // Normal rows: each item in its own row
    return data.map((item: any, i: number) => {
      const odds = lastOdds?.[item.SelectionId] || {};
      const status =
        !odds.gstatus || ["SUSPENDED", "CLOSED"].includes(odds.gstatus)
          ? "suspended"
          : "";

      return (
        <tr key={i} className={status}>
          <td className="box-6" style={{ paddingLeft: 10 }}>
            <b>{item.RunnerName}</b>
            <CasinoPnl sectionId={item.SelectionId} matchId={liveMatchData.match_id} />
          </td>
          <LayBackButton
            selectionid={item.SelectionId}
            lastOdds={lastOdds}
            liveMatchData={liveMatchData}
            clsnamename={showLay ? "box-2" : "box-12"}
            showLay={showLay}
          />
        </tr>
      );
    });
  };

  const half = Math.ceil(markets.length / 2);
  const [firstHalf, secondHalf] = [markets.slice(0, half), markets.slice(half)];

  const renderTable = (
    data: any[],
    showLay = true,
    showHeader = true,
    key: number,
    singleRow = false
  ) => (
    <div
      key={key}
      className="col-lg-12 m-b-10 main-market bg-gray"
      style={{ padding: 0 }}
    >
      <div className="live-poker">
        <table className="table coupon-table table-bordered">
          {showHeader && (
            <thead>
              <tr>
                <th className="box-6"></th>
                {showLay && <th className="back box-2">BACK</th>}
                {showLay && <th className="lay-color box-2">LAY</th>}
              </tr>
            </thead>
          )}
          <tbody>{renderRows(data, showLay, singleRow)}</tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ marginTop: "-10px" }}>
      <div className="row casino-32A">
        {isTeen41 ? (
          <>
            {/* First half: normal headers, normal rows */}
            {renderTable(firstHalf, true, true, 0)}

            {/* Second half: no headers, BACK only, all in one row */}
            {renderTable(secondHalf, false, false, 1, true)}
          </>
        ) : (
          renderTable(markets, true, true, 0)
        )}
      </div>
    </div>
  );
};

export default OneDayTeen;