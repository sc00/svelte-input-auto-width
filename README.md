# svelte-input-auto-width

> A svelte action that automatically resizes input fields based on their value.

### Install

```bash
$ npm install svelte-input-auto-width
```

### Usage

```js
<script>
  import { autoWidth } from 'svelte-input-auto-width';
</script>

<input
  use:autoWidth
  type="text"
  placeholder="Type and watch me resize!"
/>
```
