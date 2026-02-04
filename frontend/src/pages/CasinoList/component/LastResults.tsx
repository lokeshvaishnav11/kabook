import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useNavigate } from 'react-router-dom'
import { selectCasinoCurrentMatch } from '../../../redux/actions/casino/casinoSlice'
import { useAppSelector } from '../../../redux/hooks'
import CasinoResultDetail from '../CasinoResultDetail'
import RouletteFrame from './RouletteFrame'
// ARimport { useState } from "react"



const gameWiseResultStyle: any = {
  dt20: {
    '0': {
      clsname: 'ball-runs playerc last-result',
      shortName: '',
    },
    '1': {
      clsname: 'ball-runs playera last-result',
      shortName: 'D',
    },
    '2': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'T',
    },
    '3': {
      clsname: 'ball-runs playerc last-result',
      shortName: 'T',
    },
  },
  teen: {
    '0': {
      clsname: 'ball-runs playerc last-result',
      shortName: 'T',
    },
    '1': {
      clsname: 'ball-runs playera last-result',
      shortName: 'A',
    },
    '2': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'B',
    },
  },
  lucky7eu: {
    '0': {
      clsname: 'ball-runs playerc last-result',
      shortName: 'T',
    },
    '1': {
      clsname: 'ball-runs playera last-result',
      shortName: 'L',
    },
    '2': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'H',
    },
  },
  aaa: {
    '3': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'C',
    },
    '1': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'A',
    },
    '2': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'B',
    },
  },
  baccarat: {
    '3': {
      clsname: 'ball-runs ctie last-result',
      shortName: 'T',
    },
    '1': {
      clsname: 'ball-runs cplayer last-result',
      shortName: 'P',
    },
    '2': {
      clsname: 'ball-runs cbanker last-result',
      shortName: 'B',
    },
  },
  card32: {
    '1': {
      clsname: 'ball-runs playerb last-result',
      shortName: '8',
    },
    '2': {
      clsname: 'ball-runs playerb last-result',
      shortName: '9',
    },
    '3': {
      clsname: 'ball-runs playerb last-result',
      shortName: '10',
    },
    '4': {
      clsname: 'ball-runs playerb last-result',
      shortName: '11',
    },
  },
  btable: {
    '1': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'A',
    },
    '2': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'B',
    },
    '3': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'C',
    },
    '4': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'D',
    },
    '5': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'E',
    },
    '6': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'F',
    },
  },
  poker: {
    '1': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'A',
    },
    '2': {
      clsname: 'ball-runs playera last-result',
      shortName: 'B',
    },
    '0': {
      clsname: 'ball-runs playerc last-result',
      shortName: 'T',
    },
  },
  poker20: {
    '1': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'A',
    },
    '2': {
      clsname: 'ball-runs playera last-result',
      shortName: 'B',
    },
    '0': {
      clsname: 'ball-runs playerc last-result',
      shortName: 'T',
    },
  },
  dtl20: {
    '1': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'D',
    },
    '21': {
      clsname: 'ball-runs playera last-result',
      shortName: 'T',
    },
    '41': {
      clsname: 'ball-runs playerc last-result',
      shortName: 'L',
    },
  },
  teen9: {
    '1': {
      clsname: 'ball-runs playera last-result',
      shortName: 'T',
    },
    '2': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'L',
    },
    '3': {
      clsname: 'ball-runs playera last-result',
      shortName: 'D',
    },
    '0': {
      clsname: 'ball-runs playera last-result bg-red',
      shortName: 'T',
    },
  },
  teen20: {
    '1': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'A',
    },
    '2': {
      clsname: 'ball-runs playera last-result',
      shortName: 'B',
    },
  },
  mogambo: {
    '1': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'W',
    },
    '2': {
      clsname: 'ball-runs playera last-result',
      shortName: 'L',
    },
  },
  poker6: {
    '11': {
      clsname: 'ball-runs playerb last-result',
      shortName: '1',
    },
    '12': {
      clsname: 'ball-runs playera last-result',
      shortName: '2',
    },
    '13': {
      clsname: 'ball-runs playerb last-result',
      shortName: '3',
    },
    '14': {
      clsname: 'ball-runs playera last-result',
      shortName: '4',
    },
    '15': {
      clsname: 'ball-runs playerb last-result',
      shortName: '5',
    },
    '16': {
      clsname: 'ball-runs playera last-result',
      shortName: '6',
    },
    '0': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'T',
    },
  },
  race2020: {
    '1': {
      clsname: 'ball-runs playerb last-result',
      shortName: <img src='imgs/casino/spade.png' style={{ width: !isMobile ? '28px' : '24px' }} />,
    },
    '2': {
      clsname: 'ball-runs playerb last-result',
      shortName: <img src='imgs/casino/heart.png' style={{ width: !isMobile ? '28px' : '24px' }} />,
    },
    '3': {
      clsname: 'ball-runs playerb last-result',
      shortName: <img src='imgs/casino/club.png' style={{ width: !isMobile ? '28px' : '24px' }} />,
    },
    '4': {
      clsname: 'ball-runs playerb last-result',
      shortName: (
        <img src='imgs/casino/diamond.png' style={{ width: !isMobile ? '28px' : '24px' }} />
      ),
    },
  },
  superover: {
    '1': {
      clsname: 'ball-runs playera last-result',
      shortName: 'E',
    },
    '2': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'R',
    },
    '0': {
      clsname: 'ball-runs playera last-result',
      shortName: 'T',
    },
  },
  cmeter: {
    '1': {
      clsname: 'ball-runs playera last-result',
      shortName: 'L',
    },
    '2': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'H',
    },
    '0': {
      clsname: 'ball-runs playera last-result',
      shortName: 'T',
    },
  },
  worli2: {
    '1': {
      clsname: 'ball-runs playera last-result',
      shortName: '1',
    },
    '0': {
      clsname: 'ball-runs playera last-result',
      shortName: '0',
    },
    '2': {
      clsname: 'ball-runs playera last-result',
      shortName: '2',
    },
    '3': {
      clsname: 'ball-runs playera last-result',
      shortName: '3',
    },
    '4': {
      clsname: 'ball-runs playera last-result',
      shortName: '4',
    },
    '5': {
      clsname: 'ball-runs playera last-result',
      shortName: '5',
    },
    '6': {
      clsname: 'ball-runs playera last-result',
      shortName: '6',
    },
    '7': {
      clsname: 'ball-runs playera last-result',
      shortName: '7',
    },
    '8': {
      clsname: 'ball-runs playera last-result',
      shortName: '8',
    },
    '9': {
      clsname: 'ball-runs playera last-result',
      shortName: '9',
    },
  },
  other: {
    '1': {
      clsname: 'ball-runs playera last-result',
      shortName: 'R',
    },
    '0': {
      clsname: 'ball-runs playera last-result',
      shortName: 'R',
    },
  },
  fivewicket: {
    '0': {
      clsname: 'ball-runs playertie last-result',
      shortName: 'T',
    },
    '1': {
      clsname: 'ball-runs playera last-result',
      shortName: 'A',
    },
    '2': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'I',
    },
  },
  cmatch20: {
    '1': {
      clsname: 'ball-runs playera last-result',
      shortName: <img src={`/imgs/casino/ball2.png`} className='img-fluid' />,
    },
    '2': {
      clsname: 'ball-runs playerb last-result',
      shortName: <img src={`/imgs/casino/ball3.png`} className='img-fluid' />,
    },
    '3': {
      clsname: 'ball-runs playerb last-result',
      shortName: <img src={`/imgs/casino/ball4.png`} className='img-fluid' />,
    },
    '4': {
      clsname: 'ball-runs playerb last-result',
      shortName: <img src={`/imgs/casino/ball5.png`} className='img-fluid' />,
    },
    '5': {
      clsname: 'ball-runs playerb last-result',
      shortName: <img src={`/imgs/casino/ball6.png`} className='img-fluid' />,
    },
    '6': {
      clsname: 'ball-runs playerb last-result',
      shortName: <img src={`/imgs/casino/ball7.png`} className='img-fluid' />,
    },
    '7': {
      clsname: 'ball-runs playerb last-result',
      shortName: <img src={`/imgs/casino/ball8.png`} className='img-fluid' />,
    },
    '8': {
      clsname: 'ball-runs playerb last-result',
      shortName: <img src={`/imgs/casino/ball9.png`} className='img-fluid' />,
    },
    '9': {
      clsname: 'ball-runs playerb last-result',
      shortName: <img src={`/imgs/casino/ball10.png`} className='img-fluid' />,
    },
  },
  ab20: {
    '0': {
      clsname: 'ball-runs playera last-result',
      shortName: 'R',
    }
  },
  abj: {
    '1': {
      clsname: 'ball-runs playera last-result',
      shortName: 'A',
    },
    '2': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'B',
    },
  },
  race17: {
    '0': {
      clsname: 'ball-runs playera last-result',
      shortName: 'N',
    },
    '1': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'Y',
    },
  },
  teen1: {
    '1': {
      clsname: 'ball-runs playera last-result',
      shortName: 'P',
    },
    '2': {
      clsname: 'ball-runs playerb last-result',
      shortName: 'D',
    },
  },
  lottcard: {
    '756': {
      clsname: 'ball-runs playerb last-result',
      shortName: '756',
    },
    '2': {
      clsname: 'ball-runs playerb last-result',
      shortName: '735',
    },
    '3': {
      clsname: 'ball-runs playerb last-result',
      shortName: '230',
    },
    '4': {
      clsname: 'ball-runs playerb last-result',
      shortName: '820',
    },
  },
}

// ===== ROULETTE COLOR LOGIC (NEW, SAFE) =====
const ROULETTE_RED = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18,
  19, 21, 23, 25, 27, 30, 32, 34, 36
])

const ROULETTE_BLACK = new Set([
  2, 4, 6, 8, 10, 11, 13, 15, 17,
  20, 22, 24, 26, 28, 29, 31, 33, 35
])

const getRouletteBgClass = (num: string | number) => {
  if (num === '0' || num === 0 || num === '00') return 'bg-success'
  const n = Number(num)
  if (ROULETTE_RED.has(n)) return 'bg-danger'
  if (ROULETTE_BLACK.has(n)) return 'bg-dark'
  return 'bg-secondary'
}

const LastResults = (props: any) => {
  const { lastResult, gameId } = props
  console.log(lastResult, 'lastresult')
  const navigate = useNavigate()
  const [popupdata, setPopData] = useState<any>({})
  const [popupstatus, setPopStatus] = useState<any>(false)
  const getCurrentMatch = useAppSelector(selectCasinoCurrentMatch)

  useEffect(() => {
    console.log(popupdata, 'popup data')
  }, [])

  const shouldHideHeader = () => {
    if (!isMobile) return false;
    switch (gameId) {
      case 'roulette12':
      case 'roulette11':
      case 'roulette13':
        return true;

      default:
        return false;
    }
  };
  const getShortName = ({ shortName, result }: any) => {
    return <span className={`player${result}`}>{shortName}</span>
  }
  const handleResultsClick = (Item: any) => {

    // console.log(Item,'result item')

    setPopData({ ...Item, ...{ title: getCurrentMatch.title, slug: getCurrentMatch.slug, "event_data": { title: getCurrentMatch.title } } })
    setPopStatus(true)
  }

  const datamapItem = (Item: any, key: number) => {
    console.log(Item, key, 'result item')
    let clsname = ''
    let shortName = ''
    // if (!Item.result) return
    try {
      switch (gameId) {
        // case 'race20':
        //   clsname = 'ball-runs playerb last-result playersuit'
        //   break
        case 'lucky7eu':
        case 'lucky7':
        case 'lucky7eu2':
        case 'lucky5':
          clsname = gameWiseResultStyle['lucky7eu'][Item.win]['clsname']
          shortName = gameWiseResultStyle['lucky7eu'][Item.win]['shortName']
          break
        case 'aaa':
        case 'aaa2':
        case 'dum10':
        case 'joker20':
        case 'poison':
        case 'poison20':
          clsname = gameWiseResultStyle['aaa'][Item.win]['clsname']
          shortName = gameWiseResultStyle['aaa'][Item.win]['shortName']
          break
        case 'baccarat':
        case 'baccarat2':
          clsname = gameWiseResultStyle['baccarat'][Item.win]['clsname']
          shortName = gameWiseResultStyle['baccarat'][Item.win]['shortName']
          break
        case 'race17':
          clsname = gameWiseResultStyle['race17'][Item.win]['clsname']
          shortName = gameWiseResultStyle['race17'][Item.win]['shortName']
          break
        case 'queen':
          clsname = 'ball-runs playerb last-result'
          shortName = (Item.win - 1).toString()
          break
        case 'teen':
        case 'teen3':
        case 'teen32':
        case 'teen33':
        case 'teen41':
        case 'teen42':
        case 'teen62':
        case 'cmeter1':
          clsname = gameWiseResultStyle['teen'][Item.win]['clsname']
          shortName = gameWiseResultStyle['teen'][Item.win]['shortName']
          break
        case 'card32':
        case 'card32eu':
          clsname = gameWiseResultStyle['card32'][Item.win]['clsname']
          shortName = gameWiseResultStyle['card32'][Item.win]['shortName']
          break
        case 'lottcard':
          // clsname = gameWiseResultStyle['lottcard'][Item.win]['clsname']
          // shortName = gameWiseResultStyle['lottcard'][Item.win]['shortName']
          clsname = 'ball-runs ball-runs-lottcard playerb last-result'
          shortName = Item.win
          break

        case 'btable':
        case 'btable2':
        case 'race2':
          clsname = gameWiseResultStyle['btable'][Item.win]['clsname']
          shortName = gameWiseResultStyle['btable'][Item.win]['shortName']
          break
        case 'dt20':
        case 'dt202':
        case 'dt6':
          clsname = gameWiseResultStyle['dt20'][Item.win]['clsname']
          shortName = gameWiseResultStyle['dt20'][Item.win]['shortName']
          break
        case 'poker':
          clsname = gameWiseResultStyle['poker'][Item.win]['clsname']
          shortName = gameWiseResultStyle['poker'][Item.win]['shortName']
          break
        case 'poker20':
        case 'goal':
          clsname = gameWiseResultStyle['poker20'][Item.win]['clsname']
          shortName = gameWiseResultStyle['poker20'][Item.win]['shortName']
          break
        case 'dtl20':
          clsname = gameWiseResultStyle['dtl20'][Item.win]['clsname']
          shortName = gameWiseResultStyle['dtl20'][Item.win]['shortName']
          break
        case 'teen20':
        case 'teen20b':
        case 'teen20c':
        case 'teenmuf':
        case 'patti2':
        case 'teensin':
          clsname = gameWiseResultStyle['teen20'][Item.win]['clsname']
          shortName = gameWiseResultStyle['teen20'][Item.win]['shortName']
          break
        case 'mogambo':
          clsname = gameWiseResultStyle['mogambo'][Item.win]['clsname']
          shortName = gameWiseResultStyle['mogambo'][Item.win]['shortName']
          break

        case 'roulette12':
        case 'roulette13':
        case 'roulette11':
          clsname = `badge rounded-circle mx-1 p-1 ${getRouletteBgClass(Item.win)} text-white`
          shortName = Item.win
          break
        case 'poker6':
          clsname = gameWiseResultStyle['poker6'][Item.win]['clsname']
          shortName = gameWiseResultStyle['poker6'][Item.win]['shortName']
          break
        case 'race20':
          clsname = gameWiseResultStyle['race2020'][Item.win]['clsname']
          shortName = gameWiseResultStyle['race2020'][Item.win]['shortName']
          break
        case 'teen9':
          clsname = gameWiseResultStyle['teen9'][Item?.win || 0]['clsname']
          shortName = gameWiseResultStyle['teen9'][Item?.win || 0]['shortName']
          break
        case 'superover':
          clsname = gameWiseResultStyle['superover'][Item.win]['clsname']
          shortName = gameWiseResultStyle['superover'][Item.win]['shortName']
          break
        case 'fivewicket':
          clsname = gameWiseResultStyle['fivewicket'][Item.win]['clsname']
          shortName = gameWiseResultStyle['fivewicket'][Item.win]['shortName']
          break
        case 'worli2':
          clsname = gameWiseResultStyle['worli2'][Item.win]['clsname']
          shortName = gameWiseResultStyle['worli2'][Item.win]['shortName']
          break
        case 'cmeter':
          clsname = gameWiseResultStyle['cmeter'][Item.win]['clsname']
          shortName = gameWiseResultStyle['cmeter'][Item.win]['shortName']
          break
        case 'cmatch20':
          clsname = gameWiseResultStyle['cmatch20'][Item.win]['clsname']
          shortName = gameWiseResultStyle['cmatch20'][Item.win]['shortName']
          break
        case 'worlimatka':
        case 'war':
        case 'teen8':
        case '3cardsj':
        case 'ab2':
        case 'ab20':
        case 'dolidana':
        case 'trio':
        case 'goal':
        case 'lucky15':
        case 'ballbyball':
        case 'kbc':
        case 'notenum':
        case 'joker1':
        case 'joker120':
          clsname = gameWiseResultStyle['other'][1]['clsname']
          shortName = gameWiseResultStyle['other'][1]['shortName']
          break
        case 'abj':
        case 'teen6':
        case 'trap':
          clsname = gameWiseResultStyle['abj'][Item.win]['clsname']
          shortName = gameWiseResultStyle['abj'][Item.win]['shortName']
          break
        case 'teen1':
        case 'teen120':
          clsname = gameWiseResultStyle['teen1'][Item.win]['clsname']
          shortName = gameWiseResultStyle['teen1'][Item.win]['shortName']
          break

        default:
          clsname = 'ball-runs playerb last-result'
          shortName = Item.result
          break
      }
    } catch (error) {
      console.log('deni')
    }

    let clsscolor =
      (gameId == 'baccarat2' && Item.winnerName == 'Player') ||
        (gameId == 'baccarat' && Item.winnerName == 'Player')
        ? 'player-color'
        : ''
    clsscolor =
      (gameId == 'baccarat2' && Item.winnerName == 'Banker') ||
        (gameId == 'baccarat' && Item.winnerName == 'Banker')
        ? 'banker-color'
        : clsscolor
    clsscolor =
      (gameId == 'baccarat2' && Item.winnerName == 'Tie Game') ||
        (gameId == 'baccarat' && Item.winnerName == 'Tie Game')
        ? 'tie-color'
        : clsscolor

    return (
      <span
        key={key}
        onClick={() => {
          handleResultsClick(Item)
        }}
        className={`${clsname} ${clsscolor}`}
      >
        {getShortName({ shortName })}
      </span>
    )
  }

  const datamap = () => {
    return lastResult && lastResult.results && lastResult.results.data
      ? lastResult.results.data.map((Item: any, key: number) => {
        return datamapItem(Item, key)
      })
      : ''
  }
  const datamapnew = () => {
    return lastResult && lastResult.results && lastResult.results
      ? lastResult.results.map((Item: any, key: number) => {
        return datamapItem(Item, key)
      })
      : ''
  }
  return (
    <>
      <div className={`card m-b-10 my-bet mt-${shouldHideHeader() ? '0' : '10'}`}
        style={{
          width: shouldHideHeader() ? '160px' : undefined,
          height: shouldHideHeader() ? '55px' : undefined,
        }}
      >
        {
          !shouldHideHeader() && (
            <div className='card-header casino'>
              <h6 className='card-title d-inline-block'>
                {'Last Result'}
                <span
                  className='float-right'
                // onClick={() => {
                //   navigate(`/casino/result/${gameId}`)
                // }}
                >
                  {/* View All{' '} */}
                </span>
              </h6>
            </div>
          )
        }
        <div
          className='card-body'
          style={{
            padding: shouldHideHeader() ? '4px' : '5px',
            display: shouldHideHeader() ? 'inline-grid' : 'block',
            gridTemplateColumns: shouldHideHeader()
              ? 'repeat(5, minmax(0, 1fr))'
              : 'auto',
            gap: '3px',
            justifyContent: 'end',
            marginLeft: 'auto',
            width: shouldHideHeader() ? '100%' : 'unset',
          }}
        >
          {lastResult && lastResult.results && datamapnew()}
        </div>
      </div>
      <CasinoResultDetail
        popupdata={popupdata}
        setPopStatus={setPopStatus}
        popupstatus={popupstatus}
      />
    </>
  )
}
export default LastResults
