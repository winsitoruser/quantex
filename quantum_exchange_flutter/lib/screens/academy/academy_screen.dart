import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';

class AcademyScreen extends StatefulWidget {
  const AcademyScreen({super.key});

  @override
  State<AcademyScreen> createState() => _AcademyScreenState();
}

class _AcademyScreenState extends State<AcademyScreen> {
  String _selectedCategory = 'All';

  final List<String> _categories = ['All', 'Beginner', 'Trading', 'DeFi', 'Security', 'Analysis'];

  final List<Map<String, dynamic>> _courses = [
    {
      'title': 'Crypto Trading 101',
      'description': 'Learn the fundamentals of cryptocurrency trading from scratch',
      'category': 'Beginner',
      'level': 'Beginner',
      'lessons': 12,
      'duration': '2h 30m',
      'icon': Icons.school_rounded,
      'color': AppColors.accent,
      'progress': 0.0,
    },
    {
      'title': 'Technical Analysis Mastery',
      'description': 'Master chart patterns, indicators, and trading strategies',
      'category': 'Analysis',
      'level': 'Intermediate',
      'lessons': 18,
      'duration': '4h 15m',
      'icon': Icons.candlestick_chart_rounded,
      'color': AppColors.info,
      'progress': 0.3,
    },
    {
      'title': 'DeFi Deep Dive',
      'description': 'Understanding decentralized finance protocols and yield farming',
      'category': 'DeFi',
      'level': 'Advanced',
      'lessons': 15,
      'duration': '3h 45m',
      'icon': Icons.account_tree_rounded,
      'color': AppColors.purple,
      'progress': 0.0,
    },
    {
      'title': 'Wallet Security Guide',
      'description': 'Protect your crypto assets with best security practices',
      'category': 'Security',
      'level': 'Beginner',
      'lessons': 8,
      'duration': '1h 20m',
      'icon': Icons.shield_rounded,
      'color': AppColors.warning,
      'progress': 0.65,
    },
    {
      'title': 'Advanced Trading Strategies',
      'description': 'Futures, options, and advanced order types explained',
      'category': 'Trading',
      'level': 'Advanced',
      'lessons': 20,
      'duration': '5h',
      'icon': Icons.auto_graph_rounded,
      'color': AppColors.cyan,
      'progress': 0.0,
    },
    {
      'title': 'Understanding Blockchain',
      'description': 'How blockchain technology works and its applications',
      'category': 'Beginner',
      'level': 'Beginner',
      'lessons': 10,
      'duration': '2h',
      'icon': Icons.link_rounded,
      'color': AppColors.danger,
      'progress': 1.0,
    },
  ];

  List<Map<String, dynamic>> get _filteredCourses {
    if (_selectedCategory == 'All') return _courses;
    return _courses.where((c) => c['category'] == _selectedCategory).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Academy')),
      body: CustomScrollView(
        slivers: [
          // Search bar
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: TextField(
                style: const TextStyle(fontSize: 14, color: AppColors.foreground),
                decoration: const InputDecoration(
                  hintText: 'Search courses & articles...',
                  prefixIcon: Icon(Icons.search, size: 20, color: AppColors.muted),
                  contentPadding: EdgeInsets.symmetric(vertical: 10),
                  isDense: true,
                ),
              ),
            ),
          ),
          // Featured banner
          SliverToBoxAdapter(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
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
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.accent.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text('NEW', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: AppColors.accent)),
                        ),
                        const SizedBox(height: 8),
                        const Text('Learn & Earn', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.foreground)),
                        const SizedBox(height: 4),
                        Text('Complete courses and earn crypto rewards', style: TextStyle(fontSize: 12, color: AppColors.muted)),
                      ],
                    ),
                  ),
                  Icon(Icons.emoji_events_rounded, size: 56, color: AppColors.accent.withOpacity(0.3)),
                ],
              ),
            ),
          ),
          // Category filter chips
          SliverToBoxAdapter(
            child: Container(
              height: 48,
              margin: const EdgeInsets.only(top: 16),
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
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
                            fontSize: 13,
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
          // Course heading
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: Text(
                '${_filteredCourses.length} Courses',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.foreground),
              ),
            ),
          ),
          // Course list
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                final course = _filteredCourses[index];
                return _buildCourseCard(course);
              },
              childCount: _filteredCourses.length,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 20)),
        ],
      ),
    );
  }

  Widget _buildCourseCard(Map<String, dynamic> course) {
    final color = course['color'] as Color;
    final progress = course['progress'] as double;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
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
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(course['icon'] as IconData, color: color, size: 22),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      course['title'] as String,
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.foreground),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      course['description'] as String,
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
              _buildTag(course['level'] as String, color),
              const SizedBox(width: 8),
              Icon(Icons.play_circle_outline, size: 14, color: AppColors.muted),
              const SizedBox(width: 2),
              Text('${course['lessons']} lessons', style: TextStyle(fontSize: 11, color: AppColors.muted)),
              const SizedBox(width: 12),
              Icon(Icons.access_time, size: 14, color: AppColors.muted),
              const SizedBox(width: 2),
              Text(course['duration'] as String, style: TextStyle(fontSize: 11, color: AppColors.muted)),
              const Spacer(),
              if (progress >= 1.0)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.accent.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.check_circle, size: 12, color: AppColors.accent),
                      const SizedBox(width: 4),
                      const Text('Completed', style: TextStyle(fontSize: 10, color: AppColors.accent, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
            ],
          ),
          if (progress > 0 && progress < 1.0) ...[
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: progress,
                      backgroundColor: AppColors.border,
                      valueColor: AlwaysStoppedAnimation(color),
                      minHeight: 4,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Text('${(progress * 100).toInt()}%', style: TextStyle(fontSize: 11, color: AppColors.muted, fontWeight: FontWeight.w600)),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildTag(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(text, style: TextStyle(fontSize: 10, color: color, fontWeight: FontWeight.w600)),
    );
  }
}
