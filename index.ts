// Leé archivos Excel (.xlsx) y convierte los datos en JS
import xlsx, { WorkSheet } from "xlsx"
import fs from "fs"

// Leer el archivo Excel Y workbook aparenta tod el excel completo
const workbook = xlsx.readFile("public/snies_programas.xlsx")
// Obtener la primera hoja del workbook
/**
 * @type {workbook.SheetNames} lista de nombre de la hojas
 * @type { [0] } inicia desde la primera hoja
 * @type {workbook.Sheets} obtie ne las hojas del excel
 */
const sheet = workbook.Sheets[workbook.SheetNames[0]]

// Convertir la tabla del excel en un arreglo de objetos - Cada fila del Excel → un objeto JS
const data = xlsx.utils.sheet_to_json(sheet)
// Mapea o crea para para agrupar las universidades con sus programas
/**
 * Map permite evitar duplicados
* La clave será el código de la universidad
* Cada universidad se guarda una sola vez
* ------------------------------
*  codigo_universidad → { universidad + programas[] }
* ------------------------------
 */
const universidadesMap = new Map()
// Recorrer cada fila del excel
data.forEach((row: any) => {
  // extreaer el código unico de la universidad -> si no existe se salta la fila
  const codigoUni = row["CÓDIGO_INSTITUCIÓN"]
  if (!codigoUni) return
// crear la universidad si en dado caso no existe en el map
  if (!universidadesMap.has(codigoUni)) {
    universidadesMap.set(codigoUni, {
      codigo: codigoUni,
      nombre: row["NOMBRE_INSTITUCIÓN"],
      programas: []
    })
  }
// agregar el programa a la universidad correspondiente
/*
* Busca la universidad en el Map
* Agrega el programa dentro del array programas
*/
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

// Ahora convierte el mapeo en un arreglo (array)
const resultado = Array.from(universidadesMap.values())
// Gauardar el "resultado" en un archivo JSON
/**
 * @param {string} universidades_con_programas.json nombre del archivo
 * @param {string} JSON.stringify(resultado, null, 2) convierte el resultado a JSON con indentación de 2 espacios
 * @param {string} "utf-8" codificación del archivo
 */
fs.writeFileSync(
  "universidades_con_programas.json",
  JSON.stringify(resultado, null, 2),
  "utf-8"
)

console.log("🎓 Universidades con programas exportadas ⚗️")

