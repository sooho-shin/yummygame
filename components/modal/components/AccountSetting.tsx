"use client";

import CommonButton from "@/components/common/Button";
import CommonInputBox from "@/components/common/InputBox";
import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import {
  useGetUserAccountSetting,
  usePostUserKyc1,
  usePostUserKyc2,
  usePostUserKyc3,
} from "@/querys/user";
import { useUserStore } from "@/stores/useUser";
import {
  UserAccountSettingKYC1Type,
  UserAccountSettingKYC2Type,
  UserAccountSettingKYC3Type,
} from "@/types/user";
import { validateNumberWithDecimal } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { useImmer } from "use-immer";
import styles from "./styles/accountSettingModal.module.scss";
import { allCountries } from "country-telephone-data";
import _ from "lodash";
export default function AccountSetting() {
  const { closeModal } = useModalHook();
  const t = useDictionary();

  // const countryData = useMemo(() => {
  //   return [
  //     { text: "Afghanistan", code: "AF" },
  //     { text: "Åland Islands", code: "AX" },
  //     { text: "Albania", code: "AL" },
  //     { text: "Algeria", code: "DZ" },
  //     { text: "Andorra", code: "AD" },
  //     { text: "Antarctica", code: "AQ" },
  //     { text: "Antigua and Barbuda", code: "AG" },
  //     { text: "Argentina", code: "AR" },
  //     { text: "Armenia", code: "AM" },
  //     { text: "Azerbaijan", code: "AZ" },
  //     { text: "Bangladesh", code: "BD" },
  //     { text: "Barbados", code: "BB" },
  //     { text: "Belgium", code: "BE" },
  //     { text: "Belize", code: "BZ" },
  //     { text: "Benin", code: "BJ" },
  //     { text: "Bolivia", code: "BO" },
  //     { text: "Bosnia and Herzegovina", code: "BA" },
  //     { text: "Bouvet Island", code: "BV" },
  //     { text: "Brazil", code: "BR" },
  //     { text: "British Indian Ocean Territory", code: "IO" },
  //     { text: "Bulgaria", code: "BG" },
  //     { text: "Burkina Faso", code: "BF" },
  //     { text: "Burundi", code: "BI" },
  //     { text: "Cambodia", code: "KH" },
  //     { text: "Cameroon", code: "CM" },
  //     { text: "Canada", code: "CA" },
  //     { text: "Cape Verde", code: "CV" },
  //     { text: "Central African Republic", code: "CF" },
  //     { text: "Chile", code: "CL" },
  //     { text: "China", code: "CN" },
  //     { text: "Christmas Island", code: "CX" },
  //     { text: "Cocos (Keeling) Islands", code: "CC" },
  //     { text: "Colombia", code: "CO" },
  //     { text: "Cook Islands", code: "CK" },
  //     { text: "Costa Rica", code: "CR" },
  //     { text: 'Cote d"Ivoire"', code: "CI" },
  //     { text: "Croatia", code: "HR" },
  //     { text: "Cuba", code: "CU" },
  //     { text: "Cyprus", code: "CY" },
  //     { text: "Czech Republic", code: "CZ" },
  //     { text: "Denmark", code: "DK" },
  //     { text: "Djibouti", code: "DJ" },
  //     { text: "Dominica", code: "DM" },
  //     { text: "Dominican Republic", code: "DO" },
  //     { text: "Ecuador", code: "EC" },
  //     { text: "Egypt", code: "EG" },
  //     { text: "El Salvador", code: "SV" },
  //     { text: "Equatorial Guinea", code: "GQ" },
  //     { text: "Eritrea", code: "ER" },
  //     { text: "Estonia", code: "EE" },
  //     { text: "Eswatini", code: "SZ" },
  //     { text: "Ethiopia", code: "ET" },
  //     { text: "Faroe Islands", code: "FO" },
  //     { text: "Fiji", code: "FJ" },
  //     { text: "Finland", code: "FI" },
  //     { text: "Gabon", code: "GA" },
  //     { text: "Georgia", code: "GE" },
  //     { text: "Ghana", code: "GH" },
  //     { text: "Greece", code: "GR" },
  //     { text: "Greenland", code: "GL" },
  //     { text: "Grenada", code: "GD" },
  //     { text: "Guatemala", code: "GT" },
  //     { text: "Guernsey", code: "GG" },
  //     { text: "Guinea", code: "GN" },
  //     { text: "Guinea-Bissau", code: "GW" },
  //     { text: "Guyana", code: "GY" },
  //     { text: "Haiti", code: "HT" },
  //     { text: "Heard Island and McDonald Islands", code: "HM" },
  //     { text: "Holy See (Vatican City)", code: "VA" },
  //     { text: "Honduras", code: "HN" },
  //     { text: "Hong Kong", code: "HK" },
  //     { text: "Iceland", code: "IS" },
  //     { text: "India", code: "IN" },
  //     { text: "Indonesia", code: "ID" },
  //     { text: "Ireland", code: "IE" },
  //     { text: "Isle of Man", code: "IM" },
  //     { text: "Israel", code: "IL" },
  //     { text: "Italy", code: "IT" },
  //     { text: "Jamaica", code: "JM" },
  //     { text: "Japan", code: "JP" },
  //     { text: "Jersey", code: "JE" },
  //     { text: "Kazakhstan", code: "KZ" },
  //     { text: "Kenya", code: "KE" },
  //     { text: "Kiribati", code: "KI" },
  //     { text: "Kyrgyzstan", code: "KG" },
  //     { text: "Laos", code: "LA" },
  //     { text: "Latvia", code: "LV" },
  //     { text: "Lesotho", code: "LS" },
  //     { text: "Liberia", code: "LR" },
  //     { text: "Libya", code: "LY" },
  //     { text: "Liechtenstein", code: "LI" },
  //     { text: "Lithuania", code: "LT" },
  //     { text: "Luxembourg", code: "LU" },
  //     { text: "Macau", code: "MO" },
  //     { text: "Madagascar", code: "MG" },
  //     { text: "Malawi", code: "MW" },
  //     { text: "Malaysia", code: "MY" },
  //     { text: "Maldives", code: "MV" },
  //     { text: "Mali", code: "ML" },
  //     { text: "Malta", code: "MT" },
  //     { text: "Martinique", code: "MQ" },
  //     { text: "Mauritania", code: "MR" },
  //     { text: "Mauritius", code: "MU" },
  //     { text: "Mexico", code: "MX" },
  //     { text: "Moldova", code: "MD" },
  //     { text: "Monaco", code: "MC" },
  //     { text: "Mongolia", code: "MN" },
  //     { text: "Montenegro", code: "ME" },
  //     { text: "Morocco", code: "MA" },
  //     { text: "Mozambique", code: "MZ" },
  //     { text: "Namibia", code: "NA" },
  //     { text: "Nauru", code: "NR" },
  //     { text: "Nepal", code: "NP" },
  //     { text: "New Zealand", code: "NZ" },
  //     { text: "Nicaragua", code: "NI" },
  //     { text: "Niger", code: "NE" },
  //     { text: "Nigeria", code: "NG" },
  //     { text: "Niue", code: "NU" },
  //     { text: "Norfolk Island", code: "NF" },
  //     { text: "North Macedonia", code: "MK" },
  //     { text: "Northern Mariana Islands", code: "MP" },
  //     { text: "Norway", code: "NO" },
  //     { text: "Palestinian Territory", code: "PS" },
  //     { text: "Panama", code: "PA" },
  //     { text: "Papua New Guinea", code: "PG" },
  //     { text: "Paraguay", code: "PY" },
  //     { text: "Peru", code: "PE" },
  //     { text: "Philippines", code: "PH" },
  //     { text: "Pitcairn Islands", code: "PN" },
  //     { text: "Poland", code: "PL" },
  //     { text: "Puerto Rico", code: "PR" },
  //     { text: "Republic of Kosovo", code: "XK" },
  //     { text: "Romania", code: "RO" },
  //     { text: "Rwanda", code: "RW" },
  //     { text: "Saint Kitts and Nevis", code: "KN" },
  //     { text: "Saint Lucia", code: "LC" },
  //     { text: "Saint Vincent and the Grenadines", code: "VC" },
  //     { text: "San Marino", code: "SM" },
  //     { text: "Sao Tome and Principe", code: "ST" },
  //     { text: "Senegal", code: "SN" },
  //     { text: "Serbia", code: "RS" },
  //     { text: "Seychelles", code: "SC" },
  //     { text: "Sierra Leone", code: "SL" },
  //     { text: "Singapore", code: "SG" },
  //     { text: "Slovakia", code: "SK" },
  //     { text: "Slovenia", code: "SI" },
  //     { text: "Solomon Islands", code: "SB" },
  //     { text: "Somalia", code: "SO" },
  //     { text: "South Africa", code: "ZA" },
  //     { text: "South Georgia and the South Sandwich Islands", code: "GS" },
  //     { text: "South Sudan", code: "SS" },
  //     { text: "Sri Lanka", code: "LK" },
  //     { text: "Sudan", code: "SD" },
  //     { text: "Suriname", code: "SR" },
  //     { text: "Svalbard", code: "SJ" },
  //     { text: "Sweden", code: "SE" },
  //     { text: "Switzerland", code: "CH" },
  //     { text: "Taiwan", code: "TW" },
  //     { text: "Tajikistan", code: "TJ" },
  //     { text: "Tanzania", code: "TZ" },
  //     { text: "Thailand", code: "TH" },
  //     { text: "The Bahamas", code: "BS" },
  //     { text: "The Gambia", code: "GM" },
  //     { text: "Timor-Leste", code: "TL" },
  //     { text: "Togo", code: "TG" },
  //     { text: "Tokelau", code: "TK" },
  //     { text: "Tonga", code: "TO" },
  //     { text: "Trinidad and Tobago", code: "TT" },
  //     { text: "Tunisia", code: "TN" },
  //     { text: "Turkmenistan", code: "TM" },
  //     { text: "Tuvalu", code: "TV" },
  //     { text: "Uganda", code: "UG" },
  //     { text: "Ukraine", code: "UA" },
  //     { text: "United States Minor Outlying Islands", code: "UM" },
  //     { text: "Uruguay", code: "UY" },
  //     { text: "Uzbekistan", code: "UZ" },
  //     { text: "Vanuatu", code: "VU" },
  //     { text: "Venezuela", code: "VE" },
  //     { text: "Vietnam", code: "VN" },
  //     { text: "Western Sahara", code: "EH" },
  //     { text: "Western Samoa", code: "WS" },
  //     { text: "Yemen", code: "YE" },
  //     { text: "Zambia", code: "ZM" },
  //     { text: "Zimbabwe", code: "ZW" },
  //   ];
  // }, []);

  function checkIfEnglish(inputString: string): string | false {
    // 정규 표현식을 사용하여 문자열이 영문으로만 이루어져 있는지 확인
    const isEnglish = /^[a-zA-Z\s]+$/.test(inputString);

    // 만약 영문으로만 이루어져 있다면 원래의 문자열을 반환, 아니면 false 반환
    return isEnglish ? inputString : false;
  }

  function checkIfEnglishOrNumber(inputString: string): string | false {
    // 영문 + 숫자( + 공백)으로만 이루어져 있는지 확인하는 정규 표현식
    // 공백을 허용하려면 다음 정규 표현식을 사용하세요: /^[a-zA-Z0-9\s]+$/
    const isEnglishOrNumber = /^[a-zA-Z0-9]+$/.test(inputString);

    // 조건에 맞으면 원본 문자열, 아니면 false 반환
    return isEnglishOrNumber ? inputString : false;
  }

  const genderArray = [
    { text: "Male" },
    { text: "Female" },
    { text: "Unspecified" },
  ];
  const { showToast } = useCommonHook();
  const { token } = useUserStore();
  const { data: accountData } = useGetUserAccountSetting(token);

  const [formDataKyc1, setFormDataKyc1] = useImmer<UserAccountSettingKYC1Type>({
    firstName: null,
    dateOfBirth: null,
    gender: null,
    lastName: null,
    occupation: null,
    proofOfIdentityBack: null,
    proofOfIdentityFront: null,
    // dialCode: null,
    // tel: null,
    phoneNumber: null,
    socialMediaId: null,
    socialMediaType: null,
  });

  const [country, setCountry] = useState<null | string>(null);
  const [socialMediaType, setSocialMediaType] = useState<string | null>(null);
  const [socialMediaId, setSocialMediaId] = useState<string | null>(null);

  const [tel, setTel] = useState<null | string>(null);

  const countries = useMemo(() => {
    return _.map(allCountries, country => ({ text: country.name }));
  }, [allCountries]);

  const socialMedias = [
    { text: "telegram" },
    { text: "x" },
    { text: "line" },
    { text: "wechat" },
    { text: "facebook" },
    { text: "whatsapp" },
    { text: "zalo" },
  ];

  const dialCode = useMemo(() => {
    const fc = allCountries.find(c => c.name === country);
    if (!fc) {
      return null;
    }
    // const c = allCountries.find(c => c.iso2 === fc.code.toLowerCase());

    return fc?.dialCode ?? null; // 해당 text가 없으면 null 반환
  }, [country, allCountries]);

  useEffect(() => {
    if (dialCode && tel) {
      setFormDataKyc1(draft => {
        draft.phoneNumber = `(+${dialCode})${tel}`;
      });
    }
  }, [dialCode, tel]);

  // useEffect(() => {
  //   console.log(country);
  //   console.log(countryCode);
  //   // countryCode && console.log(countryCode);
  // }, [countryCode, country]);

  const [formDataKyc2, setFormDataKyc2] = useState<UserAccountSettingKYC2Type>({
    proofOfAddress: null,
  });

  const [formDataKyc3, setFormDataKyc3] = useState<UserAccountSettingKYC3Type>({
    sourceOfFunds: null,
  });

  function hasNullValue(
    obj:
      | UserAccountSettingKYC1Type
      | UserAccountSettingKYC2Type
      | UserAccountSettingKYC3Type,
  ): boolean {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value =
          obj[
            key as keyof (
              | UserAccountSettingKYC1Type
              | UserAccountSettingKYC2Type
              | UserAccountSettingKYC3Type
            )
          ];
        if (value === null) {
          return false;
        }
      }
    }
    return true;
  }

  const formData = useMemo(() => {
    switch (accountData?.result.kyc_level) {
      case 0:
        return formDataKyc1;

      case 1:
        return formDataKyc2;

      case 2:
        return formDataKyc3;

      default:
        return formDataKyc1;
    }
  }, [accountData, formDataKyc1, formDataKyc2, formDataKyc3]);

  const { mutate: mutateKyc1, isLoading: isLoadingKyc1 } = usePostUserKyc1();
  const { mutate: mutateKyc2, isLoading: isLoadingKyc2 } = usePostUserKyc2();
  const { mutate: mutateKyc3, isLoading: isLoadingKyc3 } = usePostUserKyc3();
  const handleSubmit = () => {
    if (!hasNullValue(formData)) {
      showToast(t("modal_12"));
      return false;
    }

    const form = new FormData();

    Object.keys(formData).forEach(key => {
      const value =
        formData[
          key as keyof (UserAccountSettingKYC1Type | UserAccountSettingKYC2Type)
        ];

      // Check if value is not undefined before appending to FormData
      if (value !== null) {
        form.append(key, value);
      }
    });

    if (accountData?.result.kyc_level === 0) {
      mutateKyc1(form, {
        onSuccess: data => {
          if (data.code === 0) {
            closeModal();
            showToast(t("modal_513"));
          }
        },
      });
    }

    if (accountData?.result.kyc_level === 1) {
      mutateKyc2(form, {
        onSuccess: data => {
          if (data.code === 0) {
            closeModal();
            showToast(t("modal_513"));
          }
        },
      });
    }

    if (accountData?.result.kyc_level === 2) {
      mutateKyc3(form, {
        onSuccess: data => {
          if (data.code === 0) {
            closeModal();
            showToast(t("modal_513"));
          }
        },
      });
    }
  };

  return (
    <div className={styles["account-setting-modal"]}>
      <div className={styles.top}>
        <span>KYC / AML {accountData?.result.kyc_level}</span>
      </div>
      <div className={styles.content}>
        {accountData?.result.kyc_level === 0 && (
          <>
            <div className={styles.info}>
              <h5 className={styles.title}>{t("modal_13")}</h5>
              <pre>{t("modal_14")}</pre>
            </div>
            <div className={styles["whole-input-group"]}>
              <div className={styles["input-row"]}>
                <CommonInputBox
                  className={styles["input-box"]}
                  title={t("modal_15")}
                  value={formDataKyc1.firstName}
                  onChange={e => {
                    if (e.target.value.length > 49) {
                      return false;
                    }
                    if (!e.target.value) {
                      setFormDataKyc1(draft => {
                        draft.firstName = null;
                      });
                    } else {
                      checkIfEnglish(e.target.value) &&
                        setFormDataKyc1(draft => {
                          draft.firstName = e.target.value;
                        });
                    }
                  }}
                />
                <CommonInputBox
                  className={styles["input-box"]}
                  title={t("modal_16")}
                  value={formDataKyc1.lastName}
                  onChange={e => {
                    if (e.target.value.length > 49) {
                      return false;
                    }
                    if (!e.target.value) {
                      setFormDataKyc1(draft => {
                        draft.lastName = null;
                      });
                    } else {
                      checkIfEnglish(e.target.value) &&
                        setFormDataKyc1(draft => {
                          draft.lastName = e.target.value;
                        });
                    }
                  }}
                />
              </div>
              <div className={styles["input-row"]}>
                <CommonInputBox
                  title={t("modal_17")}
                  className={styles["input-box"]}
                  dropdownData={{
                    selectedValue: { text: formDataKyc1.gender },
                    setSelectedValue: (data: {
                      icoPath?: string;
                      text?: string | null;
                    }) =>
                      setFormDataKyc1(draft => {
                        draft.gender = data.text!.toLowerCase();
                      }),
                    dropDownArray: genderArray,
                  }}
                />
                <CommonInputBox
                  title={t("modal_18")}
                  className={styles["input-box"]}
                  value={formDataKyc1.dateOfBirth}
                  placeholder="YYYYMMDD"
                  onChange={e => {
                    if (!e.target.value) {
                      setFormDataKyc1(draft => {
                        draft.dateOfBirth = null;
                      });
                    } else {
                      validateNumberWithDecimal(e.target.value, {
                        maxInteger: 8,
                      }) &&
                        setFormDataKyc1(draft => {
                          draft.dateOfBirth = e.target.value;
                        });
                    }
                  }}
                />
              </div>
              {/*국가 전화번호 */}
              <div className={styles["input-row"]}>
                <CommonInputBox
                  title={t("modal_510")}
                  className={styles["input-box"]}
                  dropdownData={{
                    selectedValue: { text: country },
                    setSelectedValue: (data: {
                      icoPath?: string;
                      text?: string | null;
                      name?: string | null;
                      code?: string | null;
                    }) => setCountry(data.text ?? "korea"),
                    dropDownArray: countries,
                  }}
                />
                <CommonInputBox
                  title={t("modal_511")}
                  className={styles["input-box"]}
                  value={tel}
                  placeholder={t("modal_512")}
                  subText={dialCode ? `+${dialCode}` : null}
                  onChange={e => {
                    if (!e.target.value) {
                      // setFormDataKyc1(draft => {
                      //   draft.tel = null;
                      // });
                      setTel(null);
                    } else {
                      const onlyNumbersRegex = /^[0-9]+$/;
                      if (
                        onlyNumbersRegex.test(e.target.value) &&
                        validateNumberWithDecimal(e.target.value, {
                          maxInteger: 13,
                        })
                      ) {
                        setTel(e.target.value);
                      }
                    }
                  }}
                />
              </div>
              {/*소셜 미디어 */}
              <div className={styles["input-row"]}>
                <CommonInputBox
                  title={t("modal_553")}
                  className={styles["input-box"]}
                  dropdownData={{
                    selectedValue: { text: formDataKyc1.socialMediaType },
                    setSelectedValue: (data: {
                      icoPath?: string;
                      text?: string | null;
                      name?: string | null;
                      code?: string | null;
                    }) =>
                      setFormDataKyc1(draft => {
                        draft.socialMediaType = data.text!.toLowerCase();
                      }),
                    dropDownArray: socialMedias,
                  }}
                  value={formDataKyc1.socialMediaId}
                  onChange={e => {
                    if (e.target.value.length > 30) {
                      return false;
                    }
                    if (!e.target.value) {
                      setFormDataKyc1(draft => {
                        draft.socialMediaId = null;
                      });
                    } else {
                      checkIfEnglishOrNumber(e.target.value) &&
                        setFormDataKyc1(draft => {
                          draft.socialMediaId = e.target.value;
                        });
                    }
                  }}
                  placeholder={t("modal_554")}
                  selectWithInput={true}
                />
              </div>
              <div className={styles["input-row"]}>
                <CommonInputBox
                  title={t("modal_19")}
                  value={formDataKyc1.occupation}
                  onChange={e => {
                    if (e.target.value.length > 49) {
                      return false;
                    }
                    if (!e.target.value) {
                      setFormDataKyc1(draft => {
                        draft.occupation = null;
                      });
                    } else {
                      checkIfEnglish(e.target.value) &&
                        setFormDataKyc1(draft => {
                          draft.occupation = e.target.value;
                        });
                    }
                  }}
                />
              </div>

              <div className={styles["input-row"]}>
                <CommonInputBox
                  title={t("modal_20")}
                  sub={t("modal_21")}
                  fileData={{
                    selectedFile: formDataKyc1.proofOfIdentityFront,
                    setSelectedFile: data =>
                      setFormDataKyc1(draft => {
                        draft.proofOfIdentityFront = data;
                      }),
                    labelString: "identityFront",
                  }}
                />
              </div>
              <div className={styles["input-row"]}>
                <CommonInputBox
                  title={t("modal_22")}
                  sub={t("modal_23")}
                  fileData={{
                    selectedFile: formDataKyc1.proofOfIdentityBack,
                    setSelectedFile: data =>
                      setFormDataKyc1(draft => {
                        draft.proofOfIdentityBack = data;
                      }),
                    labelString: t("modal_24"),
                  }}
                />
              </div>
            </div>
            <p className={styles["bottom-text"]}>{t("modal_25")}</p>
          </>
        )}
        {accountData?.result.kyc_level === 1 && (
          <>
            <div className={styles.info}>
              <h5 className={styles.title}>{t("modal_26")}</h5>
              <pre>{t("modal_27")}</pre>
            </div>
            <div className={styles["whole-input-group"]}>
              <div className={styles["input-row"]}>
                <CommonInputBox
                  title={t("modal_28")}
                  sub={t("modal_29")}
                  fileData={{
                    selectedFile: formDataKyc2.proofOfAddress,
                    setSelectedFile: data =>
                      setFormDataKyc2({ proofOfAddress: data }),
                    labelString: t("modal_30"),
                  }}
                />
              </div>
            </div>
            <p className={styles["bottom-text"]}>{t("modal_31")}</p>
          </>
        )}

        {accountData?.result.kyc_level === 2 && (
          <>
            <div className={styles.info}>
              <h5 className={styles.title}>{t("modal_32")}</h5>
              <pre>{t("modal_33")}</pre>
            </div>
            <div className={styles["whole-input-group"]}>
              <div className={styles["input-row"]}>
                <CommonInputBox
                  title={t("modal_34")}
                  sub={t("modal_35")}
                  fileData={{
                    selectedFile: formDataKyc3.sourceOfFunds,
                    setSelectedFile: data =>
                      setFormDataKyc3({ sourceOfFunds: data }),
                    labelString: t("modal_36"),
                  }}
                />
              </div>
            </div>
            <p className={styles["bottom-text"]}>{t("modal_37")}</p>
          </>
        )}
      </div>
      <CommonButton
        className={styles["submit-btn"]}
        disabled={
          !hasNullValue(formData) ||
          accountData?.result.kyc_level === 3 ||
          (accountData?.result.kyc_level === 0 && !dialCode)
        }
        onClick={() => {
          handleSubmit();
        }}
        text={"Submit"}
        isPending={isLoadingKyc1 || isLoadingKyc2 || isLoadingKyc3}
      />
    </div>
  );
}
