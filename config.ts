/**
 * Created by tushar on 10/12/16.
 */

declare const SystemJS: any

SystemJS.defaultJSExtensions = true;
SystemJS.config({
  paths: {
    '*': './node_modules/*',
    'src/*': 'src/*'
  },
  packageConfigPaths: ['./node_modules/*/package.json']
})