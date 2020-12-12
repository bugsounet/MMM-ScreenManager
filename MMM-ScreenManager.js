/* Magic Mirror
 * Module: ScreenManager
 *
 * By @bugsounet -- Dupont Cédric <bugsounet@bugsounet.fr>
 * MIT Licensed.
 */

Module.register("MMM-ScreenManager", {
  defaults: {
    debug: false,
    turnOnStart: true,
    screenMode: 1,
    hideModules: true,
    governor: {
      useGovernor: false,
      sleeping: "powersave",
      working: "ondemand"
    },
    ON: [],
    OFF: []
  },

  notificationReceived: function (notification, payload, sender) {
    switch (notification) {
      case "DOM_OBJECTS_CREATED":
        this.sendSocketNotification("CONFIG", this.config)
        break
    }
  },

  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "SCREEN_PRESENCE":
        if (this.config.hideModules) this.HideShow(payload)
        this.sendNotification("USER_PRESENCE", payload)
        break
    }
  },

  HideShow: function(show) {
    if (this.config.debug) console.log("[MANAGER] " + (show ? "show": "hide") + " all modules")
    if (show) {
      MM.getModules().enumerate((module)=> {
        module.show(1000, {lockString: "MANAGER_LOCK"})
      })
    } else {
      MM.getModules().enumerate((module)=> {
        module.hide(1000, {lockString: "MANAGER_LOCK"})
      })
    }
  }
});
