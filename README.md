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

```jsx
import { useState } from 'react';
import useUnmountSignal from 'use-unmount-signal';

function Example() {
  const unmountSignal = useUnmountSignal();
  const [status, setStatus] = useState('ready');

  async function handleClick({ signal }) {
    if (signal.aborted) { throw new AbortError(); }

    const response = await fetch('https://ping.example.com', { signal });
    if (signal.aborted) { throw new AbortError(); }

    // We are guaranteed that the component is still mounted at this point
    if (response.ok) {
      setState('OK');
    } else {
      setState(response.status);
    }
  }

  return <button onClick={handleClick}>Ping {status}</button>;
}
```
