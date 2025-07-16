import MainWrapper from "@/components/main/MainWrapper";
import { headers } from "next/headers";

export default async function Home() {
  const headersList = headers();
  const headerMap: { [key: string]: string } = {};
  headersList.forEach((value, key) => {
    headerMap[key] = value;
  });

  return (
    <>
      <MainWrapper />
    </>
  );
}
