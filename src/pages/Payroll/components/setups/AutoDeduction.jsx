import React, { useEffect, useRef, useState } from 'react'
import { Divider, Chip, IconButton, Grid } from '../../../../deps/ui'
import { DisplaySettings, AddCircleOutline, RemoveCircleOutline, SaveTwoTone } from '../../../../deps/ui/icons'
import { AutoForm } from '../../../../components/useForm'
import { useAppSelector } from '../../../../store/storehook';
import { useEntitiesQuery, useEntityAction } from '../../../../store/actions/httpactions';
import { API } from '../../_Service';
import Controls from '../../../../components/controls/Controls';

const breakpoints = { size: { md: 2, sm: 6, xs: 6 } }, fullWidthPoints = { size: { md: 12, sm: 12, xs: 12 } };
const frequencyType = [{ id: "Once", title: "Once" },
{ id: "EveryOccurance", title: "Every Occurance" }
]
const DefaultFrequency = "EveryOccurance";
const DEFAULT_API = API.PayrollSetup;
export const AutoDeduction = ({ data }) => {
  const formApi = useRef(null);
  const attendanceFlag = useAppSelector(e => e.appdata.employeeData?.attendanceFlags)
  const autoDeductionType = useAppSelector(e => e.appdata.payrollData?.autoDeductionType);
  const { data: leaveTypes, isLoading, refetch, totalRecord } = useEntitiesQuery({
    url: `${API.LeaveType}/get`,
    data: {
      limit: 100,
      page: 1,
      searchParams: {}
    }
  }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });

  const [disabledFlags, setDisabledFlags] = useState(attendanceFlag?.length ? [attendanceFlag[0].id] : []);
  const _flagSetting = useRef([{
    attendanceFlagId: attendanceFlag?.length ? attendanceFlag[0].id : "",
    occurrence: 1, exemptedCount: 3,
    frequency: DefaultFrequency,
    autoDeductionTypeId: 2,
    value: 1
  }]).current;

  const { addEntity } = useEntityAction();
  const handleSubmit = () => {
    const { getValue, validateFields } = formApi.current;
    const values = getValue();
    if (!values?.isLeaveDeductionFirst) {
      values.leaveDeductionOrder = []
    }
    if (!validateFields()) return;
    var attendaceAutoId = data?.autoDeduction ? data?.autoDeduction.id : 0;
    const { flagSetting, leaveDeductionOrder, ...restData } = values;
    const dataToInsert = {
      id: attendaceAutoId,
      payrollSetupId: data.id,
      ...restData,
      attendanceFlagDeductionRules: flagSetting.map(e => ({ ...e, attendanceDeductionRuleId: attendaceAutoId })),
      leaveDeductionMappings: leaveDeductionOrder.map((e, i) => ({ attendanceDeductionRuleId: attendaceAutoId, leaveTypeId: e, priority: i + 1 }))
    }

    addEntity({ url: `${DEFAULT_API}/attednaceDeductionSetting`, data: dataToInsert });

  }
  useEffect(() => {
    if (formApi.current && data) {
      const { setFormValue } = formApi.current;
      setFormValue(structuredClone(data.autoDeduction))
      setDisabledFlags(data.autoDeduction?.flagSetting?.map(e => e.attendanceFlagId))
    }
  }, [data, formApi])

  const handleAddItems = () => {
    const { getValue, setFormValue } = formApi.current;

    if (attendanceFlag.length === getValue().flagSetting.length) return;
    const newId = attendanceFlag.find(c => !disabledFlags.includes(c.id))?.id;
    setFormValue({
      flagSetting: [...getValue().flagSetting, {
        attendanceFlagId: newId ?? "",
        occurrence: 1, exemptedCount: 3,
        autoDeductionTypeId: 2,
        frequency: DefaultFrequency,
        value: 1
      }]
    })
    disabledFlags.push(newId);
    setDisabledFlags([...disabledFlags])

  }

  const handleRemoveItems = (_index) => {
    if (disabledFlags.length === 1) return
    const { getValue, setFormValue } = formApi.current;
    const { flagSetting } = getValue();
    disabledFlags.splice(disabledFlags.indexOf(flagSetting[_index].attendanceFlagId), 1);
    setDisabledFlags([...disabledFlags]);
    setFormValue({ flagSetting: flagSetting.toSpliced(_index, 1) })
  }

  const formData = [
    {
      elementType: "custom",
      breakpoints: fullWidthPoints,
      NodeElement: () => <Divider><Chip label="Attendance Flag Rules" icon={<DisplaySettings />} /></Divider>
    },
    {
      elementType: "checkbox",
      name: "enable",
      label: "Auto Dedution(s)",
      title: "For Attendance Flag",
      breakpoints,
      defaultValue: true
    },
    {
      elementType: "checkbox",
      name: "isAbsentDeduction",
      label: "Absent Deduction",
      breakpoints,
      defaultValue: true
    },
    {
      elementType: "checkbox",
      name: "isLeaveDeductionFirst",
      label: "Is Leave Deduction First",
      breakpoints,
      defaultValue: true
    },
    {
      elementType: "dropdown",
      name: "leaveDeductionOrder",
      label: "Leave Type",
      breakpoints: { size: { xs: 6, sm: 6, md: 2 } },
      isMultiple: true,
      isShow: (value) => value.isLeaveDeductionFirst,
      required: true,
      validate: {
        errorMessage: "Leave Type is required",
      },
      // onChange: (_allowanc, _ind) => {
      //   const { getValue } = formApi.current;
      //   setDisabledFlags(getValue().flagSetting.map(c => c.flagId))
      // },
      // disableitems: disabledFlags,
      dataId: "id",
      dataName: "title",
      isNone: false,
      defaultValue: [],
      options: leaveTypes,
    },
    {
      elementType: "arrayForm",
      name: "flagSetting",
      // sx: listStyle,
      // arrayFormRef: allowanceApi,
      breakpoints: fullWidthPoints,
      defaultValue: _flagSetting,
      formData: [
        {
          elementType: "dropdown",
          name: "attendanceFlagId",
          label: "Title",
          breakpoints,
          onChange: (_allowanc, _ind) => {

            const { getValue } = formApi.current;
            setDisabledFlags(getValue().flagSetting.map(c => c.attendanceFlagId))
          },
          disableitems: disabledFlags,
          dataId: "id",
          dataName: "name",
          isNone: false,
          // defaultValue: AllowancesTitle.length ? AllowancesTitle[0]._id : "",
          options: attendanceFlag,
        },
        {
          elementType: "inputfield",
          name: "occurrence",
          label: "Flag Count",
          inputMode: 'numeric',
          type: "number",
          validate: {
            errorMessage: "Flag Count is required",
          },
          inputProps: {
            min: 0,
          },
          breakpoints: { size: { xs: 1 } },
          defaultValue: "",
        },
        {
          elementType: "inputfield",
          name: "exemptedCount",

          label: "Exempted Count",
          inputMode: 'numeric',
          type: "number",
          validate: {
            errorMessage: "Exempted Count is required",
          },
          inputProps: {
            min: 0,
          },
          breakpoints: { size: { xs: 1 } },
          defaultValue: "",
        },
        {
          elementType: "dropdown",
          name: "frequency",
          label: "Frequency",
          breakpoints,
          dataId: "id",
          dataName: "title",
          isNone: false,
          defaultValue: DefaultFrequency,
          options: frequencyType,
        },
        {
          elementType: "dropdown",
          name: "autoDeductionTypeId",
          label: "Deduction Type",
          breakpoints,
          dataId: "id",
          dataName: "name",
          isNone: false,
          defaultValue: 2,
          options: autoDeductionType,
        },
        {
          elementType: "inputfield",
          name: "value",
          label: "Value",
          inputMode: 'numeric',
          type: "number",
          validate: {
            errorMessage: "Dedcution Day is required",
          },
          inputProps: {
            min: 0,
          },
          breakpoints: { size: { xs: 1 } },
          defaultValue: "",
        },
        {
          elementType: "custom",
          breakpoints: { size: { xs: 12, lg: 2, md: 2 } },
          NodeElement: ({ dataindex }) => <>
            <IconButton onClick={() => handleRemoveItems(dataindex)}>
              <RemoveCircleOutline color='warning' />
            </IconButton>
          </>
        },
      ],
      isValidate: true,
    },
    {
      elementType: "custom",
      breakpoints: fullWidthPoints,
      NodeElement: () => <IconButton title='Add Flag' size='small' aria-label="delete" onClick={handleAddItems}>
        <AddCircleOutline color='primary' />
      </IconButton>
    },
    {
      elementType: "custom",
      breakpoints: fullWidthPoints,
      NodeElement: () => <Divider><Chip label="Short Time" icon={<DisplaySettings />} /></Divider>
    },
    {
      elementType: "checkbox",
      name: "isShortTimeDeduction",
      label: "Short Time Deduction",
      breakpoints,
      defaultValue: false
    },
    {
      elementType: "inputfield",
      name: "salaryCalculationPerHour",
      isShow: (values) => values.isShortTimeDeduction,
      label: "Salary Calcuation Per Hour",
      inputMode: 'numeric',
      required: (values) => values.isShortTimeDeduction,
      validate: {
        errorMessage: "value is required",
      },
      type: "number",
      inputProps: {
        min: 0,
        max: 16
      },
      breakpoints,
      defaultValue: 8,
    },
  ]

  return (
    <AutoForm formData={formData} ref={formApi} isValidate={true} >

      <Grid item size={{ xs: 12, md: 12 }} textAlign="right">
        <Divider variant='fullWidth' sx={{ mb: 1 }} />
        <Controls.Button sx={{ width: 100 }} onClick={handleSubmit} startIcon={<SaveTwoTone />} text="Save" />
      </Grid>
    </AutoForm>
  )
}
