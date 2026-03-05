import 'package:flutter/material.dart';
import '../screens/home/home_screen.dart';
import '../screens/markets/markets_screen.dart';
import '../screens/trade/trade_screen.dart';
import '../screens/wallet/wallet_screen.dart';
import '../screens/bots/bots_screen.dart';
import '../theme/app_colors.dart';

class AppRouter extends StatefulWidget {
  const AppRouter({super.key});

  @override
  State<AppRouter> createState() => _AppRouterState();
}

class _AppRouterState extends State<AppRouter> {
  int _currentIndex = 0;

  List<Widget> _screens = [
    const HomeScreen(),
    const MarketsScreen(),
    const TradeScreen(pairId: 'btc-usdt'),
    const BotsScreen(),
    const WalletScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: AppColors.border, width: 0.5)),
        ),
        child: SafeArea(
          child: SizedBox(
            height: 56,
            child: Row(
              children: [
                _navItem(0, Icons.home_outlined, Icons.home_rounded, 'Home'),
                _navItem(1, Icons.insert_chart_outlined, Icons.insert_chart_rounded, 'Markets'),
                _tradeNavItem(),
                _navItem(3, Icons.smart_toy_outlined, Icons.smart_toy_rounded, 'Bots'),
                _navItem(4, Icons.account_balance_wallet_outlined, Icons.account_balance_wallet_rounded, 'Assets'),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _navItem(int index, IconData icon, IconData activeIcon, String label) {
    final isActive = _currentIndex == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _currentIndex = index),
        behavior: HitTestBehavior.opaque,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              isActive ? activeIcon : icon,
              size: 22,
              color: isActive ? AppColors.foreground : AppColors.muted,
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                color: isActive ? AppColors.foreground : AppColors.muted,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _tradeNavItem() {
    final isActive = _currentIndex == 2;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _currentIndex = 2),
        behavior: HitTestBehavior.opaque,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: isActive ? AppColors.accent : AppColors.elevated,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                Icons.swap_vert_rounded,
                size: 18,
                color: isActive ? const Color(0xFF001A0F) : AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              'Trade',
              style: TextStyle(
                fontSize: 10,
                fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                color: isActive ? AppColors.foreground : AppColors.muted,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void navigateToTrade(String pairId) {
    setState(() {
      _screens[2] = TradeScreen(pairId: pairId);
      _currentIndex = 2;
    });
  }
}
