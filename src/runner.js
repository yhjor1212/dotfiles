import fs from 'fs';
import { exit, which } from 'shelljs';
import logatim from 'logatim';

import initializer from './tasks/initializer';
import symlink from './tasks/symlink';
import preInstaller from './tasks/pre-installer';
import installer from './tasks/installer';
import build from './tasks/build';

export const OPTIONS = {
  BUILD: 'build',
  INIT: 'init',
  SYMLINK: 'symlink',
  PREINSTALL: 'preinstall',
  INSTALL: 'install',
};

class Runner {
  checkGit() {
    if (!which('git')) {
      logatim.red.warn('This script requires git');
      exit(1);
    }
  }

  checkNpm() {
    if (!which('npm')) {
      logatim.red.warn('This script requires npm');
      exit(1);
    }
  }

  isFirstTimeRun() {
    try {
      fs.statSync(`${process.env.HOME}/.gituser`);
      fs.statSync(`${process.env.HOME}/.nvmrc`);
    } catch (err) {
      if (err.code === 'ENOENT') return true;
    }

    return false;
  }

  dispatchAction(option) {
    if (this.isFirstTimeRun() || option[OPTIONS.INIT]) initializer.run();
    if (option[OPTIONS.SYMLINK]) symlink.run();
    if (option[OPTIONS.PREINSTALL]) preInstaller.run(option.preinstall);
    if (option[OPTIONS.INSTALL]) installer.run(option.install);
    if (option[OPTIONS.BUILD]) build.run(option.build);
  }
}

export default new Runner();
