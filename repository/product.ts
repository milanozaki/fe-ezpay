import { http } from "#/utils/http";
import useSWR from "swr";

const url = {
  getProduct() {
    return `/produk/all`;
  },
};

const hooks = {
  useProduct() {
    return useSWR(url.getProduct(), http.fetcher);
  },
};

const api = {};

export const productRepository = {
  url,
  hooks,
  api,
};
