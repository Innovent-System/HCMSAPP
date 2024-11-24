import React, { useEffect, useRef, useState } from 'react'
import { Divider, Chip, IconButton, Grid } from '../../../../deps/ui'
import { DisplaySettings, AddCircleOutline, RemoveCircleOutline, SaveTwoTone } from '../../../../deps/ui/icons'
import { AutoForm } from '../../../../components/useForm'
import { useAppSelector } from '../../../../store/storehook';
import { useEntitiesQuery, useEntityAction, useLazyPostQuery } from '../../../../store/actions/httpactions';
import { API } from '../../_Service';
import Controls from '../../../../components/controls/Controls';

const breakpoints = { md: 2, sm: 6, xs: 6 }, fullWidthPoints = { md: 12, sm: 12, xs: 12 };
const frequencyType = [{ id: "Once", title: "Once" },
{ id: "EveryOccurance", title: "Every Occurance" }
]
const DefaultFrequency = "EveryOccurance";
const DEFAULT_API = API.PayrollSetup;
export const AutoDeduction = ({ data }) => {
  const formApi = useRef(null);
  const attendanceFlag = useAppSelector(e => e.appdata.employeeData?.AttendanceFlag)
  const { data: leaveTypes, isLoading, refetch, totalRecord } = useEntitiesQuery({
    url:  `${API.LeaveType}/get`,
    data: {
      limit: 100,
      page: 1,
      searchParams: {}
    }
  }, { selectFromResult: ({ data, isLoading }) => ({ data: data?.entityData, totalRecord: data?.totalRecord, isLoading }) });

  const [disabledFlags, setDisabledFlags] = useState(attendanceFlag?.length ? [attendanceFlag[0]._id] : []);
  const _flagSetting = useRef([{
    flagId: attendanceFlag.length ? attendanceFlag[0]._id : "",
    count: 1, exemptedCount: 3,
    effectedFrequency: DefaultFrequency,
    deductionDays: 1
  }]).current;
  
  const { addEntity } = useEntityAction();
  const handleSubmit = () => {
    const { getValue, validateFields } = formApi.current;
    const values = getValue();
    if (!values?.isLeaveDeductionFirst) {
      values.leaveDeductionOrder = []
    }
    if (!validateFields()) return
    const dataToInsert = {
      _id: data._id,
      name: data.name,
      autoDeduction: {
        ...values,
        flagSetting: values.flagSetting.map(e => ({ ...e, flagCode: attendanceFlag.find(a => a._id === e.flagId).flagCode }))
      }
    }

    addEntity({ url: DEFAULT_API, data: [dataToInsert] });

  }
  useEffect(() => {
    if (formApi.current && data) {
      const { setFormValue } = formApi.current;
      setFormValue(structuredClone(data.autoDeduction))
    }
  }, [data, formApi])

  const handleAddItems = () => {
    const { getValue, setFormValue } = formApi.current;

    if (attendanceFlag.length === getValue().flagSetting.length) return;
    const newId = attendanceFlag.find(c => !disabledFlags.includes(c._id))?._id;
    setFormValue({
      flagSetting: [...getValue().flagSetting, {
        flagId: newId ?? "",
        count: 1, exemptedCount: 3,
        effectedFrequency: DefaultFrequency,
        deductionDays: 1
      }]
    })
    disabledFlags.push(newId);
    setDisabledFlags([...disabledFlags])

  }

  const handleRemoveItems = (_index) => {
    if (disabledFlags.length === 1) return
    const { getValue, setFormValue } = formApi.current;
    const { flagSetting } = getValue();
    disabledFlags.splice(disabledFlags.indexOf(flagSetting[_index].flagId), 1);
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
      label: "Auto Dedution(s) For Attendance Flag",
      breakpoints: { xs: 6, sm: 6, md: 4 },
      defaultValue: true
    },
    {
      elementType: "checkbox",
      name: "isLeaveDeductionFirst",
      label: "Is Leave Deduction First",
      breakpoints: { xs: 6, sm: 6, md: 4 },
      defaultValue: true
    },
    {
      elementType: "dropdown",
      name: "leaveDeductionOrder",
      label: "Leave Type",
      breakpoints: { xs: 6, sm: 6, md: 2 },
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
      dataId: "_id",
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
          name: "flagId",
          label: "Title",
          breakpoints,
          onChange: (_allowanc, _ind) => {
            
            const { getValue } = formApi.current;
            setDisabledFlags(getValue().flagSetting.map(c => c.flagId))
          },
          disableitems: disabledFlags,
          dataId: "_id",
          dataName: "name",
          isNone: false,
          // defaultValue: AllowancesTitle.length ? AllowancesTitle[0]._id : "",
          options: attendanceFlag,
        },
        {
          elementType: "inputfield",
          name: "count",
          label: "Flag Count",
          inputMode: 'numeric',
          type: "number",
          validate: {
            errorMessage: "Flag Count is required",
          },
          inputProps: {
            min: 0,
          },
          breakpoints,
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
          breakpoints,
          defaultValue: "",
        },
        {
          elementType: "dropdown",
          name: "effectedFrequency",
          label: "Frequency",
          breakpoints,
          dataId: "id",
          dataName: "title",
          isNone: false,
          defaultValue: DefaultFrequency,
          options: frequencyType,
        },
        {
          elementType: "inputfield",
          name: "deductionDays",
          label: "Deduction Days",
          inputMode: 'numeric',
          type: "number",
          validate: {
            errorMessage: "Dedcution Day is required",
          },
          inputProps: {
            min: 0,
          },
          breakpoints,
          defaultValue: "",
        },
        {
          elementType: "custom",
          breakpoints: { xs: 12, lg: 2, md: 2 },
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
      NodeElement: () => <IconButton title='Add Allowance' size='small' aria-label="delete" onClick={handleAddItems}>
        <AddCircleOutline color='primary' />
      </IconButton>
    }
  ]

  return (
    <AutoForm formData={formData} ref={formApi} isValidate={true} >

      <Grid item sm={12} md={12} lg={12} textAlign="right">
        <Divider variant='fullWidth' sx={{ mb: 1 }} />
        <Controls.Button sx={{ width: 100 }} onClick={handleSubmit} startIcon={<SaveTwoTone />} text="Save" />
      </Grid>
    </AutoForm>
  )
}
