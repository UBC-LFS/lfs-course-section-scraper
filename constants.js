const rootURL = 'https://courses.students.ubc.ca'
const baseURL = `https://courses.students.ubc.ca/cs/servlets/SRVCourseSchedule?`
const year = year => `sessyr=${year}`
const term = term => `sesscd=${term}`
const dept = deptCode => `dept=${deptCode}`
const course = courseCode => `course=${courseCode}`
const csvHeaders = [
  'Year',
  'Term',
  'Dept',
  'Course',
  'Section',
  'Instructor',
  'Credits',
  'Activity',
  'Building'
]
const csvHeadersWithEnrolment = [
  'Year',
  'Term',
  'Dept',
  'Course',
  'Section',
  'Instructor',
  'Credits',
  'Activity',
  'Building',
  'Total Seats Remaining',
  'Currently Registered',
  'General Seats Remaining',
  'Restricted Seats Remaining'
]
const enrolmentURL = (year, term, dept, course, section) =>
  `https://courses.students.ubc.ca/cs/main?${year}&${term}&pname=subjarea&tname=subjareas&req=5&dept=${dept}&course=${course}&section=${section}`
const prompt = [
  {
    type: 'multiselect',
    name: 'depts',
    message: 'What departments are you interested in?',
    choices: [
      { title: 'All of them', value: 'all', selected: true },
      { title: 'APBI', value: 'APBI' },
      { title: 'FNH', value: 'FNH' },
      { title: 'FOOD', value: 'FOOD' },
      { title: 'FRE', value: 'FRE' },
      { title: 'GRS', value: 'GRS' },
      { title: 'HUNU', value: 'HUNU' },
      { title: 'LFS', value: 'LFS' },
      { title: 'LWS', value: 'LWS' },
      { title: 'PLNT', value: 'PLNT' },
      { title: 'SOIL', value: 'SOIL' }
    ],
    hint: `Please use the "space" key to select, and the "return" key to submit. Select as many as you'd like!`
  },
  {
    type: 'number',
    name: 'year',
    message: 'What year are you interested in?'
  },
  {
    type: 'select',
    name: 'term',
    message: 'What term are you interested in?',
    choices: [
      { title: 'Summer', value: 'S' },
      { title: 'Winter', value: 'W' }
    ]
  },
  {
    type: 'select',
    name: 'enrolments',
    message: 'Do you care about enrolment? If you do, be warned that it will take a bit longer to generate this data',
    choices: [
      { title: 'No', value: false },
      { title: 'Yes', value: true }
    ]
  },
  {
    type: 'multiselect',
    name: 'filterSetting',
    message: 'What activities should be filtered out (not included)?',
    choices: [
      { title: 'Waiting List', value: 'Waiting List', selected: true },
      { title: 'Thesis', value: 'Thesis', selected: true },
      { title: 'Work Placement', value: 'Work Placement', selected: true },
      { title: 'Practicum', value: 'Practicum' },
      { title: 'Directed Studies', value: 'Directed Studies' },
      { title: 'Seminar', value: 'Seminar' },
      { title: 'Lecture', value: 'Lecture' },
      { title: 'Web-Oriented Course', value: 'Web-Oriented Course' },
      { title: 'Distance Education', value: 'Distance Education' },
      { title: 'Essay/Report', value: 'Essay/Report' },
      { title: 'Tutorial', value: 'Tutorial' },
      { title: 'Project', value: 'Project' },
      { title: 'Laboratory', value: 'Laboratory' }
    ],
    hint: `Please use the "space" key to select, and the "return" key to submit. Select as many as you'd like!`
  }
]
module.exports = {
  rootURL,
  baseURL,
  year,
  term,
  dept,
  course,
  csvHeaders,
  csvHeadersWithEnrolment,
  enrolmentURL,
  prompt
}
