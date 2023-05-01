import { useState } from "react";

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
