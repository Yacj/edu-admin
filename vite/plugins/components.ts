import components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
export default function createComponents() {
  return components({
    dirs: [
      'src/components',
      'src/layouts/ui-kit',
    ],
    include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
    dts: './src/types/components.d.ts',
    resolvers: [
      AntDesignVueResolver({
        importStyle: false, // css in js
      }),
    ],
  })
}
