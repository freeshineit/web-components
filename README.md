## Web Components

[Web Components](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components) 是一套不同的技术，允许您创建可重用的定制元素（它们的功能封装在您的代码之外）并且在您的 web 应用中使用它们。

## Scripts

```bash
# development
yarn run dev

# production
yarn run build

# build document
# https://github.com/http-party/http-server
# version >= 14
yarn run build-doc
cd docs && http-server -p 8080 .
```

## Use

> yarn install @skax/web-components

### component

`wc-input`, `wc-button`, `wc-list`

### html

```html
<!-- script -->
<script src="./lib/bundle/@skax/web-components.umd.js"></script>

<!-- html -->
<wc-button>Button</wc-button>
```

### react

```tsx
import '@skax/web-components'
// import '@skax/web-components/es/button'

function App() {
  return <wc-button>Button</wc-button>;
}
```

如果使用了 typescript，在 `react-app-env.d.ts`中添加下面声明。

```ts
export declare global {
  namespace JSX {
    interface IntrinsicElements {
      "wc-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
```

### vue3

```vue
<script setup>
  import '@skax/web-components'
  // import '@skax/web-components/es/button'
</script>

<template>
  <wc-button>Button</wc-button>
</template>
```
