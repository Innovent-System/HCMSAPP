import React, { useRef, useState } from 'react'
import { Divider, Chip, IconButton } from '../../../../deps/ui'
import { DisplaySettings, AddCircleOutline, RemoveCircleOutline } from '../../../../deps/ui/icons'
import { AutoForm } from '../../../../components/useForm'
import { useAppSelector } from '../../../../store/storehook';

const breakpoints = { md: 2, sm: 6, xs: 6 }, fullWidthPoints = { md: 12, sm: 12, xs: 12 };
const frequencyType = [{ id: "Once", title: "Once" },
{ id: "EveryOccurance", title: "Every Occurance" }
]
const DefaultFrequency = "EveryOccurance";
export const AutoDeduction = () => {
  const formApi = useRef(null);
  const attendanceFlag = useAppSelector(e => e.appdata.employeeData?.AttendanceFlag)

  const [disabledFlags, setDisabledFlags] = useState(attendanceFlag?.length ? [attendanceFlag[0]._id] : []);
  const flagSetting = useRef([{
    flagId: attendanceFlag.length ? attendanceFlag[0]._id : "",
    count: 1, exemptedCount: 3,
    effectedFrequency: DefaultFrequency,
    deductionDays: 1
  }]).current

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
      // breakpoints: { xs: 6, sm: 6, md: 5 },
      defaultValue: false,
    },
    {
      elementType: "arrayForm",
      name: "flagSetting",
      // sx: listStyle,
      // arrayFormRef: allowanceApi,
      breakpoints: fullWidthPoints,
      defaultValue: flagSetting,
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
          elementType: "custom",
          breakpoints: { xs: 12, lg: 4, md: 4 },
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
    },


  ]

  return (
    <AutoForm formData={formData} ref={formApi} isValidate={true} />
  )
}
