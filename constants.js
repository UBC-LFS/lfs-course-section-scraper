const baseURL = `https://courses.students.ubc.ca/cs/servlets/SRVCourseSchedule?`
const year = year => `sessyr=${year}`
const term = term => `sesscd=${term}`
const dept = deptCode => `dept=${deptCode}`
const course = courseCode => `course=${courseCode}`
const csvHeaders = ['Year', 'Term', 'Dept', 'Course', 'Section', 'Instructor', 'Credits', 'Activity']
const csvHeadersWithEnrolment = ['Year', 'Term', 'Dept', 'Course', 'Section', 'Instructor', 'Credits', 'Activity', 'Total Seats Remaining', 'Currently Registered', 'General Seats Remaining', 'Restricted Seats Remaining']
const enrolmentURL = (year, term, dept, course, section) => `https://courses.students.ubc.ca/cs/main?${year}&${term}&pname=subjarea&tname=subjareas&req=5&dept=${dept}&course=${course}&section=${section}`

module.exports = {
  baseURL,
  year,
  term,
  dept,
  course,
  csvHeaders,
  csvHeadersWithEnrolment,
  enrolmentURL
}
