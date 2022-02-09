import axios from "axios";
axios.defaults.headers.common["CLIENT_IP"] = "74.82.60.20";
class Package {
	constructor(name, version) {
		this.name = name;
		this.version = version ?? false;
		var gthis = this;

		if (!version) {
			var pv = new PackageVersion(this.name);
			pv.getVersionList(function (versions) {
				gthis.version = versions.latest;
			});
		}
	}
	getPackage(callback) {}
	validateVersion(version, callback) {
		var pv = new PackageVersion(this.name);
		pv.getVersionList(function (obj) {
			if (obj.names.includes(version)) {
				callback(true);
			} else {
				callback(false);
			}
		});
	}
	getFiles(callback, allfiles = false) {
		var url = `https://api.cdnjs.com/libraries/${this.name}/${this.version}?fields=files`;
		var x = this;
		var obj = {};
		axios
			.get(url, {
				onDownloadProgress: (progressEvent) => {
					let downloadCount = DownloadCount(
						progressEvent.timeStamp,
						progressEvent.total,
						progressEvent.loaded
					);
					let percentCompleted = Math.round(
						(progressEvent.loaded * 100) / progressEvent.total
					);
					setProgressing(percentCompleted);
					dispatch({
						type: "downloading",
						payload: downloadCount.toFixed(1),
					});
				},
			})
			.then(function (response) {
				var files = [];
				var response = response.data.files;
				response.forEach(function (file) {
					files.push(file);
				});

				if (allfiles) {
					callback(files);
					return;
				}
				x._parseFiles(files, callback);
			})
			.catch(function (error) {
				obj = {
					exist: false,
				};
				if (typeof callback === "function") {
					callback(obj);
				}
			});
	}
	_parseFiles(files, callback) {
		var rf = files;
		function essential(file) {
			if (!file.includes("/")) {
				if (file.endsWith(".js") || file.endsWith(".css")) {
					return true;
				}
			}
		}

		rf = files.filter(essential);
		if (rf.length === 0) {
			rf = files;
		}

		callback(rf);
	}
	logThis() {
		console.log(this);
	}
}

class PackageVersion {
	constructor(name) {
		this.name = name;
	}
	getVersionList(callback) {
		var url = `https://api.cdnjs.com/libraries/${this.name}?fields=version,versions`;
		var obj = {};
		axios
			.get(url)
			.then(function (response) {
				response = response.data;

				obj = {
					latest: response.version,
					names: response.versions,
					exist: true,
				};
			})
			.catch(function (error) {
				obj.exist = false;
			})
			.then(function () {
				if (typeof callback === "function") {
					callback(obj);
				}
			});
	}
	validatePkg(callback) {
		var url = `https://api.cdnjs.com/libraries/${this.name}?fields=version`;
		var obj = {};
		axios
			.get(url)
			.then(function (response) {
				if (response.data.version) {
					obj = {
						exist: true,
						latest: response.data.version,
					};
				} else {
					obj = {
						exist: false,
					};
				}
			})
			.catch(function (error) {
				obj.exist = false;
			})
			.then(function () {
				if (typeof callback === "function") {
					callback(obj);
				}
			});
	}
}

export { Package, PackageVersion };
