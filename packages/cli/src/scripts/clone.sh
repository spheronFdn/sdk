# !/bin/bash
git clone ${SOURCE_URL} ./${FOLDER_NAME}
cd ${FOLDER_NAME}
rm -rf .git
git init