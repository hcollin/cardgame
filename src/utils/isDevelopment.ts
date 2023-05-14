import process from "process";

const curUrl = window.location.href;

export default function isDev(): boolean {
	if (curUrl.includes("localhost")) return true;
	return false;
}
