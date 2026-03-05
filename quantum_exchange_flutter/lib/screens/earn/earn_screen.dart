import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';

class EarnScreen extends StatefulWidget {
  const EarnScreen({super.key});

  @override
  State<EarnScreen> createState() => _EarnScreenState();
}

class _EarnScreenState extends State<EarnScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<Map<String, dynamic>> _stakingProducts = [
    {'coin': 'ETH', 'name': 'Ethereum', 'apy': 4.8, 'lockDays': 30, 'minAmount': 0.1, 'icon': 'Ξ', 'tvl': '\$2.4B'},
    {'coin': 'SOL', 'name': 'Solana', 'apy': 7.2, 'lockDays': 60, 'minAmount': 1.0, 'icon': '◎', 'tvl': '\$890M'},
    {'coin': 'ADA', 'name': 'Cardano', 'apy': 5.5, 'lockDays': 30, 'minAmount': 100, 'icon': '₳', 'tvl': '\$450M'},
    {'coin': 'DOT', 'name': 'Polkadot', 'apy': 12.3, 'lockDays': 90, 'minAmount': 10, 'icon': '●', 'tvl': '\$320M'},
    {'coin': 'AVAX', 'name': 'Avalanche', 'apy': 8.1, 'lockDays': 60, 'minAmount': 5, 'icon': '▲', 'tvl': '\$210M'},
  ];

  final List<Map<String, dynamic>> _savingsProducts = [
    {'coin': 'USDT', 'name': 'Tether', 'apy': 8.5, 'flexible': true, 'icon': '\$', 'tvl': '\$5.2B'},
    {'coin': 'USDC', 'name': 'USD Coin', 'apy': 7.8, 'flexible': true, 'icon': '\$', 'tvl': '\$3.1B'},
    {'coin': 'BTC', 'name': 'Bitcoin', 'apy': 3.2, 'flexible': true, 'icon': '₿', 'tvl': '\$1.8B'},
    {'coin': 'ETH', 'name': 'Ethereum', 'apy': 3.8, 'flexible': true, 'icon': 'Ξ', 'tvl': '\$1.2B'},
  ];

  final List<Map<String, dynamic>> _defiVaults = [
    {'name': 'BTC-ETH LP', 'protocol': 'QuantumDEX', 'apy': 24.5, 'risk': 'Medium', 'tvl': '\$450M'},
    {'name': 'Stable Farm', 'protocol': 'QuantumDEX', 'apy': 12.8, 'risk': 'Low', 'tvl': '\$1.2B'},
    {'name': 'SOL Yield', 'protocol': 'Marinade', 'apy': 18.3, 'risk': 'Medium', 'tvl': '\$320M'},
    {'name': 'ETH Vault', 'protocol': 'Lido', 'apy': 5.2, 'risk': 'Low', 'tvl': '\$2.8B'},
  ];

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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Earn'),
        actions: [
          IconButton(icon: const Icon(Icons.history, size: 22), onPressed: () {}),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Staking'),
            Tab(text: 'Savings'),
            Tab(text: 'DeFi'),
          ],
          dividerHeight: 1,
          dividerColor: AppColors.border,
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildStakingTab(),
          _buildSavingsTab(),
          _buildDefiTab(),
        ],
      ),
    );
  }

  Widget _buildStakingTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Stats banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [AppColors.accent.withOpacity(0.1), AppColors.cyan.withOpacity(0.05)],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.accent.withOpacity(0.2)),
            ),
            child: Row(
              children: [
                _buildStatBlock('Total Staked', '\$0.00'),
                Container(width: 1, height: 40, color: AppColors.border),
                _buildStatBlock('Rewards Earned', '\$0.00'),
                Container(width: 1, height: 40, color: AppColors.border),
                _buildStatBlock('Active Stakes', '0'),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const Text('Available for Staking', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.foreground)),
          const SizedBox(height: 12),
          ..._stakingProducts.map((product) => _buildStakingCard(product)),
        ],
      ),
    );
  }

  Widget _buildStatBlock(String label, String value) {
    return Expanded(
      child: Column(
        children: [
          Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.foreground)),
          const SizedBox(height: 2),
          Text(label, style: TextStyle(fontSize: 10, color: AppColors.muted)),
        ],
      ),
    );
  }

  Widget _buildStakingCard(Map<String, dynamic> product) {
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
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.border),
                ),
                child: Center(child: Text(product['icon'] as String, style: const TextStyle(fontSize: 18))),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(product['coin'] as String, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.foreground)),
                    Text(product['name'] as String, style: TextStyle(fontSize: 11, color: AppColors.muted)),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    '${product['apy']}% APY',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.accent),
                  ),
                  Text('${product['lockDays']}d lock', style: TextStyle(fontSize: 11, color: AppColors.muted)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _buildInfoTag('Min: ${product['minAmount']} ${product['coin']}'),
              const SizedBox(width: 8),
              _buildInfoTag('TVL: ${product['tvl']}'),
              const Spacer(),
              ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                  minimumSize: Size.zero,
                ),
                child: const Text('Stake', style: TextStyle(fontSize: 12)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInfoTag(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: AppColors.border),
      ),
      child: Text(text, style: TextStyle(fontSize: 10, color: AppColors.muted, fontWeight: FontWeight.w500)),
    );
  }

  Widget _buildSavingsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.savings_rounded, color: AppColors.accent, size: 20),
                    const SizedBox(width: 8),
                    const Text('Flexible Savings', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.foreground)),
                  ],
                ),
                const SizedBox(height: 4),
                Text('Earn daily interest with no lock-up period', style: TextStyle(fontSize: 12, color: AppColors.muted)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          ..._savingsProducts.map((product) => _buildSavingsCard(product)),
        ],
      ),
    );
  }

  Widget _buildSavingsCard(Map<String, dynamic> product) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: Center(child: Text(product['icon'] as String, style: const TextStyle(fontSize: 18))),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(product['coin'] as String, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.foreground)),
                Row(
                  children: [
                    Text(product['name'] as String, style: TextStyle(fontSize: 11, color: AppColors.muted)),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                      decoration: BoxDecoration(
                        color: AppColors.accent.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text('Flexible', style: TextStyle(fontSize: 9, color: AppColors.accent, fontWeight: FontWeight.w600)),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text('${product['apy']}%', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.accent)),
              Text('APY', style: TextStyle(fontSize: 10, color: AppColors.muted)),
            ],
          ),
          const SizedBox(width: 12),
          ElevatedButton(
            onPressed: () {},
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              minimumSize: Size.zero,
            ),
            child: const Text('Subscribe', style: TextStyle(fontSize: 11)),
          ),
        ],
      ),
    );
  }

  Widget _buildDefiTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [AppColors.purple.withOpacity(0.1), AppColors.cyan.withOpacity(0.05)],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.purple.withOpacity(0.2)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('DeFi Vaults', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.foreground)),
                      const SizedBox(height: 4),
                      Text('Optimized yield farming strategies', style: TextStyle(fontSize: 12, color: AppColors.muted)),
                    ],
                  ),
                ),
                Icon(Icons.rocket_launch_rounded, size: 40, color: AppColors.purple.withOpacity(0.4)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          ..._defiVaults.map((vault) => _buildVaultCard(vault)),
        ],
      ),
    );
  }

  Widget _buildVaultCard(Map<String, dynamic> vault) {
    final riskColor = vault['risk'] == 'Low' ? AppColors.accent : AppColors.warning;
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
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.purple.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.auto_awesome, color: AppColors.purple, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(vault['name'] as String, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.foreground)),
                    Text(vault['protocol'] as String, style: TextStyle(fontSize: 11, color: AppColors.muted)),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text('${vault['apy']}%', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.accent)),
                  Text('APY', style: TextStyle(fontSize: 10, color: AppColors.muted)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _buildInfoTag('TVL: ${vault['tvl']}'),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: riskColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text('${vault['risk']} Risk', style: TextStyle(fontSize: 10, color: riskColor, fontWeight: FontWeight.w600)),
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                  minimumSize: Size.zero,
                  backgroundColor: AppColors.purple,
                ),
                child: const Text('Deposit', style: TextStyle(fontSize: 12)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
