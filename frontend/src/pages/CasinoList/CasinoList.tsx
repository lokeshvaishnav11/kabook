import React from "react";
import { isMobile } from "react-device-detect";
import CasinoListItem from "./CasinoListItem";
const CasinoList = () => {
  const casinoWidth = isMobile ? "col-3" : "col-2";

  const CASINO_TABS = [
    { label: "Our Casino", link: "/casino-list/LC/4" },
    { label: "Our VIP Casino", link: "/casino-list/LC/45" },
    { label: "Our Premium Casino", link: "/casino-list/LC/52" },
    { label: "Our Virtual", link: "/casino-list/LC/19" },
    { label: "Tembo", link: "/casino-list/LC/53" },
  ];

  const CASINO_SUB_TABS = [
    { label: "All Casino", link: "/casino-list/LC/4/35", active: true },
    { label: "Roulette", link: "/casino-list/LC/4/31" },
    { label: "Teenpatti", link: "/casino-list/LC/4/20" },
    { label: "Poker", link: "/casino-list/LC/4/21" },
    { label: "Baccarat", link: "/casino-list/LC/4/22" },
    { label: "Dragon Tiger", link: "/casino-list/LC/4/23" },
    { label: "32 Cards", link: "/casino-list/LC/4/24" },
    { label: "Andar Bahar", link: "/casino-list/LC/4/26" },
    { label: "Lucky 7", link: "/casino-list/LC/4/27" },
    { label: "3 Card Judgement", link: "/casino-list/LC/4/28" },
    { label: "Casino War", link: "/casino-list/LC/4/29" },
    { label: "Worli", link: "/casino-list/LC/4/30" },
    { label: "Sports", link: "/casino-list/LC/4/34" },
    { label: "Bollywood", link: "/casino-list/LC/4/32" },
    { label: "Lottery", link: "/casino-list/LC/4/33" },
    { label: "Queen", link: "/casino-list/LC/4/40" },
    { label: "Race", link: "/casino-list/LC/4/41" },
    { label: "Others", link: "/casino-list/LC/4/73" },
  ];

  return (
    <>
      <div className="game-headingd">
        <ul
          style={{ overflowX: "scroll", background: "#2C3E50" }}
          className="rows d-flex mx-0 mt-0 text-nowrap"
        >
          {CASINO_TABS.map((tab) => (
            <li key={tab.link} className="nav-item">
              <a className="nav-link text-white" href={"#"}>
                <span>{tab.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <ul
        style={{ overflowX: "scroll" }}
        className="rows d-flex mx-0 mt-0 text-nowrap"
      >
        {CASINO_SUB_TABS.map((tab) => (
          <li key={tab.link} className="nav-item">
            <a
              href={"#"}
              className={`nav-link ${tab.active ? "active" : ""}`}
              style={{ background: "#0088CC", color: "white" }}
            >
              <span>{tab.label}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="">
        <div className="card-content home-page casino-list pt30 pb30">
          <CasinoListItem />
        </div>
      </div>
    </>
  );
};
export default React.memo(CasinoList);
