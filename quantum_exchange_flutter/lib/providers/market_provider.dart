import 'package:flutter/material.dart';
import '../models/crypto_pair.dart';
import '../data/mock_data.dart';

class MarketProvider extends ChangeNotifier {
  List<CryptoPair> _pairs = cryptoPairs;
  String _searchQuery = '';
  String _sortBy = 'volume';
  bool _sortAsc = false;

  List<CryptoPair> get pairs {
    var filtered = _pairs.where((p) {
      if (_searchQuery.isEmpty) return true;
      final q = _searchQuery.toLowerCase();
      return p.symbol.toLowerCase().contains(q) ||
          p.name.toLowerCase().contains(q);
    }).toList();

    filtered.sort((a, b) {
      int cmp;
      switch (_sortBy) {
        case 'price':
          cmp = a.price.compareTo(b.price);
          break;
        case 'change':
          cmp = a.change24h.compareTo(b.change24h);
          break;
        case 'volume':
          cmp = a.volume24h.compareTo(b.volume24h);
          break;
        case 'name':
          cmp = a.name.compareTo(b.name);
          break;
        default:
          cmp = a.volume24h.compareTo(b.volume24h);
      }
      return _sortAsc ? cmp : -cmp;
    });

    return filtered;
  }

  String get searchQuery => _searchQuery;
  String get sortBy => _sortBy;
  bool get sortAsc => _sortAsc;

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void setSortBy(String sort) {
    if (_sortBy == sort) {
      _sortAsc = !_sortAsc;
    } else {
      _sortBy = sort;
      _sortAsc = false;
    }
    notifyListeners();
  }

  CryptoPair getPairById(String id) {
    return _pairs.firstWhere(
      (p) => p.id == id,
      orElse: () => _pairs.first,
    );
  }

  List<CryptoPair> get topGainers {
    final sorted = List<CryptoPair>.from(_pairs);
    sorted.sort((a, b) => b.change24h.compareTo(a.change24h));
    return sorted.take(5).toList();
  }

  List<CryptoPair> get topLosers {
    final sorted = List<CryptoPair>.from(_pairs);
    sorted.sort((a, b) => a.change24h.compareTo(b.change24h));
    return sorted.take(5).toList();
  }

  List<CryptoPair> get hotCoins => _pairs.take(5).toList();
}
