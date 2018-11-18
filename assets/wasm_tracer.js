(function() {
    var wasm;
    const __exports = {};


    __exports.__wbg_random_5ff3cf812d93001c = function() {
        return Math.random();
    };

    let cachedTextDecoder = new TextDecoder('utf-8');

    let cachegetUint8Memory = null;
    function getUint8Memory() {
        if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
            cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
        }
        return cachegetUint8Memory;
    }

    function getStringFromWasm(ptr, len) {
        return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
    }

    __exports.__wbg_log_f0a6e9af21e083ce = function(arg0, arg1) {
        let varg0 = getStringFromWasm(arg0, arg1);
        console.log(varg0);
    };

    const slab = [{ obj: undefined }, { obj: null }, { obj: true }, { obj: false }];

    let slab_next = slab.length;

    function addHeapObject(obj) {
        if (slab_next === slab.length) slab.push(slab.length + 1);
        const idx = slab_next;
        const next = slab[idx];

        slab_next = next;

        slab[idx] = { obj, cnt: 1 };
        return idx << 1;
    }

    __exports.__wbg_static_accessor_crypto_b5cee419b00f1120 = function() {
        return addHeapObject(crypto);
    };

    const stack = [];

    function getObject(idx) {
        if ((idx & 1) === 1) {
            return stack[idx >> 1];
        } else {
            const val = slab[idx >> 1];

            return val.obj;

        }
    }

    let cachegetUint16Memory = null;
    function getUint16Memory() {
        if (cachegetUint16Memory === null || cachegetUint16Memory.buffer !== wasm.memory.buffer) {
            cachegetUint16Memory = new Uint16Array(wasm.memory.buffer);
        }
        return cachegetUint16Memory;
    }

    function getArrayU16FromWasm(ptr, len) {
        return getUint16Memory().subarray(ptr / 2, ptr / 2 + len);
    }

    function passArray16ToWasm(arg) {
        const ptr = wasm.__wbindgen_malloc(arg.length * 2);
        getUint16Memory().set(arg, ptr / 2);
        return [ptr, arg.length];
    }

    let cachegetUint32Memory = null;
    function getUint32Memory() {
        if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== wasm.memory.buffer) {
            cachegetUint32Memory = new Uint32Array(wasm.memory.buffer);
        }
        return cachegetUint32Memory;
    }

    __exports.__wbg_getRandomValues_2872bad060fef1a7 = function(ret, arg0, arg1, arg2) {
        let varg1 = getArrayU16FromWasm(arg1, arg2);

        varg1 = varg1.slice();
        wasm.__wbindgen_free(arg1, arg2 * 2);


        const [retptr, retlen] = passArray16ToWasm(getObject(arg0).getRandomValues(varg1));
        const mem = getUint32Memory();
        mem[ret / 4] = retptr;
        mem[ret / 4 + 1] = retlen;

    };

    function getArrayU32FromWasm(ptr, len) {
        return getUint32Memory().subarray(ptr / 4, ptr / 4 + len);
    }

    let cachedGlobalArgumentPtr = null;
    function globalArgumentPtr() {
        if (cachedGlobalArgumentPtr === null) {
            cachedGlobalArgumentPtr = wasm.__wbindgen_global_argument_ptr();
        }
        return cachedGlobalArgumentPtr;
    }
    /**
    * @param {number} arg0
    * @param {number} arg1
    * @param {number} arg2
    * @param {boolean} arg3
    * @returns {Uint32Array}
    */
    __exports.make_image = function(arg0, arg1, arg2, arg3) {
        const retptr = globalArgumentPtr();
        wasm.make_image(retptr, arg0, arg1, arg2, arg3);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getArrayU32FromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 4);
        return realRet;

    };

    let cachedTextEncoder = new TextEncoder('utf-8');

    function passStringToWasm(arg) {

        const buf = cachedTextEncoder.encode(arg);
        const ptr = wasm.__wbindgen_malloc(buf.length);
        getUint8Memory().set(buf, ptr);
        return [ptr, buf.length];
    }
    /**
    * @param {string} arg0
    * @returns {void}
    */
    __exports.greet = function(arg0) {
        const [ptr0, len0] = passStringToWasm(arg0);
        try {
            return wasm.greet(ptr0, len0);

        } finally {
            wasm.__wbindgen_free(ptr0, len0 * 1);

        }

    };

    function dropRef(idx) {

        idx = idx >> 1;
        if (idx < 4) return;
        let obj = slab[idx];

        obj.cnt -= 1;
        if (obj.cnt > 0) return;

        // If we hit 0 then free up our space in the slab
        slab[idx] = slab_next;
        slab_next = idx;
    }

    __exports.__wbindgen_object_drop_ref = function(i) {
        dropRef(i);
    };

    function init(path_or_module) {
        let instantiation;
        const imports = { './wasm_tracer': __exports };
        if (path_or_module instanceof WebAssembly.Module) {
            instantiation = WebAssembly.instantiate(path_or_module, imports)
            .then(instance => {
            return { instance, module: module_or_path }
        });
    } else {
        const data = fetch(path_or_module);
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            instantiation = WebAssembly.instantiateStreaming(data, imports);
        } else {
            instantiation = data
            .then(response => response.arrayBuffer())
            .then(buffer => WebAssembly.instantiate(buffer, imports));
        }
    }
    return instantiation.then(({instance}) => {
        wasm = init.wasm = instance.exports;
        return;
    });
};
self.wasm_bindgen = Object.assign(init, __exports);
})();
