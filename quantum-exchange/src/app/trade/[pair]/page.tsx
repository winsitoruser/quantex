"use client";

import { use, useMemo, useState, useCallback, useRef, useEffect } from "react";
import { cryptoPairs } from "@/data/mockData";
import TradingChart from "@/components/trade/TradingChart";
import OrderBook from "@/components/trade/OrderBook";
import TradeHistory from "@/components/trade/TradeHistory";
import OrderForm from "@/components/trade/OrderForm";
import PairInfo from "@/components/trade/PairInfo";
import TradingBotPanel from "@/components/trade/TradingBotPanel";
import SentimentGauge from "@/components/trade/SentimentGauge";
import TradeChatbox from "@/components/trade/TradeChatbox";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, PanelBottomOpen, PanelBottomClose, X } from "lucide-react";

const MIN_PANEL_H = 34;
const DEFAULT_PANEL_H = 180;
const EXPANDED_PANEL_H = 350;
const MAX_PANEL_H = 550;

// Mock data for bottom tabs
const mockOpenOrders = [
  { id: 1, time: "2026-03-06 00:12:05", pair: "BTC/USDT", type: "Limit", side: "Buy", price: "66,500.00", amount: "0.0500", filled: "0%", total: "3,325.00", trigger: "—" },
  { id: 2, time: "2026-03-05 23:58:30", pair: "BTC/USDT", type: "Stop-Limit", side: "Sell", price: "65,000.00", amount: "0.1000", filled: "0%", total: "6,500.00", trigger: "≤ 65,200" },
  { id: 3, time: "2026-03-05 23:40:18", pair: "BTC/USDT", type: "Limit", side: "Buy", price: "66,000.00", amount: "0.0300", filled: "0%", total: "1,980.00", trigger: "—" },
];

const mockOrderHistory = [
  { id: 1, time: "2026-03-05 23:45:12", pair: "BTC/USDT", type: "Limit", side: "Buy", price: "67,234.50", amount: "0.0150", filled: "100%", total: "1,008.52", status: "Filled" },
  { id: 2, time: "2026-03-05 22:30:05", pair: "BTC/USDT", type: "Market", side: "Sell", price: "67,180.00", amount: "0.0200", filled: "100%", total: "1,343.60", status: "Filled" },
  { id: 3, time: "2026-03-05 21:15:33", pair: "BTC/USDT", type: "Limit", side: "Buy", price: "66,900.00", amount: "0.0500", filled: "60%", total: "2,007.00", status: "Cancelled" },
  { id: 4, time: "2026-03-05 20:00:18", pair: "BTC/USDT", type: "Stop-Limit", side: "Sell", price: "66,500.00", amount: "0.1000", filled: "100%", total: "6,650.00", status: "Filled" },
  { id: 5, time: "2026-03-05 18:45:22", pair: "BTC/USDT", type: "Limit", side: "Buy", price: "66,800.00", amount: "0.0300", filled: "100%", total: "2,004.00", status: "Filled" },
  { id: 6, time: "2026-03-05 17:30:45", pair: "BTC/USDT", type: "Market", side: "Buy", price: "67,050.00", amount: "0.0250", filled: "100%", total: "1,676.25", status: "Filled" },
  { id: 7, time: "2026-03-05 16:20:10", pair: "BTC/USDT", type: "Limit", side: "Sell", price: "67,400.00", amount: "0.0180", filled: "100%", total: "1,213.20", status: "Filled" },
  { id: 8, time: "2026-03-05 15:10:55", pair: "BTC/USDT", type: "Limit", side: "Buy", price: "66,750.00", amount: "0.0420", filled: "80%", total: "2,243.40", status: "Cancelled" },
  { id: 9, time: "2026-03-05 14:05:42", pair: "BTC/USDT", type: "Market", side: "Sell", price: "66,920.00", amount: "0.0120", filled: "100%", total: "803.04", status: "Filled" },
  { id: 10, time: "2026-03-05 13:22:10", pair: "BTC/USDT", type: "Limit", side: "Buy", price: "66,600.00", amount: "0.0800", filled: "100%", total: "5,328.00", status: "Filled" },
];

const mockTradeHistory = [
  { id: 1, time: "23:45:12", price: "67,234.50", amount: "0.0150", fee: "1.01", total: "1,008.52", role: "Taker", side: "Buy" },
  { id: 2, time: "22:30:05", price: "67,180.00", amount: "0.0200", fee: "1.34", total: "1,343.60", role: "Maker", side: "Sell" },
  { id: 3, time: "21:15:33", price: "66,900.00", amount: "0.0300", fee: "2.01", total: "2,007.00", role: "Taker", side: "Buy" },
  { id: 4, time: "20:00:18", price: "66,500.00", amount: "0.1000", fee: "6.65", total: "6,650.00", role: "Taker", side: "Sell" },
  { id: 5, time: "18:45:22", price: "66,800.00", amount: "0.0300", fee: "2.00", total: "2,004.00", role: "Maker", side: "Buy" },
  { id: 6, time: "17:30:45", price: "67,050.00", amount: "0.0250", fee: "1.68", total: "1,676.25", role: "Taker", side: "Buy" },
  { id: 7, time: "16:20:10", price: "67,400.00", amount: "0.0180", fee: "1.21", total: "1,213.20", role: "Maker", side: "Sell" },
  { id: 8, time: "15:10:55", price: "66,750.00", amount: "0.0336", fee: "2.25", total: "2,242.80", role: "Taker", side: "Buy" },
];

const mockAssets = [
  { coin: "BTC", name: "Bitcoin", available: "0.5432", inOrder: "0.0800", total: "0.6232", btcValue: "0.6232", usdValue: "$41,893.21" },
  { coin: "USDT", name: "Tether", available: "12,450.00", inOrder: "11,805.00", total: "24,255.00", btcValue: "0.3611", usdValue: "$24,255.00" },
  { coin: "ETH", name: "Ethereum", available: "3.2100", inOrder: "0.0000", total: "3.2100", btcValue: "0.1680", usdValue: "$11,235.00" },
  { coin: "BNB", name: "BNB", available: "15.500", inOrder: "2.000", total: "17.500", btcValue: "0.0782", usdValue: "$5,250.00" },
  { coin: "SOL", name: "Solana", available: "45.200", inOrder: "0.000", total: "45.200", btcValue: "0.1023", usdValue: "$6,870.40" },
];

const bottomTabs = [
  { key: "open", label: "Open Orders", count: mockOpenOrders.length },
  { key: "history", label: "Order History" },
  { key: "trades", label: "Trade History" },
  { key: "assets", label: "Assets" },
];

export default function TradePage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair: pairSlug } = use(params);
  const [activeBottomTab, setActiveBottomTab] = useState("open");
  const [showBot, setShowBot] = useState(false);
  const [showSentiment, setShowSentiment] = useState(true);
  const [panelHeight, setPanelHeight] = useState(DEFAULT_PANEL_H);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartH = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const isCollapsed = panelHeight <= MIN_PANEL_H;

  // Mouse drag-to-resize
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    dragStartY.current = e.clientY;
    dragStartH.current = panelHeight;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, [panelHeight]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = dragStartY.current - e.clientY;
      const newH = Math.min(MAX_PANEL_H, Math.max(MIN_PANEL_H, dragStartH.current + delta));
      setPanelHeight(newH);
    };
    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      // Snap to collapsed if near minimum
      setPanelHeight((h) => (h < MIN_PANEL_H + 20 ? MIN_PANEL_H : h));
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const toggleExpand = useCallback(() => {
    setPanelHeight((h) => (h >= EXPANDED_PANEL_H ? DEFAULT_PANEL_H : EXPANDED_PANEL_H));
  }, []);

  const toggleCollapse = useCallback(() => {
    setPanelHeight((h) => (h <= MIN_PANEL_H ? DEFAULT_PANEL_H : MIN_PANEL_H));
  }, []);

  const pair = useMemo(
    () => cryptoPairs.find((p) => p.id === pairSlug) || cryptoPairs[0],
    [pairSlug]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <PairInfo pair={pair} />

      <div className="flex-1 min-h-0 flex">
        {/* Left: Chart + Bottom Panel */}
        <div className="flex-1 min-w-0 flex flex-col border-r border-border overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden">
            <TradingChart symbol={pair.symbol} basePrice={pair.price} />
          </div>
          {/* Resizable Bottom Panel */}
          <div
            ref={containerRef}
            className="border-t border-border flex flex-col shrink-0"
            style={{ height: panelHeight, transition: isDragging.current ? 'none' : 'height 0.2s ease' }}
          >
            {/* Drag Handle + Tab Bar */}
            <div className="shrink-0">
              {/* Drag Handle */}
              <div
                className="flex items-center justify-center h-[5px] cursor-row-resize group relative select-none"
                onMouseDown={handleMouseDown}
                onDoubleClick={toggleExpand}
              >
                <div className="absolute inset-x-0 -top-2 bottom-0" />
                <div className="w-10 h-[3px] rounded-full bg-border/60 group-hover:bg-accent group-hover:h-[4px] group-active:bg-accent transition-all" />
              </div>

              {/* Tab Bar */}
              <div className="flex items-center border-b border-border pl-1 pr-2 h-[29px]">
                <div className="flex items-center flex-1 min-w-0">
                  {bottomTabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveBottomTab(tab.key);
                        if (isCollapsed) setPanelHeight(DEFAULT_PANEL_H);
                      }}
                      className={cn(
                        "px-2.5 h-[29px] text-[11px] font-medium transition-colors relative whitespace-nowrap",
                        activeBottomTab === tab.key
                          ? "text-foreground"
                          : "text-muted hover:text-foreground"
                      )}
                    >
                      <span className="flex items-center gap-1">
                        {tab.label}
                        {tab.count !== undefined && (
                          <span className={cn(
                            "text-[9px] px-1 py-px rounded-sm font-bold",
                            tab.count > 0 ? "bg-accent/15 text-accent" : "bg-border/50 text-muted/60"
                          )}>
                            {tab.count}
                          </span>
                        )}
                      </span>
                      {activeBottomTab === tab.key && (
                        <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-accent rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Panel Controls */}
                <div className="flex items-center gap-0.5 ml-1 shrink-0">
                  <button
                    onClick={toggleExpand}
                    className="p-1 rounded text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                    title={panelHeight >= EXPANDED_PANEL_H ? "Restore panel" : "Expand panel"}
                  >
                    {panelHeight >= EXPANDED_PANEL_H
                      ? <PanelBottomClose className="h-3.5 w-3.5" />
                      : <PanelBottomOpen className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={toggleCollapse}
                    className="p-1 rounded text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                    title={isCollapsed ? "Show panel" : "Hide panel"}
                  >
                    {isCollapsed
                      ? <ChevronUp className="h-3.5 w-3.5" />
                      : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {!isCollapsed && (
              <div className="flex-1 overflow-auto min-h-0">
                {/* Open Orders */}
                {activeBottomTab === "open" && (
                  <table className="w-full text-[11px]">
                    <thead className="sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                      <tr className="text-muted">
                        <th className="text-left px-3 py-1.5 font-medium">Time</th>
                        <th className="text-left px-3 py-1.5 font-medium">Pair</th>
                        <th className="text-left px-3 py-1.5 font-medium">Type</th>
                        <th className="text-left px-3 py-1.5 font-medium">Side</th>
                        <th className="text-right px-3 py-1.5 font-medium">Price (USDT)</th>
                        <th className="text-right px-3 py-1.5 font-medium">Amount (BTC)</th>
                        <th className="text-right px-3 py-1.5 font-medium">Filled</th>
                        <th className="text-right px-3 py-1.5 font-medium">Total (USDT)</th>
                        <th className="text-right px-3 py-1.5 font-medium">Trigger</th>
                        <th className="text-center px-3 py-1.5 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {mockOpenOrders.map((o) => (
                        <tr key={o.id} className="border-t border-border/30 hover:bg-card-hover/40 transition-colors">
                          <td className="px-3 py-[5px] text-muted">{o.time.split(" ")[1]}</td>
                          <td className="px-3 py-[5px] text-foreground font-sans font-medium">{o.pair}</td>
                          <td className="px-3 py-[5px] text-muted font-sans">{o.type}</td>
                          <td className={cn("px-3 py-[5px] font-sans font-medium", o.side === "Buy" ? "text-green" : "text-red")}>{o.side}</td>
                          <td className="px-3 py-[5px] text-right text-foreground">{o.price}</td>
                          <td className="px-3 py-[5px] text-right text-foreground">{o.amount}</td>
                          <td className="px-3 py-[5px] text-right">
                            <span className="text-muted">{o.filled}</span>
                          </td>
                          <td className="px-3 py-[5px] text-right text-foreground">{o.total}</td>
                          <td className="px-3 py-[5px] text-right text-muted font-sans">{o.trigger}</td>
                          <td className="px-3 py-[5px] text-center">
                            <button className="text-red/80 hover:text-red transition-colors font-sans">
                              <X className="h-3 w-3 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Order History */}
                {activeBottomTab === "history" && (
                  <table className="w-full text-[11px]">
                    <thead className="sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                      <tr className="text-muted">
                        <th className="text-left px-3 py-1.5 font-medium">Time</th>
                        <th className="text-left px-3 py-1.5 font-medium">Pair</th>
                        <th className="text-left px-3 py-1.5 font-medium">Type</th>
                        <th className="text-left px-3 py-1.5 font-medium">Side</th>
                        <th className="text-right px-3 py-1.5 font-medium">Price (USDT)</th>
                        <th className="text-right px-3 py-1.5 font-medium">Amount (BTC)</th>
                        <th className="text-right px-3 py-1.5 font-medium">Filled</th>
                        <th className="text-right px-3 py-1.5 font-medium">Total (USDT)</th>
                        <th className="text-right px-3 py-1.5 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {mockOrderHistory.map((order, i) => (
                        <tr key={order.id} className={cn(
                          "border-t border-border/30 hover:bg-card-hover/40 transition-colors",
                          i % 2 === 1 && "bg-card-hover/20"
                        )}>
                          <td className="px-3 py-[5px] text-muted">{order.time.split(" ")[1]}</td>
                          <td className="px-3 py-[5px] text-foreground font-sans font-medium">{order.pair}</td>
                          <td className="px-3 py-[5px] text-muted font-sans">{order.type}</td>
                          <td className={cn("px-3 py-[5px] font-sans font-medium", order.side === "Buy" ? "text-green" : "text-red")}>{order.side}</td>
                          <td className="px-3 py-[5px] text-right text-foreground">{order.price}</td>
                          <td className="px-3 py-[5px] text-right text-foreground">{order.amount}</td>
                          <td className="px-3 py-[5px] text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <div className="w-10 h-[3px] rounded-full bg-border/50 overflow-hidden">
                                <div
                                  className={cn("h-full rounded-full", order.status === "Filled" ? "bg-green" : "bg-yellow-500")}
                                  style={{ width: order.filled }}
                                />
                              </div>
                              <span className="text-muted">{order.filled}</span>
                            </div>
                          </td>
                          <td className="px-3 py-[5px] text-right text-foreground">{order.total}</td>
                          <td className="px-3 py-[5px] text-right">
                            <span className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-sans font-medium",
                              order.status === "Filled" ? "bg-green/10 text-green" : "bg-yellow-500/10 text-yellow-500"
                            )}>{order.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Trade History */}
                {activeBottomTab === "trades" && (
                  <table className="w-full text-[11px]">
                    <thead className="sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                      <tr className="text-muted">
                        <th className="text-left px-3 py-1.5 font-medium">Time</th>
                        <th className="text-right px-3 py-1.5 font-medium">Price (USDT)</th>
                        <th className="text-right px-3 py-1.5 font-medium">Amount (BTC)</th>
                        <th className="text-right px-3 py-1.5 font-medium">Fee (USDT)</th>
                        <th className="text-right px-3 py-1.5 font-medium">Total (USDT)</th>
                        <th className="text-center px-3 py-1.5 font-medium">Role</th>
                        <th className="text-right px-3 py-1.5 font-medium">Side</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {mockTradeHistory.map((trade, i) => (
                        <tr key={trade.id} className={cn(
                          "border-t border-border/30 hover:bg-card-hover/40 transition-colors",
                          i % 2 === 1 && "bg-card-hover/20"
                        )}>
                          <td className="px-3 py-[5px] text-muted">{trade.time}</td>
                          <td className="px-3 py-[5px] text-right text-foreground">{trade.price}</td>
                          <td className="px-3 py-[5px] text-right text-foreground">{trade.amount}</td>
                          <td className="px-3 py-[5px] text-right text-muted">{trade.fee}</td>
                          <td className="px-3 py-[5px] text-right text-foreground">{trade.total}</td>
                          <td className="px-3 py-[5px] text-center">
                            <span className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-sans",
                              trade.role === "Maker" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                            )}>{trade.role}</span>
                          </td>
                          <td className={cn("px-3 py-[5px] text-right font-sans font-medium", trade.side === "Buy" ? "text-green" : "text-red")}>{trade.side}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Assets */}
                {activeBottomTab === "assets" && (
                  <table className="w-full text-[11px]">
                    <thead className="sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                      <tr className="text-muted">
                        <th className="text-left px-3 py-1.5 font-medium">Coin</th>
                        <th className="text-right px-3 py-1.5 font-medium">Available</th>
                        <th className="text-right px-3 py-1.5 font-medium">In Order</th>
                        <th className="text-right px-3 py-1.5 font-medium">Total Balance</th>
                        <th className="text-right px-3 py-1.5 font-medium">BTC Value</th>
                        <th className="text-right px-3 py-1.5 font-medium">USD Value</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {mockAssets.map((asset, i) => (
                        <tr key={asset.coin} className={cn(
                          "border-t border-border/30 hover:bg-card-hover/40 transition-colors",
                          i % 2 === 1 && "bg-card-hover/20"
                        )}>
                          <td className="px-3 py-[5px]">
                            <div className="flex items-center gap-2 font-sans">
                              <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center text-[9px] font-bold text-accent">
                                {asset.coin[0]}
                              </div>
                              <div>
                                <span className="font-medium text-foreground">{asset.coin}</span>
                                <span className="text-muted ml-1.5 text-[10px]">{asset.name}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-[5px] text-right text-foreground">{asset.available}</td>
                          <td className={cn("px-3 py-[5px] text-right", asset.inOrder !== "0.0000" && asset.inOrder !== "0.000" ? "text-yellow-500" : "text-muted/40")}>
                            {asset.inOrder}
                          </td>
                          <td className="px-3 py-[5px] text-right text-foreground font-medium">{asset.total}</td>
                          <td className="px-3 py-[5px] text-right text-muted">{asset.btcValue}</td>
                          <td className="px-3 py-[5px] text-right text-accent font-medium">{asset.usdValue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center: Order Book */}
        <div className="w-[280px] shrink-0 border-r border-border overflow-hidden">
          <OrderBook basePrice={pair.price} />
        </div>

        {/* Right: OrderForm + Bot + Sentiment + Trades */}
        <div className="w-[280px] shrink-0 flex flex-col overflow-y-auto">
          {/* Full Order Form */}
          <div className="border-b border-border shrink-0">
            <OrderForm basePrice={pair.price} symbol={pair.symbol} />
          </div>

          {/* Trading Bot - Collapsible */}
          <div className="border-b border-border shrink-0">
            <button
              onClick={() => setShowBot(!showBot)}
              className="flex items-center justify-between w-full px-3 py-2.5 text-xs font-semibold text-foreground hover:bg-card-hover transition-colors"
            >
              <span>Trading Bot</span>
              {showBot ? <ChevronUp className="h-3.5 w-3.5 text-muted" /> : <ChevronDown className="h-3.5 w-3.5 text-muted" />}
            </button>
            {showBot && (
              <div className="px-3 pb-3">
                <TradingBotPanel pair={pair.symbol} basePrice={pair.price} />
              </div>
            )}
          </div>

          {/* Market Sentiment - Collapsible */}
          <div className="border-b border-border shrink-0">
            <button
              onClick={() => setShowSentiment(!showSentiment)}
              className="flex items-center justify-between w-full px-3 py-2.5 text-xs font-semibold text-foreground hover:bg-card-hover transition-colors"
            >
              <span className="flex items-center gap-2">
                Market Sentiment
                <span className="px-1.5 py-0.5 rounded bg-accent/10 text-accent text-[9px] font-bold">Live</span>
              </span>
              {showSentiment ? <ChevronUp className="h-3.5 w-3.5 text-muted" /> : <ChevronDown className="h-3.5 w-3.5 text-muted" />}
            </button>
            {showSentiment && (
              <div className="px-1">
                <SentimentGauge symbol={pair.symbol} />
              </div>
            )}
          </div>

          {/* Recent Trades */}
          <div className="flex-1 min-h-[200px]">
            <TradeHistory basePrice={pair.price} />
          </div>
        </div>
      </div>

      {/* Floating Chatbox */}
      <TradeChatbox symbol={pair.symbol} />
    </div>
  );
}
