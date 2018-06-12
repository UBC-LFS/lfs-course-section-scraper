/* global fetch */
require('isomorphic-fetch')
const request = require('request-promise')
const cheerio = require('cheerio')
const XLJS = require('x2js')
const util = require('util')
const prompts = require('prompts')
const fs = require('fs')
const fswrite = util.promisify(fs.writeFile)
const fsappend = util.promisify(fs.appendFile)
const path = require('path')
const c = require('./constants')

const xljs = new XLJS();

(async function app () {
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
        { title: 'Yes', value: true },
        { title: 'No', value: false }
      ]
    }
  ]
  let { depts, year, term, enrolments } = await prompts(prompt)

  if (depts.includes('all')) {
    depts = ['APBI', 'FNH', 'FOOD', 'FRE', 'GRS', 'HUNU', 'LFS', 'LWS', 'PLNT', 'SOIL']
  }

  const filepath = path.join(__dirname, `/output/${year}${term}.csv`)

  const writeHeader = header => fswrite(filepath, header + '\r\n')
  const append = row => fsappend(filepath, row + '\r\n')

  const getCoursesInDept = async (dept, year, term) => {
    try {
      const response = await fetch(c.baseURL + '&' + c.year(year) + '&' + c.term(term) + '&' + 'req=2' + '&' + c.dept(dept) + '&' + 'output=3')
      const xml = await response.text()
      const json = xljs.xml2js(xml)
      const course = Array.isArray(json.courses.course) ? json.courses.course : [json.courses.course]
      const courseObjs = course.map(({ _key, _title }) => ({ course: _key, description: _title }))
      return courseObjs
    } catch (e) {
      console.log(`Failed to get courses for dept=${dept}, year=${year}, and term=${term}`, e)
    }
  }

  const getSectionsInCourse = async (dept, course) => {
    try {
      const response = await fetch(c.baseURL + '&' + c.year(year) + '&' + c.term(term) + '&' + 'req=4' + '&' + c.dept(dept) + '&' + c.course(course) + '&' + 'output=3')
      const xml = await response.text()
      const json = xljs.xml2js(xml)
      const sections = Array.isArray(json.sections.section) ? json.sections.section : [json.sections.section]
      const sectionsWithWaitListFiltered = sections
        .filter(section => section._activity !== 'Waiting List')
        .filter(section => section._activity !== 'Thesis')
        .filter(section => section._activity !== 'Work Placement')
        .filter(section => section._activity !== 'Laboratory')
        .filter(section => section._activity !== 'Tutorial')
      const requiredFields = sectionsWithWaitListFiltered
        .map(({ instructors = '', _activity, _credits, _key, teachingunits }) =>
          ({ instructor: instructors.instructor ? instructors.instructor._name : '', activity: _activity, credits: _credits, section: _key, termcd: teachingunits.teachingunit._termcd }))
      return requiredFields
    } catch (e) {
      console.log(`Failed to get sections for dept=${dept} and course=${course}`, e)
    }
  }

  const getEnrolments = async (dept, course, section) => {
    const url = c.enrolmentURL(year, term, dept, course, section)
    const options = {
      uri: url,
      transform: body => cheerio.load(body)
    }
    try {
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
    } catch (e) {
      console.log(`Failed to scrape this url=${url} for the dept=${dept}, course=${course}, and section=${section}`, e)
    }
  }

  depts.forEach(async dept => {
    enrolments ? await writeHeader(c.csvHeadersWithEnrolment) : await writeHeader(c.csvHeaders)
    const courseObjs = await getCoursesInDept(dept, year, term)
    courseObjs.forEach(async ({ course, description }) => {
      const sections = await getSectionsInCourse(dept, course)
      sections.forEach(async ({ instructor, activity, credits, section, termcd }) => {
        if (enrolments) {
          const { totalSeatsRemaining, currentlyRegistered, generalSeatsRemaining, restrictedSeatsRemaining } = await getEnrolments(dept, course, section)
          const stringified = [year, term, dept, course, section, instructor, credits, activity, totalSeatsRemaining, currentlyRegistered, generalSeatsRemaining, restrictedSeatsRemaining]
            .map(x => JSON.stringify(x))
          await append(stringified)
        } else {
          const stringified = [year, term + termcd, dept, course, section, instructor, credits, activity]
            .map(x => JSON.stringify(x))
          await append(stringified)
        }
      })
    })
  })
})()
