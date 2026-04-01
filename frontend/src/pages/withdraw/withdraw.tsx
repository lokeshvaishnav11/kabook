import './withdraw.css'
import useDeposit from '../../_hooks/useDeposit'
import AddAccountModalPari from './AddBankModalPari'
import AddUpiModalPari from './AddUpiModalPari'
import useWithdraw from '../../_hooks/useWithdraw'
import WithdrawStatement2 from '../withdrawstatement/withdrawstatement2'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUserData } from '../../redux/actions/login/loginSlice'
import { useNavigate } from 'react-router-dom'

const Withdraw = () => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    setValue,
    bankUpiLists,
    handleDelete,
    getBankAndUpiList,
  } = useWithdraw()
  
  const userData = useSelector(selectUserData)
  const navigate = useNavigate()
  const [showFirstRePopup, setShowFirstRePopup] = useState(false)
  const [showEkycPopup, setShowEkycPopup] = useState(false)

  useEffect(() => {
    // Check if firstre is "no", then show popup
    if (userData?.user?.firstre === 'yes') {
      setShowFirstRePopup(true)
    }
    // Check if ekyc is "yes", then show recharge popup
    else if (userData?.user?.ekyc === 'yes' && userData?.user?.firstre === 'completed') {
      setShowEkycPopup(true)
    }
  }, [userData])

  const handleRechargeRedirect = () => {
    setShowFirstRePopup(false)
    // Redirect to deposit page with 1499 amount as query param
    navigate('/deposit?amount=1499')
  }

  const handleEkycRechargeRedirect = () => {
    setShowEkycPopup(false)
    // Redirect to deposit page with 699 amount as query param
    navigate('/deposit?amount=699')
  }

  return (
    <div className='mt-10'>
      {/* First Recharge Popup Modal */}
      {showFirstRePopup && (
        <div className='modal fade show d-block' tabIndex={-1} role='dialog' style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className='modal-dialog modal-dialog-centered' role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Recharge Required</h5>
              </div>
              <div className='modal-body'>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>
                  Withdrawal karne ke liye 1499 ka rupees ka recharge karo
                </p>
              </div>
              <div className='modal-footer'>
                <button 
                  type='button' 
                  className='btn btn-primary'
                  onClick={handleRechargeRedirect}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ekyc Recharge Popup Modal */}
      {showEkycPopup && (
        <div className='modal fade show d-block' tabIndex={-1} role='dialog' style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className='modal-dialog modal-dialog-centered' role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Withdrawal Complete</h5>
              </div>
              <div className='modal-body'>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>
                  Aapka withdrawal complete ho usse account me lene ke liye 699 ka recharge karo
                </p>
              </div>
              <div className='modal-footer'>
                <button 
                  type='button' 
                  className='btn btn-primary'
                  onClick={handleEkycRechargeRedirect}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <form className='deposit-page deposit withdraw-request' onSubmit={handleSubmit(onSubmit)}>
        <div className='card mb-10'>
          <div className='card-header'>
            <h4 className='mb-0'>Withdrawal</h4>
          </div>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-lg-4'>
                <div className='form-group pr mb-4'>
                  <label>&nbsp;</label>
                  <input
                    type='text'
                    placeholder='Enter Amount'
                    className='form-control'
                    {...register('amount')}
                    style={{height:"45px"}}
                  />
                  {errors?.amount && <p className='error-message'>{errors.amount.message}</p>}
                </div>
              </div>
              <div className='col-lg-4'>
                <div className='form-group pr mb-4'>
                  <label className='d-md-block d-none'>&nbsp;</label>
                  <button className='btn bg-danger text-white' style={{height:"45px"}} type='submit'>
                    <span>Submit</span>
                  </button>
                </div>
              </div>
              <div className='col-lg-12'>
                {errors?.bankDetail && <p className='error'>{errors.bankDetail.message}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className='card mb-10'>
          <div className='add-new-detail'>
            <div className='payment-icons-title'>
              <div>
                <h3>Bank Transfer</h3>
              </div>
              <div className='btn btn-primary wd-100p' data-toggle='modal' data-target='#accountModal'>
                Add New
              </div>
            </div>
            <hr className='mt-0' />
            <div className='account-detail mb-10'>
              <div className='container-fluid'>
                <div className='row'>
                  {bankUpiLists &&
                    bankUpiLists?.bank?.map((bank: any) => (
                      <div className='col-lg-3' key={bank?._id}>
                        <div className='bank-box'>
                          <input
                            type='radio'
                            className='form-check-input'
                            {...register('bankDetail')}
                            value={JSON.stringify(bank)}
                            onChange={() => setValue('bankDetail', JSON.stringify(bank))}
                          />
                          <label className='form-check-label ml-15'>
                            <div className='account-detail-box'>
                              <div className='payment-detail-box'>
                                <span>Account Holder Name: </span>
                                <span className='text-right'>{bank?.accountHolderName}</span>
                              </div>
                              <div className='payment-detail-box'>
                                <span>Account Number: </span>
                                <span className='text-right'>{bank?.accountNumber}</span>
                              </div>
                              <div className='payment-detail-box'>
                                <span>IFSC Code: </span>
                                <span className='text-right'>{bank?.ifscCode}</span>
                              </div>
                              <p className='mt-10 mb-10'>
                                <i
                                  onClick={() => handleDelete('bank', bank?._id)}
                                  className='fas fa-trash-alt delete'
                                />
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='card'>
          <div className='add-new-detail'>
            <div className='payment-icons-title'>
              <div>
                <h3>Upi Transfer</h3>
              </div>
              <div className='btn btn-primary  wd-100p' data-toggle='modal' data-target='#upiModal'>
                Add New
              </div>
            </div>
            <hr className='mt-0' />

            <div className='account-detail mb-10'>
              <div className='container-fluid'>
                <div className='row'>
                  {bankUpiLists &&
                    bankUpiLists?.upi?.map((upi: any) => (
                      <div className='col-lg-3' key={upi?._id}>
                        <div className='bank-box'>
                          <input
                            type='radio'
                            className='form-check-input'
                            {...register('bankDetail')}
                            value={JSON.stringify(upi)}
                            onChange={() => setValue('bankDetail', JSON.stringify(upi))}
                          />
                          <label className='form-check-label ml-15'>
                            <div className='account-detail-box'>
                              <div className='payment-detail-box'>
                                <span>UPI ID: </span>
                                <span className='text-right'>{upi?.upiId}</span>
                              </div>
                              <p className='mt-10 mb-0'>
                                <i
                                  onClick={() => handleDelete('upi', upi?._id)}
                                  className='fas fa-trash-alt delete'
                                />
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <AddAccountModalPari onSuccess={getBankAndUpiList} />
      <AddUpiModalPari onSuccess={getBankAndUpiList} />

      <WithdrawStatement2 />
    </div>
  )
}

export default Withdraw
