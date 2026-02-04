import React, { useState } from "react";
import { isMobile } from "react-device-detect";

const leftMenu = [
    "Jodi",
    "Single",
    "Pana",
    "SP",
    "DP",
    "Trio",
    "Cycle",
    "Motor SP",
    "56 Charts",
    "64 Charts",
    "ABR",
    "Common SP",
    "Common DP",
    "Color DP",
];

/* ===================== DATA ===================== */

const spPanaData: Record<number, number[]> = {
    1: [128, 137, 146, 236, 245, 290, 380, 470, 489, 560, 579, 678],
    2: [129, 138, 147, 156, 237, 246, 345, 390, 480, 570, 589, 679],
    3: [120, 139, 148, 157, 238, 247, 256, 346, 490, 580, 670, 689],
    4: [130, 149, 158, 167, 239, 248, 257, 347, 356, 590, 660, 789],
    5: [140, 159, 168, 230, 249, 258, 267, 348, 357, 456, 690, 780],
    6: [123, 150, 169, 178, 240, 259, 268, 349, 358, 367, 457, 790],
    7: [124, 160, 179, 250, 269, 278, 340, 359, 467, 567, 680, 890],
    8: [125, 134, 170, 189, 260, 279, 350, 369, 468, 478, 567, 890],
    9: [126, 135, 180, 234, 270, 289, 360, 379, 450, 469, 566, 568],
    0: [127, 136, 145, 190, 235, 280, 370, 389, 460, 479, 578, 689],
};

const dpPanaData: Record<number, number[]> = {
    1: [100, 119, 155, 227, 335, 344, 399, 588, 669],
    2: [110, 200, 228, 255, 336, 499, 660, 668, 776],
    3: [166, 229, 300, 337, 355, 445, 598, 778, 786],
    4: [112, 220, 266, 336, 400, 446, 455, 689, 770],
    5: [113, 122, 177, 339, 366, 447, 500, 789, 889],
    6: [114, 277, 330, 448, 466, 555, 600, 860, 899],
    7: [115, 133, 188, 223, 377, 449, 557, 700, 799],
    8: [116, 224, 233, 266, 440, 477, 556, 880, 990],
    9: [117, 144, 199, 225, 388, 559, 577, 667, 900],
    0: [118, 226, 244, 299, 334, 488, 550, 666, 677],
};

const tpPanaData = ["777", "444", "111", "888", "555", "222", "999", "666", "333", "000"];

const Worli3: React.FC = (props: any) => {
    const [activeMenu, setActiveMenu] = useState("Jodi");
    const [panaTab, setPanaTab] = useState<"SP" | "DP">("DP");
    const [totalAmount, setTotalAmount] = React.useState<number>(0);
    const coinAudio = React.useRef<HTMLAudioElement | null>(null);

    const getCoinValue = (chip: number | string): number => {
        if (chip === "1K") return 1000;
        return Number(chip);
    };
    // sound section

    React.useEffect(() => {
        coinAudio.current = new Audio("/sound/coin.mp3");
        coinAudio.current.volume = 0.8;
    }, []);



    const CoinButtons = (
        <div className="d-flex gap-2 ms-2 align-items-center">
            <div
                className="total d-flex align-items-center justify-content-center"
                style={{ ...coin, backgroundImage: "url('/imgs/coins/8.png')" }}
            >
                {totalAmount}
            </div>

            <div className="px-2 align-content-center">=</div>

            {[25, 50, 100, 200, 500, "1K"].map((chip) => (
                <div
                    key={chip}
                    className="d-flex align-items-center justify-content-center"
                    style={{ ...coin, backgroundImage: "url('/imgs/coins/1.png')" }}
                    onClick={() => {
                        if (coinAudio.current) {
                            coinAudio.current.currentTime = 0;
                            coinAudio.current.play();
                        }
                        setTotalAmount((prev) => prev + getCoinValue(chip))
                    }}
                >
                    {chip}
                </div>
            ))}
        </div>
    );

    return (
        <div className="container-fluid p-0">
            {/* ================= TOP BAR ================= */}
            {isMobile ? (
                <div
                    className="d-flex flex-column align-items-center px-2 py-2"
                    style={{ background: "#cccccc", gap: ".4rem" }}
                >
                    <div className="d-flex" style={{ gap: '1rem' }}>
                        <button className="btn btn-danger btn-sm rounded-0" onClick={() => setTotalAmount(0)}>Reset</button>
                        <button className="btn rounded-0 btn-sm fw-bold" style={{ background: "#bebebe" }}>
                            SET YOUR COIN AMOUNT AND START 1-CLICK BET!
                        </button>
                    </div>
                    {CoinButtons}
                </div>
            ) : (
                <div
                    className="d-flex align-items-center px-2 py-2"
                    style={{ background: "#cccccc", gap: ".4rem" }}
                >
                    <button className="btn rounded-0 btn-sm fw-bold" style={{ background: "#bebebe" }}>
                        SET YOUR COIN AMOUNT <br /> AND START 1-CLICK BET!
                    </button>
                    <button className="btn btn-danger btn-sm rounded-0" onClick={() => setTotalAmount(0)}>Reset</button>
                    {CoinButtons}
                </div>
            )}
            {/* ================= MAIN CONTENT ================= */}
            <div className="p-0 m-0 d-flex" style={{ width: "100%", gap: ".5%" }}>
                {/* LEFT MENU */}
                <div className="" style={{ width: '19%' }}>
                    {leftMenu.map((item) => (
                        <div
                            key={item}
                            onClick={() => setActiveMenu(item)}
                            style={{
                                width: "100%",
                                height: isMobile ? '4vh' : '6vh',
                                textAlign: "center",
                                fontSize: isMobile ? '1.5vh' : '3.2vh',
                                alignContent: "center",
                                cursor: "pointer",
                                background: activeMenu === item ? "#2c3e50" : "#cccccc",
                                color: activeMenu === item ? "#fff" : "#000",
                                fontWeight: 600,
                                borderBottom: "1px solid #070707",
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </div>
                {/* RIGHT SIDE */}
                <div className="" style={{ width: "81%" }}>
                    {/* ================= JODI ================= */}
                    {activeMenu === "Jodi" && (
                        <div className="row g-1 m-0" style={{ paddingTop: isMobile ? '4vh' : "6vh" }}>
                            {Array.from({ length: 100 }).map((_, i) => {
                                const row = Math.floor(i / 10);
                                const col = i % 10;
                                return (
                                    <div key={i} className="p-0" style={{ width: isMobile ? '20%' : "10%" }} >
                                        <div style={jodiBox}>{row}-{col}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {/* ================= SINGLE ================= */}
                    {activeMenu === "Single" && (
                        <>
                            <div className="row g-1 m-0 align-items-stretch" style={{ paddingTop: isMobile ? '4vh' : "6vh" }}>
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <div
                                        key={n}
                                        className="col-auto p-0"
                                        style={{ width: "12%" }}
                                    >
                                        <div style={singleBox}>{n}</div>
                                    </div>
                                ))}

                                <div className="col p-0">
                                    <LineBox title="LINE 1" subtitle="1|2|3|4|5" />
                                </div>

                                <div className="col p-0">
                                    <LineBox title="ODD" subtitle="1|3|5|7|9" />
                                </div>
                            </div>
                            <div className="row g-1 m-0 align-items-stretch">
                                {[6, 7, 8, 9, 0].map((n) => (
                                    <div key={n}
                                        className="col-auto p-0"
                                        style={{ width: "12%" }}
                                    >
                                        <div style={singleBox}>{n}</div>
                                    </div>
                                ))}
                                <div className="col p-0">
                                    <LineBox title="LINE 2" subtitle="6|7|8|9|0" />
                                </div>
                                <div className="col p-0">
                                    <LineBox title="EVEN" subtitle="2|4|6|8|0" />
                                </div>
                            </div>
                        </>
                    )}
                    {/* ================= PANA ================= */}
                    <div className="" style={{ width: "100%" }}>
                        {activeMenu === "Pana" && (
                            <>
                                {/* TABS */}
                                <div className="d-flex" style={{ height: isMobile ? '4vh' : "6vh" }}>
                                    <div
                                        onClick={() => setPanaTab("SP")}
                                        style={tabStyle(panaTab === "SP")}
                                    >
                                        SP PANA ()
                                    </div>
                                    <div
                                        onClick={() => setPanaTab("DP")}
                                        style={tabStyle(panaTab === "DP")}
                                    >
                                        DP PANA & TRIO ()
                                    </div>
                                </div>
                                {/* SP PANA */}
                                {panaTab === "SP" && (
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: isMobile ? "repeat(5, 1fr)" : "repeat(10, 1fr)",
                                            width: "100%",
                                            gap: "1%",
                                        }}
                                    >
                                        {Object.entries(spPanaData).map(([d, list]) => (
                                            <div
                                                key={d}
                                                style={{
                                                    border: "1px solid #79c2f2",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    padding: "0px 6%"
                                                }}
                                            >
                                                <div className="mx-auto" style={panaHeader}>{d}</div>

                                                {list.map((v) => (
                                                    <div key={v} style={panaBox}>
                                                        {v}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* DP PANA */}
                                {panaTab === "DP" && (
                                    <>
                                        <div style={{ height: "2.5rem", alignContent: "center" }}>
                                            <span style={{ borderBottom: "2px solid #79c2f2", fontWeight: 800 }}>DP PANA</span>
                                        </div>
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: isMobile ? "repeat(5, 1fr)" : "repeat(10, 1fr)",
                                                width: "100%",
                                                gap: "1%",
                                            }}>
                                            {Object.entries(dpPanaData).map(([d, list]) => (
                                                <div key={d}
                                                    style={{
                                                        border: "1px solid #79c2f2",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        padding: "0px 6%"
                                                    }}
                                                >
                                                    <div className="mx-auto" style={panaHeader}>{d}</div>
                                                    {list.map((v) => (
                                                        <div key={v} style={panaBox}>{v}</div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                        {/* TP PANA */}
                                        <div style={{ height: "3.5rem", alignContent: "center" }}>
                                            <span style={{ borderBottom: "2px solid #79c2f2", fontWeight: 800 }}>TP PANA</span>
                                        </div>

                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: isMobile ? "repeat(5, 1fr)" : "repeat(10, 1fr)",
                                                width: "100%",
                                                gap: "4px",
                                            }}
                                        >
                                            {tpPanaData.map((v) => (
                                                <div key={v}>
                                                    <div style={tpBox}>{v}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    {/* ================= SP ================= */}
                    {activeMenu === "SP" && (
                        <div className="row g-1 m-0" style={{ width: "100%", paddingTop: isMobile ? '4vh' : "6vh" }}>
                            {/* NUMBERS */}
                            <div className="col-8 p-0">
                                <div className="row m-0">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
                                        <div key={n} className="col-auto p-0" style={{ width: "20%" }}>
                                            <div style={spBox}>{n}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SP ALL */}
                            <div className="col-4 p-0">
                                <div style={All}>SP ALL</div>
                            </div>
                        </div>
                    )}
                    {/* ================= DP UI ================= */}
                    {activeMenu === "DP" && (
                        <div className="row g-1 m-0" style={{ width: "100%", paddingTop: isMobile ? '4vh' : "6vh" }}>
                            {/* NUMBERS */}
                            <div className="col-8 p-0">
                                <div className="row g-1 m-0">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
                                        <div key={n} className="col-auto p-0" style={{ width: "20%" }}>
                                            <div style={spBox}>{n}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* DP ALL */}
                            <div className="col-4 p-0">
                                <div style={All}>DP ALL</div>
                            </div>
                        </div>
                    )}
                    {/* ================= Trio ================= */}
                    {activeMenu === 'Trio' && (
                        <div className="" style={{ width: "100%", height: isMobile ? '9vh' : "15vh", marginTop: isMobile ? '4vh' : "6vh" }}>
                            <div style={All}>ALL TRIO</div>
                        </div>
                    )}
                    {/* ================= Cycle ================= */}
                    {activeMenu === 'Cycle' && (
                        <div className="row g-1" style={{ width: "100%", margin: isMobile ? "4vh 0 0 0" : "6vh 0 0 0" }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
                                <div key={n} className="col-auto p-0" style={{ width: "20%" }}>
                                    <div style={spBox}>{n}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* ================= Motor SP ================= */}
                    {activeMenu === 'Motor SP' && (
                        <div className="row g-1" style={{ width: "100%", margin: isMobile ? "4vh 0 0 0" : "6vh 0 0 0" }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
                                <div key={n} className="col-auto p-0" style={{ width: "20%" }}>
                                    <div style={spBox}>{n}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* ================= 56 Charts ================= */}
                    {activeMenu === '56 Charts' && (
                        <div className="row g-1 m-0" style={{ width: "100%", paddingTop: isMobile ? '4vh' : "6vh" }}>
                            {/* NUMBERS */}
                            <div className="col-8 p-0">
                                <div className="row g-1 m-0">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
                                        <div key={n} className="col-auto p-0" style={{ width: "20%" }}>
                                            <div style={spBox}>{n}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 56 ALL */}
                            <div className="col-4 p-0">
                                <div style={All}>56 ALL</div>
                            </div>
                        </div>
                    )}
                    {/* ================= 64 Charts ================= */}
                    {activeMenu === '64 Charts' && (
                        <div className="row g-1 m-0" style={{ width: "100%", paddingTop: isMobile ? '4vh' : "6vh" }}>
                            {/* NUMBERS */}
                            <div className="col-8 p-0">
                                <div className="row g-1 m-0">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
                                        <div key={n} className="col-auto p-0" style={{ width: "20%" }}>
                                            <div style={spBox}>{n}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 56 ALL */}
                            <div className="col-4 p-0">
                                <div style={All}>64 ALL</div>
                            </div>
                        </div>
                    )}
                    {/* ================= ABR ================= */}
                    {activeMenu === 'ABR' && (
                        <>
                            <div className="row m-0" style={{ paddingTop: isMobile ? '4vh' : "6vh" }}>
                                {['A', 'B', 'R'].map((n) => (
                                    <div
                                        key={n}
                                        className="col-auto p-0"
                                        style={{ width: "20%" }}
                                    >
                                        <div style={singleBox}>{n}</div>
                                    </div>
                                ))}
                                <div className="col p-0">
                                    <div style={All}>ABR</div>
                                </div>
                            </div>
                            <div className="row m-0">
                                {['AB', 'AR', 'BR'].map((n) => (
                                    <div
                                        key={n}
                                        className="col-auto p-0"
                                        style={{ width: "20%" }}
                                    >
                                        <div style={singleBox}>{n}</div>
                                    </div>
                                ))}
                                <div className="col p-0">
                                    <div style={All}>ABR CUT</div>
                                </div>
                            </div>
                        </>
                    )}
                    {/* ================= Common SP ================= */}
                    {activeMenu === 'Common SP' && (
                        <div className="row g-1" style={{ width: "100%", margin: isMobile ? "4vh 0 0 0" : "6vh 0 0 0" }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
                                <div key={n} className="col-auto p-0" style={{ width: "20%" }}>
                                    <div style={spBox}>{n}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* ================= Common DP ================= */}
                    {activeMenu === 'Common DP' && (
                        <div className="row g-1" style={{ width: "100%", margin: isMobile ? "4vh 0 0 0" : "6vh 0 0 0" }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
                                <div key={n} className="col-auto p-0" style={{ width: "20%" }}>
                                    <div style={spBox}>{n}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* ================= Color DP ================= */}
                    {activeMenu === 'Color DP' && (
                        <div className="row g-1 m-0" style={{ width: "100%", paddingTop: isMobile ? '4vh' : "6vh" }}>
                            {/* NUMBERS */}
                            <div className="col-8 p-0">
                                <div className="row g-1 m-0">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
                                        <div key={n} className="col-auto p-0" style={{ width: "20%" }}>
                                            <div style={spBox}>{n}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* DP ALL */}
                            <div className="col-4 p-0">
                                <div style={All}>COLOR DP ALL</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

/* ===================== STYLES ===================== */

const jodiBox: React.CSSProperties = {
    height: isMobile ? '5vh' : "12.5vh",
    width: '100%',
    background: "#79c2f2",
    border: "1px solid #fff",
    fontFamily: "CasinoNumFont",
    fontSize: isMobile ? '3.5vh' : '4.5vh',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const singleBox: React.CSSProperties = {
    height: 70,
    background: "#79c2f2",
    border: "1px solid #fff",
    fontFamily: "CasinoNumFont",
    fontSize: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const spBox: React.CSSProperties = {
    height: 70,
    background: "#79c2f2",
    border: "1px solid #fff",
    fontFamily: "CasinoNumFont",
    fontSize: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const All: React.CSSProperties = {
    height: "100%",
    background: "#79c2f2",
    lineHeight: "1.5rem",
    border: "1px solid #fff",
    fontFamily: "CasinoNumFont",
    fontSize: 26,
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
};

const LineBox = ({ title, subtitle, }: { title: string; subtitle: string; }) => (
    <div
        style={{
            height: 70,
            background: "#79c2f2",
            border: "1px solid #fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }}
    >
        <div style={{ fontSize: 22, fontFamily: "CasinoNumFont", }}>{title}</div>
        <div style={{ fontSize: 14 }}>{subtitle}</div>
    </div>
);
const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "0px 16px",
    alignContent: "center",
    background: active ? "#2c3e50" : "#e6e6e6",
    color: active ? "#fff" : "#000",
    fontWeight: 600,
    cursor: "pointer",
});

const panaHeader: React.CSSProperties = {
    height: isMobile ? '4.1vh' : '7vh',
    width: "90%",
    background: "#79c2f2",
    border: "1px solid #fff",
    fontFamily: "CasinoNumFont",
    fontSize: isMobile ? '3.5vh' : '4vh',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const panaBox: React.CSSProperties = {
    height: isMobile ? '4.1vh' : '7vh',
    background: "#79c2f2",
    border: "1px solid #fff",
    fontFamily: "CasinoNumFont",
    fontSize: isMobile ? '3vh' : '4vh',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};
const tpBox: React.CSSProperties = {
    height: isMobile ? '4vh' : '6vh',
    width: "100%",
    background: "#79c2f2",
    border: "1px solid #fff",
    fontFamily: "CasinoNumFont",
    fontSize: isMobile ? '3.3vh' : '4vh',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};
const coin: React.CSSProperties = {
    width: 46,
    height: 46,
    fontSize: isMobile ? '1.5vh' : "2.5vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    color: "#fff",
    cursor: 'pointer',
    fontWeight: 700,
};
export default Worli3;
