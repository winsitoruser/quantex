import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../theme/app_colors.dart';
import '../../providers/market_provider.dart';
import '../../models/crypto_pair.dart';
import '../../data/mock_data.dart';
import '../../utils/formatters.dart';

class TradeScreen extends StatefulWidget {
  final String pairId;
  const TradeScreen({super.key, required this.pairId});

  @override
  State<TradeScreen> createState() => _TradeScreenState();
}

class _TradeScreenState extends State<TradeScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isBuy = true;
  String _orderType = 'Limit';
  final _priceController = TextEditingController();
  final _amountController = TextEditingController();
  late CryptoPair _pair;
  late List<CandlestickData> _candles;
  late Map<String, List<OrderBookEntry>> _orderBook;
  late List<TradeEntry> _trades;
  String _chartInterval = '1H';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadData();
  }

  void _loadData() {
    final market = context.read<MarketProvider>();
    _pair = market.getPairById(widget.pairId);
    _priceController.text = formatPrice(_pair.price);
    _candles = generateCandlestickData(_pair.price);
    _orderBook = generateOrderBook(_pair.price);
    _trades = generateTradeHistory(_pair.price);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _priceController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final up = _pair.change24h >= 0;
    final priceColor = up ? AppColors.accent : AppColors.danger;

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // ── Top Bar ──
            _buildTopBar(up, priceColor),
            // ── Price Strip ──
            _buildPriceStrip(priceColor),
            // ── Tabs ──
            TabBar(
              controller: _tabController,
              tabs: const [Tab(text: 'Chart'), Tab(text: 'Book'), Tab(text: 'Trades')],
            ),
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [_buildChartTab(), _buildOrderBookTab(), _buildTradesTab()],
              ),
            ),
            _buildOrderPanel(),
          ],
        ),
      ),
    );
  }

  // ═══ TOP BAR ═══
  Widget _buildTopBar(bool up, Color priceColor) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Row(
        children: [
          GestureDetector(
            onTap: () => Navigator.maybePop(context),
            child: const Icon(Icons.arrow_back_ios_new_rounded, size: 18, color: AppColors.foreground),
          ),
          const SizedBox(width: 10),
          Text(
            _pair.symbol.split('/').first,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.foreground),
          ),
          Text('/USDT', style: TextStyle(fontSize: 12, color: AppColors.muted)),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
            decoration: BoxDecoration(
              color: up ? AppColors.accentBg : AppColors.dangerBg,
              borderRadius: BorderRadius.circular(3),
            ),
            child: Text(
              '${up ? '+' : ''}${formatPercent(_pair.change24h)}',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: priceColor),
            ),
          ),
          const Spacer(),
          _iconBtn(Icons.star_border_rounded),
          _iconBtn(Icons.share_outlined),
        ],
      ),
    );
  }

  Widget _iconBtn(IconData icon) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 6),
      child: Icon(icon, size: 20, color: AppColors.textSecondary),
    );
  }

  // ═══ PRICE STRIP ═══
  Widget _buildPriceStrip(Color priceColor) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 10),
      child: Row(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                formatPrice(_pair.price),
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: priceColor, letterSpacing: -0.5, height: 1),
              ),
              const SizedBox(height: 2),
              Text('≈ \$${formatPrice(_pair.price)}', style: TextStyle(fontSize: 11, color: AppColors.muted)),
            ],
          ),
          const Spacer(),
          _stat('High', formatPrice(_pair.high24h)),
          const SizedBox(width: 16),
          _stat('Low', formatPrice(_pair.low24h)),
          const SizedBox(width: 16),
          _stat('Vol', formatCompact(_pair.volume24h)),
        ],
      ),
    );
  }

  Widget _stat(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Text(label, style: TextStyle(fontSize: 10, color: AppColors.muted)),
        const SizedBox(height: 1),
        Text(value, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: AppColors.foreground)),
      ],
    );
  }

  // ═══ CHART TAB ═══
  Widget _buildChartTab() {
    final spots = <FlSpot>[];
    for (int i = 0; i < _candles.length; i++) {
      spots.add(FlSpot(i.toDouble(), _candles[i].close));
    }
    final isUp = _candles.isNotEmpty && _candles.last.close >= _candles.first.open;
    final chartColor = isUp ? AppColors.accent : AppColors.danger;

    return Column(
      children: [
        // Interval chips
        Container(
          height: 32,
          margin: const EdgeInsets.only(top: 6),
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: ListView(
            scrollDirection: Axis.horizontal,
            children: ['15m', '1H', '4H', '1D', '1W'].map((iv) {
              final active = _chartInterval == iv;
              return GestureDetector(
                onTap: () => setState(() => _chartInterval = iv),
                child: Container(
                  margin: const EdgeInsets.only(right: 2),
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: active ? AppColors.surface : Colors.transparent,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(iv, style: TextStyle(fontSize: 12, fontWeight: active ? FontWeight.w600 : FontWeight.w400, color: active ? AppColors.foreground : AppColors.muted)),
                ),
              );
            }).toList(),
          ),
        ),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(8, 8, 16, 8),
            child: LineChart(
              LineChartData(
                gridData: FlGridData(
                  show: true,
                  drawVerticalLine: false,
                  getDrawingHorizontalLine: (_) => FlLine(color: AppColors.border, strokeWidth: 0.3),
                ),
                titlesData: FlTitlesData(show: false),
                borderData: FlBorderData(show: false),
                lineBarsData: [
                  LineChartBarData(
                    spots: spots,
                    isCurved: true,
                    curveSmoothness: 0.2,
                    color: chartColor,
                    barWidth: 1.5,
                    dotData: FlDotData(show: false),
                    belowBarData: BarAreaData(
                      show: true,
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [chartColor.withOpacity(0.12), chartColor.withOpacity(0.0)],
                      ),
                    ),
                  ),
                ],
                lineTouchData: LineTouchData(
                  touchTooltipData: LineTouchTooltipData(
                    getTooltipColor: (_) => AppColors.elevated,
                    tooltipRoundedRadius: 6,
                    tooltipPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    getTooltipItems: (spots) => spots.map((s) => LineTooltipItem(
                      formatPrice(s.y),
                      const TextStyle(color: AppColors.foreground, fontSize: 12, fontWeight: FontWeight.w600),
                    )).toList(),
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  // ═══ ORDER BOOK TAB ═══
  Widget _buildOrderBookTab() {
    final asks = _orderBook['asks'] ?? [];
    final bids = _orderBook['bids'] ?? [];
    final maxTotal = [...asks, ...bids].fold<double>(0, (m, e) => e.total > m ? e.total : m);

    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 8, 12, 0),
      child: Column(
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Row(
              children: [
                Expanded(child: Text('Price', style: TextStyle(fontSize: 10, color: AppColors.muted))),
                Expanded(child: Text('Qty', textAlign: TextAlign.right, style: TextStyle(fontSize: 10, color: AppColors.muted))),
                Expanded(child: Text('Total', textAlign: TextAlign.right, style: TextStyle(fontSize: 10, color: AppColors.muted))),
              ],
            ),
          ),
          // Asks
          Expanded(
            child: ListView.builder(
              reverse: true,
              itemCount: asks.length,
              itemBuilder: (_, i) => _obRow(asks[i], AppColors.danger, maxTotal),
            ),
          ),
          // Mid price
          Container(
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(formatPrice(_pair.price), style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: _pair.change24h >= 0 ? AppColors.accent : AppColors.danger, letterSpacing: -0.3)),
                const SizedBox(width: 4),
                Icon(_pair.change24h >= 0 ? Icons.north : Icons.south, size: 12, color: _pair.change24h >= 0 ? AppColors.accent : AppColors.danger),
              ],
            ),
          ),
          // Bids
          Expanded(
            child: ListView.builder(
              itemCount: bids.length,
              itemBuilder: (_, i) => _obRow(bids[i], AppColors.accent, maxTotal),
            ),
          ),
        ],
      ),
    );
  }

  Widget _obRow(OrderBookEntry e, Color color, double maxTotal) {
    final fill = maxTotal > 0 ? e.total / maxTotal : 0.0;
    return SizedBox(
      height: 22,
      child: Stack(
        children: [
          Align(
            alignment: Alignment.centerRight,
            child: FractionallySizedBox(
              widthFactor: fill,
              child: Container(
                decoration: BoxDecoration(
                  color: color.withOpacity(0.06),
                  borderRadius: BorderRadius.circular(1),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 2),
            child: Row(
              children: [
                Expanded(child: Text(formatPrice(e.price), style: TextStyle(fontSize: 11, color: color, fontFamily: 'monospace', fontWeight: FontWeight.w500))),
                Expanded(child: Text(e.amount.toStringAsFixed(4), textAlign: TextAlign.right, style: const TextStyle(fontSize: 11, color: AppColors.foreground, fontFamily: 'monospace'))),
                Expanded(child: Text(e.total.toStringAsFixed(2), textAlign: TextAlign.right, style: TextStyle(fontSize: 11, color: AppColors.muted, fontFamily: 'monospace'))),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ═══ TRADES TAB ═══
  Widget _buildTradesTab() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(12, 10, 12, 4),
          child: Row(
            children: [
              Expanded(child: Text('Price', style: TextStyle(fontSize: 10, color: AppColors.muted))),
              Expanded(child: Text('Qty', textAlign: TextAlign.center, style: TextStyle(fontSize: 10, color: AppColors.muted))),
              Expanded(child: Text('Time', textAlign: TextAlign.right, style: TextStyle(fontSize: 10, color: AppColors.muted))),
            ],
          ),
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            itemCount: _trades.length,
            itemBuilder: (_, i) {
              final t = _trades[i];
              final buy = t.side == 'buy';
              return SizedBox(
                height: 26,
                child: Row(
                  children: [
                    Expanded(child: Text(formatPrice(t.price), style: TextStyle(fontSize: 11, color: buy ? AppColors.accent : AppColors.danger, fontFamily: 'monospace', fontWeight: FontWeight.w500))),
                    Expanded(child: Text(t.amount.toStringAsFixed(4), textAlign: TextAlign.center, style: const TextStyle(fontSize: 11, color: AppColors.foreground, fontFamily: 'monospace'))),
                    Expanded(child: Text(t.time, textAlign: TextAlign.right, style: TextStyle(fontSize: 11, color: AppColors.muted, fontFamily: 'monospace'))),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // ═══ ORDER PANEL ═══
  Widget _buildOrderPanel() {
    final coin = _pair.symbol.split('/').first;
    return Container(
      padding: const EdgeInsets.fromLTRB(14, 10, 14, 12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border(top: BorderSide(color: AppColors.border, width: 0.5)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Buy / Sell toggle
          Container(
            height: 36,
            padding: const EdgeInsets.all(2),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(6),
            ),
            child: Row(
              children: [
                _sideBtn('Buy', true),
                _sideBtn('Sell', false),
              ],
            ),
          ),
          const SizedBox(height: 10),
          // Order type row
          Row(
            children: ['Limit', 'Market', 'Stop-Limit'].map((t) {
              final active = _orderType == t;
              return GestureDetector(
                onTap: () => setState(() => _orderType = t),
                child: Padding(
                  padding: const EdgeInsets.only(right: 14),
                  child: Text(t, style: TextStyle(fontSize: 12, fontWeight: active ? FontWeight.w600 : FontWeight.w400, color: active ? AppColors.foreground : AppColors.muted)),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 10),
          // Price input
          if (_orderType != 'Market')
            _inputRow('Price', _priceController, 'USDT', showSteps: true),
          if (_orderType != 'Market') const SizedBox(height: 6),
          // Amount input
          _inputRow('Amount', _amountController, coin),
          const SizedBox(height: 8),
          // Pct row
          Row(
            children: [25, 50, 75, 100].map((p) {
              return Expanded(
                child: GestureDetector(
                  onTap: () {},
                  child: Container(
                    margin: EdgeInsets.only(right: p < 100 ? 4 : 0),
                    padding: const EdgeInsets.symmetric(vertical: 5),
                    decoration: BoxDecoration(
                      color: AppColors.background,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Center(child: Text('$p%', style: TextStyle(fontSize: 11, color: AppColors.muted, fontWeight: FontWeight.w500))),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 10),
          // Submit
          SizedBox(
            width: double.infinity,
            height: 42,
            child: ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                  content: Text('${_isBuy ? "Buy" : "Sell"} $coin order placed'),
                  backgroundColor: _isBuy ? AppColors.accent : AppColors.danger,
                  behavior: SnackBarBehavior.floating,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                ));
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: _isBuy ? AppColors.accent : AppColors.danger,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
              ),
              child: Text('${_isBuy ? "Buy" : "Sell"} $coin', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _sideBtn(String label, bool isBuySide) {
    final active = _isBuy == isBuySide;
    final color = isBuySide ? AppColors.accent : AppColors.danger;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _isBuy = isBuySide),
        child: Container(
          decoration: BoxDecoration(
            color: active ? color : Colors.transparent,
            borderRadius: BorderRadius.circular(5),
          ),
          child: Center(
            child: Text(label, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: active ? Colors.white : AppColors.muted)),
          ),
        ),
      ),
    );
  }

  Widget _inputRow(String label, TextEditingController ctrl, String suffix, {bool showSteps = false}) {
    return Container(
      height: 38,
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        children: [
          if (showSteps)
            GestureDetector(
              onTap: () {},
              child: Container(
                width: 32, height: 38,
                decoration: BoxDecoration(
                  border: Border(right: BorderSide(color: AppColors.border, width: 0.5)),
                ),
                child: const Icon(Icons.remove, size: 14, color: AppColors.muted),
              ),
            ),
          Expanded(
            child: TextField(
              controller: ctrl,
              keyboardType: TextInputType.number,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.foreground),
              decoration: InputDecoration(
                hintText: label,
                filled: false,
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
                isDense: true,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: Text(suffix, style: TextStyle(fontSize: 11, color: AppColors.muted)),
          ),
          if (showSteps)
            GestureDetector(
              onTap: () {},
              child: Container(
                width: 32, height: 38,
                decoration: BoxDecoration(
                  border: Border(left: BorderSide(color: AppColors.border, width: 0.5)),
                ),
                child: const Icon(Icons.add, size: 14, color: AppColors.muted),
              ),
            ),
        ],
      ),
    );
  }
}
