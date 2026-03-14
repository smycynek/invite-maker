USAGE="USAGE:./prep_resources.sh <film1> <film2> \n  Example: ./prep_resources.sh burbs shrunk \n   Also see 'bun run list_films'"

if [ -z "$1" ]; then
    echo "no film1\n" $USAGE
    exit 4
fi

if [ -z "$2" ]; then
    echo "no film2\n" $USAGE
    exit 4
fi

rm ./public/*.jpg

cp ./filmdata/$1.jpg ./public/$1.jpg
cp ./filmdata/$2.jpg ./public/$2.jpg
mkdir -p ./src/res

cp ./filmdata/$1.json ./src/res/film1.json
cp ./filmdata/$2.json ./src/res/film2.json
cp ./invitedata/general.json ./src/res/general.json
cp ./invitedata/date-time.json ./src/res/date-time.json

bun run update_index
bun run side_by_side