# SteamLauncher (ALPHA (1.))

**_SteamLauncher_** optimizes the setup process of each game in a simple and automatic way.

[forum cs.rin.ru support](https://cs.rin.ru/forum/viewtopic.php?f=20&t=116801)

**(1.) In the ALPHA version, substantial changes can make previous versions incompatible.**

#### Donate

> **Protect development and free things -- because their survival is in our hands.**
>
> **You can donate by clicking on [paypal.me](https://www.paypal.me/sak32009a).**

#### Screenshots

<img src="https://raw.githubusercontent.com/Sak32009/SteamLauncher/main/screenshots/screenshot_main.png" alt="screenshot-main" width="300">

## Introduction

**_SteamLauncher_** is a windows application that optimizes the setup process of each game in a simple and automatic way.

Instead of manually configuring each game, **_SteamLauncher_** automatically performs all operations for **Mr. Goldberg's Steam Emulator**.

For more information on the emulator: [gitlab](https://gitlab.com/Mr_Goldberg/goldberg_emulator) [cs.rin.ru](https://cs.rin.ru/forum/viewtopic.php?f=29&t=91627)

## Main Features

- **SteamRetriever** _(from v0.0.3)_
  - In a simple way: it is the one that extracts all the data from steam.
- **Mr. GoldBerg Emulator Autodownload** _(from v0.1.5)_
  - The first time you start the game, the emulator will be downloaded and extracted to the appropriate folder within SteamLauncher. This feature also includes auto updating of it.
- **SteamCloud** _(from v0.1.5)_
  - It is not properly as Steam Cloud, the saves game data is not saved on Steam but they are saved all within the folder **"PATH_STEAMLAUNCHER/data/steam_cloud/"** in portable mode or **"%APPDATA%/SteamLauncher/data/steam_cloud/"** in installer mode.
  - Backup and restore is done automatically or manually.
    - BACKUP: The automatic backup occurs when you start the game and close it, the manual instead takes place via the game contextmenu in the launcher.
    - RESTORE: The automatic restore occurs when you enter a game that was previously deleted from the launcher, the manual instead takes place via the game contextmenu in the launcher.

## Installation

**_SteamLauncher_** comes in two variants:

- Portable _(to carry in your pocket)_
- Installable _(recommended for extra features that portable doesn't offer)_

Download the latest version of the _SteamLauncher_ from the [GitHub Releases](https://github.com/Sak32009/SteamLauncher/releases).

To update **_SteamLauncher_**, simply download the new version from the GitHub releases page and run the installer or wait for the update notification directly from the app.

For the portable version, replace manually files.

## Small description of usage

When the application starts, you will be asked to create the account. Once done, you can insert games by simply dragging the game executable on the main application page in the appropriate section, fill out all the data, save and pressing the right click on the card game will open the context menu and press "Launch".

## Supported Mr. GoldBerg Steam Emulator features

- Set DLC.txt
- Set items.json
- Set default_items.json
- Set stats.txt
- Set achievements.json and images
- Set disable_overlay.txt
- Set disable_networking.txt
- Set offline.txt
- Set account_name.txt (inside steam_saves/settings)
- Set language.txt (inside steam_saves/settings)
- Set user_steam_id (inside steam_saves/settings)
- Set listen_port.txt (inside steam_saves/settings)
- Set steam_interfaces.txt (only if steam_api(64).dll is before May 2016)

## Unsupported Mr. GoldBerg Steam Emulator features

- All those not listed.

To solve this problem just go to the folder **"PATH_STEAMLAUNCHER/data/steam_retriever/APPID"** in portable mode or **"%APPDATA%/SteamLauncher/data/steam_retriever/"** in installer mode and enter the missing data.

**Attention! Supported features are always overwritten!**

## TODO

The first item in the list has priority.

- Integrate https://github.com/Sak32009/GetDLCInfoFromSteamDB into the launcher.

## FAQ

## Troubleshoots

## License

> _SteamLauncher_ is released under the following license: [MIT](https://github.com/Sak32009/SteamLauncher/blob/main/LICENSE)
