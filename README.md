# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

```json```
 const formData = [
    {
      Component: Collapse,
      in: activeStep === 0,
      style: { width: 'inherit' },
      _children: [
        {
          elementType: "uploadavatar",
          name: "employeeImage",
          breakpoints: { md: 12, sm: 12, xs: 12 },
          defaultValue: null
        },
        {
          elementType: "inputfield",
          name: "emplyeeRefNo",
          label: "Employee Code",
          required: true,
          type: 'number',
          validate: {
            errorMessage: "Employee Ref is required",
          },
          defaultValue: ""
        },
        {
          elementType: "inputfield",
          name: "punchCode",
          label: "Punch Code",
          required: true,
          type: 'number',
          validate: {
            errorMessage: "Punch Code is required"
          },
          defaultValue: ""
        },
        {
          elementType: "clearfix",
          breakpoints: { md: 12, sm: 12, xs: 12 }
        },
        {
          elementType: "inputfield",
          name: "firstName",
          label: "First Name",
          validate: {
            errorMessage: "First Name is required",
          },
          defaultValue: ""
        },
        {
          elementType: "inputfield",
          name: "lastName",
          label: "Last Name",
          required: true,
          validate: {
            errorMessage: "Last Name is required",
            type: "string"
          },
          defaultValue: ""
        },
        {
          elementType: "inputfield",
          name: "email",
          label: "Email",
          required: (value) => value["isAllowManualAttendance"],
          type: "email",
          validate: {
            errorMessage: "Email is required",
            validate: (val) => /$^|.+@.+..+/.test(val)
          },
          defaultValue: ""
        },
        {
          elementType: "inputfield",
          name: "mobileNumber",
          label: "Mobile No",
          validate: {
            errorMessage: "Mobile No is required",
          },
          defaultValue: ""
        },
        {
          elementType: "checkbox",
          name: "isAllowManualAttendance",
          label: "Manual Attendance",
          defaultValue: false,
        },
        {
          elementType: "dropdown",
          name: "templateId",
          label: "User Template",
          disabled: (value) => value["isAllowManualAttendance"] === false,
          defaultValue: 1,
          options: [{
            id: 0, title: "Manager"
          },
          { id: 1, title: "Hr Manager" },
          { id: 2, title: "SubOrdinates" }
          ]
        },
        {
          elementType: "clearfix",
          breakpoints: { md: 12, sm: 12, xs: 12 }
        },
        {
          elementType: "dropdown",
          name: "maritalstatus",
          label: "Marital Status",
          defaultValue: 2,
          options: [{
            id: 0, title: "Single"
          },
          { id: 1, title: "Married" },
          { id: 2, title: "Widowed" },
          { id: 3, title: "Boxorced" }
          ]
        },
        {
          elementType: "dropdown",
          name: "gender",
          label: "Gender",
          defaultValue: 1,
          options: [{
            id: 1, title: "Male"
          },
          { id: 2, title: "Female" },
          { id: 3, title: "Others" }
          ]
        },
        {
          elementType: "dropdown",
          name: "religion",
          label: "Religion",
          defaultValue: 1,
          options: [{
            id: 1, title: "Islam"
          },
          { id: 2, title: "Hindu" },
          { id: 3, title: "Christain" },
          { id: 4, title: "Others" }
          ]
        },
        {
          elementType: "datetimepicker",
          name: "dateofBirth",
          label: "D.O.B",
          defaultValue: null
        }
      ]
    },
    {
      Component: Collapse,
      in: activeStep === 1,
      style: { width: 'inherit' },
      _children: [
        {
          elementType: "ad_dropdown",
          name: "fkCompanyId",
          label: "Country",
          required: true,
          validate: {
            errorMessage: "Company is required",
          },
          dataName: 'name',
          options: countries,
          onChange: (data) => setFilter(data, filterType.COUNTRY, "id"),
          defaultValue: countries?.length ? countries[0] : null
        },
        {
          elementType: "ad_dropdown",
          name: "fkStateId",
          label: "State",
          required: true,
          dataName: "name",
          validate: {
            errorMessage: "State is required",
          },
          options: states,
          onChange: (data) => setFilter(data, filterType.STATE, "id"),
          defaultValue: null
        },
        {
          elementType: "ad_dropdown",
          name: "fkCityId",
          label: "City",
          required: true,
          dataName: "name",
          validate: {
            errorMessage: "City is required",
          },
          options: cities,
          defaultValue: null
        },
        {
          elementType: "ad_dropdown",
          name: "fkAreaId",
          label: "Area",
          required: true,
          dataName: "name",
          validate: {
            errorMessage: "Area is required",
          },
          options: [{
            id: 10111, name: "Malir"
          },
          { id: 11222, name: "Johar" },
          { id: 12333, name: "NorthKarachi" },
          { id: 13444, name: "RashidMinhas" }
          ],
          defaultValue: null
        },
        {
          elementType: "ad_dropdown",
          name: "fkEmployeeGroupId",
          label: "Group",
          required: true,
          dataName: "name",
          validate: {
            errorMessage: "City is required",
          },
          options: [{
            id: 21555, name: "Malir"
          },
          { id: 22666, name: "Johar" },
          { id: 23777, name: "NorthKarachi" },
          { id: 24888, name: "RashidMinhas" }
          ],
          defaultValue: null
        },
        {
          elementType: "ad_dropdown",
          name: "fkDepartmentId",
          label: "Department",
          required: true,
          dataName: "name",
          modal: {
            Component: <AddDepartmentModal />,
          },
          validate: {
            errorMessage: "Department is required",
          },
          options: [{
            id: 31999, name: "IT"
          },
          { id: 321010, name: "Development" },
          { id: 33321, name: "Admin" },
          { id: 348745, name: "Electric" }
          ],
          defaultValue: null
        },
        {
          elementType: "ad_dropdown",
          name: "fkDesignationId",
          label: "Designation",
          dataName: "name",
          options: [{
            id: 41225, name: "Software Engineer"
          },
          { id: 42654, name: "Team Lead" },
          { id: 43789, name: "IT Officer" },
          { id: 44158, name: "CEO" }
          ],
          defaultValue: null
        },
        // {
        //   elementType: "inputfield",
        //   name: "address",
        //   label: "Address",
        //   multiline:true,
        //   defaultValue: ""
        // },
        {
          elementType: "datetimepicker",
          name: "confirmationDate",
          label: "Confrimation Date",
          defaultValue: null
        },
        {
          elementType: "datetimepicker",
          name: "resignationDate",
          label: "Resign Date",
          defaultValue: null
        }
      ]
    },
  ];