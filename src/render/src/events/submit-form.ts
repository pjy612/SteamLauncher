const serializeForm = (form: HTMLFormElement) => {
  const formData = new FormData(form);
  return Object.fromEntries(
    [...formData.keys()].map((key) => {
      const values = formData.getAll(key).map((key) => (key === 'true' || key === 'false' ? key === 'true' : key));
      return [key, values.length > 1 ? values : values[0]];
    })
  );
};

$(() => {
  $(document).on('submit', '.modal form[data-sk-channel]', (event) => {
    event.preventDefault();
    const dom = $(event.currentTarget);
    const form = dom[0] as HTMLFormElement;
    const channel = dom.attr('data-sk-channel')!;
    const serialized = serializeForm(form);
    window.api.send(channel, serialized);
  });
});

export {};
