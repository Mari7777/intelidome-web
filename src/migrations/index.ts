import * as migration_20260819_185826_initial from './20260819_185826_initial';

export const migrations = [
  {
    up: migration_20260819_185826_initial.up,
    down: migration_20260819_185826_initial.down,
    name: '20260819_185826_initial'
  },
];
