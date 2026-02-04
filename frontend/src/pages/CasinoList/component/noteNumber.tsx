import { isMobile } from 'react-device-detect'
import CasinoPnl from './casinoPnl'
import ButtonItem from './_common/new/ButtonItem'
import LaybackBox from './_common/new/LaybackBox'
import CardItem from './_common/new/CardItem'
import Limitinfo from './_common/limitinfo'
import LayBackButton from './_common/new/LayBackButton'
import LaybackBoxNote from './_common/new/LaybackBoxNote'
import CaredItemNoteNum from './_common/new/CaredItemNoteNum'
import React from 'react'

const NoteNumber = (props: any) => {
  const { lastOdds, liveMatchData } = props

  const laybacklayout = (index: any, className: string) => {
    const finalMarketList = liveMatchData?.defaultMarkets?.[index]?.Runners || [];

    return finalMarketList.map((ItemNew: any, idx: number) => {

      return (
        <div className={`${className} text-center mb-10`} key={idx}>
          <div>
            <span className='d-block'>
              <b>{ItemNew.RunnerName}</b>
            </span>
          </div>

          {/* FIX APPLIED HERE */}
          <LaybackBox
            selectionid={ItemNew.SelectionId}
            title={ItemNew.RunnerName}
            lastOdds={lastOdds?.[ItemNew.SelectionId] || {}}
            liveMatchData={liveMatchData}
          />

          <div className='tx-16 mt30'>
            <CasinoPnl
              sectionId={ItemNew.SelectionId}
              matchId={liveMatchData.match_id}
            />
          </div>
        </div>
      )
    })
  }

  const laybacklayoutmobile = (keyType: number) => {
    return liveMatchData?.defaultMarkets?.[keyType]?.Runners?.map((ItemNew: any, key: number) => {

      const Item = lastOdds?.[ItemNew.SelectionId] || {}

      let runner = "A";
      runner = ItemNew.RunnerName == "Amar Akbar Anthony" ? 'B' : runner;
      runner = ItemNew.RunnerName == "Sahib Bibi Aur Ghulam" ? 'C' : runner;
      runner = ItemNew.RunnerName == "Dharam Veer" ? 'D' : runner;
      runner = ItemNew.RunnerName == "Kis KisKo Pyaar Karoon" ? 'E' : runner;
      runner = ItemNew.RunnerName == "Ghulam" ? 'F' : runner;

      const clsstatus = !Item.gstatus || Item.gstatus === 'SUSPENDED' || Item.gstatus === 'CLOSED' ? "suspended" : "";

      return (
        <tr data-title="SUSPENDED" key={key} className={clsstatus}>
          <td className={"box-6"} style={{ paddingLeft: "3px" }}>
            <b>
              <span className="tx-red">{runner}</span>. {ItemNew.RunnerName}
            </b>
            <CasinoPnl sectionId={ItemNew.SelectionId} matchId={liveMatchData.match_id} />
          </td>

          {/* FIX APPLIED HERE */}
          <LayBackButton
            selectionid={ItemNew.SelectionId}
            lastOdds={lastOdds?.[ItemNew.SelectionId] || {}}
            liveMatchData={liveMatchData}
            clsnamename={'box-2'}
          />
        </tr>
      )
    })
  }

 const renderAllMarkets = () => {
  if (!Array.isArray(liveMatchData?.defaultMarkets)) return null;

  const markets = liveMatchData.defaultMarkets.filter(
    (m: any) => Array.isArray(m?.Runners) && m.Runners.length > 0
  );

  console.log('markets------>',lastOdds)
  // Find Baccarat 1 & 2
  const baccarat1 = markets.find((m: any) => m.MarketName.includes("Baccarat 1"));
  const baccarat2 = markets.find((m: any) => m.MarketName.includes("Baccarat 2"));

  return markets.map((market: any, idx: number) => {
    const runner = market.Runners[0];
    if (!runner) return null;

    const item = lastOdds?.[runner.SelectionId] || null;
    if (!item || (!item.b && !item.l)) return null;

    const name = market.MarketName;
    let title;

    // ---------------- Card Mapping Logic (unchanged) -----------------
    const cardSets = {
      Odd: ["A", "3", "5", "7", "9"],
      Low: ["A", "2", "3", "4", "5"],
      Even: ["2", "4", "6", "8", "10"],
      High: ["6", "7", "8", "9", "10"],
    };

    if (name.includes("Red")) {
      title = <span className="card-icon mb-2"><span className="card-red">{"[{"}</span></span>;
    } else if (name.includes("Black")) {
      title = <span className="card-icon mb-2"><span className="card-black">{"]}"}</span></span>;
    } else if (Object.keys(cardSets).some(k => name.includes(k))) {
      const key = Object.keys(cardSets).find(k => name.includes(k));
      if (key) {
        const cards = cardSets[key as keyof typeof cardSets]; // tell TS this is valid key
          title = (
            <span className="d-flex justify-content-center align-items-center">
              {name}&nbsp;
              <span className="note-number-cards">
                {cards.map((c) => (
                  <span className="not-number-card" key={c}>{c}</span>
                ))}
             </span>
            </span>
          );
        }
      } else if (name.includes("Baccarat 1") && baccarat2) {
        const runner2 = baccarat2.Runners[0];
          // Get only card markets
        const cardMarkets = Object.values(lastOdds || {}).filter(
  (m: any) =>
    typeof m?.nat === "string" && m.nat.startsWith("Card ")
);
 console.log(cardMarkets,'asdfghasdfghas---------')

        return (
    <div className="row mb-10 w-100 m-0 p-0" key="baccarat-row">

      {/* Column 1 */}
      <div className="col-4 text-center" style={{ border: "1px solid #8080804f", paddingTop: "10px" }}>
        <div className="d-flex flex-column">
          {/* Baccarat 1 */}
          <span className="d-block mb-2">
            <b>{baccarat1.MarketName} (1st, 2nd, 3rd card)</b>
            <LaybackBoxNote
              selectionid={baccarat1.Runners[0].SelectionId}
              lastOdds={lastOdds?.[baccarat1.Runners[0].SelectionId]}
              title={baccarat1.MarketName}
              liveMatchData={liveMatchData}
              showLay={false}
            />
          </span>

          {/* Baccarat 2 */}
          {runner2 && (
            <span className="d-block">
              <b>{baccarat2.MarketName} (4th, 5th, 6th card)</b>
              <LaybackBoxNote
                selectionid={runner2.SelectionId}
                lastOdds={lastOdds?.[runner2.SelectionId]}
                title={baccarat2.MarketName}
                liveMatchData={liveMatchData}
                showLay={false}
              />
            </span>
          )}
        </div>
      </div>

      {/* Column 2: Card markets */}
      <div className="col-lg-8 text-center" style={{ paddingTop: "0px",border:"1px solid #8080804f"}}>
        <div className="card-content lucky-seven-content m-b-10">
          <div className="row m-t-10">
            <div className="col-12 text-center card-seven">
   {cardMarkets.map((market: any, index: number) => (
  <React.Fragment key={index}>
    {market.odds?.map((oddsItem: any, idx: number) => (
      <div key={idx} className="d-inline-block mrc-5">
        <CaredItemNoteNum
          selectionid={oddsItem.ssid}
          title={oddsItem.nat}

          // ⬇️ FIXED — merge parent market details + odds item
          lastOdds={{
            ...oddsItem,          // Card A, Card 2 details
            parentNat: market.nat,         // "Card 1"
            parentMarketName: market.MarketName,
            parentMid: market.mid,
            gstatus: market.gstatus,       // correct gstatus
          }}

          liveMatchData={liveMatchData}
        />
      </div>
    ))}
  </React.Fragment>
))}


            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

 else {
      title = name;
    }

    // ---------------- Grid Layout (unchanged) -----------------
    let gridClass = "";
    if (name.includes("Baccarat 1") || name.includes("Baccarat 2")) {
      return null; // already rendered above
    } else if (idx < 6) {
      gridClass = "col-lg-4"; // first 6 → 3 per row
    } else {
      gridClass = "col-lg-4 col-md-6"; // next items → 2 per row
    }

    return (
      <div className={`${gridClass} text-center mb-10`} key={idx}>
        <span className="d-block"><b>{title}</b></span>

        <LaybackBoxNote
          selectionid={runner.SelectionId}
          lastOdds={lastOdds?.[runner.SelectionId]}
          title={market.MarketName}
          liveMatchData={liveMatchData}
        />
      </div>
    );
  });
};



  const layoutForDesktop = () => {
    return (
      <div className="desktop-layout">
        <div className="aaa-content m-t-10 mb-10">
          <Limitinfo
            min={liveMatchData?.event_data?.min}
            max={liveMatchData?.event_data?.max}
            nameString={"lbl8"}
            clsName={"tx-right"}
          />
          <div className="row">
            {renderAllMarkets()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {!isMobile ? layoutForDesktop() : ""}
    </>
  )
}

export default NoteNumber