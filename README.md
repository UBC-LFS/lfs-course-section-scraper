# Course Section Generator

The Course Section Generator scrapes the courses.students.ubc.ca website to get the sections for the specified year, term, and department codes. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

1. **Install [Node 8.0.0 or greater](https://nodejs.org)**.
2. **Install [Git](https://git-scm.com/downloads)**. 

### Installing and Setup

1. First, clone this repo. `git clone https://github.com/UBC-LFS/lfs-course-section-scraper.git`
1. Then cd into the repo. `cd lfs-course-section-scraper`
1. Run the installation script. `npm install` (If you see `babel-node: command not found`, you've missed this step.)
1. Run using `npm start` or `node app.js` (both are equivalent).
1. A command line prompt will show up. Select the needed options and the script will run with the options selected.
1. Open `output` folder and you will find a csv named by year and term put together (e.g. '2018S.csv'). 

## Note
### Filtering Activities
By default, this app displays the course codes associated with LFS. If you want to run with different course codes, you can do so by editing the `constants.js` file and adding your course code to both `title` and `value` fields, as shown below.
``` Javascript 
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
```

### Enrolments
There is no way to access enrolment data through the API, so I am scraping the enrolments directly from the webpage itself. This means that if the Seat Summary table changes in structure, it may break the enrolment scraping. Currently the scraping depends on exact string match of the following: 'Total Seats Remaining:', 'Currently Registered:', 'General Seats Remaining:', 'Restricted Seats Remaining*:'. 

If it breaks, make a PR or create an issue and I'll go fix it. 

## Authors

* **Justin Lee** 
(https://github.com/justin0022)

## License

This project is licensed under the MIT License.

