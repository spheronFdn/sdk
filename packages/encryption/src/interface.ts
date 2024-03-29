/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chain, ConditionType, SymmetricKey } from "./types";

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

export interface EncryptedData {
  symmetricKey: SymmetricKey;
  encryptedData: Uint8Array;
}
