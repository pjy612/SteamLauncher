const serializeForm = (form: HTMLFormElement) => {
  const objects: Record<string, boolean | string> = {};
  const formData = new FormData(form);

  for (const pair of formData) {
    const { 0: pairKey, 1: pairValue } = pair;
    let value: string | boolean = pairValue.toString();

    if (value === 'true' || value === 'false') {
      value = value === 'true';
    }

    objects[pairKey] = value;
  }

  return objects;
};

export default serializeForm;
