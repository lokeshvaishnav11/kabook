import React, { MouseEvent } from 'react'
import { isMobile } from 'react-device-detect'
import { selectCasinoMatchList } from '../../redux/actions/casino/casinoSlice'
import { useAppSelector } from '../../redux/hooks'
import ICasinoMatch from '../../models/ICasinoMatch'
import { useNavigateCustom } from '../_layout/elements/custom-link'
import { toast } from 'react-toastify'
const AviatorList = (props: any) => {

    const gamesList = [
        {
          match_id: 1,
          title: 'Aviator Extreme',
          image: 'https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/500000397.gif',
          slug: 'aviator-extreme',
          isDisable: false,
        },
        {
          match_id: 2,
          title: 'Aviator Pro',
          image: 'https://sitethemedata.com/casino_icons/other/betcore/140511.jpg',
          slug: 'aviator-pro',
          isDisable: false,
        },
        {
          match_id: 3,
          title: 'Aviator Pro',
          image: 'https://sitethemedata.com/casino_icons/other/betcore/154912.jpg',
          slug: 'aviator-pro',
          isDisable: false,
        },
        {
          match_id: 4,
          title: 'Aviator Pro',
          image: 'https://sitethemedata.com/casino_icons/other/betcore/170114.jpg',
          slug: 'aviator-pro',
          isDisable: false,
        },
        {
          match_id: 5,
          title: 'Aviator Pro',
          image: 'https://sitethemedata.com/casino_icons/other/betcore/168613.jpg',
          slug: 'aviator-pro',
          isDisable: false,
        },
        {
          match_id: 6,
          title: 'Aviator Pro',
          image: 'https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/500000674.jpg',
          slug: 'aviator-pro',
          isDisable: false,
        },
        {
          match_id: 7,
          title: 'Aviator Pro',
          image: 'https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/33060327.jpg',
          slug: 'aviator-pro',
          isDisable: false,
        },
        {
          match_id: 8,
          title: 'Aviator Pro',
          image: 'https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/500000203.jpg',
          slug: 'aviator-pro',
          isDisable: false,
        },
        {
          match_id: 9,
          title: 'JetX',
          image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/jetx.jpg',
          slug: 'jetx',
          isDisable: false,
        },
        {
          match_id: 10,
          title: 'JetX 3',
          image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/jetx3.jpg',
          slug: 'jetx-3',
          isDisable: false,
        },
        {
          match_id: 11,
          title: 'Helicopter X',
          image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/helicopterx.jpg',
          slug: 'helicopter-x',
          isDisable: false,
        },
        {
          match_id: 12,
          title: 'Aviator Pro',
          image: 'https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/141422.jpg',
          slug: 'aviator-pro',
          isDisable: false,
        },
        {
          match_id: 13,
          title: 'Aviator SRT',
          image: 'https://sitethemedata.com/casino_icons/other/darwin/darwin/AVIATSR.jpg',
          slug: 'aviator-srt',
          isDisable: false,
        },
        {
          match_id: 14,
          title: 'Crash AE',
          image: 'https://sitethemedata.com/casino_icons/other/darwin/darwin/CRAE.jpg',
          slug: 'crash-ae',
          isDisable: false,
        },
        {
          match_id: 15,
          title: 'Crash AE SP',
          image: 'https://sitethemedata.com/casino_icons/other/darwin/darwin/CRAESP.jpg',
          slug: 'crash-ae-sp',
          isDisable: false,
        },
        {
          match_id: 16,
          title: 'Multiplayer Aviator',
          image: 'https://sitethemedata.com/casino_icons/other/gemini1/gemini/MultiPlayerAviator.jpg',
          slug: 'multiplayer-aviator',
          isDisable: false,
        },
        {
          match_id: 17,
          title: 'Jili 261',
          image: 'https://sitethemedata.com/casino_icons/slot/Jili/261.jpg',
          slug: 'jili-261',
          isDisable: false,
        },
        {
          match_id: 18,
          title: 'Jili 224',
          image: 'https://sitethemedata.com/casino_icons/slot/Jili/224.jpg',
          slug: 'jili-224',
          isDisable: false,
        },
        {
          match_id: 19,
          title: 'Jili 235',
          image: 'https://sitethemedata.com/casino_icons/slot/Jili/235.jpg',
          slug: 'jili-235',
          isDisable: false,
        },
        {
          match_id: 20,
          title: 'Crash X',
          image: 'https://sitethemedata.com/casino_icons/slot/TurboGames/TRB-crashx.jpg',
          slug: 'crash-x',
          isDisable: false,
        },
        {
          match_id: 21,
          title: 'Aero',
          image: 'https://sitethemedata.com/casino_icons/slot/TurboGames/TRB-aero.jpg',
          slug: 'aero',
          isDisable: false,
        },
        {
          match_id: 22,
          title: 'Aviator',
          image: 'https://sitethemedata.com/casino_icons/other/ssg/aviator/aviator.jpg',
          slug: 'aviator',
          isDisable: false,
        },
      ];
      

    const onCasinoClick = (e: MouseEvent<HTMLAnchorElement>, Item: ICasinoMatch) => {
    e.preventDefault()
    toast.warn('This game is suspended by admin, please try again later')
    }
 
  return (
    <div className='home-page '>
    <div className='casino-list mt-2 mt-lg-0'>
      {gamesList &&
        gamesList
          ?.filter((item: any) => !item.isDisable && item.match_id !== -1)
          ?.map((Item: any, key: number) => {
            return (
              <div className={"aviator-list-item"} key={key}>
                <a href='#' onClick={(e) => onCasinoClick(e, Item)} className=''>
                  <div
                    className="casino-list-item-banner"
                    style={{
                      backgroundImage: `url(${Item.image})`,
                      backgroundSize: "contain",
    backgroundColor: "rgb(0, 0, 0)",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    paddingTop:" 54%"
                    }}
                  >
                  </div>
                 {/* / <div className='casino-list-name'>{Item.title}</div> */}

                </a>
              </div>
            )
          })}
    </div>
    </div>
  )
}
export default React.memo(AviatorList)
