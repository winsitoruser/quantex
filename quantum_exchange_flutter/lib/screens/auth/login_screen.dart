import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../theme/app_colors.dart';
import '../../providers/auth_provider.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _rememberMe = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
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
                      const Text(
                        'Quantum',
                        style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.foreground),
                      ),
                      Text(
                        'EXCHANGE',
                        style: TextStyle(fontSize: 9, fontWeight: FontWeight.w600, color: AppColors.accent, letterSpacing: 3),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 40),
              const Text(
                'Welcome Back',
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: AppColors.foreground),
              ),
              const SizedBox(height: 4),
              Text(
                'Sign in to continue trading',
                style: TextStyle(fontSize: 14, color: AppColors.muted),
              ),
              const SizedBox(height: 32),
              // Email field
              const Text('Email', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.foreground)),
              const SizedBox(height: 8),
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
              // Password field
              const Text('Password', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.foreground)),
              const SizedBox(height: 8),
              TextField(
                controller: _passwordController,
                obscureText: _obscurePassword,
                style: const TextStyle(fontSize: 14, color: AppColors.foreground),
                decoration: InputDecoration(
                  hintText: 'Enter your password',
                  prefixIcon: const Icon(Icons.lock_outline, size: 20, color: AppColors.muted),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                      size: 20,
                      color: AppColors.muted,
                    ),
                    onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              // Remember me & Forgot password
              Row(
                children: [
                  GestureDetector(
                    onTap: () => setState(() => _rememberMe = !_rememberMe),
                    child: Row(
                      children: [
                        Icon(
                          _rememberMe ? Icons.check_box : Icons.check_box_outline_blank,
                          size: 20,
                          color: _rememberMe ? AppColors.accent : AppColors.muted,
                        ),
                        const SizedBox(width: 6),
                        Text('Remember me', style: TextStyle(fontSize: 13, color: AppColors.muted)),
                      ],
                    ),
                  ),
                  const Spacer(),
                  GestureDetector(
                    onTap: () {},
                    child: const Text(
                      'Forgot Password?',
                      style: TextStyle(fontSize: 13, color: AppColors.accent, fontWeight: FontWeight.w600),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 28),
              // Login button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    final auth = context.read<AuthProvider>();
                    auth.login(_emailController.text, _passwordController.text);
                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text('Sign In', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                ),
              ),
              const SizedBox(height: 16),
              // Divider
              Row(
                children: [
                  const Expanded(child: Divider(color: AppColors.border)),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Text('or', style: TextStyle(fontSize: 13, color: AppColors.muted)),
                  ),
                  const Expanded(child: Divider(color: AppColors.border)),
                ],
              ),
              const SizedBox(height: 16),
              // Social login buttons
              _buildSocialButton(Icons.g_mobiledata_rounded, 'Continue with Google'),
              const SizedBox(height: 10),
              _buildSocialButton(Icons.apple_rounded, 'Continue with Apple'),
              const SizedBox(height: 32),
              // Register link
              Center(
                child: GestureDetector(
                  onTap: () => Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (_) => const RegisterScreen()),
                  ),
                  child: RichText(
                    text: TextSpan(
                      text: "Don't have an account? ",
                      style: TextStyle(fontSize: 14, color: AppColors.muted),
                      children: [
                        TextSpan(
                          text: 'Sign Up',
                          style: TextStyle(color: AppColors.accent, fontWeight: FontWeight.w700),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSocialButton(IconData icon, String label) {
    return SizedBox(
      width: double.infinity,
      child: OutlinedButton.icon(
        onPressed: () {},
        icon: Icon(icon, size: 22),
        label: Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.foreground,
          side: const BorderSide(color: AppColors.border),
          padding: const EdgeInsets.symmetric(vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
    );
  }
}
