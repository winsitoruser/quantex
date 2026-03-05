import 'package:intl/intl.dart';

String formatCurrency(double value, {bool compact = false}) {
  if (compact) {
    if (value >= 1e12) return '\$${(value / 1e12).toStringAsFixed(1)}T';
    if (value >= 1e9) return '\$${(value / 1e9).toStringAsFixed(1)}B';
    if (value >= 1e6) return '\$${(value / 1e6).toStringAsFixed(1)}M';
    if (value >= 1e3) return '\$${(value / 1e3).toStringAsFixed(1)}K';
  }
  if (value >= 1000) {
    return NumberFormat.currency(symbol: '\$', decimalDigits: 2).format(value);
  } else if (value >= 1) {
    return '\$${value.toStringAsFixed(2)}';
  } else {
    return '\$${value.toStringAsFixed(4)}';
  }
}

String formatPercent(double value) {
  final sign = value >= 0 ? '+' : '';
  return '$sign${value.toStringAsFixed(2)}%';
}

String formatNumber(double value, {int decimals = 2}) {
  if (value >= 1000) {
    return NumberFormat('#,##0.##').format(value);
  }
  return value.toStringAsFixed(decimals);
}

String formatCompact(double value) {
  if (value >= 1e12) return '${(value / 1e12).toStringAsFixed(1)}T';
  if (value >= 1e9) return '${(value / 1e9).toStringAsFixed(1)}B';
  if (value >= 1e6) return '${(value / 1e6).toStringAsFixed(1)}M';
  if (value >= 1e3) return '${(value / 1e3).toStringAsFixed(1)}K';
  return value.toStringAsFixed(2);
}

String formatPrice(double price) {
  if (price >= 1000) return NumberFormat('#,##0.00').format(price);
  if (price >= 1) return price.toStringAsFixed(2);
  if (price >= 0.01) return price.toStringAsFixed(4);
  return price.toStringAsFixed(6);
}
