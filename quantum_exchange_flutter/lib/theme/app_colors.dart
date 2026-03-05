import 'package:flutter/material.dart';

class AppColors {
  // Core backgrounds - OKX-style deep blacks
  static const Color background = Color(0xFF0B0E11);
  static const Color surface = Color(0xFF12161C);
  static const Color card = Color(0xFF161A22);
  static const Color cardHover = Color(0xFF1C2029);
  static const Color elevated = Color(0xFF1E232D);

  // Borders
  static const Color border = Color(0xFF1E2330);
  static const Color borderLight = Color(0xFF272D3A);
  static const Color borderSubtle = Color(0xFF171B24);

  // Text hierarchy
  static const Color foreground = Color(0xFFECEDF0);
  static const Color textSecondary = Color(0xFFA0A4AD);
  static const Color muted = Color(0xFF5E6673);
  static const Color textTertiary = Color(0xFF454B57);

  // Brand / accent
  static const Color accent = Color(0xFF00D47E);
  static const Color accentDim = Color(0xFF00B86B);
  static const Color accentBg = Color(0x1400D47E);

  // Semantic
  static const Color danger = Color(0xFFFF4D5A);
  static const Color dangerBg = Color(0x14FF4D5A);
  static const Color warning = Color(0xFFFFC53D);
  static const Color warningBg = Color(0x14FFC53D);
  static const Color info = Color(0xFF4B8BFF);
  static const Color infoBg = Color(0x144B8BFF);
  static const Color purple = Color(0xFF8B5CF6);
  static const Color purpleBg = Color(0x148B5CF6);
  static const Color cyan = Color(0xFF06D6DD);

  // Gradients
  static const LinearGradient accentGradient = LinearGradient(
    colors: [Color(0xFF00D47E), Color(0xFF00B4D8)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient heroGradient = LinearGradient(
    colors: [Color(0xFF161A22), Color(0xFF12161C), Color(0x0800D47E)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient shimmerGradient = LinearGradient(
    colors: [Color(0xFF1E232D), Color(0xFF272D3A), Color(0xFF1E232D)],
  );
}
