import {
  addIgnoredLogPath,
  getIgnoredLogPaths,
  logRequestMiddleware,
  removeIgnoredLogPath,
  resetIgnoredLogPaths,
} from "../logRequestMiddleware";

describe("logRequestMiddleware", () => {
  beforeEach(() => {
    resetIgnoredLogPaths();
  });

  it("gets added ignored log paths", () => {
    addIgnoredLogPath("/health");
    const results = getIgnoredLogPaths();
    expect(results).toEqual(["/health"]);
    removeIgnoredLogPath("/health");
  });

  it("gets empty ignored paths", () => {
    const results = getIgnoredLogPaths();
    expect(results).toEqual([]);
  });

  it("removes nothing when no path found", () => {
    removeIgnoredLogPath("/nothing");
    expect(getIgnoredLogPaths()).toEqual([]);
  });

  it("logs correctly", () => {
    const req = {} as any;
    const res = {} as any;
    const next = jest.fn() as any;
    const middleware = logRequestMiddleware();
    middleware(req, res, next);
    expect(next).toBeCalled();
  });

  it("does not log when path is ignored", () => {
    addIgnoredLogPath("/health");
    const req = { path: "/health" } as any;
    const res = {} as any;
    const next = jest.fn() as any;
    const middleware = logRequestMiddleware();
    middleware(req, res, next);
    expect(next).toBeCalled();
  });
});
