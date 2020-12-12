/* Magic Mirror
 * Module: ScreenManager
 *
 * By @bugsounet -- Dupont Cédric <bugsounet@bugsounet.fr>
 * MIT Licensed.
 */

const NodeHelper = require("node_helper")
const Screen = require("@bugsounet/screen")
const Governor = require("@bugsounet/governor")
const npmCheck = require("@bugsounet/npmcheck")
var cron = require('node-cron')
var log = (...args) => { /* do nothing */ }

module.exports = NodeHelper.create({
  start: function () {
    console.log("[MANAGER] MMM-ScreenManager Version:", require('./package.json').version)
    this.config = null
    this.screen = null
    this.governor = null
    this.useGovernor = false
    this.Checker = null
  },

  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "CONFIG":
        this.config = payload
        if (this.config.debug) log = (...args) => { console.log("[MANAGER]", ...args) }
        log("Config:", this.config)
        this.initialize()
        break
    }
  },

  initialize: function() {
    log("Initialize...")

    /** npm library @bugsounet update checker **/
    if (this.config.NPMCheck.useChecker) {
      var npmConfig = {
        dirName: __dirname,
        moduleName: this.name,
        timer: this.getUpdateTime(this.config.NPMCheck.delay),
        debug: this.config.debug
      }
      this.Checker= new npmCheck(npmConfig, update => { this.sendSocketNotification("NPM_UPDATE", update)})
    }

    /** Governor library **/
    this.useGovernor = this.config.governor.useGovernor
    if (this.useGovernor) {
      let governorConfig = {
        useCallback: false,
        sleeping: this.config.governor.sleeping,
        working: this.config.governor.working
      }
      this.governor = new Governor(governorConfig, (noti, value) => { log("cb", noti,value) }, this.config.debug)
      this.governor.start()
    }

    /** Screen library **/
    let screenConfig = {
      mode: this.config.screenMode
    }
    this.screen = new Screen(screenConfig, (noti, value) => { log("cb", noti,value) }, this.config.debug)
    if (this.config.turnOnStart) this.turnOn()

    log("Initialized!")

    /** main process **/
    this.cronJob()
  },

  /** main cron job **/
  cronJob: function() {
    if (this.config.ON.length) {
      this.config.ON.forEach(on => {
        if (!cron.validate(on)) return console.error("[MANAGER] Error event ON:", on)
        cron.schedule(on, () => {
          if (this.useGovernor) this.governor.working()
          this.turnOn()
        })
        log("Added event ON:", on)
      })
    } else log("No event ON")

    if (this.config.OFF.length) {
      this.config.OFF.forEach(off => {
        if (!cron.validate(off)) return console.error("[MANAGER] Error event OFF:", off)
        cron.schedule(off, () => {
          this.turnOff()
          if (this.useGovernor) this.governor.sleeping()
        })
        log("Added event OFF:", off)
      })
    } else log ("No event OFF")
  },

  /** Screen Manager with @bugsounet/screen library... wow too complex :D **/
  turnOn: function() {
    log("Turn ON Screen")
    this.screen.wantedPowerDisplay(true)
    this.sendSocketNotification("SCREEN_PRESENCE", true)
  },

  turnOff: function() {
    log("Turn OFF Screen")
    this.screen.wantedPowerDisplay(false)
    this.sendSocketNotification("SCREEN_PRESENCE", false)
  },

  /** convert h m s to ms **/
  getUpdateTime: function(str) {
    let ms = 0, time, type, value
    let time_list = ('' + str).split(' ').filter(v => v != '' && /^(\d{1,}\.)?\d{1,}([wdhms])?$/i.test(v))

    for(let i = 0, len = time_list.length; i < len; i++){
      time = time_list[i]
      type = time.match(/[wdhms]$/i)

      if(type){
        value = Number(time.replace(type[0], ''))

        switch(type[0].toLowerCase()){
          case 'w':
            ms += value * 604800000
            break
          case 'd':
            ms += value * 86400000
            break
          case 'h':
            ms += value * 3600000
            break
          case 'm':
            ms += value * 60000
            break
          case 's':
            ms += value * 1000
          break
        }
      } else if(!isNaN(parseFloat(time)) && isFinite(time)){
        ms += parseFloat(time)
      }
    }
    return ms
  },

});
