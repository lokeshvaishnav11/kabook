import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { getPlaceBetAction } from "../../../../../redux/actions/bet/bet.action";
import { selectUserData } from "../../../../../redux/actions/login/loginSlice";
import { RoleType } from "../../../../../models/User";
import IBet, { IBetOn, IBetType } from "../../../../../models/IBet";
import authService from "../../../../../services/auth.service";
import { useParams } from "react-router-dom";
import { calculatePnlF } from "../../../../../utils/calculatePnl";
import { createPortal } from 'react-dom';

interface ButtonProps {
  title: string | number;
  numbers: string;
  selectedCoin: number;
  betSide: "BACK" | "LAY";
  liveMatchData: any;
  isNumber: boolean;
  buttonCoin: number;
  isSelected: boolean;
  onToggle: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  betType: string;
  cleanBet: () => void;
  marketStatus?: 'locked' | 'active';
  lastOdds: any,
}

const ButtonItemroulette12 = ({
  title,
  numbers,
  selectedCoin,
  betSide,
  liveMatchData,
  isNumber,
  buttonCoin,
  isSelected = false,
  onToggle,
  onMouseEnter,
  onMouseLeave,
  betType = 'number',
  cleanBet,
  marketStatus = 'locked',
  lastOdds
}: ButtonProps) => {

  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);
  const { gameCode } = useParams();
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' }[]>([]);
  const [forceHideCoin, setForceHideCoin] = useState(false);

  // ✅ FIXED: Real-time market status sync
  useEffect(() => {
    const firstRunnerStatus = liveMatchData?.event_data?.market?.[0]?.Runners?.[0]?.s;
    if (firstRunnerStatus === 1) {
      setForceHideCoin(false); // Clear error locks when active
    }
  }, [liveMatchData?.event_data?.market?.[0]?.Runners?.[0]?.s]);

  // ✅ EXTRACTED: Toast Management
  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2000);
  };

  const market = liveMatchData?.event_data?.market?.[0];
  const runners = market?.Runners || [];

  const firstRunnerStatus = market?.Runners?.[0]?.s;
  const isMarketActive = !!firstRunnerStatus && firstRunnerStatus === 1;
  const isLocked = marketStatus === 'locked' || !isMarketActive;

  const runner = lastOdds?.market[0].Runners.find((r: any) => r.n === String(numbers))!;

  const suspend = ['number', 'outside', 'dozen', 'column'].includes(betType) &&
    (isLocked || !runners.length || runner?.s !== 1 || !market)
    ? 'suspended' : '';

  // ✅ EXTRACTED: Bet Validation
  const validateBet = (): { valid: boolean; error?: string } => {
    if (userState.user.role !== RoleType.user) return { valid: false, error: 'User not authorized' };
    if (!selectedCoin || selectedCoin <= 0) return { valid: false, error: 'Select coin first' };
    if (suspend || isLocked) return { valid: false, error: 'Market Suspended' };

    const runner = runners.find((r: any) => r.n === String(numbers));
    if (!runner) return { valid: false, error: 'Runner not found' };

    const oddsVal = betSide === "BACK" ? runner.b : runner.l;
    if (!oddsVal || oddsVal <= 0) return { valid: false, error: 'Invalid odds' };

    return { valid: true };
  };

  // ✅ EXTRACTED: API Response Handler
  const handleApiResponse = (result: any) => {
    const getApiMessage = (data: any): string => {
      if (typeof data === 'string') return data;
      if (data?.message) return data.message;
      if (data?.payload?.message) return data.payload.message;
      return 'Bet Failed';
    };

    const apiResponse = result?.payload || result;
    const hasError = apiResponse?.error || apiResponse?.payload?.error || apiResponse?.code === 500 || result?.error;

    if (hasError) {
      setForceHideCoin(true);
      addToast(`❌ ${getApiMessage(apiResponse)}`, 'error');
      setTimeout(() => cleanBet?.(), 200);
    }
  };


  const onBet = () => {
    setForceHideCoin(false);
    const validation = validateBet();
    if (!validation.valid) {
      addToast(`❌ ${validation.error}`, 'error');
      return;
    }

    onToggle();

    // Build bet object
    const runner = runners.find((r: any) => r.n === String(numbers))!;
    const oddsVal = betSide === "BACK" ? runner.b : runner.l;

    const betObj: IBet = {
      isBack: betSide === "BACK",
      odds: oddsVal,
      volume: 0,
      marketId: liveMatchData.mid,
      marketName: market.MarketName,
      matchId: Number(liveMatchData.event_data.match_id),
      selectionName: runner.n,
      selectionId: runner.i,
      stack: selectedCoin,
      currentMarketOdds: oddsVal,
      eventId: liveMatchData.mid,
      exposure: 0,
      pnl: 0,
      ipAddress: authService.getIpAddress(),
      type: IBetType.Match,
      matchName: liveMatchData.event_data.title,
      betOn: IBetOn.CASINO,
      gtype: gameCode,
    };

    // Calculate PNL
    const cal = calculatePnlF(betObj);
    betObj.pnl = cal.pnl;
    betObj.exposure = cal.exposure;

    // Place bet
    dispatch(getPlaceBetAction(betObj))
      .then(handleApiResponse)
      .catch(() => {
        setForceHideCoin(true);
        addToast('❌ Network Error', 'error');
        setTimeout(() => cleanBet?.(), 200);
      });
  };

  // ✅ Styles (unchanged)
  const toastStyle = (type: 'success' | 'error') => ({
    padding: '16px 20px',
    borderRadius: '12px',
    background: type === 'success' ? '#4CAF50' : '#f44336',
    color: 'white',
    fontWeight: 600 as const,
    fontSize: '15px',
    cursor: 'pointer',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    pointerEvents: 'auto' as const,
    margin: '0 auto',
  });

  const containerStyle = {
    position: 'fixed' as const,
    top: '15px',
    left: '50%',
    transform: "translateX(-50%)",
    zIndex: 100000,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    maxWidth: '350px',
    pointerEvents: 'none' as const,
  };

  const coinStyle = {
    position: 'absolute' as const,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '25px',
    height: '25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `url('/imgs/roulette12/commonCoin.webp')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const coinTextStyle = {
    fontSize: '10px',
    fontWeight: 'bold' as const,
    color: '#fff',
    zIndex: 2,
  };

  return (
    <>
      <button
        disabled={isLocked}
        type="button"
        className={`bg-transparent border-0 h-100 w-100 ${suspend}`}
        onClick={onBet}
        onMouseDown={(e) => e.preventDefault()}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ position: 'relative', cursor: isLocked ? 'not-allowed' : 'pointer' }}
      >
        <b className={isNumber ? "text-white" : "text-danger"}>{title}</b>

        {/* Selected Coin */}
        {isSelected && !forceHideCoin && (
          <div style={coinStyle}>
            <span style={coinTextStyle}>{buttonCoin}</span>
          </div>
        )}
      </button>

      {/* Toasts Portal */}
      {toasts.length > 0 && createPortal(
        <div style={containerStyle}>
          {toasts.map(toast => (
            <div
              key={toast.id}
              style={toastStyle(toast.type)}
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            >
              <span style={{ fontSize: '20px' }}></span>
              <span>{toast.message}</span>
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

export default React.memo(ButtonItemroulette12);
