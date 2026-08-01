import StakeTotal from "../../shared/StakeTotal.js";
import { FormValues } from "../../util/form.js";
import StakeForm from "./StakeForm.js";

export default function StakeFormColumn(props: { values?: FormValues }) {
	return (
		<div>
			<StakeForm values={props.values} />
			<StakeTotal />
		</div>
	);
}
