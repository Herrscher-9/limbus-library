
export const characters = getCharacters();

async function getCharacters() {
  const sheetId = process.env.REACT_APP_SHEET_ID;
  const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
  const sheetName = process.env.REACT_APP_SHEET_SINNER;
  const query = encodeURIComponent('Select *')
  const url = `${base}&sheet=${sheetName}&tq=${query}`

  const response = await fetch(url);
  const data = await response.text();
  let parsed = JSON.parse(data.substring(47).slice(0, -2))

  let items = parsed.table.rows
      .map(({ c }) => cleanRow(c))
      .map(([code, rarity, name, identity, health, speed, defense, buff, deBuff, slash, pierce, blunt, fir_type, fir_affinity, sec_type, sec_affinity, thi_type, thi_affinity ]) => ({
        code,
        rarity,
        name,
        identity,
        status:{health, speed, defense},
        effect:{buff, deBuff},
        resistances: {slash, pierce, blunt},
        skills: [
          {type: fir_type, affinity: fir_affinity},
          {type: sec_type, affinity: sec_affinity},
          {type: thi_type, affinity: thi_affinity},
        ],
      }));

  return items
}
function cleanRow(row) {
  function replaceNull(item) {
    if (item == null) {
      return { v: '' }
    }
    return item
  }
  let data = row
      .map((item) => replaceNull(item))
      .map((item) => item.v)
  return data
}