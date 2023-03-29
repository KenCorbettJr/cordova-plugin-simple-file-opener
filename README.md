# A Simple File Opener Plugin for Cordova

[![Latest Stable Version](https://img.shields.io/npm/v/cordova-plugin-simple-file-opener.svg)](https://www.npmjs.com/package/cordova-plugin-simple-file-opener) [![Total Downloads](https://img.shields.io/npm/dt/cordova-plugin-simple-file-opener.svg)](https://npm-stat.com/charts.html?package=cordova-plugin-simple-file-opener)

This plugin will open a file on your device file system with its default application.

## Installation

```shell
$ cordova plugin add cordova-plugin-simple-file-opener
```

## Requirements

The following platforms and versions are supported by the latest release:

- Android 5.1+ / iOS 9+ / Windows / Electron
- Cordova CLI 7.0 or higher

## fileOpener2.open(filePath, mimeType, options)

Opens a file

### Supported Platforms

- Android 5.1+
- iOS 9+
- Windows
- Electron

### Quick Examples

Open a PDF document with the default PDF reader and optional callback object:

```js
try {
  cordova.plugins.fileOpener2.open(
    "/Download/starwars.pdf",
    // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Downloads/starwars.pdf
    "application/pdf"
  );
  console.log("File opened successfully");
} catch (e) {
  console.log("Error status: " + e.status + " - Error message: " + e.message);
}
```

**Note on Electron:** Do not forget to enable Node.js in your app by adding `"nodeIntegration": true` to `platforms/electron/platform_www/cdv-electron-settings.json` file, See [Cordova-Electron documentation](https://cordova.apache.org/docs/en/latest/guide/platforms/electron/index.html#customizing-the-application's-window-options).

## fileOpener2.showOpenWithDialog(filePath, mimeType, options)

Opens with system modal to open file with an already installed app.

### Supported Platforms

- Android 5.1+
- iOS 9+

### Quick Example

```js
cordova.plugins.fileOpener2.showOpenWithDialog(
  "/Downloads/starwars.pdf", // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Downloads/starwars.pdf
  "application/pdf",
  {
    error: function (e) {
      console.log(
        "Error status: " + e.status + " - Error message: " + e.message
      );
    },
    success: function () {
      console.log("file opened successfully");
    },
    position: [0, 0],
  }
);
```

`position` array of coordinates from top-left device screen, use for iOS dialog positioning.

## fileOpener2.appIsInstalled(packageId, callbackContext)

Check if an app is already installed.

### Supported Platforms

- Android 5.1+

### Quick Example

```javascript
cordova.plugins.fileOpener2.appIsInstalled("com.adobe.reader", {
  success: function (res) {
    if (res.status === 0) {
      console.log("Adobe Reader is not installed.");
    } else {
      console.log("Adobe Reader is installed.");
    }
  },
});
```

## Notes

- For properly opening _any_ file, you must already have a suitable reader for that particular file type installed on your device. Otherwise this will not work.

- [It is reported](https://github.com/KenCorbettJr/cordova-plugin-simple-file-opener/issues/2#issuecomment-41295793) that in iOS, you might need to remove `<preference name="iosPersistentFileLocation" value="Library" />` from your `config.xml`

- If you are wondering what MIME-type should you pass as the second argument to `open` function, [here is a list of all known MIME-types](http://svn.apache.org/viewvc/httpd/httpd/trunk/docs/conf/mime.types?view=co)

---
