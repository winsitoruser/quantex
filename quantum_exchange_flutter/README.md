# Quantum Exchange - Flutter App

A modern crypto exchange mobile application built with Flutter, featuring a dark theme UI inspired by OKX.

## Features

- **Home** - Balance overview, quick actions, hot coins, market overview
- **Markets** - All crypto pairs with search, sort, and filter tabs
- **Trade** - Price chart (line), order book, trade history, buy/sell order form
- **Bots** - 6 trading bot strategies (Grid, DCA, Arbitrage, Rebalance, Signal, Martingale)
- **Wallet** - Portfolio distribution chart, asset list, deposit/withdraw/transfer
- **Earn** - Staking, flexible savings, DeFi vaults
- **Academy** - Courses with progress tracking, category filters
- **News** - Market pulse, featured articles, category filters
- **Auth** - Login/Register with password strength meter
- **Profile** - User settings, security, language/currency

## Tech Stack

- **Flutter** 3.x
- **Provider** for state management
- **fl_chart** for charts (line, pie)
- **Google Fonts** (Inter)
- **go_router** for navigation

## Getting Started

### Prerequisites

- Flutter SDK >= 3.2.0
- Dart SDK >= 3.2.0
- Android Studio / Xcode

### Installation

```bash
# Clone and navigate to the flutter project
cd quantum_exchange_flutter

# Install dependencies
flutter pub get

# Run on connected device/emulator
flutter run

# Build APK
flutter build apk --release

# Build iOS
flutter build ios --release
```

### Project Structure

```
lib/
├── main.dart                    # App entry point
├── app/
│   └── app.dart                 # MaterialApp root
├── theme/
│   ├── app_colors.dart          # Color constants
│   └── app_theme.dart           # ThemeData config
├── models/
│   └── crypto_pair.dart         # Data models
├── data/
│   └── mock_data.dart           # Mock data & generators
├── providers/
│   ├── auth_provider.dart       # Auth state
│   ├── market_provider.dart     # Market data & search
│   └── wallet_provider.dart     # Wallet state
├── navigation/
│   └── app_router.dart          # Bottom nav + IndexedStack
├── widgets/
│   ├── mini_chart.dart          # Sparkline chart widget
│   ├── section_header.dart      # Section title + action
│   └── crypto_list_tile.dart    # Crypto pair list item
└── screens/
    ├── home/home_screen.dart
    ├── markets/markets_screen.dart
    ├── trade/trade_screen.dart
    ├── wallet/wallet_screen.dart
    ├── bots/bots_screen.dart
    ├── earn/earn_screen.dart
    ├── academy/academy_screen.dart
    ├── news/news_screen.dart
    ├── auth/
    │   ├── login_screen.dart
    │   └── register_screen.dart
    └── profile/profile_screen.dart
```

## Color Palette

| Color       | Hex       | Usage              |
|-------------|-----------|-------------------|
| Background  | `#0B0E14` | Main background    |
| Card        | `#141821` | Cards, surfaces    |
| Border      | `#1E2333` | Borders, dividers  |
| Foreground  | `#E6E8EB` | Primary text       |
| Muted       | `#6B7280` | Secondary text     |
| Accent      | `#00C26F` | Primary action, buy|
| Danger      | `#EF4444` | Sell, errors       |
| Info        | `#3B82F6` | Information        |
| Warning     | `#F59E0B` | Warnings           |
| Purple      | `#8B5CF6` | DeFi, special      |
| Cyan        | `#06B6D4` | Secondary accent   |
