#!/usr/bin/env bash
set -euo pipefail
# Clear proxy variables that can cause 403 from MITM proxies
unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy npm_config_http_proxy npm_config_https_proxy
# Force npm to talk directly to the public registry
npm config set proxy "" >/dev/null
npm config set https-proxy "" >/dev/null
npm config set registry "https://registry.npmjs.org/" >/dev/null
npm install "$@"
