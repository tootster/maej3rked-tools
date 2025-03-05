# Observers Module

This module provides a structured approach to DOM observation in the application.

## Architecture

The observers module is structured as follows:

- **Factory**: Creates standardized observer instances
- **Registry**: Manages all observers in the application
- **Handlers**: Process mutations from observers
- **Observers**: Define specific observer configurations

## Usage

### Creating a New Observer

1. Create a handler in `handlers/`:

```javascript
// handlers/my-observer.js
export const handleMyObserverMutations = (mutations) => {
  mutations.forEach((mutation) => {
    // Process mutations
  });
};
```

2. Create an observer definition in `observers/`:

```javascript
// observers/my-observer.js
import { createObserver } from "../factory";
import { handleMyObserverMutations } from "../handlers/my-observer";

export const createMyObserver = () => {
  return createObserver(
    "my-observer", 
    handleMyObserverMutations, 
    {
      selector: "#my-element",
      config: { childList: true, subtree: true }
    }
  );
};
```

3. Register the observer in `index.js`:

```javascript
import { createMyObserver } from "./observers/my-observer";

const myObserver = createMyObserver();
registry.register(myObserver);

// Add to the exported observers object
observers.myObserver = {
  start: () => registry.startObserver("my-observer"),
  stop: () => registry.stopObserver("my-observer"),
};
```

### Using Observers

```javascript
import observers from "./modules/observers";

// Start an observer
observers.chat.start();

// Stop an observer
observers.chat.stop();

// Start all observers
observers.startAll();

// Start observers that match a condition
observers.startAll(observer => observer.name.startsWith("chat"));

// Stop all observers
observers.stopAll();
```

## Best Practices

1. **Separation of Concerns**: Keep observer logic separate from DOM manipulation
2. **Error Handling**: Always handle errors in observers to prevent breaking the application
3. **Cleanup**: Always disconnect observers when they're no longer needed
4. **Performance**: Be mindful of observer configurations to avoid performance issues
5. **Documentation**: Document the purpose and behavior of each observer 