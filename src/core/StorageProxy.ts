export class StorageProxy {
  static create<T extends Storage>(storage: T): T {
    return new Proxy(storage, {
      set: (target: Storage, prop: string, value: any, _: any) => {

        if (target[prop] != null) {
          target[prop] = value;
        } else {
          target.setItem(prop, value);
        }
        return true;
      },
      get: (target: Storage, prop: string, _: any) => {
        if (target[prop] != null) {
          return target[prop];
        } else {
          return target.getItem(prop);
        }
      }
    }) as T;
  }
}