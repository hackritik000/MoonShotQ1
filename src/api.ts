import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios, { isCancel } from "axios";
export enum methods {
  get = "get",
  post = "post",
  delete = "delete",
  patch = "patch",
  put = "put",
}
export const api = async (method: methods, url: string, data: object = {}) => {
  const controller = new AbortController();
  return (async () => {
    try {
      const response = await axios[method](url, {
        ...data,
        signal: controller.signal,
      });
      const responseData = response.data;
      return responseData;
    } catch (err: unknown) {
      if (isCancel(err)) {
        console.log("---------------------------");
        console.log(err);
        console.log("---------------------------");
        return err;
      }
      return err;
    }
  })();
};
export interface FetchEmailListResponse {
  list: {
    id: string;
    subject: string;
    short_description: string;
    from: {
      email: string;
      name: string;
    };
    date: number;
  }[];
  total: number;
}
export interface FetchEmailBodyResponse {
  id: string;
  body: string;
}

const fetchEmailList: (
  page: number,
) => Promise<FetchEmailListResponse> = async (page) => {
  const response = await api(
    methods.get,
    `https://flipkart-email-mock.now.sh/?page=${page}`,
  );
  return response;
};
const fetchEmailBody: (id: string) => Promise<FetchEmailBodyResponse> = async (
  id,
) => {
  const response = await api(
    methods.get,
    `https://flipkart-email-mock.now.sh/?id=${id}`,
  );
  return response;
};

export const useFetchEmailList = (initialPage: number = 1) => {
  return useInfiniteQuery<FetchEmailListResponse, Error>({
    queryKey: ["emails"],
    queryFn: ({ pageParam }) => fetchEmailList(pageParam),
    initialPageParam: initialPage,
    getNextPageParam: (lastpage, index) => {
      if (index.length * 10 <= lastpage.total) {
        return index.length + 1;
      }
    },
  });
};

export const useFetchEmailBody = (id: string) => {
  return useQuery({
    queryKey: ["emailBody", id],
    queryFn: () => fetchEmailBody(id),
    enabled: !!id,
  });
};
