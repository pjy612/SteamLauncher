import settingsSetNetworkStatus from '../../functions/settings-set-network-status';

void (async () => {
  const networkStatus = await window.api.settings.getNetworkStatus();
  settingsSetNetworkStatus(networkStatus!);
})();
