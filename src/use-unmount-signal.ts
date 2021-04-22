import { useEffect, useState } from 'react';

/**
 * A React Hook that returns an AbortSignal that is marked as aborted when the calling component is
 * unmounted. This is useful for canceling promises, such as those for network requests, when a
 * component is unmounted.
 */
export default function useUnmountSignal(): AbortSignal {
  const [abortController] = useState(() => new AbortController());
  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);
  return abortController.signal;
}
