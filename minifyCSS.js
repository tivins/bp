import CleanCSS from "clean-css";
import {writeFile} from "fs/promises";

const output = new CleanCSS({
    batch: true,
}).minify([
    'theme/main.css',
]);

await writeFile("dist/theme.css", output['theme/main.css'].styles);