import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import dayjs from 'dayjs'
import pkg from './package.json'
import createVitePlugins from './vite/plugins'

// https://vitejs.dev/config/
export default async ({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  // 全局 scss 资源
  const scssResources = []
  fs.readdirSync('src/assets/styles/resources').forEach((dirname) => {
    if (fs.statSync(`src/assets/styles/resources/${dirname}`).isFile()) {
      scssResources.push(`@use "src/assets/styles/resources/${dirname}" as *;`)
    }
  })
  return defineConfig({
    base: './',
    // 开发服务器选项 https://cn.vitejs.dev/config/#server-options
    server: {
      open: true,
      port: 9000,
      proxy: {
        /*
      * 云集接口
      * 接口地址：http://yjapi.eduyq.net/swagger/ui/index
      *  */
        '/yq': {
          target: env.VITE_APP_API_BASEURL,
          changeOrigin: command === 'serve' && env.VITE_OPEN_PROXY === 'true',
          rewrite: path => path.replace(/\/yq/, ''),
        },
        /*
        * 用户管理接口
        * 接口地址：http://yh.softtone.cn/api/swagger/ui/index#/
        *  */
        '/yh': {
          target: env.VITE_APP_API_YH_BASEURL,
          changeOrigin: command === 'serve' && env.VITE_OPEN_PROXY === 'true',
          rewrite: path => path.replace(/\/yh/, ''),
        },
        /*
        * 未来学堂接口
        * 接口地址：http://wlapi.jqweike.cn/swagger/ui/index#/
        *  */
        '/wl': {
          target: env.VITE_APP_API_WL_BASEURL,
          changeOrigin: command === 'serve' && env.VITE_OPEN_PROXY === 'true',
          rewrite: path => path.replace(/\/wl/, ''),
        },
        /*
        * 云集接口
        * 接口地址：http://yjapi.eduyq.net/wlxt/swagger/ui/index#
        *  */
        '/yj': {
          target: env.VITE_APP_API_YJ_BASEURL,
          changeOrigin: command === 'serve' && env.VITE_OPEN_PROXY === 'true',
          rewrite: path => path.replace(/\/yj/, ''),
        },
      },
    },
    // 构建选项 https://cn.vitejs.dev/config/#server-fsserve-root
    build: {
      outDir: mode === 'production' ? 'dist' : `dist-${mode}`,
      sourcemap: env.VITE_BUILD_SOURCEMAP === 'true',
    },
    define: {
      __SYSTEM_INFO__: JSON.stringify({
        pkg: {
          version: pkg.version,
          dependencies: pkg.dependencies,
          devDependencies: pkg.devDependencies,
        },
        lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }),
    },
    plugins: createVitePlugins(env, command === 'build'),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '#': path.resolve(__dirname, 'src/types'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: scssResources.join(''),
        },
      },
    },
  })
}
