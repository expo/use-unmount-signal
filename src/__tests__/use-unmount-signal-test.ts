import { test, expect } from '@jest/globals';
import { renderHook } from '@testing-library/react-hooks';

import useUnmountSignal from '../use-unmount-signal';

test(`it returns an AbortSignal`, () => {
  const { result } = renderHook(() => useUnmountSignal());
  expect(result.current).toBeInstanceOf(AbortSignal);
});

test(`it marks the AbortSignal as aborted when unmounted`, () => {
  const { result, unmount } = renderHook(() => useUnmountSignal());
  expect(result.current.aborted).toBe(false);
  unmount();
  expect(result.current.aborted).toBe(true);
});

test(`it does not change the AbortSignal when re-rendered`, () => {
  const { result, rerender } = renderHook(() => useUnmountSignal());
  const initialAbortSignal = result.current;
  rerender();
  expect(result.current).toBe(initialAbortSignal);
});
