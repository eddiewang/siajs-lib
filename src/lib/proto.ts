// ClientConfig is the object that is passed to configure the instantiation of the Sia Daemon.
export interface ClientConfig {
  apiHost?: string;
  apiPort?: number;
  hostPort?: number;
  rpcPort?: number;
  agent?: string;
  apiAuthentication?: 'auto' | boolean;
  apiAuthenticationPassword?: string;
  dataDirectory?: string;
  modules?: ModuleConfig;
}

// ModuleConfig defines modules available in Sia.
export interface ModuleConfig {
  gateway: boolean;
  consensus: boolean;
  transactionPool: boolean;
  wallet: boolean;
  renter: boolean;
  host: boolean;
  miner: boolean;
  explorer: boolean;
}

// SiadFlags defines all the possible configurable flag values for the Sia Daemon.
export interface SiadFlags {
  agent?: string;
  'api-addr'?: string;
  'authenticate-api'?: boolean;
  'disable-api-security'?: boolean;
  'host-addr'?: string;
  modules?: string;
  'no-boostrap'?: boolean;
  profile?: string;
  'profile-directory'?: string;
  'rpc-addr'?: string;
  'sia-directory'?: string;
  'temp-password'?: string;
}
