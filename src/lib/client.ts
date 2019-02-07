import { ChildProcess, spawn } from 'child_process';
import fs from 'fs';
import http from 'http';
import request from 'request';
import rp from 'request-promise-native';
import { Url } from 'url';
import { parseFlags } from './flags';
import { ClientConfig } from './proto';
import { getSiaPassword } from './utils';

export class Client {
  // Set spawn to public because of the need for sinon stubbing, not sure if
  // there's a better way.
  public spawn = spawn;
  protected config: ClientConfig;
  protected process: ChildProcess;
  protected agent: http.Agent;

  constructor(config: ClientConfig = {}) {
    try {
      if (config.dataDirectory) {
        fs.existsSync(config.dataDirectory);
      }
      const defaultConfig: ClientConfig = {
        apiAuthentication: 'auto',
        apiHost: 'localhost',
        apiPort: 9980,
        hostPort: 9982,
        rpcPort: 9981
      };
      this.config = { ...defaultConfig, ...config };
      // If strategy is set to 'auto', attempt to read from default siapassword file.
      if (this.config.apiAuthentication === 'auto') {
        this.config.apiAuthenticationPassword = getSiaPassword();
      }
      this.agent = new http.Agent({
        keepAlive: true,
        maxSockets: 30
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  public launch = (binPath: string): ChildProcess => {
    try {
      // Check if siad exists
      if (fs.existsSync(binPath)) {
        // Create flags
        const flags = parseFlags(this.config);
        // Set euid if avl
        const opts: any = {};
        if (process.geteuid) {
          opts.uid = process.geteuid();
        }

        this.process = this.spawn(binPath, flags, opts);
        return this.process;
      } else {
        throw new Error('could not find binary file in filesystem');
      }
    } catch (e) {
      throw new Error(e);
    }
  };

  public makeRequest = async (
    endpoint: string | Url,
    querystring?: object | undefined,
    method: string = 'GET',
    timeout: number = 30000
  ) => {
    try {
      const requestOptions = this.mergeDefaultRequestOptions({
        url: endpoint,
        timeout,
        qs: querystring,
        method
      });
      const data = await rp(requestOptions);
      return data;
    } catch (e) {
      throw new Error(e);
    }
  };

  public call = (options: rp.OptionsWithUrl | string) => {
    if (typeof options === 'string') {
      return this.makeRequest(options);
    } else {
      const endpoint = options.url;
      const method = options.method;
      const qs = options.qs || undefined;
      return this.makeRequest(endpoint, qs, method);
    }
  };

  public gateway = () => {
    return this.makeRequest('/gateway');
  };

  public daemonVersion = () => {
    return this.makeRequest('/daemon/version');
  };

  public daemonStop = () => {
    return this.makeRequest('/daemon/stop');
  };

  /**
   * checks if siad responds to a /version call.
   */
  public isRunning = async (): Promise<boolean> => {
    if (this.process) {
      try {
        await this.daemonVersion();
        return true;
      } catch (e) {
        throw new Error(
          `launched process ${this.process.pid} but not connectable`
        );
      }
    } else {
      try {
        await this.daemonStop();
        return true;
      } catch (e) {
        throw new Error('unable to reach sia daemon');
      }
    }
  };

  public getConnectionUrl = (): string => {
    return `http://:${this.config.apiAuthenticationPassword}@${
      this.config.apiHost
    }:${this.config.apiPort}`;
  };

  private mergeDefaultRequestOptions = (
    opts: rp.OptionsWithUrl
  ): rp.OptionsWithUrl => {
    // These are the default config sourced from the Sia Agent
    const defaultOptions: request.CoreOptions = {
      baseUrl: this.getConnectionUrl(),
      headers: {
        'User-Agent': this.config.agent || 'Sia-Agent'
      },
      json: true,
      pool: this.agent,
      timeout: 10000
    };
    const formattedOptions = {...defaultOptions, ...opts};
    return formattedOptions;
  };
}
