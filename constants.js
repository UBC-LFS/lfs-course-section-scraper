const baseURL = `https://courses.students.ubc.ca/cs/servlets/SRVCourseSchedule?`
const year = year => `sessyr=${year}`
const term = term => `sesscd=${term}`
const dept = deptCode => `dept=${deptCode}`
const course = courseCode => `course=${courseCode}`
const csvHeaders = ['Year', 'Term', 'Dept', 'Course', 'Section', 'Instructor', 'Credits', 'Activity']

module.exports = {
  baseURL,
  year,
  term,
  dept,
  course,
  csvHeaders
}
