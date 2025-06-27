# Radio Cards for Webflow

A lightweight JavaScript library that transforms radio inputs into interactive card components in Webflow. Perfect for creating selectable option cards, pricing plans, or any radio button interface that needs enhanced visual feedback.

## Quick Start

Add this script to your Webflow page's custom code (before `</body>` tag):

```html
<script async type="module"
  src="https://your-cdn.com/radio-cards.js"
  data-radio
  data-default-value="Full Face"
  data-selected-bg="var(--green--950)"
  data-selected-color="var(--white)">
</script>
```

## Installation

### Option 1: CDN (Recommended)
Place the script tag in your Webflow project's custom code section:

1. Go to **Project Settings** → **Custom Code**
2. Add the script in the **Footer Code** section
3. Configure the data attributes as needed

### Option 2: Page-specific
Add the script to individual pages via **Page Settings** → **Custom Code** → **Footer Code**

## Script Configuration

Configure the behavior using data attributes on the script tag:

| Attribute | Required | Description |
|-----------|----------|-------------|
| `data-radio` | ✅ Yes | Enables the radio cards functionality |
| `data-default-value` | ❌ No | Sets which radio should be selected by default |
| `data-selected-bg` | ❌ No | Background color for selected cards (if not specified, uses CSS styling) |
| `data-selected-color` | ❌ No | Text color for selected cards (if not specified, uses CSS styling) |

### Using Webflow CSS Variables
You can use Webflow's CSS custom properties for colors:

```html
<script async type="module"
  src="https://your-cdn.com/radio-cards.js"
  data-radio
  data-selected-bg="var(--primary--500)"
  data-selected-color="var(--white)">
</script>
```

## HTML Structure in Webflow

### Required Data Attributes

Add these data attributes to your Webflow elements:

#### Radio Wrapper (Container)
```html
data-radio-wrapper="true"
```
Apply to the div/container that wraps each radio option.

#### Radio Input
```html
data-radio-input="true"
```
Apply to the actual radio input element.

#### Radio Value (Optional)
```html
data-radio-value="option-name"
```
Apply to radio inputs when using `data-default-value`. The value should match your default value setting.

## Webflow Setup Steps

1. **Create your radio structure:**
   - Add a Form Block
   - Add Radio Button elements inside
   - Style your radio containers as cards

2. **Add data attributes:**
   - Select each radio container → Settings → Add `data-radio-wrapper="true"`
   - Select each radio input → Settings → Add `data-radio-input="true"`
   - (Optional) Add `data-radio-value="option-name"` to inputs for default selection

3. **Add the script:**
   - Go to Project/Page Settings → Custom Code
   - Add the script tag with your configuration

4. **Style the selected state:**
   - Create a combo class called `selected` for your radio wrapper
   - Style how selected cards should look (the script will override colors)

## Complete Example

### HTML Structure in Webflow:
```html
<!-- Form Block -->
<form>
  <!-- Option 1 -->
  <div data-radio-wrapper="true" class="radio-card">
    <label>
      <input type="radio" name="plan" value="basic" 
             data-radio-input="true" 
             data-radio-value="Basic Plan">
      <div>Basic Plan - $10/month</div>
    </label>
  </div>
  
  <!-- Option 2 -->
  <div data-radio-wrapper="true" class="radio-card">
    <label>
      <input type="radio" name="plan" value="pro" 
             data-radio-input="true" 
             data-radio-value="Pro Plan">
      <div>Pro Plan - $25/month</div>
    </label>
  </div>
</form>
```

### Script Configuration:
```html
<script async type="module"
  src="https://your-cdn.com/radio-cards.js"
  data-radio
  data-default-value="Pro Plan"
  data-selected-bg="var(--primary--600)"
  data-selected-color="var(--white)">
</script>
```

## Styling

### Automatic Selected Class
When a radio is selected, the script automatically:
- Adds `.selected` class to the wrapper
- Applies background color (only if `data-selected-bg` is specified)
- Applies text color to all child elements (only if `data-selected-color` is specified)

### CSS-Only Styling
If you don't specify color data attributes, the script will only add the `.selected` class and let your Webflow combo class handle all styling:

```html
<!-- Script without color attributes -->
<script async type="module"
  src="https://your-cdn.com/radio-cards.js"
  data-radio>
</script>
```

### CSS for Selected State
Create a combo class in Webflow for complete styling control:

```css
.radio-card.selected {
  background-color: var(--primary--500);
  color: white;
  border: 2px solid var(--primary--600);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}
```

## Webflow CMS Integration

### Using with Collection Lists
When using radio cards with Webflow CMS collections, you can dynamically set the `data-radio-value` attribute:

1. **Select your radio input** in the Webflow Designer
2. **Click Settings** → **Custom Attributes**
3. **Add custom attribute:**
   - Name: `data-radio-value`
   - Value: Click the **+** icon and select your CMS field (e.g., `Product Name`, `Plan Title`, etc.)

### Example CMS Setup:
```html
<!-- Inside a Collection List Item -->
<div data-radio-wrapper="true" class="radio-card">
  <label>
    <input type="radio" name="cms-options" 
           data-radio-input="true" 
           data-radio-value="[CMS Field: Product Name]">
    <div>[CMS Field: Product Name] - [CMS Field: Price]</div>
  </label>
</div>
```

### Setting CMS Default Value
To set a default selection from CMS:

1. **Go to your page/template settings**
2. **In the script tag**, set `data-default-value` to a CMS field:
   ```html
   <script async type="module"
     src="https://your-cdn.com/radio-cards.js"
     data-radio
     data-default-value="[CMS Field: Default Selection]">
   </script>
   ```

### Dynamic CMS Colors
You can also use CMS fields for colors:
```html
<script async type="module"
  src="https://your-cdn.com/radio-cards.js"
  data-radio
  data-selected-bg="[CMS Field: Brand Color]"
  data-selected-color="[CMS Field: Text Color]">
</script>
```

## Advanced Configuration

### Multiple Radio Groups
The script works with multiple radio groups on the same page. Each group operates independently.

### Dynamic Default Values
You can set different default values based on conditions by using Webflow's conditional visibility or custom code.

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Troubleshooting

### Script not working?
1. ✅ Check that `data-radio` attribute is present on script tag
2. ✅ Verify data attributes are correctly applied to HTML elements
3. ✅ Ensure script is loaded after DOM content (use async)
4. ✅ Check browser console for error messages

### Default selection not working?
- ✅ Verify `data-radio-value` on inputs matches `data-default-value` exactly
- ✅ Check that radio inputs have the same `name` attribute

### Styling issues?
- ✅ Colors are applied inline and will override CSS
- ✅ Use `!important` in CSS if needed to override script styling
- ✅ Check that CSS custom properties (variables) are defined

### Console Debugging
The script logs helpful information:
- `🟢 radio-cards.js loaded` - Script initialized
- `🎯 Found radios: X` - Number of radio inputs found
- `✅ ADDED .selected` - When selection changes
- `⭐ Default radio set` - When default value is applied

## License

MIT License - Feel free to use in your Webflow projects.