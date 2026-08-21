import React, { useEffect, useRef, useState } from 'react'
import { Divider, Chip, IconButton, Grid, Link, Stack } from '../../../../deps/ui'
import { DisplaySettings, AddCircleOutline, RemoveCircleOutline, SaveTwoTone } from '../../../../deps/ui/icons'
import { AutoForm } from '../../../../components/useForm'
import { useAppSelector } from '../../../../store/storehook';
import { useEntitiesQuery, useEntityAction, useLazySingleQuery } from '../../../../store/actions/httpactions';
import { API } from '../../_Service';
import Controls from '../../../../components/controls/Controls';

const breakpoints = { size: { md: 2, sm: 6, xs: 6 } }, fullWidthPoints = { size: { md: 12, sm: 12, xs: 12 } };

const DEFAULT_API = API.PayrollSetup;
export const TaxRule = ({ data }) => {
  const formApi = useRef(null);

  const [getTaxSlab] = useLazySingleQuery();
  const _taxRuleDetail = useRef([{
    incomeFrom: 0, incomeTo: 1,
    taxPercentage: 0,
    exemptedAmount: 0,
    additionalAmount: 0
  }]).current;

  const { addEntity } = useEntityAction();
  const handleSubmit = () => {
    const { getValue, validateFields } = formApi.current;
    const values = getValue();

    if (!validateFields()) return;
    var taxRuleId = data?.taxRule ? data?.taxRule.id : 0;
    const { taxRuleDetail } = values;
    const dataToInsert = {
      id: taxRuleId,
      payrollSetupId: data.id,
      details: taxRuleDetail
    }

    addEntity({ url: `${DEFAULT_API}/TaxRuleSetting`, data: dataToInsert });

  }
  useEffect(() => {
    if (formApi.current && data) {
      const { setFormValue } = formApi.current;
      setFormValue({ taxRuleDetail: data?.taxRule?.details ?? [..._taxRuleDetail] });
    }
  }, [data, formApi])

  const handleAddItems = () => {
    const { getValue, setFormValue } = formApi.current;

    // if (attendanceFlag.length === getValue().flagSetting.length) return;
    // const newId = attendanceFlag.find(c => !disabledFlags.includes(c.id))?.id;
    setFormValue({
      taxRuleDetail: [...getValue().taxRuleDetail, {
        incomeFrom: 0, incomeTo: 1,
        taxPercentage: 0,
        exemptedAmount: 0,
        additionalAmount: 0
      }]
    })

  }

  const handleRemoveItems = (_index) => {
    const { getValue, setFormValue } = formApi.current;
    const { taxRuleDetail } = getValue();
    if (taxRuleDetail.length === 1) return
    setFormValue({ taxRuleDetail: taxRuleDetail.toSpliced(_index, 1) })
  }

  const formData = [
    {
      elementType: "custom",
      breakpoints: fullWidthPoints,
      NodeElement: () => <Divider><Chip label="Tax Rules" icon={<DisplaySettings />} /></Divider>
    },
    {
      elementType: "arrayForm",
      name: "taxRuleDetail",
      // sx: listStyle,
      // arrayFormRef: allowanceApi,
      breakpoints: fullWidthPoints,
      defaultValue: _taxRuleDetail,
      formData: [
        {
          elementType: "inputfield",
          name: "incomeFrom",
          label: "Income From",
          inputMode: 'numeric',
          type: "number",
          validate: {
            errorMessage: "Value is required",
          },
          inputProps: {
            min: 0,
          },
          breakpoints,
          defaultValue: 0,
        },
        {
          elementType: "inputfield",
          name: "incomeTo",
          label: "Income To",
          inputMode: 'numeric',
          type: "number",
          validate: {
            errorMessage: "Value is required",
          },
          inputProps: {
            min: 0,
          },
          breakpoints,
          defaultValue: 0,
        },
        {
          elementType: "inputfield",
          name: "taxPercentage",
          label: "Rate %",
          inputMode: 'numeric',
          type: "number",
          validate: {
            errorMessage: "Value is required",
          },
          inputProps: {
            min: 0,
          },
          breakpoints,
          defaultValue: 0,
        },
        {
          elementType: "inputfield",
          name: "exemptedAmount",
          label: "Exempted Amount",
          inputMode: 'numeric',
          type: "number",
          validate: {
            errorMessage: "Value is required",
          },
          inputProps: {
            min: 0,
          },
          breakpoints,
          defaultValue: 0,
        },
        {
          elementType: "inputfield",
          name: "additionalAmount",
          label: "Additional Amount",
          inputMode: 'numeric',
          type: "number",
          validate: {
            errorMessage: "Value is required",
          },
          inputProps: {
            min: 0,
          },
          breakpoints,
          defaultValue: 0,
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
      NodeElement: () => <IconButton title='Add Tax' size='small' aria-label="delete" onClick={handleAddItems}>
        <AddCircleOutline color='primary' />
      </IconButton>
    }
  ]

  const handleTaxSlab = () => {
    getTaxSlab({ url: `${DEFAULT_API}/taxslabs` }).then(e => {
      const { setFormValue } = formApi.current;
      if (e.isSuccess) {
        setFormValue({
          taxRuleDetail: e.data.result
        })
      }

    });
  }

  return (<Stack >
    <Link sx={{ textAlign: "right" }} fontSize="small" onClick={handleTaxSlab} >Update Slabs</Link>
    <AutoForm formData={formData} ref={formApi} isValidate={true} >

      <Grid item size={{ xs: 12, md: 12 }} textAlign="right">
        <Divider variant='fullWidth' sx={{ mb: 1 }} />
        {/* <Controls.Button sx={{ width: 200 }} onClick={handleTaxSlab} startIcon={<SaveTwoTone />} text="Update Slab" /> */}
        <Controls.Button sx={{ width: 100 }} onClick={handleSubmit} startIcon={<SaveTwoTone />} text="Save" />
      </Grid>
    </AutoForm>
  </Stack>

  )
}
