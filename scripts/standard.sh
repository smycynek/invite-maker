#! /bin/bash

if [ ! -f ./src/res/date-time.json ]; then
  echo "Error: src/res/date-time.json not found. Please 'npm run prep_resources' to prepare the data files."
  exit 1
fi

if [ ! -f ./src/res/general.json ]; then
  echo "Error: src/res/general.json not found. Please 'npm run prep_resources' to prepare the data files."
  exit 1
fi

if [ ! -f ./src/res/film1.json ]; then
  echo "Error: src/res/film1.json not found. Please 'npm run prep_resources' to prepare the data files."
  exit 1
fi

if [ ! -f ./src/res/film2.json ]; then
  echo "Error: src/res/film2.json not found. Please 'npm run prep_resources' to prepare the data files."
  exit 1
fi  
