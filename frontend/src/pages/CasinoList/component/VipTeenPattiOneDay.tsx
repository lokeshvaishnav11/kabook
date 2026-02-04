import React from 'react';
import { useParams } from 'react-router-dom';
import ButtonIItemKBC from './_common/new/ButtonIItemKBC';
import { isMobile } from 'react-device-detect';

const VipTeenPattiOneDay = (props: any) => {
  const { lastOdds, liveMatchData } = props;
  const { gameCode } = useParams();

  /* ================= HELPER ================= */
  const getMarketRunner = (name: string, subtype?: string) =>
    lastOdds?.market?.find(
      (m: any) =>
        m.MarketName === name &&
        (!subtype || m.Runners?.[0]?.subtype === subtype)
    )?.Runners?.[0];

  /* ================= CELL ================= */
  const renderCell = (item: any, type: 'b' | 'l') => {
    if (!item) {
      return (
        <div
          className="col-3 d-flex align-items-center justify-content-center"
          style={{ height: '2.5rem' }}
        >
          <span className="text-muted">0</span>
        </div>
      );
    }

    const odds = type === 'b' ? item.b : item.l;

    return (
      <div
        className={`col-3 p-0 vipTeenPatti1day-suspended ${type === 'b' ? 'back' : 'lay'
          }`}
        style={{ height: '2.5rem' }}
      >
        <ButtonIItemKBC
          selectionid={item.sid}
          title={odds}
          lastOdds={item}
          liveMatchData={liveMatchData}
        />
      </div>
    );
  };

  /* ================= RUNNERS ================= */
  const playerAMain = getMarketRunner('Player A');
  const playerACon = getMarketRunner('Player A', 'con');
  const playerBMain = getMarketRunner('Player B');
  const playerBCon = getMarketRunner('Player B', 'con');

  return (
    <>
      <style>
        {`
  .table-danger-border > :not(caption) > * > * {
    border-color: #bebebeff !important;
  }
`}
      </style>
      <div className="container">
        <div className="row casino-32A">

          {/* ================= PLAYER A ================= */}
          <div className="col-md-6 p-0">
            <div className="border" style={{
              backgroundColor: "#f2f2f2",
              ...(!isMobile ? { marginRight: ".5%" } : {}),
            }}>
              {/* HEADER */}
              <div className="row fw-bold text-center border-bottom p-0 m-0">
                <div
                  className="col-6 d-flex align-items-center"
                  style={{ height: '1.8rem' }}
                >
                  Player A
                </div>
                <div className="col-3 back align-content-center">Back</div>
                <div className="col-3 lay-color align-content-center">Lay</div>
              </div>

              {/* ROWS */}
              {[
                { label: 'Main', runner: playerAMain },
                { label: 'Consecutive', runner: playerACon },
              ].map(({ label, runner }) => {
                const item = runner?.sid ? lastOdds?.[runner.sid] : undefined;

                return (
                  <div key={label} className="row border-bottom g-0 align-items-center m-0">
                    <div
                      className="col-6 fw-bold px-2 d-flex align-items-center"
                      style={{ height: '2.5rem' }}
                    >
                      {label}
                    </div>
                    {renderCell(item, 'b')}
                    {renderCell(item, 'l')}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= PLAYER B ================= */}
          <div className="col-md-6 p-0">
            <div className="border" style={{
              backgroundColor: "#f2f2f2",
              ...(!isMobile ? { marginLeft: ".5%" } : { marginTop: "1%" }),
            }}>
              {/* HEADER */}
              <div className="row g-0 fw-bold text-center border-bottom m-0">
                <div
                  className="col-6 d-flex align-items-center"
                  style={{ height: '1.8rem' }}
                >
                  Player B
                </div>
                <div className="col-3 back align-content-center">Back</div>
                <div className="col-3 lay-color align-content-center">Lay</div>
              </div>

              {/* ROWS */}
              {[
                { label: 'Main', runner: playerBMain },
                { label: 'Consecutive', runner: playerBCon },
              ].map(({ label, runner }) => {
                const item = runner?.sid ? lastOdds?.[runner.sid] : undefined;

                return (
                  <div key={label} className="row border-bottom m-0 g-0 align-items-center">
                    <div
                      className="col-6 fw-bold d-flex align-items-center"
                      style={{ height: '2.5rem' }}
                    >
                      {label}
                    </div>
                    {renderCell(item, 'b')}
                    {renderCell(item, 'l')}
                  </div>
                );
              })}
            </div>
          </div>
          {/* ================= CARDS ================= */}
          <div className="col-12 mt-3 p-0">
            <table className="table table-bordered table-danger-border mb-0 text-center align-middle" style={{ backgroundColor: "#f2f2f2" }}>
              {/* HEADER */}
              <thead>
                <tr className="fw-bold">
                  <th className='p-0' style={{ width: '20%' }}></th>
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <th key={n} style={{ fontSize: 12, height: '1.8rem', alignContent: "center" }}>
                      Card {n}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {['Odd', 'Even'].map(type => (
                  <tr key={type}>

                    {/* LABEL */}
                    <td
                      className="fw-bold p-0"
                      style={{ height: '2.5rem', alignContent: "center" }}
                    >
                      {type}
                    </td>

                    {[1, 2, 3, 4, 5, 6].map(num => {
                      const market = Array.isArray(lastOdds?.market)
                        ? lastOdds.market.find(
                          (m: any) => m?.MarketName === `Card ${num}`
                        )
                        : null;
                      const runner = market?.Runners?.[0];
                      const oddObj = runner?.odds?.find(
                        (o: any) => o.nat === type
                      );

                      if (!runner || !oddObj) {
                        return (
                          <td
                            key={num}
                            style={{ height: '2.5rem' }}
                          >
                            <span className="text-muted">0</span>
                          </td>
                        );
                      }

                      return (
                        <td
                          key={num}
                          className="p-0"
                          style={{ height: '2.5rem' }}
                        >
                          <div
                            className="back vipTeenPatti1day-suspended"
                            style={{
                              height: '100%',
                              width: '100%',
                              overflow: 'hidden',
                            }}
                          >
                            <ButtonIItemKBC
                              selectionid={oddObj.sid}
                              title={oddObj.b}
                              lastOdds={{
                                ...runner,
                                sid: oddObj.sid,
                                b: oddObj.b,
                                l: oddObj.l,
                                runnerName: oddObj.nat,
                              }}
                              liveMatchData={liveMatchData}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default VipTeenPattiOneDay;
