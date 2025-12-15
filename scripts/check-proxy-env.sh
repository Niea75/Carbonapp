#!/usr/bin/env bash
set -euo pipefail

# Report proxy-related environment variables that often force npm through a MITM proxy.
print_env_var() {
  local name="$1"
  local value=${!name-}
  if [[ -n "${value}" ]]; then
    printf "%-25s %s\n" "${name}" "${value}"
  fi
}

echo "[env] Proxy-related variables (unset ones are hidden):"
for key in HTTP_PROXY http_proxy HTTPS_PROXY https_proxy NO_PROXY no_proxy npm_config_proxy npm_config_http_proxy npm_config_https_proxy \
           YARN_HTTP_PROXY YARN_HTTPS_PROXY ELECTRON_GET_USE_PROXY NODE_EXTRA_CA_CERTS SSL_CERT_FILE REQUESTS_CA_BUNDLE; do
  print_env_var "${key}"
done

echo
# Show npm-level proxy configuration that can override env vars
proxy_cfg=$(npm config get proxy)
https_proxy_cfg=$(npm config get https-proxy)
registry_cfg=$(npm config get registry)

echo "[npm config] proxy       : ${proxy_cfg}"
echo "[npm config] https-proxy : ${https_proxy_cfg}"
echo "[npm config] registry    : ${registry_cfg}"

if [[ -n "${NODE_EXTRA_CA_CERTS-}" ]] || [[ -n "${SSL_CERT_FILE-}" ]] || [[ -n "${REQUESTS_CA_BUNDLE-}" ]]; then
  echo
  echo "[certificates] Custom CA bundles are set; the registry may be intercepted by a corporate proxy."
fi

echo
cat <<'MSG'
If unexpected proxies appear above, try either:
1) Run ./scripts/install-without-proxy.sh to clear them for this shell and retry npm install.
2) Temporarily unset the specific variables before running npm install:
   unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy npm_config_http_proxy npm_config_https_proxy
MSG
