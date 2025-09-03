# Webflow Visibility Script Documentation

Control element visibility in Webflow based on **timezone** and **date rules** using custom attributes. Lightweight (2.4KB), performant, and prevents FOUC.

## 🚀 How It Works

- Elements with `visibility-*` attributes are hidden by default until evaluated
- Conditions pass → original Webflow display restored (flex, grid, block, etc.)
- No conditions → elements remain visible  
- No extra DOM manipulation or forced display values

## 📌 Attributes

### `visibility-tz`
Restrict by timezone:
```html
<!-- Exact match -->
visibility-tz="America/Puerto_Rico"

<!-- Multiple zones -->
visibility-tz="America/Puerto_Rico,America/New_York"

<!-- Continent wildcard -->
visibility-tz="Europe/*"
```

### `visibility-after-day`  
Show starting specified date (visitor's local time):
```html
visibility-after-day="2025-09-03"
<!-- Visible from 2025-09-03 onwards -->
```

### `visibility-logic`
Combine conditions:
- `all` (default): both must pass
- `any`: either can pass
```html
visibility-logic="any"
```

## ✅ Examples

**Require both conditions:**
```html
<div visibility-tz="America/Puerto_Rico,America/New_York" 
     visibility-after-day="2025-09-03">
  Shows for PR/NY users starting 2025-09-03
</div>
```

**Either condition:**
```html
<section visibility-logic="any" 
         visibility-tz="Europe/*" 
         visibility-after-day="2025-10-01">
  Shows for Europe users OR everyone from 2025-10-01
</section>
```

## 🔧 Installation

Add to **Webflow Project Settings → Custom Code → Footer Code**:

```javascript
/* Webflow Visibility Script (Melodev)
 * Controls element visibility based on time zone and date rules.
 * Usage:
 *   - visibility-tz="America/Puerto_Rico,America/New_York" or "Europe/*"
 *   - visibility-after-day="YYYY-MM-DD" (element shows starting this date, local time)
 *   - visibility-logic="all|any" (optional; default "all")
 */
!function() {
  "use strict";

  var prehide = document.createElement("style");
  prehide.setAttribute("data-visibility-prehide", "true");
  prehide.textContent = "[visibility-tz],[visibility-after-day]{display:none !important;}";
  if (document.head) document.head.appendChild(prehide);

  var userTZ;
  function getUserTimeZone() {
    if (userTZ === undefined) {
      try {
        userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      } catch (e) {
        userTZ = "";
      }
    }
    return userTZ;
  }

  var tzCache = {};
  function tzMatches(tzAttr, userTZ) {
    if (!tzAttr) return true;
    if (!userTZ) return false;
    
    var cacheKey = tzAttr + "|" + userTZ;
    if (tzCache[cacheKey] !== undefined) return tzCache[cacheKey];

    var allowed = tzAttr.split(",");
    var result = false;
    for (var i = 0; i < allowed.length; i++) {
      var item = allowed[i].trim();
      if (!item) continue;
      if (item.slice(-2) === "/*") {
        if (userTZ.indexOf(item.slice(0, -1)) === 0) {
          result = true;
          break;
        }
      } else if (item === userTZ) {
        result = true;
        break;
      }
    }
    
    return tzCache[cacheKey] = result;
  }

  var dateCache = {};
  function isDateValid(dateStr) {
    if (!dateStr) return true;
    if (dateCache[dateStr] !== undefined) return dateCache[dateStr];

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateCache[dateStr] = false;
    
    var parts = dateStr.split("-");
    var targetDate = new Date(+parts[0], parts[1] - 1, +parts[2]);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    return dateCache[dateStr] = today >= targetDate;
  }

  function shouldShow(el) {
    var tzAttr = el.getAttribute("visibility-tz");
    var dayAttr = el.getAttribute("visibility-after-day");
    var logic = el.getAttribute("visibility-logic");

    if (!tzAttr && !dayAttr) return true;

    var userTZ = getUserTimeZone();
    var tzOK = tzMatches(tzAttr, userTZ);
    var dayOK = isDateValid(dayAttr);

    return (logic === "any") ? (tzOK || dayOK) : (tzOK && dayOK);
  }

  function evaluate() {
    var nodes = document.querySelectorAll("[visibility-tz], [visibility-after-day]");

    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      el.style.display = shouldShow(el) ? "" : "none";
    }

    if (prehide && prehide.parentNode) {
      prehide.parentNode.removeChild(prehide);
      prehide = null;
    }
  }

  function init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", evaluate);
    } else {
      evaluate();
    }
    window.addEventListener("melodev:recheck-visibility", evaluate);
  }

  init();
}();
```

## 📋 Quick Reference

| Attribute | Example | Description |
|-----------|---------|-------------|
| `visibility-tz` | `America/Puerto_Rico`, `Europe/*` | Timezone restriction (supports wildcards) |
| `visibility-after-day` | `2025-09-03` | Show from date onwards (local time) |
| `visibility-logic` | `all` (default), `any` | Condition combination logic |

## 🔄 Dynamic Content

For dynamically loaded elements, trigger re-evaluation:
```javascript
window.dispatchEvent(new Event('melodev:recheck-visibility'));
```

## ⚡ Performance Features

- **Cached results**: Timezone and date validations cached for repeated use
- **Lazy timezone detection**: Only runs once when needed
- **Optimized loops**: Early exits and minimal DOM queries
- **Memory efficient**: Automatic cleanup of pre-hide styles
