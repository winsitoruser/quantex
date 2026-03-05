import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTheme {
  static ThemeData get darkTheme {
    final base = ThemeData.dark();
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.background,
      primaryColor: AppColors.accent,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.accent,
        secondary: AppColors.cyan,
        surface: AppColors.surface,
        error: AppColors.danger,
        onPrimary: Color(0xFF001A0F),
        onSecondary: AppColors.background,
        onSurface: AppColors.foreground,
        onError: Colors.white,
      ),
      textTheme: GoogleFonts.interTextTheme(base.textTheme).apply(
        bodyColor: AppColors.foreground,
        displayColor: AppColors.foreground,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.background,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        iconTheme: IconThemeData(color: AppColors.foreground, size: 20),
        titleTextStyle: TextStyle(
          color: AppColors.foreground,
          fontSize: 17,
          fontWeight: FontWeight.w700,
          letterSpacing: -0.3,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.background,
        selectedItemColor: AppColors.foreground,
        unselectedItemColor: AppColors.muted,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
        selectedLabelStyle: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, height: 1.8),
        unselectedLabelStyle: TextStyle(fontSize: 10, fontWeight: FontWeight.w400, height: 1.8),
      ),
      cardTheme: CardThemeData(
        color: AppColors.card,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.accent, width: 1),
        ),
        hintStyle: const TextStyle(color: AppColors.muted, fontSize: 13),
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        isDense: true,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.accent,
          foregroundColor: const Color(0xFF001A0F),
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 13),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          textStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, letterSpacing: -0.2),
        ),
      ),
      dividerTheme: const DividerThemeData(
        color: AppColors.border,
        thickness: 0.5,
        space: 0,
      ),
      tabBarTheme: TabBarThemeData(
        labelColor: AppColors.foreground,
        unselectedLabelColor: AppColors.muted,
        indicatorColor: AppColors.accent,
        indicatorSize: TabBarIndicatorSize.label,
        dividerHeight: 0.5,
        dividerColor: AppColors.border,
        labelStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
        unselectedLabelStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w400),
        overlayColor: WidgetStateProperty.all(Colors.transparent),
      ),
      splashColor: Colors.transparent,
      highlightColor: Colors.transparent,
    );
  }
}
