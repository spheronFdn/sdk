import {
  AccsCOSMOSParams,
  AccsDefaultParams,
  AccsEVMParams,
  AccsOperatorParams,
  AccsRegularParams,
  AccsSOLV2Params,
} from "./interface";

export type AcceptedFileType = File | Blob;

export type SymmetricKey = Uint8Array | string | CryptoKey | BufferSource;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EncryptedSymmetricKey = string | Uint8Array | any;

export type AccessControlConditions = AccsRegularParams[] | AccsDefaultParams[];

export type ConditionType = "solRpc" | "evmBasic" | "evmContract" | "cosmos";

export type Chain = string;

export type EvmContractConditions = AccsEVMParams[];

export type SolRpcConditions = AccsSOLV2Params[];
export type UnifiedAccessControlConditions = (
  | AccsRegularParams
  | AccsDefaultParams
  | AccsEVMParams
  | AccsSOLV2Params
  | AccsCOSMOSParams
  | AccsOperatorParams
)[];
