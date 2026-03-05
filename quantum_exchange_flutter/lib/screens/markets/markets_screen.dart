import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../theme/app_colors.dart';
import '../../providers/market_provider.dart';
import '../../utils/formatters.dart';
import '../../widgets/mini_chart.dart';
import '../trade/trade_screen.dart';

class MarketsScreen extends StatefulWidget {
  const MarketsScreen({super.key});

  @override
  State<MarketsScreen> createState() => _MarketsScreenState();
}

class _MarketsScreenState extends State<MarketsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final market = context.watch<MarketProvider>();

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // ── Search bar ──
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 38,
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: TextField(
                        controller: _searchController,
                        onChanged: (v) { market.setSearchQuery(v); setState(() {}); },
                        style: const TextStyle(fontSize: 13, color: AppColors.foreground),
                        decoration: InputDecoration(
                          hintText: 'Search',
                          prefixIcon: const Icon(Icons.search_rounded, size: 18, color: AppColors.muted),
                          prefixIconConstraints: const BoxConstraints(minWidth: 36),
                          suffixIcon: _searchController.text.isNotEmpty
                              ? GestureDetector(
                                  onTap: () { _searchController.clear(); market.setSearchQuery(''); setState(() {}); },
                                  child: const Icon(Icons.close_rounded, size: 16, color: AppColors.muted),
                                )
                              : null,
                          border: InputBorder.none,
                          filled: false,
                          contentPadding: const EdgeInsets.symmetric(vertical: 10),
                          isDense: true,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Icon(Icons.tune_rounded, size: 20, color: AppColors.textSecondary),
                ],
              ),
            ),
            // ── Tabs ──
            TabBar(
              controller: _tabController,
              tabs: const [Tab(text: 'Hot'), Tab(text: 'Gainers'), Tab(text: 'Losers'), Tab(text: 'New')],
            ),
            // ── Column header ──
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 10, 16, 4),
              child: Row(
                children: [
                  SizedBox(width: 120, child: Text('Name / Vol', style: TextStyle(fontSize: 10, color: AppColors.muted))),
                  const Spacer(),
                  SizedBox(width: 70, child: Text('Last Price', textAlign: TextAlign.right, style: TextStyle(fontSize: 10, color: AppColors.muted))),
                  SizedBox(width: 72, child: Text('24h Chg%', textAlign: TextAlign.right, style: TextStyle(fontSize: 10, color: AppColors.muted))),
                ],
              ),
            ),
            // ── List ──
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildList(market.pairs),
                  _buildList(market.topGainers),
                  _buildList(market.topLosers),
                  _buildList(market.pairs.take(6).toList()),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildList(List pairs) {
    if (pairs.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.search_off_rounded, size: 40, color: AppColors.muted),
            const SizedBox(height: 8),
            Text('No results', style: TextStyle(fontSize: 13, color: AppColors.muted)),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: EdgeInsets.zero,
      itemCount: pairs.length,
      itemBuilder: (context, i) {
        final p = pairs[i];
        final up = p.change24h >= 0;
        final color = up ? AppColors.accent : AppColors.danger;

        return GestureDetector(
          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => TradeScreen(pairId: p.id))),
          behavior: HitTestBehavior.opaque,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 11),
            child: Row(
              children: [
                // Icon + name
                Container(
                  width: 32, height: 32,
                  decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(8)),
                  child: Center(child: Text(p.icon, style: const TextStyle(fontSize: 14))),
                ),
                const SizedBox(width: 10),
                SizedBox(
                  width: 78,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(p.symbol.split('/').first, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.foreground)),
                          Text('/USDT', style: TextStyle(fontSize: 9, color: AppColors.muted)),
                        ],
                      ),
                      Text('Vol ${formatCompact(p.volume24h)}', style: TextStyle(fontSize: 10, color: AppColors.muted)),
                    ],
                  ),
                ),
                // Mini chart
                Expanded(
                  child: Center(
                    child: MiniChart(data: p.sparkline, color: color, width: 52, height: 22),
                  ),
                ),
                // Price
                SizedBox(
                  width: 70,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(formatPrice(p.price), style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.foreground, letterSpacing: -0.3)),
                      Text('≈\$${formatPrice(p.price)}', style: TextStyle(fontSize: 9, color: AppColors.muted)),
                    ],
                  ),
                ),
                const SizedBox(width: 6),
                // Change pill
                Container(
                  width: 66, height: 28,
                  decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(4)),
                  child: Center(
                    child: Text(
                      '${up ? '+' : ''}${formatPercent(p.change24h)}',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.white),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
