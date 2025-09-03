# Testing Visibility Rules

Test date-based visibility rules by faking the current date in DevTools. For QA and development only.

## Quick Start

**Check current date:**
```js
new Date().toISOString().slice(0,10)  // "2025-09-03"
```

**Setup test helpers** (paste once in DevTools console):
```js
window._RealDate = Date;
window.setFakeDate = function(isoString) {
  const [y,m,d] = isoString.split('-').map(Number);
  const fake = new _RealDate(y, m-1, d);
  Date = function(...args) {
    return args.length === 0 ? new _RealDate(fake) : new _RealDate(...args);
  };
  Date.prototype = _RealDate.prototype;
  Date.now = () => fake.getTime();
  console.log("📅 Fake date:", fake.toDateString());
};
window.resetDate = function() {
  Date = window._RealDate;
  console.log("✅ Date reset:", new Date().toDateString());
};
```

## Testing Workflow

**1. Set fake date:**
```js
setFakeDate("2025-09-10");
window.dispatchEvent(new Event('melodev:recheck-visibility'));
```

**2. Verify behavior:**
- Elements with `visibility-after-day="2025-09-09"` should now be visible
- Elements with `visibility-after-day="2025-09-11"` should be hidden

**3. Reset when done:**
```js
resetDate();
window.dispatchEvent(new Event('melodev:recheck-visibility'));
```

## Notes

- ⚠️ **Tab-specific**: Only affects current browser tab
- 🔄 **Page refresh**: Always restores real date
- ⚡ **Re-evaluate**: Always trigger `melodev:recheck-visibility` after date changes
- 🚫 **Production**: Remove test overrides before going live
