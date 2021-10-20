declare module "triplesec" {
  export class Encryptor {
    constructor(args: { key: Buffer, rng?: any, version?: any })

    public run(args: { data: Buffer, salt?: Buffer, progress_hook?: any, extra_keymaterial?: number }, cb: (err, red: Buffer) => void);
  }

  export class Decryptor {
    constructor(args: { key: Buffer })

    public run(args: { data: Buffer }, cb: (err, red: Buffer) => void);
  }
}