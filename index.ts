import xlsx from "xlsx"
import fs from "fs"

const workbook = xlsx.readFile("public/snies_programas.xlsx")
const sheet = workbook.Sheets[workbook.SheetNames[0]]

const data = xlsx.utils.sheet_to_json(sheet)
const universidadesMap = new Map()

data.forEach((row: any) => {
  const codigoUni = row["CÓDIGO_INSTITUCIÓN"]
  if (!codigoUni) return

  if (!universidadesMap.has(codigoUni)) {
    universidadesMap.set(codigoUni, {
      codigo: codigoUni,
      nombre: row["NOMBRE_INSTITUCIÓN"],
      programas: []
    })
  }

  universidadesMap.get(codigoUni).programas.push({
    codigoSnies: row["CÓDIGO_SNIES_DEL_PROGRAMA"],
    nombre: row["NOMBRE_DEL_PROGRAMA"],
    nivel: row["NIVEL_ACADÉMICO"],
    formacion: row["NIVEL_DE_FORMACIÓN"],
    modalidad: row["MODALIDAD"],
    departamento: row["DEPARTAMENTO_OFERTA_PROGRAMA"],
    municipio: row["MUNICIPIO_OFERTA_PROGRAMA"]
  })
})

const resultado = Array.from(universidadesMap.values())

fs.writeFileSync(
  "universidades_con_programas.json",
  JSON.stringify(resultado, null, 2),
  "utf-8"
)

console.log("🎓 Universidades con programas exportadas")

