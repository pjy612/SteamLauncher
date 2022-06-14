# SteamLauncher CHANGELOG

<a name="unreleased"></a>
## [Unreleased]


<a name="v0.2.2"></a>
## [v0.2.2] (2022-06-14)

#### _All_
- v0.2.2
- Merge branch 'main' of https://github.com/Sak32009/SteamLauncher
- fix: oooops, fixed launch game from commands line
- docs: updated CHANGELOG.md
- ci: fixed
#### _By type_
### Bug Fixes
- oooops, fixed launch game from commands line
### CI
- fixed
### Docs
- updated CHANGELOG.md

<a name="v0.2.1"></a>
## [v0.2.1] (2022-06-14)

#### _All_
- v0.2.1
- docs: updated readme and screenshots
- refactor: added option to disable automatic steam emulator updates
- ci: improvements
- refactor: navigare
- docs: spelling
- chore: updated dep
- mixed: updated dep, fixed an issue when settings were being saved, fixed minor issues, general optimizations, added rotary logs by day
- mixed: fix [#169](https://github.com/Sak32009/SteamLauncher/issues/169) ("config.yaml" is not saved in "data" folder), fix [#168](https://github.com/Sak32009/SteamLauncher/issues/168) (Show "not successful" notification after success manually backup), removed unnecessary notifications and logs.
- fix: console show
- chore: updated dep
- refactor: i forgot to edit my test
- fix: [#166](https://github.com/Sak32009/SteamLauncher/issues/166) failed to save achievement icons
- refactor: re-added console
- perf: improvements
- refactor: the reloading of the list of games in the home is now traced in one place, no longer in various places and manually as before.
- refactor: updated browserslist to chrome 102
- mixed: updated dep, updated yarn, updated package engine, removed tailwindcss in favor of bootstrap v5.2, fix [#170](https://github.com/Sak32009/SteamLauncher/issues/170) (data location is wrong if started in production mode without building the app), fix [#167](https://github.com/Sak32009/SteamLauncher/issues/167) (cannot move the window when scroll down), new ui and many bug fixes / improvements.
- chore: updated dep
- docs: updated CHANGELOG.md
- ci: probably fixed
- ci: probably fixed
- Merge branch 'main' of https://github.com/Sak32009/SteamLauncher
- ci: probably fixed
- ci: probably fixed
- docs: updated CHANGELOG.md
- ci: probably fixed
#### _By type_
### Bug Fixes
- console show
- [#166](https://github.com/Sak32009/SteamLauncher/issues/166) failed to save achievement icons
### CI
- improvements
- probably fixed
- probably fixed
- probably fixed
- probably fixed
- probably fixed
### Chore
- updated dep
- updated dep
- updated dep
### Code Refactoring
- added option to disable automatic steam emulator updates
- navigare
- i forgot to edit my test
- re-added console
- the reloading of the list of games in the home is now traced in one place, no longer in various places and manually as before.
- updated browserslist to chrome 102
### Docs
- updated readme and screenshots
- spelling
- updated CHANGELOG.md
- updated CHANGELOG.md
### Mixed
- updated dep, fixed an issue when settings were being saved, fixed minor issues, general optimizations, added rotary logs by day
- fix [#169](https://github.com/Sak32009/SteamLauncher/issues/169) ("config.yaml" is not saved in "data" folder), fix [#168](https://github.com/Sak32009/SteamLauncher/issues/168) (Show "not successful" notification after success manually backup), removed unnecessary notifications and logs.
- updated dep, updated yarn, updated package engine, removed tailwindcss in favor of bootstrap v5.2, fix [#170](https://github.com/Sak32009/SteamLauncher/issues/170) (data location is wrong if started in production mode without building the app), fix [#167](https://github.com/Sak32009/SteamLauncher/issues/167) (cannot move the window when scroll down), new ui and many bug fixes / improvements.
### Performance Improvements
- improvements

<a name="v0.2.0"></a>
## [v0.2.0] (2022-05-03)

#### _All_
- v0.2.0
- fix: incorrect "open save location" [#155](https://github.com/Sak32009/SteamLauncher/issues/155)
- fix: SteamCloud now tries to search for appid otherwise the game name is used
- feat: added SmartSteamLoader and its 3 settings in settings page (fix: failed to launch game [#154](https://github.com/Sak32009/SteamLauncher/issues/154))
- refactor: pretty code
- ci: probably fixed
- docs: updated CHANGELOG.md
- ci: test
- ci: test
#### _By type_
### Bug Fixes
- incorrect "open save location" [#155](https://github.com/Sak32009/SteamLauncher/issues/155)
- SteamCloud now tries to search for appid otherwise the game name is used
### CI
- probably fixed
- test
- test
### Code Refactoring
- pretty code
### Docs
- updated CHANGELOG.md
### Features
- added SmartSteamLoader and its 3 settings in settings page (fix: failed to launch game [#154](https://github.com/Sak32009/SteamLauncher/issues/154))

<a name="v0.1.9"></a>
## [v0.1.9] (2022-05-02)

#### _All_
- v0.1.9
- chore: updated dep
- fix: relative paths
- fix: notify when create account
- fix: handlebars global error
- refactor: replaced mustache with handlebars
- chore: updated dep
- feat: separated the game form into tabs
- feat: ludusavi customGames feature support [#153](https://github.com/Sak32009/SteamLauncher/issues/153)
- refactor: to close the console press C
- chore: updated dep
- fix: fixed paths in portable mode
- mixed: updated dependencies; replaced "navigo" with my own; replaced "steamclient_loader.exe" with my own; updated the ui of the forms; now disable_networking.txt has been separated from offline state; fixed a bug that if you launched a game, SteamLauncher would not open; added in game settings disable_lan_only.txt ( [#152](https://github.com/Sak32009/SteamLauncher/issues/152)  ), force_account_name.txt, force_language.txt, force_steamid.txt, force_listen_port.txt; bug fixes and app improvements.
- ci: build changelog only with pushing new version
- docs: updated CHANGELOG.md
- ci: fixed build-and-release.yml
- ci: fixed build-changelog.yml
- Update CHANGELOG.md
- changed: changelog header pattern test
- Update CHANGELOG.md
- Update build-changelog.yml
- Update build-changelog.yml
- Update build-changelog.yml
- Update build-changelog.yml
- changelog
- Update build-changelog.yml
- Update build-changelog.yml
- Update build-changelog.yml
- changelog
- changelog
- Update build-changelog.yml
- Update build-changelog.yml
- Update build-changelog.yml
- Update build-changelog.yml
- updated build-and-release workflow, added build-changelog workflow
- update my eslint config
#### _By type_
### Bug Fixes
- relative paths
- notify when create account
- handlebars global error
- fixed paths in portable mode
### CI
- build changelog only with pushing new version
- fixed build-and-release.yml
- fixed build-changelog.yml
### Chore
- updated dep
- updated dep
- updated dep
### Code Refactoring
- replaced mustache with handlebars
- to close the console press C
### Docs
- updated CHANGELOG.md
### Features
- separated the game form into tabs
- ludusavi customGames feature support [#153](https://github.com/Sak32009/SteamLauncher/issues/153)
### Mixed
- updated dependencies; replaced "navigo" with my own; replaced "steamclient_loader.exe" with my own; updated the ui of the forms; now disable_networking.txt has been separated from offline state; fixed a bug that if you launched a game, SteamLauncher would not open; added in game settings disable_lan_only.txt ( [#152](https://github.com/Sak32009/SteamLauncher/issues/152)  ), force_account_name.txt, force_language.txt, force_steamid.txt, force_listen_port.txt; bug fixes and app improvements.

<a name="v0.1.8"></a>
## [v0.1.8] (2022-04-18)

#### _All_
- v0.1.8
- Fix [#139](https://github.com/Sak32009/SteamLauncher/issues/139)

<a name="v0.1.7"></a>
## [v0.1.7] (2022-04-18)

#### _All_
- v0.1.7
- I prepare for [#137](https://github.com/Sak32009/SteamLauncher/issues/137)

<a name="v0.1.6"></a>
## [v0.1.6] (2022-04-16)

#### _All_
- v0.1.6
- fixed the problem of selecting the game executable

<a name="v0.1.5"></a>
## [v0.1.5] (2022-04-16)

#### _All_
- v0.1.5
- Update README.md
- Update README.md
- added steam-cloud
- just do it!
- now jquery is properly initialized
- replaced electron-store with conf, replaced electron-log with winston, now the data is saved in the installation folder no longer in appdata and the emulator autodownload has been added.
- replaced eslint-plugin-canonical with my own, updated dep

<a name="v0.1.4"></a>
## [v0.1.4] (2022-04-05)

#### _All_
- v0.1.4
- If steamRetriever returns an error with the achievements, stats or items the game is added anyway and no longer interrupts the console.

<a name="v0.1.3"></a>
## [v0.1.3] (2022-04-04)

#### _All_
- v0.1.3
- Fix [#127](https://github.com/Sak32009/SteamLauncher/issues/127)

<a name="v0.1.2"></a>
## [v0.1.2] (2022-04-03)

#### _All_
- v0.1.2
- revert 0.1.1, added new option in settings to disable ssl certificate verification

<a name="v0.1.1"></a>
## [v0.1.1] (2022-04-03)

#### _All_
- v0.1.1
- Fix [#124](https://github.com/Sak32009/SteamLauncher/issues/124)

<a name="v0.1.0"></a>
## [v0.1.0] (2022-04-02)

#### _All_
- v0.1.0
- Update yarn.lock

<a name="v0.0.9"></a>
## [v0.0.9] (2022-04-02)

#### _All_
- v0.0.9
- https://cs.rin.ru/forum/viewtopic.php?p=2571704#p2571704
- Delete codeql-analysis.yml
- Update codeql-analysis.yml
- update dep
- (css) support only 2 last chrome versions, reduce size by 10%
- xo -> eslint, snack notifications to system notifications, removed home from navigo, removed dependabot, removed vscode settings

<a name="v0.0.8"></a>
## [v0.0.8] (2022-02-27)

#### _All_
- v0.0.8
- my mistake
- my mistake

<a name="v0.0.7"></a>
## [v0.0.7] (2022-02-27)

#### _All_
- v0.0.7
- update dep, fixed rebase game and improvements
- Update build-and-release.yml

<a name="v0.0.6"></a>
## [v0.0.6] (2022-02-24)

#### _All_
- v0.0.6
- fix autoupdater

<a name="v0.0.5"></a>
## [v0.0.5] (2022-02-24)

#### _All_
- Test v0.0.5
- v0.0.4.1
- Revert "v0.0.4"
- v0.0.4
- Revert "bump version 0.0.4"
- Update build-and-release.yml
- bump version 0.0.4
- Update README.md
- added the possibility to modify the steamId
- Update LICENSE
- update dep
- Update screenshot_main.png
### Reverts
- Revert "v0.0.4"
- Revert "bump version 0.0.4"

<a name="v0.0.3"></a>
## [v0.0.3] (2022-02-20)

#### _All_
- release v0.0.3
- fase 2: render & main
- fase 1: render improvements
- Update build-and-release.yml
- prepare to new update...
- added logger, fixed packaged mode, updated dep, now the "data" folder it's inside APP_DATA/SteamLauncher
- update dep
- iconify to mdi/font
- Update renovate.json
- Update dependency tailwindcss to ^3.0.15
- Update dependency tailwindcss to ^3.0.14
- Update dependency [@iconify](https://github.com/iconify)/json to v1.1.456
- Update dependency vite to ^2.7.12
- update vite config
- Update .xo-config.json
- Update renovate.json
- Update dependency vite to ^2.7.11
- Update renovate.json
- active hmr vite
- rename
- update dep and fix iconify
- fix github workflows
- fix building & updated dep & removed overflow dep
- update dep
- to yarn v3
- update dep
- Update dependabot.yml
- Create codeql-analysis.yml
- upload source

<a name="v0.0.2"></a>
## [v0.0.2] (2021-10-25)

#### _All_
- update funding
- add screenshots to readme
- add screenshots
- Update README.md
- Update README.md

<a name="v0.0.1"></a>
## v0.0.1 (2021-10-24)

#### _All_
- upload
- Initial commit

[Unreleased]: https://github.com/Sak32009/SteamLauncher/compare/v0.2.2...HEAD
[v0.2.2]: https://github.com/Sak32009/SteamLauncher/compare/v0.2.1...v0.2.2
[v0.2.1]: https://github.com/Sak32009/SteamLauncher/compare/v0.2.0...v0.2.1
[v0.2.0]: https://github.com/Sak32009/SteamLauncher/compare/v0.1.9...v0.2.0
[v0.1.9]: https://github.com/Sak32009/SteamLauncher/compare/v0.1.8...v0.1.9
[v0.1.8]: https://github.com/Sak32009/SteamLauncher/compare/v0.1.7...v0.1.8
[v0.1.7]: https://github.com/Sak32009/SteamLauncher/compare/v0.1.6...v0.1.7
[v0.1.6]: https://github.com/Sak32009/SteamLauncher/compare/v0.1.5...v0.1.6
[v0.1.5]: https://github.com/Sak32009/SteamLauncher/compare/v0.1.4...v0.1.5
[v0.1.4]: https://github.com/Sak32009/SteamLauncher/compare/v0.1.3...v0.1.4
[v0.1.3]: https://github.com/Sak32009/SteamLauncher/compare/v0.1.2...v0.1.3
[v0.1.2]: https://github.com/Sak32009/SteamLauncher/compare/v0.1.1...v0.1.2
[v0.1.1]: https://github.com/Sak32009/SteamLauncher/compare/v0.1.0...v0.1.1
[v0.1.0]: https://github.com/Sak32009/SteamLauncher/compare/v0.0.9...v0.1.0
[v0.0.9]: https://github.com/Sak32009/SteamLauncher/compare/v0.0.8...v0.0.9
[v0.0.8]: https://github.com/Sak32009/SteamLauncher/compare/v0.0.7...v0.0.8
[v0.0.7]: https://github.com/Sak32009/SteamLauncher/compare/v0.0.6...v0.0.7
[v0.0.6]: https://github.com/Sak32009/SteamLauncher/compare/v0.0.5...v0.0.6
[v0.0.5]: https://github.com/Sak32009/SteamLauncher/compare/v0.0.3...v0.0.5
[v0.0.3]: https://github.com/Sak32009/SteamLauncher/compare/v0.0.2...v0.0.3
[v0.0.2]: https://github.com/Sak32009/SteamLauncher/compare/v0.0.1...v0.0.2
