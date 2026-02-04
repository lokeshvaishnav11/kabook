import React, { useMemo, useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

const RacingMatchList = ({ matchList }: { matchList: any[] }) => {
  const navigate = useNavigate()
  const styles: any = {
  seriesTabs: {
    display: 'flex',
    gap: '8px',
    padding: '8px',
    borderBottom: '1px solid #ddd',
    overflowX: 'auto'
  },
  seriesBtn: {
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    background: '#f5f5f5',
    cursor: 'pointer',
    fontSize: '13px',
    whiteSpace: 'nowrap'
  },
  seriesActive: {
    background: '#1e88e5',
    color: '#fff',
    borderColor: '#1e88e5',
    fontWeight: 600
  },
  venueBlock: {
    padding: '8px 10px',
    borderBottom: '1px solid #e5e5e5'
  },
  venueName: {
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '6px'
  },
  timeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))',
    gap: '6px'
  },
  timeBtn: {
    padding: '6px 0',
    borderRadius: '4px',
    border: '1px solid #dcdcdc',
    background: '#f2f2f2',
    fontSize: '13px',
    cursor: 'pointer'
  },
  liveBtn: {
    background: '#fff0f0',
    borderColor: '#ff4d4f',
    color: '#d40000',
    fontWeight: 600
  }
}


  /* ✅ Unique series list */
  const seriesList = useMemo(() => {
  return Array.from(new Set(matchList.map(m => m.seriesName)))
}, [matchList])


  /* ✅ Default first series */
  const [activeSeries, setActiveSeries] = useState(seriesList[0])

  /* ✅ Filter matches by series */
  const filteredMatches = useMemo(() => {
    return matchList.filter(m => m.seriesName === activeSeries)
  }, [matchList, activeSeries])

  /* ✅ Group by venue (name) */
  const groupedByVenue = useMemo(() => {
    return filteredMatches.reduce((acc: any, m) => {
      if (!acc[m.name]) acc[m.name] = []
      acc[m.name].push(m)
      return acc
    }, {})
  }, [filteredMatches])

  return (
    <div>

      {/* 🔹 SERIES TABS */}
      <div style={styles.seriesTabs}>
        {seriesList.map(series => (
          <button
            key={series}
            onClick={() => setActiveSeries(series)}
            style={{
              ...styles.seriesBtn,
              ...(activeSeries === series ? styles.seriesActive : {})
            }}
          >
            {series}
          </button>
        ))}
      </div>

      {/* 🔹 RACING LIST */}
      {Object.keys(groupedByVenue).map(venue => (
        <div key={venue} style={styles.venueBlock}>
          <div style={styles.venueName}>{venue}</div>

          <div style={styles.timeGrid}>
            {groupedByVenue[venue]
              .sort(
                (a: any, b: any) =>
                  new Date(a.matchDateTime).getTime() -
                  new Date(b.matchDateTime).getTime()
              )
              .map((match: any) => {
                const isLive =
                  new Date(match.matchDateTime).getTime() <= Date.now()

                return (
                  <button
                    key={match.matchId}
                    onClick={() => navigate(`/odds/${match.matchId}`)}
                    style={{
                      ...styles.timeBtn,
                      ...(isLive ? styles.liveBtn : {})
                    }}
                  >
                    {moment(match.matchDateTime).format('HH:mm')}
                  </button>
                )
              })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default RacingMatchList
