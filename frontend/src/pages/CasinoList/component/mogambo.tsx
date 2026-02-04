import BackButtonPnl from "./_common/new/BackButtonPnl";
import LaybackBoxNote from "./_common/new/LaybackBoxNote";


const ROW_HEIGHT = "50px";

const Mogambo = (props: any) => {
  const { lastOdds, liveMatchData } = props;

  const market0 = liveMatchData?.defaultMarkets?.[0]?.Runners?.[0];
  const market1 = liveMatchData?.defaultMarkets?.[1]?.Runners?.[0];
  const market3Card = liveMatchData?.defaultMarkets?.[2]?.Runners?.[0];

  return (
    <div className="container">
      <div className="casino-32A">

        {/* ================= ROW 1 : MOGAMBO & DAGA/TEJA ================= */}
        <div
          className={`row mb-2 main-market p-0 }`}
          style={{ height: ROW_HEIGHT }}
        >
          <div className="col-3 d-flex align-items-center fw-bold border">
            {market0?.RunnerName}
          </div>
          <div className="col-3 p-0">
            <div className="mogambo-suspended h-100 d-flex justify-content-center align-items-center bg-info fw-bold">
              <BackButtonPnl
                selectionid={market0?.SelectionId}
                lastOdds={lastOdds}
                liveMatchData={liveMatchData}
                clsnamename=""
                needSuspend={true}
                titleStatus={true}
              />
            </div>
          </div>

          <div className="col-3 d-flex align-items-center fw-bold border">
            {market1?.RunnerName}
          </div>
          <div className="col-3 p-0">
            <div className="mogambo-suspended h-100 d-flex justify-content-center align-items-center bg-info fw-bold">
              <BackButtonPnl
                selectionid={market1?.SelectionId}
                lastOdds={lastOdds}
                liveMatchData={liveMatchData}
                clsnamename=""
                needSuspend={true}
                titleStatus={true}
              />
            </div>
          </div>
        </div>

        {/* ================= ROW 2 : 3 CARD TOTAL ================= */}
        <div
          className={`row justify-content-center mb-2 main-market p-0}`}
          style={{ height: ROW_HEIGHT }}
        >
          <div className="col-3 justify-content-center d-flex align-items-center fw-bold border">
            {market3Card?.RunnerName}
          </div>
          {/* BACK  and lay*/}
          <div className="col-3 p-0 m-0"> 
            <div className="mogambo-suspended h-100 d-flex align-items-center justify-content-center text-center bg-light">
              <LaybackBoxNote
                selectionid={market3Card?.SelectionId}
                lastOdds={lastOdds}
                liveMatchData={liveMatchData}
                clsnamename=""
                needSuspend={true}
                titleStatus={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mogambo;
