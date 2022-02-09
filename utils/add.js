import { Package, PackageVersion } from "../lib/cdn.js";
import inquirer from "inquirer";
import fs from "fs";
import { addFile } from "../lib/HTML.js";
import { GenerateHTML } from "./htmltocopy.js";

const addLibrary = {
	init: function (props = {}) {
		var name = props.name,
			version = props.version,
			filename = props.filename,
			allfiles = props.allfiles;

		const pv = new PackageVersion(name);
		const pkg = new Package(name, version);

		pv.validatePkg(function (obj) {
			if (!filename) {
				var inquirerConfig = {
					type: "input",
					name: "file",
					message: "Enter the filename of the library:",
				};

				addLibrary._checkDefaultFile(function (filename) {
					if (filename !== false) {
						inquirerConfig.default = filename;
					}

					inquirer
						.prompt([inquirerConfig])
						.then((answers) => {
							var file = answers.file;
							pkg.getFiles(function (files) {
								if (file) {
									addLibrary.askFiles(files, filename);
								} else {
									console.log(GenerateHTML(files));
								}
							}, allfiles);
						})
						.catch((error) => {
							if (error.isTtyError) {
								console.log(
									"Your console environment is not supported!"
								);
							} else {
								console.log(error);
							}
						});
				});
			} else {
				pkg.getFiles(function (files) {
					addLibrary.askFiles(files, filename);
				}, allfiles);
			}
		});
	},
	askFiles: function (files = [], filename) {
		var minified = [];
		var unminified = [];
		setTimeout(function () {}, 1000);

		files.forEach(function (file) {
			if (file.endsWith(".min.js") || file.endsWith(".min.css")) {
				minified.push({ name: file });
			} else {
				unminified.push({ name: file });
			}
		});

		var minifiedSeparator =
			minified.length > 0
				? `---- MINIFIED FILES (${minified.length}) ----`
				: `---- MINIFIED FILES  ----\nNo files found`;
		var unminifiedSeparator =
			unminified.length > 0
				? `---- UNMINIFIED FILES (${unminified.length}) ----`
				: `---- UNMINIFIED FILES  ----\nNo files found`;

		var inquireChoice = [
			new inquirer.Separator(minifiedSeparator),
			...minified,
			new inquirer.Separator(unminifiedSeparator),
			...unminified,
		];

		inquirer
			.prompt([
				{
					type: "checkbox",
					message: "Select files to add",
					name: "files",
					choices: inquireChoice,
					validate(answer) {
						if (answer.length < 1) {
							return "You must choose at least one File";
						}

						return true;
					},
				},
			])
			.then((answers) => {
				var files = answers.files;
				var new_files = [];
				files.forEach(function (file) {
					new_files.push("https://cdnjs.cloudflare.com/ajax/libs/" + file);
				});

				addFile(filename, new_files);
			});
	},
	_checkDefaultFile: function (callback) {
		var currentDir = process.cwd();
		fs.exists(currentDir + "/index.html", function (exists) {
			if (exists) {
				returnData("index.html");
			} else {
				fs.readdir(currentDir, (err, files) => {
					var filelist = [];
					files.forEach((file) => {
						if (file.endsWith(".html")) {
							filelist.push(file);
						}
					});
					if (filelist.length === 0) {
						returnData();
					} else {
						returnData(filelist[0]);
					}
				});
			}
		});

		function returnData(data = false) {
			if (typeof callback === "function") {
				callback(data);
				return;
			}
		}
	},
};

export { addLibrary };
