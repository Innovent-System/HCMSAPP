import React, { useState, useEffect, useRef, useId } from 'react';
import { Stepper, Collapse, Box, Step, StepLabel, Divider, Typography, IconButton, Chip } from '../../../deps/ui';
import { Launch, Person, Call, Business, AccountBalanceOutlined, DescriptionOutlined } from '../../../deps/ui/icons';
import { AutoForm } from '../../../components/useForm';
import Controls from '../../../components/controls/Controls';
import { API } from '../_Service';
import { useDropDown } from '../../../components/useDropDown';
import PropTypes from 'prop-types'
import { useEntityAction, useLazyEntityByIdQuery } from '../../../store/actions/httpactions';
import Loader from '../../../components/Circularloading'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LockOutlined from '@mui/icons-material/LockOutlined';
import Check from '@mui/icons-material/Check';
import { AddCountry } from '../../Organization/components/Country';
import { AddArea } from '../../Organization/components/Area';
import SalarySetup from '../../Payroll/SalarySetup';

const TAB_ICONS = {
  Personal: <Person fontSize="small" />,
  Job: <Business fontSize="small" />,
  Contact: <Call fontSize="small" />,
  Access: <LockOutlined fontSize="small" />,
  Bank: <AccountBalanceOutlined fontSize="small" />,
  Documents: <DescriptionOutlined fontSize="small" />,
};

// wizard aur profile dono ka content isi width tak rahe (full-screen popup mein fields door door na jayein)
const CONTENT_MAX_WIDTH = 1100; // profile (edit)
const WIZARD_MAX_WIDTH = 960;   // add wizard card
const CHEVRON_DEPTH = 16; // arrow ki nok kitni andar/bahar jati hai (px)
const CHEVRON_GAP = 4;    // do arrows ke beech safed gap (px)

const chevronPolygon = (index, count) => {
  const d = `${CHEVRON_DEPTH}px`;
  const isFirst = index === 0;
  const isLast = index === count - 1;
  if (isFirst && isLast) return 'none';
  const points = [
    '0 0',
    isLast ? '100% 0' : `calc(100% - ${d}) 0`,
    ...(isLast ? ['100% 100%'] : ['100% 50%', `calc(100% - ${d}) 100%`]),
    '0 100%',
    ...(isFirst ? [] : [`${d} 50%`]), // pichle arrow ki nok ke liye notch
  ];
  return `polygon(${points.join(', ')})`;
};

/** Add wizard ka arrow-style (chevron) stepper. Complete ho chuke steps par click se wapas ja sakte hain. */
const ChevronSteps = ({ steps, activeStep, onStepClick }) => (
  <Box sx={{ display: 'flex', width: '100%', maxWidth: WIZARD_MAX_WIDTH, mb: 2.5 }}>
    {steps.map((label, index) => {
      const isActive = index === activeStep;
      const isDone = index < activeStep;
      const clickable = isDone && typeof onStepClick === 'function';
      return (
        <Box
          key={label}
          onClick={clickable ? () => onStepClick(index) : undefined}
          sx={{
            flex: 1,
            minWidth: 0,
            height: 46,
            ml: index === 0 ? 0 : `-${CHEVRON_DEPTH - CHEVRON_GAP}px`,
            pl: index === 0 ? 2 : `${CHEVRON_DEPTH + 8}px`,
            pr: index === steps.length - 1 ? 2 : `${CHEVRON_DEPTH + 8}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            clipPath: chevronPolygon(index, steps.length),
            bgcolor: isActive || isDone ? 'primary.main' : 'grey.200',
            color: isActive || isDone ? 'primary.contrastText' : 'text.secondary',
            opacity: isDone ? 0.8 : 1,
            fontSize: 14,
            fontWeight: isActive ? 700 : 500,
            cursor: clickable ? 'pointer' : 'default',
            userSelect: 'none',
            transition: 'background-color .2s, opacity .2s',
          }}
        >
          <Box component="span" sx={{
            width: 22,
            height: 22,
            flexShrink: 0,
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            bgcolor: isActive || isDone ? 'rgba(255,255,255,0.25)' : 'grey.400',
            color: isActive || isDone ? 'inherit' : 'common.white',
          }}>
            {isDone ? <Check sx={{ fontSize: 14 }} /> : index + 1}
          </Box>
          <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {label}
          </Box>
        </Box>
      );
    })}
  </Box>
);

const Styles = {
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start'

  },
  button: {
    marginRight: 1,
  },
  instructions: {
    marginTop: 1,
    marginBottom: 1,
  },
}

const MapModel = {
  country: AddCountry,
  area: AddArea
}
const AddModal = ({ name }) => {
  const [openPopup, setOpenPopup] = useState(false);

  const Modal = MapModel[name];
  return (
    <Box position="absolute" top={-15} right={0}>
      <IconButton size='small' onClick={() => {
        setOpenPopup(true);
      }}>
        <Launch fontSize="small" />
      </IconButton>
      <Modal openPopup={openPopup} setOpenPopup={setOpenPopup} />
    </Box>
  )
}

const genderItems = [
  { id: "Male", title: "Male" },
  { id: "Female", title: "Female" },
  { id: "Other", title: "Other" },
]

const Religion = [
  { id: "Islam", title: "Islam" },
  { id: "Hindu", title: "Hindu" },
  { id: "Christian", title: "Christian" },
  { id: "Other", title: "Other" },
];

const Maritalstatus = [
  { id: "Single", title: "Single" },
  { id: "Married", title: "Married" },
  { id: "Widowed", title: "Widowed" },
  { id: "Divorced", title: "Divorced" },
  { id: "Other", title: "Other" },
]

const bindObject = (obj) => {
  const result = {};
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === "object") Object.assign(result, bindObject(obj[k]))
    else result[k] = obj[k]
  })
  return result;
}

const emptyString = "";
const breakpoints = { size: { md: 4, xs: 6 } };
const fullSizePont = { size: { md: 12, xs: 12 } };
const currentDate = new Date();
const sanitizeName = (v) => String(v ?? '').replace(/[^\p{L}\p{N} ]/gu, '').replace(/ {2,}/g, ' ');
const sanitizeCode = (v) => String(v ?? '').replace(/[^A-Za-z0-9]/g, '');
const NAME_VALID = /^[\p{L}\p{N}]+(?: [\p{L}\p{N}]+)*$/u;
const CODE_VALID = /^[A-Za-z0-9]+$/;

const alnumRule = (field, regex, message, { skipInEdit = false } = {}) => (val) => {
  const v = String(val?.[field] ?? '').trim();
  if (!v) return false;
  if (skipInEdit) return true; // purane employees ka code (disabled field) save na rokay
  return regex.test(v) ? true : message;
};
/**
 * Add  = wizard, sirf wo fields jin ke bagair employee kaam nahi karta (basic + job)
 * Edit = profile tabs, baqi sab details yahan baad mein add hoti hain
 *
 * Saare field groups hamesha formData mein rehte hain (jo visible nahi wo Collapse in={false}),
 * is liye getValue() / mapEmployeeData / excel template (coldata) pehle jaisa hi kaam karte hain.
 */
const GROUP_ORDER = ['basic', 'personal', 'access', 'job', 'exit', 'contact'];

// AutoForm errorProps (validate.when) sirf pehli mount par bante hain (keepMounted popup),
// is liye `when` mode par depend nahi karna chahiye: har group ka index dono modes mein same hai
// (wizard: 0, 1 | profile: 0, 1, 2, 3), jo group wizard mein hidden hai wo bhi apna profile index rakhta hai
const GROUP_WHEN = { basic: 0, personal: 0, job: 1, exit: 1, contact: 2, access: 3 };

const WIZARD_TABS = [
  {
    label: 'General', groups: ['basic', 'access'],
    title: 'Basic Information',
    subtitle: 'Essential details to create the employee. Contact, personal and other details can be added later from the employee profile.',
  },
  {
    label: 'Company', groups: ['job'],
    title: 'Job Details',
    subtitle: 'Where the employee works and which schedule applies. These drive attendance, leave and approvals.',
  },
];

const PROFILE_TABS = [
  { label: 'Personal', groups: ['basic', 'personal'] },
  { label: 'Job', groups: ['job', 'exit'] },
  { label: 'Contact', groups: ['contact'] },
  { label: 'Access', groups: ['access'] },
];

// parent (Back/Next/Submit wala) isay use kare: getSteps(isEdit).length - 1 = last step
export const getSteps = (isEdit = false) => (isEdit ? PROFILE_TABS : WIZARD_TABS).map(t => t.label);

// validate.when ab group ke tab index se aata hai (hardcoded 0/1 nahi)
const withWhen = (fields, when) =>
  fields.map(f => (f.validate ? { ...f, validate: { ...f.validate, when } } : f));

export default function EmployaaModal({ isEdit = false, formApi, setOpenPopup, editId, currentEditRecord, coldata, mapEmployeeData, setActiveStep, activeStep = 0, add_edit_API = API.Employee }) {

  const [loader, setLoader] = useState(false);
  const tabs = isEdit ? PROFILE_TABS : WIZARD_TABS;
  const [GetEmpolyee] = useLazyEntityByIdQuery();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const { companies, countries, states, cities, areas, designations, groups, schedules, departments,
    employees, roleTemplates, religion, employeeStatus, filterType, setFilter } = useDropDown();

  const handleEdit = () => {
    setLoader(true);
    GetEmpolyee({ url: add_edit_API, id: editId }).then(({ data: { result: values } }) => {
      const { setFormValue } = formApi.current;
      currentEditRecord.current = values;
      setFormValue({
        employeeRefNo: values.employeeRefNo,
        punchCode: values.punchCode,
        firstName: values.firstName,
        lastName: values.lastName,
        isAllowLogin: values.isAllowLogin,
        fkCompanyId: companies.find(c => c.id === values.companyId),
        maritalStatus: values.maritalStatus,
        email: values.email,
        gender: values.gender,
        dateofBirth: values?.dateofBirth ? new Date(values?.dateofBirth) : null,
        fkReligionId: values?.religionId ?? null,
        nic: values.nic,
        fkAreaId: areas.find(a => a.id === values.areaId),
        fkCityId: cities.find(a => a.id === values.cityId),
        fkCountryId: countries.find(c => c.id === values.countryId),
        fkDepartmentId: departments.find(d => d.id === values.departmentId),
        fkDesignationId: designations.find(d => d.id === values.designationId),
        fkEmployeeGroupId: groups.find(g => g.id === values.employeeGroupId),
        fkEmployeeStatusId: employeeStatus.find(e => e.id === values.employeeStatusId) ?? null,
        fkStateId: states.find(s => s.id === values.stateId),
        scheduleId: schedules.find(s => s.id === values?.scheduleId) ?? null,
        fkManagerId: employees.find(e => e.id === values?.managerId) ?? null,
        fkRoleTemplateId: values?.roleTemplateMasterId ?? '',
        joiningDate: new Date(values.joiningDate),
        confirmationDate: values.confirmationDate ? new Date(values.confirmationDate) : null,
        // pehle load hi nahi hoti thi, to edit/save par resign date wipe ho sakti thi
        resignationDate: values.resignationDate ? new Date(values.resignationDate) : null,
        address1: values?.address1,
        address2: values?.address2,
        zipCode: values?.zipCode,
        country: values?.contactCountry,
        state: values?.contactState,
        city: values?.contactCity,
        mobileNo: values?.mobileNo,
        workNo: values?.workNo,
        emergencyNo: values?.emergencyNo
      });
    }).finally(() => {
      setLoader(false);

    })

  }

  useEffect(() => {
    if (isEdit && companies?.length) {
      setActiveStep(0);
      handleEdit();
    }
    else {
      const { resetForm } = formApi.current;
      setActiveStep(0);
      resetForm();
    }

  }, [isEdit, companies, editId])


  const { addEntity } = useEntityAction();

  const fieldGroups = {
    // ───────────── Wizard step 1 / Profile: Personal (upar) ─────────────
    basic: [
      {
        elementType: "uploadavatar",
        name: "employeeImage",
        breakpoints: fullSizePont,
        defaultValue: null
      },
      {
        elementType: "inputfield",
        name: "prefix",
        label: "Prefix",
        breakpoints,
        defaultValue: null,
        excel: {
          sampleData: emptyString
        }
      },
      {
        elementType: "inputfield",
        name: "employeeRefNo",
        label: "Employee Code",
        disabled: isEdit,
        required: true,
        breakpoints,
        validate: {
          errorMessage: "Employee Ref is required",
          validate: alnumRule("employeeRefNo", CODE_VALID, "Only letters and numbers are allowed")
        },
        defaultValue: emptyString,
        excel: {
          sampleData: 222
        }
      },
      {
        elementType: "inputfield",
        name: "punchCode",
        label: "Punch Code",
        required: true,
        type: 'number',
        breakpoints,
        validate: {
          errorMessage: "Punch Code is required"
        },
        defaultValue: emptyString,
        excel: {
          sampleData: 222
        }
      },
      {
        elementType: "inputfield",
        name: "firstName",
        label: "First Name",
        required: true,
        breakpoints,
        validate: {
          errorMessage: "First Name is required",
          validate: alnumRule("firstName", NAME_VALID, "Only letters and numbers are allowed")
        },
        defaultValue: emptyString,
        excel: {
          sampleData: "Faizan"
        }
      },
      {
        elementType: "inputfield",
        name: "lastName",
        label: "Last Name",
        breakpoints,
        required: true,
        validate: {
          errorMessage: "Last Name is required",
          type: "string",
          validate: alnumRule("lastName", NAME_VALID, "Only letters and numbers are allowed")
        },
        defaultValue: emptyString,
        excel: {
          sampleData: "Siddiqui"
        }
      },

      {
        // approval routing + subordinates scope isi par chalta hai, is liye wizard mein hai
        elementType: "ad_dropdown",
        name: "fkManagerId",
        label: "Reports To",
        breakpoints,
        dataName: 'fullName',
        dataId: 'id',
        options: employees,
        defaultValue: null,
        excel: {
          sampleData: emptyString
        }
      },
    ],

    // ───────────── Profile only (wizard mein hidden) ─────────────
    personal: [
      {
        elementType: "custom",
        breakpoints: fullSizePont,
        NodeElement: () => <Divider sx={{ my: 1 }}><Chip size='small' label="Personal Detail" icon={<Person />} /></Divider>
      },
      {
        elementType: "dropdown",
        name: "gender",
        label: "Gender",
        breakpoints,
        dataId: "id",
        dataName: "title",
        defaultValue: "Male",
        options: genderItems,
        excel: {
          sampleData: "Male"
        }
      },
      {
        elementType: "inputfield",
        name: "fName",
        label: "Father/Husband Name",
        breakpoints,
        defaultValue: null,
        excel: {
          sampleData: emptyString
        }
      },
      {
        elementType: "dropdown",
        name: "maritalStatus",
        label: "Marital Status",
        breakpoints,
        dataId: "id",
        dataName: "title",
        defaultValue: "Single",
        options: Maritalstatus,
        excel: {
          sampleData: "Single"
        }
      },
      {
        elementType: "dropdown",
        name: "fkReligionId",
        label: "Religion",
        breakpoints,
        dataId: "id",
        dataName: "name",
        defaultValue: null,
        options: religion,
        excel: {
          sampleData: emptyString
        }
      },
      {
        elementType: "datetimepicker",
        name: "dateofBirth",
        breakpoints,
        label: "D.O.B",
        defaultValue: null,
        excel: {
          sampleData: new Date().toLocaleDateString('en-US')
        }
      },
      {
        elementType: "inputfield",
        name: "nic",
        label: "National ID",
        breakpoints,
        defaultValue: null,
        excel: {
          sampleData: emptyString
        }
      },
    ],

    access: [
      {
        elementType: "checkbox",
        name: "isAllowLogin",
        breakpoints: fullSizePont,
        label: "Portal Access",
        defaultValue: false,
        excel: {
          sampleData: false
        }
      },
      {
        elementType: "inputfield",
        name: "email",
        label: "Email",
        breakpoints,
        required: (value) => value["isAllowLogin"],
        type: "email",
        validate: {
          errorMessage: "Email is required",
          validate: (val) => /$^|.+@.+..+/.test(val.email)
        },
        defaultValue: null,
        excel: {
          sampleData: emptyString
        }
      },
      {
        elementType: "dropdown",
        name: "fkRoleTemplateId",
        label: "User Role Template",
        breakpoints,
        dataId: "id",
        dataName: "name",
        required: (value) => value["isAllowLogin"],
        disabled: (value) => value["isAllowLogin"] === false,
        validate: {
          errorMessage: "Role Template is required",
        },
        defaultValue: null,
        options: roleTemplates?.length ? roleTemplates : [],
        excel: {
          sampleData: emptyString
        }
      },
    ],

    // ───────────── Wizard step 2 / Profile: Job ─────────────
    job: [
      {
        elementType: "ad_dropdown",
        name: "fkCompanyId",
        label: "Company",
        breakpoints,
        required: true,
        validate: {
          errorMessage: "Company is required",
        },
        dataName: 'companyName',
        dataId: 'id',
        options: companies,
        onChange: (data) => setFilter(data, filterType.COMPANY, "id"),
        defaultValue: companies?.length ? companies[0] : null,
        excel: {
          sampleData: "Company"
        }
      },
      {
        elementType: "ad_dropdown",
        name: "fkCountryId",
        label: "Country",
        breakpoints,
        required: true,
        modal: {
          Component: <AddModal key="country-modal" name="country" />,
        },
        validate: {
          errorMessage: "Country is required",
        },
        dataName: 'name',
        dataId: 'id',
        options: countries,
        onChange: (data) => setFilter(data, filterType.COUNTRY, "id"),
        defaultValue: countries?.length ? countries[0] : null,
        excel: {
          sampleData: "Country"
        }
      },
      {
        elementType: "ad_dropdown",
        name: "fkStateId",
        label: "State",
        breakpoints,
        required: true,
        dataName: "name",
        dataId: 'id',
        validate: {
          errorMessage: "State is required",
        },
        options: states,
        onChange: (data) => setFilter(data, filterType.STATE, "id"),
        defaultValue: null,
        excel: {
          sampleData: "State"
        }
      },
      {
        elementType: "ad_dropdown",
        name: "fkCityId",
        label: "City",
        breakpoints,
        required: true,
        dataId: 'id',
        dataName: "name",
        onChange: (data) => setFilter(data, filterType.CITY, "id"),
        validate: {
          errorMessage: "City is required",
        },
        options: cities,
        defaultValue: null,
        excel: {
          sampleData: "City"
        }
      },
      {
        elementType: "ad_dropdown",
        name: "fkAreaId",
        label: "Area",
        modal: {
          Component: <AddModal key="area-modal" name="area" />,
        },
        breakpoints,
        required: true,
        dataId: 'id',
        dataName: "name",
        validate: {
          errorMessage: "Area is required",
        },
        options: areas,
        defaultValue: null,
        excel: {
          sampleData: "Area"
        }
      },
      {
        elementType: "ad_dropdown",
        name: "fkEmployeeGroupId",
        label: "Group",
        breakpoints,
        required: true,
        dataId: 'id',
        dataName: "name",
        validate: {
          errorMessage: "Group is required",
        },
        options: groups,
        defaultValue: null,
        excel: {
          sampleData: "Group"
        }
      },
      {
        elementType: "ad_dropdown",
        name: "fkDepartmentId",
        label: "Department",
        breakpoints,
        required: true,
        dataName: "departmentName",
        dataId: 'id',
        validate: {
          errorMessage: "Department is required",
        },
        options: departments,
        defaultValue: null,
        excel: {
          sampleData: "Department"
        }
      },
      {
        elementType: "ad_dropdown",
        name: "fkDesignationId",
        label: "Designation",
        breakpoints,
        dataId: 'id',
        dataName: "name",
        options: designations,
        defaultValue: null,
        excel: {
          sampleData: "Designation"
        }
      },
      {
        elementType: "ad_dropdown",
        name: "scheduleId",
        label: "Assign Schedule",
        required: true,
        breakpoints,
        validate: {
          errorMessage: "Schedule is required",
        },
        dataId: 'id',
        dataName: "scheduleName",
        options: schedules,
        defaultValue: null,
        excel: {
          sampleData: emptyString
        }
      },
      {
        elementType: "custom",
        breakpoints: fullSizePont,
        NodeElement: () => <Divider><Chip size='small' label="JCR Detail" icon={<Person />} /></Divider>
      },
      {
        elementType: "datetimepicker",
        name: "joiningDate",
        breakpoints,
        label: "Joining Date",
        defaultValue: currentDate,
        excel: {
          sampleData: emptyString
        }
      },
      {
        elementType: "datetimepicker",
        name: "confirmationDate",
        breakpoints,
        label: "Confirmation Date",
        defaultValue: new Date().setMonth(currentDate.getMonth() + 2),
        excel: {
          sampleData: emptyString
        }
      },
      {
        elementType: "ad_dropdown",
        name: "fkEmployeeStatusId",
        label: "Employee Status",
        required: true,
        validate: {
          errorMessage: "Employee Status is required",
        },
        breakpoints,
        dataId: 'id',
        dataName: "name",
        options: employeeStatus,
        defaultValue: employeeStatus?.length ? employeeStatus[0] : null,
        excel: {
          sampleData: "Probation"
        }
      },
    ],

    // Resign Date create ke waqt ka field nahi: wizard mein hidden, sirf profile (Job tab) mein visible.
    // Alag group isi liye hai ke field set dono modes mein same rahe (AutoForm initialValues sirf mount par bante hain)
    exit: [
      {
        elementType: "datetimepicker",
        name: "resignationDate",
        label: "Resign Date",
        breakpoints,
        defaultValue: null,
        excel: {
          sampleData: emptyString
        }
      },
    ],

    // ───────────── Profile only: Contact ─────────────
    contact: [
      {
        elementType: "inputfield",
        name: "address1",
        label: "Street 1",
        breakpoints,
        defaultValue: null,
        excel: {
          sampleData: emptyString
        }
      },
      {
        elementType: "inputfield",
        name: "address2",
        label: "Street 2",
        breakpoints,
        defaultValue: null,
        excel: {
          sampleData: emptyString
        }
      },
      {
        elementType: "inputfield",
        name: "city",
        label: "City",
        breakpoints,
        defaultValue: null,
        excel: {
          sampleData: emptyString
        }
      },
      {
        elementType: "inputfield",
        name: "state",
        label: "State",
        breakpoints,
        defaultValue: null,
        excel: {
          sampleData: emptyString
        }
      },
      {
        elementType: "inputfield",
        name: "zipCode",
        label: "Zip/Postal Code",
        breakpoints,
        defaultValue: null,
        excel: {
          sampleData: emptyString
        }
      },
      {
        elementType: "inputfield",
        name: "country",
        label: "Country",
        breakpoints,
        defaultValue: null,
        excel: {
          sampleData: emptyString
        }
      },
      {
        elementType: "custom",
        breakpoints: fullSizePont,
        NodeElement: () => <Divider><Chip size='small' label="Telephone" icon={<Call />} /></Divider>
      },
      {
        elementType: "inputfield",
        name: "mobileNo",
        label: "Mobile",
        breakpoints,
        defaultValue: null,
        excel: {
          sampleData: emptyString
        }
      },
      {
        elementType: "inputfield",
        name: "workNo",
        label: "Work",
        breakpoints,
        defaultValue: null,
        excel: {
          sampleData: emptyString
        }
      },
      {
        elementType: "inputfield",
        name: "emergencyNo",
        label: "Emergency",
        breakpoints,
        defaultValue: null,
        excel: {
          sampleData: emptyString
        }
      },
    ],
  };

  /**
   * @type {import('../../../types/fromstype').FormType}
   */
  const formData = GROUP_ORDER.map((key) => {
    const tabIndex = tabs.findIndex(t => t.groups.includes(key)); // -1 = is mode mein visible nahi
    return {
      Component: Collapse,
      in: tabIndex !== -1 && tabIndex === activeStep,
      // har group poori width le, warna basic aur personal ke columns alag width mein aligned nahi hote
      sx: { width: '100%' },
      _children: withWhen(fieldGroups[key], GROUP_WHEN[key]),
    };
  });

  coldata.current = formData;

  useEffect(() => {
    if (companies?.length) {
      setFilter(companies[0], filterType.COMPANY, "id");
    }
  }, [companies]);


  const handleSubmit = (e) => {
    const { getValue, validateFields } = formApi.current
    if (validateFields()) {

      const values = getValue();
      const setEmployee = mapEmployeeData(values, false);
      if (isEdit)
        setEmployee.id = editId

      addEntity({ url: add_edit_API, data: [setEmployee] }).finally(() => {
        setOpenPopup(false);
      });

    }
  }



  // profile header: record handleEdit ke baad load hota hai (loader state se re-render hota hai)
  const rec = isEdit ? currentEditRecord?.current : null;
  const fullName = rec ? [rec.firstName, rec.lastName].filter(Boolean).join(' ') : '';

  return (
    <Box sx={{
      ...Styles.root,
      flexDirection: !isEdit || !isDesktop ? 'column' : 'row',
      alignItems: isEdit ? 'flex-start' : 'center', // wizard: steps + card center mein
    }}>
      <Loader open={loader} />
      {isEdit ? (
        // Profile: side tabs, kisi bhi order mein click ho sakte hain
        <Box sx={{
          flex: isDesktop ? '0 0 220px' : 'none',
          width: isDesktop ? 220 : '100%',
          alignSelf: 'stretch',
          pr: isDesktop ? 2 : 0,
          mr: isDesktop ? 3 : 0,
          mb: isDesktop ? 0 : 2,
          borderRight: isDesktop ? 1 : 0,
          borderColor: 'divider',
        }}>
          {fullName && (
            <Box sx={{ px: 1.5, pb: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} noWrap>{fullName}</Typography>
              {rec?.employeeRefNo && (
                <Typography variant="caption" color="text.secondary">{rec.employeeRefNo}</Typography>
              )}
            </Box>
          )}
          <Tabs
            orientation={isDesktop ? "vertical" : "horizontal"}
            variant={isDesktop ? "standard" : "scrollable"}
            value={activeStep}
            onChange={(_, value) => setActiveStep(value)}
            TabIndicatorProps={{ sx: { display: 'none' } }}
            sx={{
              borderBottom: 0,
              '& .MuiTab-root': {
                justifyContent: isDesktop ? 'flex-start' : 'center',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                minHeight: 44,
                px: 1.5,
                mb: isDesktop ? 0.5 : 0,
              },
              '& .Mui-selected': { bgcolor: 'action.selected' },
            }}
          >
            {tabs.map(({ label }, index) => (
              <Tab key={label} label={label} value={index} icon={TAB_ICONS[label]} iconPosition="start" />
            ))}
          </Tabs>
        </Box>
      ) : (
        // Add wizard: upar arrow-style steps, Back/Next parent ke footer se chalta hai
        <ChevronSteps steps={getSteps(false)} activeStep={activeStep} onStepClick={setActiveStep} />
      )}

      {/* Wrapper hamesha render hota hai (sirf style badalti hai) taake AutoForm mode badalne par remount na ho */}
      <Box sx={isEdit ? {
        flex: 1,
        minWidth: 0,
        maxWidth: CONTENT_MAX_WIDTH,
      } : {
        width: '100%',
        maxWidth: WIZARD_MAX_WIDTH,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        boxShadow: '0 1px 3px rgba(16, 24, 40, 0.06)',
        p: { xs: 2, md: 3 },
      }}>
        {!isEdit && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>{tabs[activeStep]?.title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {tabs[activeStep]?.subtitle}
            </Typography>
            <Divider sx={{ mt: 2 }} />
          </Box>
        )}
        <AutoForm
          formData={formData}
          ref={formApi}
          isValidate={true}
          sx={{ width: '100%' }}
        />
      </Box>
    </Box>
  );
}