const iteratorToObject = (nn: URLSearchParams) => {
  const b: Record<string, string> = {};
  for (const pp of nn) {
    const { 0: key, 1: value } = pp;
    b[key] = value;
  }

  return b;
};

export default iteratorToObject;
