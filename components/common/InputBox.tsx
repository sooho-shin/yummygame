"use client";

import {
  ChangeEvent,
  MutableRefObject,
  ReactNode,
  RefObject,
  useRef,
  useState,
} from "react";
import styles from "./styles/inputBox.module.scss";
import Image from "next/image";
import { useClickAway } from "react-use";
import useCommonHook from "@/hooks/useCommonHook";
import { useDictionary } from "@/context/DictionaryContext";
import classNames from "classnames";
import { motion } from "framer-motion";

export default function CommonInputBox({
  value,
  title,
  placeholder,
  onChange,
  dropdownData,
  sub,
  fileData,
  readonly,
  ico,
  required = true,
  className,
  countrySelectData,
  selectWithInput,
  small,
  align = "left",
  errorData,
  isLoading,
  onKeyDownCallback,
  subText,
  deleteValueFn,
  password,
  inputRef,
}: {
  isLoading?: boolean;
  value?: string | null;
  title?: string;
  placeholder?: string;
  readonly?: boolean;
  subText?: string | null;
  required?: boolean;
  align?: "left" | "right";
  selectWithInput?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  dropdownData?: {
    selectedValue: {
      icoPath?: string;
      text: string | null;
      name?: string | null;
      code?: string | null;
    } | null;
    setSelectedValue: (data: {
      icoPath?: string;
      text: string | null;
      name?: string | null;
      code?: string | null;
    }) => void;
    dropDownArray: {
      icoPath?: string;
      text: string | null;
      name?: string | null;
      code?: string | null;
    }[];
    placeholder?: string;
  };
  countrySelectData?: {
    onCLick: () => void;
    placeholder: string;
    selectedCountry: string | null;
  };
  className?: string;
  sub?: string;
  fileData?: {
    selectedFile: File | null;
    setSelectedFile: (string: File | null) => void;
    labelString: string;
  };
  ico?: ReactNode;
  small?: boolean; // true 면 height 40px;
  errorData?: {
    align?: "left" | "right";
    text: string | null;
    listTitle?: string | null;
    list?: { check: boolean; text: string }[] | null;
  };
  onKeyDownCallback?: () => void;
  deleteValueFn?: () => void;
  password?: boolean;
  inputRef?: RefObject<HTMLInputElement>;
}) {
  const [dropdownState, setDropdownState] = useState(false);
  const [active, setActive] = useState(false);
  const dropboxRef = useRef<HTMLDivElement>(null);
  const fileboxRef = useRef<HTMLDivElement>(null);
  const { showToast } = useCommonHook();
  const t = useDictionary();
  const [showValue, setShowValue] = useState(true);

  useClickAway(dropboxRef, () => {
    setDropdownState(false);
  });

  // 업로드 한 파일의 유효성 체크 zz
  const checkFileExtension = (file: { name: string; size: number }) => {
    const regex = new RegExp("(.*?).(jpg|jpeg|png)$"); // 확장자 제한: 이미지 파일만 허용
    const maxSize = 5242880; //용량제한: 5MB 이하

    if (!regex.test(file.name)) {
      showToast(t("modal_298"));
      return false;
    }

    if (file.size >= maxSize) {
      showToast(t("modal_299"));
      return false;
    }

    return true;
  };

  const [activeFileState, setActiveFileState] = useState(false);

  useClickAway(fileboxRef, () => {
    setActiveFileState(false);
  });

  return (
    <div
      className={`${styles["input-box"]} ${className ? className : ""} ${
        small ? styles.small : ""
      }`}
      ref={dropboxRef}
    >
      {title && (
        <p
          className={`${styles.title} ${
            required ? "" : styles["not-important"]
          } ${active || dropdownState ? styles.active : ""}`}
        >
          {title}
        </p>
      )}

      {selectWithInput ? (
        <div className={styles["input-division"]}>
          <div
            className={`${styles["input-area"]} ${
              dropdownState ? styles.active : ""
            }`}
            style={{
              paddingLeft:
                dropdownData &&
                dropdownData.selectedValue &&
                dropdownData.selectedValue.icoPath
                  ? "8px"
                  : "12px",
            }}
          >
            {dropdownData && (
              <button
                type="button"
                onClick={() => setDropdownState(!dropdownState)}
                className={styles["select-btn"]}
              >
                {dropdownData.selectedValue &&
                  dropdownData.selectedValue.icoPath && (
                    <span
                      style={{
                        backgroundImage: `url(${dropdownData.selectedValue.icoPath})`,
                      }}
                      className={styles.ico}
                    ></span>
                  )}
                <span
                  className={`${styles.text} ${
                    dropdownData.selectedValue &&
                    dropdownData.selectedValue.text &&
                    !dropdownData.selectedValue.icoPath
                      ? styles.active
                      : ""
                  }`}
                >
                  {dropdownData.selectedValue && dropdownData.selectedValue.text
                    ? dropdownData.selectedValue.text
                    : dropdownData.placeholder
                      ? dropdownData.placeholder
                      : "Select"}
                </span>

                <Image
                  src="/images/common/ico_arrow_g.svg"
                  alt="img arrow"
                  width="24"
                  height="24"
                  priority
                  style={{
                    transform: `rotate(${dropdownState ? "180" : "0"}deg)`,
                  }}
                />
              </button>
            )}
            {dropdownData && dropdownState && (
              <div className={styles["dropdown-box"]}>
                {dropdownData.dropDownArray.map(c => {
                  return (
                    <button
                      type="button"
                      key={c.text}
                      className={
                        dropdownData.selectedValue &&
                        dropdownData.selectedValue.text === c.text
                          ? styles.active
                          : ""
                      }
                      onClick={() => {
                        dropdownData.setSelectedValue(c);
                        setDropdownState(false);
                      }}
                    >
                      {c.icoPath && (
                        <span
                          style={{ backgroundImage: `url(${c.icoPath})` }}
                          className={styles.ico}
                        ></span>
                      )}
                      <span className={styles.text}>{c.text}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div
            className={`${styles["input-area"]} ${
              active ? styles.active : ""
            } ${
              (errorData && errorData.text) ||
              (errorData &&
                errorData.list &&
                errorData.list.some(item => !item.check))
                ? styles.error
                : ""
            }`}
          >
            <>
              {isLoading ? (
                <div
                  className={styles.skeleton}
                  style={{
                    justifyContent:
                      align === "right" ? "flex-end" : "flex-start",
                  }}
                >
                  <div></div>
                </div>
              ) : (
                <>
                  {ico && ico}
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={value ?? ""}
                    onChange={e => onChange && onChange(e)}
                    readOnly={readonly}
                    onFocus={() => {
                      !readonly && setActive(true);
                      setDropdownState(false);
                    }}
                    onBlur={() => {
                      setActive(false);
                    }}
                    style={{ textAlign: align }}
                  />
                </>
              )}
            </>
          </div>
        </div>
      ) : (
        <div
          className={`${styles["input-area"]} ${
            active || dropdownState ? styles.active : ""
          }  ${
            (errorData && errorData.text) ||
            (errorData &&
              errorData.list &&
              errorData.list.some(item => !item.check))
              ? styles.error
              : ""
          }`}
        >
          {countrySelectData && (
            <button
              type="button"
              onClick={countrySelectData.onCLick}
              className={styles["select-btn"]}
            >
              <span
                className={`${styles.text} ${
                  countrySelectData.selectedCountry ? styles.active : ""
                }`}
              >
                {countrySelectData.selectedCountry ??
                  countrySelectData.placeholder}
              </span>
              <Image
                src="/images/common/ico_arrow_g.svg"
                alt="img arrow"
                width="24"
                height="24"
                priority
                style={{ transform: `rotate(-90deg)` }}
              />
            </button>
          )}
          {!dropdownData && !fileData && (
            <>
              {subText && <span className={styles["sub-text"]}>{subText}</span>}
              {ico && ico}
              <input
                ref={inputRef ?? null}
                type={password && showValue ? "password" : "text"}
                placeholder={placeholder}
                value={value ? value : ""}
                onChange={e => onChange && onChange(e)}
                readOnly={readonly}
                onFocus={() => {
                  !readonly && setActive(true);
                }}
                onBlur={() => {
                  setActive(false);
                }}
                style={{ textAlign: align }}
                onKeyDown={e => {
                  if (e.key === "Enter" && onKeyDownCallback) {
                    onKeyDownCallback();
                  }
                }}
              />
              {deleteValueFn && value && (
                <button
                  type={"button"}
                  className={styles["delete-btn"]}
                  onClick={() => deleteValueFn()}
                ></button>
              )}
              {password && (
                <button
                  type={"button"}
                  className={classNames(styles["password-btn"], {
                    [styles.show]: !showValue,
                    [styles.hide]: showValue,
                  })}
                  onClick={() => setShowValue(!showValue)}
                ></button>
              )}
            </>
          )}
          {dropdownData && (
            <button
              type="button"
              onClick={() => setDropdownState(!dropdownState)}
              className={styles["select-btn"]}
            >
              {dropdownData.selectedValue &&
                dropdownData.selectedValue.icoPath && (
                  <span
                    style={{
                      backgroundImage: `url(${dropdownData.selectedValue.icoPath})`,
                    }}
                    className={styles.ico}
                  ></span>
                )}
              <span
                className={`${styles.text} ${
                  dropdownData.selectedValue && dropdownData.selectedValue.text
                    ? styles.active
                    : ""
                }`}
              >
                {dropdownData.selectedValue && dropdownData.selectedValue.text
                  ? dropdownData.selectedValue.text
                  : dropdownData.placeholder
                    ? dropdownData.placeholder
                    : "Select"}
              </span>
              <Image
                src="/images/common/ico_arrow_g.svg"
                alt="img arrow"
                width="24"
                height="24"
                priority
                style={{
                  transform: `rotate(${dropdownState ? "180" : "0"}deg)`,
                }}
              />
            </button>
          )}
          {/* {referralCode && (
            <button type="button" className={styles["delete-btn"]}></button>
          )} */}

          {fileData && (
            <div
              className={`${styles["file-input-group"]} ${
                activeFileState ? styles.active : ""
              }`}
              ref={fileboxRef}
            >
              {fileData.selectedFile ? (
                <>
                  <div>
                    <span className={styles.image}></span>
                    <span className={styles.name}>
                      {fileData.selectedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => fileData.setSelectedFile(null)}
                    ></button>
                  </div>
                </>
              ) : (
                <>
                  <label htmlFor={fileData.labelString}>
                    <span>{t("common_37")}</span>
                    <span className={styles.plus}></span>
                  </label>
                  <input
                    type="file"
                    id={fileData.labelString}
                    onChange={e => {
                      const files = e.target.files as FileList;

                      // const reader = new FileReader();
                      const fileExtension = {
                        name: files[0]?.name,
                        size: files[0]?.size,
                      };

                      if (checkFileExtension(fileExtension)) {
                        // reader.readAsDataURL(files[0]);
                        fileData.setSelectedFile(files[0]);
                        setActiveFileState(true);
                      }
                    }}
                  />
                </>
              )}
            </div>
          )}
          {dropdownData && dropdownState && (
            <div className={styles["dropdown-box"]}>
              {dropdownData.dropDownArray.map(c => {
                return (
                  <button
                    type="button"
                    key={c.text}
                    onClick={() => {
                      dropdownData.setSelectedValue(c);
                      setDropdownState(false);
                    }}
                  >
                    {c.icoPath && <span></span>}
                    <span className={styles.text}>{c.text}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
      {errorData && errorData.text && (
        <div
          className={classNames(styles["error-box"], {
            [styles.left]: errorData.align === "left",
          })}
        >
          {errorData.text}
        </div>
      )}
      {errorData && errorData.list && (
        <motion.div
          className={styles["error-list-box"]}
          initial={{ opacity: 0, zIndex: -1 }}
          animate={{
            // opacity: active && errorData.list.some(item => !item.check) ? 1 : 0,
            opacity: active && errorData.list.some(item => !item.check) ? 1 : 0,
            zIndex: active && errorData.list.some(item => !item.check) ? 1 : -1,
            transition: {
              ease: "easeOut",
              duration: 0.15,
              delay: 0.15,
            },
            // marginTop: dropDownState ? 16 : 0,
          }}
        >
          <div className={styles.content}>
            <p>{errorData.listTitle ?? ""}</p>
            {errorData.list.map(c => {
              return (
                <div
                  key={c.text}
                  className={classNames(styles["check-row"], {
                    [styles.checked]: c.check,
                  })}
                >
                  <p>{c.text}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
      {sub && <p className={styles.sub}>{sub}</p>}
      {/* <p className={styles.error}>Enter a valid code.</p> */}
    </div>
  );
}
