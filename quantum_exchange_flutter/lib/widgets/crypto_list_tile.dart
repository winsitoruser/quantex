import 'package:flutter/material.dart';
import '../models/crypto_pair.dart';
import '../theme/app_colors.dart';
import '../utils/formatters.dart';
import 'mini_chart.dart';

class CryptoListTile extends StatelessWidget {
  final CryptoPair pair;
  final VoidCallback? onTap;
  final bool showChart;

  const CryptoListTile({
    super.key,
    required this.pair,
    this.onTap,
    this.showChart = true,
  });

  @override
  Widget build(BuildContext context) {
    final isPositive = pair.change24h >= 0;
    final changeColor = isPositive ? AppColors.accent : AppColors.danger;

    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          children: [
            // Icon
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.border),
              ),
              child: Center(
                child: Text(
                  pair.icon,
                  style: const TextStyle(fontSize: 18),
                ),
              ),
            ),
            const SizedBox(width: 12),
            // Name & Volume
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        pair.symbol.split('/').first,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppColors.foreground,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '/USDT',
                        style: TextStyle(
                          fontSize: 10,
                          color: AppColors.muted,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Vol ${formatCurrency(pair.volume24h, compact: true)}',
                    style: TextStyle(
                      fontSize: 11,
                      color: AppColors.muted,
                    ),
                  ),
                ],
              ),
            ),
            // Mini Chart
            if (showChart) ...[
              SizedBox(
                width: 60,
                child: MiniChart(
                  data: pair.sparkline,
                  color: changeColor,
                  width: 60,
                  height: 28,
                ),
              ),
              const SizedBox(width: 12),
            ],
            // Price & Change
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  formatCurrency(pair.price),
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: AppColors.foreground,
                    fontFamily: 'monospace',
                  ),
                ),
                const SizedBox(height: 2),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      isPositive ? Icons.arrow_upward : Icons.arrow_downward,
                      size: 12,
                      color: changeColor,
                    ),
                    const SizedBox(width: 2),
                    Text(
                      formatPercent(pair.change24h),
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: changeColor,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
