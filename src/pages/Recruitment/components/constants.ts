// ════════════════════════════════════════════════════════════════════
// HiringBoard/constants.js
// ════════════════════════════════════════════════════════════════════

export const STAGE_COLORS = [
    { bg: '#E6F1FB', text: '#0C447C', mid: '#378ADD' },
    { bg: '#EEEDFE', text: '#3C3489', mid: '#7F77DD' },
    { bg: '#FAEEDA', text: '#633806', mid: '#EF9F27' },
    { bg: '#FAECE7', text: '#712B13', mid: '#D85A30' },
    { bg: '#EAF3DE', text: '#27500A', mid: '#639922' },
    { bg: '#FBEAF0', text: '#72243E', mid: '#D4537E' },
    { bg: '#E1F5EE', text: '#085041', mid: '#1D9E75' },
];

export const emptyStage = (order, colorIdx = 0) => ({
    order,
    name: '',
    type: 'Manual',
    color: STAGE_COLORS[colorIdx % STAGE_COLORS.length].mid,
    minScore: 0,
    fkDefaultAssigneeId: null,
    isLocked:false
});

export const getDefaultStages = () => [
    {
        order: 1, name: 'Applied', type: 'Auto', minScore: 0,
        color: STAGE_COLORS[0].mid, fkDefaultAssigneeId: null, isLocked: true,
    },
    {
        order: 2, name: 'Screening', type: 'Auto', minScore: 70,
        color: STAGE_COLORS[1].mid, fkDefaultAssigneeId: null, isLocked: true,
    },
];

export const getInitials = (name = '') =>
    name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('');

export const scoreColor = (score) => {
    if (score >= 70) return '#1D9E75';
    if (score >= 50) return '#EF9F27';
    return '#D85A30';
};

// ════════════════════════════════════════════════════════════════════
// DUMMY DATA — remove when wiring up real API
// ════════════════════════════════════════════════════════════════════

export const DUMMY_JOBPOSTS = [
    { _id: 'jp1', title: 'Senior Developer', department: 'Engineering' },
    { _id: 'jp2', title: 'Engineering Lead', department: 'Engineering' },
    { _id: 'jp3', title: 'Sales Executive', department: 'Sales' },
];

export const DUMMY_BOARDS = {
    jp1: {
        isOverride: false,
        template: {
            name: 'Engineering pipeline',
            stages: [
                { _id: 's1', order: 1, name: 'Applied',   type: 'Auto',   minScore: 0 },
                { _id: 's2', order: 2, name: 'Screening', type: 'Auto',   minScore: 70 },
                { _id: 's3', order: 3, name: 'Technical', type: 'Manual', minScore: 0 },
                { _id: 's4', order: 4, name: 'HR Round',  type: 'Manual', minScore: 0 },
                { _id: 's5', order: 5, name: 'Offer',     type: 'Manual', minScore: 0 },
            ],
        },
        columns: {
            s1: [
                mkCard('app1', 'Ali', 'Khan', 45, 'Portal', null),
                mkCard('app2', 'Bilal', 'Malik', 38, 'HR', null),
                mkCard('app3', 'Sana', 'Raza', 55, 'Portal', null),
            ],
            s2: [
                mkCard('app4', 'Hassan', 'Qureshi', 82, 'Portal', null),
                mkCard('app5', 'Fatima', 'Ahmad', 76, 'Portal', null),
            ],
            s3: [
                mkCard('app6', 'Usman', 'Ali', 89, 'Portal', 'Ali Hassan'),
                mkCard('app7', 'Zara', 'Khan', 74, 'Portal', null),
            ],
            s4: [
                mkCard('app8', 'Maham', 'Rizvi', 91, 'Referral', 'Sara Khan'),
            ],
            s5: [
                mkCard('app9', 'Imran', 'Omar', 95, 'Portal', 'Sara Khan'),
            ],
        },
    },
    jp2: {
        isOverride: true,
        template: {
            name: 'Lead role pipeline',
            stages: [
                { _id: 't1', order: 1, name: 'Applied',      type: 'Auto',   minScore: 0 },
                { _id: 't2', order: 2, name: 'Screening',    type: 'Auto',   minScore: 75 },
                { _id: 't3', order: 3, name: 'Tech Round 1', type: 'Manual', minScore: 0 },
                { _id: 't4', order: 4, name: 'Tech Round 2', type: 'Manual', minScore: 0 },
                { _id: 't5', order: 5, name: 'Panel',        type: 'Manual', minScore: 0 },
                { _id: 't6', order: 6, name: 'Offer',        type: 'Manual', minScore: 0 },
            ],
        },
        columns: {
            t1: [mkCard('app10', 'Nadia', 'Sheikh', 60, 'Portal', null)],
            t2: [mkCard('app11', 'Omar', 'Farooq', 81, 'Portal', null)],
            t3: [mkCard('app12', 'Kamran', 'Iqbal', 88, 'Referral', 'Ali Hassan')],
            t4: [],
            t5: [],
            t6: [],
        },
    },
    jp3: {
        isOverride: false,
        template: {
            name: 'Sales pipeline',
            stages: [
                { _id: 'x1', order: 1, name: 'Applied',   type: 'Auto',   minScore: 0 },
                { _id: 'x2', order: 2, name: 'Screening', type: 'Auto',   minScore: 60 },
                { _id: 'x3', order: 3, name: 'Interview', type: 'Manual', minScore: 0 },
                { _id: 'x4', order: 4, name: 'Offer',     type: 'Manual', minScore: 0 },
            ],
        },
        columns: {
            x1: [mkCard('app13', 'Rida', 'Naveed', 50, 'Portal', null), mkCard('app14', 'Talha', 'Aziz', 40, 'HR', null)],
            x2: [mkCard('app15', 'Areeba', 'Saleem', 68, 'Portal', null)],
            x3: [mkCard('app16', 'Junaid', 'Latif', 77, 'Referral', 'Sara Khan')],
            x4: [],
        },
    },
};

function mkCard(appId, firstName, lastName, score, source, assigneeName) {
    return {
        application: { _id: appId, jobPost: { title: 'Senior Developer' } },
        candidate: { firstName, lastName },
        score,
        source,
        assignedTo: assigneeName ? { _id: assigneeName.replace(' ', '_').toLowerCase(), fullName: assigneeName } : null,
    };
}

export const DUMMY_EMPLOYEES = [
    { _id: 'ali_hassan', fullName: 'Ali Hassan' },
    { _id: 'sara_khan',  fullName: 'Sara Khan' },
    { _id: 'ahmed_raza', fullName: 'Ahmed Raza' },
    { _id: 'maham_rizvi',fullName: 'Maham Rizvi' },
];


// ════════════════════════════════════════════════════════════════════
// JobPortal
// ════════════════════════════════════════════════════════════════════

export const TYPE_COLORS = {
    'Full-time':  { bg: '#E1F5EE', color: '#085041' },
    'Part-time':  { bg: '#E6F1FB', color: '#0C447C' },
    'Contract':   { bg: '#FAEEDA', color: '#633806' },
    'Internship': { bg: '#EEEDFE', color: '#26215C' },
};

export const DUMMY_COMPANY = {
    name:        'HCMS Technologies',
    initials:    'H',
    location:    'Karachi, Pakistan',
    website:     'hcms.com.pk',
    about:       'We build modern HR software for Pakistani enterprises. Join a growing team of engineers, analysts and sales professionals working to transform how companies manage their people.',
    employeeCount: 150,
};

export const DUMMY_JOBS = [
    {
        _id: 'jp1', title: 'Senior Developer', fkDepartmentId: { departmentName: 'Engineering' },
        employmentType: 'Full-time', closingDate: '2024-03-30',
        description: 'Build and maintain our HCMS platform. Work closely with HR teams to deliver robust, scalable features that serve thousands of users.',
        skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
        experience: '3-5 years', salary: { min: 150000, max: 250000 },
        numberOfPositions: 2, isUrgent: true, postedDaysAgo: 2,
        fkCityId: { name: 'Karachi' },
    },
    {
        _id: 'jp2', title: 'Engineering Lead', fkDepartmentId: { departmentName: 'Engineering' },
        employmentType: 'Full-time', closingDate: '2024-04-15',
        description: 'Lead a team of 5 engineers. Own architecture decisions, mentor juniors, and drive technical excellence across the product.',
        skills: ['System Design', 'React', 'Bun', 'Team Leadership'],
        experience: '6+ years', salary: { min: 300000, max: 400000 },
        numberOfPositions: 1, isUrgent: true, postedDaysAgo: 5,
        fkCityId: { name: 'Karachi / Remote' },
    },
    {
        _id: 'jp3', title: 'Sales Executive', fkDepartmentId: { departmentName: 'Sales' },
        employmentType: 'Full-time', closingDate: '2024-04-01',
        description: 'Drive new business for our HR software. Build lasting relationships with enterprise clients across Pakistan.',
        skills: ['B2B Sales', 'CRM', 'Negotiation'],
        experience: '2-4 years', salary: { min: 80000, max: 120000 },
        numberOfPositions: 3, isUrgent: false, postedDaysAgo: 7,
        fkCityId: { name: 'Lahore' },
    },
    {
        _id: 'jp4', title: 'HR Business Partner', fkDepartmentId: { departmentName: 'HR' },
        employmentType: 'Full-time', closingDate: '2024-03-25',
        description: 'Partner with department heads to build people strategies. Manage recruitment, retention, and culture initiatives.',
        skills: ['HRIS', 'Talent Acquisition', 'Labour Law'],
        experience: '3+ years', salary: { min: 100000, max: 150000 },
        numberOfPositions: 1, isUrgent: false, postedDaysAgo: 3,
        fkCityId: { name: 'Karachi' },
    },
    {
        _id: 'jp5', title: 'Frontend Intern', fkDepartmentId: { departmentName: 'Engineering' },
        employmentType: 'Internship', closingDate: '2024-03-20',
        description: '3-month paid internship. Work on real production features with mentorship from senior engineers.',
        skills: ['React', 'JavaScript', 'CSS'],
        experience: '0-1 year', salary: { min: 25000, max: 35000 },
        numberOfPositions: 2, isUrgent: false, postedDaysAgo: 0,
        fkCityId: { name: 'Karachi' },
    },
    {
        _id: 'jp6', title: 'Finance Analyst', fkDepartmentId: { departmentName: 'Finance' },
        employmentType: 'Contract', closingDate: '2024-04-10',
        description: '6-month contract supporting our finance team through expansion. Fully remote arrangement.',
        skills: ['Excel', 'Financial Modelling', 'ERP'],
        experience: '2-3 years', salary: { min: 70000, max: 90000 },
        numberOfPositions: 1, isUrgent: false, postedDaysAgo: 4,
        fkCityId: { name: 'Remote' },
    },
];


export const postedLabel = (createdAt) => {
    const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return `${diff} days ago`;
};

export const salaryLabel = (salary) =>
    `PKR ${(salary.min / 1000).toFixed(0)}k–${(salary.max / 1000).toFixed(0)}k`;