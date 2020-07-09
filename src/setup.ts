import { app } from 'electron';
import pkg from '../package.json';
import { getDefaultUserDataPath } from '@/paths';

import { isDev, isProd, isTest } from '@/base/platform';
import { join } from 'path';

import { mkdir } from '@/base/node/pfs';

const userDataPath = getDefaultUserDataPath(process.platform);

app.setPath('userData', userDataPath);
app.name = pkg.name;

app.allowRendererProcessReuse = true;

if (isDev) {
  app.commandLine.appendSwitch('inspect', '5858');
}

setCurrentWorkingDirectory();
setElectronEnvironment();
registerGlobalListeners();

function setCurrentWorkingDirectory(): void {
  if (isProd || isTest) {
    (global as any).__static = join(__dirname, '/static').replace(/\\/g, '\\\\');
  }

  try {
    if (process.platform === 'win32') {
      console.log(process);
    }
  } catch (err) {
    console.error(err);
  }
}

function setElectronEnvironment(): void {
  if (!isDev) {
    return;
  }

  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

  app.whenReady().then(() => {
    const installExtension = require('electron-devtools-installer');
    installExtension.default(installExtension.VUEJS_DEVTOOLS);
  });
}

async function createAppDataFolders(): Promise<void> {
  const appDataFolder = join(app.getPath('appData'), app.name);

  await mkdir(appDataFolder);
  await mkdir(join(appDataFolder, 'config'));
  await mkdir(join(appDataFolder, 'db'));
  await mkdir(join(app.getPath('temp'), app.name));
}

function registerGlobalListeners() {
  const macOpenFiles: string[] = [];
  (global as any).MAC_DROPPED_FILES = macOpenFiles;

  app.on('open-file', (_: Electron.Event, path: string) => {
    macOpenFiles.push(path);

    console.log(macOpenFiles);
  });
}

app.whenReady().then(async () => {
  await onReady();
});

async function onReady(): Promise<void> {
  try {
    await createAppDataFolders();
  } catch (error) {
    //
  }

  /*
   * Require our main program.
   * */

  require('./main');
}
