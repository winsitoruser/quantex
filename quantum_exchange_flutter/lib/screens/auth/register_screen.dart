import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../theme/app_colors.dart';
import '../../providers/auth_provider.dart';
import 'login_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmController = TextEditingController();
  final _referralController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirm = true;
  bool _agreeTerms = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmController.dispose();
    _referralController.dispose();
    super.dispose();
  }

  double get _passwordStrength {
    final pw = _passwordController.text;
    if (pw.isEmpty) return 0;
    double strength = 0;
    if (pw.length >= 8) strength += 0.25;
    if (pw.contains(RegExp(r'[A-Z]'))) strength += 0.25;
    if (pw.contains(RegExp(r'[0-9]'))) strength += 0.25;
    if (pw.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'))) strength += 0.25;
    return strength;
  }

  Color get _strengthColor {
    if (_passwordStrength <= 0.25) return AppColors.danger;
    if (_passwordStrength <= 0.5) return AppColors.warning;
    if (_passwordStrength <= 0.75) return AppColors.info;
    return AppColors.accent;
  }

  String get _strengthLabel {
    if (_passwordStrength <= 0.25) return 'Weak';
    if (_passwordStrength <= 0.5) return 'Fair';
    if (_passwordStrength <= 0.75) return 'Good';
    return 'Strong';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 20),
              // Logo
              Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      gradient: AppColors.accentGradient,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.bolt, color: AppColors.background, size: 24),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Quantum', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.foreground)),
                      Text('EXCHANGE', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w600, color: AppColors.accent, letterSpacing: 3)),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 40),
              const Text('Create Account', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: AppColors.foreground)),
              const SizedBox(height: 4),
              Text('Start your crypto journey today', style: TextStyle(fontSize: 14, color: AppColors.muted)),
              const SizedBox(height: 32),
              // Email
              _buildLabel('Email'),
              TextField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                style: const TextStyle(fontSize: 14, color: AppColors.foreground),
                decoration: const InputDecoration(
                  hintText: 'Enter your email',
                  prefixIcon: Icon(Icons.email_outlined, size: 20, color: AppColors.muted),
                ),
              ),
              const SizedBox(height: 20),
              // Password
              _buildLabel('Password'),
              TextField(
                controller: _passwordController,
                obscureText: _obscurePassword,
                onChanged: (_) => setState(() {}),
                style: const TextStyle(fontSize: 14, color: AppColors.foreground),
                decoration: InputDecoration(
                  hintText: 'Create a strong password',
                  prefixIcon: const Icon(Icons.lock_outline, size: 20, color: AppColors.muted),
                  suffixIcon: IconButton(
                    icon: Icon(_obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined, size: 20, color: AppColors.muted),
                    onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                  ),
                ),
              ),
              if (_passwordController.text.isNotEmpty) ...[
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: _passwordStrength,
                          backgroundColor: AppColors.border,
                          valueColor: AlwaysStoppedAnimation(_strengthColor),
                          minHeight: 4,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(_strengthLabel, style: TextStyle(fontSize: 11, color: _strengthColor, fontWeight: FontWeight.w600)),
                  ],
                ),
              ],
              const SizedBox(height: 20),
              // Confirm Password
              _buildLabel('Confirm Password'),
              TextField(
                controller: _confirmController,
                obscureText: _obscureConfirm,
                style: const TextStyle(fontSize: 14, color: AppColors.foreground),
                decoration: InputDecoration(
                  hintText: 'Confirm your password',
                  prefixIcon: const Icon(Icons.lock_outline, size: 20, color: AppColors.muted),
                  suffixIcon: IconButton(
                    icon: Icon(_obscureConfirm ? Icons.visibility_off_outlined : Icons.visibility_outlined, size: 20, color: AppColors.muted),
                    onPressed: () => setState(() => _obscureConfirm = !_obscureConfirm),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              // Referral Code (optional)
              _buildLabel('Referral Code (Optional)'),
              TextField(
                controller: _referralController,
                style: const TextStyle(fontSize: 14, color: AppColors.foreground),
                decoration: const InputDecoration(
                  hintText: 'Enter referral code',
                  prefixIcon: Icon(Icons.card_giftcard_outlined, size: 20, color: AppColors.muted),
                ),
              ),
              const SizedBox(height: 20),
              // Terms agreement
              GestureDetector(
                onTap: () => setState(() => _agreeTerms = !_agreeTerms),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      _agreeTerms ? Icons.check_box : Icons.check_box_outline_blank,
                      size: 20,
                      color: _agreeTerms ? AppColors.accent : AppColors.muted,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: RichText(
                        text: TextSpan(
                          text: 'I agree to the ',
                          style: TextStyle(fontSize: 12, color: AppColors.muted),
                          children: [
                            TextSpan(text: 'Terms of Service', style: TextStyle(color: AppColors.accent, fontWeight: FontWeight.w600)),
                            const TextSpan(text: ' and '),
                            TextSpan(text: 'Privacy Policy', style: TextStyle(color: AppColors.accent, fontWeight: FontWeight.w600)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),
              // Register button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _agreeTerms
                      ? () {
                          final auth = context.read<AuthProvider>();
                          auth.register(_emailController.text, _passwordController.text);
                          Navigator.pop(context);
                        }
                      : null,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    disabledBackgroundColor: AppColors.accent.withOpacity(0.3),
                  ),
                  child: const Text('Create Account', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                ),
              ),
              const SizedBox(height: 24),
              // Login link
              Center(
                child: GestureDetector(
                  onTap: () => Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (_) => const LoginScreen()),
                  ),
                  child: RichText(
                    text: TextSpan(
                      text: 'Already have an account? ',
                      style: TextStyle(fontSize: 14, color: AppColors.muted),
                      children: [
                        TextSpan(text: 'Sign In', style: TextStyle(color: AppColors.accent, fontWeight: FontWeight.w700)),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(text, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.foreground)),
    );
  }
}
