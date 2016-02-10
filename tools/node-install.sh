#!/usr/bin/env sh

BASE="$(cd "$(dirname "$_")"; pwd)"
PLATFORM=$(uname | tr '[A-Z]' '[a-z]')
ARCH=$(getconf LONG_BIT)
STANDALONE_DIR="$BASE/node/$PLATFORM-x$ARCH"
NODE_DIR="$HOME/.node"
UNINSTALL=false
STANDALONE=false

for var in "$@"
do
    case $var in
        "--uninstall" | "-u")
            UNINSTALL=true
            ;;
        "--standalone" | "-s")
            STANDALONE=true
            ;;
        *)
    esac
done

log ()
{
    printf ":: $1\n"
}

install ()
{
    export N_PREFIX=$HOME/.node
    export PATH=$N_PREFIX/bin:$PATH

    log "INSTALLING NODE..."
    mkdir -p $N_PREFIX/bin
    curl -o $N_PREFIX/bin/n https://raw.githubusercontent.com/visionmedia/n/master/bin/n
    chmod +x $N_PREFIX/bin/n
    n latest

    log "INSTALLING GLOBAL DEPENDENCIES..."
    npm install --global bower
    npm install --global grunt-cli
    log 'OK'

    printf '=============================================================\n'
    printf 'YOU ARE NOT DONE YET!\n'
    printf '\n'
    printf '1. Look for a hidden file in your home directory called .profile or\n'
    printf '   .bash_profile.\n'
    printf '2. Open the .profile or .bash_profile file in an editor. Append the\n'
    printf '   following lines to the bottom:\n'
    printf '   export N_PREFIX=$HOME/.node\n'
    printf '   export PATH=$N_PREFIX/bin:$PATH\n'
    printf '3. Open a new terminal window (if you are already logged into a terminal\n'
    printf '   window, log out/close the session)\n'
    printf '4. Ensure node is working correctly by entering the following:\n'
    printf '   node --version\n'
    printf '=============================================================\n\n'
}

uninstall ()
{
    log "UNINSTALLING LOCAL NODE..."
    rm -rf "$NODE_DIR"
	log 'OK'
}

install_standalone ()
{
    # options
    VERSION=''
    while getopts "v:" opt; do
        case "$opt" in
            v) VERSION="$OPTARG";;
        esac
    done

    log "INSTALLING STANDALONE NODE..."

    # install node, if needed
    if [ ! -e "$STANDALONE_DIR" ]; then
        # determine latest version
        if [ -z "$VERSION" ]; then
            VERSION=$(curl -L -s http://nodejs.org/dist/latest/ \
                | grep -E -o -s '[0-9]+\.[0-9]+\.[0-9]+' \
                | tail -n 1)
        fi

        printf ":: INSTALLING NODE v%s TO %s...\n" $VERSION $STANDALONE_DIR
        SLUG="node-v$VERSION-$PLATFORM-x$ARCH"
        URL="http://nodejs.org/dist/v$VERSION/$SLUG.tar.gz"
        mkdir -p "$STANDALONE_DIR"
        curl -L "$URL" | tar fxz - --strip-components=1 -C "$STANDALONE_DIR"
        chmod 770 "$STANDALONE_DIR/bin/node"
        log "INSTALLING GLOBAL DEPENDENCIES..."
        "$STANDALONE_DIR/bin/npm" install --global bower
        "$STANDALONE_DIR/bin/npm" install --global grunt-cli
        printf ":: OK, STANDALONE NODE INSTALLED AT %s" $STANDALONE_DIR
    else
        printf ":: NOT INSTALLING, STANDALONE NODE ALREADY INSTALLED AT %s" $STANDALONE_DIR
    fi
}

uninstall_standalone ()
{
    log "UNINSTALLING STANDALONE NODE..."
    rm -rf "$STANDALONE_DIR"
    log 'OK'
}

# argument logic
if [ "$UNINSTALL" = false ] && [ "$STANDALONE" = false ]; then
    install
elif [ "$UNINSTALL" = true ] && [ "$STANDALONE" = false ]; then
    uninstall
elif [ "$UNINSTALL" = false ] && [ "$STANDALONE" = true ]; then
    install_standalone
elif [ "$UNINSTALL" = true ] && [ "$STANDALONE" = true ]; then
    uninstall_standalone
fi

log 'DONE'
