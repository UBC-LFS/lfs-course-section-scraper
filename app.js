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

(async function () {
  let { depts, year, term, enrolments, filterSetting } = await prompts(c.prompt)

  if (depts.includes('all')) {
    depts = c.prompt
      .find(obj => obj.name === 'depts')
      .choices
      .filter(choice => choice.value !== 'all')
      .map(choice => choice.value)
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
      return course.map(({ _key, _title }) => ({ course: _key, description: _title }))
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
        .filter(({ _activity }) => (!filterSetting.includes(_activity)))
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

  try {
    depts.forEach(async dept => {
      enrolments ? await writeHeader(c.csvHeadersWithEnrolment) : await writeHeader(c.csvHeaders)
      const courseObjs = await getCoursesInDept(dept, year, term)
      courseObjs.forEach(async ({ course, description }) => {
        const sections = await getSectionsInCourse(dept, course)
        sections.forEach(async ({ instructor, activity, credits, section, termcd }) => {
          if (enrolments) {
            const {
              totalSeatsRemaining,
              currentlyRegistered,
              generalSeatsRemaining,
              restrictedSeatsRemaining
            } = await getEnrolments(dept, course, section)
            const stringified = [
              year,
              term,
              dept,
              course,
              section,
              instructor,
              credits,
              activity,
              totalSeatsRemaining,
              currentlyRegistered,
              generalSeatsRemaining,
              restrictedSeatsRemaining
            ].map(x => JSON.stringify(x))
            await append(stringified)
          } else {
            const stringified = [
              year,
              term + termcd,
              dept,
              course,
              section,
              instructor,
              credits,
              activity
            ].map(x => JSON.stringify(x))
            await append(stringified)
          }
        })
      })
    })
  } catch (e) {
    console.log(`Failed for the dept=${depts}, year=${year}, term=${term}`, e)
  }
})()
