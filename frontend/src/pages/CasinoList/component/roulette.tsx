import React, { useEffect, useState } from "react";
import CasinoPnl from "./casinoPnl";
import Minmax from "./_common/minmax";
import ButtonItemroulette12 from "./_common/new/ButtonItemroulette";
import { isMobile } from "react-device-detect";

const RED = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
const COLUMN_MAP = ["3rd Column", "2nd Column", "1st Column"];

const getBg = (n: number) => {
    if (n === 0) return { backgroundColor: "#17732e" };
    if (RED.has(n)) return { backgroundColor: "#b2121f" };
    return { backgroundColor: "#111111" };
};

const Roulette = ({ lastOdds, liveMatchData }: any) => {
    const [selectedCoin, setSelectedCoin] = React.useState<number>(25);
    const [betSide, setBetSide] = React.useState<"BACK" | "LAY">("BACK");
    const [selectedButtons, setSelectedButtons] = React.useState<Map<string, number>>(new Map());
    const [hoveredBet, setHoveredBet] = React.useState<string | null>(null);
    const [marketStatus, setMarketStatus] = useState<'locked' | 'active'>('locked');

    const toggleSelection = (numbers: string) => {
        setSelectedButtons(prev => {
            const newMap = new Map(prev);
            if (newMap.has(numbers)) {
                const currentAmount = newMap.get(numbers) || 0;
                newMap.set(numbers, currentAmount + selectedCoin);
            } else {
                newMap.set(numbers, selectedCoin);
            }
            return newMap;
        });
    };
    const isSelected = (numbers: string) => selectedButtons.has(numbers);
    const clearAllBets = () => setSelectedButtons(new Map());
    const handleBetSideChange = (newSide: "BACK" | "LAY") => {
        if (betSide !== newSide) setSelectedButtons(new Map());
        setBetSide(newSide);
    };

    const runners = liveMatchData?.defaultMarkets?.find((m: any) => m.MarketName === "Number")?.Runners || [];
    const winNum = lastOdds?.cardsstring && lastOdds?.cardsstring !== ""
        ? parseInt(lastOdds?.cardsstring.trim())
        : null;

    const isWinNumber = (num: number) =>
        winNum !== null && !isNaN(winNum) && winNum === num;

    const rows = [
        [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
        [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
        [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
    ];

    const COINS = [
        { value: 25, img: "/imgs/roulette12/25.webp" },
        { value: 50, img: "/imgs/roulette12/50.webp" },
        { value: 100, img: "/imgs/roulette12/100.webp" },
        { value: 200, img: "/imgs/roulette12/200.webp" },
        { value: 500, img: "/imgs/roulette12/500.webp" },
        { value: 1000, img: "/imgs/roulette12/1K.webp" },
    ];

    const getNumbersInBet = (bet: string): number[] => {
        const bets: { [key: string]: number[] } = {
            "1st Column": [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
            "2nd Column": [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
            "3rd Column": [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
            "1st 12": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            "2nd 12": [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
            "3rd 12": [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
            "1 to 18": Array.from({ length: 18 }, (_, i) => i + 1),
            "19 to 36": Array.from({ length: 18 }, (_, i) => i + 19),
            "Red": Array.from(RED),
            "Black": Array.from({ length: 36 }, (_, i) => i + 1).filter(n => !RED.has(n) && n !== 0),
            "Even": Array.from({ length: 36 }, (_, i) => i + 1).filter(n => n % 2 === 0),
            "Odd": Array.from({ length: 36 }, (_, i) => i + 1).filter(n => n % 2 === 1)
        };

        if (bets[bet]) return bets[bet];
        if (bet === "0") return [0];
        const nums = bet.split(',').map(n => parseInt(n)).filter(n => !isNaN(n));
        return nums.length ? nums : [];
    };

    const isHighlighted = (num: number) => hoveredBet ? getNumbersInBet(hoveredBet).includes(num) : false;
    const handleHover = (bet: string) => setHoveredBet(bet);
    const handleHoverOut = () => setHoveredBet(null);

    // ✅ REUSABLE PROPS FACTORY - REMOVED 100+ REPEATED PROPS
    const getButtonProps = (numbers: string, title: string = "", isNumber = false, betType: string) => ({
        numbers,
        title,
        runners,
        selectedCoin,
        buttonCoin: selectedButtons.get(numbers) || selectedCoin,
        betSide,
        liveMatchData,
        isNumber,
        isSelected: isSelected(numbers),
        onToggle: () => toggleSelection(numbers),
        onMouseEnter: () => handleHover(numbers),
        onMouseLeave: handleHoverOut,
        betType,
        cleanBet: clearAllBets,
        marketStatus,
        lastOdds
    });

    const splitName = (a: number, b: number) => `${Math.min(a, b)},${Math.max(a, b)}`;

    // ✅ Real-time market sync
    useEffect(() => {
        const firstRunnerStatus = lastOdds?.market?.[0]?.Runners?.[0]?.s;
        if (firstRunnerStatus === 1) {
            setMarketStatus('active');
        } else if (firstRunnerStatus === 0) {
            setMarketStatus('locked');
        }
    }, [lastOdds]);
    return (
        <>
            <style>
                {`
@keyframes winZoomShake {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  25% {
    transform: scale(1.4);
    opacity: 1;
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(0.8);
  }
}

.win-text-animate {
  display: inline-block;
  animation: winZoomShake 1.4s ease-in-out infinite;
}

`}
            </style>
            {
                !isMobile ? (
                    <div className="container-fluid bg-white" style={{ position: "relative" }}>
                        {/* WIN NUMBER */}
                        {winNum !== null && (
                            <div className="d-flex align-items-center justify-content-center text-white fw-bold"
                                style={{
                                    position: "absolute", top: isMobile ? "-26vh" : '-75vh', left: "10vw", width: "70px", height: "60px",
                                    clipPath: "polygon(0 0,100% 0,85% 100%,15% 100%)",
                                    borderRadius: "15px",
                                    fontSize: "45px",
                                    background: RED.has(Number(winNum)) ? "#b2121f" : Number(winNum) === 0 ? "#17732e" : "#111",
                                    zIndex: 10,
                                }}
                            >
                                {winNum}
                            </div>
                        )}
                        {/* COINS & CONTROL */}
                        {!(marketStatus === 'locked') && (
                            <div className="d-flex flex-column align-items-center" style={{ position: "absolute", top: isMobile ? '-12vh' : "-22vh", left: "17px", gap: "8px" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px" }}>
                                    {COINS.map((coin) => (
                                        <img key={coin.value} src={coin.img} alt=""
                                            onClick={() => setSelectedCoin(coin.value)}
                                            style={{
                                                width: "48px", height: "48px", cursor: "pointer",
                                                transform: selectedCoin === coin.value ? "scale(1.25)" : "scale(1)",
                                                transition: "0.15s",
                                            }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* BACK / LAY */}
                        <div className="d-flex mb-1">
                            <button onClick={() => handleBetSideChange("BACK")}
                                style={{ width: 100, height: 36, background: "#72bbef", border: betSide === "BACK" ? "1.5px solid #040404ff" : "none", color: "#222121ff", cursor: 'pointer', fontWeight: "bold", borderRadius: "18px 0 0 18px" }}>
                                BACK
                            </button>
                            <button onClick={() => handleBetSideChange("LAY")}
                                style={{ width: 100, height: 36, background: "#faa9ba", border: betSide === "LAY" ? "1.5px solid #040404ff" : "none", color: "#222121ff", cursor: 'pointer', fontWeight: "bold", borderRadius: "0 18px 18px 0" }}>
                                LAY
                            </button>
                        </div>

                        {/* TABLE */}
                        <div className="d-flex">
                            {/* ZERO */}
                            <div className="position-relative d-flex justify-content-center align-items-center border-end"
                                style={{ flex: "0 0 8%", backgroundColor: isHighlighted(0) ? "rgba(23, 115, 46, 0.6)" : "#17732e" }}>
                                <ButtonItemroulette12 {...getButtonProps("0", "0", true, "number")} />

                                {/* ZERO SPLITS */}
                                {["0,1", "0,2", "0,3"].map((split, i) => (
                                    <div key={split} style={{
                                        position: "absolute",
                                        ...(i === 0 ? { bottom: "11%", right: '-13%' } :
                                            i === 1 ? { top: "50%", transform: 'translateY(-50%)', right: '-13%' } :
                                                { top: "11%", right: '-13%' }),
                                        width: 12, height: 16, zIndex: 15, display: "flex", alignItems: "center", justifyContent: "center"
                                    }}>
                                        <ButtonItemroulette12 {...getButtonProps(split, "", false, "split")} />
                                    </div>
                                ))}

                                {/* ZERO BASKETS */}
                                {["0,1,2", "0,2,3"].map((basket, i) => (
                                    <div key={basket} style={{
                                        position: "absolute",
                                        ...(i === 0 ? { bottom: "27%", right: "-13%" } : { top: "26%", right: "-13%" }),
                                        width: 12, height: 16, zIndex: 16, display: "flex", alignItems: "center", justifyContent: "center"
                                    }}>
                                        <ButtonItemroulette12 {...getButtonProps(basket, "", false, "basket")} />
                                    </div>
                                ))}
                            </div>
                            {/* GRID */}
                            <div className="flex-fill">
                                {rows.map((row, ri) => (
                                    <div key={ri} className="d-flex">
                                        {row.map((num, ci) => {
                                            const numStr = String(num);
                                            const topNum = rows[ri - 1]?.[ci];
                                            const bottomNum = rows[ri + 1]?.[ci];
                                            const leftNum = row[ci - 1];
                                            const rightNum = row[ci + 1];

                                            return (
                                                <div key={num} className="position-relative flex-fill border d-flex justify-content-center align-items-center"
                                                    style={{
                                                        aspectRatio: "1 / 1",
                                                        backgroundColor: isHighlighted(num)
                                                            ? `rgba(${num === 0 ? 23 : RED.has(num) ? 178 : 17}, ${num === 0 ? 115 : RED.has(num) ? 18 : 17}, ${num === 0 ? 46 : RED.has(num) ? 31 : 17}, 0.6)`
                                                            : getBg(num).backgroundColor
                                                    }}>

                                                    <ButtonItemroulette12 {...getButtonProps(numStr, numStr, true, "number")} />

                                                    {/* show win number */}
                                                    {isWinNumber(num) && (
                                                        <div
                                                            className="position-absolute d-flex justify-content-center align-items-center"
                                                            style={{
                                                                top: "0%",
                                                                left: "0%",
                                                                width: "100%",
                                                                height: "100%",
                                                                background: RED.has(Number(winNum)) ? "#b2121f" : Number(winNum) === 0 ? "#17732e" : "#111",
                                                                color: "#fff",
                                                                fontSize: "26px",
                                                                fontWeight: "bold",
                                                                zIndex: 30,
                                                                pointerEvents: "none",
                                                            }}
                                                        >
                                                            <span
                                                                className="win-text-animate"
                                                                style={{ fontSize: "30px" }}
                                                            >
                                                                {winNum}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {/* HORIZONTAL SPLIT */}
                                                    {topNum && (
                                                        <div style={{
                                                            position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)",
                                                            width: "40%", height: 12, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center"
                                                        }}>
                                                            <ButtonItemroulette12 {...getButtonProps(`${Math.min(topNum, num)},${Math.max(topNum, num)}`, "", false, "split")} />
                                                        </div>
                                                    )}

                                                    {/* VERTICAL SPLIT */}
                                                    {leftNum && (
                                                        <div style={{
                                                            position: "absolute", left: -6, top: "50%", transform: "translateY(-50%)",
                                                            display: "flex", alignItems: "center", justifyContent: "center", width: 12, height: "40%", zIndex: 20
                                                        }}>
                                                            <ButtonItemroulette12 {...getButtonProps(splitName(leftNum, num), "", false, "split")} />
                                                        </div>
                                                    )}

                                                    {/* CORNER */}
                                                    {bottomNum && rightNum && rows[ri + 1]?.[ci + 1] && (
                                                        (() => {
                                                            const correctName = `${bottomNum},${num},${rows[ri + 1][ci + 1]},${rightNum}`;
                                                            return (
                                                                <div style={{
                                                                    position: "absolute", right: "-13%", bottom: "-15%",
                                                                    width: 14, height: 10, display: "flex", alignItems: 'center', justifyContent: "center", zIndex: 20
                                                                }}>
                                                                    <ButtonItemroulette12 {...getButtonProps(correctName, "", false, "corner")} />
                                                                </div>
                                                            );
                                                        })()
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {/* COLUMN */}
                                        <div className="border d-flex justify-content-center align-items-center" style={{ flex: "0 0 8%", aspectRatio: "1 / 1", backgroundColor: "#fef0a9" }}>
                                            <ButtonItemroulette12 {...getButtonProps(COLUMN_MAP[ri], "2to1", false, "column")} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* DOZENS */}
                        <div className="d-flex border-top mx-auto" style={{ width: "84.5%" }}>
                            {["1st 12", "2nd 12", "3rd 12"].map((name) => (
                                <div key={name} className="flex-fill border fw-bold d-flex justify-content-center align-items-center" style={{ width: '33.33%', height: 50, backgroundColor: "#fef0a9" }}>
                                    <ButtonItemroulette12 {...getButtonProps(name, name, false, "dozen")} />
                                </div>
                            ))}
                        </div>

                        {/* OUTSIDE */}
                        <div className="d-flex border-top mx-auto" style={{ width: "84.5%" }}>
                            {["1 to 18", "Even", "Red", "Black", "Odd", "19 to 36"].map((name) => (
                                <div key={name} className="flex-fill border fw-bold d-flex justify-content-center align-items-center" style={{ height: 50, backgroundColor: "#fef0a9", width: '16.66%' }}>
                                    <ButtonItemroulette12 {...getButtonProps(name, name, false, "outside")} />
                                </div>
                            ))}
                        </div>
                        {/* <Minmax min={liveMatchData?.min} max={liveMatchData?.max} /> */}
                    </div>
                ) : (
                    <div className="container-fluid p-1 position-relative" style={{ backgroundColor: "#616161", width: "100vw", height: "69vh" }}>
                        <div style={{ display: "flex", gap: 2, width: "100%", height: "100%" }}>
                            {/* LEFT SIDE */}
                            <div style={{ height: '78%', width: "25%", display: "flex", gap: "3px", marginTop: "20%" }}>
                                {/* OUTSIDE */}
                                <div style={{ display: "flex", width: "49%", height: '100%', flexDirection: "column", gap: "3px" }}>
                                    {["1 to 18", "Even", "Red", "Black", "Odd", "19 to 36"].map((name) => (
                                        <div
                                            key={name}
                                            className="d-flex justify-content-center align-items-center"
                                            style={{
                                                width: '100%',
                                                height: '16.3%',
                                                background: "#fef0a9",
                                                writingMode: "vertical-rl",
                                                fontSize: 11,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <ButtonItemroulette12 {...getButtonProps(name, name, false, "outside")} />
                                        </div>
                                    ))}
                                </div>
                                {/* DOZENS */}
                                <div style={{ display: "flex", flexDirection: "column", width: "49%", height: '100%', gap: "3px" }}>
                                    {["1st 12", "2nd 12", "3rd 12"].map((name) => (
                                        <div
                                            key={name}
                                            className="d-flex justify-content-center align-items-center"
                                            style={{
                                                width: '100%',
                                                height: '33%',
                                                background: "#fef0a9",
                                                writingMode: "vertical-rl",
                                                fontSize: 11,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <ButtonItemroulette12 {...getButtonProps(name, name, false, "dozen")} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: "flex", width: "74%", height: "100%" }}>
                                <div style={{ width: "83%", height: "100%", position: "relative" }}>
                                    {/* WIN NUMBER */}
                                    {winNum !== null && (
                                        <div className="d-flex align-items-center justify-content-center text-white fw-bold"
                                            style={{
                                                position: "absolute", top: '12%', left: '50%', transform: "translateX(-50%)", width: "70px", height: "60px",
                                                clipPath: "polygon(0 0,100% 0,85% 100%,15% 100%)",
                                                borderRadius: "15px",
                                                fontSize: "45px",
                                                background: RED.has(Number(winNum)) ? "#b2121f" : Number(winNum) === 0 ? "#17732e" : "#111",
                                                zIndex: 20,
                                            }}
                                        >
                                            {winNum}
                                        </div>
                                    )}
                                    {/* back and lay */}
                                    <div className="d-flex justify-content-center align-items-center mb-1" style={{ width: "90%", height: "7%", margin: "auto" }}>
                                        <button
                                            onClick={() => handleBetSideChange("BACK")}
                                            style={{
                                                width: '50%',
                                                height: '100%',
                                                background: "#72bbef",
                                                border: betSide === "BACK" ? "2px solid #f0f0f0ff" : "none",
                                                fontWeight: "bold",
                                                borderRadius: "16px 0 0 16px",
                                            }}
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => handleBetSideChange("LAY")}
                                            style={{
                                                width: '50%',
                                                height: '100%',
                                                background: "#faa9ba",
                                                border: betSide === "LAY" ? "2px solid #f0f0f0ff" : "none",
                                                fontWeight: "bold",
                                                borderRadius: "0 16px 16px 0",
                                            }}
                                        >
                                            Lay
                                        </button>
                                    </div>
                                    {/* ZERO (TOP BAR) */}
                                    <div
                                        className="position-relative d-flex justify-content-center align-items-center"
                                        style={{
                                            width: '100%',
                                            height: '6%',
                                            backgroundColor: isHighlighted(0) ? "rgba(23, 115, 46, 0.6)" : "#17732e",
                                            color: "#fff",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        <ButtonItemroulette12 {...getButtonProps("0", "0", true, "number")} />
                                        {/* ZERO SPLITS */}
                                        {["0,1", "0,2", "0,3"].map((split, i) => (
                                            <div key={split} style={{
                                                position: "absolute",
                                                ...(i === 0 ? { bottom: "-20%", left: '13%' } :
                                                    i === 1 ? { bottom: "-20%", left: '50%', transform: 'translateX(-50%)' } :
                                                        { bottom: "-20%", right: '13%' }),
                                                width: 25, height: 13, zIndex: 15, display: "flex", alignItems: "center", justifyContent: "center"
                                            }}>
                                                <ButtonItemroulette12 {...getButtonProps(split, "", false, "split")} />
                                            </div>
                                        ))}

                                        {/* ZERO BASKETS */}
                                        {["0,1,2", "0,2,3"].map((basket, i) => (
                                            <div key={basket} style={{
                                                position: "absolute",
                                                ...(i === 0 ? { bottom: "-20%", left: "28%" } : { bottom: "-20%", right: "28%" }),
                                                width: 25, height: 13, zIndex: 16, display: "flex", alignItems: "center", justifyContent: "center"
                                            }}>
                                                <ButtonItemroulette12 {...getButtonProps(basket, "", false, "basket")} />
                                            </div>
                                        ))}
                                    </div>
                                    {/* NUMBER GRID WITH SPLIT / CORNER / HIGHLIGHT */}
                                    <div
                                        className="bg-white"
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "0.5%",
                                            paddingTop: "0.5%",
                                            height: "78%",
                                            width: "100%"
                                        }}
                                    >
                                        {Array.from({ length: 12 }).map((_, rowIndex) => (
                                            <div key={rowIndex} style={{ display: "flex", gap: "3px", height: "78%", width: "100%" }}>
                                                {[0, 1, 2].map((colIndex) => {
                                                    const r = 2 - colIndex;
                                                    const num = rows[r][rowIndex];

                                                    // Neighbours
                                                    const topNum = rowIndex > 0 ? rows[r][rowIndex - 1] : null;
                                                    const bottomNum = rowIndex < 11 ? rows[r][rowIndex + 1] : null;
                                                    const leftNum = colIndex > 0 ? rows[2 - (colIndex - 1)][rowIndex] : null;
                                                    const rightNum = colIndex < 2 ? rows[2 - (colIndex + 1)][rowIndex] : null;

                                                    return (
                                                        <div
                                                            key={num}
                                                            className="position-relative d-flex justify-content-center align-items-center"
                                                            style={{
                                                                width: "33%",
                                                                height: "100%",
                                                                backgroundColor: isHighlighted(num)
                                                                    ? `rgba(${num === 0 ? 23 : RED.has(num) ? 178 : 17},
                                                             ${num === 0 ? 115 : RED.has(num) ? 18 : 17},
                                                             ${num === 0 ? 46 : RED.has(num) ? 31 : 17},
                                                             0.6)`
                                                                    : getBg(num).backgroundColor,
                                                            }}
                                                        >
                                                            {/* NUMBER */}
                                                            <ButtonItemroulette12
                                                                {...getButtonProps(String(num), String(num), true, "number")}
                                                            />
                                                            {/* show win number */}
                                                            {isWinNumber(num) && (
                                                                <div
                                                                    className="position-absolute d-flex justify-content-center align-items-center"
                                                                    style={{
                                                                        inset: 0,
                                                                        background: RED.has(winNum!)
                                                                            ? "#b2121f"
                                                                            : winNum === 0
                                                                                ? "#17732e"
                                                                                : "#111",
                                                                        color: "#fff",
                                                                        fontSize: "28px",
                                                                        fontWeight: "bold",
                                                                        zIndex: 9999,
                                                                        pointerEvents: "none",
                                                                    }}
                                                                >
                                                                    <span
                                                                        className="win-text-animate"
                                                                        style={{ fontSize: "30px" }}
                                                                    >
                                                                        {winNum}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {/* HORIZONTAL SPLIT (TOP) */}
                                                            {topNum && (
                                                                <div
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: -6,
                                                                        left: "50%",
                                                                        transform: "translateX(-50%)",
                                                                        width: "40%",
                                                                        height: 10,
                                                                        zIndex: 20,
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                    }}
                                                                >
                                                                    <ButtonItemroulette12
                                                                        {...getButtonProps(
                                                                            `${Math.min(topNum, num)},${Math.max(topNum, num)}`,
                                                                            "",
                                                                            false,
                                                                            "split"
                                                                        )}
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* VERTICAL SPLIT (LEFT) */}
                                                            {leftNum && (
                                                                <div
                                                                    style={{
                                                                        position: "absolute",
                                                                        left: -6,
                                                                        top: "50%",
                                                                        transform: "translateY(-50%)",
                                                                        width: 12,
                                                                        height: "40%",
                                                                        zIndex: 20,
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",

                                                                    }}
                                                                >
                                                                    <ButtonItemroulette12
                                                                        {...getButtonProps(
                                                                            splitName(leftNum, num),
                                                                            "",
                                                                            false,
                                                                            "split"
                                                                        )}
                                                                    />
                                                                </div>
                                                            )}
                                                            {/* CORNER */}
                                                            {bottomNum && rightNum && (
                                                                <div
                                                                    style={{
                                                                        position: "absolute",
                                                                        right: "-10%",
                                                                        bottom: "-15%",
                                                                        width: 14,
                                                                        height: 10,
                                                                        zIndex: 20,
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                    }}
                                                                >
                                                                    <ButtonItemroulette12
                                                                        {...getButtonProps(
                                                                            `${num},${rightNum},${bottomNum},${rows[2 - (colIndex + 1)]?.[rowIndex + 1]}`,
                                                                            "",
                                                                            false,
                                                                            "corner"
                                                                        )}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                    {/* 2to1 */}
                                    <div style={{ display: "flex", gap: '1%', marginTop: "1%", height: "7.5%", width: "100%" }}>
                                        {["1st Column", "2nd Column", "3rd Column"].map((name) => (
                                            <div
                                                key={name}
                                                className="d-flex justify-content-center align-items-center"
                                                style={{
                                                    width: '33%',
                                                    height: '100%',
                                                    background: "#fef0a9",
                                                    color: "red",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                <ButtonItemroulette12 {...getButtonProps(name, "2to1", false, "column")} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* RIGHT SIDEBAR (SAME AS IMAGE) */}
                                {marketStatus !== "locked" && (
                                    <div
                                        style={{
                                            width: "16%",
                                            height: "60%",
                                            marginLeft: '1%',
                                            marginTop: "10%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            gap: '2.5%',
                                        }}
                                    >
                                        {COINS.map((coin) => (
                                            <img
                                                key={coin.value}
                                                src={coin.img}
                                                onClick={() => setSelectedCoin(coin.value)}
                                                style={{
                                                    width: '95%',
                                                    aspectRatio: '1 / 1',
                                                    cursor: "pointer",
                                                    transform: selectedCoin === coin.value ? "scale(1.2)" : "scale(1)",
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default React.memo(Roulette);
