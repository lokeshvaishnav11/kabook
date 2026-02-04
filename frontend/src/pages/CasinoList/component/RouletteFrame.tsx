import React from 'react'
import { useParams } from 'react-router-dom'

const RouletteFrame = ({ liveMatchData, lastOdds }: any) => {
  const { gameCode } = useParams()

  const firstRunnerStatus = lastOdds?.market?.[0]?.Runners?.[0]?.s
  const isCenterMode = firstRunnerStatus === 0

  return (
    <div
      className={`card-body ${gameCode}`}
      style={{
        padding: '0px',
        position: isCenterMode ? 'absolute' : 'relative',
        top: isCenterMode ? '30%' : undefined,
        left: isCenterMode ? '50%' : '0',
        transform: isCenterMode ? 'translateX(-50%)' : undefined,
        height: 'auto',
        width: isCenterMode ? '95%' : '58%',
        zIndex: 9999,
      }}
    >
      {liveMatchData && (
        <iframe
          title='stream'
          src={`https://casino-stream-v2.cricketid.xyz/casino-tv?id=${gameCode}&retry=1`}
          style={{
            width: '100%',
            height: '100%',
            border: '0px',
          }}
          sandbox='allow-same-origin allow-scripts allow-popups allow-forms'
          seamless
        />
      )}
    </div>
  )
}

export default React.memo(RouletteFrame)
