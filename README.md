# use-unmount-signal [![Tests](https://github.com/expo/use-unmount-signal/actions/workflows/tests.yml/badge.svg)](https://github.com/expo/use-unmount-signal/actions/workflows/tests.yml) [![codecov](https://codecov.io/gh/expo/use-unmount-signal/branch/main/graph/badge.svg?token=6YVSvvk4zB)](https://codecov.io/gh/expo/use-unmount-signal)

`useUnmountSignal` is a React Hook to cancel promises when a component is unmounted. It uses [the W3C-standard `AbortSignal` API](https://dom.spec.whatwg.org/#interface-AbortSignal) to notify compatible promises when the calling component is unmounted.

## API

### `useUnmountSignal(): AbortSignal`

A React Hook that returns an `AbortSignal` object that is marked as aborted when the calling component is unmounted.

## Example

```jsx
import useUnmountSignal from 'use-unmount-signal';

function Example() {
  // useUnmountSignal returns an AbortSignal object that APIs like fetch accept
  const unmountSignal = useUnmountSignal();
  return (
    <button
      onClick={() =>
        fetch('https://ping.example.com', { signal: unmountSignal })
      }>
      Ping
    </button>
  );
}
```

### With async function event handlers

[The HTML5 specification says](https://dom.spec.whatwg.org/#abortsignal-abort-algorithms):

> Any web platform API using promises to represent operations that can be aborted must adhere to the following:
> 
> * Accept `AbortSignal` objects through a `signal` dictionary member.
> * Convey that the operation got aborted by rejecting the promise with an "`AbortError`" `DOMException`.
> * Reject immediately if the `AbortSignal`'s aborted flag is already set, otherwise:
> * Use the abort algorithms mechanism to observe changes to the `AbortSignal` object and do so in a manner that does not lead to clashes with other observers.

Calling any async function creates a promise. Therefore, authors of async functions need to follow the above guidance to write abortable functions.

```jsx
import { useState } from 'react';
import useUnmountSignal from 'use-unmount-signal';

function Example() {
  const unmountSignal = useUnmountSignal();
  const [status, setStatus] = useState('ready');

  const handleClick = useCallback(
    async () => {
      if (unmountSignal.aborted) { throw new AbortError(); }

      const response = await fetch('https://ping.example.com', { signal: unmountSignal });
      if (unmountSignal.aborted) { throw new AbortError(); }

      // We are guaranteed that the component is still mounted at this point
      if (response.ok) {
        setStatus('OK');
      } else {
        setStatus(response.status);
      }
    },
    [unmountSignal, setStatus]
  );

  return <button onClick={handleClick}>Ping {status}</button>;
}
```
