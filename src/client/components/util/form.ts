export type FormValues = Record<string, string | string[] | undefined>;

export function formValue(value: string | string[] | undefined): string {
	return typeof value === "string" ? value : "";
}
