/* global fetch */

require('isomorphic-fetch')
const XLJS = require('x2js')
const c = require('./constants')
const fs = require('fs')
const util = require('util')
const path = require('path')

const fswrite = util.promisify(fs.writeFile)
const fsappend = util.promisify(fs.appendFile)

const xljs = new XLJS()

const year = 2018
const term = 'S'
const filepath = path.join(__dirname, '/output/', year + term + '.csv')

const getCoursesInDept = async (dept, year, term) => {
  const response = await fetch(c.baseURL + '&' + c.year(year) + '&' + c.term(term) + '&' + 'req=2' + '&' + c.dept(dept) + '&' + 'output=3')
  const xml = await response.text()
  const json = xljs.xml2js(xml)
  const courseObjs = json.courses.course
    .map(({ _key, _title }) => ({ course: _key, description: _title }))
  return courseObjs
}

const getSectionsInCourse = async (dept, course) => {
  const response = await fetch(c.baseURL + '&' + c.year(year) + '&' + c.term(term) + '&' + 'req=4' + '&' + c.dept(dept) + '&' + c.course(course) + '&' + 'output=3')
  const xml = await response.text()
  const json = xljs.xml2js(xml)
  const sections = Array.isArray(json.sections.section) ? json.sections.section : [json.sections.section]
  const sectionsWithWaitListFiltered = sections.filter(section => section._activity !== 'Waiting List')
  const requiredFields = sectionsWithWaitListFiltered
    .map(({ instructors = '', _activity, _credits, _key }) =>
      ({ instructor: instructors.instructor ? instructors.instructor._name : '', activity: _activity, credits: _credits, section: _key }))
  return requiredFields
}

const writeHeader = header => fswrite(filepath, header + '\r\n')
const append = row => fsappend(filepath, row + '\r\n')
const stringify = JSON.stringify

c.departments.forEach(async dept => {
  await writeHeader(c.csvHeaders)
  const courseObjs = await getCoursesInDept(dept, year, term)
  courseObjs.forEach(async ({ course, description }) => {
    const sections = await getSectionsInCourse(dept, course)
    sections.forEach(async ({ instructor, activity, credits, section }) => {
      const stringified = [ year, term, dept, course, section, instructor, credits, activity ]
        .map(x => stringify(x))
      await append(stringified)
    })
  })
})
