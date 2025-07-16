import AccountSettingWrapper from "@/components/accountSetting/AccountSettingWrapper";
import fetchDataServer from "@/utils/fetchServer";
import { redirect } from "next/navigation";

const checkJwt = async () => {
  const res = fetchDataServer({
    url: "/user/jwt",
  });

  return res;
};

export default async function AccountSettingPage() {
  const jwt = await checkJwt();
  if (jwt.code !== 0) {
    redirect("/");
  }
  return (
    <>
      <AccountSettingWrapper />
    </>
  );
}
