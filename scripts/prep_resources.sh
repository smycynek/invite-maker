#! /bin/bash

USAGE="USAGE: ./prep_resources.sh <film1> <optional film2>"
EXAMPLE="Example: ./prep_resources.sh burbs shrunk"
SEE_ALSO="Also see 'npm run list_films'"

if [ -z "$1" ]; then
    printf "no film1 %s \n %s \n %s\n" "$USAGE" "$EXAMPLE" "$SEE_ALSO"
    exit 4
fi

rm ./public/*.jpg

cp ./filmdata/"$1".jpg ./public/"$1".jpg
if [ -n "$2" ]; then
    cp ./filmdata/"$2".jpg ./public/"$2".jpg
else
    cp ./filmdata/empty.jpg ./public/empty.jpg
fi

mkdir -p ./src/res

cp ./filmdata/"$1".json ./src/res/film1.json
if [ -n "$2" ]; then
    cp ./filmdata/"$2".json ./src/res/film2.json
else
    echo 'copy empty'
    cp ./filmdata/empty.json ./src/res/film2.json
fi

cp ./invitedata/general.json ./src/res/general.json
cp ./invitedata/date-time.json ./src/res/date-time.json

npm run update_index
npm run side_by_side