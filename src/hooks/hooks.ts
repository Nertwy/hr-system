import { useEffect, useState } from "react";

export const useOnChange = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  return {
    value,
    onChange: handleChange,
  };
};
// export const useTimeout = (callback: any, delay: number) => {
//   const [isTimeoutActive, setIsTimeoutActive] = useState(true);

//   useEffect(() => {
//     let timeoutId:any;

//     if (isTimeoutActive) {
//       timeoutId = setTimeout(() => {
//         callback();
//       }, delay);
//     }

//     return () => {
//       clearTimeout(timeoutId);
//     };
//   }, [callback, delay, isTimeoutActive]);

//   return [isTimeoutActive, setIsTimeoutActive];
// };
