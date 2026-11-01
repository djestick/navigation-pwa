#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [[ "$(uname -s)" != Darwin ]]; then
  echo 'IPA builds require macOS and Xcode. Use the Build apps GitHub Actions workflow.' >&2
  exit 1
fi
mkdir -p artifacts/ios
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Release \
  -sdk iphoneos -destination 'generic/platform=iOS' \
  -derivedDataPath artifacts/ios/DerivedData \
  CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO build
mkdir -p artifacts/ios/Payload
ditto artifacts/ios/DerivedData/Build/Products/Release-iphoneos/App.app artifacts/ios/Payload/App.app
cd artifacts/ios
zip -qry ../DB-Simulator-unsigned.ipa Payload
echo 'Created artifacts/DB-Simulator-unsigned.ipa. Sign it before installing on an iPhone.'
