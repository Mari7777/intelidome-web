import * as migration_20260819_185826_initial from './20260819_185826_initial';
import * as migration_20260822_063647_api_keys from './20260822_063647_api_keys';
import * as migration_20260925_191845 from './20260925_191845';
import * as migration_20260928_142014_prelozeno from './20260928_142014_prelozeno';
import * as migration_20261003_151145_magazin_temata from './20261003_151145_magazin_temata';

export const migrations = [
  {
    up: migration_20260819_185826_initial.up,
    down: migration_20260819_185826_initial.down,
    name: '20260819_185826_initial',
  },
  {
    up: migration_20260822_063647_api_keys.up,
    down: migration_20260822_063647_api_keys.down,
    name: '20260822_063647_api_keys',
  },
  {
    up: migration_20260925_191845.up,
    down: migration_20260925_191845.down,
    name: '20260925_191845',
  },
  {
    up: migration_20260928_142014_prelozeno.up,
    down: migration_20260928_142014_prelozeno.down,
    name: '20260928_142014_prelozeno',
  },
  {
    up: migration_20261003_151145_magazin_temata.up,
    down: migration_20261003_151145_magazin_temata.down,
    name: '20261003_151145_magazin_temata'
  },
];
