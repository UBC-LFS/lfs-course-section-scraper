const departments = ['APBI']
// const departments = ['AANB', 'AGEC', 'ANSC', 'APBI', 'FNH', 'FOOD', 'FRE', 'GRS', 'HUNU', 'LFS', 'LWS', 'PLNT', 'SOIL']
const baseURL = `https://courses.students.ubc.ca/cs/servlets/SRVCourseSchedule?`
const year = year => `sessyr=${year}`
const term = term => `sesscd=${term}`
const dept = deptCode => `dept=${deptCode}`
const course = courseCode => `course=${courseCode}`
const csvHeaders = ['Year', 'Term', 'Dept', 'Course', 'Section', 'Instructor', 'Credits', 'Activity']

module.exports = {
  departments,
  baseURL,
  year,
  term,
  dept,
  course,
  csvHeaders
}
