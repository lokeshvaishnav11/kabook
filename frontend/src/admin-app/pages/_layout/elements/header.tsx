import React from 'react'

import { Tree } from 'antd'
import axios, { AxiosResponse } from 'axios'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import ISport from '../../../../models/ISport'
import User, { RoleType } from '../../../../models/User'
import { CustomLink, useNavigateCustom } from '../../../../pages/_layout/elements/custom-link'
import { logout, selectUserData, userUpdate } from '../../../../redux/actions/login/loginSlice'
import { selectSportList } from '../../../../redux/actions/sports/sportSlice'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import casinoService from '../../../../services/casino.service'
import sportsService from '../../../../services/sports.service'
import userService from '../../../../services/user.service'
import UserService from '../../../../services/user.service'

import CustomAutoComplete from '../../../components/CustomAutoComplete'
import Marqueemessge from './welcome'
import { DataNode } from 'antd/es/tree'

const Header = () => {
  const userState = useAppSelector<{ user: User }>(selectUserData)
  const dispatch = useAppDispatch()

  const navigate = useNavigateCustom()
  const userMenuRef = React.useRef<HTMLLIElement | null>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false)
      }
    }
  
    document.addEventListener('mousedown', handleClickOutside)
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  


  const [showMenu, setShowMenu] = React.useState<boolean>(false)
  const [treeData, setTreeData] = React.useState<any>([])
  const [expanded, setExpanded] = React.useState<string[]>([])
const [userParentAlldata, setUserParentAlldata] = React.useState<{ [key: string]: any }>(
    {}
  );

  const [expandedKeys, setExpandedKeys] = React.useState<any[]>([])


  const sportsList = useAppSelector(selectSportList)

  const [userMessage, setUserMessage] = React.useState<string>('')

  const [isOpen, setIsOpen] = React.useState(false)
  const [gameList, setGameList] = React.useState([])

  // React.useEffect(() => {
  //   axios.get(`adminMessage.json?v=${Date.now()}`).then((res: AxiosResponse) => {
  //     setUserMessage(res.data.message)
  //   })
  // }, [])

  React.useEffect(() => {
    if (gameList.length <= 0)
      casinoService.getCasinoList().then((res: AxiosResponse<any>) => {
        setGameList(res.data.data)
      })
  }, [])


  React.useEffect(() => {
    // const userState = useAppSelector<{ user: User }>(selectUserData);
    const username:any = userState?.user?.username;

    console.log(username, "testagentmaster");
    UserService.getParentUserDetail(username).then(
      (res: AxiosResponse<any>) => {
        console.log(res, "check balance for parent");
        const detail = res?.data.data[0];
        setUserParentAlldata(detail);

      }
    );
  }, [userState]);

  

  const toggleDrawer = () => {
    setIsOpen((prev) => !prev)
  
    setTreeData(
      sportsList.sports.map((sport: ISport) => ({
        key: sport.sportId,
        type: 'sport',
        isLeaf: false,
        children: undefined,
        title: (
          <div className="d-flex align-items-center tree-row">
            <span
              className="plus-box"
              onClick={(e) => {
                e.stopPropagation()
                setExpandedKeys((prev) =>
                  prev.includes(sport.sportId)
                    ? prev.filter((k) => k !== sport.sportId)
                    : [...prev, sport.sportId]
                )
              }}
            >
              {expandedKeys.includes(sport.sportId) ? '-' : '+'}
            </span>
            <span>{sport.name}</span>
          </div>
        ),
      }))
    )
  }
  

  const logoutUser = (e: any) => {
    e.preventDefault()
    dispatch(userUpdate({} as User))
    setTimeout(() => {
      dispatch(logout())
      navigate.go('/login')
    }, 1)
  }

  const onSuggestionsFetchRequested = ({ value }: any) => {
    return userService.getUserListSuggestion({ username: value })
  }

  const onSelectUser = (user: any) => {
    navigate.go(`/list-clients/${user.username}?search=true`)
  }

  const selectExpend = (item: any) => {
    if (item.matchId) {
      setIsOpen(false)
      window.location.href = `/admin/odds/${item.matchId}`
    }
  }

  const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] =>
    list.map((node) => {
      if (node.key === key) {
        return {
          ...node,
          children,
        }
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        }
      }
      return node
    })

    const onLoadData = (node: any) => {
      // already loaded
      if (node.children) {
        return Promise.resolve()
      }
    
      // MATCH click
      if (node.type === 'match') {
        setIsOpen(false)
        window.location.href = `/admin/odds/${node.matchId}`
        return Promise.resolve()
      }
    
      // SPORT → SERIES
      if (node.type === 'sport') {
        return sportsService.getSeriesWithMatch(node.key).then((res: any) => {
          const seriesNodes: DataNode[] = res.data.data.map((series: any) => {
            const seriesKey = `series-${series.competition.id}`
    
            return {
              key: seriesKey,
              type: 'series',
              sportId: node.key,
              competitionId: series.competition.id,
              isLeaf: false,
              children: undefined,
              title: (
                <div className="d-flex align-items-center tree-row">
                  <span
                    className="plus-box"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedKeys((prev) =>
                        prev.includes(seriesKey)
                          ? prev.filter((k) => k !== seriesKey)
                          : [...prev, seriesKey]
                      )
                    }}
                  >
                    {expandedKeys.includes(seriesKey) ? '-' : '+'}
                  </span>
                  <span>{series.competition.name}</span>
                </div>
              ),
            }
          })
    
          setTreeData((origin: any) =>
            updateTreeData(origin, node.key, seriesNodes)
          )
    
          return seriesNodes
        })
      }
    
      // SERIES → MATCHES
      if (node.type === 'series') {
        return sportsService.getSeriesWithMatch(node.sportId).then((res: any) => {
          const series = res.data.data.find(
            (s: any) => s.competition.id === node.competitionId
          )
    
          const matchNodes: DataNode[] =
            series?.matches?.map((match: any) => ({
              key: `match-${match.event.id}`,
              title: match.event.name,
              type: 'match',
              matchId: match.event.id,
              isLeaf: true,
            })) || []
    
          setTreeData((origin: any) =>
            updateTreeData(origin, node.key, matchNodes)
          )
    
          return matchNodes
        })
      }
    
      return Promise.resolve()
    }
    

  return (
    <>
      <header>
        <div className='header-bottom'>
          <div className='container-fluid'>
            <CustomLink to={'/'} className='logo'>
              <img src='/imgs/logo.png' />
            </CustomLink>
            <div className='side-menu-button' onClick={toggleDrawer}>
              <div className='bar1' />
              <div className='bar2' />
              <div className='bar3' />
            </div>
            <nav className='navbar navbar-expand-md btco-hover-menu'>
              <div className='collapse navbar-collapse'>
                <ul className='list-unstyled navbar-nav'
                
                style={{width: "73%",
                  textWrap: "nowrap",
                  flexWrap: "wrap",
                  rowGap: "14px",}}>

                {/* <li className='nav-item'>
                    <CustomLink to={`/combined-dashboard`}>
                      <b>Dashboard</b>
                    </CustomLink>
                  </li> */}

                  <li className='nav-item'>
                    <CustomLink to={`/list-clients/${userState?.user?.username}`}>
                      <b>List of clients</b>
                    </CustomLink>
                  </li>

                  <li className='nav-item'>
                    <CustomLink to={`/assign-agent`}>
                      <b>Assign Agent</b>
                    </CustomLink>
                  </li>

                  <li className='nav-item'>
                    <CustomLink to={'/market-analysis'}>
                      <b>Market Analysis</b>
                    </CustomLink>
                  </li>
                  {   (userState?.user?.role == "admin" ||
  userParentAlldata?.paymode == "manual") && <li className='nav-item'>
                    <CustomLink to={'/txn'}>
                      <b>Txn</b>
                    </CustomLink>
                  </li>}



                  <li className='nav-item dropdown'>
                    <a>
                      <b>Reports</b> <i className='fa fa-caret-down' />
                    </a>
                    <ul className='dropdown-menu' aria-labelledby='navbarDropdownMenuLink'>
                      <li>
                        <CustomLink to='/accountstatement' className='dropdown-item'>
                          <b>{"Account's Statement"}</b>
                        </CustomLink>
                      </li>
                      <li>
                        <CustomLink to='/unsettledbet' className='dropdown-item'>
                          <b>Current Bets</b>
                        </CustomLink>
                      </li>
                      {userState?.user?.role === RoleType.admin && (
                        <li>
                          <CustomLink to='/unsettledbet/deleted' className='dropdown-item'>
                            <b>Deleted Bets</b>
                          </CustomLink>
                        </li>
                      )}

{userState?.user?.role === RoleType.admin && (
                        <li>
                          <CustomLink to='/deleted-bets' className='dropdown-item'>
                            <b>Deleted History (Undo)</b>
                          </CustomLink>
                        </li>
                      )}
                      {/* <li>
                        <a href='greport.html' className='dropdown-item'>
                          <b>General Report</b>
                        </a>
                      </li> */}
                      <li>
                        <CustomLink to='/game-reports' className='dropdown-item'>
                          <b>Game Reports</b>
                        </CustomLink>
                      </li>
                      <li>
                        <CustomLink to='/profitloss' className='dropdown-item'>
                          <b>Profit And Loss</b>
                        </CustomLink>
                      </li>
                    </ul>
                  </li>

                 { (userState?.user?.role == "admin" ||
  userParentAlldata?.paymode == "manual") && <li className='nav-item dropdown'>
                    <a>
                      <b>Transactions</b> <i className='fa fa-caret-down' />
                    </a>
                    <ul className='dropdown-menu' aria-labelledby='navbarDropdownMenuLink' >
                      <li>
                        <CustomLink to='/depositstatement' className='dropdown-item'>
                          <b>{"Deposit"}</b>
                        </CustomLink>
                      </li>
                      <li>
                        <CustomLink to='/withdrawstatement' className='dropdown-item'>
                          <b>Withdraw</b>
                        </CustomLink>
                      </li>
                    </ul>
                  </li>}
                  <li className='nav-item dropdown'>
                    <a>
                      <b>Live Markets</b> <i className='fa fa-caret-down' />
                    </a>
                    <ul
                      className='dropdown-menu'
                      aria-labelledby='navbarDropdownMenuLink'
                      style={{ height: '400px', overflowY: 'scroll' }}
                    >
                      {gameList?.length > 0 &&
                        gameList.map((Item: any, key: number) => {
                          return (
                            <li key={key}>
                              <CustomLink to={`/casino/${Item.slug}`} className='dropdown-item'>
                                <b>{Item.title}</b>
                              </CustomLink>
                            </li>
                          )
                        })}
                    </ul>
                  </li>

                  <li className='nav-item dropdown'>
                    <a>
                      <b>Live Virtual Markets</b> <i className='fa fa-caret-down' />
                    </a>
                    <ul
                      className='dropdown-menu'
                      aria-labelledby='navbarDropdownMenuLink'
                      style={{ height: '400px', overflowY: 'scroll' }}
                    >
                      {gameList?.length > 0 &&
                        gameList.map((Item: any, key: number) => {
                          return (
                            <li key={key}>
                              <CustomLink to={`/casino/${Item.slug}`} className='dropdown-item'>
                                <b>{Item.title}</b>
                              </CustomLink>
                            </li>
                          )
                        })}
                    </ul>
                  </li>
                 
                    <li className='nav-item dropdown'>
                      <a>
                        <b>Settings</b> <i className='fa fa-caret-down' />
                      </a>
                      <ul className='dropdown-menu' aria-labelledby='navbarDropdownMenuLink'>
                      {(userState?.user?.role === RoleType.admin) && (<>
                        <li>
                          <CustomLink to='/sports-list/active-matches' className='dropdown-item'>
                            <b>{'Block Markets'}</b>
                          </CustomLink>
                        </li>
                        <li>
                          <CustomLink to='/messages' className='dropdown-item'>
                            <b>{'Messages'}</b>
                          </CustomLink>
                        </li>
                        <li>
                          <CustomLink to={'/sports-list/matches'} className='dropdown-item'>
                            <b>Add Match List</b>
                          </CustomLink>
                        </li>

                        <li>
                          <CustomLink to='/casino-list' className='dropdown-item'>
                            <b>{'Casino List'}</b>
                          </CustomLink>
                        </li>
                      </>
                      )}

                     {(userState?.user?.role === "admin" ||
  userParentAlldata?.paymode === "manual") && <li>
                        <CustomLink to='/payment-method' className='dropdown-item'>
                          <b>{'Payment Method'}</b>
                        </CustomLink>
                      </li>}

                      <li>
                        <CustomLink to='/update-tv' className='dropdown-item'>
                          <b>{'Mange -TV'}</b>
                        </CustomLink>
                      </li>



                      </ul>
                    </li>

                  
                    <li className='nav-item'>
                    <CustomLink to={`/multi-login`}>
                      <b>Multi Login</b>
                    </CustomLink>
                  </li>

                  <li className='nav-item'>
                    <CustomLink to={`/login-reports`}>
                      <b>Login Report</b>
                    </CustomLink>
                  </li>
                
                </ul>

              </div>
            </nav>


            

            <ul className='user-search list-unstyled'>
              <li className='username' ref={userMenuRef}>
                <span onClick={() => setShowMenu(!showMenu)}>
                  {userState?.user?.username} <i className='fa fa-caret-down' />
                </span>
                <ul style={{ display: showMenu ? 'block' : 'none' }}>
                <li>
                    <CustomLink to='/secure-auth'>
                      <b>Secure Auth Verify</b>
                    </CustomLink>
                  </li>
                  <li>
                    <CustomLink to='/change-password'>
                      <b>Change Password</b>
                    </CustomLink>
                  </li>
                  <li>
                    <a onClick={logoutUser} href='#'>
                      <b>Logout</b>
                    </a>
                  </li>
                </ul>
              </li>
              <li className='search'>
                <CustomAutoComplete
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSelectUser={onSelectUser}
                  placeHolder={'All Client'}
                />
                {/* <input id='tags' type='text' name='list' placeholder='All Client' />
                <a id='clientList' data-value='' href='#'>
                  <i className='fas fa-search-plus' />
                </a> */}
              </li>
            </ul>
            {/* <Marqueemessge message={userMessage}></Marqueemessge> */}
          </div>
        </div>
      </header>
      <Drawer open={isOpen} onClose={toggleDrawer} direction='left'>
        <div className='drawer-header'>
          <img src='/imgs/logo.png' className='wd-100' />
        </div>
        <div className='drawer-content'>
        <Tree
  showIcon={false}
  switcherIcon={null}
  expandedKeys={expandedKeys}
  onExpand={(keys) => setExpandedKeys(keys)}
  loadData={onLoadData}
  treeData={treeData}
  onSelect={(keys, e) => {
    if (e.node.type === 'match') {
      setIsOpen(false)
      window.location.href = `/admin/odds/${e.node.matchId}`
    }
  }}
/>

        </div>
      </Drawer>
    </>
  )
}
export default Header
