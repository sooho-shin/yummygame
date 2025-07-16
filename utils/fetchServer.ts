import { getCookie } from "@/utils";
function startsWithApi(text: string) {
  const regex = /^\/api/;
  return regex.test(text);
}
const headers = import("next/headers");
const fetchDataServer = async ({
  url,
  method = "get",
  data,
  options,
  isMultipart = false,
}: {
  url: string;
  method?: string;
  data?: any;
  options?: any;
  isMultipart?: boolean;
}) => {
  let reUrl = url;
  let token;
  let isServerSide = false;
  if (typeof window === "undefined") {
    isServerSide = true;
    const c = (await headers).cookies();
    token = c.get("token")?.value;
  } else {
    token = getCookie("token");
  }
  if (url && !startsWithApi(url)) {
    reUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  }
  if (method === "get" && data) {
    reUrl += `?${new URLSearchParams(data).toString()}`;
  }
  let sendOption: RequestInit;

  if (isMultipart) {
    sendOption = {
      method,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  } else {
    sendOption = {
      method,
      headers: {
        "Content-Type": isMultipart ? "" : "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  }

  if (method === "post" && data) {
    if (isMultipart) {
      sendOption.body = data;
    } else {
      sendOption.body = JSON.stringify(data);
    }
  }

  if ((method === "put" || method === "delete") && data) {
    sendOption.body = JSON.stringify(data);
  }

  const res = await fetch(reUrl, sendOption);

  if (res.status === 401) {
    if (!isServerSide && token) {
      let cookieStr = `token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      if (process.env.NEXT_PUBLIC_COOKIE_DOMAIN)
        cookieStr += ` domain=${process.env.NEXT_PUBLIC_COOKIE_DOMAIN};`;
      window.document.cookie = cookieStr;
    }
  }

  return res.json();
};

export default fetchDataServer;
