/* eslint-disable @typescript-eslint/no-explicit-any */
import { AcceptedFileType, Chain, ConditionType, SymmetricKey } from "./types";

export interface DecryptFileProps {
  file: AcceptedFileType;
  symmetricKey: SymmetricKey;
}

export interface EncryptedFile {
  encryptedFile: Uint8Array;
  symmetricKey: SymmetricKey;
}

export interface MetadataForFile {
  name: string | any;
  type: string | any;
  size: string | number | any;
  accessControlConditions: any[] | any;
  evmContractConditions: any[] | any;
  solRpcConditions: any[] | any;
  unifiedAccessControlConditions: any[] | any;
  chain: string;
  encryptedSymmetricKey: Uint8Array | any;
}

export interface AuthSig {
  sig: any;
  derivedVia: string;
  signedMessage: string;
  address: string;
}

export interface AccsRegularParams {
  conditionType?: ConditionType;
  returnValueTest: {
    key?: string;
    comparator: string;
    value: string;
  };
  method?: string;
  params?: any[];
  chain: Chain;
}

export interface AccsDefaultParams extends AccsRegularParams {
  contractAddress?: string;
  standardContractType?: string;
  parameters?: any;
}

export interface ABIParams {
  name: string;
  type: string;
}

export interface FunctionABI {
  name: string;
  type?: string;
  stateMutability: string;
  inputs: Array<ABIParams | any>;
  outputs: Array<ABIParams | any>;
  constant?: string | boolean;
  payable?: boolean;
}

export interface AccsEVMParams extends AccsRegularParams {
  functionAbi: FunctionABI;
  contractAddress: string;
  functionName: string;
  functionParams: any[];
}

export interface AccsCOSMOSParams extends AccsRegularParams {
  path: string;
}

export interface AccsSOLV2Params extends AccsRegularParams {
  pdaKey: string;
  pdaInterface: {
    offset: string | number;
    fields: string | object;
  };
  pdaParams: [];
}

export interface AccsOperatorParams {
  operator: string;
}

export interface EncryptedString {
  symmetricKey: SymmetricKey;
  encryptedString: Uint8Array;
}
