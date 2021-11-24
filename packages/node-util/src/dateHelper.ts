import prettyMilliseconds from "pretty-ms";
export type TimeMark = [number, number];

export function getBenchmarkStartTime(): TimeMark {
  return process.hrtime();
}

export function getBenchmarkEndTimeParts(hrstart: TimeMark) {
  const hrend = process.hrtime(hrstart);
  const seconds = hrend[0];
  const milliseconds = hrend[1] / 1000000;
  return { seconds, milliseconds };
}

export function getBenchmarkEndTimeMilliseconds(startTime: TimeMark) {
  const { seconds, milliseconds } = getBenchmarkEndTimeParts(startTime);
  return seconds * 1000 + Math.round(milliseconds);
}

export function getBenchmarkEndTimeString(startTime: TimeMark) {
  return convertMillisecondsToString(
    getBenchmarkEndTimeMilliseconds(startTime)
  );
}

export function convertMillisecondsToString(milliseconds: number): string {
  return prettyMilliseconds(milliseconds);
}
