$(async () => {
  const appName = await window.api.app.getName();
  $('.navbar .navbar-brand span').text(appName);
});

export {};
