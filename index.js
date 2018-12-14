const schedule = require('node-schedule')
const axios = require('axios')

module.exports = function(jobs) {
  // config = {
  //   cron: '1 */1 * * * *',//一分钟请求一次
  //   handle: 'api/cronjob/parsing_mail',
  //   immediate: true,
  //   enable: true,
  //   console: false,
  //   type: 'all'
  // }
  let job_list = {}

  if(!Array.isArray(jobs)) {
    jobs = [jobs]
  }

  let seq = 1

  jobs.forEach((job) => {
    if(!job.name) {
      job.name = 'axiosCronJob' + seq++
    }
    const thisJob = typeof job.handle === 'object' ? axios(job.handle) : axios.get(job.handle)
    const thisJobFun = function() {
      thisJob.
      then(function (res) {
        if(job.console) {
          if(job.console === 'headers') {
            return console.log('express-cronjob:', res.headers)
          }
          console.log('express-cronjob:', res.data)
        }
      })
      .catch(function (err) {
        if(job.console) {
          if(job.console === 'headers') {
            return console.log('express-cronjob:', err.response.headers)
          }
          console.log('express-cronjob:', err.response.data)
        }
      })
    }
    if(job.immediate) {
      thisJobFun()
    }
    job_list[job.name] = schedule.scheduleJob(job.cron, thisJobFun)
  })

  return job_list
}