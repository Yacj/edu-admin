import { defaultsDeep } from 'lodash-es'
import type { RecursiveRequired, Settings } from '#/global'
import settingsDefault from '@/settings.default'

const globalSettings: Settings.all = {
  "app": {
    "colorScheme": "light",
    "enablePermission": false,
    "enableProgress": true,
    "enableDynamicTitle": true,
    "routeBaseOn": "frontend",
    "enableAppSetting": true,
    "colorPrimary": "#4e88f3"
  },
  "home": {
    "enable": true,
    "title": "主页"
  },
  "layout": {
    "enableMobileAdaptation": false
  },
  "menu": {
    "baseOn": "frontend",
    "menuMode": "side",
    "switchMainMenuAndPageJump": true,
    "subMenuUniqueOpened": true,
    "subMenuCollapse": false,
    "enableSubMenuCollapseButton": false,
    "enableHotkeys": false
  },
  "topbar": {
    "mode": "sticky"
  },
  "toolbar": {
    "enableFullscreen": true,
    "enablePageReload": true,
    "enableColorScheme": true
  },
  "breadcrumb": {
    "enable": true
  },
  "mainPage": {
    "enableHotkeys": true
  },
  "navSearch": {
    "enable": false,
    "enableHotkeys": true
  },
  "copyright": {
    "enable": true,
    "dates": "",
    "company": "",
    "website": "",
    "beian": ""
  }
}

export default defaultsDeep(globalSettings, settingsDefault) as RecursiveRequired<Settings.all>
