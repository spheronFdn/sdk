/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AuthSig,
  AccessControlConditions,
  EvmContractConditions,
  SolRpcConditions,
  UnifiedAccessControlConditions,
  Chain,
} from "@spheron/encryption";

export interface EncryptToIpfsProps {
  // The authSig of the user.
  authSig?: AuthSig;

  // the session signatures to use to authorize the user with the nodes
  sessionSigs?: any;

  // The access control conditions that the user must meet to obtain this signed token.  This could be possession of an NFT, for example.  You must pass either accessControlConditions or evmContractConditions or solRpcConditions or unifiedAccessControlConditions.
  accessControlConditions?: AccessControlConditions;

  // EVM Smart Contract access control conditions that the user must meet to obtain this signed token.  This could be possession of an NFT, for example.  This is different than accessControlConditions because accessControlConditions only supports a limited number of contract calls.  evmContractConditions supports any contract call.  You must pass either accessControlConditions or evmContractConditions or solRpcConditions or unifiedAccessControlConditions.
  evmContractConditions?: EvmContractConditions;

  // Solana RPC call conditions that the user must meet to obtain this signed token.  This could be possession of an NFT, for example.
  solRpcConditions?: SolRpcConditions;

  // An array of unified access control conditions.  You may use AccessControlCondition, EVMContractCondition, or SolRpcCondition objects in this array, but make sure you add a conditionType for each one.  You must pass either accessControlConditions or evmContractConditions or solRpcConditions or unifiedAccessControlConditions.
  unifiedAccessControlConditions?: UnifiedAccessControlConditions;

  // The chain name of the chain that this contract is deployed on.  See LIT_CHAINS for currently supported chains.
  chain: Chain;

  // The string you wish to encrypt
  string?: string;

  // The path to the file you wish to encrypt
  filePath?: string;

  // An instance of LitNodeClient that is already connected
  litNodeClient: any;

  configuration: {
    name: string;
    onUploadInitiated?: (uploadId: string) => void;
    onChunkUploaded?: (uploadedSize: number, totalSize: number) => void;
  };
}

export interface DecryptFromIpfsProps {
  // The authSig of the user.  Returned via the checkAndSignAuthMessage function
  authSig?: AuthSig;

  // the session signatures to use to authorize the user with the nodes
  sessionSigs?: any;

  // The ipfsCid/ipfsHash of the encrypted string & metadata stored on IPFS
  ipfsCid: string;

  // An instance of LitNodeClient that is already connected
  litNodeClient: any;
}

export interface DealDataResult {
  pieceSize: number;
  size: number;
  pieceCid: string;
  dataCid: string;
  carLink: string;
}
