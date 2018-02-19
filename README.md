# Course Section Generator

The Course Section Generator scrapes the courses.students.ubc.ca website to get the sections for the specified year, term, and department codes. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

1. **Install [Node 8.0.0 or greater](https://nodejs.org)**.
2. **Install [Git](https://git-scm.com/downloads)**. 

### Installing and Setup

1. First, clone this repo. `git clone https://github.com/UBC-LFS/lfs-course-section-scraper.git`
2. Then cd into the repo. `cd lfs-course-section-scraper`
3. Run the installation script. `npm install` (If you see `babel-node: command not found`, you've missed this step.)
4. Open `app.js` and edit the following variables:
``` Javascript
const year = 2018
const term = 'S'
const departments = ['APBI', 'FNH'] // if you only care about one dept, make sure it is surrounded by brackets (e.g. ['APBI'])
const enrolments = true // can be set to false if you false if you don't need enrolment data (this signficantly improves the execution speed)
```
5. Save `app.js`.
6. Run using `npm start` or `node app.js` (both are equivalent).
7. Open `output` folder and you will find a csv named by year and term put together (e.g. '2018S.csv'). 

## Note
### Filtering Activities
By default, this app will filter out Waiting Lists, Thesis, and Work Placements. To keep any of these activities, delete the line(s) that correspond with the filter in `app.js`:
``` Javascript 
.filter(section => section._activity !== 'Waiting List')
.filter(section => section._activity !== 'Thesis')
.filter(section => section._activity !== 'Work Placement')
```
Conversely, if you want to filter out more activities (for example, Practicum), you can simply append another filter like this:
``` Javascript 
.filter(section => section._activity !== 'Waiting List')
.filter(section => section._activity !== 'Thesis')
.filter(section => section._activity !== 'Work Placement')
.filter(section => section._activity !== 'Practicum')
```

### Enrolments
There is no way to access enrolment data through the API, so I am scraping the enrolments directly from the webpage itself. This means that if the Seat Summary table changes in structure, it may break the enrolment scraping. Currently the scraping depends on exact string match of the following: 'Total Seats Remaining:', 'Currently Registered:', 'General Seats Remaining:', 'Restricted Seats Remaining*:'. 

If it breaks, make a PR or create an issue and I'll go fix it. 

## Authors

* **Justin Lee** 
(https://github.com/justin0022)

## License

This project is licensed under the MIT License.

