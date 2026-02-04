/* eslint-disable */
import React, { Component, useState } from 'react'
import { Modal, Card } from 'react-bootstrap'
import casinoService from '../../services/casino.service'
import { useParams } from 'react-router-dom'
const CasinoResultDetail = (props: any) => {
  const { popupdata, setPopStatus, popupstatus } = props
  const [casinoResult, setCasinoResult] = useState<any>({})
  const [loader, setLoader] = useState<boolean>(false)
  const [data,setData] = useState<any>();
 const { gameCode } = useParams<{ gameCode: string }>();

  React.useEffect(() => {
    setCasinoResult({})
    setLoader(true)
    if (popupdata.slug && popupdata.slug) {
      console.log(gameCode , popupdata.mid,'popup data')
      casinoService.getResultByMid(gameCode!, popupdata.mid).then((res) => {
        setLoader(false)
        setCasinoResult(res?.data?.data?.html)
       const cards = res.data.data.html.card?.split(",") || [];
const winner = res.data.data.html.winnat || "";

let htmlContent = "";

// Loop through each card and create image tags
for (const card of cards) {
  // sanitize card to avoid injection (very important)
  const safeCard = card.replace(/[^a-zA-Z0-9_-]/g, ""); 
  htmlContent += `<img 
    src="https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${safeCard}.png" 
    alt="${safeCard}" 
    style="width:35px;margin:4px;"
  />`;
}

// Add winner text
htmlContent += `<div style="margin-top:8px;font-weight:bold;">Winner: ${winner}</div>`;

// Set the HTML (preferably after sanitizing)
setData(htmlContent);

        if (popupdata.slug === 'Andarbahar' || popupdata.slug === 'Andarbahar2') {
          // @ts-ignore
          globalThis.$('.owl-carousel').owlCarousel({
            rtl: true,
            loop: true,
            margin: 10,
            dots: false,
            responsiveClass: true,
            responsive: {
              0: {
                items: popupdata.slug === 'Andarbahar2' ? 3 : 8,
                nav: true,
              },
              1000: {
                items: 10,
                nav: true,
                loop: false,
              },
            },
          })
        }
      })
    }
  }, [props.popupdata])
  return (
    <Modal
      show={popupstatus}
      onHide={() => setPopStatus(false)}
      size='lg'
      className='casino-result-modal'
    >
      <Modal.Header className='text-white bg'>
        <div className='bg w-100 d-flex flex-row justify-content-between'>
          <h4 className='text-white mb-0' style={{ width: '100%' }}>
            {' '}
            {popupdata?.event_data?.title || ''}
            <span style={{ float: 'right' }}>
              <i
                className='fa fa-times text-white'
                aria-hidden='true'
                onClick={() => setPopStatus(false)}
                style={{ cursor: 'pointer', fontSize: '24px' }}
              />
            </span>
          </h4>
        </div>
      </Modal.Header>

      <Modal.Body>
        {/* <h6 className="text-right round-id">Round Id:  {popupdata?.mid || ''}</h6> */}
        {loader ? (
          <div className='text-center'>
            <i className='mx-5 fas fa-spinner fa-spin'></i>
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: data || '' }}
            className={popupdata.slug}
          />
        )}
      </Modal.Body>
    </Modal>
  )
}

export default React.memo(CasinoResultDetail)
