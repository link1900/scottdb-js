import queryString from "query-string";
import { arrayToString } from "../stringHelper";
import { isPresent } from "../objectHelper";

/**
 | url            | url            | url      | url    | url      | url    | url         | url    | url    | url       | url      | url             | url      | url             | url      | url        |
 |----------------|----------------|----------|--------|----------|--------|-------------|--------|--------|-----------|----------|-----------------|----------|-----------------|----------|------------|
 | origin         | origin         | origin   | origin | origin   | origin | origin      | origin | origin | fullPath  | fullPath | fullPath        | fullPath | fullPath        | fullPath | fullPath   |
 | protocolOrigin | protocolOrigin | auth     | auth   | auth     |        | host        | host   | host   | path      |          | query           | query    | query           |          | hash       |
 | protocol       |                | username |        | password |        | hostname    |        | port   | pathParts |          | queryParameters |          | queryParameters |          | hash       |
 | http           | ://            | user     | :      | pass     | @      | example.com | :      | 8080   | /p/a/t/h  | ?        | query=string    | &        | more=string     | #        | hash-value |
 *
 */

export interface UrlProperties {
  // atomic
  protocol?: string;
  // atomic
  protocolSeparator?: string;
  // protocol + protocolSeparator
  protocolOrigin?: string;

  // atomic
  username?: string;
  // atomic
  password?: string;
  // atomic
  authSeparator?: string;
  // username + password
  auth?: string;
  // atomic
  authHostSeparator?: string;

  // atomic
  hostSeparator?: string;
  // atomic
  hostname?: string;
  // atomic
  port?: string;
  // hostname + port
  host?: string;

  // protocolOrigin + auth + host
  origin?: string;

  // atomic
  pathParts?: Array<string | undefined | null>;
  // joined(pathParts)
  path?: string;
  // atomic
  pathSeparator?: string;

  // atomic
  querySeparator?: string;
  // atomic
  queryParameters?: Record<string, any>;

  // atomic
  hashSeparator?: string;
  // atomic
  hash?: string;

  // originPath + searchHash
  url?: string;
}

export interface UrlOptions {
  encodeOrigin?: boolean;
  encodePath?: boolean;
  encodeQueryParameters?: boolean;
  encodeHash?: boolean;
}

export class UrlBuilder {
  private protocol: string;
  private protocolSeparator: string;
  private protocolOrigin: string;

  private username: string;
  private password: string;
  private authSeparator: string;
  private auth: string;

  private hostname: string;
  private port: string;
  private hostSeparator: string;
  private host: string;

  private authHostSeparator: string;
  private origin: string;

  private pathParts: Array<string | undefined | null>;
  private path: string;
  private pathSeparator: string;

  private querySeparator: string;
  private queryParameters: Record<string, any>;
  private query: string;

  private hashSeparator: string;
  private hash: string;

  private fullPath: string;

  private url: string;

  public options: UrlOptions;

  constructor(urlProps: UrlProperties, options?: UrlOptions) {
    this.protocol = "http";
    this.protocolSeparator = "://";
    this.protocolOrigin = "";

    this.username = "";
    this.password = "";
    this.authSeparator = ":";
    this.auth = "";

    this.hostname = "";
    this.port = "";
    this.hostSeparator = ":";
    this.host = "";

    this.authHostSeparator = "@";
    this.origin = "";

    this.pathParts = [];
    this.pathSeparator = "/";
    this.path = "";

    this.querySeparator = "?";
    this.queryParameters = {};
    this.query = "";

    this.hashSeparator = "#";
    this.hash = "";

    this.fullPath = "";

    this.options = {
      encodeOrigin: true,
      encodePath: true,
      encodeQueryParameters: true,
      encodeHash: true,
      ...options,
    };

    this.url = this.buildUrl();
    this.build(urlProps);
  }

  public build(urlProps?: UrlProperties): string {
    if (urlProps === undefined) {
      return this.url;
    }

    this.querySeparator = urlProps.querySeparator ?? this.querySeparator;
    this.pathSeparator = urlProps.pathSeparator ?? this.pathSeparator;

    this.protocol = urlProps.protocol ?? this.protocol;
    this.protocolSeparator =
      urlProps.protocolSeparator ?? this.protocolSeparator;
    this.protocolOrigin = urlProps.protocolOrigin ?? this.buildProtocolOrigin();

    this.username = urlProps.username ?? this.username;
    this.password = urlProps.password ?? this.password;
    this.authSeparator = urlProps.authSeparator ?? this.authSeparator;
    this.auth = urlProps.auth ?? this.buildAuth();

    this.hostname = urlProps.hostname ?? this.hostname;
    this.port = urlProps.port ?? this.port;
    this.hostSeparator = urlProps.hostSeparator ?? this.hostSeparator;
    this.host = urlProps.host ?? this.buildHost();
    this.processHost();

    this.authHostSeparator =
      urlProps.authHostSeparator ?? this.authHostSeparator;
    this.origin = urlProps.origin ?? this.buildOrigin();
    this.processOrigin();

    this.pathParts = urlProps.pathParts ?? this.pathParts;
    this.path = urlProps.path ?? this.buildPath();
    this.processPath();

    this.queryParameters = urlProps.queryParameters ?? this.queryParameters;
    this.query = this.buildQuery();

    this.hashSeparator = urlProps.hashSeparator ?? this.hashSeparator;
    this.hash = urlProps.hash ?? this.hash;
    this.processHash();

    this.fullPath = this.buildFullPath();

    this.url = urlProps.url ?? this.buildUrl();
    return this.url;
  }

  private buildProtocolOrigin(): string {
    return arrayToString([this.protocol, this.protocolSeparator], "");
  }

  private buildAuth(): string {
    return arrayToString([this.username, this.password], this.authSeparator);
  }

  private buildHost(): string {
    return arrayToString([this.hostname, this.port], this.hostSeparator);
  }

  private processHash() {
    if (this.options.encodeHash) {
      this.hash = encodeURIComponent(this.hash);
    }
  }

  private processHost() {
    this.host = this.removeEndPathSeparator(this.host);
  }

  private processOrigin() {
    if (!this.origin.endsWith("://")) {
      this.origin = this.removeEndPathSeparator(this.origin);
    }
    if (this.options.encodeOrigin) {
      this.origin = encodeURI(this.origin);
    }
  }

  private processPath() {
    if (this.options.encodePath) {
      this.path = encodeURI(this.path);
    }
  }

  private buildOrigin(): string {
    const authHost = arrayToString(
      [this.auth, this.host],
      this.authHostSeparator
    );
    return arrayToString([this.protocolOrigin, authHost], "");
  }

  private removePathSeparator(value: string): string {
    return this.removeEndPathSeparator(this.removeStartPathSeparator(value));
  }

  private removeStartPathSeparator(value: string): string {
    if (value.startsWith(this.pathSeparator)) {
      return value.substr(1, value.length);
    }
    return value;
  }

  private removeEndPathSeparator(value: string): string {
    if (value.endsWith(this.pathSeparator)) {
      return value.substring(0, value.length - 1);
    }
    return value;
  }

  private addStartPathSeparator(value: string): string {
    if (value.length > 0 && value.charAt(0) !== this.pathSeparator) {
      return this.pathSeparator + value;
    } else {
      return value;
    }
  }

  private buildPath(): string {
    const justParts: string[] = this.pathParts
      .filter(isPresent)
      .filter((p) => p.length > 0);
    if (justParts.length === 0) {
      return "";
    }

    if (justParts.length === 1) {
      return justParts[0];
    }

    const cleanPaths = justParts.map((p, index) => {
      if (index === 0) {
        return this.removeEndPathSeparator(p);
      } else if (index === this.pathParts.length - 1) {
        return this.removeStartPathSeparator(p);
      } else {
        return this.removePathSeparator(p);
      }
    });
    return arrayToString(cleanPaths, this.pathSeparator);
  }

  private buildQuery(): string {
    return queryString.stringify(this.queryParameters, {
      encode: this.options.encodeQueryParameters,
    });
  }

  private buildFullPath(): string {
    let newPath = "";
    if (this.path.length > 0) {
      newPath = newPath + this.addStartPathSeparator(this.path);
    }
    if (this.query.length > 0) {
      newPath = newPath + this.querySeparator + this.query;
    }
    if (this.hash.length > 0) {
      newPath = newPath + this.hashSeparator + this.hash;
    }
    return newPath;
  }

  private buildUrl(): string {
    return this.origin + this.fullPath;
  }

  public toUrl(): string {
    this.build();
    return this.url;
  }

  public toString(): string {
    return this.toUrl();
  }
}
