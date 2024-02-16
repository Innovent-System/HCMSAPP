import { ElementType } from '../components/controls/Controls';
/**
 * @typedef {Object} RefType
 * @property {Object} current
 * @property {() => void} current.methodOne
 * @property {() => void} current.methodTwo
 */

/** 
 * @typedef {"inputfield"|"radiogroup"|"checkbox"| "dropdown"|"clearfix"|"ad_dropdown"|"datetimepicker"|"daterangepicker"|"uploadavatar"| "fieldarray"| "custom"} EeleType
 */

/** 
 * @typedef {Object} ExcelType
 * @prop {string} colName
 * @prop {any} sampleData
 */

/** 
 * @typedef {Object} BreakPointsType
 * @prop {number} xs
 * @prop {number} sm
 * @prop {number} md
 * @prop {number} lg
 * @prop {number} xl
 */

/** 
 * @typedef {Object} FormType
 * @prop {EeleType} elementType 
 * @prop {string} name
 * @prop {string} label
 * @prop {any} defaultValue
 * @prop {import('@mui/material').SxProps} sx
 * @prop {BreakPointsType} breakpoints
 * @prop {Array<FormType>} _children
 * @prop {JSX.Element} Component
 * @prop {ExcelType} excel
 */

/**
 * @typedef {Object} FormProps
 * @property {RefType} ref
 * @property {Array<FormType>} formData
 * @prop {BreakPointsType} breakpoints
 * @prop {boolean} isValidate
 * @prop {boolean} isEdit
 * @prop {"row" | "column"} flexDirection
 * @prop {"string"} as 
 * @property {((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined} onChange
 */
