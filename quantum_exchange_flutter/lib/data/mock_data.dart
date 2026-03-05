import 'dart:math';
import '../models/crypto_pair.dart';

final _random = Random(42);

List<double> _generateSparkline(double base, double volatility) {
  final points = <double>[];
  double current = base;
  for (int i = 0; i < 24; i++) {
    current += (_random.nextDouble() - 0.48) * volatility;
    points.add(current);
  }
  return points;
}

final List<CryptoPair> cryptoPairs = [
  CryptoPair(
    id: 'btc-usdt', symbol: 'BTC/USDT', name: 'Bitcoin',
    price: 97842.53, change24h: 2.34, volume24h: 28540000000,
    marketCap: 1920000000000, high24h: 98500.0, low24h: 95200.0,
    icon: '₿', sparkline: _generateSparkline(97000, 500),
  ),
  CryptoPair(
    id: 'eth-usdt', symbol: 'ETH/USDT', name: 'Ethereum',
    price: 3456.78, change24h: 1.87, volume24h: 15230000000,
    marketCap: 415000000000, high24h: 3520.0, low24h: 3380.0,
    icon: 'Ξ', sparkline: _generateSparkline(3400, 30),
  ),
  CryptoPair(
    id: 'bnb-usdt', symbol: 'BNB/USDT', name: 'BNB',
    price: 634.21, change24h: -0.54, volume24h: 1850000000,
    marketCap: 94000000000, high24h: 642.0, low24h: 628.0,
    icon: '⬡', sparkline: _generateSparkline(634, 5),
  ),
  CryptoPair(
    id: 'sol-usdt', symbol: 'SOL/USDT', name: 'Solana',
    price: 198.45, change24h: 5.67, volume24h: 4120000000,
    marketCap: 87000000000, high24h: 203.0, low24h: 186.5,
    icon: '◎', sparkline: _generateSparkline(195, 4),
  ),
  CryptoPair(
    id: 'xrp-usdt', symbol: 'XRP/USDT', name: 'XRP',
    price: 2.34, change24h: -1.23, volume24h: 3450000000,
    marketCap: 134000000000, high24h: 2.42, low24h: 2.28,
    icon: '✕', sparkline: _generateSparkline(2.3, 0.05),
  ),
  CryptoPair(
    id: 'ada-usdt', symbol: 'ADA/USDT', name: 'Cardano',
    price: 0.98, change24h: 3.45, volume24h: 890000000,
    marketCap: 34500000000, high24h: 1.02, low24h: 0.94,
    icon: '₳', sparkline: _generateSparkline(0.96, 0.02),
  ),
  CryptoPair(
    id: 'avax-usdt', symbol: 'AVAX/USDT', name: 'Avalanche',
    price: 38.92, change24h: -2.14, volume24h: 620000000,
    marketCap: 14200000000, high24h: 40.5, low24h: 37.8,
    icon: '▲', sparkline: _generateSparkline(39, 0.8),
  ),
  CryptoPair(
    id: 'doge-usdt', symbol: 'DOGE/USDT', name: 'Dogecoin',
    price: 0.324, change24h: 8.92, volume24h: 2340000000,
    marketCap: 47000000000, high24h: 0.338, low24h: 0.295,
    icon: 'Ð', sparkline: _generateSparkline(0.31, 0.01),
  ),
  CryptoPair(
    id: 'dot-usdt', symbol: 'DOT/USDT', name: 'Polkadot',
    price: 7.82, change24h: 1.56, volume24h: 340000000,
    marketCap: 10800000000, high24h: 8.05, low24h: 7.62,
    icon: '●', sparkline: _generateSparkline(7.8, 0.15),
  ),
  CryptoPair(
    id: 'link-usdt', symbol: 'LINK/USDT', name: 'Chainlink',
    price: 18.45, change24h: -0.89, volume24h: 560000000,
    marketCap: 10900000000, high24h: 19.1, low24h: 18.0,
    icon: '⬡', sparkline: _generateSparkline(18.4, 0.3),
  ),
  CryptoPair(
    id: 'matic-usdt', symbol: 'MATIC/USDT', name: 'Polygon',
    price: 0.89, change24h: 4.21, volume24h: 420000000,
    marketCap: 8300000000, high24h: 0.92, low24h: 0.85,
    icon: '⬡', sparkline: _generateSparkline(0.88, 0.02),
  ),
  CryptoPair(
    id: 'uni-usdt', symbol: 'UNI/USDT', name: 'Uniswap',
    price: 12.34, change24h: -3.21, volume24h: 280000000,
    marketCap: 7400000000, high24h: 13.0, low24h: 12.1,
    icon: '🦄', sparkline: _generateSparkline(12.3, 0.25),
  ),
];

final List<WalletAsset> walletAssets = [
  WalletAsset(symbol: 'BTC', name: 'Bitcoin', balance: 0.5432, value: 53139.42, change24h: 2.34, icon: '₿'),
  WalletAsset(symbol: 'ETH', name: 'Ethereum', balance: 12.845, value: 44391.74, change24h: 1.87, icon: 'Ξ'),
  WalletAsset(symbol: 'USDT', name: 'Tether', balance: 25000.0, value: 25000.0, change24h: 0.01, icon: '\$'),
  WalletAsset(symbol: 'SOL', name: 'Solana', balance: 45.23, value: 8975.91, change24h: 5.67, icon: '◎'),
  WalletAsset(symbol: 'BNB', name: 'BNB', balance: 8.5, value: 5390.79, change24h: -0.54, icon: '⬡'),
  WalletAsset(symbol: 'XRP', name: 'XRP', balance: 5000.0, value: 11700.0, change24h: -1.23, icon: '✕'),
  WalletAsset(symbol: 'ADA', name: 'Cardano', balance: 10000.0, value: 9800.0, change24h: 3.45, icon: '₳'),
  WalletAsset(symbol: 'DOGE', name: 'Dogecoin', balance: 15000.0, value: 4860.0, change24h: 8.92, icon: 'Ð'),
];

final List<String> announcements = [
  '🔥 Quantum Exchange launches Perpetual Futures trading — Up to 100x leverage',
  '🎁 New user bonus: Deposit & get up to 5,000 USDT in rewards',
  '📢 SOL/USDT trading competition — \$50,000 prize pool',
  '🚀 List new tokens: PEPE, WIF, JUP now available for spot trading',
];

Map<String, List<OrderBookEntry>> generateOrderBook(double basePrice) {
  final asks = <OrderBookEntry>[];
  final bids = <OrderBookEntry>[];
  final rng = Random();

  double askTotal = 0;
  double bidTotal = 0;

  for (int i = 0; i < 15; i++) {
    final askPrice = basePrice + (i + 1) * basePrice * 0.0002;
    final askAmount = rng.nextDouble() * 2 + 0.01;
    askTotal += askAmount;
    asks.add(OrderBookEntry(price: askPrice, amount: askAmount, total: askTotal));

    final bidPrice = basePrice - (i + 1) * basePrice * 0.0002;
    final bidAmount = rng.nextDouble() * 2 + 0.01;
    bidTotal += bidAmount;
    bids.add(OrderBookEntry(price: bidPrice, amount: bidAmount, total: bidTotal));
  }

  return {'asks': asks.reversed.toList(), 'bids': bids};
}

List<TradeEntry> generateTradeHistory(double basePrice) {
  final trades = <TradeEntry>[];
  final now = DateTime.now();
  final rng = Random();

  for (int i = 0; i < 30; i++) {
    final time = now.subtract(Duration(seconds: i * 15));
    final side = rng.nextDouble() > 0.5 ? 'buy' : 'sell';
    final price = basePrice + (rng.nextDouble() - 0.5) * basePrice * 0.002;
    final amount = rng.nextDouble() * 1.5 + 0.001;

    final timeStr =
        '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}:${time.second.toString().padLeft(2, '0')}';
    trades.add(TradeEntry(id: 'trade-$i', price: price, amount: amount, time: timeStr, side: side));
  }

  return trades;
}

List<CandlestickData> generateCandlestickData(double basePrice, {int count = 100}) {
  final data = <CandlestickData>[];
  double current = basePrice * 0.85;
  final now = DateTime.now().millisecondsSinceEpoch ~/ 1000;
  final rng = Random();

  for (int i = 0; i < count; i++) {
    final open = current;
    final volatility = current * 0.02;
    final close = open + (rng.nextDouble() - 0.45) * volatility;
    final high = max(open, close) + rng.nextDouble() * volatility * 0.5;
    final low = min(open, close) - rng.nextDouble() * volatility * 0.5;

    data.add(CandlestickData(
      time: now - (count - i) * 3600,
      open: open,
      high: high,
      low: low,
      close: close,
    ));

    current = close;
  }

  return data;
}

double max(double a, double b) => a > b ? a : b;
double min(double a, double b) => a < b ? a : b;
