// 📌 Your imports remain same
import authService from '../../../services/auth.service';
import { RoleType } from '../../../models/User';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectUserData } from '../../../redux/actions/login/loginSlice';
import { selectCasinoCurrentMatch } from '../../../redux/actions/casino/casinoSlice';
import { betPopup } from '../../../redux/actions/bet/betSlice';
import { IBetOn, IBetType } from '../../../models/IBet';
import React, { useState } from 'react';
import CasinoPnl from './casinoPnl';
import Limitinfo from './_common/limitinfo';
import { useParams } from 'react-router-dom';
import ButtonItem from './_common/new/ButtonItem';
import { auto } from '@popperjs/core';

const Teenpatti2O = (props: any) => {
  const { lastOdds, liveMatchData } = props;
  const { gameCode } = useParams();
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);
  const getCurrentMatch = useAppSelector(selectCasinoCurrentMatch);
  const [updateOdds, setUpdateOdds] = useState<any>(undefined);

  // 🔥 FIXED: Collect runners from all related markets
  const allMarkets = liveMatchData?.defaultMarkets || [];
  const playerAMarkets = allMarkets.filter((m: any) =>
     ['Player A', 'Player A Under 21', 'Player A Over 22'].includes(m.MarketName)
    );

  const playerBMarkets = allMarkets.filter((m: any) =>
    ['Player B', 'Player B Under 21', 'Player B Over 22'].includes(m.MarketName)
  );

  const allRunnersA = playerAMarkets.map((m: any) => m.Runners[0]);
  const allRunnersB = playerBMarkets.map((m: any) => m.Runners[0]);

  const colorPlusMarket = allMarkets.find((m: any) => m.MarketName === 'Color Plus');

  const orderA = ['Player A', 'Player A Under 21', 'Player A Over 22'];
  const orderB = ['Player B', 'Player B Under 21', 'Player B Over 22'];

  const runnerA = orderA
    .map(name => allRunnersA.find((r: any) => r.RunnerName === name))
    .filter(Boolean);

  const runnerB = orderB
    .map(name => allRunnersB.find((r: any) => r.RunnerName === name))
    .filter(Boolean);

  const onBet = (isBack = false, item: any) => {
    const ipAddress = authService.getIpAddress();
    if (userState.user.role === RoleType.user) {
      const oddsVal = parseFloat(isBack ? item.b : item.l);
      if (oddsVal <= 0) return;
      if (item.gstatus == 'False') return;

      dispatch(betPopup({
        isOpen: true,
        betData: {
          isBack,
          odds: oddsVal,
          volume: 100,
          marketId: item.mid,
          marketName: item.MarketName,
          matchId: liveMatchData?.event_data?.match_id || 0,
          selectionName: item.runnerName,
          selectionId: parseInt(item.sid),
          pnl: 0,
          stack: 0,
          currentMarketOdds: isBack ? item.b : item.l,
          eventId: item.mid,
          exposure: 0,
          ipAddress,
          type: IBetType.Match,
          matchName: liveMatchData.title,
          betOn: IBetOn.CASINO,
          gtype: gameCode,
        },
      }));
    }
  };

  const laybacklayout = (runnerList: any[], onlyBack: boolean = false) => (
    <>
      {runnerList.map((r: any, i: number) => {
        const item: any = lastOdds?.[r.SelectionId] || {};
        const clsstatus =
          !item.gstatus ||
          item.gstatus === "SUSPENDED" ||
          item.gstatus === "CLOSED" ||
          item.gstatus === "0"
            ? "suspended"
            : "";

        return (
          <React.Fragment key={i}>

            {/* BACK BUTTON */}
            <td
              className={`back teen-section ${clsstatus} box-3`}
              style={{ textAlign: "center" }}
            >
              <button className="back" onClick={() => onBet(true, item)}>
                <span className="odd">{item.b || "0"}</span>
              </button>
            </td>

            {/* LAY BUTTON → hidden when onlyBack=true */}
            {!onlyBack && (
              <td
                className={`lay teen-section ${clsstatus} box-3`}
                style={{ textAlign: "center" }}
              >
                <button className="lay" onClick={() => onBet(false, item)}>
                  <span className="odd">{item.l || "0"}</span>
                </button>
              </td>
            )}
          </React.Fragment>
        );
      })}
    </>
  );

  return (
      <div className="container">
          {/* Player A */}
         <div className="row casino-32A">
              {/* ================= PLAYER A ================= */}
              <div className="col-lg-6 col-md-6 col-sm-12 main-market bg-gray" style={{paddingLeft:'0px',paddingRight:'5px'}}>
                 <table className="table coupon-table table-bordered suspendwidth">
                     <thead>
                       <tr style={{ background: '#f8f8f8' }}>
                         <th className="box-4 text-center">Player A</th>
                         <th className="back box-3">BACK</th>
                         <th className="lay-color box-3">LAY</th>
                       </tr>
                     </thead>
                     <tbody>
                          {/* Row 1 → Player A (BACK + LAY) */}
                          <tr>
                             <td style={{ textAlign: "center", fontWeight: 600 }}>
                               {runnerA[0]?.RunnerName}
                             </td>
                             {laybacklayout([runnerA[0]], false)}
                          </tr>
                     </tbody>
                 </table>
                 <table className="table coupon-table table-bordered suspendwidth mt-1">
                       <tbody>
                          {/* Row 2 → Under 21 + Over 22 (ONLY BACK) */}
                          <tr>
                              {/* Under 21 */}
                               <td style={{ textAlign: "center", fontWeight: 600 }}>
                                 {runnerA[1]?.RunnerName.replace("Player A ", "")}
                               </td>
                               {laybacklayout([runnerA[1]], true)}

                               {/* Over 22 */}
                               <td style={{ textAlign: "center", fontWeight: 600 }}>
                                  {runnerA[2]?.RunnerName.replace("Player A ", "")}
                               </td>
                               {laybacklayout([runnerA[2]], true)}
                          </tr>
                       </tbody>
                  </table>
              </div>
              {/* ================= PLAYER B ================= */}
              <div className="col-lg-6 col-md-6 col-sm-12 main-market bg-gray" style={{paddingRight:'0px',paddingLeft:'5px'}}>
                  <table className="table coupon-table table-bordered suspendwidth">
                      <thead>
                          <tr style={{ background: '#f8f8f8' }}>
                             <th className="box-4 text-center">Player B</th>
                             <th className="back box-3">BACK</th>
                             <th className="lay-color box-3">LAY</th>
                          </tr>
                       </thead>
                       <tbody>
                          {/* Row 1 → Player B (BACK + LAY) */}
                           <tr>
                              <td style={{ textAlign: "center", fontWeight: 600, width: "40%" }}>
                                  {runnerB[0]?.RunnerName}
                               </td>
                              {laybacklayout([runnerB[0]], false)}
                          </tr>
                      </tbody>
                  </table>
                  <table className="table coupon-table table-bordered suspendwidth mt-1">
                      <tbody>
                          {/* Row 2 → Under 21 + Over 22 (ONLY BACK) */}
                          <tr>
                              {/* Under 21 */}
                              <td style={{ textAlign: "center", fontWeight: 600 }}>
                                  {runnerB[1]?.RunnerName.replace("Player B ", "")}
                              </td>
                              {laybacklayout([runnerB[1]], true)}

                              {/* Over 22 */}
                              <td style={{ textAlign: "center", fontWeight: 600 }}>
                                 {runnerB[2]?.RunnerName.replace("Player B ", "")}
                              </td>
                              {laybacklayout([runnerB[2]], true)}
                          </tr>
                      </tbody>
                  </table>
              </div>
              {/* ================= CARDS 2-7 FROM lastOdds ================= */}
               <div className="col-12 mt-3">
                  <table className="table coupon-table table-bordered suspendwidth"> 
                      <tbody>
                          {lastOdds &&
                              Object.values(lastOdds)
                              .filter((runner: any) => runner?.MarketName?.startsWith("Card"))
                              .map((runner: any, idx: number) => {
                                  const isSuspended =
                                  !runner.gstatus || runner.gstatus === "SUSPENDED" || runner.gstatus === "CLOSED";

                                  return (
                                      <tr key={idx}>
                                           <td style={{ textAlign: "center", fontWeight: 600 }}>
                                             {/* optional card number */}
                                           </td>
                                           <td style={{ textAlign: "center" }}>
                                               {(() => {
                                                 const containsCards = runner.odds?.some(
                                                   (o: any) => typeof o.nat === "string" && o.nat.startsWith("Card ")
                                                 );

                                                   return (
                                                     <div
                                                          style={{
                                                             display: "grid",
                                                             gridTemplateColumns: `repeat(${containsCards ?13 : 6}, auto)`,
                                                             gap: "8px",
                                                             justifyContent: "center",
                                                            }}
                                                        >
                                                           {runner.odds?.map((o: any, i: number) => {
                                                             let title =
                                                               o.nat === "Spade" ? (
                                                                   <span className="card-icon">
                                                                     <span className={"card-black"}>{"}"}</span>
                                                                   </span>
                                                               ) : o.nat === "Diamond" ? (
                                                                  <span className="card-icon">
                                                                      <span className={"card-red"}>{"["}</span>
                                                                  </span>
                                                               ) : o.nat === "Club" ? (
                                                                  <span className="card-icon">
                                                                      <span className={"card-black"}>{"]"}</span>
                                                                  </span>
                                                               ) : o.nat === "Heart" ? (
                                                                  <span className="card-icon">
                                                                     <span className={"card-red"}>{"{"}</span>
                                                                  </span>
                                                                ) : (
                                                                  o.nat
                                                                );

                                                               const isCardTitle =
                                                                 typeof o.nat === "string" && o.nat.startsWith("Card ");

                                                               const cardName = isCardTitle
                                                                 ? o.nat.replace("Card ", "")
                                                                 : null;

                                                               return (
                                                                   <button
                                                                       key={i}
                                                                       className={`back ${isSuspended ? "suspended" : ""}`}
                                                                       onClick={() =>
                                                                           !isSuspended &&
                                                                           onBet(true, {
                                                                           ...runner,
                                                                           SelectionId: o.sid,
                                                                           runnerName: o.nat,
                                                                           b: o.b,
                                                                           l: o.l,
                                                                           })
                                                                        }
                                                                       style={{
                                                                         padding: "4px 8px",
                                                                         display: "flex",
                                                                         width: "100%",
                                                                         flexDirection:
                                                                          ["Heart", "Diamond", "Club", "Even", "Odd", "Spade"].includes(
                                                                          o.nat
                                                                          )
                                                                          ? "row"
                                                                          : "column",
                                                                         alignItems: "center",
                                                                         background:
                                                                          ["Heart", "Diamond", "Club", "Even", "Odd", "Spade"].includes(
                                                                          o.nat
                                                                          )
                                                                          ? "#a7d8fd"
                                                                           : "none",
                                                                         fontWeight: "600",
                                                                        }}
                                                                    >
                                                                      {isCardTitle ? (
                                                                          <img
                                                                              src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${cardName}.png`}
                                                                              alt={cardName}
                                                                              style={{
                                                                              width: "20px",
                                                                              height: "40px",
                                                                              }}
                                                                          />
                                                                          ) : (
                                                                          <span style={{ marginRight: "25px" }}>{title}</span>
                                                                           )}
               
                                                                             <span
                                                                                    style={{
                                                                                       fontSize:
                                                                                         ["Heart", "Diamond", "Club", "Even", "Odd", "Spade"].includes(
                                                                                          o.nat
                                                                                        )
                                                                                    ? "17px"
                                                                                    : "10px",
                                                                                    }}
                                                                                > {o.b || "-"}</span>
                                                                   </button>
                                                                );
                                                            })}
                                                     </div>
                                                    );
                                                })()}
                                           </td>
                                       </tr>
                                    );
                               })
                            }
                      </tbody>
                  </table>
               </div>
           </div>
    </div>
  );
};

export default Teenpatti2O;