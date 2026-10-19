declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
      data: () => Record<string, unknown>;
    }
  }
}

export { };