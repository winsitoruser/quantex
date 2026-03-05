import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../navigation/app_router.dart';

class AppRoot extends StatelessWidget {
  const AppRoot({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Quantum Exchange',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const AppRouter(),
    );
  }
}
