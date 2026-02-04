/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useRef } from 'react'
import { useAppSelector } from '../../../redux/hooks'
import { selectCasinoCurrentMatch } from '../../../redux/actions/casino/casinoSlice'
import { calculateTotalNumbersFromString, replacecardstringSuperover } from '../../../utils/helper'
import { isMobile } from 'react-device-detect'

import PropTypes from 'prop-types'
import Carousel from 'react-elastic-carousel'
import { last } from 'lodash'

const breakPoints: any = [
  { width: 1, itemsToShow: 3 },
  { width: 550, itemsToShow: 2, itemsToScroll: 2 },
  { width: 768, itemsToShow: 3 },
  { width: 1200, itemsToShow: 3 }
]

const CasinoTitle = (props: any) => {
  const { lastResult, gameId } = props
  const refAndarBahar2 = useRef(null)
  const refAndarBahar2B = useRef(null)
  const refAndarBahar = useRef(null)
  const refAndarBaharB = useRef(null)
  const refDusKaDum = useRef(null);


  const getCurrentMatch: any = useAppSelector(selectCasinoCurrentMatch)

  useEffect(() => {
    const andarData = pushDataToPositionsAndarBhar(lastResult?.Cards)
    if (andarData?.[1] && refAndarBahar2.current) {
      //@ts-ignore
      refAndarBahar2.current.goTo(andarData?.[1].length)
    }

    if (andarData?.[0] && refAndarBahar2B.current) {
      //@ts-ignore
      refAndarBahar2B.current.goTo(andarData?.[1].length)
    }
  }, [lastResult])

  useEffect(() => {
    const andarData = lastResult?.t3?.[0]?.aall?.split(',') || []
    const baharData = lastResult?.t3?.[0]?.ball?.split(',') || []


    if (andarData && refAndarBahar.current) {
      //@ts-ignore
      refAndarBahar.current.goTo(andarData.length)
    }

    if (baharData && refAndarBaharB.current) {
      //@ts-ignore
      refAndarBaharB.current.goTo(baharData.length)
    }

  }, [lastResult?.t3?.[0]?.aall])
  useEffect(() => {
    const cards = lastResult?.lcard?.split(",") || [];
    if (cards.length && refDusKaDum.current) {
      //@ts-ignore
      refDusKaDum.current.goTo(cards.length);
    }
  }, [lastResult?.lcard]);

  const getCardValue = (card: string): number => {
    if (!card || card === '1') return 0

    const value = card.slice(0, -2) // remove suit (SS, HH, CC, DD)

    if (value === 'A') return 1
    if (value === 'J') return 11
    if (value === 'Q') return 12
    if (value === 'K') return 13

    const num = Number(value)
    return isNaN(num) ? 0 : num
  }
  const calculateCardsAndPoints = (cardsString?: string) => {
    if (!cardsString) return { totalCards: 0, totalPoints: 0 }

    const validCards = cardsString
      .split(',')
      .filter((c) => c !== '1')

    const totalPoints = validCards.reduce(
      (sum, card) => sum + getCardValue(card),
      0
    )

    return {
      totalCards: validCards.length,
      totalPoints,
    }
  }


  const pushDataToPositions = React.useCallback(
    (data: string) => {
      const positions = [0, 1, 2, 3]
      const dataArray: Array<string> = data ? data.split(',').filter((d) => d !== '1') : []
      return dataArray.reduce(
        (acc: Record<number, any>, item, index) => {
          const positionIndex = index % 4
          const position: any = positions[positionIndex]

          acc[position].push(item)
          return acc
        },
        {
          '0': [],
          '1': [],
          '2': [],
          '3': [],
        },
      )
    },
    [lastResult && lastResult.desc],
  )
  const pushDataToPositionsAndarBhar = React.useCallback(
    (data: string) => {
      const positions = [0, 1]
      const dataArray: Array<string> = data
        ? data.split(',').filter((d, i) => d !== '1' && i > 2)
        : []
      return dataArray.reduce(
        (acc: Record<number, any>, item, index) => {
          const positionIndex = index % 2
          const position: any = positions[positionIndex]

          acc[position].push(item)
          return acc
        },
        {
          '0': [],
          '1': [],
        },
      )
    },
    [lastResult && lastResult.desc],
  )
  const pushDataToPositionsCard32 = React.useCallback(
    (data: string) => {
      const positions = [0, 1, 2, 3]
      const dataArray: Array<string> = data ? data.split(',') : []
      return dataArray.reduce(
        (acc: Record<number, any>, item, index) => {
          const positionIndex = index % 4
          const position: any = positions[positionIndex]

          acc[position].push(item)
          return acc
        },
        {
          '0': [],
          '1': [],
          '2': [],
          '3': [],
        },
      )
    },
    [lastResult && lastResult.desc],
  )
  const pushDataToPositionsTheTrap = React.useCallback(
    (data: string) => {
      const positions = [0, 1]
      const dataArray: Array<string> = data ? data.split(',') : []
      return dataArray.reduce(
        (acc: Record<number, any>, item, index) => {
          const positionIndex = index % 2
          const position: any = positions[positionIndex]

          acc[position].push(item)
          return acc
        },
        {
          '0': [],
          '1': [],
        },
      )
    },
    [lastResult && lastResult.desc],
  )
  const pushDataToPositionsRace20 = React.useCallback(
    (data: string) => {
      if (!data) {
        return { 0: [], 1: [], 2: [], 3: [] }
      }

      const dataArray = data.split(',').filter((d) => d !== '1')

      return dataArray.reduce(
        (acc: Record<number, string[]>, item) => {
          let position: number | null = null

          if (item.endsWith('SS')) position = 0 // Spade
          else if (item.endsWith('HH')) position = 1 // Heart
          else if (item.endsWith('CC')) position = 2 // Club
          else if (item.endsWith('DD')) position = 3 // Diamond

          if (position !== null) {
            acc[position].push(item)
          }

          return acc
        },
        {
          0: [],
          1: [],
          2: [],
          3: [],
        }
      )
    },
    []
  )


  const queenVideoOverLay = () => {
    const cards = pushDataToPositions(lastResult.desc)
    return (
      <div className=''>
        <div className='videoCards' style={{ width: '100px' }}>
          <div>
            {[0, 1, 2, 3].map((card: any, index: number) => {
              return (
                <>
                  <div key={index}>
                    <p className={`${!isMobile ? 'mt-10 mb-10' : 'mbc-5'} text-white`}>
                      <b>
                        <span>
                          {getCurrentMatch.slug == 'queen'
                            ? `Total ${index}`
                            : `Player ${index + 8}`}
                        </span>
                        :{' '}
                        <span className='text-warning'>
                          {calculateTotalNumbersFromString(cards[index].join(',')) +
                            +(getCurrentMatch.slug == 'queen' ? index : index + 8)}
                        </span>
                      </b>
                    </p>
                    <div className='d-flex'>
                      {cards[index].map((card: any, index: number) => {
                        return (
                          <img
                            key={index}
                            src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${card}.jpg`}
                          />
                        )
                      })}
                    </div>
                  </div>
                </>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const card32VideoOverLay = () => {
    const cards = pushDataToPositionsCard32(lastResult.cards);
    console.log('cards', cards)
    return (
      <div className='videoCards' style={{ width: '100px' }}>
        {[0, 1, 2, 3].map((card: any, index: number) => {
          return (
            <>
              <p className={`${!isMobile ? 'mt-10 mb-10' : 'mbc-5'} text-white`}>
                <b>
                  <span>
                    {getCurrentMatch.slug == 'queen' ? `Total ${index}` : `Player ${index + 8}`}
                  </span>
                  :{' '}
                  <span className='text-warning'>
                    {calculateTotalNumbersFromString(
                      cards[index].filter((ItemCard: any) => ItemCard != 1).join(','),
                    ) + +(getCurrentMatch.slug == 'queen' ? index : index + 8)}
                  </span>
                </b>
              </p>
              <div className='d-flex'>
                {cards[index].map((card: any, index: number) => {
                  if (card == 1) return
                  return (
                    <img
                      key={index}
                      src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${card}.jpg`}
                    />
                  )
                })}
              </div>
            </>
          )
        })}
      </div>
    )
  }

  const race2020 = () => {
    const cards = pushDataToPositionsRace20(lastResult.cards);
    const { totalCards, totalPoints } =
      calculateCardsAndPoints(lastResult.cards)

    console.log(cards, 'cards')
    const cardExtra = lastResult?.desc?.split(',')?.filter((Item: string) => Item != '1') || []
    const carname = [
      'imgs/casino/spade.png',
      'imgs/casino/heart.png',
      'imgs/casino/club.png',
      'imgs/casino/diamond.png',
    ]
    return (
      <div>
        <div className='casino-video-title'>
          {/* <span className='casino-name'>{getCurrentMatch.slug}</span> */}
          <div className='casino-video-rid'>
            {/* Round ID:
            <span>{lastResult.match_id}</span> */}
            <div className='total-points'>
              <div>
                <div>Cards</div>
                <div>{totalCards}</div>
              </div>
              <div>
                <div>Points</div>
                <div>
                  {totalPoints}
                </div>
              </div>
            </div>
          </div>
        </div>{' '}
        <div className='video-overlay' style={{ top: isMobile ? '0px' : '65px' }}>
          <div className='videoCards'>
            <div className='video-overlay'>
              <div className='videoCards'>
                <div className=''>
                  <div className='mr-20'>
                    {[0, 1, 2, 3].map((suitIndex) => (
                      <div key={suitIndex}>
                        <div className="imgspace d-flex align-items-center">
                          {/* Suit image */}
                          <img alt="" src={carname[suitIndex]} style={{ width: isMobile ? '' : '25px' }} />

                          {/* Cards */}
                          {cards[suitIndex]?.map((card: string, i: number) => (
                            <img
                              key={i}
                              src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${card}.jpg`}
                              alt={card} style={{ width: isMobile ? '' : '25px' }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>{' '}
        </div>
      </div>
    )
  }
  const lucky7B = () => {
    const cardName = lastResult && lastResult.C1 != undefined ? lastResult.C1 : '1';
    console.log('lastresult', lastResult);
    return (
      <div className='video-overlay'>
        <div className='card-inner'>
          <h3 className='text-white'>Card</h3>{' '}
          <img
            src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${cardName}.jpg`}
          />
        </div>
      </div>
    )
  }

  const dt20 = () => {
    return (
      <div className='video-overlay'>
        <div className='imgspace d-flex'>
          <img
            src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1}.jpg`}
          />{' '}
          <img
            src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult?.C2}.jpg`}
          />
        </div>
      </div>
    )
  }
  const dolidana = () => {
    const cards = lastResult?.cards;
    if (!cards) return null;
    const [dice1, dice2] = cards.split(',');
    return (
      <div className="video-overlay">
        <div className="imgspace d-flex gap-2">
          <img src={`/imgs/dice/dice${dice1}.png`} alt="dice-1" />
          <img src={`/imgs/dice/dice${dice2}.png`} alt="dice-2" />
        </div>
      </div>
    );
  };



  const poker = () => {
    return (
      <div className='video-overlay'>
        <div className='videoCards'>
          <div className='d-flex'>
            <div className='mr-20'>
              <p className='m-b-0 text-white'>
                <b>
                  <span className=''>Player A</span>
                </b>
              </p>
              <div className='imgspace'>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2}.jpg`}
                />
              </div>
            </div>
            <div className='mr-20'>
              <p className='m-b-0 text-white'>
                <b>
                  <span className=''>Player B</span>
                </b>
              </p>
              <div className='imgspace'>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C3}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C4}.jpg`}
                />
              </div>
            </div>
          </div>
          <div>
            <p className='m-b-0 text-white'>
              <b>
                <span className=''>BOARD</span>
              </b>
            </p>
            <div className='imgspace'>
              <img
                alt=''
                src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C5}.jpg`}
              />
              <img
                alt=''
                src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C6}.jpg`}
              />
              <img
                alt=''
                src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C7}.jpg`}
              />
              <img
                alt=''
                src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C8}.jpg`}
              />
              <img
                alt=''
                src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C9}.jpg`}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const onedayteen = () => {
    return (
      <div className='video-overlay'>
        <div className='videoCards'>
          <div>
            <div className='mr-20'>
              <p className='m-b-0 text-white'>
                <b>
                  <span className=''>Player A</span>
                </b>
              </p>
              <div className='imgspace d-flex'>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1A}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2A}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C3A}.jpg`}
                />
              </div>
            </div>
            <div className='mr-20'>
              <p className='m-b-0 text-white'>
                <b>
                  <span className=''>Player B</span>
                </b>
              </p>
              <div className='imgspace d-flex'>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1B}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2B}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C3B}.jpg`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const dtl20 = () => {
    return (
      <div className='video-overlay'>
        <div className='card-inner'>
          <h3 className='text-white'>DEALER</h3>{' '}
          <div className='d-flex'>
            <img
              src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1}.jpg`}
            />
            <img
              src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2}.jpg`}
            />
            <img
              src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C3}.jpg`}
            />
          </div>
        </div>
      </div>
    )
  }
  const mogambo = () => {
    const getCardValue = (card: string | undefined): number => {
      if (!card) return 0;

      // Ignore default placeholders like "1"
      if (/^\d+$/.test(card)) return 0;

      // Face cards mapping
      if (card.includes("A")) return 1;
      if (card.includes("J")) return 11;
      if (card.includes("Q")) return 12;
      if (card.includes("K")) return 13;

      // Number cards like "3DD", "10SS"
      const match = card.match(/\d+/);
      return match ? Number(match[0]) : 0;
    };


    const total =
      getCardValue(lastResult?.C1) +
      getCardValue(lastResult?.C2) +
      getCardValue(lastResult?.C3);

    return (
      <div className='video-overlay' style={{ width: "105px" }}>
        <div className='card-inner' style={{ width: "100%" }}>
          <h2 className='text-black p-1 ' style={{ backgroundColor: "#c7b100", fontSize: "1rem", fontWeight: "bold" }}>TOTAL : {total}</h2>
          <div className='d-flex flex-column' style={{ gap: "3px", width: "100%" }}>
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ width: "100%" }}>
              <h2 className='text-white' style={{ fontSize: "1rem", fontWeight: "bold" }}>DAGA / TEJA</h2>
              <div className="d-flex align-items-center justify-content-center" style={{ width: "100%" }}>
                <img
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1}.jpg`}
                />
                <div
                  style={{
                    width: "2.5px",
                    height: "40px",
                    backgroundColor: "#fff",
                    margin: "0 6px",
                  }}
                />
                <img
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2}.jpg`}
                />
              </div>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ width: "100%" }}>
              <h3 className='text-white' style={{ fontWeight: "bold", fontSize: "1rem" }}>MOGAMBO</h3>
              <img
                className=""
                src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C3}.jpg`}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const opentp = () => {
    const cardData = lastResult?.cards?.split(',') || []
    // const cardData = finalString && finalString[0] && finalString[0].split(',')
    return (
      <div className='video-overlay'>
        <div className='card-inner'>
          <h3 className='text-white'>DEALER</h3>{' '}
          <div className='d-flex'>
            <img
              src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${cardData && cardData[8] ? cardData[8] : '1'
                }.jpg`}
            />
            <img
              src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${cardData && cardData[17] ? cardData[17] : '1'
                }.jpg`}
            />
            <img
              src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${cardData && cardData[26] ? cardData[26] : '1'
                }.jpg`}
            />
          </div>
        </div>
      </div>
    )
  }

  const Cards3J = () => {
    // console.log('lastResult', lastResult)
    return (
      lastResult &&
      lastResult.C1 && (
        <div className='video-overlay'>
          <div className='imgspace d-flex'>
            <img
              src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1}.jpg`}
            />{' '}
            <img
              src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2}.jpg`}
            />
            <img
              src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C3}.jpg`}
            />
          </div>
        </div>
      )
    )
  }
  const Lottery = () => {
    // console.log('lastResult', lastResult)
    return (
      lastResult &&
      lastResult.C1 && (
        <div className='video-overlay'>
          <div className='imgspace'>
            <img className='mb-1'
              src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1}.jpg`}
            />{' '}
            <img className='mb-1'
              src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2}.jpg`}
            />
            <img
              src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C3}.jpg`}
            />
          </div>
        </div>
      )
    )
  }

  const Cricket2020 = () => {
    return (
      lastResult &&
      lastResult.C1 && (
        <div className='video-overlay'>
          <div className='card-inner'>
            <h3 className='text-white'>DEALER</h3>{' '}
            <div className='imgspace d-flex'>
              <img
                src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1}.jpg`}
              />{' '}
            </div>
          </div>
        </div>
      )
    )
  }

  const warcasino = () => {
    return (
      lastResult &&
      lastResult.C1 && (
        <div className='video-overlay'>
          <div className='card-inner'>
            <h3 className='text-white'>DEALER</h3>{' '}
            <div className='imgspace d-flex'>
              <img
                src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C7}.jpg`}
              />{' '}
            </div>
          </div>
        </div>
      )
    )
  }

  const teen20 = () => {
    // console.log(lastResult,'lastresult')
    return (
      <div className='video-overlay'>
        <div className='videoCards'>
          <div className=''>
            <div className='mr-20'>
              <p className='m-b-0 text-white'>
                <b>
                  <span className=''>Player A</span>
                </b>
              </p>
              <div className='imgspace d-flex'>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1A}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2A}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C3A}.jpg`}
                />
              </div>
            </div>
            <div className='mr-20'>
              <p className='m-b-0 text-white'>
                <b>
                  <span className=''>Player B</span>
                </b>
              </p>
              <div className='imgspace d-flex'>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1B}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2B}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C3B}.jpg`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const poker6player = () => {
    return (
      <div className='video-overlay'>
        <div className='videoCards'>
          <div className=''>
            <div className='mr-20'>
              <div className='imgspace d-flex'>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C13}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C14}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C15}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C16}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C17}.jpg`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  const cardTeenpatti = () => {
    // console.log(lastResult,'lastResult')
    return (
      <div className='video-overlay'>
        <div className='videoCards'>
          <div className=''>
            <div className='mr-20 d-flex'>
              <div className='imgspace d-flex' style={{ flexDirection: 'column' }}>
                <img className='mb-1'
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2}.jpg`}
                />
              </div>
              <div className='imgspace d-flex' style={{ flexDirection: 'column' }}>
                <img className='mb-1'
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2A}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2B}.jpg`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  const muflisTeenpatti = () => {
    // console.log(lastResult,'lastResult')
    return (
      <div className='video-overlay'>
        <div className='videoCards'>
          <div className=''>
            <div className='mr-20'>
              <div className='imgspace d-flex'>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2}.jpg`}
                />
              </div>
              <div className='imgspace d-flex'>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2A}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2B}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2}.jpg`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }



  const testtp = () => {
    // console.log(lastResult,'lastresulty')
    return (
      <div className='video-overlay'>
        <div className='videoCards'>
          <div className=''>
            <div className='mr-20'>
              <p className='m-b-0 text-white'>
                <b>
                  <span className=''>Tiger</span>
                </b>
              </p>
              <div className='imgspace d-flex'>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C4}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C7}.jpg`}
                />
              </div>
            </div>
            <div className='mr-20'>
              <p className='m-b-0 text-white'>
                <b>
                  <span className=''>Lion</span>
                </b>
              </p>
              <div className='imgspace d-flex'>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C5}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C8}.jpg`}
                />
              </div>
            </div>
            <div className='mr-20'>
              <p className='m-b-0 text-white'>
                <b>
                  <span className=''>Dragon</span>
                </b>
              </p>
              <div className='imgspace d-flex'>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C3}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C6}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C9}.jpg`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const Superover = () => {
    const cardList = [
      lastResult.C1,
      lastResult.C2,
      lastResult.C3,
      lastResult.C4,
      lastResult.C5,
      lastResult.C6,
    ]
    return (
      lastResult &&
      lastResult.C1 && (
        <div className='video-overlay'>
          <div className='imgspace'>
            {cardList &&
              cardList.map((Item: any, key: number) => {
                return (
                  Item != '1' && (
                    <img
                      key={key}
                      src={`/imgs/card/${replacecardstringSuperover(Item)}b.png`}
                      className='mbc-5'
                    />
                  )
                )
              })}
          </div>
        </div>
      )
    )
  }

  const fivecricket = () => {
    const cardList = [
      lastResult.C1,
      lastResult.C2,
      lastResult.C3,
      lastResult.C4,
      lastResult.C5,
      lastResult.C6,
    ]
    return (
      lastResult &&
      lastResult.C1 && (
        <div className='video-overlay' style={{ background: 'none' }}>
          <div className='imgspace'>
            {cardList &&
              cardList.map((Item: any, key: number) => {
                return (
                  <img
                    alt=''
                    className='mb-1'
                    key={key}
                    src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${Item}.jpg`}
                  />
                )
              })}
          </div>
        </div>
      )
    )
  }

  const andarbahar = () => {
    const andarData = lastResult?.aall?.split(',') || []
    const baharData = lastResult?.ball?.split(',') || []
    // console.log('andarData', andarData);
    if (lastResult?.aall == '') return
    return (
      <div className='video-overlay'>
        <div className='videoCards'>
          <div>
            <div className='mr-20'>
              <p className='m-b-0 text-white'>
                <b>
                  <span className=''>Andar</span>
                </b>
              </p>
              <div className='imgspace d-flex'>
                {/* {andarData.length > 0 &&
                  andarData.length <= 4 &&
                  andarData.map((card: any, k: number) => {
                    return (
                      <img
                        key={k}
                        src={`https://dzm0kbaskt4pv.cloudfront.net/v12/static/front/img/cards/${card}.png`}
                      />
                    )
                  })} */}
                {andarData.length > 0 && (
                  // @ts-ignore
                  <Carousel ref={refAndarBahar} breakPoints={breakPoints} pagination={false}>
                    {andarData.map((Item: any, key: number) => {
                      return (
                        <img
                          alt=''
                          key={key}
                          src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${Item}.jpg`}
                        />
                      )
                    })}
                  </Carousel>
                )}
              </div>
            </div>
            <div className='mr-20'>
              <p className='m-b-0 text-white'>
                <b>
                  <span className=''>Bahar</span>
                </b>
              </p>
              <div className='imgspace d-flex'>
                {baharData.length > 0 && (
                  // @ts-ignore
                  <Carousel ref={refAndarBaharB} breakPoints={breakPoints} pagination={false}>
                    {baharData.map((Item: any, key: number) => {
                      return (
                        <img
                          alt=''
                          key={key}
                          src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${Item}.jpg`}
                        />
                      )
                    })}
                  </Carousel>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const andarbahar2 = () => {
    const andarData = pushDataToPositionsAndarBhar(lastResult?.cards);  // FIXED
    const cards = lastResult?.cards?.split(',') || []                  // FIXED
    console.log('andarData', andarData);
    if (!cards?.[0] || cards?.[0] == '1') return

    return (
      <div className='video-overlay' style={{ minWidth: '400px' }}>
        <div className='row row5 align-items-center'>
          <div className='col-1'>
            <p className='mb-0 text-white text-center' style={{ lineHeight: '44px' }}>
              <b>A</b>
            </p>
            <p className='mb-0 text-white text-center' style={{ lineHeight: '44px' }}>
              <b>B</b>
            </p>
          </div>

          <div className='col-1 pl-0'>
            <img
              src={`https://dzm0kbaskt4pv.cloudfront.net/v12/static/front/img/cards/${cards?.[0]}.png`}
              className='card-right'
            />
          </div>
          <div className='col-10'>
            <div className='card-inner'>
              <div className='row row5'>
                <div className='col-2'>
                  <img
                    src={`https://dzm0kbaskt4pv.cloudfront.net/v12/static/front/img/cards/${cards?.[2]}.png`}
                  />
                </div>
                <div className='col-10'>
                  {andarData?.[1]?.length > 3 && (
                    <>
                      {/* 
                      // @ts-ignore */}
                      <Carousel ref={refAndarBahar2} breakPoints={breakPoints} pagination={false}>
                        {andarData?.[1]?.map((card: any, k: number) => {
                          return (
                            <img
                              style={{ margin: '2px', display: 'flex' }}
                              key={k}
                              src={`https://dzm0kbaskt4pv.cloudfront.net/v12/static/front/img/cards/${card}.png`}
                            />
                          )
                        })}
                      </Carousel>
                    </>
                  )}
                  {andarData?.[1]?.length > 0 &&
                    andarData?.[1]?.length <= 3 &&
                    andarData?.[1]?.map((card: any, k: number) => {
                      return (
                        <img
                          key={k}
                          src={`https://dzm0kbaskt4pv.cloudfront.net/v12/static/front/img/cards/${card}.png`}
                        />
                      )
                    })}
                </div>
              </div>
            </div>
            <div className='card-inner'>
              <div className='row row5'>
                <div className='col-2'>
                  <img
                    src={`https://dzm0kbaskt4pv.cloudfront.net/v12/static/front/img/cards/${cards?.[1]}.png`}
                  />
                </div>
                <div className='col-10'>
                  {andarData?.[0]?.length > 3 && (
                    <>
                      {/* 
                      // @ts-ignore */}
                      <Carousel ref={refAndarBahar2B} breakPoints={breakPoints} pagination={false}>
                        {andarData?.[0]?.map((card: any, k: number) => {
                          return (
                            <img
                              style={{ margin: '2px', display: 'flex' }}
                              key={k}
                              src={`https://dzm0kbaskt4pv.cloudfront.net/v12/static/front/img/cards/${card}.png`}
                            />
                          )
                        })}
                      </Carousel>
                    </>
                  )}
                  {andarData?.[0]?.length > 0 &&
                    andarData?.[0]?.length <= 3 &&
                    andarData?.[0]?.map((card: any, k: number) => {
                      return (
                        <img
                          key={k}
                          src={`https://dzm0kbaskt4pv.cloudfront.net/v12/static/front/img/cards/${card}.png`}
                        />
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const dusKaDum = () => {
    const dusKaDumCards = lastResult?.lcard?.split(",") || [];
    const cardName = lastResult && lastResult.C1 != undefined ? lastResult.C1 : '1';
    const markets = lastResult?.event_data?.market?.[0]?.Runners || [];
    console.log('result', lastResult);
    if (lastResult?.lcard === "") return;
    return (
      <div className='video-overlay'>
        <div className='videoCards'>
          <div className='mr-20'>
            <div className='p-2' style={{ border: '1px solid yellow', width: '70%' }}>
              <div className='d-flex mb-2'>
                <p className='m-b-0 text-white'>
                  <b><span>Curr. Total: <span>{lastResult?.csum}</span></span></b>
                </p>
                <p className='m-b-0 text-white ml-3'>
                  <b><span>Card #: <span>{dusKaDumCards.length}</span></span></b>
                </p>
              </div>
              <p className='m-b-0 text-white ml-3'>
                {markets.map((Item: any, index: number) => {
                  return (
                    <b><span>{Item.nat}</span></b>
                  )
                })}
              </p>
            </div>

            <div style={{ display: 'flex' }}>
              <div className='imgspace d-flex'>
                {dusKaDumCards.length > 0 && (
                  // @ts-ignore
                  <Carousel
                    ref={refDusKaDum}
                    breakPoints={breakPoints}
                    pagination={false}
                  >
                    {dusKaDumCards.map((card: string, key: number) => (
                      <img
                        key={key}
                        alt=""
                        src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${card}.jpg`}
                      />
                    ))}
                  </Carousel>
                )}
              </div>
              <div className='card-inner align-self-center mb-0'>
                <img
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${cardName}.jpg`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const raceTo17 = () => {
    return (
      <div className='video-overlay'>
        <div className='videoCards'>
          <div className=''>
            <p className='m-b-0 text-white'>
              <b>
                <span className=''>Total <span>{lastResult?.csum}</span></span>
              </b>
            </p>
            <div className='mr-20'>
              <div className='imgspace d-flex' style={{ flexDirection: 'column', gap: '5px' }}>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1B}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2A}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2B}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C3A}.jpg`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const teenpattiPoison = () => {
    return (
      <div className='video-overlay'>
        <div className='videoCards'>
          <div className='mr-20'>
            <p className='m-b-0 text-white'>
              <b>
                <span className='' style={{ color: '#ef910f' }}>POISON</span>
              </b>
            </p>
            <div className='imgspace'>
              <img
                alt=''
                src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1}.jpg`}
              />
            </div>
          </div>
          <div>
            <div className='mr-20'>
              <p className='m-b-0 text-white'>
                <b>
                  <span className=''>Player A</span>
                </b>
              </p>
              <div className='imgspace d-flex'>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C4}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C6}.jpg`}
                />
              </div>
            </div>
            <div className='mr-20'>
              <p className='m-b-0 text-white'>
                <b>
                  <span className=''>Player B</span>
                </b>
              </p>
              <div className='imgspace d-flex'>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C3}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C5}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C7}.jpg`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  const teenpattiJoker = () => {
    return (
      <div className='video-overlay'>
        <div className='videoCards'>
          <div className='mr-20'>
            <p className='m-b-0 text-white'>
              <b>
                <span className='' style={{ color: '#ef910f' }}>Joker</span>
              </b>
            </p>
            <div className='imgspace'>
              <img
                alt=''
                src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1}.jpg`}
              />
            </div>
          </div>
          <div>
            <div className='mr-20'>
              <p className='m-b-0 text-white'>
                <b>
                  <span className=''>Player A</span>
                </b>
              </p>
              <div className='imgspace d-flex'>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C4}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C6}.jpg`}
                />
              </div>
            </div>
            <div className='mr-20'>
              <p className='m-b-0 text-white'>
                <b>
                  <span className=''>Player B</span>
                </b>
              </p>
              <div className='imgspace d-flex'>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C3}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C5}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C7}.jpg`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  const unlimitedJokerone = () => {
    return (
      <div className='video-overlay'>
        <div className='videoCards'>
          <div className='mr-20'>
            <p className='m-b-0 text-white'>
              <b>
                <span className='' style={{ color: '#ef910f' }}>Joker</span>
              </b>
            </p>
            <div className='imgspace'>
              <img
                alt=''
                src={`https://g1ver.sprintstaticdata.com/v80/static/front/img/joker1/14.png`}
              />
            </div>
          </div>
          <div>
            <div className='mr-20'>
              <p className='m-b-0 text-white'>
                <b>
                  <span className=''>Player A</span>
                </b>
              </p>
              <div className='imgspace d-flex'>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C3}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C5}.jpg`}
                />
              </div>
            </div>
            <div className='mr-20'>
              <p className='m-b-0 text-white'>
                <b>
                  <span className=''>Player B</span>
                </b>
              </p>
              <div className='imgspace d-flex'>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C4}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C6}.jpg`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  const teenpattiOneDay = () => {
    return (
      <div className='video-overlay'>
        <div className='videoCards'>
          <div className='mr-20'>
            <p className='m-b-0 text-white'>
              <b>
                <span className=''>PLAYER</span>
              </b>
            </p>
            <div className='imgspace'>
              <img
                alt=''
                src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1}.jpg`}
              />
            </div>
          </div>
          <div>
            <div className='mr-20'>
              <p className='m-b-0 text-white'>
                <b>
                  <span className=''>Dealer</span>
                </b>
              </p>
              <div className='imgspace d-flex'>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2}.jpg`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const race2 = () => {
    const cards = pushDataToPositionsCard32(lastResult.cards);
    return (
      <div style={{ width: isMobile ? "80px" : "100px" }}>
        {[0, 1, 2, 3].map((_, index) => {
          const playerName = ["PLAYER A", "PLAYER B", "PLAYER C", "PLAYER D"][index];

          // Get card value
          const rawCard = cards?.[index]?.[0];
          if (!rawCard || rawCard === "1") return null;

          return (
            <div key={index} className="text-center" style={{ marginTop: isMobile ? ".1rem" : ".6rem" }}>
              {/* PLAYER NAME */}
              <p
                className="text-white"
                style={{ fontWeight: "900", marginBottom: isMobile ? ".2rem" : ".5rem", fontSize: isMobile ? "1rem" : "1.2rem" }}
              >
                {playerName}
              </p>
              {/* CARD WITH TILT ANIMATION */}
              <div className="d-flex justify-content-center" style={{ background: "none" }}>
                <img
                  className="card-tilt"
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${rawCard}.jpg`}
                  style={{
                    width: isMobile ? "30px" : "40px",
                    height: isMobile ? "40px" : "55px",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const noteNumber = () => {
    return (
      <div className='video-overlay'>
        <div className='videoCards'>
          <div className=''>
            <p className='m-b-0 text-white'>
              <b>
                <span className=''>Total</span>
              </b>
            </p>
            <div className='mr-20'>
              <div className='imgspace d-flex' style={{ flexDirection: 'column', gap: '5px' }}>
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C1B}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2A}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C2B}.jpg`}
                />
                <img
                  alt=''
                  src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${lastResult.C3A}.jpg`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  const theTrap = () => {
    const cards = pushDataToPositionsTheTrap(lastResult.cards);

    const totalA = calculateTotalNumbersFromString(
      cards[0].filter((c: any) => c != 1).join(',')
    );

    const totalB = calculateTotalNumbersFromString(
      cards[1].filter((c: any) => c != 1).join(',')
    );

    // ❗ Hide entire component ONLY if both are zero
    if (totalA === 0 && totalB === 0) return null;

    return (
      <div className='videoCards d-flex' style={{ width: '100px' }}>
        {[1, 2].map((card: any, idx: number) => {
          const playerLabel = idx === 0 ? "A" : "B";

          const validCards = cards[idx].filter((c: any) => c != 1);
          const total = calculateTotalNumbersFromString(validCards.join(','));

          return (
            <div key={idx} className='w-50'>
              <p className='text-white text-center p-2' style={{ lineHeight: '25px' }}>
                <b>
                  <span>{playerLabel}</span>
                  <br />
                  <span className='text-warning'>{total}</span>
                </b>
              </p>

              <div className='d-flex' style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {cards[idx].map((card: any, index: number) => {
                  if (card == 1) return null;
                  return (
                    <img
                      className='w-50 mb-1'
                      key={index}
                      src={`https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${card}.jpg`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };


  return (
    <div>
      {lastResult && (lastResult.match_id || lastResult.id) && (
        <div className='video-overlaybox'>
          {getCurrentMatch.slug == 'queen' ? (
            <>
              <div className='casino-video-title'>
                <span className='casino-name'>{getCurrentMatch.slug}</span>
                <div className='casino-video-rid'>
                  Round ID:
                  <span>{lastResult.match_id}</span>
                </div>
              </div>
              {(getCurrentMatch.slug == 'card32' || getCurrentMatch.slug == 'card32b')
                ? card32VideoOverLay()
                : queenVideoOverLay()}
            </>
          ) : (
            ''
          )}
          {(getCurrentMatch.slug == 'card32' ||
            getCurrentMatch.slug == 'card32b' ||
            getCurrentMatch.slug == 'card32eu') ? (
            <>
              {(getCurrentMatch.slug == 'card32' || getCurrentMatch.slug == 'card32b')
                ? card32VideoOverLay()
                : queenVideoOverLay()}
            </>
          ) : (
            ''
          )}
          {(getCurrentMatch.slug == 'race17' || getCurrentMatch.slug == 'kbc') ? raceTo17() : ''}
          {getCurrentMatch.slug == 'notenum' && noteNumber()}
          {getCurrentMatch.slug == 'race20' ? race2020() : ''}
          {(getCurrentMatch.slug == 'lucky7B' ||
            getCurrentMatch.slug == 'lucky7' ||
            getCurrentMatch.slug == 'lucky7eu2' ||
            getCurrentMatch.slug == 'lucky5' ||
            getCurrentMatch.slug == 'AAA' ||
            getCurrentMatch.slug == 'aaa2' ||
            getCurrentMatch.slug == 'ddb' ||
            getCurrentMatch.slug == 'btable2') &&
            lucky7B()}
          {(getCurrentMatch.slug === 'race2') &&
            race2()}
          {(getCurrentMatch.slug == 'dt20' ||
            getCurrentMatch.slug == 'dt20b' ||
            getCurrentMatch.slug == 'cmeter1' ||
            getCurrentMatch.slug == 'dt6') &&
            dt20()}
          {(getCurrentMatch.slug == 'poison' || getCurrentMatch.slug == 'poison20') && teenpattiPoison()}
          {(getCurrentMatch.slug == 'dolidana') && dolidana()}
          {(getCurrentMatch.slug == 'teen1' || getCurrentMatch.slug == 'teen120') && teenpattiOneDay()}
          {(getCurrentMatch.slug == 'joker20') && teenpattiJoker()}
          {(getCurrentMatch.slug == 'joker1' || getCurrentMatch.slug == 'joker120') && unlimitedJokerone()}
          {(getCurrentMatch.slug == 'onedaypoker' || getCurrentMatch.slug == 'onedaypoker20') && poker()}
          {(getCurrentMatch.slug == 'Tp1Day' || getCurrentMatch.slug == 'teen3' || getCurrentMatch.slug == 'teen41' || getCurrentMatch.slug == 'teen42' || getCurrentMatch.slug == 'teen32' || getCurrentMatch.slug == 'teen33' || getCurrentMatch.slug == 'teen62' || getCurrentMatch.slug == 'teensin') && getCurrentMatch?.match_id > 0 && onedayteen()}
          {((!isMobile && getCurrentMatch.slug == 'dtl20') || getCurrentMatch.slug == 'war') &&
            dtl20()}
          {getCurrentMatch.slug == 'opentp' && opentp()}
          {getCurrentMatch.slug == 'mogambo' && mogambo()}
          {(getCurrentMatch.slug == 'teen20' || getCurrentMatch.slug == 'teen20b' || getCurrentMatch.slug == 'teen20c' || getCurrentMatch.slug == 'teen6') && teen20()}
          {getCurrentMatch.slug == 'teenmuf' && muflisTeenpatti()}
          {getCurrentMatch.slug == 'poker6player' && poker6player()}
          {getCurrentMatch.slug == 'patti2' && cardTeenpatti()}

          {getCurrentMatch.slug == 'testtp' && testtp()}
          {(getCurrentMatch.slug == 'Cards3J' ||
            getCurrentMatch.slug == 'worliinstant' ||
            getCurrentMatch.slug == 'worlimatka' || getCurrentMatch.slug == 'trio') &&
            Cards3J()}
          {getCurrentMatch.slug == 'lottcard' &&
            Lottery()}
          {getCurrentMatch.slug == 'superover' && Superover()}
          {getCurrentMatch.slug == 'fivewicket' && fivecricket()}
          {getCurrentMatch.slug == 'cricket2020' && Cricket2020()}
          {getCurrentMatch.slug == 'warcasino' && warcasino()}
          {(getCurrentMatch.slug == 'Andarbahar' || getCurrentMatch.slug == 'ab20') && andarbahar()}
          {(getCurrentMatch.slug == 'Andarbahar2' || getCurrentMatch.slug == 'abj') && andarbahar2()}
          {getCurrentMatch.slug == 'dum10' && dusKaDum()}
          {getCurrentMatch.slug == 'trap' && theTrap()}

        </div>
      )}
    </div>
  )
}
CasinoTitle.propTypes = {
  lastResult: PropTypes.shape({
    C1: PropTypes.string, // Define the expected type for lastResult.C1
    C2: PropTypes.string,
    C3: PropTypes.string,
    C4: PropTypes.string,
    C5: PropTypes.string,
    C6: PropTypes.string,
    // Add PropTypes for other properties of lastResult if needed
  }).isRequired,
}
export default CasinoTitle