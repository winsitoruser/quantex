import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../theme/app_colors.dart';
import '../../providers/auth_provider.dart';
import '../auth/login_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(icon: const Icon(Icons.settings_outlined, size: 22), onPressed: () {}),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // User Info Header
            Container(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      gradient: AppColors.accentGradient,
                      shape: BoxShape.circle,
                    ),
                    child: const Center(
                      child: Text(
                        'AQ',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppColors.background,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          auth.username,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: AppColors.foreground,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          auth.userId,
                          style: TextStyle(fontSize: 12, color: AppColors.muted),
                        ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            _buildBadge(auth.vipLevel, AppColors.accent),
                            const SizedBox(width: 6),
                            if (auth.kycVerified)
                              _buildBadge('KYC ✓', AppColors.info),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right, color: AppColors.muted),
                ],
              ),
            ),
            const Divider(),
            // Quick Actions Grid
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildQuickAction(context, Icons.person_outline, 'Profile'),
                  _buildQuickAction(context, Icons.verified_user_outlined, 'KYC'),
                  _buildQuickAction(context, Icons.account_balance_wallet_outlined, 'Assets'),
                  _buildQuickAction(context, Icons.history, 'History'),
                ],
              ),
            ),
            const SizedBox(height: 8),
            // Settings sections
            _buildSettingsSection([
              _SettingsItem(Icons.security, 'Security Center', subtitle: '2FA, Password, Anti-phishing'),
              _SettingsItem(Icons.notifications_outlined, 'Notifications', subtitle: 'Push, Email, SMS'),
              _SettingsItem(Icons.language, 'Language', trailing: 'English'),
              _SettingsItem(Icons.attach_money, 'Currency', trailing: 'USD'),
            ]),
            const SizedBox(height: 12),
            _buildSettingsSection([
              _SettingsItem(Icons.card_giftcard, 'Referral Program', subtitle: 'Earn up to 40% commission'),
              _SettingsItem(Icons.workspace_premium, 'VIP Program', subtitle: 'Current: VIP 2'),
              _SettingsItem(Icons.support_agent, 'Help Center'),
              _SettingsItem(Icons.description_outlined, 'Legal & About'),
            ]),
            const SizedBox(height: 12),
            // Logout button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        backgroundColor: AppColors.card,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        title: const Text('Log Out', style: TextStyle(color: AppColors.foreground)),
                        content: const Text('Are you sure you want to log out?', style: TextStyle(color: AppColors.muted)),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(ctx),
                            child: const Text('Cancel', style: TextStyle(color: AppColors.muted)),
                          ),
                          TextButton(
                            onPressed: () {
                              auth.logout();
                              Navigator.pop(ctx);
                              Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(builder: (_) => const LoginScreen()),
                              );
                            },
                            child: const Text('Log Out', style: TextStyle(color: AppColors.danger)),
                          ),
                        ],
                      ),
                    );
                  },
                  icon: const Icon(Icons.logout, size: 18),
                  label: const Text('Log Out', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.danger.withOpacity(0.1),
                    foregroundColor: AppColors.danger,
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),
            // App version
            Text(
              'Quantum Exchange v1.0.0',
              style: TextStyle(fontSize: 11, color: AppColors.muted.withOpacity(0.5)),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildBadge(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        text,
        style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: color),
      ),
    );
  }

  Widget _buildQuickAction(BuildContext context, IconData icon, String label) {
    return GestureDetector(
      onTap: () {},
      child: Column(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.border),
            ),
            child: Icon(icon, color: AppColors.foreground, size: 22),
          ),
          const SizedBox(height: 6),
          Text(label, style: TextStyle(fontSize: 11, color: AppColors.muted, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  Widget _buildSettingsSection(List<_SettingsItem> items) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: items.asMap().entries.map((entry) {
          final index = entry.key;
          final item = entry.value;
          return Column(
            children: [
              InkWell(
                onTap: () {},
                borderRadius: BorderRadius.only(
                  topLeft: index == 0 ? const Radius.circular(16) : Radius.zero,
                  topRight: index == 0 ? const Radius.circular(16) : Radius.zero,
                  bottomLeft: index == items.length - 1 ? const Radius.circular(16) : Radius.zero,
                  bottomRight: index == items.length - 1 ? const Radius.circular(16) : Radius.zero,
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  child: Row(
                    children: [
                      Icon(item.icon, size: 20, color: AppColors.muted),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              item.label,
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.foreground),
                            ),
                            if (item.subtitle != null)
                              Text(item.subtitle!, style: TextStyle(fontSize: 11, color: AppColors.muted)),
                          ],
                        ),
                      ),
                      if (item.trailing != null)
                        Text(item.trailing!, style: TextStyle(fontSize: 13, color: AppColors.accent, fontWeight: FontWeight.w500)),
                      const SizedBox(width: 4),
                      const Icon(Icons.chevron_right, size: 18, color: AppColors.muted),
                    ],
                  ),
                ),
              ),
              if (index < items.length - 1)
                const Divider(height: 0, indent: 48),
            ],
          );
        }).toList(),
      ),
    );
  }
}

class _SettingsItem {
  final IconData icon;
  final String label;
  final String? subtitle;
  final String? trailing;

  const _SettingsItem(this.icon, this.label, {this.subtitle, this.trailing});
}
