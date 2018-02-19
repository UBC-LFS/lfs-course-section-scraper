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
const departments = ['APBI', 'FNH']
```
5. Save `app.js`.
6. Run using `node app.js`.
7. Open `output` folder and you will find a csv named by year and term put together. 

### Note
By default, this app will filter out Waiting Lists. To keep Waiting Lists, delete the following (starting at the '.'):
``` Javascript 
.filter(section => section._activity !== 'Waiting List')
```

## Authors

* **Justin Lee** 
(https://github.com/justin0022)

## License

This project is licensed under the MIT License.

