import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../theme/app_colors.dart';
import '../../providers/wallet_provider.dart';
import '../../utils/formatters.dart';

class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});

  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _hideSmall = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final wallet = context.watch<WalletProvider>();

    return Scaffold(
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // ── Top bar ──
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 10, 12, 0),
                child: Row(
                  children: [
                    const Text('Assets', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.foreground, letterSpacing: -0.5)),
                    const Spacer(),
                    _iconBtn(Icons.search_rounded),
                    _iconBtn(Icons.history_rounded),
                    _iconBtn(Icons.more_horiz_rounded),
                  ],
                ),
              ),
            ),
            // ── Balance area ──
            SliverToBoxAdapter(child: _buildBalance(wallet)),
            // ── Action row ──
            SliverToBoxAdapter(child: _buildActions()),
            // ── Portfolio donut ──
            SliverToBoxAdapter(child: _buildPortfolio(wallet)),
            // ── Tabs ──
            SliverToBoxAdapter(
              child: TabBar(
                controller: _tabController,
                tabs: const [Tab(text: 'Spot'), Tab(text: 'Funding'), Tab(text: 'Earn')],
              ),
            ),
            // ── Hide small ──
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 10, 16, 4),
                child: Row(
                  children: [
                    Text('Coin', style: TextStyle(fontSize: 11, color: AppColors.muted)),
                    const Spacer(),
                    GestureDetector(
                      onTap: () => setState(() => _hideSmall = !_hideSmall),
                      child: Row(
                        children: [
                          Icon(
                            _hideSmall ? Icons.check_box_rounded : Icons.check_box_outline_blank_rounded,
                            size: 15,
                            color: _hideSmall ? AppColors.accent : AppColors.muted,
                          ),
                          const SizedBox(width: 4),
                          Text('Hide small', style: TextStyle(fontSize: 11, color: AppColors.muted)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // ── Asset list ──
            _buildAssetList(wallet),
            const SliverToBoxAdapter(child: SizedBox(height: 24)),
          ],
        ),
      ),
    );
  }

  Widget _iconBtn(IconData icon) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Icon(icon, size: 20, color: AppColors.textSecondary),
    );
  }

  Widget _buildBalance(WalletProvider w) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text('Total (USD)', style: TextStyle(fontSize: 12, color: AppColors.muted)),
              const SizedBox(width: 6),
              GestureDetector(
                onTap: w.toggleBalanceVisibility,
                child: Icon(
                  w.balanceVisible ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                  size: 15, color: AppColors.muted,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                w.balanceVisible ? formatCurrency(w.totalBalance) : '****',
                style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w700, color: AppColors.foreground, letterSpacing: -1, height: 1),
              ),
              const SizedBox(width: 10),
              Padding(
                padding: const EdgeInsets.only(bottom: 3),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: w.totalChange >= 0 ? AppColors.accentBg : AppColors.dangerBg,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    '${w.totalChange >= 0 ? '+' : ''}${formatPercent(w.totalChange)}',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: w.totalChange >= 0 ? AppColors.accent : AppColors.danger),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActions() {
    final items = [
      (Icons.south_west_rounded, 'Deposit', AppColors.accent),
      (Icons.north_east_rounded, 'Withdraw', AppColors.info),
      (Icons.swap_horiz_rounded, 'Transfer', AppColors.purple),
      (Icons.currency_exchange_rounded, 'Convert', AppColors.warning),
    ];

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 18, 16, 6),
      child: Row(
        children: items.map((a) {
          return Expanded(
            child: GestureDetector(
              onTap: () {},
              child: Column(
                children: [
                  Container(
                    width: 42, height: 42,
                    decoration: BoxDecoration(
                      color: a.$3.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(a.$1, color: a.$3, size: 20),
                  ),
                  const SizedBox(height: 6),
                  Text(a.$2, style: TextStyle(fontSize: 11, color: AppColors.textSecondary, fontWeight: FontWeight.w500)),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildPortfolio(WalletProvider w) {
    final colors = [AppColors.accent, AppColors.info, AppColors.warning, AppColors.purple, AppColors.cyan, AppColors.danger, const Color(0xFFFF6B6B), const Color(0xFFFFD93D)];

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 12, 16, 6),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 100, height: 100,
            child: PieChart(
              PieChartData(
                sections: w.assets.asMap().entries.map((e) {
                  final pct = (e.value.value / w.totalBalance) * 100;
                  return PieChartSectionData(
                    value: e.value.value,
                    color: colors[e.key % colors.length],
                    radius: 16,
                    showTitle: false,
                    title: '${pct.toStringAsFixed(0)}%',
                  );
                }).toList(),
                centerSpaceRadius: 28,
                sectionsSpace: 1.5,
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: w.assets.take(5).toList().asMap().entries.map((e) {
                final pct = ((e.value.value / w.totalBalance) * 100).toStringAsFixed(1);
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 3),
                  child: Row(
                    children: [
                      Container(width: 8, height: 8, decoration: BoxDecoration(color: colors[e.key % colors.length], borderRadius: BorderRadius.circular(2))),
                      const SizedBox(width: 6),
                      Text(e.value.symbol, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.foreground)),
                      const SizedBox(width: 4),
                      Text('$pct%', style: TextStyle(fontSize: 11, color: AppColors.muted)),
                    ],
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  SliverList _buildAssetList(WalletProvider w) {
    final assets = w.assets.where((a) => !_hideSmall || a.value > 100).toList();
    return SliverList(
      delegate: SliverChildBuilderDelegate(
        (context, i) {
          final a = assets[i];
          final up = a.change24h >= 0;
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: Row(
              children: [
                Container(
                  width: 34, height: 34,
                  decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(8)),
                  child: Center(child: Text(a.icon, style: const TextStyle(fontSize: 16))),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(a.symbol, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.foreground)),
                      Text(a.name, style: TextStyle(fontSize: 10, color: AppColors.muted)),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      w.balanceVisible ? formatNumber(a.balance, decimals: 4) : '****',
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.foreground, letterSpacing: -0.3),
                    ),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          w.balanceVisible ? '≈\$${formatPrice(a.value)}' : '****',
                          style: TextStyle(fontSize: 10, color: AppColors.muted),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '${up ? '+' : ''}${formatPercent(a.change24h)}',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: up ? AppColors.accent : AppColors.danger),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          );
        },
        childCount: assets.length,
      ),
    );
  }
}
