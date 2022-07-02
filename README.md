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

### Options

```js
<input
  use:autoWidth={{ maxWidth: "300px", minWidth: "100px" }}
  type="text"
  placeholder="Type and watch me resize!"
/>
```

Pass in an object to set the following properties:

#### maxWidth

Type: `String`
Default: `'none'`

Set the input field’s max-width. Pass in a regular css value in string format.

#### minWidth

Type: `String`
Default: `'1.5ch'`

Set the input field’s min-width. Pass in a regular css value in string format.
