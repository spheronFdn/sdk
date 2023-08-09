import { CID } from "multiformats/cid";

const ipfs = {
  utils: {
    toV0: (v1: string): string => {
      const cid = CID.parse(v1);
      if (cid.version === 0) return v1;
      return cid.toV0().toString();
    },

    toV1: (v0: string): string => {
      const cid = CID.parse(v0);
      if (cid.version === 1) return v0;
      return cid.toV1().toString();
    },
  },
};

export { ipfs };