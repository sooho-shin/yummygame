"use client";

import { CookieOption, customConsole } from "@/utils";

import { snsLogin } from "@/lib/firebase";
import { User, UserCredential } from "firebase/auth";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./styles/modal.module.scss";

import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import {
  useGetUserGeneralSignIn,
  useGetUserSignIn,
  useGetUserSignUp,
  usePostGeneralSignupCheck,
} from "@/querys/user";
import { useModalStore } from "@/stores/useModal";
import { useUserStore } from "@/stores/useUser";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCookies } from "react-cookie";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CommonButton from "@/components/common/Button";
import classNames from "classnames";
import CommonInputBox from "@/components/common/InputBox";
import { useImmer } from "use-immer";

interface CountryObject {
  name: string;
  code: string;
}

export default function GetStarted() {
  const { login, token, setFirstLogin } = useUserStore();
  const t = useDictionary();
  const { closeModal, openModal, props } = useModalHook();
  const { googleAccessToken } = useModalStore();
  const [step, setStep] = useState(1);
  const [countryContainerState, setCountryContainerState] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [searchedCountry, setSearchedCountry] = useState<[] | CountryObject[]>(
    [],
  );

  const searchParams = useSearchParams();
  const affiliateCodeParam = searchParams.get("modalCode");
  const telegramParam = searchParams.get("tg");

  const [isAgreePp, setIsAgreePp] = useState(false);
  const [locale, setLocale] = useState<null | string>(null);
  const [cookie, setCookie] = useCookies();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (affiliateCodeParam) {
      setCookie("affiliateCode", affiliateCodeParam, CookieOption);
    }
  }, [affiliateCodeParam]);

  useEffect(() => {
    if (cookie.affiliateCode) {
      setReferralCode(cookie.affiliateCode);
    }
  }, [cookie.affiliateCode]);

  useEffect(() => {
    if (cookie.tracking) {
      setTracking(cookie.tracking);
    }
  }, [cookie.tracking]);

  const [referralCode, setReferralCode] = useState<null | string>(null);
  const [tracking, setTracking] = useState<null | string>(null);
  const [searchCountry, setSearchCountry] = useState<string | null>(null);
  const [searchState, setSearchState] = useState(false);

  const [depositBonusData, setDepositBonusData] = useState<null | {
    referralCode: string;
    is_partner_code: boolean;
    default_data: {
      // bonus_multiply: number;
      max_deposit_dollar: number;
      min_deposit_dollar: number;
      roll_over_multiply: number;
      bonus_multiply: number;
    };
  }>(null);

  useEffect(() => {
    if (token && !depositBonusData) {
      closeModal();
    }
    if (token && depositBonusData) {
      openModal({ type: "depositBonus", props: depositBonusData });
    }
  }, [token, depositBonusData]);

  useEffect(() => {
    setCountryContainerState(false);
  }, [locale]);

  useEffect(() => {
    if (!googleAccessToken) return;
    setStep(2);
    setAccessToken(googleAccessToken);
  }, [googleAccessToken]);

  const countryData = useMemo(() => {
    return [
      { name: "Afghanistan", code: "AF" },
      { name: "Åland Islands", code: "AX" },
      { name: "Albania", code: "AL" },
      { name: "Algeria", code: "DZ" },
      { name: "Andorra", code: "AD" },
      { name: "Antarctica", code: "AQ" },
      { name: "Antigua and Barbuda", code: "AG" },
      { name: "Argentina", code: "AR" },
      { name: "Armenia", code: "AM" },
      { name: "Azerbaijan", code: "AZ" },
      { name: "Bangladesh", code: "BD" },
      { name: "Barbados", code: "BB" },
      { name: "Belgium", code: "BE" },
      { name: "Belize", code: "BZ" },
      { name: "Benin", code: "BJ" },
      { name: "Bolivia", code: "BO" },
      { name: "Bosnia and Herzegovina", code: "BA" },
      { name: "Bouvet Island", code: "BV" },
      { name: "Brazil", code: "BR" },
      { name: "British Indian Ocean Territory", code: "IO" },
      { name: "Bulgaria", code: "BG" },
      { name: "Burkina Faso", code: "BF" },
      { name: "Burundi", code: "BI" },
      { name: "Cambodia", code: "KH" },
      { name: "Cameroon", code: "CM" },
      { name: "Canada", code: "CA" },
      { name: "Cape Verde", code: "CV" },
      { name: "Central African Republic", code: "CF" },
      { name: "Chile", code: "CL" },
      { name: "China", code: "CN" },
      { name: "Christmas Island", code: "CX" },
      { name: "Cocos (Keeling) Islands", code: "CC" },
      { name: "Colombia", code: "CO" },
      { name: "Cook Islands", code: "CK" },
      { name: "Costa Rica", code: "CR" },
      { name: 'Cote d"Ivoire"', code: "CI" },
      { name: "Croatia", code: "HR" },
      { name: "Cuba", code: "CU" },
      { name: "Cyprus", code: "CY" },
      { name: "Czech Republic", code: "CZ" },
      { name: "Denmark", code: "DK" },
      { name: "Djibouti", code: "DJ" },
      { name: "Dominica", code: "DM" },
      { name: "Dominican Republic", code: "DO" },
      { name: "Ecuador", code: "EC" },
      { name: "Egypt", code: "EG" },
      { name: "El Salvador", code: "SV" },
      { name: "Equatorial Guinea", code: "GQ" },
      { name: "Eritrea", code: "ER" },
      { name: "Estonia", code: "EE" },
      { name: "Eswatini", code: "SZ" },
      { name: "Ethiopia", code: "ET" },
      { name: "Faroe Islands", code: "FO" },
      { name: "Fiji", code: "FJ" },
      { name: "Finland", code: "FI" },
      { name: "Gabon", code: "GA" },
      { name: "Georgia", code: "GE" },
      { name: "Ghana", code: "GH" },
      { name: "Greece", code: "GR" },
      { name: "Greenland", code: "GL" },
      { name: "Grenada", code: "GD" },
      { name: "Guatemala", code: "GT" },
      { name: "Guernsey", code: "GG" },
      { name: "Guinea", code: "GN" },
      { name: "Guinea-Bissau", code: "GW" },
      { name: "Guyana", code: "GY" },
      { name: "Haiti", code: "HT" },
      { name: "Heard Island and McDonald Islands", code: "HM" },
      { name: "Holy See (Vatican City)", code: "VA" },
      { name: "Honduras", code: "HN" },
      { name: "Hong Kong", code: "HK" },
      { name: "Iceland", code: "IS" },
      { name: "India", code: "IN" },
      { name: "Indonesia", code: "ID" },
      { name: "Ireland", code: "IE" },
      { name: "Isle of Man", code: "IM" },
      { name: "Israel", code: "IL" },
      { name: "Italy", code: "IT" },
      { name: "Jamaica", code: "JM" },
      { name: "Japan", code: "JP" },
      { name: "Jersey", code: "JE" },
      { name: "Kazakhstan", code: "KZ" },
      { name: "Kenya", code: "KE" },
      { name: "Kiribati", code: "KI" },
      { name: "Kyrgyzstan", code: "KG" },
      { name: "Laos", code: "LA" },
      { name: "Latvia", code: "LV" },
      { name: "Lesotho", code: "LS" },
      { name: "Liberia", code: "LR" },
      { name: "Libya", code: "LY" },
      { name: "Liechtenstein", code: "LI" },
      { name: "Lithuania", code: "LT" },
      { name: "Luxembourg", code: "LU" },
      { name: "Macau", code: "MO" },
      { name: "Madagascar", code: "MG" },
      { name: "Malawi", code: "MW" },
      { name: "Malaysia", code: "MY" },
      { name: "Maldives", code: "MV" },
      { name: "Mali", code: "ML" },
      { name: "Malta", code: "MT" },
      { name: "Martinique", code: "MQ" },
      { name: "Mauritania", code: "MR" },
      { name: "Mauritius", code: "MU" },
      { name: "Mexico", code: "MX" },
      { name: "Moldova", code: "MD" },
      { name: "Monaco", code: "MC" },
      { name: "Mongolia", code: "MN" },
      { name: "Montenegro", code: "ME" },
      { name: "Morocco", code: "MA" },
      { name: "Mozambique", code: "MZ" },
      { name: "Namibia", code: "NA" },
      { name: "Nauru", code: "NR" },
      { name: "Nepal", code: "NP" },
      { name: "New Zealand", code: "NZ" },
      { name: "Nicaragua", code: "NI" },
      { name: "Niger", code: "NE" },
      { name: "Nigeria", code: "NG" },
      { name: "Niue", code: "NU" },
      { name: "Norfolk Island", code: "NF" },
      { name: "North Macedonia", code: "MK" },
      { name: "Northern Mariana Islands", code: "MP" },
      { name: "Norway", code: "NO" },
      { name: "Palestinian Territory", code: "PS" },
      { name: "Panama", code: "PA" },
      { name: "Papua New Guinea", code: "PG" },
      { name: "Paraguay", code: "PY" },
      { name: "Peru", code: "PE" },
      { name: "Philippines", code: "PH" },
      { name: "Pitcairn Islands", code: "PN" },
      { name: "Poland", code: "PL" },
      { name: "Puerto Rico", code: "PR" },
      { name: "Republic of Kosovo", code: "XK" },
      { name: "Romania", code: "RO" },
      { name: "Russian Federation", code: "RU" },
      { name: "Rwanda", code: "RW" },
      { name: "Saint Kitts and Nevis", code: "KN" },
      { name: "Saint Lucia", code: "LC" },
      { name: "Saint Vincent and the Grenadines", code: "VC" },
      { name: "San Marino", code: "SM" },
      { name: "Sao Tome and Principe", code: "ST" },
      { name: "Senegal", code: "SN" },
      { name: "Serbia", code: "RS" },
      { name: "Seychelles", code: "SC" },
      { name: "Sierra Leone", code: "SL" },
      { name: "Singapore", code: "SG" },
      { name: "Slovakia", code: "SK" },
      { name: "Slovenia", code: "SI" },
      { name: "Solomon Islands", code: "SB" },
      { name: "Somalia", code: "SO" },
      { name: "South Africa", code: "ZA" },
      { name: "South Georgia and the South Sandwich Islands", code: "GS" },
      { name: "South Sudan", code: "SS" },
      { name: "Sri Lanka", code: "LK" },
      { name: "Sudan", code: "SD" },
      { name: "Suriname", code: "SR" },
      { name: "Svalbard", code: "SJ" },
      { name: "Sweden", code: "SE" },
      { name: "Switzerland", code: "CH" },
      { name: "Taiwan", code: "TW" },
      { name: "Tajikistan", code: "TJ" },
      { name: "Tanzania", code: "TZ" },
      { name: "Thailand", code: "TH" },
      { name: "The Bahamas", code: "BS" },
      { name: "The Gambia", code: "GM" },
      { name: "Timor-Leste", code: "TL" },
      { name: "Togo", code: "TG" },
      { name: "Tokelau", code: "TK" },
      { name: "Tonga", code: "TO" },
      { name: "Trinidad and Tobago", code: "TT" },
      { name: "Tunisia", code: "TN" },
      { name: "Turkmenistan", code: "TM" },
      { name: "Tuvalu", code: "TV" },
      { name: "Uganda", code: "UG" },
      { name: "Ukraine", code: "UA" },
      { name: "United States Minor Outlying Islands", code: "UM" },
      { name: "Uruguay", code: "UY" },
      { name: "Uzbekistan", code: "UZ" },
      { name: "Vanuatu", code: "VU" },
      { name: "Venezuela", code: "VE" },
      { name: "Vietnam", code: "VN" },
      { name: "Western Sahara", code: "EH" },
      { name: "Western Samoa", code: "WS" },
      { name: "Yemen", code: "YE" },
      { name: "Zambia", code: "ZM" },
      { name: "Zimbabwe", code: "ZW" },
    ];
  }, []);

  function generateAlphabetArray(): string[] {
    const alphabetArray: string[] = [];

    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      // alphabetArray.push(letter);
      if (letter !== "X") {
        alphabetArray.push(letter);
      }
    }

    return alphabetArray;
  }

  const alphabetArray: string[] = generateAlphabetArray();

  // 특정 알파벳으로 시작하는 국가만 뽑아내는 함수
  const filteredCountries = (word: string) => {
    const filterdCountriesArray: CountryObject[] = [];

    for (const country of countryData) {
      if (country.name.startsWith(word)) {
        filterdCountriesArray.push(country);
      }
    }

    return filterdCountriesArray;
  };

  const router = useRouter();

  const handleClickSnsLogin = async () => {
    const provider: UserCredential = await snsLogin("google");
    const user: User = provider.user;
    const accessToken = (await user.getIdTokenResult()).token;

    if (accessToken) {
      signIn(accessToken);
    }
  };

  const { mutate: mutateSignIn } = useGetUserSignIn();
  const { showErrorMessage } = useCommonHook();

  const signIn = async (accessToken: string | null) => {
    if (!accessToken) {
      return false;
    }
    mutateSignIn(
      { accessToken, telegram: !!telegramParam },

      {
        onSuccess(data) {
          if (data.code === 0) {
            login(data.result);
            setCookie("token", data.result, CookieOption);
            if (step === 2) {
              setFirstLogin(true);
            }

            return false;
          }

          if (data.code === -10001) {
            setAccessToken(accessToken);
            // let modalData: {
            //   type: string;
            //   props?: any;
            // } = {
            //   type: "getstarted",
            // };
            // if (props.telegramHash) {
            //   modalData = {
            //     type: "getstarted",
            //     props: {
            //       telegramHash: props.telegramHash,
            //     },
            //   };
            // }
            // openModal(modalData);
            setStep(2);

            return false;
          }

          // 이거 순서를 바꾼 이유를 모르겠음
          showErrorMessage(data.code);
        },
      },
    );
  };

  // useEffect(() => {
  //   if (te) {
  //     signIn(te);
  //   }
  // }, [props]);

  const { mutate: mutateSignUp, isLoading } = useGetUserSignUp();

  const [tab, setTab] = useState<"register" | "login">("login");

  const registerUsernameInputRef = useRef<HTMLInputElement>(null);
  const loginEmailInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (tab === "login") {
      loginEmailInputRef?.current?.focus();
    } else {
      registerUsernameInputRef?.current?.focus();
    }
  }, [tab]);

  // "email": "string",            -> 이메일
  // "username": "string",         -> username(닉네임)
  // "password": "string",         -> 비밀번호
  // "localeCode": "string",       -> 국가코드
  // "referralCode": "string",     -> 추천인코드
  // "isAgreeTosAndPp": 0,         -> 약관동의여부
  // "tracking": "string"          -> 트래킹 코드
  const [registerData, setRegisterData] = useImmer<{
    email: string | null;
    username: string | null;
    password: string | null;
  }>({
    email: null,
    username: null,
    password: null,
  });

  const [loginData, setLoginData] = useImmer<{
    email: string | null;
    password: string | null;
  }>({
    email: null,
    password: null,
  });

  const { mutate: mutateGeneralSignIn, isLoading: isGeneralSignInLoading } =
    useGetUserGeneralSignIn();
  const [loginErrorState, setLoginErrorState] = useState<boolean>(false);
  const generalSignIn = async () => {
    if (!(loginData.email && loginData.password)) {
      return false;
    }

    mutateGeneralSignIn(
      { email: loginData.email, password: loginData.password },
      {
        onSuccess(data) {
          if (data.code === 0) {
            login(data.result);
            customConsole("set token cookieOption:", CookieOption);
            setCookie("token", data.result, CookieOption);

            if (step === 2) {
              setFirstLogin(true);
            }

            return false;
          } else {
            setLoginErrorState(true);
          }
        },
      },
    );
  };
  const [errorMessage, setErrorMessage] = useImmer<{
    email: string | null;
    username: string | null;
    password: string | null;
  }>({
    email: null,
    username: null,
    password: null,
  });

  const [passwordValidate, setPasswordValidate] = useImmer<
    { text: string; check: boolean }[] | null
  >(null);

  const [typingState, setTypingState] = useImmer<{
    username: boolean;
    email: boolean;
    password: boolean;
  }>({
    username: false,
    email: false,
    password: false,
  });

  //username validation
  useEffect(() => {
    if (typingState.username) {
      if (!registerData.username) {
        setErrorMessage(draft => {
          draft.username = t("modal_514");
          return draft;
        });
      } else {
        if (
          !(
            registerData.username.length >= 2 &&
            registerData.username.length <= 16
          )
        ) {
          setErrorMessage(draft => {
            draft.username = t("modal_515");
            return draft;
          });
        } else {
          const regExp = /^[A-Za-z0-9]*$/;
          const result = regExp.test(registerData.username);
          if (!result) {
            setErrorMessage(draft => {
              draft.username = t("modal_516");
              return draft;
            });
          } else {
            setErrorMessage(draft => {
              draft.username = null;
              return draft;
            });
          }
        }
      }
    }
  }, [registerData.username, typingState.username]);

  const disbleRegistration = useMemo(
    () =>
      !!(
        !registerData.username ||
        !registerData.password ||
        !registerData.email ||
        errorMessage.username ||
        errorMessage.password ||
        errorMessage.email ||
        (typingState.password &&
          passwordValidate &&
          passwordValidate.some(item => !item.check))
      ),
    [registerData, errorMessage, typingState, passwordValidate],
  );

  //email validation
  useEffect(() => {
    if (typingState.email) {
      if (!registerData.email) {
        setErrorMessage(draft => {
          draft.email = t("modal_517");
          return draft;
        });
      } else {
        const regExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const result = regExp.test(registerData.email);
        if (!result) {
          setErrorMessage(draft => {
            draft.email = t("modal_518");
            return draft;
          });
        } else {
          setErrorMessage(draft => {
            draft.email = null;
            return draft;
          });
        }
      }
    }
  }, [registerData.email, typingState.email]);

  //password validation
  useEffect(() => {
    if (typingState.password && registerData.password) {
      const passwordValidateList: { text: string; check: boolean }[] = [
        { text: t("modal_519"), check: false },
        { text: t("modal_520"), check: false },
        { text: t("modal_521"), check: false },
      ];
      const { password } = registerData;

      // (1) 8-16자 범위 체크
      if (password.length >= 8 && password.length <= 16) {
        const item = passwordValidateList.find(v => v.text === t("modal_519"));
        if (item) {
          item.check = true;
        }
      }

      // (2) 알파벳 최소 1개 포함 체크
      if (/[a-zA-Z]/.test(password)) {
        const item = passwordValidateList.find(v => v.text === t("modal_520"));
        if (item) {
          item.check = true;
        }
      }
      // (3) 숫자 최소 1개 포함 체크
      if (/\d/.test(password)) {
        const item = passwordValidateList.find(v => v.text === t("modal_521"));
        if (item) {
          item.check = true;
        }
      }

      setPasswordValidate(passwordValidateList);
    }
  }, [registerData.password, typingState.password]);

  const { mutate: postGeneralSignupCheck } = usePostGeneralSignupCheck();

  const signUp = async () => {
    if (!isAgreePp || !locale) {
      return false;
    }

    let data: {
      email?: string;
      username?: string;
      password?: string;
      accessToken?: string;
      isAgreeTosAndPp: 1 | 0;
      localeCode: string;
      referralCode?: string | null;
      tracking?: string | null;
      telegram?: boolean;
      hash?: string;
    } = {
      isAgreeTosAndPp: isAgreePp ? 1 : 0,
      localeCode: locale,
    };

    if (registerData.email && registerData.username && registerData.password) {
      data = {
        ...data,
        email: registerData.email,
        username: registerData.username,
        password: registerData.password,
      };
    }

    if (accessToken && telegramParam) {
      data = { ...data, hash: accessToken };
    }

    if (accessToken && !telegramParam) {
      data = { ...data, accessToken };
    }

    if (referralCode) {
      data = { ...data, referralCode };
    }

    if (tracking) {
      data = { ...data, tracking };
    }

    if (telegramParam) {
      data = { ...data, telegram: true };
    }

    mutateSignUp(data, {
      onSuccess(data: {
        code: number;
        message: string;
        result: {
          jwt: string;
          depositBonusData?: {
            is_partner_code: boolean;
            default_data: {
              // bonus_multiply: number;
              max_deposit_dollar: number;
              min_deposit_dollar: number;
              roll_over_multiply: number;
              bonus_multiply: number;
            };
          };
        };
      }) {
        if (data.code === 0) {
          if (
            data.result.depositBonusData &&
            data.result.depositBonusData.is_partner_code &&
            referralCode
          ) {
            setDepositBonusData({
              referralCode: referralCode,
              ...data.result.depositBonusData,
            });
          }
          login(data.result.jwt);
          setCookie("token", data.result.jwt, CookieOption);
          if (step === 2) {
            setFirstLogin(true);
          }
          // signIn(accessToken);
          // router.refresh();
          return false;
        }
        showErrorMessage(data.code);
      },
    });
  };

  function searchStringsInArray(searchString: string): CountryObject[] {
    const result: CountryObject[] = [];
    countryData.forEach(country => {
      if (
        country.name
          .toLocaleLowerCase()
          .includes(searchString.toLocaleLowerCase())
      ) {
        result.push(country);
      }
    });
    return result;
  }

  function getRandomZeroOrOne() {
    // Math.random()은 0 이상 1 미만의 난수를 생성하므로 0.5보다 작으면 0을, 그렇지 않으면 1을 반환합니다.
    return Math.random() < 0.5 ? 0 : 1;
  }

  return (
    <div className={styles["getstarted-modal"]}>
      {step === 1 && (
        <div className={`${styles["step-1"]}`}>
          <div className={styles.top}>
            <h5>{t("modal_144")}</h5>
          </div>
          <div className={styles.content}>
            <div className={styles["tab-row"]}>
              <button
                type={"button"}
                className={classNames({ [styles.active]: tab === "register" })}
                onClick={() => setTab("register")}
              >
                <span>{t("modal_550")}</span>
              </button>
              <button
                type={"button"}
                className={classNames({ [styles.active]: tab === "login" })}
                onClick={() => setTab("login")}
              >
                <span>{t("modal_551")}</span>
              </button>
            </div>
            <div className={styles["tab-content"]}>
              <div className={styles["register-container"]}>
                {tab === "login" && (
                  <>
                    <CommonInputBox
                      title={t("modal_522")}
                      required={true}
                      placeholder={t("modal_523")}
                      className={styles["input-row"]}
                      value={loginData.email ?? ""}
                      inputRef={loginEmailInputRef}
                      onChange={e => {
                        if (!e.target.value) {
                          setLoginData(draft => {
                            draft.email = null;
                            return draft;
                          });
                        } else {
                          // setTypingState(draft => {
                          //   draft.email = true;
                          //   return draft;
                          // });
                          setLoginErrorState(false);
                          setLoginData(draft => {
                            draft.email = e.target.value;
                            return draft;
                          });
                        }
                      }}
                      deleteValueFn={() =>
                        setLoginData(draft => {
                          draft.email = null;
                          return draft;
                        })
                      }
                      onKeyDownCallback={() => generalSignIn()}
                    />
                    <CommonInputBox
                      title={t("modal_524")}
                      required={true}
                      placeholder={t("modal_525")}
                      className={styles["input-row"]}
                      value={loginData.password ?? ""}
                      onChange={e => {
                        if (!e.target.value) {
                          setLoginData(draft => {
                            draft.password = null;
                            return draft;
                          });
                        } else {
                          setLoginErrorState(false);
                          setLoginData(draft => {
                            draft.password = e.target.value;
                            return draft;
                          });
                        }
                      }}
                      password={true}
                      onKeyDownCallback={() => generalSignIn()}
                    />
                    <div className={styles["forget-box"]}>
                      <button
                        type={"button"}
                        onClick={() => {
                          openModal({ type: "forgetAccount" });
                          closeModal();
                        }}
                      >
                        <span>{t("modal_526")}</span>
                      </button>
                    </div>
                    {loginErrorState && (
                      <p className={styles["login-error-box"]}>
                        {t("modal_527")}
                      </p>
                    )}
                  </>
                )}
                {tab === "register" && (
                  <>
                    <CommonInputBox
                      title={t("modal_528")}
                      required={true}
                      placeholder={t("modal_529")}
                      className={styles["input-row"]}
                      value={registerData.username ?? ""}
                      inputRef={registerUsernameInputRef}
                      onChange={e => {
                        if (!e.target.value) {
                          setRegisterData(draft => {
                            draft.username = null;
                            return draft;
                          });
                        } else {
                          setTypingState(draft => {
                            draft.username = true;
                            return draft;
                          });
                          setRegisterData(draft => {
                            draft.username = e.target.value;
                            return draft;
                          });
                        }
                      }}
                      deleteValueFn={() =>
                        setRegisterData(draft => {
                          draft.username = null;
                          return draft;
                        })
                      }
                      errorData={{ text: errorMessage.username, align: "left" }}
                    />
                    <CommonInputBox
                      title={t("modal_522")}
                      required={true}
                      placeholder={t("modal_523")}
                      className={styles["input-row"]}
                      value={registerData.email ?? ""}
                      onChange={e => {
                        if (!e.target.value) {
                          setRegisterData(draft => {
                            draft.email = null;
                            return draft;
                          });
                        } else {
                          setTypingState(draft => {
                            draft.email = true;
                            return draft;
                          });
                          setRegisterData(draft => {
                            draft.email = e.target.value;
                            return draft;
                          });
                        }
                      }}
                      deleteValueFn={() =>
                        setRegisterData(draft => {
                          draft.email = null;
                          return draft;
                        })
                      }
                      errorData={{ text: errorMessage.email, align: "left" }}
                    />
                    <CommonInputBox
                      title={t("modal_524")}
                      required={true}
                      placeholder={t("modal_525")}
                      className={styles["input-row"]}
                      value={registerData.password ?? ""}
                      onChange={e => {
                        if (!e.target.value) {
                          setRegisterData(draft => {
                            draft.password = null;
                            return draft;
                          });
                        } else {
                          setTypingState(draft => {
                            draft.password = true;
                            return draft;
                          });
                          setRegisterData(draft => {
                            draft.password = e.target.value;
                            return draft;
                          });
                        }
                      }}
                      password={true}
                      errorData={{
                        text: null,
                        listTitle: t("modal_544"),
                        align: "left",
                        list: passwordValidate,
                      }}
                    />
                  </>
                )}

                <div className={styles["btn-container"]}>
                  {tab === "register" && (
                    <CommonButton
                      onClick={() => {
                        if (
                          registerData.email &&
                          registerData.username &&
                          registerData.password
                        ) {
                          postGeneralSignupCheck(
                            {
                              email: registerData.email,
                              username: registerData.username,
                              password: registerData.password,
                            },
                            {
                              onSuccess: data => {
                                if (data.result) {
                                  // 성공
                                  // -10002 : 이메일 유효성 검사 실패
                                  // -10004 : 이메일 중복
                                  // -10037 : username 중복
                                  // -10036 : 비밀번호 유효성 검사 실패

                                  setStep(2);
                                } else {
                                  if (data.code === -10002) {
                                    setErrorMessage(draft => {
                                      draft.email = t("modal_530");
                                      return draft;
                                    });
                                  }
                                  if (data.code === -10004) {
                                    setErrorMessage(draft => {
                                      draft.email = t("modal_531");
                                      return draft;
                                    });
                                  }
                                  if (data.code === -10037) {
                                    setErrorMessage(draft => {
                                      draft.username = t("modal_532");
                                      return draft;
                                    });
                                  }
                                  if (data.code === -10036) {
                                    setErrorMessage(draft => {
                                      draft.email = t("modal_533");
                                      return draft;
                                    });
                                  }
                                }
                              },
                            },
                          );
                        }
                      }}
                      disabled={disbleRegistration}
                      text={t("modal_157")}
                      className={styles["btn-confirm"]}
                      isPending={isLoading}
                    />
                  )}
                  {tab === "login" && (
                    <CommonButton
                      onClick={() => generalSignIn()}
                      disabled={
                        !loginData.email ||
                        !loginData.password ||
                        loginErrorState
                      }
                      text={"Login"}
                      className={styles["btn-confirm"]}
                      isPending={isGeneralSignInLoading}
                    />
                  )}
                </div>
                <p className={styles["continue-text-row"]}>Or continue with</p>
                <button
                  type="button"
                  className={styles["btn-google"]}
                  onClick={() => handleClickSnsLogin()}
                >
                  <span>{t("modal_145")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className={styles["step-2"]}>
          <div className={styles.top}>
            <h5>{t("modal_148")}</h5>
            <p>{t("modal_149")}</p>
            <div></div>
          </div>
          <div className={styles.content}>
            <div className={styles["input-box"]}>
              <p className={styles.title}>{t("modal_150")}</p>
              <div className={styles["input-area"]}>
                <button
                  type="button"
                  onClick={() => setCountryContainerState(true)}
                  className={styles["select-btn"]}
                >
                  <span className={`${locale ? styles.active : ""}`}>
                    {locale ?? t("modal_151")}
                  </span>
                  <Image
                    src="/images/common/ico_arrow_w.svg"
                    alt="img arrow"
                    width="24"
                    height="24"
                    priority
                  />
                </button>
              </div>
            </div>
            <div className={styles["input-box"]}>
              <p className={styles.title}>{t("modal_152")}</p>
              <div className={styles["input-area"]}>
                <input
                  type="checkbox"
                  id="check"
                  onChange={({ target: { checked } }) => setIsAgreePp(checked)}
                />
                <label htmlFor="check">
                  <span>{t("modal_153")}</span>
                </label>
              </div>
              <p className={styles.sub}>
                {t("modal_154")}
                <a
                  href={`${process.env.NEXT_PUBLIC_URL}/policies/terms`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{t("modal_152")}</span>
                </a>{" "}
                ,{" "}
                <a
                  href={`${process.env.NEXT_PUBLIC_URL}/policies/privacy`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{t("modal_155")}</span>
                </a>
                .
              </p>
            </div>
            <div className={styles["input-box"]}>
              <p className={`${styles.title} ${styles["not-important"]}`}>
                {t("modal_156")}
              </p>
              <div className={styles["input-area"]}>
                <input
                  type="text"
                  value={referralCode ?? ""}
                  onChange={e => {
                    setReferralCode(e.target.value);
                  }}
                />
                {referralCode && (
                  <button
                    type="button"
                    className={styles["delete-btn"]}
                    onClick={() => setReferralCode(null)}
                  ></button>
                )}
              </div>
              {/* <p className={styles.error}>Enter a valid code.</p> */}
            </div>
          </div>
          <div className={styles["btn-container"]}>
            <CommonButton
              onClick={() => signUp()}
              disabled={!locale || !isAgreePp}
              text={t("modal_157")}
              className={styles["btn-confirm"]}
              isPending={isLoading}
            />
          </div>
        </div>
      )}
      <div
        className={`${styles["country-wrapper"]} ${
          countryContainerState && styles.active
        }`}
      >
        <div className={styles.top}>
          <button
            type="button"
            className={styles["btn-back"]}
            onClick={() => setCountryContainerState(false)}
          ></button>
          <h5>{t("modal_158")}</h5>
        </div>
        <div className={styles["search-area"]}>
          <div className={styles["input-box"]}>
            <div className={styles["input-area"]}>
              <input
                type="text"
                placeholder={t("modal_159")}
                value={searchCountry ?? ""}
                onChange={e => {
                  const value = e.target.value.trim();
                  setSearchCountry(e.target.value);
                  if (value) {
                    setSearchState(true);
                    setSearchedCountry(searchStringsInArray(value));
                  } else {
                    setSearchState(false);
                    setSearchedCountry([]);
                  }
                }}
              />
              {searchCountry && (
                <button type="button" className={styles["delete-btn"]}></button>
              )}
            </div>
          </div>
        </div>
        <div className={styles["country-box"]}>
          <div className={styles["scroll-box"]}>
            {/* <div className={styles["top-dim"]}></div> */}
            {searchState ? (
              <div className={styles.box}>
                {searchedCountry.length > 0 ? (
                  <ul>
                    {searchedCountry.map(country => {
                      return (
                        <li key={country.code}>
                          <CountryButton
                            country={country}
                            setLocale={setLocale}
                            locale={locale}
                          />
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className={styles["no-data"]}>No Result</p>
                )}
              </div>
            ) : (
              alphabetArray.map(c => (
                <div key={c} className={styles.box}>
                  <p>{c}</p>
                  <ul>
                    {filteredCountries(c).map(country => (
                      <li key={country.code}>
                        <CountryButton
                          country={country}
                          setLocale={setLocale}
                          locale={locale}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const CountryButton = ({
  country,
  setLocale,
  locale,
}: {
  country: CountryObject;
  setLocale: Dispatch<SetStateAction<string | null>>;
  locale: string | null;
}) => {
  return (
    <button
      type="button"
      className={`${styles["country-button"]} ${
        locale === country.code ? styles.active : ""
      }`}
      onClick={() => setLocale(country.code)}
    >
      {country.name}
    </button>
  );
};
