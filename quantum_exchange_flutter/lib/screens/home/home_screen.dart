import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../theme/app_colors.dart';
import '../../providers/auth_provider.dart';
import '../../providers/wallet_provider.dart';
import '../../providers/market_provider.dart';
import '../../data/mock_data.dart';
import '../../utils/formatters.dart';
import '../../widgets/mini_chart.dart';
import '../trade/trade_screen.dart';
import '../earn/earn_screen.dart';
import '../bots/bots_screen.dart';
import '../academy/academy_screen.dart';
import '../news/news_screen.dart';
import '../profile/profile_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _announcementIndex = 0;
  int _marketTab = 0;

  @override
  void initState() {
    super.initState();
    _startAnnouncementTimer();
  }

  void _startAnnouncementTimer() {
    Future.delayed(const Duration(seconds: 4), () {
      if (mounted) {
        setState(() {
          _announcementIndex = (_announcementIndex + 1) % announcements.length;
        });
        _startAnnouncementTimer();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final wallet = context.watch<WalletProvider>();
    final market = context.watch<MarketProvider>();

    return Scaffold(
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(child: _buildTopBar()),
            SliverToBoxAdapter(child: _buildAnnouncementStrip()),
            SliverToBoxAdapter(child: _buildPortfolioCard(wallet)),
            SliverToBoxAdapter(child: _buildQuickActions()),
            SliverToBoxAdapter(child: const SizedBox(height: 8)),
            SliverToBoxAdapter(child: _buildServices()),
            SliverToBoxAdapter(child: _buildHotCoinsSection(market)),
            SliverToBoxAdapter(child: _buildMarketSection(market)),
            const SliverToBoxAdapter(child: SizedBox(height: 24)),
          ],
        ),
      ),
    );
  }

  // ─── Top Bar ───
  Widget _buildTopBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 12, 0),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              gradient: AppColors.accentGradient,
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.bolt_rounded, color: Color(0xFF001A0F), size: 18),
          ),
          const SizedBox(width: 8),
          const Text(
            'Quantum',
            style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.foreground, letterSpacing: -0.5),
          ),
          const Spacer(),
          _iconBtn(Icons.search_rounded),
          _iconBtn(Icons.qr_code_scanner_rounded),
          Stack(
            children: [
              _iconBtn(Icons.notifications_none_rounded),
              Positioned(
                right: 10, top: 10,
                child: Container(
                  width: 6, height: 6,
                  decoration: const BoxDecoration(color: AppColors.danger, shape: BoxShape.circle),
                ),
              ),
            ],
          ),
          GestureDetector(
            onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfileScreen())),
            child: Container(
              width: 28, height: 28,
              decoration: const BoxDecoration(
                gradient: AppColors.accentGradient,
                shape: BoxShape.circle,
              ),
              child: const Center(
                child: Text('A', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF001A0F))),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _iconBtn(IconData icon) {
    return GestureDetector(
      onTap: () {},
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Icon(icon, size: 21, color: AppColors.textSecondary),
      ),
    );
  }

  // ─── Announcement ───
  Widget _buildAnnouncementStrip() {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 10, 16, 0),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Icon(Icons.campaign_rounded, size: 14, color: AppColors.accent),
          const SizedBox(width: 8),
          Expanded(
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 400),
              child: Text(
                announcements[_announcementIndex],
                key: ValueKey(_announcementIndex),
                style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ),
          Icon(Icons.chevron_right, size: 16, color: AppColors.muted),
        ],
      ),
    );
  }

  // ─── Portfolio Card ───
  Widget _buildPortfolioCard(WalletProvider wallet) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 14, 16, 0),
      padding: const EdgeInsets.fromLTRB(18, 18, 18, 16),
      decoration: BoxDecoration(
        gradient: AppColors.heroGradient,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border, width: 0.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text('Total assets (USD)', style: TextStyle(fontSize: 12, color: AppColors.muted)),
              const SizedBox(width: 6),
              GestureDetector(
                onTap: wallet.toggleBalanceVisibility,
                child: Icon(
                  wallet.balanceVisible ? Icons.visibility_outlined : Icons.visibility_off_outlined,
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
                wallet.balanceVisible ? formatCurrency(wallet.totalBalance) : '****',
                style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w700, color: AppColors.foreground, letterSpacing: -1, height: 1),
              ),
              const SizedBox(width: 10),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: wallet.totalChange >= 0 ? AppColors.accentBg : AppColors.dangerBg,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  '${wallet.totalChange >= 0 ? '+' : ''}${formatPercent(wallet.totalChange)}',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: wallet.totalChange >= 0 ? AppColors.accent : AppColors.danger,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ─── Quick Actions ───
  Widget _buildQuickActions() {
    final actions = [
      (Icons.south_west_rounded, 'Deposit', AppColors.accent),
      (Icons.north_east_rounded, 'Withdraw', AppColors.info),
      (Icons.swap_horiz_rounded, 'Transfer', AppColors.purple),
      (Icons.credit_card_rounded, 'Buy', AppColors.warning),
    ];

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      child: Row(
        children: actions.map((a) {
          return Expanded(
            child: GestureDetector(
              onTap: () {},
              child: Column(
                children: [
                  Container(
                    width: 44,
                    height: 44,
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

  // ─── Services ───
  Widget _buildServices() {
    final items = [
      (Icons.candlestick_chart_rounded, 'Spot', null),
      (Icons.bolt_rounded, 'Futures', null),
      (Icons.smart_toy_rounded, 'Bots', const BotsScreen()),
      (Icons.savings_rounded, 'Earn', const EarnScreen()),
      (Icons.school_rounded, 'Academy', const AcademyScreen()),
      (Icons.newspaper_rounded, 'News', const NewsScreen()),
      (Icons.card_giftcard_rounded, 'Rewards', null),
      (Icons.more_horiz_rounded, 'More', null),
    ];

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 4),
      child: Wrap(
        children: items.map((item) {
          return SizedBox(
            width: (MediaQuery.of(context).size.width - 32) / 4,
            child: GestureDetector(
              onTap: () {
                if (item.$3 != null) {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => item.$3 as Widget));
                }
              },
              behavior: HitTestBehavior.opaque,
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: Column(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(item.$1, color: AppColors.textSecondary, size: 20),
                    ),
                    const SizedBox(height: 6),
                    Text(item.$2, style: TextStyle(fontSize: 11, color: AppColors.textSecondary, fontWeight: FontWeight.w400)),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  // ─── Hot Coins ───
  Widget _buildHotCoinsSection(MarketProvider market) {
    final coins = market.hotCoins;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
          child: Row(
            children: [
              const Text('Top movers', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.foreground, letterSpacing: -0.3)),
              const Spacer(),
              Text('More', style: TextStyle(fontSize: 12, color: AppColors.muted)),
              Icon(Icons.chevron_right, size: 16, color: AppColors.muted),
            ],
          ),
        ),
        SizedBox(
          height: 88,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: coins.length,
            itemBuilder: (context, i) {
              final c = coins[i];
              final up = c.change24h >= 0;
              return GestureDetector(
                onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => TradeScreen(pairId: c.id))),
                child: Container(
                  width: 130,
                  margin: EdgeInsets.only(right: i < coins.length - 1 ? 8 : 0),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Text(
                            c.symbol.split('/').first,
                            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.foreground),
                          ),
                          Text(' /USDT', style: TextStyle(fontSize: 10, color: AppColors.muted)),
                        ],
                      ),
                      Text(
                        formatPrice(c.price),
                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.foreground, letterSpacing: -0.3),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: up ? AppColors.accentBg : AppColors.dangerBg,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          '${up ? '+' : ''}${formatPercent(c.change24h)}',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: up ? AppColors.accent : AppColors.danger),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // ─── Market Section ───
  Widget _buildMarketSection(MarketProvider market) {
    final tabs = ['Hot', 'Gainers', 'Losers', 'New'];
    List<dynamic> pairs;
    switch (_marketTab) {
      case 1: pairs = market.topGainers; break;
      case 2: pairs = market.topLosers; break;
      default: pairs = market.pairs.take(10).toList();
    }

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
          child: Row(
            children: [
              const Text('Markets', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.foreground, letterSpacing: -0.3)),
              const Spacer(),
              Text('More', style: TextStyle(fontSize: 12, color: AppColors.muted)),
              Icon(Icons.chevron_right, size: 16, color: AppColors.muted),
            ],
          ),
        ),
        const SizedBox(height: 10),
        // Tabs
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: List.generate(tabs.length, (i) {
              final active = _marketTab == i;
              return GestureDetector(
                onTap: () => setState(() => _marketTab = i),
                child: Container(
                  margin: const EdgeInsets.only(right: 6),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: active ? AppColors.foreground.withOpacity(0.08) : Colors.transparent,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    tabs[i],
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: active ? FontWeight.w600 : FontWeight.w400,
                      color: active ? AppColors.foreground : AppColors.muted,
                    ),
                  ),
                ),
              );
            }),
          ),
        ),
        const SizedBox(height: 8),
        // Header row
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              SizedBox(width: 140, child: Text('Name', style: TextStyle(fontSize: 11, color: AppColors.muted))),
              const Spacer(),
              SizedBox(width: 80, child: Text('Last Price', textAlign: TextAlign.right, style: TextStyle(fontSize: 11, color: AppColors.muted))),
              SizedBox(width: 72, child: Text('24h Chg%', textAlign: TextAlign.right, style: TextStyle(fontSize: 11, color: AppColors.muted))),
            ],
          ),
        ),
        const SizedBox(height: 4),
        // Rows
        ...pairs.map((pair) => _buildMarketRow(pair)),
      ],
    );
  }

  Widget _buildMarketRow(dynamic pair) {
    final up = pair.change24h >= 0;
    final color = up ? AppColors.accent : AppColors.danger;
    return GestureDetector(
      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => TradeScreen(pairId: pair.id))),
      behavior: HitTestBehavior.opaque,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        child: Row(
          children: [
            SizedBox(
              width: 140,
              child: Row(
                children: [
                  Container(
                    width: 32, height: 32,
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Center(
                      child: Text(
                        pair.icon,
                        style: const TextStyle(fontSize: 14),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(pair.symbol.split('/').first, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.foreground)),
                          Text(' /USDT', style: TextStyle(fontSize: 10, color: AppColors.muted)),
                        ],
                      ),
                      Text('Vol ${formatCompact(pair.volume24h)}', style: TextStyle(fontSize: 10, color: AppColors.muted)),
                    ],
                  ),
                ],
              ),
            ),
            const Spacer(),
            SizedBox(
              width: 80,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(formatPrice(pair.price), style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.foreground, letterSpacing: -0.3)),
                  Text('≈\$${formatPrice(pair.price)}', style: TextStyle(fontSize: 10, color: AppColors.muted)),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Container(
              width: 64,
              height: 28,
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(4),
              ),
              child: Center(
                child: Text(
                  '${up ? '+' : ''}${formatPercent(pair.change24h)}',
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
