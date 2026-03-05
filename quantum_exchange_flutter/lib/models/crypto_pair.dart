class CryptoPair {
  final String id;
  final String symbol;
  final String name;
  final double price;
  final double change24h;
  final double volume24h;
  final double marketCap;
  final double high24h;
  final double low24h;
  final String icon;
  final List<double> sparkline;

  const CryptoPair({
    required this.id,
    required this.symbol,
    required this.name,
    required this.price,
    required this.change24h,
    required this.volume24h,
    required this.marketCap,
    required this.high24h,
    required this.low24h,
    required this.icon,
    required this.sparkline,
  });
}

class OrderBookEntry {
  final double price;
  final double amount;
  final double total;

  const OrderBookEntry({
    required this.price,
    required this.amount,
    required this.total,
  });
}

class TradeEntry {
  final String id;
  final double price;
  final double amount;
  final String time;
  final String side; // "buy" or "sell"

  const TradeEntry({
    required this.id,
    required this.price,
    required this.amount,
    required this.time,
    required this.side,
  });
}

class WalletAsset {
  final String symbol;
  final String name;
  final double balance;
  final double value;
  final double change24h;
  final String icon;

  const WalletAsset({
    required this.symbol,
    required this.name,
    required this.balance,
    required this.value,
    required this.change24h,
    required this.icon,
  });
}

class CandlestickData {
  final int time;
  final double open;
  final double high;
  final double low;
  final double close;

  const CandlestickData({
    required this.time,
    required this.open,
    required this.high,
    required this.low,
    required this.close,
  });
}
