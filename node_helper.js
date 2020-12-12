/* Magic Mirror
 * Module: ScreenManager
 *
 * By @bugsounet -- Dupont Cédric <bugsounet@bugsounet.fr>
 * MIT Licensed.
 */

const NodeHelper = require("node_helper")
const Screen = require("@bugsounet/screen")
const Governor = require("@bugsounet/governor")
var cron = require('node-cron')
var log = (...args) => { /* do nothing */ }

module.exports = NodeHelper.create({
  start: function () {
    console.log("[MANAGER] MMM-ScreenManager Version:", require('./package.json').version)
    this.config = null
    this.screen = null
    this.governor = null
    this.useGovernor = false
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
    this.useGovernor = this.config.governor.useGovernor
    let screenConfig = {
      mode: this.config.screenMode
    }
    let governorConfig = {
      useCallback: false,
      sleeping: this.config.governor.sleeping,
      working: this.config.governor.working
    }
    this.screen = new Screen(screenConfig, (noti, value) => { log("cb", noti,value) }, this.config.debug)
    if (this.config.turnOnStart) this.turnOn()
    if (this.useGovernor) {
      this.governor = new Governor(governorConfig, (noti, value) => { log("cb", noti,value) }, this.config.debug)
      this.governor.start()
    }
    log("Initialized!")
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
  }

});
