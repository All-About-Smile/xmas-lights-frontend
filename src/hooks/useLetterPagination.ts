import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { LetterItem } from "@/api/letterApi";
import { getUserLetters } from "@/api/letterApi";
import { PAGE_SIZE } from "@/components/scene/sceneSlots";
import type { BulbItem } from "@/components/scene/types";
import { toBulbKey } from "@/utils/bulbKey";

type UseLetterPaginationOptions = {
  userid?: string;
  pageSize?: number;
  enabled?: boolean;
  mapItem?: (item: LetterItem) => BulbItem | null;
};

type UseLetterPaginationResult = {
  bulbs: BulbItem[];
  hasPrev: boolean;
  hasNext: boolean;
  pageIndex: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  serverDate: Date | null;
  goPrev: () => void;
  goNext: () => void;
  reset: () => void;
  refresh: () => Promise<void>;
};

const defaultMapItem = (item: LetterItem): BulbItem | null => {
  const bulbKey = toBulbKey(item.ornament_shape, item.ornament_color);
  if (!bulbKey) return null;

  return {
    id: String(item.letter_number),
    bulbKey,
    nickname: item.writer_nickname ?? "",
  };
};

export function useLetterPagination(
  options: UseLetterPaginationOptions
): UseLetterPaginationResult {
  const {
    userid,
    pageSize = PAGE_SIZE,
    enabled = true,
    mapItem,
  } = options;

  const [offset, setOffset] = useState(0);
  const [bulbs, setBulbs] = useState<BulbItem[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [serverDate, setServerDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  const mapper = useMemo(() => mapItem ?? defaultMapItem, [mapItem]);

  useEffect(() => {
    setOffset(0);
  }, [userid, pageSize]);

  const fetchPage = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    if (!enabled || !userid) {
      setBulbs([]);
      setHasNext(false);
      setServerDate(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getUserLetters({
        userid,
        limit: pageSize,
        offset,
      });

      if (requestId !== requestIdRef.current) return;

      const mapped = result.items
        .map(mapper)
        .filter(Boolean) as BulbItem[];

      setBulbs(mapped);
      setHasNext(result.hasNext);

      if (result.serverDate) {
        const d = new Date(result.serverDate);
        setServerDate(Number.isNaN(d.getTime()) ? null : d);
      } else {
        setServerDate(null);
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return;

      const message =
        err instanceof Error
          ? err.message
          : "알 수 없는 오류가 발생했습니다.";
      setError(message);
    } finally {
      if (requestId !== requestIdRef.current) return;
      setLoading(false);
    }
  }, [enabled, userid, pageSize, offset, mapper]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const goPrev = useCallback(() => {
    setOffset((current) => {
      if (loading || current === 0) return current;
      return Math.max(0, current - pageSize);
    });
  }, [loading, pageSize]);

  const goNext = useCallback(() => {
    setOffset((current) => {
      if (loading || !hasNext) return current;
      return current + pageSize;
    });
  }, [loading, hasNext, pageSize]);

  const reset = useCallback(() => {
    setOffset(0);
  }, []);

  const refresh = useCallback(async () => {
    await fetchPage();
  }, [fetchPage]);

  const hasPrev = offset > 0;
  const pageIndex = useMemo(
    () => Math.floor(offset / pageSize) + 1,
    [offset, pageSize]
  );
  const pageCount = useMemo(
    () => (hasNext ? pageIndex + 1 : pageIndex),
    [hasNext, pageIndex]
  );

  return {
    bulbs,
    hasPrev,
    hasNext,
    pageIndex,
    pageCount,
    loading,
    error,
    serverDate,
    goPrev,
    goNext,
    reset,
    refresh,
  };
}
