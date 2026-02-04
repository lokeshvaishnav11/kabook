import IBet, { IBetOn } from '../models/IBet'

export const calculatePnlF = (betValue: IBet) => {
  let pnl = 0
  let exposure = 0

  if (!betValue || !betValue.stack || betValue.stack <= 0) {
    return { pnl: 0, exposure: 0 }
  }

  // =======================
  // CASINO LOGIC (ROULETTE)
  // =======================
  if (betValue.betOn === IBetOn.CASINO) {
    if (betValue.isBack) {
      pnl = betValue.odds * betValue.stack - betValue.stack
      exposure = -betValue.stack
    } else {
      pnl = betValue.stack
      exposure = -1 * (betValue.odds * betValue.stack - betValue.stack)
    }
  }

  return {
    pnl: parseInt(pnl.toFixed()),
    exposure: parseInt(exposure.toFixed()),
  }
}
