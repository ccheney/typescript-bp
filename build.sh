#!/bin/sh

set -e

BASE="$(cd "$(dirname "$_")"; pwd)"
PLATFORM=$(uname | tr '[A-Z]' '[a-z]')
ARCH=$(getconf LONG_BIT)
NODE_DIR="$BASE/tools/node/$PLATFORM-x$ARCH"

if [ -e "$NODE_DIR" ]; then
    # If a standalone node installation exists, use that
    
    NODE="$NODE_DIR/bin/node"
    chmod 770 "$NODE"

    printf ':: Standalone node installation found! (%s)\n' "$($NODE -v)"
    printf ':: Location: %s\n' "$NODE"
    printf ':: Installing dependencies...\n'
    "$NODE_DIR/bin/npm" install
    "$NODE" "$NODE_DIR/bin/bower" install

    printf ':: Performing Grunt build...\n'
    "$NODE" "$NODE_DIR/bin/grunt" $@
else
    # Otherwise, assume local install is available
    NODE="node"
    
    printf ':: Node installation found! (%s)\n' "$(node -v)"
    printf ':: Installing dependencies...\n'
    npm install
    bower install

    printf ':: Performing Grunt build...\n'
    grunt $@
fi

# Check the installed version of node with the latest version
# If installed node is not up-to-date, echo a message
check_node_version()
{
    LATEST_VERSION=$(curl -L -s http://nodejs.org/dist/latest/ \
                            | grep -E -o -s 'v[0-9]+\.[0-9]+\.[0-9]+' \
                            | tail -n 1)

    if [ "$1" != $LATEST_VERSION ]; then
        printf ':: WARNING: You are using an outdated version of Node. The latest version is %s\n' "$LATEST_VERSION"
        printf ':: If the build is failing, please update node to the latest version\n'
    fi
}

check_node_version "$($NODE -v)"

printf 'DONE'
