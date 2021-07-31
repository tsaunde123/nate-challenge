import React from "react";
import { Control, Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";

interface IControlledAutocompleteProps {
  options: Array<string>;
  control: Control<any>;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  [prop: string]: any;
}

export default function ControlledAutocomplete(
  props: IControlledAutocompleteProps
) {
  const {
    options = [],
    control,
    defaultValue,
    name,
    placeholder,
    ...otherProps
  } = props;

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange }, field, ...props }) => {
          return (
            <CreatableSelect
              isClearable
              {...field}
              onChange={onChange}
              options={options}
              placeholder={placeholder}
              {...props}
              classNamePrefix="autoCompleteContainer"
            />
          );
        }}
        defaultValue={defaultValue}
        {...otherProps}
      />
    </>
  );
}
