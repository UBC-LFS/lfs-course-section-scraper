/* global fetch */

require('isomorphic-fetch')
const request = require('request-promise')
const cheerio = require('cheerio')
const XLJS = require('x2js')
const c = require('./constants')
const fs = require('fs')
const util = require('util')
const path = require('path')

const xljs = new XLJS()

const year = 2018
const term = 'S'
const departments = ['APBI', 'FNH', 'FOOD', 'FRE', 'GRS', 'HUNU', 'LFS', 'LWS', 'PLNT', 'SOIL']
const enrolments = false

const fswrite = util.promisify(fs.writeFile)
const fsappend = util.promisify(fs.appendFile)

const filepath = path.join(__dirname, '/output/', year + term + '.csv')

const writeHeader = header => fswrite(filepath, header + '\r\n')
const append = row => fsappend(filepath, row + '\r\n')

const getCoursesInDept = async (dept, year, term) => {
  const response = await fetch(c.baseURL + '&' + c.year(year) + '&' + c.term(term) + '&' + 'req=2' + '&' + c.dept(dept) + '&' + 'output=3')
  const xml = await response.text()
  const json = xljs.xml2js(xml)
  const course = Array.isArray(json.courses.course) ? json.courses.course : [json.courses.course]
  const courseObjs = course.map(({ _key, _title }) => ({ course: _key, description: _title }))
  return courseObjs
}

const getSectionsInCourse = async (dept, course) => {
  const response = await fetch(c.baseURL + '&' + c.year(year) + '&' + c.term(term) + '&' + 'req=4' + '&' + c.dept(dept) + '&' + c.course(course) + '&' + 'output=3')
  const xml = await response.text()
  const json = xljs.xml2js(xml)
  const sections = Array.isArray(json.sections.section) ? json.sections.section : [json.sections.section]
  const sectionsWithWaitListFiltered = sections
    .filter(section => section._activity !== 'Waiting List')
    .filter(section => section._activity !== 'Thesis')
    .filter(section => section._activity !== 'Work Placement')
  const requiredFields = sectionsWithWaitListFiltered
    .map(({ instructors = '', _activity, _credits, _key }) =>
      ({ instructor: instructors.instructor ? instructors.instructor._name : '', activity: _activity, credits: _credits, section: _key }))
  return requiredFields
}

const getEnrolments = async (dept, course, section) => {
  const url = c.enrolmentURL(year, term, dept, course, section)
  const options = {
    uri: url,
    transform: body => cheerio.load(body)
  }
  const $ = await request(options)
  const scrape = term => $('td').filter(function () {
    return $(this).text().trim() === term
  }).next().text()
  return {
    totalSeatsRemaining: scrape('Total Seats Remaining:'),
    currentlyRegistered: scrape('Currently Registered:'),
    generalSeatsRemaining: scrape('General Seats Remaining:'),
    restrictedSeatsRemaining: scrape('Restricted Seats Remaining*:')
  }
}

departments.forEach(async dept => {
  enrolments ? await writeHeader(c.csvHeadersWithEnrolment) : await writeHeader(c.csvHeaders)
  const courseObjs = await getCoursesInDept(dept, year, term)
  courseObjs.forEach(async ({ course, description }) => {
    const sections = await getSectionsInCourse(dept, course)
    sections.forEach(async ({ instructor, activity, credits, section }) => {
      if (enrolments) {
        const { totalSeatsRemaining, currentlyRegistered, generalSeatsRemaining, restrictedSeatsRemaining } = await getEnrolments(dept, course, section)
        const stringified = [ year, term, dept, course, section, instructor, credits, activity, totalSeatsRemaining, currentlyRegistered, generalSeatsRemaining, restrictedSeatsRemaining ].map(x => JSON.stringify(x))
        await append(stringified)
      } else {
        const stringified = [ year, term, dept, course, section, instructor, credits, activity ].map(x => JSON.stringify(x))
        await append(stringified)
      }
    })
  })
})
