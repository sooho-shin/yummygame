"use client";

import CommonButton from "@/components/common/Button";
import CommonInputBox from "@/components/common/InputBox";
import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { usePostPartner } from "@/querys/partner";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import styles from "./styles/partnerModal.module.scss";

interface CountryObject {
  name: string;
  code: string;
}

export default function Partner() {
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

  const { closeModal } = useModalHook();
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
  const { showToast } = useCommonHook();
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<null | string>(null);
  const [partnerEmail, setPartnerEmail] = useState<string | null>(null);
  const [snsType, setSnsType] = useState<string | null>(null);
  const [snsAccount, setSnsAccount] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);

  const [countryContainerState, setCountryContainerState] = useState(false);
  const [searchCountry, setSearchCountry] = useState<string | null>(null);
  const [searchState, setSearchState] = useState(false);
  const [searchedCountry, setSearchedCountry] = useState<[] | CountryObject[]>(
    [],
  );
  const { mutate: postPartner, isLoading } = usePostPartner();
  const t = useDictionary();

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

  function validateLength(str: string): boolean | string {
    // const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // if (!emailRegex.test(email)) {
    //   return '올바르지 않은 이메일 형식입니다.';
    // }

    if (str.length > 50) {
      return false;
    }

    return str;
  }

  function validateEmail(str: string): boolean | string {
    const emailRegex: RegExp =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(str)) {
      return false;
    }

    return str;
  }

  const submitPartner = () => {
    if (
      !partnerName ||
      !countryCode ||
      !partnerEmail ||
      !snsType ||
      !snsAccount ||
      !companyName
    ) {
      return false;
    }

    if (!validateLength(partnerName)) {
      showToast(t("modal_172"));
      return false;
    }

    if (!validateLength(companyName)) {
      showToast(t("modal_173"));
      return false;
    }

    if (!validateEmail(partnerEmail)) {
      showToast(t("modal_174"));
      return false;
    }

    postPartner(
      {
        partnerName,
        countryCode,
        companyName,
        partnerEmail,
        snsAccount,
        snsType: snsType.toLowerCase() as "telegram" | "skype",
      },
      {
        onSuccess(data, variables, context) {
          if (data.code === 0) {
            closeModal();
            showToast(<pre>{t("modal_175")}</pre>);
          }
        },
      },
    );
  };

  return (
    <div className={styles["partner-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_176")}</span>
      </div>
      <div className={styles.content}>
        {/* <div className={styles["banner-container"]}>
          <p>이벤트 베너 들어감</p>
        </div> */}
        <div className={styles["text-group"]}>
          <p>{t("modal_177")}</p>
          <p>{t("modal_178")}</p>
        </div>
        <div className={styles["input-wrapper"]}>
          <CommonInputBox
            title={t("modal_179")}
            placeholder={t("modal_187")}
            value={partnerName}
            onChange={e => {
              if (!e.target.value) {
                setPartnerName(null);
              } else {
                setPartnerName(e.target.value);
              }
            }}
          />
          <CommonInputBox
            title={t("modal_180")}
            countrySelectData={{
              onCLick: () => {
                setCountryContainerState(true);
              },
              placeholder: t("modal_181"),
              selectedCountry: countryCode,
            }}
          />
          <CommonInputBox
            title={t("modal_182")}
            placeholder="e.g. example@yummygame.io"
            value={partnerEmail}
            onChange={e => {
              if (!e.target.value) {
                setPartnerEmail(null);
              } else {
                setPartnerEmail(e.target.value);
              }
            }}
          />
          <CommonInputBox
            title="Telegram / Skype"
            placeholder={t("modal_183")}
            value={snsAccount}
            onChange={e => {
              if (!e.target.value) {
                setSnsAccount(null);
              } else {
                setSnsAccount(e.target.value);
              }
            }}
            dropdownData={{
              dropDownArray: [{ text: "Telegram" }, { text: "Skype" }],
              selectedValue: { text: snsType },
              setSelectedValue: (data: {
                icoPath?: string;
                text?: string | null;
              }) => {
                setSnsType(data.text ?? "");
              },
            }}
            selectWithInput={true}
          />
          <CommonInputBox
            title={t("modal_184")}
            placeholder={t("modal_185")}
            value={companyName}
            onChange={e => {
              if (!e.target.value) {
                setCompanyName(null);
              } else {
                setCompanyName(e.target.value);
              }
            }}
          />
        </div>
      </div>
      <CommonButton
        className={styles["submit-btn"]}
        disabled={
          !partnerName ||
          !countryCode ||
          !partnerEmail ||
          !snsType ||
          !snsAccount ||
          !companyName
        }
        onClick={() => submitPartner()}
        text={t("modal_186")}
        isPending={isLoading}
      />

      {/* country Area */}

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
          <h5>{t("modal_188")}</h5>
        </div>
        <div className={styles["search-area"]}>
          <CommonInputBox
            placeholder={t("modal_189")}
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
        </div>
        <div className={styles["country-box"]}>
          <div className={styles["scroll-box"]}>
            {searchState ? (
              <div className={styles.box}>
                {searchedCountry.length > 0 ? (
                  <ul>
                    {searchedCountry.map(country => {
                      return (
                        <li key={country.code}>
                          <CountryButton
                            country={country}
                            setLocale={setCountryCode}
                            locale={countryCode}
                            setCountryContainerState={setCountryContainerState}
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
                          setLocale={setCountryCode}
                          locale={countryCode}
                          setCountryContainerState={setCountryContainerState}
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
  setCountryContainerState,
}: {
  country: CountryObject;
  setLocale: Dispatch<SetStateAction<string | null>>;
  locale: string | null;
  setCountryContainerState: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <button
      type="button"
      className={`${styles["country-button"]} ${
        locale === country.code ? styles.active : ""
      }`}
      onClick={() => {
        setLocale(country.code);
        setCountryContainerState(false);
      }}
    >
      {country.name}
    </button>
  );
};
