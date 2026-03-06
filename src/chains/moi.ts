import { JsonRpcRequest } from "@walletconnect/jsonrpc-utils";

import {
  NamespaceMetadata,
  ChainMetadata,
  ChainRequestRender,
  convertHexToNumber,
  ChainsMap,
} from "../helpers";

export const MoiChainData: ChainsMap = {
  "14": {
    name: "Moi devnet",
    id: "moi:14",
    rpc: ["https://dev.voyage-rpc.moi.technology/devnet/"],
    slip44: 614,
    testnet: true,
  },
};

export const MoiMetadata: NamespaceMetadata = {
  "14": {
    name: "Moi devnet",
    logo: "https://moi.technology/src/img/old/ecosystem/logo-moi-light.svg",
    rgb: "0, 0, 0",
  },
};

export function getChainMetadata(chainId: string): ChainMetadata {
  const reference = chainId.split(":")[1];
  const metadata = MoiMetadata[reference];
  if (typeof metadata === "undefined") {
    throw new Error(`No chain metadata found for chainId: ${chainId}`);
  }
  return metadata;
}

export function getChainRequestRender(
  request: JsonRpcRequest,
): ChainRequestRender[] {
  let params = [{ label: "Method", value: request.method }];
  console.log("Request ", JSON.stringify(request));

  switch (request.method) {
    case "moi.sendInteractions":
    case "moi.signInteraction":
      params = [
        ...params,
        { label: "From", value: request.params[0].from },
        { label: "To", value: request.params[0].to },
        {
          label: "Value",
          value: request.params[0].value
            ? convertHexToNumber(request.params[0].value)
            : "",
        },
        { label: "Data", value: request.params[0].data },
        { label: "Asset ID", value: request.params[0].assetId || "" },
        { label: "Amount", value: request.params[0].amount || "" },
      ];
      break;
    case "moi.sign":
      params = [
        ...params,
        { label: "Address", value: request.params[0] },
        { label: "Message", value: request.params[1] },
      ];
      break;

    default:
      params = [
        ...params,
        {
          label: "params",
          value: JSON.stringify(request.params, null, "\t"),
        },
      ];
      break;
  }
  return params;
}
