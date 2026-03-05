import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';

class NewsScreen extends StatefulWidget {
  const NewsScreen({super.key});

  @override
  State<NewsScreen> createState() => _NewsScreenState();
}

class _NewsScreenState extends State<NewsScreen> {
  String _selectedCategory = 'All';

  final List<String> _categories = ['All', 'Bitcoin', 'Ethereum', 'DeFi', 'Regulation', 'NFT', 'Analysis'];

  final List<Map<String, dynamic>> _articles = [
    {
      'title': 'Bitcoin Surges Past \$97K as Institutional Demand Grows',
      'summary': 'Bitcoin hits new highs as major financial institutions increase their crypto holdings.',
      'category': 'Bitcoin',
      'time': '2h ago',
      'source': 'CoinDesk',
      'featured': true,
      'readTime': '5 min',
    },
    {
      'title': 'Ethereum 2.0 Staking Reaches Record \$45B TVL',
      'summary': 'The Ethereum network sees unprecedented staking participation as validators grow.',
      'category': 'Ethereum',
      'time': '4h ago',
      'source': 'The Block',
      'featured': false,
      'readTime': '3 min',
    },
    {
      'title': 'SEC Approves New Crypto ETF Applications',
      'summary': 'Regulatory clarity brings optimism to the crypto market as new ETFs get approved.',
      'category': 'Regulation',
      'time': '6h ago',
      'source': 'Reuters',
      'featured': false,
      'readTime': '4 min',
    },
    {
      'title': 'DeFi Protocol Surpasses \$10B in Total Value Locked',
      'summary': 'Leading DeFi platforms see massive inflows as yield farming strategies mature.',
      'category': 'DeFi',
      'time': '8h ago',
      'source': 'DeFi Pulse',
      'featured': true,
      'readTime': '6 min',
    },
    {
      'title': 'Solana Network Upgrade Improves Transaction Speed by 40%',
      'summary': 'The latest Solana upgrade brings significant performance improvements to the network.',
      'category': 'Analysis',
      'time': '10h ago',
      'source': 'Decrypt',
      'featured': false,
      'readTime': '3 min',
    },
    {
      'title': 'NFT Market Shows Signs of Recovery with Blue-Chip Collections',
      'summary': 'Premium NFT collections lead market recovery as new utility features emerge.',
      'category': 'NFT',
      'time': '12h ago',
      'source': 'NFT Now',
      'featured': false,
      'readTime': '4 min',
    },
    {
      'title': 'Central Banks Accelerate CBDC Research Programs',
      'summary': 'Over 100 countries now exploring digital currencies, with several launching pilots.',
      'category': 'Regulation',
      'time': '1d ago',
      'source': 'Bloomberg',
      'featured': false,
      'readTime': '5 min',
    },
  ];

  final List<Map<String, dynamic>> _marketPulse = [
    {'label': 'BTC Dominance', 'value': '52.4%', 'change': '+0.3%', 'positive': true},
    {'label': 'Fear & Greed', 'value': '72', 'change': 'Greed', 'positive': true},
    {'label': 'Total MCap', 'value': '\$2.8T', 'change': '+2.1%', 'positive': true},
    {'label': '24h Volume', 'value': '\$98B', 'change': '-5.2%', 'positive': false},
  ];

  List<Map<String, dynamic>> get _filteredArticles {
    if (_selectedCategory == 'All') return _articles;
    return _articles.where((a) => a['category'] == _selectedCategory).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('News')),
      body: CustomScrollView(
        slivers: [
          // Market Pulse
          SliverToBoxAdapter(child: _buildMarketPulse()),
          // Category chips
          SliverToBoxAdapter(
            child: Container(
              height: 44,
              margin: const EdgeInsets.only(top: 8),
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _categories.length,
                itemBuilder: (context, index) {
                  final cat = _categories[index];
                  final isActive = _selectedCategory == cat;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedCategory = cat),
                    child: Container(
                      margin: const EdgeInsets.only(right: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: isActive ? AppColors.accent.withOpacity(0.1) : AppColors.card,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: isActive ? AppColors.accent.withOpacity(0.3) : AppColors.border,
                        ),
                      ),
                      child: Center(
                        child: Text(
                          cat,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: isActive ? AppColors.accent : AppColors.muted,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
          // Featured article
          if (_filteredArticles.any((a) => a['featured'] == true))
            SliverToBoxAdapter(
              child: _buildFeaturedArticle(
                _filteredArticles.firstWhere((a) => a['featured'] == true),
              ),
            ),
          // Article list
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: const Text('Latest', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.foreground)),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                final article = _filteredArticles[index];
                return _buildArticleCard(article);
              },
              childCount: _filteredArticles.length,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 20)),
        ],
      ),
    );
  }

  Widget _buildMarketPulse() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(12),
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
              const Icon(Icons.show_chart_rounded, size: 16, color: AppColors.accent),
              const SizedBox(width: 6),
              const Text('Market Pulse', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.foreground)),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: _marketPulse.map((item) {
              return Expanded(
                child: Column(
                  children: [
                    Text(item['value'] as String, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.foreground)),
                    const SizedBox(height: 2),
                    Text(
                      item['change'] as String,
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        color: item['positive'] as bool ? AppColors.accent : AppColors.danger,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(item['label'] as String, style: TextStyle(fontSize: 9, color: AppColors.muted)),
                  ],
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturedArticle(Map<String, dynamic> article) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 160,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [AppColors.accent.withOpacity(0.2), AppColors.cyan.withOpacity(0.1)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            ),
            child: Center(
              child: Icon(Icons.newspaper_rounded, size: 56, color: AppColors.accent.withOpacity(0.4)),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.accent.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text('FEATURED', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: AppColors.accent)),
                    ),
                    const Spacer(),
                    Text(article['time'] as String, style: TextStyle(fontSize: 11, color: AppColors.muted)),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  article['title'] as String,
                  style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppColors.foreground),
                ),
                const SizedBox(height: 6),
                Text(
                  article['summary'] as String,
                  style: TextStyle(fontSize: 13, color: AppColors.muted, height: 1.4),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Text(article['source'] as String, style: TextStyle(fontSize: 11, color: AppColors.info, fontWeight: FontWeight.w500)),
                    const SizedBox(width: 12),
                    Icon(Icons.access_time, size: 12, color: AppColors.muted),
                    const SizedBox(width: 2),
                    Text(article['readTime'] as String, style: TextStyle(fontSize: 11, color: AppColors.muted)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildArticleCard(Map<String, dynamic> article) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.info.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        article['category'] as String,
                        style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w600, color: AppColors.info),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(article['time'] as String, style: TextStyle(fontSize: 10, color: AppColors.muted)),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  article['title'] as String,
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.foreground, height: 1.3),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Text(article['source'] as String, style: TextStyle(fontSize: 10, color: AppColors.muted)),
                    const SizedBox(width: 8),
                    Icon(Icons.access_time, size: 10, color: AppColors.muted),
                    const SizedBox(width: 2),
                    Text(article['readTime'] as String, style: TextStyle(fontSize: 10, color: AppColors.muted)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.border),
            ),
            child: Icon(Icons.article_rounded, size: 28, color: AppColors.muted.withOpacity(0.3)),
          ),
        ],
      ),
    );
  }
}
