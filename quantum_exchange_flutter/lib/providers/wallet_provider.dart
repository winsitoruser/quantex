import 'package:flutter/material.dart';
import '../models/crypto_pair.dart';
import '../data/mock_data.dart';

class WalletProvider extends ChangeNotifier {
  List<WalletAsset> _assets = walletAssets;
  bool _balanceVisible = true;

  List<WalletAsset> get assets => _assets;
  bool get balanceVisible => _balanceVisible;

  double get totalBalance =>
      _assets.fold(0.0, (sum, asset) => sum + asset.value);

  double get totalChange {
    if (totalBalance == 0) return 0;
    double weightedChange = 0;
    for (final asset in _assets) {
      weightedChange += (asset.value / totalBalance) * asset.change24h;
    }
    return weightedChange;
  }

  void toggleBalanceVisibility() {
    _balanceVisible = !_balanceVisible;
    notifyListeners();
  }
}
