import { expect } from 'chai';
import { MockStorage } from './MockStorage';

const KEY = "k";
const VALUE = "value";

describe('MockStorage', () => { 
    describe('constructor', () => { 
        it('Newly constructed storage should be empty', () => { 
            const storage = new MockStorage();
            expect(storage.length).to.eq(0);
        });
    });

    describe('setItem', () => { 
        it('Correctly sets an key / value pair', () => { 
            const storage = new MockStorage();
            storage.setItem(KEY, VALUE);
            expect(storage.getItem(KEY)).to.eq(VALUE);
        });
    });

    describe('set', () => { 
        it('Correctly sets an key / value pair', () => { 
            const storage = new MockStorage();
            storage[KEY] = VALUE;
            expect(storage.getItem(KEY)).to.eq(VALUE);
        });
    });

    describe('getItem', () => { 
        it('Correctly gets an key / value pair', () => { 
            const storage = new MockStorage();
            storage.setItem(KEY, VALUE);
            expect(storage.getItem(KEY)).to.eq(VALUE);
        });

        it('Returns null for a key that is not set.', () => { 
            const storage = new MockStorage();
            expect(storage.getItem("null")).to.be.null;
        });
    });

    describe('get', () => { 
        it('Correctly gets an key / value pair', () => { 
            const storage = new MockStorage();
            storage.setItem(KEY, VALUE);
            expect(storage[KEY]).to.eq(VALUE);
        });

        it('Returns null for a key that is not set.', () => { 
            const storage = new MockStorage();
            expect(storage["null"]).to.be.null;
        });
    });

    describe('removeItem', () => { 
        it('Correctly removes an key', () => { 
            const storage = new MockStorage();
            storage.setItem(KEY, VALUE);
            expect(storage[KEY]).to.eq(VALUE);

            storage.removeItem(KEY);
            expect(storage[KEY]).to.be.null;
        });

        it('Ignores removing an key it does not have', () => { 
            const storage = new MockStorage();
            storage.removeItem(KEY);
        });
    });

    describe('clear', () => { 
        it('Removes all', () => { 
            const storage = new MockStorage();
            storage.setItem(KEY, VALUE);
            storage.setItem("k2", "v2");
            expect(storage.length).to.eq(2);

            storage.clear();
            expect(storage.length).to.eq(0);
        });
    });

    describe('length', () => { 
        it('Newly constructed storage has zero length', () => { 
            const storage = new MockStorage();
            expect(storage.length).to.eq(0);
        });

        it('Returns the correct length.', () => { 
            const storage = new MockStorage();
            storage.setItem(KEY, VALUE);
            expect(storage.length).to.eq(1);
        });
    });
});