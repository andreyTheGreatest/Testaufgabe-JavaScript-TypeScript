import {
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  textarea?: boolean;
};

export const MyInput: React.FC<InputFieldProps> = ({
  label,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl width={400} isInvalid={!!error}>
      <FormLabel >{label}</FormLabel>
      <Input
        {...field}
        {...props}
        label={label}
      />
      {error ? <FormErrorMessage role="error">{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
