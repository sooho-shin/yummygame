"use client";
import styles from "./styles/nav.module.scss";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import ToggleBtn from "../common/ToggleBtn";

export default function ThemeButton() {
  const [cookies, setCookie] = useCookies();
  const [theme, setTheme] = useState<"dark" | "light" | null>(null);

  // Function to toggle the theme between dark and light
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    setCookie("theme", theme === "dark" ? "light" : "dark");
  };

  // Function to set the data-theme attribute on the body element
  const setBodyTheme = () => {
    document.body.setAttribute(
      "data-theme",
      theme === "dark" ? "light" : "dark",
    );
  };

  useEffect(() => {
    if (cookies.theme === "light") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, []);

  if (!theme) return <></>;
  return (
    <div className={styles["appearance-box"]}>
      <span className={styles.ico}></span>
      <span className={styles.text}>Appearance</span>

      <ToggleBtn
        active={theme === "light"}
        theme={true}
        callback={() => {
          toggleTheme();
          setBodyTheme();
        }}
      />

      {/* {theme === "dark" ? "Light모드로 전환" : "Dark모드로 전환"} */}
    </div>
  );
}
