# Course Section Generator

The Course Section Generator scrapes the courses.students.ubc.ca website to get the sections for the specified year, term, and department codes. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine .

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
const departments = ['APBI', 'FNH']
```
7. Run using `node app.js`.
8. Open `output` folder and you will find a csv named by year and term put together. 

## Authors

* **Justin Lee** 
(https://github.com/justin0022)

## License

This project is licensed under the MIT License.
