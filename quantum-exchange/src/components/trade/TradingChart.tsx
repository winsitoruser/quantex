"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Maximize2,
  Minimize2,
  BarChart3,
  CandlestickChart,
  LineChart,
  AreaChart,
  Activity,
  Minus,
  Crosshair,
  Trash2,
  ChevronDown,
  X,
} from "lucide-react";
import IndicatorPanel, {
  defaultIndicators,
  type IndicatorConfig,
} from "./IndicatorPanel";
import {
  calcSMA,
  calcEMA,
  calcBollingerBands,
  calcRSI,
  calcMACD,
  calcStochastic,
  calcVWAP,
  calcATR,
  generateVolume,
  type CandleData,
} from "@/utils/indicators";

interface TradingChartProps {
  symbol: string;
  basePrice: number;
}

type ChartType = "candlestick" | "line" | "area";

const timeframes = ["1m", "5m", "15m", "1H", "4H", "1D", "1W"];

function generateData(basePrice: number, count = 200): CandleData[] {
  const data: CandleData[] = [];
  let current = basePrice * 0.85;
  const now = Math.floor(Date.now() / 1000);
  for (let i = 0; i < count; i++) {
    const open = current;
    const volatility = current * 0.02;
    const close = open + (Math.random() - 0.45) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    data.push({
      time: now - (count - i) * 3600,
      open,
      high,
      low,
      close,
      volume: Math.random() * 1000 + 200,
    });
    current = close;
  }
  return data;
}

export default function TradingChart({ symbol, basePrice }: TradingChartProps) {
  const mainChartRef = useRef<HTMLDivElement>(null);
  const rsiChartRef = useRef<HTMLDivElement>(null);
  const macdChartRef = useRef<HTMLDivElement>(null);
  const stochChartRef = useRef<HTMLDivElement>(null);
  const atrChartRef = useRef<HTMLDivElement>(null);
  const indicatorBtnRef = useRef<HTMLButtonElement>(null);
  const chartTypeBtnRef = useRef<HTMLButtonElement>(null);

  const [activeTimeframe, setActiveTimeframe] = useState("1H");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartType, setChartType] = useState<ChartType>("candlestick");
  const [showIndicatorPanel, setShowIndicatorPanel] = useState(false);
  const [showChartTypeMenu, setShowChartTypeMenu] = useState(false);
  const [indicators, setIndicators] = useState<IndicatorConfig[]>(defaultIndicators);
  const [drawingMode, setDrawingMode] = useState<string | null>(null);
  const [hLines, setHLines] = useState<number[]>([]);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
  const [chartTypePos, setChartTypePos] = useState({ top: 0, left: 0 });
  const [crosshairData, setCrosshairData] = useState<{
    time: string;
    open: string;
    high: string;
    low: string;
    close: string;
    change: string;
    changePercent: string;
  } | null>(null);

  const candleDataRef = useRef<CandleData[]>([]);
  const mainChartInstanceRef = useRef<any>(null);

  const toggleIndicator = useCallback((id: string) => {
    setIndicators((prev) =>
      prev.map((ind) => (ind.id === id ? { ...ind, enabled: !ind.enabled } : ind))
    );
  }, []);

  const updateParam = useCallback((id: string, param: string, value: number) => {
    setIndicators((prev) =>
      prev.map((ind) =>
        ind.id === id ? { ...ind, params: { ...ind.params, [param]: value } } : ind
      )
    );
  }, []);

  const isEnabled = useCallback(
    (id: string) => indicators.find((i) => i.id === id)?.enabled ?? false,
    [indicators]
  );

  const getParam = useCallback(
    (id: string, param: string) => indicators.find((i) => i.id === id)?.params[param] ?? 0,
    [indicators]
  );

  // Main chart + overlay indicators
  useEffect(() => {
    if (!mainChartRef.current) return;

    let cancelled = false;
    let chart: any = null;
    let resizeHandler: (() => void) | null = null;
    let resizeObserver: ResizeObserver | null = null;

    // Clear previous chart DOM content
    mainChartRef.current.innerHTML = "";

    const initChart = async () => {
      const lc = await import("lightweight-charts");
      if (cancelled || !mainChartRef.current) return;

      const data = generateData(basePrice);
      candleDataRef.current = data;

      chart = lc.createChart(mainChartRef.current, {
        layout: { background: { color: "transparent" }, textColor: "#6b7280", fontSize: 11 },
        grid: {
          vertLines: { color: "rgba(30, 35, 51, 0.06)" },
          horzLines: { color: "rgba(30, 35, 51, 0.06)" },
        },
        crosshair: {
          vertLine: { color: "#3b82f6", width: 1, style: 2, labelBackgroundColor: "#3b82f6" },
          horzLine: { color: "#3b82f6", width: 1, style: 2, labelBackgroundColor: "#3b82f6" },
        },
        rightPriceScale: {
          borderColor: "#1e2333",
          scaleMargins: { top: 0.05, bottom: isEnabled("volume") ? 0.25 : 0.05 },
        },
        timeScale: { borderColor: "#1e2333", timeVisible: true, secondsVisible: false },
        width: mainChartRef.current.clientWidth,
        height: mainChartRef.current.clientHeight,
      });
      mainChartInstanceRef.current = chart;

      // Main series
      if (chartType === "candlestick") {
        const series = chart.addSeries(lc.CandlestickSeries, {
          upColor: "#00c26f",
          downColor: "#ef4444",
          borderUpColor: "#00c26f",
          borderDownColor: "#ef4444",
          wickUpColor: "#00c26f",
          wickDownColor: "#ef4444",
        });
        series.setData(data.map((d) => ({ ...d, time: d.time as any })));
      } else if (chartType === "line") {
        const series = chart.addSeries(lc.LineSeries, {
          color: "#3b82f6",
          lineWidth: 2,
        });
        series.setData(data.map((d) => ({ time: d.time as any, value: d.close })));
      } else {
        const series = chart.addSeries(lc.AreaSeries, {
          topColor: "rgba(59, 130, 246, 0.3)",
          bottomColor: "rgba(59, 130, 246, 0.02)",
          lineColor: "#3b82f6",
          lineWidth: 2,
        });
        series.setData(data.map((d) => ({ time: d.time as any, value: d.close })));
      }

      // Volume
      if (isEnabled("volume")) {
        const volData = generateVolume(data);
        const volSeries = chart.addSeries(lc.HistogramSeries, {
          priceFormat: { type: "volume" },
          priceScaleId: "volume",
        });
        chart.priceScale("volume").applyOptions({
          scaleMargins: { top: 0.8, bottom: 0 },
        });
        volSeries.setData(volData.map((d) => ({ ...d, time: d.time as any })));
      }

      // SMA
      if (isEnabled("sma")) {
        const smaData = calcSMA(data, getParam("sma", "period") || 20);
        const smaSeries = chart.addSeries(lc.LineSeries, {
          color: "#f59e0b",
          lineWidth: 1,
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: false,
        });
        smaSeries.setData(smaData.map((d) => ({ ...d, time: d.time as any })));
      }

      // EMA
      if (isEnabled("ema")) {
        const emaData = calcEMA(data, getParam("ema", "period") || 21);
        const emaSeries = chart.addSeries(lc.LineSeries, {
          color: "#8b5cf6",
          lineWidth: 1,
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: false,
        });
        emaSeries.setData(emaData.map((d) => ({ ...d, time: d.time as any })));
      }

      // Bollinger Bands
      if (isEnabled("bb")) {
        const bb = calcBollingerBands(
          data,
          getParam("bb", "period") || 20,
          getParam("bb", "stdDev") || 2
        );
        const bbUpper = chart.addSeries(lc.LineSeries, {
          color: "rgba(6, 182, 212, 0.6)",
          lineWidth: 1,
          lineStyle: 2,
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: false,
        });
        bbUpper.setData(bb.upper.map((d) => ({ ...d, time: d.time as any })));

        const bbMiddle = chart.addSeries(lc.LineSeries, {
          color: "rgba(6, 182, 212, 0.4)",
          lineWidth: 1,
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: false,
        });
        bbMiddle.setData(bb.middle.map((d) => ({ ...d, time: d.time as any })));

        const bbLower = chart.addSeries(lc.LineSeries, {
          color: "rgba(6, 182, 212, 0.6)",
          lineWidth: 1,
          lineStyle: 2,
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: false,
        });
        bbLower.setData(bb.lower.map((d) => ({ ...d, time: d.time as any })));
      }

      // VWAP
      if (isEnabled("vwap")) {
        const vwapData = calcVWAP(data);
        const vwapSeries = chart.addSeries(lc.LineSeries, {
          color: "#ec4899",
          lineWidth: 1,
          lineStyle: 2,
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: false,
        });
        vwapSeries.setData(vwapData.map((d) => ({ ...d, time: d.time as any })));
      }

      // Horizontal lines
      if (chartType === "candlestick") {
        hLines.forEach((price) => {
          const series = chart.addSeries(lc.LineSeries, {
            color: "#fbbf24",
            lineWidth: 1,
            lineStyle: 1,
            priceLineVisible: false,
            lastValueVisible: true,
            crosshairMarkerVisible: false,
          });
          series.setData([
            { time: data[0].time as any, value: price },
            { time: data[data.length - 1].time as any, value: price },
          ]);
        });
      }

      chart.timeScale().fitContent();

      // Crosshair move handler
      chart.subscribeCrosshairMove((param: any) => {
        if (!param.time) {
          setCrosshairData(null);
          return;
        }
        const d = data.find((c) => c.time === param.time);
        if (d) {
          const change = d.close - d.open;
          const changePercent = (change / d.open) * 100;
          setCrosshairData({
            time: new Date(d.time * 1000).toLocaleString(),
            open: d.open.toFixed(2),
            high: d.high.toFixed(2),
            low: d.low.toFixed(2),
            close: d.close.toFixed(2),
            change: change.toFixed(2),
            changePercent: changePercent.toFixed(2),
          });
        }
      });

      // Click handler for drawing tools
      if (drawingMode === "hline") {
        chart.subscribeClick((param: any) => {
          if (param.point) {
            const price = chart.priceScale("right")
              ? param.sourceEvent?.clientY
              : null;
            // Use the series coordinate to get price
            const coordPrice = param.seriesData?.values().next()?.value;
            if (coordPrice) {
              const p = typeof coordPrice === "object" ? coordPrice.close || coordPrice.value : coordPrice;
              if (p) {
                setHLines((prev) => [...prev, p]);
                setDrawingMode(null);
              }
            }
          }
        });
      }

      resizeHandler = () => {
        if (mainChartRef.current && chart) {
          chart.applyOptions({
            width: mainChartRef.current.clientWidth,
            height: mainChartRef.current.clientHeight,
          });
        }
      };
      window.addEventListener("resize", resizeHandler);

      // ResizeObserver for container size changes (e.g. bottom panel drag)
      if (mainChartRef.current) {
        resizeObserver = new ResizeObserver(() => {
          if (mainChartRef.current && chart) {
            chart.applyOptions({
              width: mainChartRef.current.clientWidth,
              height: mainChartRef.current.clientHeight,
            });
          }
        });
        resizeObserver.observe(mainChartRef.current);
      }
    };

    initChart();
    return () => {
      cancelled = true;
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      if (resizeObserver) resizeObserver.disconnect();
      if (chart) { try { chart.remove(); } catch {} }
      mainChartInstanceRef.current = null;
    };
  }, [basePrice, activeTimeframe, chartType, indicators, hLines, drawingMode]);

  // RSI sub-chart
  useEffect(() => {
    if (!isEnabled("rsi") || !rsiChartRef.current || candleDataRef.current.length === 0) return;
    let cancelled = false;
    let chart: any = null;
    let resizeHandler: (() => void) | null = null;
    rsiChartRef.current.innerHTML = "";
    const init = async () => {
      const lc = await import("lightweight-charts");
      if (cancelled || !rsiChartRef.current) return;
      chart = lc.createChart(rsiChartRef.current, {
        layout: { background: { color: "transparent" }, textColor: "#6b7280", fontSize: 10 },
        grid: {
          vertLines: { color: "rgba(30, 35, 51, 0.06)" },
          horzLines: { color: "rgba(30, 35, 51, 0.06)" },
        },
        rightPriceScale: {
          borderColor: "#1e2333",
          scaleMargins: { top: 0.1, bottom: 0.1 },
        },
        timeScale: { visible: false },
        crosshair: {
          vertLine: { visible: false },
          horzLine: { color: "#f97316", width: 1, style: 2, labelBackgroundColor: "#f97316" },
        },
        width: rsiChartRef.current.clientWidth,
        height: rsiChartRef.current.clientHeight,
      });
      const data = candleDataRef.current;
      const rsiData = calcRSI(data, getParam("rsi", "period") || 14);
      const rsiSeries = chart.addSeries(lc.LineSeries, {
        color: "#f97316",
        lineWidth: 1.5,
        priceLineVisible: false,
        lastValueVisible: true,
      });
      rsiSeries.setData(rsiData.map((d) => ({ ...d, time: d.time as any })));

      // Overbought / Oversold lines
      const ob = chart.addSeries(lc.LineSeries, {
        color: "rgba(239, 68, 68, 0.3)",
        lineWidth: 1,
        lineStyle: 2,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      });
      ob.setData([
        { time: data[0].time as any, value: 70 },
        { time: data[data.length - 1].time as any, value: 70 },
      ]);
      const os = chart.addSeries(lc.LineSeries, {
        color: "rgba(0, 194, 111, 0.3)",
        lineWidth: 1,
        lineStyle: 2,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      });
      os.setData([
        { time: data[0].time as any, value: 30 },
        { time: data[data.length - 1].time as any, value: 30 },
      ]);

      chart.timeScale().fitContent();
      resizeHandler = () => {
        if (rsiChartRef.current && chart)
          chart.applyOptions({ width: rsiChartRef.current.clientWidth, height: rsiChartRef.current.clientHeight });
      };
      window.addEventListener("resize", resizeHandler);
    };
    init();
    return () => {
      cancelled = true;
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      if (chart) { try { chart.remove(); } catch {} }
    };
  }, [indicators, basePrice, activeTimeframe]);

  // MACD sub-chart
  useEffect(() => {
    if (!isEnabled("macd") || !macdChartRef.current || candleDataRef.current.length === 0) return;
    let cancelled = false;
    let chart: any = null;
    let resizeHandler: (() => void) | null = null;
    macdChartRef.current.innerHTML = "";
    const init = async () => {
      const lc = await import("lightweight-charts");
      if (cancelled || !macdChartRef.current) return;
      chart = lc.createChart(macdChartRef.current, {
        layout: { background: { color: "transparent" }, textColor: "#6b7280", fontSize: 10 },
        grid: {
          vertLines: { color: "rgba(30, 35, 51, 0.06)" },
          horzLines: { color: "rgba(30, 35, 51, 0.06)" },
        },
        rightPriceScale: { borderColor: "#1e2333", scaleMargins: { top: 0.1, bottom: 0.1 } },
        timeScale: { visible: false },
        crosshair: {
          vertLine: { visible: false },
          horzLine: { color: "#3b82f6", width: 1, style: 2, labelBackgroundColor: "#3b82f6" },
        },
        width: macdChartRef.current.clientWidth,
        height: macdChartRef.current.clientHeight,
      });
      const data = candleDataRef.current;
      const macd = calcMACD(
        data,
        getParam("macd", "fast") || 12,
        getParam("macd", "slow") || 26,
        getParam("macd", "signal") || 9
      );

      const macdSeries = chart.addSeries(lc.LineSeries, {
        color: "#3b82f6",
        lineWidth: 1.5,
        priceLineVisible: false,
        lastValueVisible: true,
      });
      macdSeries.setData(macd.macdLine.map((d) => ({ ...d, time: d.time as any })));

      const signalSeries = chart.addSeries(lc.LineSeries, {
        color: "#f97316",
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      });
      signalSeries.setData(macd.signalLine.map((d) => ({ ...d, time: d.time as any })));

      const histSeries = chart.addSeries(lc.HistogramSeries, {
        priceLineVisible: false,
        lastValueVisible: false,
      });
      histSeries.setData(
        macd.histogram.map((d) => ({
          time: d.time as any,
          value: d.value,
          color: d.value >= 0 ? "rgba(0, 194, 111, 0.5)" : "rgba(239, 68, 68, 0.5)",
        }))
      );

      chart.timeScale().fitContent();
      resizeHandler = () => {
        if (macdChartRef.current && chart)
          chart.applyOptions({ width: macdChartRef.current.clientWidth, height: macdChartRef.current.clientHeight });
      };
      window.addEventListener("resize", resizeHandler);
    };
    init();
    return () => {
      cancelled = true;
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      if (chart) { try { chart.remove(); } catch {} }
    };
  }, [indicators, basePrice, activeTimeframe]);

  // Stochastic sub-chart
  useEffect(() => {
    if (!isEnabled("stochastic") || !stochChartRef.current || candleDataRef.current.length === 0) return;
    let cancelled = false;
    let chart: any = null;
    let resizeHandler: (() => void) | null = null;
    stochChartRef.current.innerHTML = "";
    const init = async () => {
      const lc = await import("lightweight-charts");
      if (cancelled || !stochChartRef.current) return;
      chart = lc.createChart(stochChartRef.current, {
        layout: { background: { color: "transparent" }, textColor: "#6b7280", fontSize: 10 },
        grid: {
          vertLines: { color: "rgba(30, 35, 51, 0.06)" },
          horzLines: { color: "rgba(30, 35, 51, 0.06)" },
        },
        rightPriceScale: { borderColor: "#1e2333", scaleMargins: { top: 0.1, bottom: 0.1 } },
        timeScale: { visible: false },
        crosshair: {
          vertLine: { visible: false },
          horzLine: { color: "#10b981", width: 1, style: 2, labelBackgroundColor: "#10b981" },
        },
        width: stochChartRef.current.clientWidth,
        height: stochChartRef.current.clientHeight,
      });
      const data = candleDataRef.current;
      const stoch = calcStochastic(data, getParam("stochastic", "kPeriod") || 14, getParam("stochastic", "dPeriod") || 3);

      const kSeries = chart.addSeries(lc.LineSeries, {
        color: "#10b981",
        lineWidth: 1.5,
        priceLineVisible: false,
        lastValueVisible: true,
      });
      kSeries.setData(stoch.kLine.map((d) => ({ ...d, time: d.time as any })));

      const dSeries = chart.addSeries(lc.LineSeries, {
        color: "#f59e0b",
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      });
      dSeries.setData(stoch.dLine.map((d) => ({ ...d, time: d.time as any })));

      // 80/20 lines
      [80, 20].forEach((val) => {
        const s = chart.addSeries(lc.LineSeries, {
          color: val === 80 ? "rgba(239, 68, 68, 0.3)" : "rgba(0, 194, 111, 0.3)",
          lineWidth: 1,
          lineStyle: 2,
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: false,
        });
        s.setData([
          { time: data[0].time as any, value: val },
          { time: data[data.length - 1].time as any, value: val },
        ]);
      });

      chart.timeScale().fitContent();
      resizeHandler = () => {
        if (stochChartRef.current && chart)
          chart.applyOptions({ width: stochChartRef.current.clientWidth, height: stochChartRef.current.clientHeight });
      };
      window.addEventListener("resize", resizeHandler);
    };
    init();
    return () => {
      cancelled = true;
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      if (chart) { try { chart.remove(); } catch {} }
    };
  }, [indicators, basePrice, activeTimeframe]);

  // ATR sub-chart
  useEffect(() => {
    if (!isEnabled("atr") || !atrChartRef.current || candleDataRef.current.length === 0) return;
    let cancelled = false;
    let chart: any = null;
    let resizeHandler: (() => void) | null = null;
    atrChartRef.current.innerHTML = "";
    const init = async () => {
      const lc = await import("lightweight-charts");
      if (cancelled || !atrChartRef.current) return;
      chart = lc.createChart(atrChartRef.current, {
        layout: { background: { color: "transparent" }, textColor: "#6b7280", fontSize: 10 },
        grid: {
          vertLines: { color: "rgba(30, 35, 51, 0.06)" },
          horzLines: { color: "rgba(30, 35, 51, 0.06)" },
        },
        rightPriceScale: { borderColor: "#1e2333", scaleMargins: { top: 0.1, bottom: 0.1 } },
        timeScale: { visible: false },
        crosshair: {
          vertLine: { visible: false },
          horzLine: { color: "#a855f7", width: 1, style: 2, labelBackgroundColor: "#a855f7" },
        },
        width: atrChartRef.current.clientWidth,
        height: atrChartRef.current.clientHeight,
      });
      const data = candleDataRef.current;
      const atrData = calcATR(data, getParam("atr", "period") || 14);
      const atrSeries = chart.addSeries(lc.AreaSeries, {
        topColor: "rgba(168, 85, 247, 0.2)",
        bottomColor: "rgba(168, 85, 247, 0.02)",
        lineColor: "#a855f7",
        lineWidth: 1.5,
        priceLineVisible: false,
        lastValueVisible: true,
      });
      atrSeries.setData(atrData.map((d) => ({ ...d, time: d.time as any })));

      chart.timeScale().fitContent();
      resizeHandler = () => {
        if (atrChartRef.current && chart)
          chart.applyOptions({ width: atrChartRef.current.clientWidth, height: atrChartRef.current.clientHeight });
      };
      window.addEventListener("resize", resizeHandler);
    };
    init();
    return () => {
      cancelled = true;
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      if (chart) { try { chart.remove(); } catch {} }
    };
  }, [indicators, basePrice, activeTimeframe]);

  const activeOverlays = indicators.filter((i) => i.enabled && i.category === "overlay");
  const activeOscillators = indicators.filter((i) => i.enabled && i.category === "oscillator");

  const chartTypes: { type: ChartType; icon: React.ReactNode; label: string }[] = [
    { type: "candlestick", icon: <CandlestickChart className="h-3.5 w-3.5" />, label: "Candlestick" },
    { type: "line", icon: <LineChart className="h-3.5 w-3.5" />, label: "Line" },
    { type: "area", icon: <AreaChart className="h-3.5 w-3.5" />, label: "Area" },
  ];

  const drawingTools = [
    { id: "hline", icon: <Minus className="h-3.5 w-3.5" />, label: "Horizontal Line" },
    { id: "crosshair", icon: <Crosshair className="h-3.5 w-3.5" />, label: "Crosshair" },
  ];

  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50 bg-background" : ""
      }`}
    >
      {/* Chart Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
        {/* Left: Timeframes */}
        <div className="flex items-center gap-0.5">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                activeTimeframe === tf
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tf}
            </button>
          ))}

          <div className="w-px h-4 bg-border mx-1.5" />

          {/* Chart Type Button */}
          <button
            ref={chartTypeBtnRef}
            onClick={() => {
              if (!showChartTypeMenu && chartTypeBtnRef.current) {
                const rect = chartTypeBtnRef.current.getBoundingClientRect();
                setChartTypePos({ top: rect.bottom + 4, left: rect.left });
              }
              setShowChartTypeMenu(!showChartTypeMenu);
              setShowIndicatorPanel(false);
            }}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded text-muted hover:text-foreground hover:bg-card transition-colors"
          >
            {chartTypes.find((c) => c.type === chartType)?.icon}
            <ChevronDown className="h-3 w-3" />
          </button>

          <div className="w-px h-4 bg-border mx-1.5" />

          {/* Indicators Button */}
          <button
            ref={indicatorBtnRef}
            onClick={() => {
              if (!showIndicatorPanel && indicatorBtnRef.current) {
                const rect = indicatorBtnRef.current.getBoundingClientRect();
                setPanelPos({ top: rect.bottom + 4, left: rect.left });
              }
              setShowIndicatorPanel(!showIndicatorPanel);
              setShowChartTypeMenu(false);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
              showIndicatorPanel || indicators.some((i) => i.enabled)
                ? "bg-accent/10 text-accent"
                : "text-muted hover:text-foreground hover:bg-card"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Indicators</span>
            {indicators.filter((i) => i.enabled).length > 0 && (
              <span className="bg-accent text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold leading-none">
                {indicators.filter((i) => i.enabled).length}
              </span>
            )}
          </button>

          <div className="w-px h-4 bg-border mx-1.5" />

          {/* Drawing Tools */}
          {drawingTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setDrawingMode(drawingMode === tool.id ? null : tool.id)}
              title={tool.label}
              className={`h-7 w-7 flex items-center justify-center rounded transition-colors ${
                drawingMode === tool.id
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:text-foreground hover:bg-card"
              }`}
            >
              {tool.icon}
            </button>
          ))}

          {hLines.length > 0 && (
            <button
              onClick={() => setHLines([])}
              title="Clear drawings"
              className="h-7 w-7 flex items-center justify-center rounded text-muted hover:text-red-400 hover:bg-card transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Right: Fullscreen */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-7 w-7 flex items-center justify-center rounded text-muted hover:text-foreground hover:bg-card transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Fixed Chart Type Dropdown */}
      {showChartTypeMenu && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setShowChartTypeMenu(false)} />
          <div
            className="fixed z-[101] bg-elevated border border-border rounded-lg shadow-2xl overflow-hidden"
            style={{ top: chartTypePos.top, left: chartTypePos.left }}
          >
            {chartTypes.map((ct) => (
              <button
                key={ct.type}
                onClick={() => {
                  setChartType(ct.type);
                  setShowChartTypeMenu(false);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-xs transition-colors ${
                  chartType === ct.type
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:text-foreground hover:bg-card"
                }`}
              >
                {ct.icon}
                {ct.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Fixed Indicator Panel */}
      {showIndicatorPanel && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setShowIndicatorPanel(false)} />
          <div
            className="fixed z-[101]"
            style={{ top: panelPos.top, left: panelPos.left }}
            onClick={(e) => e.stopPropagation()}
          >
            <IndicatorPanel
              indicators={indicators}
              onToggle={toggleIndicator}
              onParamChange={updateParam}
              onClose={() => setShowIndicatorPanel(false)}
            />
          </div>
        </>
      )}

      {/* OHLC Data Bar */}
      {crosshairData && (
        <div className="flex items-center gap-3 px-3 py-1 text-[10px] border-b border-border/50 bg-card/30">
          <span className="text-muted">{crosshairData.time}</span>
          <span className="text-muted">
            O <span className="text-foreground font-medium">{crosshairData.open}</span>
          </span>
          <span className="text-muted">
            H <span className="text-foreground font-medium">{crosshairData.high}</span>
          </span>
          <span className="text-muted">
            L <span className="text-foreground font-medium">{crosshairData.low}</span>
          </span>
          <span className="text-muted">
            C <span className="text-foreground font-medium">{crosshairData.close}</span>
          </span>
          <span
            className={
              parseFloat(crosshairData.change) >= 0 ? "text-green-400" : "text-red-400"
            }
          >
            {parseFloat(crosshairData.change) >= 0 ? "+" : ""}
            {crosshairData.change} ({crosshairData.changePercent}%)
          </span>
        </div>
      )}

      {/* Active Overlay Tags */}
      {activeOverlays.length > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1 border-b border-border/30">
          {activeOverlays.map((ind) => (
            <span
              key={ind.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium"
              style={{
                backgroundColor: ind.color + "15",
                color: ind.color,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: ind.color }}
              />
              {ind.shortName}
              {ind.params.period ? `(${ind.params.period})` : ""}
              <button
                onClick={() => toggleIndicator(ind.id)}
                className="ml-0.5 hover:opacity-70"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Main Chart */}
      <div
        ref={mainChartRef}
        className={`min-h-[100px] ${
          activeOscillators.length > 0 ? "flex-[3]" : "flex-1"
        }`}
      />

      {/* RSI Sub-chart */}
      {isEnabled("rsi") && (
        <div className="border-t border-border">
          <div className="flex items-center justify-between px-3 py-0.5 bg-card/20">
            <span className="text-[10px] font-medium text-[#f97316]">
              RSI ({getParam("rsi", "period") || 14})
            </span>
            <button
              onClick={() => toggleIndicator("rsi")}
              className="text-muted hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <div ref={rsiChartRef} className="h-[100px]" />
        </div>
      )}

      {/* MACD Sub-chart */}
      {isEnabled("macd") && (
        <div className="border-t border-border">
          <div className="flex items-center justify-between px-3 py-0.5 bg-card/20">
            <span className="text-[10px] font-medium text-[#3b82f6]">
              MACD ({getParam("macd", "fast") || 12},{getParam("macd", "slow") || 26},
              {getParam("macd", "signal") || 9})
            </span>
            <button
              onClick={() => toggleIndicator("macd")}
              className="text-muted hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <div ref={macdChartRef} className="h-[100px]" />
        </div>
      )}

      {/* Stochastic Sub-chart */}
      {isEnabled("stochastic") && (
        <div className="border-t border-border">
          <div className="flex items-center justify-between px-3 py-0.5 bg-card/20">
            <span className="text-[10px] font-medium text-[#10b981]">
              STOCH ({getParam("stochastic", "kPeriod") || 14},{getParam("stochastic", "dPeriod") || 3})
            </span>
            <button
              onClick={() => toggleIndicator("stochastic")}
              className="text-muted hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <div ref={stochChartRef} className="h-[100px]" />
        </div>
      )}

      {/* ATR Sub-chart */}
      {isEnabled("atr") && (
        <div className="border-t border-border">
          <div className="flex items-center justify-between px-3 py-0.5 bg-card/20">
            <span className="text-[10px] font-medium text-[#a855f7]">
              ATR ({getParam("atr", "period") || 14})
            </span>
            <button
              onClick={() => toggleIndicator("atr")}
              className="text-muted hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <div ref={atrChartRef} className="h-[100px]" />
        </div>
      )}
    </div>
  );
}
