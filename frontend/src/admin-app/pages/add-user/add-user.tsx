import React from 'react'
import {
  useForm,
  // Resolver
} from 'react-hook-form'
import User, { RoleName, RoleType } from '../../../models/User'
import UserService from '../../../services/user.service'
import { useAppSelector } from '../../../redux/hooks'
import { selectUserData } from '../../../redux/actions/login/loginSlice'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AxiosResponse } from 'axios'
import ISport from '../../../models/ISport'
import { useParams } from 'react-router-dom'
import { selectSportList } from '../../../redux/actions/sports/sportSlice'
import SubmitButton from '../../../components/SubmitButton'
import casinoService from '../../../services/casino.service'
import sportsService from '../../../services/sports.service'

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .trim('User name cannot include leading and trailing spaces')
    .strict(true)
    .required('Username is required')
    .matches(/^[A-Z][a-z0-9_-]{3,19}$/, 'Must Contain One Uppercase'),
  transactionPassword: Yup.string().required('Transaction Password is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=\D*\d)[A-Za-z0-9]{8,32}$/,
      'contains at least one digit,one upper case,one lower case alphabet,',
    ),
  passwordConfirmation: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  role: Yup.string().required('Role is required'),
  fullname: Yup.string().required('Full name is required'),
  creditRefrences: Yup.string().required('Credit Reference is required'),
  exposerLimit: Yup.string().when('role', {
    is: 'user',
    then: Yup.string().required('Exposer Limit is required'),
  }),
  paymode: Yup.string(),


})

const AddUser = () => {
  const userState = useAppSelector<{ user: User }>(selectUserData)
  const [selectedUser, setSelectedUser] = React.useState<User>()
  const [isPartnership, setIsPartnership] = React.useState(false)
  const [isExposerAllow, setExposerAllow] = React.useState(false)
  const sportListState = useAppSelector<{ sports: ISport[] }>(selectSportList)
  const UNLIMITED_VALUE = 10000000;

  const [isUnlimited, setIsUnlimited] = React.useState(false);
  const { username } = useParams()

  const [sportsList, setSportsList] = React.useState<any[]>([])
  const [casinoList, setCasinoList] = React.useState<any[]>([])

  const [selectedSports, setSelectedSports] = React.useState<number[]>([])
  const [selectedCasinos, setSelectedCasinos] = React.useState<number[]>([])

  React.useEffect(() => {
    sportsService.getSports().then((res: any) => {
      const sports = res.data.data || []
      setSportsList(sports)
      setSelectedSports(sports.map((s: any) => Number(s.sportId)))
    })

    casinoService.getCasinoList().then((res: any) => {
      const casinos = res.data.data || []
      setCasinoList(casinos)
      setSelectedCasinos(casinos.map((c: any) => Number(c.match_id)))
    })
  }, [])


  const toggleSelection = (
    id: number,
    checked: boolean,
    setList: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    console.log(id, checked, setList, "id,checked,setList")
    setList(prev => {
      if (checked) {
        // add
        if (prev.includes(id)) return prev
        return [...prev, id]
      } else {
        // remove
        return prev.filter(i => i !== id)
      }
    })
  }

  const selectAllSports = () => {
    setSelectedSports(sportsList.map(s => Number(s.sportId)));
  };

  const isAllSelected =
  selectedSports.length === sportsList.length && sportsList.length > 0


  const unselectAllSports = () => {
    setSelectedSports([]);
  };

  const selectAllCasinos = () => {
    setSelectedCasinos(casinoList.map(c => Number(c.match_id)));
  };

  const isAllCasinosSelected =
  selectedCasinos.length === casinoList.length && casinoList.length > 0


  const unselectAllCasinos = () => {
    setSelectedCasinos([]);
  };






  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    // setError,
    formState: { errors },
  } = useForm<User>({
    resolver: yupResolver(validationSchema), defaultValues: {
      paymode: 'direct', // ✅ DEFAULT VALUE
      betLock: true,     // ✅ Sports
      betLock2: true,
    },
  })

  React.useEffect(() => {
    if (username) {
      UserService.getUserDetail(username).then((res: AxiosResponse<any>) => {
        setSelectedUser(res.data.data)
      })
    }
  }, [username])

  React.useEffect(() => {
    if (isExposerAllow) {
      setValue('exposerLimit', 1000000 as any)
    }
  }, [isExposerAllow, setValue])


  const onSubmit = handleSubmit((data) => {
    // Partenership
    console.log(selectedSports, selectedCasinos, "selectedSports,selectedCasinos")
    if (data.role !== RoleType.user) {
      const partenershipValue: any = [10, 20, 30]; // Temporary array
      const partenershipArr: { [x: string]: any } = {};

      console.log("partenershipValue:", partenershipValue);
      //@ts-expect-error

      partenershipValue.forEach((element, index) => {
        if (element !== undefined) {
          partenershipArr[index] = element;
        }
      });

      // User Setting
      const userSettingArr: { [x: string]: any } = {};

      // Ensure values are arrays before iterating
      const minBetValue = Array.isArray(data.minbet) ? data.minbet : Object.values(data.minbet || {});
      const maxBetValue = Array.isArray(data.maxbet) ? data.maxbet : Object.values(data.maxbet || {});
      const delayValue = Array.isArray(data.delay) ? data.delay : Object.values(data.delay || {});

      console.log("minBetValue:", minBetValue);
      console.log("maxBetValue:", maxBetValue);
      console.log("delayValue:", delayValue);

      minBetValue.forEach((element, index) => {
        if (element !== undefined) {
          userSettingArr[index] = { minBet: element };
        }
      });

      maxBetValue.forEach((element, index) => {
        if (element !== undefined) {
          userSettingArr[index] = Object.assign(userSettingArr[index] || {}, { maxBet: element });
        }
      });

      delayValue.forEach((element, index) => {
        if (element !== undefined) {
          userSettingArr[index] = Object.assign(userSettingArr[index] || {}, { delay: element });
        }
      });

      data.userSetting = userSettingArr;

    }

    // ✅ ONLY SUPER ADMIN → betLock fields allowed
    if (userState?.user?.role !== RoleType.admin) {
      delete data.betLock;
      delete data.betLock2;
    }



    // Parent Name
    data.parent = userData?.username;
    data.Allowsport = selectedSports;
    data.AllowCasino = selectedCasinos;

    // Removing keys
    delete data.maxbet;
    delete data.minbet;
    delete data.delay;
    delete data.partnershipOur;
    if (userState?.user?.role !== RoleType.admin) {
      delete data.Allowsport;
      delete data.AllowCasino;
    }
    console.log("Final data to submit:", data);

    UserService.addUser(data)
      .then(() => {
        toast.success('User successfully created');
        reset();
      })
      .catch((e) => {
        const error = e.response.data.message;
        toast.error(error);
      });
  });


  const roleOption = () => {
    const userRole = userData.role
    const allRoles = JSON.parse(JSON.stringify(RoleName))
    delete allRoles.admin
    const options: Record<string, string> = allRoles
    if (userRole && userRole != 'admin') {
      const allOptions = Object.keys(options)
      const startIndex = allOptions.indexOf(userRole)
      const newArray = allOptions.slice(startIndex + 1)

      return newArray.map((option, index) => {
        if (+userRole >= ++index) return false
        return (
          <option key={index} value={option}>
            {options[option]}
          </option>
        )
      })
    }
    return Object.keys(options).map((option, index) => {
      return (
        <option key={index} value={option}>
          {options[option]}
        </option>
      )
    })
  }

  const userData = selectedUser ? selectedUser : userState?.user

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-12 main-container'>
          <div>
            <div className='add-account'>
              <h2 className='m-b-20'>Add Accounts</h2>
              <form onSubmit={onSubmit}>
                <div className='row'>
                  <div className='col-md-6 personal-detail'>
                    <h4 className='m-b-20 col-md-12'>Personal Detail</h4>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label htmlFor='username'>Client Name:</label>
                          <input
                            placeholder='Client Name'
                            id='username'
                            {...register('username')}
                            defaultValue={''}
                            type='text'
                            className='form-control'
                          // required
                          />
                          <span id='username-error' className='error' style={{ display: 'none' }}>
                            Username already taken
                          </span>
                          {errors?.username && (
                            <span id='username-required' className='error'>
                              {errors.username.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label htmlFor='password'>User password:</label>
                          <input
                            maxLength={45}
                            placeholder='Password'
                            id='password'
                            {...register('password')}
                            type='password'
                            className='form-control'
                          // required
                          />
                          {errors?.password && (
                            <span id='password-error' className='error'>
                              {errors.password.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label htmlFor='password_confirmation'>Retype password:</label>
                          <input
                            maxLength={45}
                            placeholder='Retype Password'
                            id='password_confirmation'
                            {...register('passwordConfirmation')}
                            type='password'
                            className='form-control'
                          // required
                          />
                          {errors?.passwordConfirmation && (
                            <span id='password_confirmation-error' className='error'>
                              {errors.passwordConfirmation.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label htmlFor='fullname'>Full Name:</label>
                          <input
                            placeholder='Full Name'
                            {...register('fullname')}
                            id='fullname'
                            defaultValue={''}
                            type='text'
                            className='form-control'
                          // required
                          />
                          {errors?.fullname && (
                            <span id='fullname-error' className='error'>
                              {errors.fullname.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label htmlFor='city'>City:</label>
                          <input
                            maxLength={15}
                            placeholder='City'
                            {...register('city')}
                            id='city'
                            defaultValue={''}
                            type='text'
                            className='form-control'
                          />
                          {errors?.city && (
                            <span id='city-error' className='error'>
                              {errors.city.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label htmlFor='phone'>Phone:</label>
                          <input
                            maxLength={10}
                            placeholder='Phone'
                            {...register('phone')}
                            id='phone'
                            type='number'
                            className='form-control'
                          />
                          {errors?.phone && (
                            <span id='phone-error' className='error'>
                              {errors.phone.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 account-detail'>
                    <h4 className='m-b-20 col-md-12'>Account Detail</h4>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label htmlFor='role'>Account Type:</label>
                          <select
                            {...register('role', {
                              onChange: (e) => {
                                e.target.value == RoleType.user
                                  ? setIsPartnership(true)
                                  : setIsPartnership(false)
                                e.target.value == RoleType.user
                                  ? setExposerAllow(true)
                                  : setExposerAllow(false)
                              },
                            })}
                            id='role'
                            className='form-control'
                          // required
                          >
                            <option value={''}>- Select Your Account Type -</option>
                            {roleOption()}
                          </select>
                          {errors?.role && (
                            <span id='role-error' className='error'>
                              {errors.role.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label htmlFor='creditrefrence'>Credit Reference:</label>
                          <input
                            className='form-control'
                            placeholder='Credit Reference'
                            {...register('creditRefrences')}
                            id='creditRefrences'
                            defaultValue={''}
                            min='0'
                            // required
                            type='number'
                          />
                          {errors?.creditRefrences && (
                            <span id='creditrefrence-error' className='error'>
                              {errors.creditRefrences.message}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* BET LOCK – ONLY FOR SUPER ADMIN */}
                      {userState?.user?.role === RoleType.admin && (
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="d-block">Bet Lock</label>

                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="betLock"
                                {...register('betLock')}
                                defaultChecked
                              />
                              <label className="form-check-label" htmlFor="betLock">
                                Sports
                              </label>
                            </div>

                            <div className="form-check mt-1">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="betLock2"
                                {...register('betLock2')}
                                defaultChecked
                              />
                              <label className="form-check-label" htmlFor="betLock2">
                                Casino
                              </label>
                            </div>
                          </div>
                        </div>
                      )}




                      {isExposerAllow && (
                        <div className="col-md-6">
                          <div className="form-group" id="exposer-limit">
                            <label htmlFor="exposerLimit">
                              Exposer Limit {isUnlimited && "(Unlimited)"}
                            </label>

                            {/* Unlimited checkbox */}
                            <div className="mb-2">
                              <input
                                type="checkbox"
                                id="unlimited"
                                checked={isUnlimited}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setIsUnlimited(checked);

                                  if (checked) {
                                    setValue("exposerLimit", UNLIMITED_VALUE);
                                  } else {
                                    setValue("exposerLimit", 0);
                                  }
                                }}
                              />
                              <label htmlFor="unlimited" className="ms-2">
                                Unlimited
                              </label>
                            </div>

                            {/* Exposer input */}
                            <input
                              placeholder="Exposer Limit"
                              id="exposerLimit"
                              type="number"
                              className="form-control"
                              min="0"
                              disabled={isUnlimited}
                              {...register("exposerLimit", {
                                required: "Exposer limit is required",
                              })}
                            />

                            {errors?.exposerLimit && (
                              <span id="exposerlimit-error" className="error">
                                {errors.exposerLimit.message}
                              </span>
                            )}
                          </div>
                        </div>
                      )}


                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="paymode"> Transaction Type</label>
                          <span className="text-danger">*</span>
                          <select
                            className="form-select" id='paymode' {...register('paymode')}
                          >
                            <option value="direct">Auto</option>
                            <option value="manual">Manual</option>

                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {!isExposerAllow && (
                  <div className='row m-t-20' id='partnership-div'>
                    <div className='col-md-12'>
                      <h4 className='m-b-20 col-md-12'>Partnership</h4>
                      <table className='table table-striped table-bordered'>
                        <thead>
                          <tr>
                            <th />
                            {sportListState.sports.map((sports: ISport) =>
                              sports.sportId === 1 || sports.sportId === 2 || sports.sportId === 4 ? (
                                //  sports.sportId === 4 ? (

                                <th key={sports._id}>{sports.name}</th>
                              ) : (
                                <th key={sports._id} />
                              ),
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Upline</td>
                            {sportListState.sports.map(({ _id, sportId }) =>
                              sportId == 1 || sportId == 2 || sportId == 4 ? (
                                //  sportId == 4 ? (

                                <td id='taxpartnership-upline' key={`upline-${_id}`}>
                                  {userData?.partnership?.[sportId].ownRatio}
                                </td>
                              ) : (
                                <td key={_id} />
                              ),
                            )}
                          </tr>
                          <tr>
                            <td>Downline</td>
                            {sportListState.sports?.map(({ _id, sportId }) =>
                              sportId == 1 || sportId == 2 || sportId == 4 ? (
                                <td key={_id}>
                                  <input
                                    className='partnership'
                                    {...register(`partnership.${sportId}`, {
                                      onChange: (e) => {
                                        const ownRatio = userData.partnership?.[sportId].ownRatio
                                        ownRatio
                                          ? setValue(
                                            `partnershipOur.${sportId}`,
                                            ownRatio - e.target.value,
                                          )
                                          : setValue(
                                            `partnershipOur.${sportId}`,
                                            getValues(`partnershipOur.${sportId}`),
                                          )
                                      },
                                    })}
                                    id={`partnership.${sportId}`}
                                    placeholder={''}
                                    max={userData?.partnership?.[sportId].ownRatio}
                                    min='0'
                                    defaultValue={0}
                                    type='number'
                                    disabled={isPartnership}
                                  />
                                  <span className='error' />
                                </td>
                              ) : (
                                <td key={_id} />
                              ),
                            )}
                          </tr>





                          <tr>
                            <td>Our</td>
                            {sportListState.sports?.map(({ _id, sportId }) =>
                              sportId == 1 || sportId == 2 || sportId == 4 ? (
                                //  sportId == 4 ? (

                                <td id={`taxpartnership-our.${sportId}`} key={_id}>
                                  <input
                                    {...register(`partnershipOur.${sportId}`)}
                                    value={userData?.partnership?.[sportId].ownRatio}
                                    // min={0}
                                    disabled={true}
                                  />
                                </td>
                              ) : (
                                <td key={_id} />
                              ),
                            )}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                <div className='row m-t-20' id='min-max-bet-div'>
                  <div className='col-md-12'>
                    <h4 className='m-b-20 col-md-12'>Min Max Bet</h4>
                    <table className='table table-striped table-bordered'>
                      <thead>
                        <tr>
                          <th />
                          {sportListState.sports?.map((sports: any) =>
                            sports.sportId === 1 || sports.sportId === 2 || sports.sportId === 4 ? (
                              <th key={sports._id}>{sports.name}</th>
                            ) : (
                              <th key={sports._id} />
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Min Bet</td>
                          {sportListState.sports?.map(({ _id, sportId }) =>
                            sportId == 1 || sportId == 2 || sportId == 4 ? (
                              <td id='minbet' key={_id}>
                                {userData?.userSetting?.[sportId].minBet}
                              </td>
                            ) : (
                              <td key={_id} />
                            ),
                          )}
                        </tr>
                        <tr>
                          <td>Provide Min Bet</td>
                          {sportListState.sports?.map(({ _id, sportId }) =>
                            sportId == 1 || sportId == 2 || sportId == 4 ? (
                              <td key={_id}>
                                <input
                                  id={`minbet.${sportId}`}
                                  className={`minbet.${sportId}`}
                                  {...register(`minbet.${sportId}`)}
                                  placeholder={''}
                                  max={userData?.userSetting?.[sportId].minBet}
                                  min={0}
                                  defaultValue={0}
                                  // disabled={isPartnership}
                                  type='number'
                                />
                                <span className='error' />
                              </td>
                            ) : (
                              <td key={_id} />
                            ),
                          )}
                        </tr>
                        <tr>
                          <td>Max Bet</td>
                          {sportListState.sports?.map(({ _id, sportId }) =>
                            sportId == 1 || sportId == 2 || sportId == 4 ? (
                              <td id='maxbet' key={_id}>
                                {userData?.userSetting?.[sportId].maxBet}
                              </td>
                            ) : (
                              <td key={_id} />
                            ),
                          )}
                        </tr>
                        <tr>
                          <td>Provide Max Bet</td>
                          {sportListState.sports?.map(({ _id, sportId }) =>
                            sportId == 1 || sportId == 2 || sportId == 4 ? (
                              <td key={_id}>
                                <input
                                  id={`maxbet.${sportId}`}
                                  className={`maxbet.${sportId}`}
                                  {...register(`maxbet.${sportId}`)}
                                  placeholder={''}
                                  max={userData?.userSetting?.[sportId].maxBet}
                                  defaultValue={0}
                                  // disabled={isPartnership}
                                  min={0}
                                  type='number'
                                />
                                <span className='error' />
                              </td>
                            ) : (
                              <td key={_id} />
                            ),
                          )}
                        </tr>
                        <tr>
                          <td>Delay</td>
                          {sportListState.sports?.map(({ _id, sportId }) =>
                            sportId == 1 || sportId == 2 || sportId == 4 ? (
                              <td id='delay' key={_id}>
                                {userData?.userSetting?.[sportId].delay}
                              </td>
                            ) : (
                              <td key={_id} />
                            ),
                          )}
                        </tr>
                        <tr>
                          <td>Provide Delay</td>
                          {sportListState.sports?.map(({ _id, sportId }) =>
                            sportId == 1 || sportId == 2 || sportId == 4 ? (
                              <td key={_id}>
                                <input
                                  id={`delay.${sportId}`}
                                  className={`delay.${sportId}`}
                                  {...register(`delay.${sportId}`)}
                                  placeholder={''}
                                  max={userData?.userSetting?.[sportId].delay}
                                  defaultValue={0}
                                  // disabled={isPartnership}
                                  type='number'
                                />
                                <span className='error' />
                              </td>
                            ) : (
                              <td key={_id} />
                            ),
                          )}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {userState.user.role == "admin" && (<> <div className="row m-t-20">
                  <div className="col-md-12">
                    <h4 className="m-b-20">Sports Access</h4>

                    <div className="d-flex gap-3 mb-2">

{!isAllSelected && (
  <button
    type="button"
    className="btn btn-sm btn-success"
    onClick={selectAllSports}
  >
    Select All
  </button>
)}

{isAllSelected && (
  <button
    type="button"
    className="btn btn-sm btn-danger"
    onClick={unselectAllSports}
  >
    Unselect All
  </button>
)}

</div>



                    <div className="row">
                      {sportsList.map((sport, index) => {
                        const sportId = Number(sport.sportId);

                        return (
                          <div className="col-md-3" key={`${sportId}-${index}`}>
                            <div className="form-check">
                              <input
                                id={`sport-${sportId}`}
                                type="checkbox"
                                className="form-check-input"
                                checked={selectedSports.includes(sportId)}
                                onChange={(e) => {
                                  console.log('clicked', sportId, e.target.checked);
                                  toggleSelection(sportId, e.target.checked, setSelectedSports);
                                }}
                              />
                              <label className="form-check-label" htmlFor={`sport-${sportId}`}>
                                {sport.name}
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                  <div className="row m-t-20">
                    <div className="col-md-12">
                      <h4 className="m-b-20">Casino Access</h4>

                      <div className="d-flex gap-3 mb-2">

{!isAllCasinosSelected && (
  <button
    type="button"
    className="btn btn-sm btn-success"
    onClick={selectAllCasinos}
  >
    Select All
  </button>
)}

{isAllCasinosSelected && (
  <button
    type="button"
    className="btn btn-sm btn-danger"
    onClick={unselectAllCasinos}
  >
    Unselect All
  </button>
)}

</div>


                      <div className="row">
                        {casinoList.map((casino) => {
                          const casinoId = Number(casino.match_id);

                          return (
                            <div className="col-md-3" key={casinoId}>
                              <div className="form-check">
                                <input
                                  id={`casino-${casinoId}`}
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={selectedCasinos.includes(casinoId)}
                                  onChange={(e) => {
                                    console.log('casino clicked:', casinoId, e.target.checked);
                                    toggleSelection(
                                      casinoId,
                                      e.target.checked,
                                      setSelectedCasinos
                                    );
                                  }}
                                />

                                <label
                                  className="form-check-label"
                                  htmlFor={`casino-${casinoId}`}
                                >
                                  {casino.title}
                                </label>
                              </div>
                            </div>
                          );
                        })}

                      </div>
                    </div>
                  </div></>)}


                <div className='row m-t-20'>
                  <div className='col-md-12'>
                    <div className='form-group col-md-3 float-right'>
                      <label htmlFor='transactionPassword'>Transaction Password:</label>
                      <input
                        maxLength={15}
                        placeholder='Transaction Password'
                        {...register('transactionPassword')}
                        defaultValue={''}
                        id='transactionPassword'
                        type='password'
                        className='form-control'
                      />
                      {errors?.transactionPassword && (
                        <span id='transactionPassword-error' className='error'>
                          {errors.transactionPassword.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className='row m-t-20'>
                  <div className='col-md-12'>
                    <div className='float-right'>
                      <SubmitButton className='btn btn-submit' type='submit'>
                        Create User
                      </SubmitButton>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AddUser