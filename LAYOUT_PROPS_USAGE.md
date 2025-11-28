# Layout Props Usage

The Layout component now accepts optional props to control header and footer visibility.

## Props

- `hideHeader` (boolean, optional): Hide the navigation header. Default: `false`
- `hideFooter` (boolean, optional): Hide the footer. Default: `false`
- `title` (string, optional): Page title. Default: "Hủ tiếu Ngọc Mai - Kính chào"

## Examples

### Hide both header and footer (like invoices page)

```astro
---
import Layout from "@/layouts/Layout.astro";
---

<Layout hideHeader={true} hideFooter={true} title="My Page">
  <div>Your content here</div>
</Layout>
```

### Hide only header

```astro
<Layout hideHeader={true}>
  <div>Content with footer</div>
</Layout>
```

### Hide only footer

```astro
<Layout hideFooter={true}>
  <div>Content with header</div>
</Layout>
```

### Show both (default behavior)

```astro
<Layout>
  <div>Normal page with header and footer</div>
</Layout>
```

### Custom title

```astro
<Layout title="Custom Page Title">
  <div>Content</div>
</Layout>
```
