export type InvalidRange = {
  invalid: true;
};

export type ValidRange = {
  invalid: false;
  start: number;
  end: number;
  fileSize: number;
  chunkSize: number;
};

export type ParseRangeResult = undefined | InvalidRange | ValidRange;

export function parseRange(rangeHeader: string | undefined, fileSize: number): ParseRangeResult {
  if (!rangeHeader) return undefined;

  if (!rangeHeader.startsWith('bytes=') || rangeHeader.includes(',')) {
    return {invalid: true};
  }

  const range = rangeHeader.replace(/bytes=/, '');

  // Reject multipart ranges (e.g., "bytes=0-50, 100-150")
  if (range.includes(',')) return undefined;

  const [startRaw, endRaw] = range.split('-');
  const start = startRaw ? Number(startRaw) : NaN;
  const end = endRaw ? Number(endRaw) : NaN;

  if (Number.isNaN(start) && Number.isNaN(end)) {
    return {invalid: true};
  }

  let resolvedStart = 0;
  let resolvedEnd = fileSize - 1;

  if (Number.isNaN(start)) {
    const suffixLength = end;
    if (!Number.isFinite(suffixLength) || suffixLength <= 0) {
      return {invalid: true};
    }

    resolvedStart = Math.max(fileSize - suffixLength, 0);
  } else {
    resolvedStart = start;
    resolvedEnd = Number.isNaN(end) ? fileSize - 1 : end;
  }

  if (resolvedStart < 0 || resolvedStart >= fileSize) {
    return {invalid: true};
  }

  if (resolvedEnd < resolvedStart) {
    return {invalid: true};
  }

  if (resolvedEnd >= fileSize) {
    resolvedEnd = fileSize - 1;
  }

  const chunkSize = resolvedEnd - resolvedStart + 1;

  return {
    invalid: false,
    start: resolvedStart,
    end: resolvedEnd,
    fileSize,
    chunkSize,
  };
}

export function createRangeHeaders(
  range: ValidRange | undefined,
  fileSize: number,
): Record<string, string | number> {
  if (!range) {
    return {
      'Content-Length': fileSize,
    };
  }

  return {
    'Content-Range': `bytes ${range.start}-${range.end}/${range.fileSize}`,
    'Content-Length': range.chunkSize,
  };
}
