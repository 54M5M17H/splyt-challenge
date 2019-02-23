// add typescript support for the padStart String method

interface String {
	padStart(targetLength: number, padding: string): string;
}