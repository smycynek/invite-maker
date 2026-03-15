#! /bin/bash

VARS=./scripts/sitevars.sh # user-supplied vars for SITE, APP, and FOLDER

USAGE="./deploy.sh <key1> <key2>"
EXAMPLE="./deploy.sh wargames leap"
SEE_ALSO="also see 'bun run list_films'"

if [ ! -f "$VARS" ]; then
   echo "You must supply app environment variables in $VARS to deploy"
   exit 2
fi

source "$VARS"

if [ -z "$SITE" ]; then
    echo "no SITE"
    exit 4
fi
if [ -z "$APP" ]; then
    echo "no APP"
    exit 4
fi
if [ -z "$FOLDER" ]; then
    echo "no FOLDER"
    exit 4
fi


if [ -z "$1" ]; then
    printf "no film 1 key specified \n %s \n %s \n %s\n" "$USAGE" "$EXAMPLE" "$SEE_ALSO"
    exit 4
fi

if [ -z "$2" ]; then
    printf "no film 2 key specified \n %s \n %s \n %s\n" "$USAGE" "$EXAMPLE" "$SEE_ALSO"
    exit 4
fi




tools=("zip" "scp" "ssh" "npm" "npx" "sed")

for tool in "${tools[@]}"; do
    if ! which "$tool" >/dev/null; then
        echo "$tool" not found
        exit 3
    fi
done

./scripts/prep_resources.sh "$1" "$2"

rm -rf dist # Remove old build
rm -rf "$APP"
rm "$APP.zip"

bun run build

# rename output folder
mv dist "$APP"



# compress output
zip -vr "$APP".zip "$APP"

# copy zip to site
scp "$APP".zip "$SITE":public_html

# unzip zip at site, exit
export SHELL_COMMAND="cd public_html; rm -rf $APP;  unzip $APP.zip; rm $APP.zip; exit; bash"
echo "$SHELL_COMMAND"
ssh -t "$SITE" "$SHELL_COMMAND"
cd ../..

