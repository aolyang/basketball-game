import { combine, ignores } from "@aolyang/eslint-config"
import importExport from "@aolyang/eslint-config/import-export"
import stylistic    from "@aolyang/eslint-config/stylistic"
import typescript   from "@aolyang/eslint-config/typescript"

export default combine(
    typescript(),
    stylistic(),
    importExport(),
    { ignores }
)

