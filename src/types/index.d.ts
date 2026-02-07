import { ReactNode, ReactElement, ChangeEvent, CSSProperties, ComponentType, Ref, ForwardRefExoticComponent, RefAttributes } from 'react';
import { SxProps, Theme } from '@mui/material';

// ✅ FIXED: String literal union type
export type ElementType = 
  | "inputfield"
  | "radiogroup"
  | "checkbox"
  | "dropdown"
  | "clearfix"
  | "ad_dropdown"
  | "datetimepicker"
  | "daterangepicker"
  | "uploadavatar"
  | "fieldarray"
  | "autocomplete"
  | "switch"
  | "slider"
  | "textarea"
  | "custom";

export interface BreakpointsType {
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
}

export interface ValidationRule<T = any> {
  validate?: (values: T) => boolean;
  errorMessage: string;
  when?: number | string;
}

export interface ExcelConfig {
  colName: string;
  sampleData?: any;
  width?: number;
  format?: 'text' | 'number' | 'date' | 'currency';
}

export interface ModalConfig {
  Component: ReactElement;
  position?: 'left' | 'right' | 'top' | 'bottom';
}

export interface DropdownOption {
  label: string;
  value: any;
  disabled?: boolean;
}

// ✅ KEY FIX: Use specific literal types, not just string
export interface BaseFieldConfig<T = any> {
  name: string;
  label: string;
  elementType: ElementType; // ← This now shows all specific values!
  defaultValue?: any;
  required?: boolean | ((values: T) => boolean);
  disabled?: boolean | ((values: T) => boolean);
  validate?: ValidationRule<T>;
  breakpoints?: BreakpointsType;
  sx?: SxProps<Theme>;
  classes?: string;
  style?: CSSProperties;
  isShow?: (values: T) => boolean;
  excel?: ExcelConfig;
  modal?: ModalConfig;
  onChange?: (value: any, values: T) => void;
  placeholder?: string;
  helperText?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  nanoKey?: string;
}

// ✅ IMPORTANT: Each interface MUST specify exact elementType
export interface InputFieldConfig<T = any> extends Omit<BaseFieldConfig<T>, 'elementType'> {
  elementType: "inputfield" | "textarea"; // ← Specific literals
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

export interface DropdownConfig<T = any> extends Omit<BaseFieldConfig<T>, 'elementType'> {
  elementType: "dropdown" | "ad_dropdown" | "autocomplete"; // ← Specific literals
  options: Array<DropdownOption>;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  onSearch?: (query: string) => void;
  renderOption?: (option: any) => ReactNode;
}

export interface RadioGroupConfig<T = any> extends Omit<BaseFieldConfig<T>, 'elementType'> {
  elementType: "radiogroup"; // ← Exact literal
  options: Array<DropdownOption>;
  direction?: 'row' | 'column';
}

export interface CheckboxConfig<T = any> extends Omit<BaseFieldConfig<T>, 'elementType'> {
  elementType: "checkbox"; // ← Exact literal
  checkboxLabel?: string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

export interface DatePickerConfig<T = any> extends Omit<BaseFieldConfig<T>, 'elementType'> {
  elementType: "datetimepicker" | "daterangepicker"; // ← Specific literals
  format?: string;
  minDate?: Date | string;
  maxDate?: Date | string;
  disablePast?: boolean;
  disableFuture?: boolean;
  views?: Array<'year' | 'month' | 'day' | 'hours' | 'minutes'>;
}

export interface UploadConfig<T = any> extends Omit<BaseFieldConfig<T>, 'elementType'> {
  elementType: "uploadavatar"; // ← Exact literal
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  preview?: boolean;
  onUpload?: (file: File) => Promise<string>;
}

export interface SwitchConfig<T = any> extends Omit<BaseFieldConfig<T>, 'elementType'> {
  elementType: "switch"; // ← Exact literal
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

export interface SliderConfig<T = any> extends Omit<BaseFieldConfig<T>, 'elementType'> {
  elementType: "slider"; // ← Exact literal
  min?: number;
  max?: number;
  step?: number;
  marks?: boolean | Array<{ value: number; label: string }>;
}

export interface FieldArrayConfig<T = any> extends Omit<BaseFieldConfig<T>, 'elementType'> {
  elementType: "fieldarray"; // ← Exact literal
  _children: Array<FieldConfig<T>>;
  addButtonText?: string;
  removeButtonText?: string;
  minItems?: number;
  maxItems?: number;
}

export interface CustomFieldConfig<T = any> extends Omit<BaseFieldConfig<T>, 'elementType'> {
  elementType: "custom"; // ← Exact literal
  Component: ComponentType<any>;
  componentProps?: Record<string, any>;
}

export interface ClearfixConfig<T = any> extends Omit<BaseFieldConfig<T>, 'elementType'> {
  elementType: "clearfix"; // ← Exact literal
}

// ✅ Union type - IntelliSense will now show specific types
export type FieldConfig<T = any> = 
  | InputFieldConfig<T>
  | DropdownConfig<T>
  | RadioGroupConfig<T>
  | CheckboxConfig<T>
  | DatePickerConfig<T>
  | UploadConfig<T>
  | SwitchConfig<T>
  | SliderConfig<T>
  | FieldArrayConfig<T>
  | CustomFieldConfig<T>
  | ClearfixConfig<T>;

export interface ComponentWithChildren<T = any> {
  Component: ComponentType<any>;
  _children: Array<FieldConfig<T>>;
  nanoKey?: string;
  [key: string]: any;
}

export type FormData<T = any> = Array<FieldConfig<T>>;

export interface FormRef<T = any> {
  resetForm: () => void;
  validateFields: () => boolean;
  validateWhen: (when: number | string) => boolean;
  setFormValue: (values: Partial<T>) => void;
  getValue: () => T;
  initialValues: T;
}

export interface AutoFormProps<T = any> {
  formData: FormData<T>;
  breakpoints?: BreakpointsType;
  children?: ReactNode;
  isValidate?: boolean;
  isEdit?: boolean;
  flexDirection?: 'row' | 'column';
  as?: 'form' | 'div' | 'section';
  [key: string]: any;
}

export interface UseFormReturn<T = any> {
  values: T;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  changeErrors: Record<string, string>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  resetError: () => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>, exec?: (value: any) => void) => void;
  resetForm: () => void;
}

// ✅ Proper component type with ForwardRef
declare const AutoForm: <T = any>(
  props: AutoFormProps<T> & RefAttributes<FormRef<T>>
) => ReactElement;

//export { AutoForm };

// ============================================
// ALTERNATIVE: If you want CONST for elementTypes
// ============================================

// You can also export the types as constants for runtime use
export const ELEMENT_TYPES = {
  INPUT: "inputfield",
  TEXTAREA: "textarea",
  RADIO: "radiogroup",
  CHECKBOX: "checkbox",
  DROPDOWN: "dropdown",
  AD_DROPDOWN: "ad_dropdown",
  AUTOCOMPLETE: "autocomplete",
  DATETIME: "datetimepicker",
  DATERANGE: "daterangepicker",
  UPLOAD: "uploadavatar",
  FIELDARRAY: "fieldarray",
  SWITCH: "switch",
  SLIDER: "slider",
  CLEARFIX: "clearfix",
  CUSTOM: "custom"
} as const;