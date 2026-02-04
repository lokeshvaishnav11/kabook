import moment from 'moment'
import ReactPaginate from 'react-paginate'
import IBet from '../../../models/IBet'
import User, { RoleType } from '../../../models/User'
import { selectUserData } from '../../../redux/actions/login/loginSlice'
import { useAppSelector } from '../../../redux/hooks'
import { CONSTANTS } from '../../../utils/constants'
import React from 'react'

interface BetListProps {
  bethistory: any
  page: number
  onTrash?: (e: any, bet: IBet) => void
  handlePageClick: (event: any) => void
  isTrash?: boolean
  handleSelectAll?: () => void
  selectAll?: boolean
  handleSelectItem?: (bet: IBet) => void
  sendInfo:any
}

const getsportsname = (sportsId: any) => {
  return sportsId != ''
    ? CONSTANTS.SPORT_NAME.filter((Item: any) => Item.id == sportsId)[0]?.name || 'Casino'
    : ''
}
const AdminBetListComponent = ({
  sendInfo,
  bethistory,
  onTrash,
  handlePageClick,
  isTrash,
  handleSelectAll,
  selectAll,
  handleSelectItem,
}: BetListProps) => {
  const userState = useAppSelector<{ user: User }>(selectUserData)
  const [filterType, setFilterType] = React.useState<'all' | 'back' | 'lay' | 'deleted'>('all')

  const filteredDocs = React.useMemo(() => {
    if (!bethistory?.docs) return []
  
    switch (filterType) {
      case 'back':
        return bethistory.docs.filter((item: IBet) => item.isBack === true)
  
      case 'lay':
        return bethistory.docs.filter((item: IBet) => item.isBack === false)
  
      case 'deleted':
        return bethistory.docs.filter((item: IBet) => item.status === 'deleted')
  
      default:
        return bethistory.docs
    }
  }, [bethistory, filterType])
  const totalBets = filteredDocs.length
  const totalPL = filteredDocs.reduce((sum: number, item: IBet) => {
    const pl =
      item.status === 'completed'
        ? Number(item.profitLoss || 0)
        : Number(item.pnl || 0)
  
    return sum + pl
  }, 0)
  

  console.log('bethistory',)

  const trrepeat = (Item: IBet, index: number) => {
    const classdata = Item.isBack ? 'back' : 'lay'
    return (
      <tr key={index} className={classdata}>
        {handleSelectAll && (
          <td>
            <input
              type={'checkbox'}
              checked={Item.selected || false}
              onChange={() => handleSelectItem?.(Item)}
            />
          </td>
        )}
        {/* {userState?.user?.role !== RoleType.user && (
          <td className='text-center wnwrap'>{Item.parentNameStr}</td>
        )} */}
        <td className='text-center wnwrap'>{Item.userName}</td>
        {/* <td className='text-center wnwrap'>{Item.matchName}</td> */}
        <td className='text-center wnwrap'>
          {Item.selectionName} /{' '}
          {Item.marketName === 'Fancy' && Item.gtype !== 'fancy1' ? Item.volume : Item.odds}{' '}
        </td>
      
       
        {/* <td className='text-center wnwrap'>{getsportsname(Item.sportId)}</td> */}
        {/* <td className='text-center wnwrap'>{Item.marketName}</td> */}
        <td className='text-center wnwrap'>{Item.odds}</td>
        <td className='text-center wnwrap'>
       
       {Item.marketName === 'Fancy' && Item.gtype !== 'fancy1' ? Item.volume : Item.odds}{' '}
     </td>
        <td className='text-center wnwrap'>{Item.stack}</td>
        <td className='text-center wnwrap'>{Item.status=='completed'?Item?.profitLoss?.toFixed(2):Item.pnl?.toFixed(2)}</td>
        <td className='text-center wnwrap'>
          {Item.createdAt &&
            moment(Item?.createdAt).format(
              'YYYY-MM-DD HH:mm:ss',
            )}
        </td>
        <td className='text-center wnwrap'>{Item.userIp}</td>
        {isTrash && (
          <td className='text-center wnwrap'>
            {Item.status == 'pending' && userState?.user?.role === RoleType.admin && (
              <a onClick={(e) => onTrash && onTrash(e, Item)} href='#'>
                <i className='fa fa-trash' />
              </a>
            )}
          </td>
        )}
      </tr>
    )
  }

  const TransactionData =
   filteredDocs && filteredDocs?.length ? (
    filteredDocs.map((item: IBet, index: number) => {
        return trrepeat(item, index)
      })
    ) : (
      <tr>
        <td colSpan={11} style={{ textAlign: 'center' }}>
          No Result Found
        </td>
      </tr>
    )

  return (
    <>
      <div className='table-responsive'>

       <p className='fs-1'>Details</p>

      {sendInfo?.allBets?.length > 0 && (
  <div className='d-flex mt-3 mb-5 justify-content-between'>
    <div>
      {sendInfo?.remark} - {sendInfo?.allBets[0]?.result?.[0]?.marketName}
    </div>

    <div>
      Game Time:{' '}
      {moment(sendInfo?.allBets[0]?.createdAt).format('YYYY-MM-DD HH:mm:ss')}
    </div>
  </div>
)}

     


      <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  }}
>
  {/* LEFT – FILTERS */}
  <div style={{ display: 'flex', gap: 20 }}>
    {['all', 'back', 'lay', 'deleted'].map((type) => (
      <label key={type} style={{ cursor: 'pointer' }}>
        <input
          type='radio'
          name='betFilter'
          checked={filterType === type}
          onChange={() => setFilterType(type as any)}
        />{' '}
        {type.toUpperCase()}
      </label>
    ))}
  </div>

  {/* RIGHT – TOTALS */}
  <div style={{ fontWeight: 600 }}>
    Total Bets: <span>{totalBets}</span> &nbsp;&nbsp;
    Total Win:{' '}
    <span style={{ color: totalPL >= 0 ? 'green' : 'red' }}>
      {totalPL.toFixed(2)}
    </span>
  </div>
</div>

    
        <table id='customers1'>
          <thead>
            <tr>
              {handleSelectAll && (
                <th className='text-center bg2 text-white '>
                  <input
                    type={'checkbox'}
                    checked={selectAll || false}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {/* {userState?.user?.role !== RoleType.user && (
                <th className='text-center bg2 text-white ' style={{ whiteSpace: 'nowrap' }}>
                  Uplevel
                </th>
              )} */}
              <th className='text-center bg2 text-white ' style={{ whiteSpace: 'nowrap' }}>
                User Name
              </th>
              {/* <th className='text-center bg2 text-white ' style={{ whiteSpace: 'nowrap' }}>
                Event Name
              </th> */}
              <th className='text-center bg2 text-white ' style={{ whiteSpace: 'nowrap' }}>
                Nation
              </th>
              {/* <th className='text-center bg2 text-white ' style={{ whiteSpace: 'nowrap' }}>
                Event Type
              </th> */}
              {/* <th className='text-center bg2 text-white ' style={{ whiteSpace: 'nowrap' }}>
                Type
              </th> */}
              <th className='text-center bg2 text-white ' style={{ whiteSpace: 'nowrap' }}>
                Rate{' '}
              </th>
              <th className='text-center bg2 text-white ' style={{ whiteSpace: 'nowrap' }}>
                Bhav{' '}
              </th>
              <th className='text-center bg2 text-white '>Amount</th>
              <th className='text-center bg2 text-white '>Win</th>
              <th className='text-center bg2 text-white ' style={{ whiteSpace: 'nowrap' }}>
             Date
              </th>
              <th className='text-center bg2 text-white '>IP</th>

              {isTrash && (
                <th className='text-center bg2 text-white ' style={{ whiteSpace: 'nowrap' }}>
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>{TransactionData}</tbody>
        </table>
      </div>
      <ReactPaginate
        breakLabel='...'
        nextLabel='>>'
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={bethistory.totalPages || 0}
        containerClassName={'pagination'}
        activeClassName={'active'}
        previousLabel={'<<'}
        breakClassName={'break-me'}
      />
    </>
  )
}

export default AdminBetListComponent
