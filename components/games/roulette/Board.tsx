"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/board.module.scss";
import { amountFormatter, setOrdinalNumber } from "@/utils";
import { ArrayObject, RouletteBetType } from "@/types/games/roulette";
import { useRouletteStore } from "@/stores/useRoulette";
import useCommonHook from "@/hooks/useCommonHook";

const Board = () => {
  const btnRefArray = useRef<(HTMLDivElement | HTMLButtonElement)[]>([]);

  // 유럽식 룰렛에서 숫자에 해당하는 색을 반환하는 함수
  function getColor(number: number) {
    // 숫자가 1에서 10 사이인 경우
    if (number >= 1 && number <= 10) {
      // 홀수는 red, 짝수는 black
      return number % 2 === 1 ? "red" : "black";
    }

    // 숫자가 11에서 18 사이인 경우
    if (number >= 11 && number <= 18) {
      // 홀수는 black, 짝수는 red
      return number % 2 === 1 ? "black" : "red";
    }

    // 숫자가 19에서 28 사이인 경우
    if (number >= 19 && number <= 28) {
      // 홀수는 red, 짝수는 black
      return number % 2 === 1 ? "red" : "black";
    }

    // 숫자가 29에서 36 사이인 경우
    if (number >= 29 && number <= 36) {
      // 홀수는 black, 짝수는 red
      return number % 2 === 1 ? "black" : "red";
    }

    // 그 외의 숫자는 없음 (0과 00은 고려하지 않음)

    return "black";
  }

  const handleStepButtonEnterLeave = (
    start: number,
    end: number,
    shouldAddClass: boolean,
  ): void => {
    for (let index = start; index <= end; index++) {
      const btnRef = btnRefArray.current[index];
      if (shouldAddClass) {
        btnRef.classList.add(styles.active);
      } else {
        btnRef.classList.remove(styles.active);
      }
    }
  };

  const bottomBtnArray = [
    {
      text: "1 to 18",
      onMouseEnter: () => handleStepButtonEnterLeave(1, 18, true),
      onMouseLeave: () => handleStepButtonEnterLeave(1, 18, false),
      type: "low",
    },
    {
      text: "Even",
      type: "even",
      onMouseEnter: () => {
        btnRefArray.current.forEach((divRef, index) => {
          if (index !== 0 && index % 2 === 0) {
            divRef.classList.add(styles.active);
          }
        });
      },
      onMouseLeave: () => {
        btnRefArray.current.forEach((divRef, index) => {
          if (index !== 0 && index % 2 === 0) {
            // 원하는 클래스를 추가합니다. (예: 'even-div')
            divRef.classList.remove(styles.active);
          }
        });
      },
    },
    {
      text: "",
      type: "red",
      onMouseEnter: () => {
        btnRefArray.current.forEach((divRef, index) => {
          if (index >= 1 && divRef.classList.contains(styles.red)) {
            btnRefArray.current[index].classList.add(styles.active);
          }
        });
      },
      onMouseLeave: () => {
        btnRefArray.current.forEach((divRef, index) => {
          btnRefArray.current[index].classList.remove(styles.active);
        });
      },
    },
    {
      text: "",
      type: "black",
      onMouseEnter: () => {
        btnRefArray.current.forEach((divRef, index) => {
          if (index >= 1 && !divRef.classList.contains(styles.red)) {
            btnRefArray.current[index].classList.add(styles.active);
          }
        });
      },
      onMouseLeave: () => {
        btnRefArray.current.forEach((divRef, index) => {
          btnRefArray.current[index].classList.remove(styles.active);
        });
      },
    },
    {
      text: "Odd",
      type: "odd",
      onMouseEnter: () => {
        btnRefArray.current.forEach((divRef, index) => {
          if (index !== 0 && index % 2 !== 0) {
            // 원하는 클래스를 추가합니다. (예: 'even-div')
            divRef.classList.add(styles.active);
          }
        });
      },
      onMouseLeave: () => {
        btnRefArray.current.forEach((divRef, index) => {
          if (index !== 0 && index % 2 !== 0) {
            // 원하는 클래스를 추가합니다. (예: 'even-div')
            divRef.classList.remove(styles.active);
          }
        });
      },
    },
    {
      text: "19 to 36",
      type: "high",
      onMouseEnter: () => handleStepButtonEnterLeave(19, 36, true),
      onMouseLeave: () => handleStepButtonEnterLeave(19, 36, false),
    },
  ];

  return (
    <>
      <div className={styles["betting-table"]}>
        <div
          className={styles["zero-btn"]}
          ref={el => el && (btnRefArray.current[0] = el)}
        >
          <Button
            type="straight"
            selectList={[0]}
            onMouseEnter={() =>
              btnRefArray.current[0].classList.add(styles.active)
            }
            onMouseLeave={() =>
              btnRefArray.current[0].classList.remove(styles.active)
            }
            text="0"
          />
        </div>
        <div className={styles["number-group"]}>
          {Array.from({ length: 36 }).map((_, i) => {
            return (
              <RouletteButton
                key={`index ${i}`}
                index={i + 1}
                color={styles[getColor(i + 1)]}
                refArray={btnRefArray}
              />
            );
          })}
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <StepBtn
            key={i}
            index={i}
            handleStepButtonEnterLeave={handleStepButtonEnterLeave}
          />
        ))}
        {bottomBtnArray.map((c, i) => (
          <BottomBtn
            index={i}
            onMouseEnter={c.onMouseEnter}
            onMouseLeave={c.onMouseLeave}
            text={c.text}
            key={i}
            type={c.type as RouletteBetType}
          />
        ))}
        {Array.from({ length: 3 }).map((_, i) => (
          <TwoTimesBtn key={i} index={i} refArray={btnRefArray} />
        ))}
      </div>
    </>
  );
};

const TwoTimesBtn = ({
  index,
  refArray,
}: {
  index: number;
  refArray: React.MutableRefObject<(HTMLDivElement | HTMLButtonElement)[]>;
}) => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const remain = (3 - index) % 3;
  const { checkMedia } = useCommonHook();
  if (!hydrated) return <></>;
  return (
    <div
      className={styles["two-times-btn"]}
      style={
        checkMedia === "mobile"
          ? { gridArea: `14 / ${index + 3} / span 1 / auto` }
          : { gridArea: `${index + 1} / 14 / auto / span 1` }
      }
    >
      <Button
        type={`column${index + 1}` as "column1" | "column2" | "column3"}
        onMouseEnter={() => {
          refArray.current.forEach((ref, i) => {
            if (i > 0 && i % 3 === remain) {
              ref.classList.add(styles.active);
            }
          });
        }}
        onMouseLeave={() => {
          refArray.current.forEach(ref => {
            ref.classList.remove(styles.active);
          });
        }}
        text={"2:1"}
      />
    </div>
  );
};

const BottomBtn = ({
  index,
  text,
  onMouseEnter,
  onMouseLeave,
  type,
}: {
  index: number;
  text: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  type: RouletteBetType;
}) => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { checkMedia } = useCommonHook();
  if (!hydrated) return <></>;
  return (
    <div
      className={styles["bottom-btn"]}
      // style={{ gridArea: `5 / ${2 + index * 2} / auto / span 2` }}
      style={
        checkMedia === "mobile"
          ? { gridArea: `${1 + index * 2} / 1 / span 2 / auto` }
          : { gridArea: `5 / ${2 + index * 2} / auto / span 2` }
      }
    >
      <Button
        type={type}
        className={`${index === 2 ? styles.red : ""} ${
          index === 3 ? styles.gray : ""
        }`}
        onMouseEnter={() => {
          onMouseEnter();
        }}
        onMouseLeave={() => {
          onMouseLeave();
        }}
        text={text}
      />
    </div>
  );
};

const StepBtn = ({
  index,
  handleStepButtonEnterLeave,
}: {
  index: number;
  handleStepButtonEnterLeave: (
    start: number,
    end: number,
    shouldAddClass: boolean,
  ) => void;
}) => {
  return (
    <div
      className={`${
        index === 0
          ? styles["first-12"]
          : index === 1
            ? styles["second-12"]
            : styles["third-12"]
      } ${styles["step-btn"]}`}
    >
      <Button
        type={index === 0 ? "dozen1" : index === 1 ? "dozen2" : "dozen3"}
        onMouseEnter={() => {
          handleStepButtonEnterLeave(1 + index * 12, (index + 1) * 12, true);
        }}
        onMouseLeave={() => {
          handleStepButtonEnterLeave(1 + index * 12, (index + 1) * 12, false);
        }}
        text={`${setOrdinalNumber(index + 1)} 12`}
      />
    </div>
  );
};

const RouletteButton = ({
  index,
  color,
  refArray,
}: {
  index: number;
  color: string;

  refArray: React.MutableRefObject<(HTMLDivElement | HTMLButtonElement)[]>;
}) => {
  type LineTimesType = "firstLine" | "secondLine" | "thirdLine";
  const getLineTimes: (remain: number) => LineTimesType = (remain: number) => {
    let lineTimes: LineTimesType = "firstLine";
    switch (remain) {
      case 0: {
        lineTimes = "firstLine";
        break;
      }
      case 2: {
        lineTimes = "secondLine";
        break;
      }
      case 1: {
        lineTimes = "thirdLine";
        break;
      }

      default:
        lineTimes = "firstLine";
        break;
    }

    return lineTimes;
  };

  const lineTimes: LineTimesType = getLineTimes(index % 3);

  const hoverBtn = ({
    action,
    side,
  }: {
    action: "enter" | "leave";
    side: "top" | "right" | "center" | "corner" | "left" | "leftCorner";
  }) => {
    const activateElements = (indexes: number[]) => {
      indexes.forEach(targetIndex => {
        refArray.current[targetIndex].classList.add(styles.active);
      });
    };

    const deactivateElements = (indexes: number[]) => {
      indexes.forEach(targetIndex => {
        refArray.current[targetIndex].classList.remove(styles.active);
      });
    };

    if (side === "top") {
      if (action === "enter") {
        const targetIndexes =
          lineTimes === "firstLine"
            ? [index, index - 1, index - 2]
            : [index, index + 1];
        activateElements(targetIndexes);
      } else {
        const targetIndexes =
          lineTimes === "firstLine"
            ? [index, index - 1, index - 2]
            : [index, index + 1];
        deactivateElements(targetIndexes);
      }
    }

    if (side === "right") {
      if (action === "enter") {
        const targetIndexes = [index, index + 3];
        activateElements(targetIndexes);
      } else {
        const targetIndexes = [index, index + 3];
        deactivateElements(targetIndexes);
      }
    }

    if (side === "corner") {
      if (action === "enter") {
        const targetIndexes =
          lineTimes === "firstLine"
            ? [index, index - 1, index - 2]
            : [index, index + 1];
        const nextLine = index + 3;
        const nextLineIndexes =
          lineTimes === "firstLine"
            ? [nextLine, nextLine - 1, nextLine - 2]
            : [nextLine, nextLine + 1];
        activateElements([...targetIndexes, ...nextLineIndexes]);
      } else {
        const targetIndexes =
          lineTimes === "firstLine"
            ? [index, index - 1, index - 2]
            : [index, index + 1];
        const nextLine = index + 3;
        const nextLineIndexes =
          lineTimes === "firstLine"
            ? [nextLine, nextLine - 1, nextLine - 2]
            : [nextLine, nextLine + 1];
        deactivateElements([...targetIndexes, ...nextLineIndexes]);
      }
    }

    if (side === "leftCorner") {
      if (action === "enter") {
        activateElements([0, index, index + 1]);
      } else {
        deactivateElements([0, index, index + 1]);
      }
    }

    if (side === "left") {
      const targetIndexes = [index, 0];
      if (action === "enter") {
        activateElements(targetIndexes);
      } else {
        deactivateElements(targetIndexes);
      }
    }
  };

  return (
    <div
      ref={el => el && (refArray.current[index] = el)}
      //   key={`index ${i}`}
      //   className={styles[getColor(i + 1)]}
      style={{
        zIndex: 50 - index,
        gridArea: `${
          lineTimes === "firstLine" ? 1 : lineTimes === "secondLine" ? 2 : 3
        }`,
      }}
      className={`${color}`}
    >
      {(index === 1 || index === 2 || index === 3) && (
        <Button
          type="split"
          className={styles["left-side"]}
          onMouseEnter={() => {
            hoverBtn({ action: "enter", side: "left" });
          }}
          onMouseLeave={() => {
            hoverBtn({ action: "leave", side: "left" });
          }}
          selectList={[0, index]}
        />
      )}

      <Button
        type={lineTimes === "firstLine" ? "street" : "split"}
        className={styles["top-side"]}
        onMouseEnter={() => {
          hoverBtn({ action: "enter", side: "top" });
        }}
        onMouseLeave={() => {
          hoverBtn({ action: "leave", side: "top" });
        }}
        selectList={
          lineTimes === "firstLine"
            ? [index - 2, index - 1, index]
            : [index, index + 1]
        }
      />
      {index !== 36 && index !== 35 && index !== 34 && (
        <Button
          type="split"
          className={styles["right-side"]}
          onMouseEnter={() => {
            hoverBtn({ action: "enter", side: "right" });
          }}
          onMouseLeave={() => {
            hoverBtn({ action: "leave", side: "right" });
          }}
          selectList={[index, index + 3]}
        />
      )}
      <Button
        type="straight"
        className={styles["center-side"]}
        onMouseEnter={() => {
          refArray.current[index].classList.add(styles.active);
        }}
        onMouseLeave={() => {
          refArray.current[index].classList.remove(styles.active);
        }}
        selectList={[index]}
      />
      {index !== 36 && index !== 35 && index !== 34 && (
        <Button
          type={lineTimes === "firstLine" ? "doubleStreet" : "square"}
          className={styles["corner-side"]}
          onMouseEnter={() => {
            hoverBtn({ action: "enter", side: "corner" });
          }}
          onMouseLeave={() => {
            hoverBtn({ action: "leave", side: "corner" });
          }}
          selectList={
            lineTimes === "firstLine"
              ? [index - 2, index - 1, index, index + 1, index + 2, index + 3]
              : [index, index + 1, index + 3, index + 4]
          }
        />
      )}

      {(index === 1 || index === 2) && (
        <Button
          type={"street"}
          className={styles["left-corner-side"]}
          onMouseEnter={() => {
            hoverBtn({ action: "enter", side: "leftCorner" });
          }}
          onMouseLeave={() => {
            hoverBtn({ action: "leave", side: "leftCorner" });
          }}
          selectList={[0, index, index + 1]}
        />
      )}

      <span>{index}</span>
    </div>
  );
};

const Button = ({
  className,
  onMouseEnter,
  onMouseLeave,
  text,
  type,
  selectList,
}: {
  className?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  text?: string;
  selectList?: number[];
  type: RouletteBetType;
}) => {
  const { selectedBoardData, setSelectedBoardData, selectedChipAmount } =
    useRouletteStore();

  const [chipAmount, setChipAmount] = useState(0);

  function modifyOrAddObject(
    array: ArrayObject[],
    typeToFind: RouletteBetType,
    selectListToFind: number[] | undefined,
    newChipAmount: string,
    modifyType: "plus" | "minus",
  ): ArrayObject[] {
    // let found = false;

    let chipAmount = newChipAmount;

    let totalAmount = 0;
    // 배열을 순회하면서 오브젝트를 찾음
    for (let i = 0; i < array.length; i++) {
      const obj = array[i];

      // 주어진 타입과 selectList가 일치하는 오브젝트를 찾으면 chipAmount를 수정하고 플래그 설정
      if (
        obj.type === typeToFind &&
        (!selectListToFind || arraysEqual(obj.selectList, selectListToFind))
      ) {
        totalAmount = totalAmount + Number(obj.chipAmount);
      }
    }
    if (modifyType === "minus" && totalAmount + Number(newChipAmount) < 0) {
      chipAmount = (
        Number(newChipAmount) -
        (totalAmount + Number(newChipAmount))
      ).toString();
    }

    const newObj: ArrayObject = {
      type: typeToFind,
      chipAmount: chipAmount,
    };

    if (selectListToFind) {
      newObj.selectList = selectListToFind;
    }

    array.push(newObj);

    return array;
  }

  function arraysEqual(
    a: number[] | undefined,
    b: number[] | undefined,
  ): boolean {
    if (a === b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;

    // 두 배열의 모든 요소가 일치하는지 확인
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }

    return true;
  }
  useEffect(() => {
    // 배열을 순회하면서 오브젝트를 찾음
    let num = 0;
    if (selectedBoardData.length > 0) {
      for (let i = 0; i < selectedBoardData.length; i++) {
        const obj = selectedBoardData[i];

        // 주어진 타입과 selectList가 일치하는 오브젝트를 찾으면 chipAmount를 수정하고 플래그 설정
        if (
          obj.type === type &&
          (!selectList || arraysEqual(obj.selectList, selectList))
        ) {
          num = num + Number(obj.chipAmount);
        }
        setChipAmount(num);
      }
    } else {
      setChipAmount(0);
    }
  }, [selectedBoardData]);

  const [chipKind, setChipKind] = useState(0);
  const [chipDobleState, setChipDoubleState] = useState(false);

  useEffect(() => {
    if (chipAmount) {
      const digitCount = Math.floor(Math.log10(Math.abs(chipAmount))) + 1;
      let kindOfCoin = Math.pow(10, digitCount - 1);
      const doubleState = chipAmount > kindOfCoin;
      kindOfCoin = kindOfCoin >= 10000000 ? 1000000 : kindOfCoin;
      setChipKind(kindOfCoin);
      setChipDoubleState(doubleState);
    } else {
      setChipKind(0);
      setChipDoubleState(false);
    }
  }, [chipAmount]);

  const handleClick = (modifyType: "plus" | "minus") => {
    const boardDataArray = selectedBoardData.concat();
    const arr = modifyOrAddObject(
      boardDataArray,
      type,
      selectList,
      modifyType === "plus"
        ? selectedChipAmount.toString()
        : "-" + selectedChipAmount.toString(),
      modifyType,
    );

    setSelectedBoardData(arr);
  };

  return (
    <button
      type="button"
      className={`${className ?? ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onContextMenu={e => {
        e.preventDefault(); // 기본 오른쪽 클릭 메뉴가 표시되지 않도록 막음
        if (chipAmount === 0 || !chipAmount) {
          return false;
        } else {
          handleClick("minus");
        }
      }}
      onClick={() => {
        handleClick("plus");
      }}
    >
      <div className={styles["btn-content"]}>
        {chipKind > 0 && chipAmount > 0 && (
          <span className={styles["chip-amount"]}>
            {amountFormatter({ val: chipAmount, withDecimal: false })}
          </span>
        )}
        {chipKind > 0 &&
          chipAmount > 0 &&
          Array.from({ length: chipDobleState ? 2 : 1 }).map((c, i) => (
            <span
              key={i}
              className={`${
                styles[
                  `coin-${
                    chipKind.toString() as
                      | "1"
                      | "10"
                      | "1000"
                      | "10000"
                      | "100000"
                      | "1000000"
                  }`
                ]
              } ${styles.coin} ${i === 1 ? styles.second : ""}`}
            ></span>
          ))}
        <span>{text ?? ""}</span>
      </div>
    </button>
  );
};

export default Board;
