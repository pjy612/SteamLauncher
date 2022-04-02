window.api.on('window-state-change', (_event, isMaximized: boolean) => {
  $(document.body).toggleClass('window-is-maximized', isMaximized);
});

export {};
