# MMM-ScreenManager

Automaticaly turn ON and Turn OFF your screen with defined hours

## Installation
Needed: MagicMirror v2.13.0 and above

Clone the module into your MagicMirror module folder and execute `npm intall` in the module's directory.
```sh
cd ~/MagicMirror/modules
git clone https://github.com/bugsounet/MMM-ScreenManager.git
cd MMM-ScreenManager
npm install
```

## Configuration Sample
To use the module insert it in the config.js file. Here is an example:

```js
{
  module: 'MMM-ScreenManager',
  configDeepMerge: true,
    config: {
      debug: false,
      turnOnStart: true,
      screenMode: 1,
      hideModules: true,
      governor: {
        useGovernor: false,
        sleeping: "powersave",
        working: "ondemand"
      },
      ON: [
        "45 7 * * 0-4",
        "0 8 * * 5"
      ],
      OFF: [
        "0 17 * * 0-5"
      ]
   }
},
```

## Configuration Structure

### Field in `root`
| Option  | Type | Default |
| ------- | --- | --- |
| debug| BOOLEAN| false
| turnOnStart| BOOLEAN| true
| screenMode| NUMBER| 1
| hideModules| BOOLEAN| true

`debug`: Activate debug mode<br>
`turnOnStart`: Turn On your screen on start (if needed)<br>
`screenMode`: Screen Manager mode<br>
`hideModules`: Hide all modules before turn off screen 

 Available `screenMode`:
   - `screenMode: 1` - use vgencmd (RPI only)
   - `screenMode: 2` - use dpms (version RPI)
   - `screenMode: 3` - use tvservice (RPI only)
   - `screenMode: 4` - use HDMI CEC
   - `screenMode: 5` - use dpms (linux version for debian, ubuntu, ...)

### Field in `governor: {}`

You can also make a powerSaving mode with this feature

| Option  | Type | Default |
| ------- | --- | --- |
|useGovernor| BOOLEAN| false
|sleeping| STRING| powersave
|working| STRING| ondemand

`useGovernor`: Activate CPU powersaving<br>
`sleeping`: use this governor when the screen turn OFF<br>
`working`: use this governor when the screen turn ON<br>

Available governor:
 * conservative
 * ondemand
 * userspace
 * powersave
 * performance

### Field in `ON: []` and `OFF: []`

This is the rule to Turn ON et Turn OFF your screen<br>
You have make to script your rule in cron format<br>
For each field, you can make an array of cron value<br>

In the sample Configuration,

I have set this rule for turn on screen:
```js
      ON: [
        "45 7 * * 0-4",
        "0 8 * * 5"
      ],
```
1st Rule: from Monday to Thursday at 07h45<br>
2nd Rule: every Friday at 08h00<br>

I have set this rule for turn off screen:
```js
      OFF: [
        "0 17 * * 0-5"
      ]
```
1st Rule: from Monday to Friday at 17h00

## Cron Syntax

This is a quick reference to cron syntax

### Allowed fields

```
 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
```

### Allowed values

|     field    |        value        |
|--------------|---------------------|
|    second    |         0-59        |
|    minute    |         0-59        |
|     hour     |         0-23        |
| day of month |         1-31        |
|     month    |     1-12 (or names) |
|  day of week |     0-7 (or names, 0 or 7 are sunday)  |

## Notes
  - You can verify your cron value with [this site](https://crontab.guru/)
  - This module have no visual
  - This module broadcast a `USER_PRESENCE` notification for other modules

## Update

  ```sh
  cd ~/MagicMirror/modules/MMM-ScreenManager
  git pull && npm install
  ```
## Support and Helping
Support is now on [the 4th Party Modules Forum](http://forum.bugsounet.fr)

## Donation

[If you love my modules !](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TTHRH94Y4KL36&source=url) 
