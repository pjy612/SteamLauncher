type NavigareMatch = {
  path: string;
  data: Record<string, string> | undefined;
  search: Record<string, string>;
  exists: boolean;
};

type NavigareMatchData =
  | {
      data: Record<string, string> | undefined;
      search: Record<string, string>;
    }
  | undefined;

type NavigareRoutes = Record<string, (match: NavigareMatchData) => void>;
