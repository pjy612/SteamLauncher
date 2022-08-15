import type { UserConfigExport } from 'vite';
import { builtinModules } from 'node:module';
import { join, basename } from 'node:path';
import { cwd } from 'node:process';
import { defineConfig } from 'vite';
import viteTSConfigPaths from 'vite-tsconfig-paths';
import { dependencies } from '../package.json';

const builtinModulesNodeProtocol = builtinModules.map((module) => `node:${module}`);
const externalModules = [...Object.keys(dependencies), 'electron', 'yargs/yargs', 'yargs/helpers'];
const appRootPath = cwd();

export default function createConfig(vitePackageRoot: string) {
  return defineConfig(({ mode }) => {
    const isDevelopment = mode === 'development';
    const viteProcessModel = basename(vitePackageRoot);
    const viteOutDirectory = join(appRootPath, 'build', 'dist', viteProcessModel);
    const viteConfig: UserConfigExport = {
      root: vitePackageRoot,
      base: './',
      envDir: appRootPath,
      publicDir: false,
      build: {
        target: 'esnext',
        outDir: viteOutDirectory,
        emptyOutDir: true,
      },
      plugins: [viteTSConfigPaths({ root: appRootPath })],
    };

    if (isDevelopment) {
      viteConfig.build = {
        ...viteConfig.build,
        minify: false,
      };
    }

    if (viteProcessModel === 'main' || viteProcessModel === 'preload') {
      viteConfig.build = {
        ...viteConfig.build,
        lib: {
          entry: join(vitePackageRoot, 'index.ts'),
          fileName: viteProcessModel,
          formats: ['cjs'],
        },
        rollupOptions: {
          external: [...externalModules, ...builtinModules, ...builtinModulesNodeProtocol],
        },
      };
    }

    return viteConfig;
  });
}
