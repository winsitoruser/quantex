import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';

class BotsScreen extends StatefulWidget {
  const BotsScreen({super.key});

  @override
  State<BotsScreen> createState() => _BotsScreenState();
}

class _BotsScreenState extends State<BotsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<Map<String, dynamic>> _strategies = [
    {
      'name': 'Grid Trading',
      'description': 'Buy low and sell high automatically within a price range',
      'icon': Icons.grid_on_rounded,
      'color': AppColors.accent,
      'roi': '+18.4%',
      'risk': 'Medium',
      'minInvestment': '\$100',
      'users': '12.5K',
    },
    {
      'name': 'DCA Bot',
      'description': 'Dollar-cost averaging strategy for long-term accumulation',
      'icon': Icons.trending_up_rounded,
      'color': AppColors.info,
      'roi': '+12.7%',
      'risk': 'Low',
      'minInvestment': '\$50',
      'users': '28.3K',
    },
    {
      'name': 'Arbitrage',
      'description': 'Profit from price differences across trading pairs',
      'icon': Icons.swap_calls_rounded,
      'color': AppColors.purple,
      'roi': '+8.2%',
      'risk': 'Low',
      'minInvestment': '\$500',
      'users': '5.1K',
    },
    {
      'name': 'Smart Rebalance',
      'description': 'Automatically rebalance your portfolio to target allocation',
      'icon': Icons.pie_chart_rounded,
      'color': AppColors.cyan,
      'roi': '+15.1%',
      'risk': 'Medium',
      'minInvestment': '\$200',
      'users': '8.7K',
    },
    {
      'name': 'Signal Bot',
      'description': 'AI-powered trading signals with automated execution',
      'icon': Icons.auto_graph_rounded,
      'color': AppColors.warning,
      'roi': '+22.6%',
      'risk': 'High',
      'minInvestment': '\$150',
      'users': '15.2K',
    },
    {
      'name': 'Martingale',
      'description': 'Progressive position sizing with recovery mechanism',
      'icon': Icons.casino_rounded,
      'color': AppColors.danger,
      'roi': '+31.2%',
      'risk': 'High',
      'minInvestment': '\$300',
      'users': '3.8K',
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Trading Bots'),
        actions: [
          IconButton(icon: const Icon(Icons.history, size: 22), onPressed: () {}),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Strategies'),
            Tab(text: 'My Bots'),
          ],
          dividerHeight: 1,
          dividerColor: AppColors.border,
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildStrategies(),
          _buildMyBots(),
        ],
      ),
    );
  }

  Widget _buildStrategies() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Banner
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [AppColors.accent.withOpacity(0.15), AppColors.cyan.withOpacity(0.1)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.accent.withOpacity(0.2)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'AI-Powered Trading',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppColors.foreground,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Let bots trade for you 24/7 with proven strategies',
                        style: TextStyle(fontSize: 12, color: AppColors.muted),
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: AppColors.accent,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'Get Started',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: AppColors.background,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                Icon(Icons.smart_toy_rounded, size: 64, color: AppColors.accent.withOpacity(0.3)),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'Choose a Strategy',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.foreground),
          ),
          const SizedBox(height: 12),
          // Strategy Cards
          ...List.generate(_strategies.length, (index) {
            final strategy = _strategies[index];
            return _buildStrategyCard(strategy);
          }),
        ],
      ),
    );
  }

  Widget _buildStrategyCard(Map<String, dynamic> strategy) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: (strategy['color'] as Color).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(strategy['icon'] as IconData, color: strategy['color'] as Color, size: 22),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      strategy['name'] as String,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: AppColors.foreground,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      strategy['description'] as String,
                      style: TextStyle(fontSize: 11, color: AppColors.muted),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _buildStatChip('ROI (30d)', strategy['roi'] as String, AppColors.accent),
              const SizedBox(width: 8),
              _buildStatChip('Risk', strategy['risk'] as String,
                  strategy['risk'] == 'Low' ? AppColors.accent :
                  strategy['risk'] == 'Medium' ? AppColors.warning : AppColors.danger),
              const SizedBox(width: 8),
              _buildStatChip('Min', strategy['minInvestment'] as String, AppColors.info),
              const Spacer(),
              Row(
                children: [
                  Icon(Icons.people_outline, size: 14, color: AppColors.muted),
                  const SizedBox(width: 4),
                  Text(strategy['users'] as String, style: TextStyle(fontSize: 11, color: AppColors.muted)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => _showBotSetupSheet(strategy),
              style: ElevatedButton.styleFrom(
                backgroundColor: (strategy['color'] as Color).withOpacity(0.15),
                foregroundColor: strategy['color'] as Color,
                elevation: 0,
                padding: const EdgeInsets.symmetric(vertical: 10),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: const Text('Create Bot', style: TextStyle(fontWeight: FontWeight.w700)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatChip(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Column(
        children: [
          Text(label, style: TextStyle(fontSize: 9, color: AppColors.muted)),
          const SizedBox(height: 1),
          Text(value, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: color)),
        ],
      ),
    );
  }

  void _showBotSetupSheet(Map<String, dynamic> strategy) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.card,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.7,
        maxChildSize: 0.9,
        builder: (context, scrollController) => SingleChildScrollView(
          controller: scrollController,
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.border,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'Create ${strategy['name']} Bot',
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.foreground),
              ),
              const SizedBox(height: 4),
              Text(strategy['description'] as String, style: TextStyle(fontSize: 13, color: AppColors.muted)),
              const SizedBox(height: 24),
              _buildFormField('Trading Pair', 'BTC/USDT'),
              _buildFormField('Investment Amount', '\$500'),
              if (strategy['name'] == 'Grid Trading') ...[
                _buildFormField('Upper Price', '\$100,000'),
                _buildFormField('Lower Price', '\$90,000'),
                _buildFormField('Grid Count', '10'),
              ],
              if (strategy['name'] == 'DCA Bot') ...[
                _buildFormField('Buy Amount per Order', '\$50'),
                _buildFormField('Interval', 'Every 4 hours'),
              ],
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('${strategy['name']} bot created!'),
                        backgroundColor: AppColors.accent,
                        behavior: SnackBarBehavior.floating,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    backgroundColor: strategy['color'] as Color,
                  ),
                  child: const Text('Start Bot', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFormField(String label, String hint) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextField(
        style: const TextStyle(fontSize: 14, color: AppColors.foreground),
        decoration: InputDecoration(
          labelText: label,
          hintText: hint,
          labelStyle: TextStyle(fontSize: 12, color: AppColors.muted),
        ),
      ),
    );
  }

  Widget _buildMyBots() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.smart_toy_outlined, size: 64, color: AppColors.muted.withOpacity(0.3)),
          const SizedBox(height: 16),
          const Text(
            'No active bots',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.foreground),
          ),
          const SizedBox(height: 4),
          Text(
            'Create a bot to start automated trading',
            style: TextStyle(fontSize: 13, color: AppColors.muted),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () => _tabController.animateTo(0),
            child: const Text('Browse Strategies'),
          ),
        ],
      ),
    );
  }
}
