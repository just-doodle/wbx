#!/usr/bin/env node
import { Command } from "commander";
import { addLibrary } from "./utils/add.js";

const program = new Command();

program
	.name("wbx")
	.description("CLI to add cdn to html files")
	.version("1.0.0");

program
	.command("add")
	.description("Add CDN to html files with this command")
	.argument("<library>", "The library/cdn you want to add")
	.argument("[filename]", "The file in which you have to add CDN")
	.option("-a, --allfiles", "Display all files in the package")
	.option("-v, --version <version>", "Version of the library you want to add")
	.action((library, filename, options) => {
		var addObj;

		var allfiles = options.allfiles ? true : false;
		var version = options.version ? options.version : undefined;
		var filename = filename ? filename : undefined;

		var addObj = {
			allfiles,
			name: library,
			version,
			filename,
		};

		addLibrary.init(addObj);
	});

program.parse();
