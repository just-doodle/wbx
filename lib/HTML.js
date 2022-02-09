// Importimg modules
import { JSDOM } from "jsdom";
import fs from "fs";
import pretty from "pretty";

// Function to add script/css to html document
function addFile(file, filesrcs = []) {
	//Reading file from path
	fs.readFile(file, "utf8", function (err, data) {
		if (!err) {
			// Creating dom instance with jsdom
			var { window } = new JSDOM(data);
			var fileExt = file.split(".").pop();
			var document = window.document;

			// Checking filetype and adding script/css to document
			filesrcs.forEach((src) => {
				var fileExt = src.split(".").pop();
				if (fileExt === "js") {
					var script = document.createElement("script");
					script.setAttribute("type", "text/javascript");
					script.setAttribute("src", src);
					document.body.appendChild(script);
				}
				if (fileExt === "css") {
					var css = document.createElement("link");
					css.setAttribute("type", "text/css");
					css.setAttribute("rel", "stylesheet");
					css.setAttribute("href", src);
					document.head.appendChild(css);
				}
			});

			// Getting DOCTYPE
			try {
				var node = document.doctype;
				var doctype =
					"<!DOCTYPE " +
					node.name +
					(node.publicId ? ' PUBLIC "' + node.publicId + '"' : "") +
					(!node.publicId && node.systemId ? " SYSTEM" : "") +
					(node.systemId ? ' "' + node.systemId + '"' : "") +
					">\n";
			} catch (error) {
				doctype = "";
			}

			// Putting doctype and html to string and prettifying
			var html = pretty(doctype + document.querySelector("html").outerHTML);

			// Writing file to the document
			fs.writeFile(file, html, function (err) {
				if (err) {
					return console.log(err);
				}
				console.log("The file was saved!");
			});
		}
	});
}

export { addFile };
