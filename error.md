npm warn cleanup Failed to remove some directories [
npm warn cleanup   [
npm warn cleanup     '\\\\?\\D:\\Developer\\idealhome-admin\\node_modules\\eslint',
npm warn cleanup     [Error: EPERM: operation not permitted, rmdir 'D:\Developer\idealhome-admin\node_modules\eslint\node_modules\@nodelib\fs.scandir\out'] {
npm warn cleanup       errno: -4048,
npm warn cleanup       code: 'EPERM',
npm warn cleanup       syscall: 'rmdir',
npm warn cleanup       path: 'D:\\Developer\\idealhome-admin\\node_modules\\eslint\\node_modules\\@nodelib\\fs.scandir\\out'
npm warn cleanup     }
npm warn cleanup   ],
npm warn cleanup   [
npm warn cleanup     'D:\\Developer\\idealhome-admin\\node_modules\\eslint-plugin-vue',
npm warn cleanup     [Error: EPERM: operation not permitted, rmdir 'D:\Developer\idealhome-admin\node_modules\eslint-plugin-vue\lib'] {
npm warn cleanup       errno: -4048,
npm warn cleanup       code: 'EPERM',
npm warn cleanup       syscall: 'rmdir',
npm warn cleanup       path: 'D:\\Developer\\idealhome-admin\\node_modules\\eslint-plugin-vue\\lib'
npm warn cleanup     }
npm warn cleanup   ],
npm warn cleanup   [
npm warn cleanup     'D:\\Developer\\idealhome-admin\\node_modules\\string.prototype.padend',
npm warn cleanup     [Error: EPERM: operation not permitted, rmdir 'D:\Developer\idealhome-admin\node_modules\string.prototype.padend'] {
npm warn cleanup       errno: -4048,
npm warn cleanup       code: 'EPERM',
npm warn cleanup       syscall: 'rmdir',
npm warn cleanup       path: 'D:\\Developer\\idealhome-admin\\node_modules\\string.prototype.padend'
npm warn cleanup     }
npm warn cleanup   ],
npm warn cleanup   [
npm warn cleanup     '\\\\?\\D:\\Developer\\idealhome-admin\\node_modules\\eslint-plugin-n',
npm warn cleanup     [Error: EPERM: operation not permitted, rmdir 'D:\Developer\idealhome-admin\node_modules\eslint-plugin-n\node_modules'] {
npm warn cleanup       errno: -4048,
npm warn cleanup       code: 'EPERM',
npm warn cleanup       syscall: 'rmdir',
npm warn cleanup       path: 'D:\\Developer\\idealhome-admin\\node_modules\\eslint-plugin-n\\node_modules'
npm warn cleanup     }
npm warn cleanup   ]
npm warn cleanup ]
npm error code 1
npm error path D:\Developer\idealhome-admin\node_modules\node-sass
npm error command failed
npm error command C:\windows\system32\cmd.exe /d /s /c node scripts/build.js
npm error Building: C:\Program Files\nodejs\node.exe D:\Developer\idealhome-admin\node_modules\node-gyp\bin\node-gyp.js rebuild --verbose --libsass_ext= --libsass_cflags= --libsass_ldflags= --libsass_library=
npm error gyp info it worked if it ends with ok
npm error gyp verb cli [
npm error gyp verb cli   'C:\\Program Files\\nodejs\\node.exe',
npm error gyp verb cli   'D:\\Developer\\idealhome-admin\\node_modules\\node-gyp\\bin\\node-gyp.js',
npm error gyp verb cli   'rebuild',
npm error gyp verb cli   '--verbose',
npm error gyp verb cli   '--libsass_ext=',
npm error gyp verb cli   '--libsass_cflags=',
npm error gyp verb cli   '--libsass_ldflags=',
npm error gyp verb cli   '--libsass_library='
npm error gyp verb cli ]
npm error gyp info using node-gyp@7.1.2
npm error gyp info using node@22.18.0 | win32 | x64
npm error gyp verb command rebuild []
npm error gyp verb command clean []
npm error gyp verb clean removing "build" directory
npm error gyp verb command configure []
npm error gyp verb find Python Python is not set from command line or npm configuration
npm error gyp verb find Python Python is not set from environment variable PYTHON
npm error gyp verb find Python checking if "python3" can be used
npm error gyp verb find Python - executing "python3" to get executable path
npm error (node:19028) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
npm error (Use `node --trace-deprecation ...` to show where the warning was created)
npm error gyp verb find Python - executable path is "C:\Users\Administrator\AppData\Local\Microsoft\WindowsApps\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\python.exe"
npm error gyp verb find Python - executing "C:\Users\Administrator\AppData\Local\Microsoft\WindowsApps\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\python.exe" to get version
npm error gyp verb find Python - version is "3.13.7"
npm error gyp info find Python using Python version 3.13.7 found at "C:\Users\Administrator\AppData\Local\Microsoft\WindowsApps\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\python.exe"
npm error gyp verb get node dir no --target version specified, falling back to host node version: 22.18.0
npm error gyp verb command install [ '22.18.0' ]
npm error gyp verb install input version string "22.18.0"
npm error gyp verb install installing version: 22.18.0
npm error gyp verb install --ensure was passed, so won't reinstall if already installed
npm error gyp verb install version is already installed, need to check "installVersion"
npm error gyp verb got "installVersion" 9
npm error gyp verb needs "installVersion" 9
npm error gyp verb install version is good
npm error gyp verb get node dir target node version installed: 22.18.0
npm error gyp verb build dir attempting to create "build" dir: D:\Developer\idealhome-admin\node_modules\node-sass\build
npm error gyp verb build dir "build" dir needed to be created? \\?\D:\Developer\idealhome-admin\node_modules\node-sass\build
npm error gyp verb find VS msvs_version not set from command line or npm config
npm error gyp verb find VS VCINSTALLDIR not set, not running in VS Command Prompt
npm error gyp verb find VS could not use PowerShell to find Visual Studio 2017 or newer, try re-running with '--loglevel silly' for more details
npm error gyp verb find VS looking for Visual Studio 2015
npm error gyp verb find VS - not found
npm error gyp verb find VS not looking for VS2013 as it is only supported up to Node.js 8
npm error gyp ERR! find VS
npm error gyp ERR! find VS msvs_version not set from command line or npm config
npm error gyp ERR! find VS VCINSTALLDIR not set, not running in VS Command Prompt
npm error gyp ERR! find VS could not use PowerShell to find Visual Studio 2017 or newer, try re-running with '--loglevel silly' for more details
npm error gyp ERR! find VS looking for Visual Studio 2015
npm error gyp ERR! find VS - not found
npm error gyp ERR! find VS not looking for VS2013 as it is only supported up to Node.js 8
npm error gyp ERR! find VS
npm error gyp ERR! find VS **************************************************************
npm error gyp ERR! find VS You need to install the latest version of Visual Studio
npm error gyp ERR! find VS including the "Desktop development with C++" workload.
npm error gyp ERR! find VS For more information consult the documentation at:
npm error gyp ERR! find VS https://github.com/nodejs/node-gyp#on-windows
npm error gyp ERR! find VS **************************************************************
npm error gyp ERR! find VS
npm error gyp ERR! configure error
npm error gyp ERR! stack Error: Could not find any Visual Studio installation to use
npm error gyp ERR! stack     at VisualStudioFinder.fail (D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:121:47)
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:74:16
npm error gyp ERR! stack     at VisualStudioFinder.findVisualStudio2013 (D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:351:14)
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:70:14
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:372:16
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\util.js:54:7
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\util.js:33:16
npm error gyp ERR! stack     at ChildProcess.exithandler (node:child_process:424:5)
npm error gyp ERR! stack     at ChildProcess.emit (node:events:518:28)
npm error gyp ERR! stack     at maybeClose (node:internal/child_process:1101:16)
npm error gyp verb find VS not looking for VS2013 as it is only supported up to Node.js 8
npm error gyp ERR! find VS
npm error gyp ERR! find VS msvs_version not set from command line or npm config
npm error gyp ERR! find VS VCINSTALLDIR not set, not running in VS Command Prompt
npm error gyp ERR! find VS could not use PowerShell to find Visual Studio 2017 or newer, try re-running with '--loglevel silly' for more details
npm error gyp ERR! find VS looking for Visual Studio 2015
npm error gyp ERR! find VS - not found
npm error gyp ERR! find VS not looking for VS2013 as it is only supported up to Node.js 8
npm error gyp ERR! find VS
npm error gyp ERR! find VS **************************************************************
npm error gyp ERR! find VS You need to install the latest version of Visual Studio
npm error gyp ERR! find VS including the "Desktop development with C++" workload.
npm error gyp ERR! find VS For more information consult the documentation at:
npm error gyp ERR! find VS https://github.com/nodejs/node-gyp#on-windows
npm error gyp ERR! find VS **************************************************************
npm error gyp ERR! find VS
npm error gyp ERR! configure error
npm error gyp ERR! stack Error: Could not find any Visual Studio installation to use
npm error gyp ERR! stack     at VisualStudioFinder.fail (D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:121:47)
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:74:16
npm error gyp ERR! stack     at VisualStudioFinder.findVisualStudio2013 (D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:351:14)
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:70:14
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:372:16
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\util.js:54:7
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\util.js:33:16
npm error gyp ERR! stack     at ChildProcess.exithandler (node:child_process:424:5)
npm error gyp ERR! stack     at ChildProcess.emit (node:events:518:28)
npm error gyp ERR! stack     at maybeClose (node:internal/child_process:1101:16)
npm error gyp ERR! find VS looking for Visual Studio 2015
npm error gyp ERR! find VS - not found
npm error gyp ERR! find VS not looking for VS2013 as it is only supported up to Node.js 8
npm error gyp ERR! find VS
npm error gyp ERR! find VS **************************************************************
npm error gyp ERR! find VS You need to install the latest version of Visual Studio
npm error gyp ERR! find VS including the "Desktop development with C++" workload.
npm error gyp ERR! find VS For more information consult the documentation at:
npm error gyp ERR! find VS https://github.com/nodejs/node-gyp#on-windows
npm error gyp ERR! find VS **************************************************************
npm error gyp ERR! find VS
npm error gyp ERR! configure error
npm error gyp ERR! stack Error: Could not find any Visual Studio installation to use
npm error gyp ERR! stack     at VisualStudioFinder.fail (D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:121:47)
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:74:16
npm error gyp ERR! stack     at VisualStudioFinder.findVisualStudio2013 (D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:351:14)
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:70:14
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:372:16
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\util.js:54:7
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\util.js:33:16
npm error gyp ERR! stack     at ChildProcess.exithandler (node:child_process:424:5)
npm error gyp ERR! stack     at ChildProcess.emit (node:events:518:28)
npm error gyp ERR! stack     at maybeClose (node:internal/child_process:1101:16)
npm error gyp ERR! find VS You need to install the latest version of Visual Studio
npm error gyp ERR! find VS including the "Desktop development with C++" workload.
npm error gyp ERR! find VS For more information consult the documentation at:
npm error gyp ERR! find VS https://github.com/nodejs/node-gyp#on-windows
npm error gyp ERR! find VS **************************************************************
npm error gyp ERR! find VS
npm error gyp ERR! configure error
npm error gyp ERR! stack Error: Could not find any Visual Studio installation to use
npm error gyp ERR! stack     at VisualStudioFinder.fail (D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:121:47)
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:74:16
npm error gyp ERR! stack     at VisualStudioFinder.findVisualStudio2013 (D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:351:14)
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:70:14
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:372:16
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\util.js:54:7
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\util.js:33:16
npm error gyp ERR! stack     at ChildProcess.exithandler (node:child_process:424:5)
npm error gyp ERR! stack     at ChildProcess.emit (node:events:518:28)
npm error gyp ERR! stack     at maybeClose (node:internal/child_process:1101:16)
npm error gyp ERR! find VS
npm error gyp ERR! configure error
npm error gyp ERR! stack Error: Could not find any Visual Studio installation to use
npm error gyp ERR! stack     at VisualStudioFinder.fail (D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:121:47)
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:74:16
npm error gyp ERR! stack     at VisualStudioFinder.findVisualStudio2013 (D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:351:14)
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:70:14
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\find-visualstudio.js:372:16
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\util.js:54:7
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\util.js:33:16
npm error gyp ERR! stack     at ChildProcess.exithandler (node:child_process:424:5)
npm error gyp ERR! stack     at ChildProcess.emit (node:events:518:28)
npm error gyp ERR! stack     at maybeClose (node:internal/child_process:1101:16)
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\util.js:54:7
npm error gyp ERR! stack     at D:\Developer\idealhome-admin\node_modules\node-gyp\lib\util.js:33:16
npm error gyp ERR! stack     at ChildProcess.exithandler (node:child_process:424:5)
npm error gyp ERR! stack     at ChildProcess.emit (node:events:518:28)
npm error gyp ERR! stack     at maybeClose (node:internal/child_process:1101:16)
npm error gyp ERR! stack     at maybeClose (node:internal/child_process:1101:16)
npm error gyp ERR! System Windows_NT 10.0.19045
npm error gyp ERR! System Windows_NT 10.0.19045
npm error gyp ERR! command "C:\\Program Files\\nodejs\\node.exe" "D:\\Developer\\idealhome-admin\\node_modules\\node-gyp\\bin\\node-gyp.js" "rebuild" "--verbose" "--libsass_ext=" "--libsass_cflags=" "--libsass_ldflags=" "--libsass_library="
npm error gyp ERR! cwd D:\Developer\idealhome-admin\node_modules\node-sass
npm error gyp ERR! node -v v22.18.0
npm error gyp ERR! node-gyp -v v7.1.2
npm error gyp ERR! not ok
npm error Build failed with error code: 1
npm error A complete log of this run can be found in: C:\Users\Administrator\AppData\Local\npm-cache\_logs\2025-09-27T02_06_50_199Z-debug-0.log