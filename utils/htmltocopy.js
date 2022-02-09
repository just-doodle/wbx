import boxen from "boxen";
import chalk from "chalk";

function GenerateHTML(files) {
	var jsfiles = [];
	var cssfiles = [];

	files.forEach((src) => {
		var fileExt = src.split(".").pop();
		src = chalk.blue(src);
		if (fileExt === "js") {
			jsfiles.push(`<script src="${src}" type="text/javascript"></script>`);
		}
		if (fileExt === "css") {
			cssfiles.push(
				`<link rel="stylesheet" href="${src}" type="text/css" />`
			);
		}
	});

	var jstext = "",
		csstext = "";

	if (jsfiles.length !== 0) {
		jstext =
			"\nAdd the following script tags to your HTML document by pasting the following at the end of body tag\n" +
			boxen(jsfiles.join("\n"), {
				padding: 1,
				title: "JS Files",
			});
	}
	if (cssfiles.length !== 0) {
		csstext =
			"\n\nAdd CSS files to the document by adding the following to the head tag\n" +
			boxen(cssfiles.join("\n"), {
				padding: 1,
				title: "CSS Files",
			});
	}

	return jstext + csstext;
}

export { GenerateHTML };
