# DB Navigator — local iPhone app

This branch packages the existing Astro interface as an iOS application with Capacitor. Firebase has been removed. Ticket details are saved in local storage and selected images are saved in IndexedDB inside the app sandbox.

## Run in a browser

```sh
npm install
npm run dev
```

## Install on an iPhone with a free Apple ID

1. Connect the iPhone to the Mac and trust the computer.
2. Run `npm run ios:open`.
3. In Xcode, select the **App** project and **App** target, then open **Signing & Capabilities**.
4. Select your personal Apple ID team. If Xcode reports that the bundle identifier is already used, replace `de.local.dbnavigator` with a unique value.
5. Select the connected iPhone as the run destination and press **Run**.
6. If iOS asks, enable Developer Mode and trust the developer profile in Settings.

With free personal signing, the installation normally needs to be repeated after 7 days. App data is local to this installation and can be lost when the app is deleted.

## After web changes

Run `npm run ios:sync`, then build again in Xcode.
