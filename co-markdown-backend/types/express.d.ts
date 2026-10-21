declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
      getData: () => Record<string, unknown>;
    }
  }
}

export { };