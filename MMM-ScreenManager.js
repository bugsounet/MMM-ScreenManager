/* Magic Mirror
 * Module: ScreenManager
 *
 * By @bugsounet -- Dupont Cédric <bugsounet@bugsounet.fr>
 * MIT Licensed.
 */

Module.register("MMM-ScreenManager", {
  defaults: {
    debug: true,
    turnOnStart: true,
    screenMode: 5,
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
        this.sendNotification("USER_PRESENCE", payload)
        break
    }
  }
});
