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
  const { contributionPolicy } = useAppSelector(c => c.appdata.payrollData)

  const handleSubmit = () => {
    const { getValue, validateFields } = formApi.current;
    const values = getValue();

    // if (!validateFields()) return

    const dataToInsert = {
      payrollSetupId: data.id,
      employeeContributionPolicyId: values.employeeContributionPolicyId ? values.employeeContributionPolicyId : null
    }

    addEntity({ url: `${DEFAULT_API}/policysetting`, data: dataToInsert });

  }
  useEffect(() => {
    if (formApi.current && data) {
      const { setFormValue } = formApi.current;
      setFormValue({ employeeContributionPolicyId: data.employeeContributionPolicyId });
    }
  }, [data, formApi])


  const formData = [
    {
      elementType: "custom",
      breakpoints: fullWidthPoints,
      NodeElement: () => <Divider><Chip label="Policy" icon={<DisplaySettings />} /></Divider>
    },

    {
      elementType: "dropdown",
      name: "employeeContributionPolicyId",
      label: "Contribution Policy",
      breakpoints,
      dataId: "id",
      dataName: "name",
      defaultValue: null,
      options: contributionPolicy,

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



export const CompanyPolicy = ({ data }) => {

  return (
    <>
      <PFPolicy data={data} />
    </>
  )
}


