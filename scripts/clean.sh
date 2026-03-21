
#! /bin/bash

rm -f invite.txt invite.jpg invite.zip invitation.jpg banner.jpg public/*.jpg public/preview.png 
rm -f src/res/film1.json src/res/film2.json src/res/date-time.json src/res/general.json
rm -rf invite
git checkout scripts/sitevars.sh
git checkout invitedata/general.json
git checkout invitedata/date-time.json
git checkout index.html
git checkout src/fontandcolor.css
git checkout vite.config.ts