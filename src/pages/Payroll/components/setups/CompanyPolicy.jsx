import React, { useEffect, useRef, useState } from 'react'
import { Divider, Chip, InputAdornment, Grid } from '../../../../deps/ui'
import { DisplaySettings, Percent, SaveTwoTone } from '../../../../deps/ui/icons'
import { AutoForm } from '../../../../components/useForm'
import { useAppSelector } from '../../../../store/storehook';
import { useEntitiesQuery, useEntityAction } from '../../../../store/actions/httpactions';
import { API, CalculationType, PercentageOfBasicSalary } from '../../_Service';
import Controls from '../../../../components/controls/Controls';

const breakpoints = { size: { md: 2, sm: 6, xs: 6 } }, fullWidthPoints = { size: { md: 12, sm: 12, xs: 12 } };

const DEFAULT_API = API.PayrollSetup;
export const CompanyPolicy = ({ data }) => {
  const formApi = useRef(null);

  const { addEntity } = useEntityAction();
  const handleSubmit = () => {
    const { getValue, validateFields } = formApi.current;
    const values = getValue();

    if (!validateFields()) return
    const dataToInsert = {
      _id: data._id,
      name: data.name,
      pfPolicy: {
        ...values
      }
    }

    addEntity({ url: DEFAULT_API, data: [dataToInsert] });

  }
  useEffect(() => {
    if (formApi.current && data) {
      const { setFormValue } = formApi.current;
      setFormValue(structuredClone(data.pfPolicy))
    }
  }, [data, formApi])


  const formData = [
    {
      elementType: "custom",
      breakpoints: fullWidthPoints,
      NodeElement: () => <Divider><Chip label="PF Policy" icon={<DisplaySettings />} /></Divider>
    },
    {
      elementType: "checkbox",
      name: "enable",
      label: "Enable",
      title: "For PF Policy",
      breakpoints,
      defaultValue: true
    },
    {
      elementType: "dropdown",
      name: "type",
      label: "Type",
      breakpoints,
      dataId: "id",
      dataName: "title",
      isNone: false,
      defaultValue: PercentageOfBasicSalary,
      options: CalculationType,
      excel: {
        sampleData: "Percentage of Basic Salary"
      }
    },
    {
      elementType: "inputfield",
      name: "employeeShare",
      label: "Employee(s) Share",
      breakpoints,
      inputMode: 'numeric',
      required: true,
      validate: {
        errorMessage: "Employee(s) Share is required",
      },
      type: "number",
      inputProps: {
        min: 0,
        max: 100
      },

      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            <Percent />
          </InputAdornment>
        )
      },
      defaultValue: "",

    },
    {
      elementType: "inputfield",
      name: "employerShare",
      label: "Employer(s) Share",
      inputMode: 'numeric',
      breakpoints,
      required: true,
      validate: {
        errorMessage: "Employer(s) Share is required",
      },
      type: "number",
      inputProps: {
        min: 0,
        max: 100
      },

      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            <Percent />
          </InputAdornment>
        )
      },
      defaultValue: "",

    }
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
