import React, { useState } from 'react';

type InputType = 'password' | 'email' | 'text';

export type TextFieldProps<T> = {
  name: string;
  placeholder: string;
  inputType: InputType;
  validate?: (s: string) => Array<string>;
  label?: string;
  display?: 'inline' | 'block';
  darkMode?: boolean;
  largeInput?: boolean;
  disabled?: boolean;
};

type ReactComponent<T = Record<string, unknown>> = React.FC<TextFieldProps<T>>;

const TextField: ReactComponent = <T,>(props: TextFieldProps<T>) => {
	return (
		<>
			<input 
        name={props.name}
        type={props.inputType} 
        placeholder={props.placeholder} />
		</>
	)
}

export default TextField;