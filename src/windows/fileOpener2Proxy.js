const cordova = require("cordova");
const fileOpener2 = require("./FileOpener2");

function nthIndex(str, pat, n) {
  var L = str.length,
    i = -1;
  while (n-- && i++ < L) {
    i = str.indexOf(pat, i);
    if (i < 0) break;
  }
  return i;
}

function getFileFromApplicationUri(uri) {
  /* bad path from a file entry due to the last '//' example: ms-appdata:///local//path/to/file */
  var index = nthIndex(uri, "//", 3);
  var newUri = uri.substr(0, index) + uri.substr(index + 1);

  var applicationUri = new Windows.Foundation.Uri(newUri);

  return Windows.Storage.StorageFile.getFileFromApplicationUriAsync(
    applicationUri
  );
}

function getFileFromFileUri(uri) {
  /* uri example: cdvfile://localhost/persistent|temporary|another-fs-root/path/to/file */
  var indexFrom = nthIndex(uri, "/", 3) + 1;
  var indexTo = nthIndex(uri, "/", 4);
  var whichFolder = uri.substring(indexFrom, indexTo);
  var filePath = uri.substr(indexTo + 1);
  var path = "\\" + filePath;

  if (whichFolder == "persistent") {
    path = Windows.Storage.ApplicationData.current.localFolder.path + path;
  } else {
    //temporary, note: no roaming management
    path = Windows.Storage.ApplicationData.current.temporaryFolder.path + path;
  }

  return getFileFromNativePath(path);
}

function getFileFromNativePath(path) {
  var nativePath = path.split("/").join("\\");

  return Windows.Storage.StorageFile.getFileFromPathAsync(nativePath);
}

var schemes = [
  { protocol: "ms-app", getFile: getFileFromApplicationUri },
  { protocol: "cdvfile", getFile: getFileFromFileUri }, //protocol cdvfile
];

function getFileLoaderForScheme(path) {
  let fileLoader = getFileFromNativePath;

  schemes.some((scheme) => {
    if (path.indexOf(scheme.protocol) === 0) {
      fileLoader = scheme.getFile;
      return true;
    }
    return false;
  });

  return fileLoader;
}

module.exports = {
  open: async function (path) {
    const getFile = getFileLoaderForScheme(path);

    try {
      const file = await getFile(path);
      var options = new Windows.System.LauncherOptions();
      await Windows.System.Launcher.launchFileAsync(file, options);
    } catch (error) {
      console.error("Error while opening the file: " + error);
      throw error;
    }
  },
};

require("cordova/exec/proxy").add("FileOpener2", module.exports);
