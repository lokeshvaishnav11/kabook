// import moment from 'moment'
// import React, { MouseEvent } from 'react'
// import ReactPaginate from 'react-paginate'
// import { toast } from 'react-toastify'
// import accountService from '../../../services/account.service'
// import { dateFormat } from '../../../utils/helper'
// import { isMobile } from 'react-device-detect'
// import mobileSubheader from '../_layout/elements/mobile-subheader'
// import userService from '../../../services/user.service'
// import CustomAutoComplete from '../../components/CustomAutoComplete'
// import { AccoutStatement } from '../../../models/AccountStatement'
// import betService from '../../../services/bet.service'
// import { AxiosResponse } from 'axios'
// import ReactModal from 'react-modal'
// import BetListComponent from '../UnsetteleBetHistory/bet-list.component'
// import { useAppSelector } from '../../../redux/hooks'
// import { selectLoader } from '../../../redux/actions/common/commonSlice'
// import LoginReport from '../settings/LoginReport'

// // import "./CommissionTable.css";

// const AccountStatementAdmin = () => {
//   const loadingState = useAppSelector(selectLoader)

//   const [accountStmt, setAccountStmt] = React.useState<any>({})
//   const [parseAccountStmt, setparseAccountStmt] = React.useState<any>([])
//   const [closeBalance, setCloseBalance] = React.useState(0)
//   const [currentItems, setCurrentItems] = React.useState<any>([])
//   const [itemOffset, setItemOffset] = React.useState<any>(0)
//   const [itemsPerPage] = React.useState<any>(50)
//   const [pageCount, setPageCount] = React.useState<any>(0)

//   const [isOpen, setIsOpen] = React.useState(false)
//   const [betHistory, setBetHistory] = React.useState<any>({})
//   const [selectedStmt, setSelectedStmt] = React.useState<AccoutStatement>({} as AccoutStatement)
//   const [openBalance, setOpenBalance] = React.useState(0)

//   const [filterdata, setfilterdata] = React.useState<any>({
//     startDate: '',
//     endDate: '',
//     reportType: 'All',
//     userId: '',
//   })
//   const [page, setPage] = React.useState(1)
//   const [pageBet, setPageBet] = React.useState(1)

//   React.useEffect(() => {
//     const endOffset = itemOffset + itemsPerPage
//     setCurrentItems(parseAccountStmt.slice(itemOffset, endOffset))
//     setPageCount(Math.ceil(parseAccountStmt.length / itemsPerPage))
//   }, [itemOffset, itemsPerPage, parseAccountStmt])

//   const handlePageClick = (event: any) => {
//     const newOffset = (event.selected * itemsPerPage) % parseAccountStmt.length
//     setItemOffset(newOffset)
//     setPage(event.selected)
//   }

//   const dataformat = (response: any, closingbalance: any) => {
//     const aryNewFormat: any = []

//     response &&
//       response.map((stmt: any, index: number) => {
//         closingbalance = closingbalance + stmt.amount
//         aryNewFormat.push({
//           _id: stmt._id,
//           // eslint-disable-next-line camelcase
//           sr_no: index + 1,
//           date: moment(stmt.createdAt).format(dateFormat),
//           credit: stmt.amount,
//           debit: stmt.amount,
//           closing: closingbalance.toFixed(2),
//           narration: stmt.narration,
//           type: stmt.type,
//           stmt: stmt,
//         })
//       })
//     return aryNewFormat
//   }

//   React.useEffect(() => {
//     const filterObj = filterdata
//     filterObj.startDate = moment().subtract(7, 'days').format('YYYY-MM-DD')
//     filterObj.endDate = moment().format('YYYY-MM-DD')
//     setfilterdata(filterObj)
//   }, [])

//   const getAccountStmt = (page: number) => {
//     accountService
//       .getAccountList(page, filterdata)
//       .then((res) => {
//         if (res?.data?.data) setAccountStmt(res?.data?.data?.items || [])
//         if (res?.data?.data?.items && page == 0)
//           setOpenBalance(res?.data?.data?.openingBalance || 0)
//         setparseAccountStmt(
//           dataformat(res?.data?.data?.items || [], res?.data?.data?.openingBalance || 0),
//         )
//         setPage(page)
//       })
//       .catch((e) => {
//         console.log(e)
//         // const error = e.response.data.message
//         toast.error('error')
//       })
//   }

//   const handleformchange = (event: any) => {
//     const filterObj = filterdata
//     filterObj[event.target.name] = event.target.value
//     setfilterdata(filterObj)
//   }
//   const handleSubmitform = (event: any) => {
//     event.preventDefault()
//     getAccountStmt(1)
//   }

//   const onSuggestionsFetchRequested = ({ value }: any) => {
//     return userService.getUserListSuggestion({ username: value })
//   }

//   const onSelectUser = (user: any) => {
//     setfilterdata({ ...filterdata, userId: user._id })
//   }

//   const handlePageClickBets = (event: any) => {
//     getBetsData(selectedStmt, event.selected + 1)
//   }

//   React.useEffect(() => {
//     if (isOpen) getBetsData(selectedStmt, pageBet)
//   }, [selectedStmt, pageBet, isOpen])

//   const getBetsData = (stmt: AccoutStatement, pageNumber: number) => {
//     const betIds: any = stmt?.allBets?.map(({ betId }: any) => betId)

//     if (betIds && betIds.length > 0) {
//       betService.getBetListByIds(betIds, pageNumber).then((res: AxiosResponse) => {
//         setIsOpen(true)
//         setBetHistory(res.data.data)
//         setPageBet(pageNumber)
//       })
//     }
//   }

//   const getBets = (e: MouseEvent<HTMLTableCellElement>, stmt: AccoutStatement) => {
//     e.preventDefault()
//     setBetHistory({})
//     setSelectedStmt(stmt)
//     setPageBet(1)
//     setIsOpen(true)
//   }

//   const getAcHtml = () => {
//     let closingbalance: number = page == 1 ? openBalance : closeBalance
//     const achtml =
//       currentItems &&
//       currentItems.map((stmt: any, index: number) => {
//         closingbalance = closingbalance + stmt.amount
//         return (
//           <tr key={`${stmt._id}${index}`}>
//             <td>{stmt.sr_no}</td>
//             <td className='wnwrap'>{stmt.date}</td>
//             <td className='green wnwrap'>{stmt.credit >= 0 && stmt.credit.toFixed(2)}</td>
//             <td className='red wnwrap'>{stmt.credit < 0 && stmt.credit.toFixed(2)}</td>
//             <td className='green wnwrap'>{stmt.closing}</td>
//             <td>{stmt.stmt.txnBy}</td>
//             <td

//               onClick={(e: MouseEvent<HTMLTableCellElement>) => getBets(e, stmt.stmt)}
//             >
//               <span className={stmt.type == 'pnl' ? 'label-button' : ''}>{stmt.narration}</span>
//             </td>
//           </tr>
//         )
//       })
//     return achtml
//   }

//   return (
//     <>
//       {mobileSubheader.subheaderdesktopadmin('Account Statements')}
//       <div className='container-fluid'>
//         <div className='row'>
//           <div className={!isMobile ? 'col-md-12 mt-1' : 'col-md-12 padding-custom'}>
//             <div className='card-body p15 bg-gray mb-20'>
//               <form
//                 className='ng-pristine ng-valid ng-touched mb-0'
//                 method='post'
//                 onSubmit={handleSubmitform}
//               >
//                 <div className='row row5'>
//                   <div className='col-6 col-lg-2 mbc-5'>
//                     <label className='label'>User</label>
//                     <CustomAutoComplete
//                       onSuggestionsFetchRequested={onSuggestionsFetchRequested}
//                       onSelectUser={onSelectUser}
//                     />
//                   </div>
//                   <div className='col-6 col-lg-2 mbc-5'>
//                     <div className='form-group mb-0'>
//                       <label className='label'>Start Date</label>
//                       <div className='mx-datepicker'>
//                         <div className='mx-input-wrapper'>
//                           <input
//                             name='startDate'
//                             type='date'
//                             autoComplete='off'
//                             onChange={handleformchange}
//                             defaultValue={filterdata.startDate}
//                             placeholder='Select Date'
//                             className='mx-input ng-pristine ng-valid ng-touched'
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className='col-6 col-lg-2 mbc-5'>
//                     <div className='form-group mb-0'>
//                       <label className='label'>End Date</label>
//                       <div className='mx-datepicker'>
//                         <div className='mx-input-wrapper'>
//                           <input
//                             name='endDate'
//                             type='date'
//                             autoComplete='off'
//                             defaultValue={filterdata.endDate}
//                             onChange={handleformchange}
//                             placeholder='Select Date'
//                             className='mx-input ng-untouched ng-pristine ng-valid'
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className='col-12 col-lg-2 mbc-5'>
//                     <div className='form-group mb-0'>
//                       <label className='label'>Type</label>
//                       <select
//                         name='reportType'
//                         onChange={handleformchange}
//                         className='custom-select ng-untouched ng-pristine ng-valid'
//                       >
//                         <option value='ALL'>All </option>
//                         <option value='chip'>Deposit/Withdraw </option>
//                         <option value='sgame'>Sport Report</option>

//                         <option value='cgame'>Casino Report </option>
//                       </select>
//                     </div>
//                   </div>
//                   <div className='col-12 col-lg-1 mbc-5'>
//                     <label className='label'>&nbsp;</label>
//                     <button type='submit' className='btn btn-primary btn-block'>
//                       Submit
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//             <div className='card-body'>
//               <div className='table-responsive'>
//                 <table className='text-center' id='customers1'>
//                   <thead>
//                     <tr>
//                       <th style={{ width: '10%', textAlign: 'center', whiteSpace: 'nowrap' }}>
//                         Sr No.
//                       </th>
//                       <th style={{ width: '20%', textAlign: 'center', whiteSpace: 'nowrap' }}>
//                         Date{' '}
//                       </th>
//                       <th style={{ width: '10%', textAlign: 'center' }}>Credit </th>
//                       <th style={{ width: '10%', textAlign: 'center' }}>Debit</th>
//                       <th style={{ width: '10%', textAlign: 'center' }}>Balance</th>
//                       <th style={{ width: '10%', textAlign: 'center' }}>From</th>
//                       <th style={{ width: '45%', textAlign: 'center' }}>Remark</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {parseAccountStmt.length <= 0 ||
//                       (parseAccountStmt.length > 0 && parseAccountStmt.length <= 0 && (
//                         <tr>
//                           <td colSpan={8} className='text-center'>
//                             No Result Found
//                           </td>
//                         </tr>
//                       ))}
//                     {parseAccountStmt.length > 0 && parseAccountStmt.length > 0 && page == 0 && (
//                       <tr key={parseAccountStmt[0]._id}>
//                         <td>-</td>
//                         <td className='wnwrap'>
//                           {moment(parseAccountStmt[0].createdAt).format(dateFormat)}
//                         </td>
//                         <td>-</td>
//                         <td>-</td>
//                         <td className='wnwrap'>{openBalance}</td>
//                         <td className='wnwrap'>Opening Balance</td>
//                       </tr>
//                     )}

//                     {getAcHtml()}
//                   </tbody>
//                 </table>
//               </div>
//               <ReactPaginate
//                 breakLabel='...'
//                 nextLabel='>>'
//                 onPageChange={handlePageClick}
//                 pageRangeDisplayed={5}
//                 pageCount={pageCount}
//                 containerClassName={'pagination'}
//                 activeClassName={'active'}
//                 previousLabel={'<<'}
//                 breakClassName={'break-me'}
//               />
//             </div>





//           </div>
//         </div>
//       </div>
//       <ReactModal
//         isOpen={isOpen}
//         onAfterClose={() => setIsOpen(false)}
//         onRequestClose={(e: any) => {
//           setIsOpen(false)
//         }}
//         contentLabel='Set Max Bet Limit'
//         className={'col-md-12'}
//         ariaHideApp={false}
//       >
//         <div className='modal-content'>
//           <div className='modal-header'>
//             <h5>Bets</h5>
//             <button onClick={() => setIsOpen(false)} className='close float-right'>
//               <i className='fa fa-times-circle'></i>
//             </button>
//           </div>
//           <div className='modal-body'>
//             {!loadingState && (
//               <BetListComponent
//                 bethistory={betHistory}
//                 handlePageClick={handlePageClickBets}
//                 page={page}
//                 isTrash={false}
//               />
//             )}
//           </div>
//         </div>
//       </ReactModal>
//     </>
//   )
// }
// export default AccountStatementAdmin


import moment from 'moment'
import React, { MouseEvent } from 'react'
import ReactPaginate from 'react-paginate'
import { toast } from 'react-toastify'
import accountService from '../../../services/account.service'
import { dateFormat } from '../../../utils/helper'
import { isMobile } from 'react-device-detect'
import mobileSubheader from '../_layout/elements/mobile-subheader'
import userService from '../../../services/user.service'
import CustomAutoComplete from '../../components/CustomAutoComplete'
import { AccoutStatement } from '../../../models/AccountStatement'
import betService from '../../../services/bet.service'
import { AxiosResponse } from 'axios'
import ReactModal from 'react-modal'
import BetListComponent from '../UnsetteleBetHistory/bet-list.component'
import { useAppSelector } from '../../../redux/hooks'
import { selectLoader } from '../../../redux/actions/common/commonSlice'
import sportsService from '../../../services/sports.service'
import casinoService from '../../../services/casino.service'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import AdminBetListComponent from '../UnsetteleBetHistory/admin-bet-list-component'


const AccountStatementAdmin = () => {
  const loadingState = useAppSelector(selectLoader)

  const [accountStmt, setAccountStmt] = React.useState<any>({})
  const [parseAccountStmt, setparseAccountStmt] = React.useState<any[]>([])
  const [closeBalance, setCloseBalance] = React.useState(0)
  const [currentItems, setCurrentItems] = React.useState<any[]>([])
  const [itemOffset, setItemOffset] = React.useState(0)
  const [itemsPerPage] = React.useState(500)
  const [pageCount, setPageCount] = React.useState(0)

  const [isOpen, setIsOpen] = React.useState(false)
  const [betHistory, setBetHistory] = React.useState<any>({})
  const [selectedStmt, setSelectedStmt] =
    React.useState<AccoutStatement>({} as AccoutStatement)

  const [openBalance, setOpenBalance] = React.useState(0)

  const [operations, setOperations] = React.useState<any[]>([])
  const [mergedList, setMergedList] = React.useState<any[]>([])


  const [filterdata, setfilterdata] = React.useState<any>({
    startDate: '',
    endDate: '',
    reportType: 'ALL',
    userId: '',
    gameId: '',
    username: ''
  })

  console.log(filterdata, "")

  const [page, setPage] = React.useState(1)
  const [pageBet, setPageBet] = React.useState(1)

  /** 🔥 NEW STATES */
  const [sportsList, setSportsList] = React.useState<any[]>([])
  const [casinoList, setCasinoList] = React.useState<any[]>([])

  /* Pagination */
  React.useEffect(() => {
    const endOffset = itemOffset + itemsPerPage
    setCurrentItems(parseAccountStmt.slice(itemOffset, endOffset))
    setPageCount(Math.ceil(parseAccountStmt.length / itemsPerPage))
  }, [itemOffset, itemsPerPage, parseAccountStmt])

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % parseAccountStmt.length
    setItemOffset(newOffset)
    setPage(event.selected)
  }

  /* Default Date */
  React.useEffect(() => {
    setfilterdata((prev: any) => ({
      ...prev,
      startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
    }))
  }, [])

  /* 🔥 Fetch Sports / Casino */
  React.useEffect(() => {
    if (filterdata.reportType === 'sgame') {
      sportsService.getSports().then((res: any) => {
        setSportsList(res?.data?.data || [])
      })
    }

    if (filterdata.reportType === 'cgame') {
      casinoService.getCasinoList().then((res: any) => {
        setCasinoList(res?.data?.data || [])
      })
    }
  }, [filterdata.reportType])

  /* Format Data */
  const dataformat = (response: any[], openingBalance: number) => {
    let closingbalance = openingBalance
    return response.map((stmt: any, index: number) => {
      closingbalance = closingbalance + stmt.amount
      return {
        _id: stmt._id,
        sr_no: index + 1,
        date: moment(stmt.createdAt).format(dateFormat),
        credit: stmt.amount >= 0 ? stmt.amount : '',
        debit: stmt.amount < 0 ? stmt.amount : '',
        closing: closingbalance.toFixed(2),
        narration: stmt.narration,
        type: stmt.type,
        stmt: stmt,
        amount: stmt.amount,
      }
    })
  }

  const downloadPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4')

    doc.setFontSize(14)
    doc.text('Account Statement', 14, 15)

    doc.setFontSize(10)
    doc.text(
      `User: ${filterdata.username || 'All'} | From: ${filterdata.startDate} To: ${filterdata.endDate}`,
      14,
      22
    )

    const tableColumn = [
      'Date',
      'Credit',
      'Debit',
      'Balance / Operation',
      'From / Done By',
      'Remark',
    ]

    const tableRows: any[] = []

    mergedList.forEach((item: any) => {
      tableRows.push([
        item.row.date,
        item.row.credit || '',
        item.row.debit || '',
        item.row.balance || '',
        item.row.from || '',
        item.row.remark || '',
      ])
    })

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
    })

    doc.save(`Account_Statement_${filterdata.username || 'all'}.pdf`)
  }


  /* Form Handlers */
  const handleformchange = (event: any) => {
    const { name, value } = event.target
    setfilterdata((prev: any) => ({
      ...prev,
      [name]: value,
      ...(name === 'reportType' ? { gameId: '' } : {}),
    }))
  }

  const handleGameChange = (e: any) => {
    setfilterdata((prev: any) => ({
      ...prev,
      gameId: e.target.value,
    }))
  }

  const mergeAccountAndOperation = (accounts: any[], operations: any[]) => {
    const accMapped = accounts.map((a) => ({
      type: 'ACCOUNT',
      date: new Date(a.stmt.createdAt),
      row: {
        date: a.date,
        credit: a.amount > 0 ? a.amount : '',
        debit: a.amount < 0 ? Math.abs(a.amount) : '',
        balance: a.closing,
        from: a.stmt.txnBy,
        remark: a.narration,
        allBets: a.stmt.allBets || [],
      },
    }))

    const opMapped = operations.map((o) => ({
      type: 'OPERATION',
      date: new Date(o.date),
      row: {
        date: moment(o.date).format(dateFormat),
        credit: "--",
        debit: "--",
        balance: o.operation,
        from: o.doneBy,
        remark: o.description,
      },
    }))

    return [...accMapped, ...opMapped]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
  }



  /* API */
  const getAccountStmt = async (page: number) => {
    try {
      const res = await accountService.getAccountList(page, filterdata)

      const items = res?.data?.data?.items || []
      const openingBalance = res?.data?.data?.openingBalance || 0

      setOpenBalance(openingBalance)

      const formattedAccount = dataformat(items, openingBalance)

      // 🔥 Operation API call (username required)
      let operationData: any[] = []
      if (filterdata?.username) {
        const username = filterdata?.username

        const opRes = await betService.postsettelement2({ username })
        operationData = opRes?.data?.data?.operations || []
      }

      const merged = mergeAccountAndOperation(formattedAccount, operationData)

      setMergedList(merged)
      setparseAccountStmt(merged)
      setPage(page)

    } catch (err) {
      toast.error('Error loading data')
    }
  }




  const handleSubmitform = (event: any) => {
    event.preventDefault()
    getAccountStmt(1)
  }

  const onSuggestionsFetchRequested = ({ value }: any) => {
    return userService.getUserListSuggestion({ username: value })
  }

  const onSelectUser = (user: any) => {
    setfilterdata((prev: any) => ({ ...prev, userId: user._id, username: user.username }))
  }


  React.useEffect(() => {
    if (isOpen) getBetsData(selectedStmt, pageBet)
  }, [selectedStmt, pageBet, isOpen])


  /* Bets */
  const getBetsData = (stmt: AccoutStatement, pageNumber: number) => {
    console.log(stmt, "stmt222")
    const betIds: any = stmt?.allBets?.map(({ betId }: any) => betId)
    if (betIds?.length) {
      betService.getBetListByIds(betIds, pageNumber).then((res: AxiosResponse) => {
        setIsOpen(true)
        setBetHistory(res.data.data)
        setPageBet(pageNumber)
      })
    }
  }

      

  const getBets = (e: MouseEvent<HTMLTableCellElement>, stmt: AccoutStatement) => {
    console.log(stmt, "stmt")

    e.preventDefault()
    setSelectedStmt(stmt)
    setPageBet(1)
    setIsOpen(true)
  }

  /* Table HTML */
  const getAcHtmlold = () => {
    let closingbalance: number = page === 1 ? openBalance : closeBalance
    return (
      currentItems &&
      currentItems.map((stmt: any, index: number) => {
        closingbalance = closingbalance + stmt.amount
        return (
          <tr key={`${stmt._id}${index}`}>
            <td>{stmt.sr_no}</td>
            <td className='wnwrap'>{stmt.date}</td>
            <td className='green wnwrap'>{stmt.credit}</td>
            <td className='red wnwrap'>{stmt.debit}</td>
            <td className='green wnwrap'>{stmt.closing}</td>
            <td>{stmt?.stmt?.txnBy}</td>
            <td onClick={(e) => getBets(e, stmt.stmt)}>
              <span className={stmt.type === 'pnl' ? 'label-button' : ''}>
                {stmt.narration}
              </span>
            </td>
          </tr>
        )
      })
    )
  }

  const getAcHtml = () => {
    return (
      currentItems &&
      currentItems.map((item: any, index: number) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td className="wnwrap">{item?.row?.date}</td>
          <td className="green wnwrap">{item?.row?.credit}</td>
          <td className="red wnwrap">{item?.row?.debit}</td>
          <td className="green wnwrap">{item?.row?.balance}</td>
          <td>{item?.row?.from}</td>
          {/* <td>{item?.row?.remark}</td> */}
          <td onClick={(e) => getBets(e, item.row)}>
              <span className={item?.row?.type === 'pnl' ? 'label-button' : ''}>
                {item?.row?.remark}
              </span>
            </td>
        </tr>
      ))
    )
  }


  return (
    <>
      {mobileSubheader.subheaderdesktopadmin('Account Statements')}
      <div className='container-fluid'>
        <div className='row'>
          <div className={!isMobile ? 'col-md-12 mt-1' : 'col-md-12 padding-custom'}>
            <div className='card-body p15 bg-gray mb-20'>
              <form onSubmit={handleSubmitform}>
                <div className='row row5'>
                  <div className='col-6 col-lg-2 mbc-5'>
                    <label className='label'>User</label>
                    <CustomAutoComplete
                      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                      onSelectUser={onSelectUser}
                    />
                  </div>

                  <div className='col-6 col-lg-2 mbc-5'>
                    <label className='label'>Start Date</label>
                    <input type='date' name='startDate' onChange={handleformchange} />
                  </div>

                  <div className='col-6 col-lg-2 mbc-5'>
                    <label className='label'>End Date</label>
                    <input type='date' name='endDate' onChange={handleformchange} />
                  </div>

                  <div className='col-12 col-lg-2 mbc-5'>
                    <label className='label'>Type</label>
                    <select
                      name='reportType'
                      onChange={handleformchange}
                      className='custom-select'
                    >
                      <option value='ALL'>All</option>
                      <option value='chip'>Deposit / Withdraw</option>
                      <option value='sgame'>Sport Report</option>
                      <option value='cgame'>Casino Report</option>
                    </select>
                  </div>

                  {/* SPORT */}
                  {filterdata.reportType === 'sgame' && (
                    <div className='col-12 col-lg-2 mbc-5'>
                      <label className='label'>Sport</label>
                      <select className='custom-select' onChange={handleGameChange}>
                        <option value=''>Select Sport</option>
                        {sportsList.map((s: any) => (
                          <option key={s._id} value={s.sportId}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* CASINO */}
                  {filterdata.reportType === 'cgame' && (
                    <div className='col-12 col-lg-2 mbc-5'>
                      <label className='label'>Casino Game</label>
                      <select className='custom-select' onChange={handleGameChange}>
                        <option value=''>Select Game</option>
                        {casinoList.map((g: any) => (
                          <option key={g._id} value={g.match_id}>
                            {g.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className='col-12 col-lg-1 mbc-5'>
                    <label className='label'>&nbsp;</label>
                    <button type='submit' className='btn btn-primary btn-block'>
                      Submit
                    </button>
                  </div>
                </div>
              </form>
               <div className='col-12 col-lg-2 mbc-5'>
              <label className='label'>&nbsp;</label>
              <button
                type='button'
                className='btn btn-success btn-block'
                onClick={downloadPDF}
              >
                Download PDF
              </button>
            </div>
            </div>

           


            <div className='card-body'>
              <div className='table-responsive'>
                <table className='text-center' id='customers1'>
                  <thead>
                    <tr>
                      <th>Sr No.</th>
                      <th>Date</th>
                      <th>Credit</th>
                      <th>Debit</th>
                      <th>Balance/Operation</th>
                      <th>From/Done By</th>
                      <th>Remark</th>
                    </tr>
                  </thead>
                  <tbody>{getAcHtml()}</tbody>
                </table>
              </div>

              <ReactPaginate
                breakLabel='...'
                nextLabel='>>'
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                containerClassName={'pagination'}
                activeClassName={'active'}
                previousLabel={'<<'}
              />
            </div>
          </div>
        </div>
      </div>

      <ReactModal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} ariaHideApp={false}>
        <AdminBetListComponent
          bethistory={betHistory}
          handlePageClick={(e: any) => getBetsData(selectedStmt, e.selected + 1)}
          page={pageBet}
          isTrash={false}
          sendInfo={selectedStmt}
        />
      </ReactModal>
    </>
  )
}

export default AccountStatementAdmin
