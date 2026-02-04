import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { isMobile } from "react-device-detect";

const CasinoTimer = (props: any) => {


    const { lastOdds } = props
    //   console.log(lastOdds,'LASTODDSS')
    const [counter, setCounter] = useState<number>(0)
    // if (lastOdds && lastOdds.autotime && lastOdds.autotime > 1 && counter == 0) {
    //     setCounter(lastOdds.autotime);
    // }
    const { gameCode } = useParams();
    const isRoulette = isMobile && (
        gameCode === 'roulette11' ||
        gameCode === 'roulette12' ||
        gameCode === 'roulette13'
    );

    useEffect(() => {
        /// counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
        if (lastOdds.autotime != '') {
            setCounter(parseInt(lastOdds.autotime));
        }
    }, [lastOdds.autotime, lastOdds]);
    useEffect(() => {
        //  counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
        // if(lastOdds?.slug=='Tp1Day')
        // {
        //     const timernew = lastOdds?.event_data?.market?.[0]?.Runners?.[0]?.gstatus!='SUSPENDED' ? lastOdds?.event_data?.market?.[0]?.Runners?.[0]?.lasttime : lastOdds?.event_data?.market?.[0]?.Runners?.[1]?.lasttime
        //     if(timernew)
        //     {
        //         setCounter(parseInt(timernew));
        //     }
        // }
    }, [lastOdds?.event_data?.market?.[0]?.Runners]);
    return (
        <div className={`clock clock2digit flip-clock-wrapper ${isRoulette ? 'roulette-mobile' : ''}`}>
            <ul className="flip play">
                <li className="flip-clock-before">
                    <a href="#" className="">
                        <div className="up">
                            <div className="shadow" ></div>
                            <div className="inn">1</div>
                        </div>
                        <div className="down">
                            <div className="shadow"></div>
                            <div className="inn">1</div>
                        </div>
                    </a>
                </li>
                <li className="flip-clock-active">
                    <a href="#">
                        <div className="up">
                            <div className="shadow"></div>
                            <div className="inn">{counter.toString().length > 1 ? counter.toString().substring(0, 1) : 0}</div>
                        </div>
                        <div className="down">
                            <div className="shadow"></div>
                            <div className="inn">{counter.toString().length > 1 ? counter.toString().substring(0, 1) : 0}</div>
                        </div>
                    </a>
                </li>
            </ul>
            <ul className="flip play">
                <li className="flip-clock-before">
                    <a href="#">
                        <div className="up">
                            <div className="shadow"></div>
                            <div className="inn">8</div>
                        </div>
                        <div className="down">
                            <div className="shadow"></div>
                            <div className="inn">8</div>
                        </div>
                    </a>
                </li>
                <li className="flip-clock-active">
                    <a href="#">
                        <div className="up">
                            <div className="shadow"></div>
                            <div className="inn">{counter.toString().length > 1 ? counter.toString().substring(1, 2) : counter.toString().substring(0, 1)}</div>
                        </div>
                        <div className="down">
                            <div className="shadow"></div>
                            <div className="inn">{counter.toString().length > 1 ? counter.toString().substring(1, 2) : counter.toString().substring(0, 1)}</div>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    )
}
export default CasinoTimer;