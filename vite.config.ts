import {defineConfig} from 'vite'
export default defineConfig({base:'./',define:{'import.meta.env.VITE_STATIC_PREVIEW':JSON.stringify('true')},build:{outDir:'dist',emptyOutDir:true,assetsInlineLimit:120000}})
