#!/usr/bin/env bash

function usage() {
  if [ -n "$1" ]; then echo -e "Error: $1\n" 1>&2; fi
  echo "Installs a version of the @mediapipe/pose runtime easily without having to update the application paths manually"
  echo "Usage: $(basename "$0") [--latest|-v,--version <version>]"
  echo "  --latest              Install the latest version of the @mediapipe/pose library"
  echo "  -v, --version         Install a specific version"
  echo "  -h, --help            This help"
  echo ""
  echo "Example: $0 --latest"
  exit 1
}

if [ $# -lt 1 ]; then usage "At least one argument is required."; fi

if [ -x "$(command -v apt-get)" ]; then
  # We are in a debian-based linux, so install the required dependencies without complaining
  apt-get update && apt-get install -y jq curl
fi

if ! [ -x "$(command -v jq)" ]; then
  echo 'Error: jq is required to run this program.' >&2
  exit 1
fi

if ! [ -x "$(command -v curl)" ]; then
  echo 'Error: curl is required to run this program.' >&2
  exit 1
fi

while [ $# -gt 0 ]; do case $1 in
  --latest) version=$(curl -s "https://data.jsdelivr.com/v1/package/npm/@mediapipe/pose" | jq -r ".tags.latest");shift;shift;;
  -v|--version) version="$2";shift;shift;;
  -h|--help) usage;shift;shift;;
  *) usage "Unknown parameter passed: $1";shift;shift;;
esac; done

if [ $(curl -s https://data.jsdelivr.com/v1/package/resolve/npm/@mediapipe/pose@${version} | jq -r ".version") != "$version" ]; then
  echo "Version $version doesn't exist"
  exit 1
fi

mkdir -p "public/vendor/@mediapipe/pose@${version}"
pushd public/vendor/@mediapipe > /dev/null

files=("pose_solution_packed_assets_loader.js" "pose_solution_packed_assets.data" "pose_solution_wasm_bin.js" "pose_solution_wasm_bin.wasm" "pose_web.binarypb" "pose_solution_simd_wasm_bin.js"  "pose_solution_simd_wasm_bin.wasm")
for file in "${files[@]}"; do
  curl -s https://cdn.jsdelivr.net/npm/@mediapipe/pose@${version}/${file} -o "pose@${version}/$file"
  echo "Downloaded @mediapipe/pose@${version}/${file}"
done
rm -f pose && ln -sv "pose@${version}" pose

popd > /dev/null
