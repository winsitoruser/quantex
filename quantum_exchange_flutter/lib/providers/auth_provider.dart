import 'package:flutter/material.dart';

class AuthProvider extends ChangeNotifier {
  bool _isLoggedIn = true;
  String _username = 'AlexQuantum';
  String _userId = 'QX-78291034';
  String _vipLevel = 'VIP 2';
  bool _kycVerified = true;

  bool get isLoggedIn => _isLoggedIn;
  String get username => _username;
  String get userId => _userId;
  String get vipLevel => _vipLevel;
  bool get kycVerified => _kycVerified;

  void login(String email, String password) {
    _isLoggedIn = true;
    notifyListeners();
  }

  void logout() {
    _isLoggedIn = false;
    notifyListeners();
  }

  void register(String email, String password) {
    _isLoggedIn = true;
    notifyListeners();
  }
}
