/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
const fs = require("fs");

const { google } = require("googleapis");

const credentials = require("./credentials.json");

const SPREADSHEET_ID = "10J-lXXZ7a18jYjOwMdW_LuBjTgVZ-06k3ikcL92yTUc";

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */

function authorize(credentials) {
  const { client_email, private_key } = credentials;
  const authorize = new google.auth.JWT(client_email, null, private_key, [
    "https://www.googleapis.com/auth/spreadsheets",
  ]);
  return authorize;
}
// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get
/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function listMajors(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const data = await getSheet(sheets, "front");

  await save(data.ko, "ko");
  await save(data.en, "en");
  await save(data.vi, "vi");
  await save(data.ms, "ms");
  await save(data.id, "id");
  await save(data.th, "th");
  await save(data.es, "es");
  await save(data.de, "de");
  await save(data.pt, "pt");
  await save(data.ja, "ja");
  await save(data.cn, "cn");
  await save(data.ru, "ru");
  await save(data.dev, "dev");

  await save(data.tr, "tr");
  await save(data.fr, "fr");
  await save(data.it, "it");
  await save(data.ar, "ar");
  await save(data.hu, "hu");
  await save(data.gr, "gr");
  await save(data.pl, "pl");

  await save(data.dev, "dev");
}
const save = async (obj, type) => {
  const jsonStr = JSON.stringify(obj, null, 2);
  fs.writeFile(
    `${__dirname}/../dictionaries/${type}.json`,
    `${jsonStr}`,
    { flag: "w+" },
    err => {
      if (err) {
        console.error(err);
      } else {
        console.log(`save ${type}`);
      }
    },
  );
};

// authorize(credentials, listMajors);
const getSheet = (sheets, sheetName) =>
  new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!B2:U`,
      },
      (err, res) => {
        if (err) reject(err);
        const rows = res.data.values;

        if (rows.length) {
          const obj = {
            ko: {},
            en: {},
            vi: {},
            ms: {},
            id: {},
            th: {},
            es: {},
            de: {},
            pt: {},
            ja: {},
            cn: {},
            ru: {},

            tr: {},
            fr: {},
            it: {},
            ar: {},
            hu: {},
            gr: {},
            pl: {},

            dev: {},
          };

          rows.forEach(row => {
            const key = row[0];
            const koValue = row[1];
            const enValue = row[2];
            const viValue = row[3];
            const msValue = row[4];
            const idValue = row[5];
            const thValue = row[6];
            const esValue = row[7];
            const deValue = row[8];
            const ptValue = row[9];
            const jaValue = row[10];
            const cnValue = row[11];
            const ruValue = row[12];

            const trValue = row[13];
            const frValue = row[14];
            const itValue = row[15];
            const arValue = row[16];
            const huValue = row[17];
            const grValue = row[18];
            const plValue = row[19];

            obj.ko[key] = koValue || enValue;
            obj.en[key] = enValue || koValue;
            obj.vi[key] = viValue || enValue;
            obj.ms[key] = msValue || enValue;
            obj.id[key] = idValue || enValue;
            obj.th[key] = thValue || enValue;
            obj.es[key] = esValue || enValue;
            obj.de[key] = deValue || enValue;
            obj.pt[key] = ptValue || enValue;
            obj.ja[key] = jaValue || enValue;
            obj.cn[key] = cnValue || enValue;
            obj.ru[key] = ruValue || enValue;

            obj.tr[key] = trValue || enValue;
            obj.fr[key] = frValue || enValue;
            obj.it[key] = itValue || enValue;
            obj.ar[key] = arValue || enValue;
            obj.hu[key] = huValue || enValue;
            obj.gr[key] = grValue || enValue;
            obj.pl[key] = plValue || enValue;

            obj.dev[key] = key;
          });
          resolve(obj);
        } else {
          reject(new Error("No data found."));
        }
      },
    );
  });
(() => {
  const auth = authorize(credentials);
  // getSheet();
  listMajors(auth);
})();
