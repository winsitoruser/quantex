// Technical Analysis Indicators

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface LineData {
  time: number;
  value: number;
}

// Simple Moving Average
export function calcSMA(data: CandleData[], period: number): LineData[] {
  const result: LineData[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) sum += data[i - j].close;
    result.push({ time: data[i].time, value: sum / period });
  }
  return result;
}

// Exponential Moving Average
export function calcEMA(data: CandleData[], period: number): LineData[] {
  const result: LineData[] = [];
  const k = 2 / (period + 1);
  let ema = data.slice(0, period).reduce((s, d) => s + d.close, 0) / period;
  result.push({ time: data[period - 1].time, value: ema });
  for (let i = period; i < data.length; i++) {
    ema = data[i].close * k + ema * (1 - k);
    result.push({ time: data[i].time, value: ema });
  }
  return result;
}

// Bollinger Bands
export function calcBollingerBands(data: CandleData[], period: number = 20, stdDev: number = 2) {
  const upper: LineData[] = [];
  const middle: LineData[] = [];
  const lower: LineData[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) sum += data[i - j].close;
    const avg = sum / period;
    let variance = 0;
    for (let j = 0; j < period; j++) variance += Math.pow(data[i - j].close - avg, 2);
    const std = Math.sqrt(variance / period);
    middle.push({ time: data[i].time, value: avg });
    upper.push({ time: data[i].time, value: avg + stdDev * std });
    lower.push({ time: data[i].time, value: avg - stdDev * std });
  }
  return { upper, middle, lower };
}

// RSI
export function calcRSI(data: CandleData[], period: number = 14): LineData[] {
  const result: LineData[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }
  let avgGain = gains.slice(0, period).reduce((s, v) => s + v, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((s, v) => s + v, 0) / period;
  const rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  result.push({ time: data[period].time, value: rsi });
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    const r = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
    result.push({ time: data[i + 1].time, value: r });
  }
  return result;
}

// MACD
export function calcMACD(data: CandleData[], fast = 12, slow = 26, signal = 9) {
  const emaFast = calcEMA(data, fast);
  const emaSlow = calcEMA(data, slow);
  const macdLine: LineData[] = [];
  const offset = slow - fast;
  for (let i = 0; i < emaSlow.length; i++) {
    macdLine.push({
      time: emaSlow[i].time,
      value: emaFast[i + offset].value - emaSlow[i].value,
    });
  }
  // Signal line (EMA of MACD)
  const signalLine: LineData[] = [];
  const k = 2 / (signal + 1);
  let ema = macdLine.slice(0, signal).reduce((s, d) => s + d.value, 0) / signal;
  signalLine.push({ time: macdLine[signal - 1].time, value: ema });
  for (let i = signal; i < macdLine.length; i++) {
    ema = macdLine[i].value * k + ema * (1 - k);
    signalLine.push({ time: macdLine[i].time, value: ema });
  }
  // Histogram
  const histogram: LineData[] = [];
  const sigOffset = signal - 1;
  for (let i = 0; i < signalLine.length; i++) {
    histogram.push({
      time: signalLine[i].time,
      value: macdLine[i + sigOffset].value - signalLine[i].value,
    });
  }
  return { macdLine, signalLine, histogram };
}

// Stochastic Oscillator
export function calcStochastic(data: CandleData[], kPeriod = 14, dPeriod = 3) {
  const kLine: LineData[] = [];
  for (let i = kPeriod - 1; i < data.length; i++) {
    let highest = -Infinity, lowest = Infinity;
    for (let j = 0; j < kPeriod; j++) {
      highest = Math.max(highest, data[i - j].high);
      lowest = Math.min(lowest, data[i - j].low);
    }
    const k = highest === lowest ? 50 : ((data[i].close - lowest) / (highest - lowest)) * 100;
    kLine.push({ time: data[i].time, value: k });
  }
  const dLine: LineData[] = [];
  for (let i = dPeriod - 1; i < kLine.length; i++) {
    let sum = 0;
    for (let j = 0; j < dPeriod; j++) sum += kLine[i - j].value;
    dLine.push({ time: kLine[i].time, value: sum / dPeriod });
  }
  return { kLine, dLine };
}

// Volume data generation
export function generateVolume(data: CandleData[]): { time: number; value: number; color: string }[] {
  return data.map((d) => ({
    time: d.time,
    value: Math.random() * 1000 + 200,
    color: d.close >= d.open ? "rgba(0, 194, 111, 0.4)" : "rgba(239, 68, 68, 0.4)",
  }));
}

// VWAP (Volume Weighted Average Price)
export function calcVWAP(data: CandleData[]): LineData[] {
  const result: LineData[] = [];
  let cumulativeTPV = 0;
  let cumulativeVolume = 0;
  for (let i = 0; i < data.length; i++) {
    const tp = (data[i].high + data[i].low + data[i].close) / 3;
    const vol = data[i].volume || Math.random() * 1000 + 200;
    cumulativeTPV += tp * vol;
    cumulativeVolume += vol;
    result.push({ time: data[i].time, value: cumulativeTPV / cumulativeVolume });
  }
  return result;
}

// ATR (Average True Range)
export function calcATR(data: CandleData[], period = 14): LineData[] {
  const trueRanges: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      trueRanges.push(data[i].high - data[i].low);
    } else {
      const tr = Math.max(
        data[i].high - data[i].low,
        Math.abs(data[i].high - data[i - 1].close),
        Math.abs(data[i].low - data[i - 1].close)
      );
      trueRanges.push(tr);
    }
  }
  const result: LineData[] = [];
  let atr = trueRanges.slice(0, period).reduce((s, v) => s + v, 0) / period;
  result.push({ time: data[period - 1].time, value: atr });
  for (let i = period; i < trueRanges.length; i++) {
    atr = (atr * (period - 1) + trueRanges[i]) / period;
    result.push({ time: data[i].time, value: atr });
  }
  return result;
}
