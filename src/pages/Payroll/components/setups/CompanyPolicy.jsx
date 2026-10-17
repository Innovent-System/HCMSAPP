import React, { useEffect, useRef, useState } from 'react'
import { Divider, Chip, InputAdornment, Grid } from '../../../../deps/ui'
import { DisplaySettings, Percent, SaveTwoTone } from '../../../../deps/ui/icons'
import { AutoForm } from '../../../../components/useForm'
import { useAppSelector } from '../../../../store/storehook';
import { useEntitiesQuery, useEntityAction } from '../../../../store/actions/httpactions';
import { API, CalculationType, PercentageOfBasicSalary } from '../../_Service';
import Controls from '../../../../components/controls/Controls';

const breakpoints = { size: { md: 3, sm: 6, xs: 6 } }, fullWidthPoints = { size: { md: 12, sm: 12, xs: 12 } };

const DEFAULT_API = API.PayrollSetup;
const PFPolicy = ({ data }) => {
  const formApi = useRef(null);

  const { addEntity } = useEntityAction();
  const handleSubmit = () => {
    const { getValue, validateFields } = formApi.current;
    const values = getValue();

    if (!validateFields()) return
    var pfPolicyId = data?.pfPolicy ? data?.pfPolicy.id : 0;
    const dataToInsert = {
      id: pfPolicyId,
      payrollSetupId: data.id,
      ...values
    }

    addEntity({ url: `${DEFAULT_API}/PFPolicySetting`, data: dataToInsert });

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
      name: "applyPfPolicy",
      label: "Enable PF Policy",
      title: "For PF Policy",
      breakpoints: fullWidthPoints,
      defaultValue: false
    },
    {
      elementType: "checkbox",
      name: "isProRata",
      label: "ProRata Base",
      title: "For PF Policy",
      breakpoints,
      defaultValue: false
    },
    {
      elementType: "dropdown",
      name: "pfCalculationType",
      label: "Calculation Type",
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
      elementType: "clearfix",
      breakpoints: fullWidthPoints,
    },
    {
      elementType: "inputfield",
      name: "employeeShare",
      label: "Employee(s) Share",
      breakpoints,
      inputMode: 'numeric',
      required: (value) => value.applyPfPolicy,
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
      required: (value) => value.applyPfPolicy,
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
        {/* <Divider variant='fullWidth' sx={{ mb: 1 }} /> */}
        <Controls.Button sx={{ width: 100 }} onClick={handleSubmit} startIcon={<SaveTwoTone />} text="Save" />
      </Grid>
    </AutoForm>
  )
}

const SocialInsurancePolicy = ({ data }) => {
  const formApi = useRef(null);

  const { addEntity } = useEntityAction();
  const handleSubmit = () => {
    const { getValue, validateFields } = formApi.current;
    const values = getValue();

    if (!validateFields()) return
    var policyId = data?.socialPolicy ? data?.socialPolicy.id : 0;
    const dataToInsert = {
      id: policyId,
      payrollSetupId: data.id,
      ...values
    }

    addEntity({ url: `${DEFAULT_API}/SocialInsurance`, data: dataToInsert });

  }
  useEffect(() => {
    if (formApi.current && data) {
      const { setFormValue } = formApi.current;
      setFormValue(structuredClone(data.socialPolicy))
    }
  }, [data, formApi])


  const formData = [
    {
      elementType: "custom",
      breakpoints: fullWidthPoints,
      NodeElement: () => <Divider><Chip label="Social Insurance Policy" icon={<DisplaySettings />} /></Divider>
    },
    {
      elementType: "checkbox",
      name: "enable",
      label: "Enable Social Insurance Policy",
      title: "For SIP Policy",
      breakpoints: fullWidthPoints,
      defaultValue: false
    },
    {
      elementType: "checkbox",
      name: "isProRata",
      label: "ProRata Base",
      title: "For SIP Policy",
      breakpoints,
      defaultValue: false
    },
    {
      elementType: "clearfix",
      breakpoints: fullWidthPoints,
    },
    {
      elementType: "inputfield",
      name: "employeeShare",
      label: "Employee(s) Share",
      breakpoints,
      inputMode: 'numeric',
      required: (value) => value.enable,
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
      required: (value) => value.enable,
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

    },
    {
      elementType: "clearfix",
      breakpoints: fullWidthPoints,
    },
    {
      elementType: "inputfield",
      name: "maxCapAmount",
      label: "Maximum Cap Amount",
      breakpoints,
      inputMode: 'numeric',
      type: "number",
      inputProps: {
        min: 0,
      },
      defaultValue: "",
    },
    {
      elementType: "inputfield",
      name: "minCapAmount",
      label: "Minimum Cap Amount",
      inputMode: 'numeric',
      breakpoints,
      type: "number",
      inputProps: {
        min: 0,
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

export const CompanyPolicy = ({ data }) => {

  return (
    <>
      <PFPolicy data={data} />
      <SocialInsurancePolicy data={data} />
    </>
  )
}


